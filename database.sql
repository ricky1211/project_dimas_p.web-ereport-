-- ============================================
-- DATABASE: E-Report - Sistem Pengaduan Masyarakat
-- ============================================

CREATE DATABASE IF NOT EXISTS db_ereport CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_ereport;

-- Tabel 1: users (admin/petugas)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'petugas') DEFAULT 'petugas',
    token VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel 2: kategori_aduan
CREATE TABLE kategori_aduan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    deskripsi TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel 3: pelapor
CREATE TABLE pelapor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pelapor VARCHAR(100) NOT NULL,
    nik VARCHAR(16) NOT NULL UNIQUE,
    no_telepon VARCHAR(20) NOT NULL,
    alamat TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel 4: laporan (tabel utama - relasi ke kategori & pelapor)
CREATE TABLE laporan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_laporan VARCHAR(20) NOT NULL UNIQUE,
    pelapor_id INT NOT NULL,
    kategori_id INT NOT NULL,
    petugas_id INT NULL,
    judul_laporan VARCHAR(200) NOT NULL,
    isi_laporan TEXT NOT NULL,
    lokasi VARCHAR(255) NOT NULL,
    foto_bukti VARCHAR(255) NULL,
    status ENUM('baru','diproses','selesai','ditolak') DEFAULT 'baru',
    tanggal_laporan DATE NOT NULL,
    catatan_petugas TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pelapor_id) REFERENCES pelapor(id) ON DELETE CASCADE,
    FOREIGN KEY (kategori_id) REFERENCES kategori_aduan(id) ON DELETE CASCADE,
    FOREIGN KEY (petugas_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- DATA AWAL (Seed Data)
-- ============================================

-- Admin default (password: admin123)
INSERT INTO users (nama, email, password, role) VALUES
('Administrator', 'admin@ereport.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Petugas Satu', 'petugas@ereport.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'petugas');

-- Kategori aduan
INSERT INTO kategori_aduan (nama_kategori, deskripsi) VALUES
('Infrastruktur', 'Aduan terkait jalan rusak, jembatan, drainase, dan fasilitas umum'),
('Keamanan', 'Aduan terkait ketertiban, kriminalitas, dan keamanan lingkungan'),
('Kebersihan', 'Aduan terkait sampah, limbah, dan kebersihan lingkungan'),
('Pelayanan Publik', 'Aduan terkait pelayanan pemerintah dan administrasi'),
('Bencana Alam', 'Aduan terkait banjir, longsor, dan bencana alam lainnya');

-- Data pelapor contoh
INSERT INTO pelapor (nama_pelapor, nik, no_telepon, alamat) VALUES
('Budi Santoso', '3201234567890001', '081234567890', 'Jl. Merdeka No. 10, RT 03/RW 05, Bogor'),
('Siti Rahayu', '3201234567890002', '082345678901', 'Jl. Sudirman No. 25, Bogor Tengah'),
('Ahmad Fauzi', '3201234567890003', '083456789012', 'Perumahan Griya Asri Blok C No. 7, Bogor');

-- Laporan contoh
INSERT INTO laporan (kode_laporan, pelapor_id, kategori_id, judul_laporan, isi_laporan, lokasi, status, tanggal_laporan) VALUES
('RPT-2024-001', 1, 1, 'Jalan Berlubang di Jl. Ahmad Yani', 'Terdapat lubang besar di tengah jalan yang sangat membahayakan pengendara, terutama di malam hari karena tidak ada penerangan.', 'Jl. Ahmad Yani KM 3, Bogor', 'diproses', '2024-01-15'),
('RPT-2024-002', 2, 3, 'Tumpukan Sampah Tidak Diangkut', 'Sampah di TPS Jl. Pajajaran sudah menumpuk lebih dari 5 hari dan menimbulkan bau tidak sedap serta mengundang lalat.', 'TPS Jl. Pajajaran, Bogor', 'baru', '2024-01-20'),
('RPT-2024-003', 3, 2, 'Pencurian Motor di Parkiran', 'Telah terjadi pencurian sepeda motor di area parkiran pasar pada tanggal 19 Januari 2024 pukul 14.00 WIB.', 'Parkiran Pasar Bogor, Jl. Dewi Sartika', 'selesai', '2024-01-20');
