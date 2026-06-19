# 📣 E-Report — Sistem Pelaporan Pengaduan Layanan Masyarakat

> Proyek UAS Mata Kuliah Pemrograman Web 2 — Desoupled Architecture dengan CodeIgniter 4 (Backend API) & VueJS 3 (Frontend SPA)

---

## 📌 Deskripsi Proyek

**E-Report** adalah aplikasi web sistem pengaduan masyarakat berbasis *Single Page Application (SPA)* yang memungkinkan warga untuk melaporkan berbagai permasalahan layanan publik seperti infrastruktur, keamanan, kebersihan, dan pelayanan pemerintahan. Aplikasi ini menggunakan arsitektur *decoupled* (terpisah antara backend dan frontend).

---

## 🗄️ Skema Relasi Database

```
┌─────────────┐       ┌──────────────────┐       ┌───────────────┐
│    users    │       │     laporan      │       │ kategori_aduan│
│─────────────│       │──────────────────│       │───────────────│
│ id (PK)     │       │ id (PK)          │  ┌───>│ id (PK)       │
│ nama        │       │ kode_laporan     │  │    │ nama_kategori │
│ email       │       │ pelapor_id  (FK)─┼──┼──┐ │ deskripsi     │
│ password    │       │ kategori_id (FK)─┼──┘  │ └───────────────┘
│ role        │       │ judul_laporan    │      │
│ token       │       │ isi_laporan      │      │ ┌───────────────┐
└─────────────┘       │ lokasi           │      │ │    pelapor    │
                      │ foto_bukti       │      │ │───────────────│
                      │ status           │      └>│ id (PK)       │
                      │ tanggal_laporan  │        │ nama_pelapor  │
                      │ catatan_petugas  │        │ nik           │
                      └──────────────────┘        │ no_telepon    │
                                                  │ alamat        │
                                                  └───────────────┘
```

> **Screenshot skema database** dari phpMyAdmin tersedia di folder `/docs/screenshots/`

---

## 📸 Screenshot Aplikasi

| Halaman | Keterangan |
|---------|-----------|
| `/docs/screenshots/login.png` | Halaman Login Admin |
| `/docs/screenshots/dashboard.png` | Dashboard Admin + Statistik |
| `/docs/screenshots/laporan.png` | Tabel Laporan Pengaduan |
| `/docs/screenshots/modal-tambah.png` | Form Modal Tambah/Edit |
| `/docs/screenshots/401-postman.png` | Uji coba API Error 401 (token tidak valid) |

---

## 🛠️ Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| Backend | PHP CodeIgniter 4 — RESTful API Server |
| Frontend | VueJS 3 (CDN) + Vue Router 4 |
| UI Framework | TailwindCSS (CDN) |
| HTTP Client | Axios (CDN) dengan Interceptors |
| Database | MySQL / MariaDB |
| Auth | Bearer Token (disimpan di localStorage) |

---

## ⚙️ Cara Menjalankan Proyek

### Backend (CodeIgniter 4)

```bash
# 1. Masuk ke folder backend
cd backend-api

# 2. Install dependensi via Composer
composer install

# 3. Salin .env dan sesuaikan konfigurasi database
cp .env.example .env
# Edit .env: isi database.default.hostname, database, username, password

# 4. Import database
# Buka phpMyAdmin → buat database "db_ereport" → import file database.sql

# 5. Jalankan server CI4
php spark serve
# Server berjalan di: http://localhost:8080
```

### Frontend (VueJS SPA)

```bash
# Frontend tidak memerlukan build tool — cukup buka dengan web server lokal

# Opsi 1: Menggunakan PHP built-in server
cd frontend-spa
php -S localhost:3000

# Opsi 2: Menggunakan Live Server (VS Code extension)
# Klik kanan index.html → Open with Live Server

# Opsi 3: Menggunakan Python
cd frontend-spa
python -m http.server 3000
```

> ⚠️ **Penting:** Jangan buka `index.html` langsung via `file://` karena Vue Router tidak akan bekerja. Selalu gunakan web server lokal.

---

## 🔐 Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ereport.id | password |
| Petugas | petugas@ereport.id | password |

---

## 📡 Daftar Endpoint API

### Auth (Publik)
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login & dapatkan token |
| POST | `/api/auth/logout` | Hapus token (perlu Bearer Token) |

### Laporan (GET publik, POST/PUT/DELETE butuh token)
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/laporan` | Ambil semua laporan |
| GET | `/api/laporan/{id}` | Detail laporan |
| POST | `/api/laporan/create` | 🔒 Tambah laporan |
| PUT | `/api/laporan/update/{id}` | 🔒 Edit laporan |
| DELETE | `/api/laporan/delete/{id}` | 🔒 Hapus laporan |

### Kategori, Pelapor, Users
> Pola endpoint sama seperti Laporan di atas (ganti `laporan` dengan `kategori`, `pelapor`, atau `users`)

### Dashboard
| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| GET | `/api/dashboard/stats` | Statistik untuk landing page |

---

## 🏗️ Struktur Folder

```
UAS_Web2_NIM_Nama/
├── backend-api/                  # CodeIgniter 4
│   ├── app/
│   │   ├── Config/
│   │   │   ├── Filters.php       # CORS + Auth Filter config
│   │   │   └── Routes.php        # Semua route API
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── LaporanController.php
│   │   │   ├── KategoriController.php
│   │   │   ├── PelaporController.php
│   │   │   └── UserController.php
│   │   ├── Filters/
│   │   │   ├── AuthFilter.php    # Bearer Token validator
│   │   │   └── CorsFilter.php    # CORS handler
│   │   └── Models/
│   │       ├── UserModel.php
│   │       ├── LaporanModel.php
│   │       ├── KategoriModel.php
│   │       └── PelaporModel.php
│   └── .env
│
├── frontend-spa/                 # VueJS 3 SPA (CDN)
│   ├── index.html                # Entry point SPA
│   ├── js/
│   │   ├── api.js                # Axios instance + interceptors
│   │   ├── router.js             # Vue Router + Navigation Guard
│   │   └── app.js                # Mount Vue app
│   └── components/
│       ├── Home.js               # Landing Page (publik)
│       ├── Login.js              # Halaman Login
│       ├── Dashboard.js          # Dashboard Admin
│       ├── Laporan.js            # CRUD Laporan
│       ├── Kategori.js           # CRUD Kategori
│       └── Pelapor.js            # CRUD Pelapor
│
├── database.sql                  # Schema + seed data
└── README.md
```

---

## 🔗 Link

- **Demo:** [https://your-demo-link.com](#)
- **Video Presentasi:** [https://youtube.com/your-video-link](#)

---

## 👤 Identitas Mahasiswa

- **Nama:** Ricky Alfian Saputra
- **NIM:** 312210409
- **Mata Kuliah:** Pemrograman Web 2
- **Tema:** Sistem Pelaporan Pengaduan Layanan Masyarakat (E-Report)
