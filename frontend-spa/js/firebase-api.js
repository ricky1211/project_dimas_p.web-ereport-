// js/firebase-api.js
// Firebase Initialization & Realtime Database API Wrapper for E-Report SPA

const firebaseConfig = {
    apiKey: "AIzaSyC5-moOb16BFVwoiISR7idxH_jo9PBQXJA",
    authDomain: "ereportnew.firebaseapp.com",
    projectId: "ereportnew",
    databaseURL: "https://ereportnew-default-rtdb.firebaseio.com",
    storageBucket: "ereportnew.firebasestorage.app",
    messagingSenderId: "1067760269882",
    appId: "1:1067760269882:web:dd8be26bb6c3d0d5b2d303",
    measurementId: "G-1R2EZE3M5B"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const rtdb = firebase.database();
const auth = firebase.auth();

// Seeding Data Otomatis jika database kosong
async function seedDatabaseIfNeeded() {
    try {
        const usersSnap = await rtdb.ref('users').once('value');
        if (!usersSnap.exists() || !usersSnap.hasChildren()) {
            // Seed Admin default
            await rtdb.ref('users/admin_default').set({
                id: 'admin_default',
                nama: 'Administrator',
                email: 'admin@ereport.id',
                role: 'admin',
                created_at: new Date().toISOString()
            });
            console.log('Seeded default admin to Realtime Database');
        }

        const katSnap = await rtdb.ref('kategori').once('value');
        if (!katSnap.exists() || !katSnap.hasChildren()) {
            const defaultKategori = {
                "1": { id: "1", nama_kategori: 'Infrastruktur', deskripsi: 'Aduan terkait jalan rusak, jembatan, drainase, dan fasilitas umum' },
                "2": { id: "2", nama_kategori: 'Keamanan', deskripsi: 'Aduan terkait ketertiban, kriminalitas, dan keamanan lingkungan' },
                "3": { id: "3", nama_kategori: 'Kebersihan', deskripsi: 'Aduan terkait sampah, limbah, dan kebersihan lingkungan' },
                "4": { id: "4", nama_kategori: 'Pelayanan Publik', deskripsi: 'Aduan terkait pelayanan pemerintah dan administrasi' },
                "5": { id: "5", nama_kategori: 'Bencana Alam', deskripsi: 'Aduan terkait banjir, longsor, dan bencana alam lainnya' }
            };
            await rtdb.ref('kategori').set(defaultKategori);
            console.log('Seeded default kategori to Realtime Database');
        }
    } catch (e) {
        console.warn('Realtime Database seeding skipped:', e.message);
    }
}

// Jalankan seeding data
seedDatabaseIfNeeded();

// Helper untuk generate kode laporan unik format RPT-YYYYMMDD-XXXX
async function generateKodeLaporan() {
    const today = new Date();
    const dateStr = today.getFullYear() +
        String(today.getMonth() + 1).padStart(2, '0') +
        String(today.getDate()).padStart(2, '0');
    const prefix = `RPT-${dateStr}-`;

    const snap = await rtdb.ref('laporan').once('value');
    let maxNum = 0;

    if (snap.exists()) {
        snap.forEach(child => {
            const code = child.val().kode_laporan;
            if (code && code.startsWith(prefix)) {
                const parts = code.split('-');
                const numPart = parseInt(parts[parts.length - 1]) || 0;
                if (numPart > maxNum) maxNum = numPart;
            }
        });
    }

    const nextNum = maxNum + 1;
    return prefix + String(nextNum).padStart(4, '0');
}

// ── CUSTOM API WRAPPER ──────────────────────────────────────────────
// Menyamakan format return dengan Axios response { data: { status: 200, data: [...] } }
const api = {
    async get(url, config = {}) {
        const path = url.split('?')[0];

        // 1. Dashboard Stats
        if (path === '/dashboard/stats') {
            const reportsSnap = await rtdb.ref('laporan').once('value');
            const usersSnap = await rtdb.ref('users').once('value');

            let stats = { total_laporan: 0, baru: 0, diproses: 0, selesai: 0, ditolak: 0, total_petugas: 0 };

            if (usersSnap.exists()) {
                usersSnap.forEach(child => {
                    if (child.val().role === 'petugas') stats.total_petugas++;
                });
            }

            if (reportsSnap.exists()) {
                reportsSnap.forEach(child => {
                    const r = child.val();
                    stats.total_laporan++;
                    if (r.status === 'baru') stats.baru++;
                    else if (r.status === 'diproses') stats.diproses++;
                    else if (r.status === 'selesai') stats.selesai++;
                    else if (r.status === 'ditolak') stats.ditolak++;
                });
            }

            return { data: { status: 200, data: stats } };
        }

        // 2. Kategori List
        if (path === '/kategori') {
            const snap = await rtdb.ref('kategori').once('value');
            const data = [];
            if (snap.exists()) {
                snap.forEach(child => {
                    data.push({ id: child.key, ...child.val() });
                });
            }
            return { data: { status: 200, data } };
        }

        // 3. Pelapor List
        if (path === '/pelapor') {
            const snap = await rtdb.ref('pelapor').once('value');
            const data = [];
            if (snap.exists()) {
                snap.forEach(child => {
                    data.push({ id: child.key, ...child.val() });
                });
            }
            return { data: { status: 200, data } };
        }

        // 4. Petugas (Users) List
        if (path === '/users') {
            const snap = await rtdb.ref('users').once('value');
            const data = [];
            if (snap.exists()) {
                snap.forEach(child => {
                    data.push({ id: child.key, ...child.val() });
                });
            }
            return { data: { status: 200, data } };
        }

        // 5. Laporan List (With relations joined client-side)
        if (path === '/laporan') {
            const reportsSnap = await rtdb.ref('laporan').once('value');
            const katSnap = await rtdb.ref('kategori').once('value');
            const pelSnap = await rtdb.ref('pelapor').once('value');
            const userSnap = await rtdb.ref('users').once('value');

            const kategoriMap = {};
            if (katSnap.exists()) {
                katSnap.forEach(child => { kategoriMap[child.key] = child.val().nama_kategori; });
            }

            const pelaporMap = {};
            if (pelSnap.exists()) {
                pelSnap.forEach(child => { pelaporMap[child.key] = child.val(); });
            }

            const userMap = {};
            if (userSnap.exists()) {
                userSnap.forEach(child => { userMap[child.key] = child.val().nama; });
            }

            const data = [];
            if (reportsSnap.exists()) {
                reportsSnap.forEach(child => {
                    const r = child.val();
                    const pel = pelaporMap[r.pelapor_id] || {};
                    data.push({
                        id: child.key,
                        ...r,
                        nama_kategori: kategoriMap[r.kategori_id] || 'Umum',
                        nama_pelapor: pel.nama_pelapor || 'Warga',
                        nik: pel.nik || '',
                        no_telepon: pel.no_telepon || '',
                        alamat: pel.alamat || '',
                        nama_petugas: userMap[r.petugas_id] || 'Belum Ditugaskan'
                    });
                });
            }

            return { data: { status: 200, data } };
        }

        throw new Error(`Endpoint GET ${url} tidak dikenali di Firebase API.`);
    },

    async post(url, payload = {}, config = {}) {
        const path = url.split('?')[0];

        // 1. Auth Login
        if (path === '/auth/login') {
            const { email, password } = payload;
            const usersSnap = await rtdb.ref('users').once('value');
            let foundUser = null;
            let foundKey = null;

            if (usersSnap.exists()) {
                usersSnap.forEach(child => {
                    if (child.val().email === email) {
                        foundUser = child.val();
                        foundKey = child.key;
                    }
                });
            }

            if (!foundUser) {
                throw { response: { data: { message: 'Email tidak terdaftar.' } } };
            }

            // Integrasi Firebase Auth
            try {
                const userCred = await auth.signInWithEmailAndPassword(email, password);
                const fbUser = userCred.user;
                return {
                    data: {
                        status: 200,
                        message: 'Login Berhasil',
                        data: { token: 'fb_token_' + fbUser.uid, id: fbUser.uid, nama: foundUser.nama, email: fbUser.email, role: foundUser.role }
                    }
                };
            } catch (err) {
                if (err.code === 'auth/user-not-found') {
                    // Daftarkan otomatis di Auth jika user sudah ada di database tetapi belum di Firebase Auth
                    try {
                        const userCred = await auth.createUserWithEmailAndPassword(email, password);
                        const fbUser = userCred.user;
                        // Pindahkan ID di Realtime Database ke UID Firebase Auth
                        await rtdb.ref(`users/${fbUser.uid}`).set({ ...foundUser, id: fbUser.uid });
                        if (foundKey !== fbUser.uid) {
                            await rtdb.ref(`users/${foundKey}`).remove();
                        }
                        return {
                            data: {
                                status: 200,
                                message: 'Login Berhasil (Autoregistered)',
                                data: { token: 'fb_token_' + fbUser.uid, id: fbUser.uid, nama: foundUser.nama, email: fbUser.email, role: foundUser.role }
                            }
                        };
                    } catch (regErr) {
                        throw { response: { data: { message: 'Gagal membuat kredensial: ' + regErr.message } } };
                    }
                }

                // Fallback untuk admin default
                if (email === 'admin@ereport.id' && password === 'admin123') {
                    return {
                        data: {
                            status: 200,
                            message: 'Login Berhasil (Offline/Local Admin)',
                            data: { token: 'local_admin_token', id: 'admin_default', nama: foundUser.nama, email: foundUser.email, role: 'admin' }
                        }
                    };
                }
                throw { response: { data: { message: 'Kredensial tidak valid: ' + err.message } } };
            }
        }

        // 2. Auth Logout
        if (path === '/auth/logout') {
            try { await auth.signOut(); } catch (e) { }
            return { data: { status: 200, message: 'Logout sukses' } };
        }

        // 3. Public Create Laporan
        if (path === '/laporan/public-create') {
            const { nama_pelapor, nik, no_telepon, alamat, judul_laporan, kategori_id, lokasi, isi_laporan } = payload;

            // Cari/Buat Pelapor berdasarkan NIK
            const pelSnap = await rtdb.ref('pelapor').once('value');
            let pelaporId = null;

            if (pelSnap.exists()) {
                pelSnap.forEach(child => {
                    if (child.val().nik === nik) {
                        pelaporId = child.key;
                    }
                });
            }

            const pelaporData = { nama_pelapor, nik, no_telepon, alamat, updated_at: new Date().toISOString() };

            if (pelaporId) {
                await rtdb.ref(`pelapor/${pelaporId}`).update(pelaporData);
            } else {
                const newPelRef = rtdb.ref('pelapor').push();
                pelaporId = newPelRef.key;
                await newPelRef.set({ id: pelaporId, ...pelaporData, created_at: new Date().toISOString() });
            }

            // Buat Laporan
            const kode = await generateKodeLaporan();
            const reportRef = rtdb.ref('laporan').push();
            const reportId = reportRef.key;

            const reportData = {
                id: reportId,
                kode_laporan: kode,
                pelapor_id: pelaporId,
                kategori_id: String(kategori_id),
                petugas_id: null,
                judul_laporan,
                isi_laporan,
                lokasi,
                foto_bukti: null,
                status: 'baru',
                tanggal_laporan: new Date().toISOString().slice(0, 10),
                catatan_petugas: null,
                rating: null,
                feedback_warga: null,
                is_banding: 0,
                alasan_urgensi: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            await reportRef.set(reportData);
            return { data: { status: 201, message: 'Laporan berhasil dibuat', data: reportData } };
        }

        // 4. Create Laporan (Protected Admin)
        if (path === '/laporan/create') {
            const ref = rtdb.ref('laporan').push();
            const id = ref.key;
            const kode = await generateKodeLaporan();
            const data = {
                id,
                kode_laporan: kode,
                ...payload,
                status: payload.status || 'baru',
                tanggal_laporan: payload.tanggal_laporan || new Date().toISOString().slice(0, 10),
                created_at: new Date().toISOString()
            };
            await ref.set(data);
            return { data: { status: 201, data } };
        }

        // 5. Submit/Update Feedback
        if (path.startsWith('/laporan/feedback/')) {
            const id = path.split('/').pop();
            const ref = rtdb.ref(`laporan/${id}`);
            const doc = await ref.once('value');
            if (!doc.exists()) {
                throw { response: { data: { message: 'Laporan tidak ditemukan.' } } };
            }

            const current = doc.val();
            const updateData = {
                rating: parseInt(payload.rating),
                feedback_warga: payload.feedback_warga,
                updated_at: new Date().toISOString()
            };

            if (parseInt(payload.is_banding) === 1 && current.status === 'ditolak') {
                updateData.is_banding = 1;
                updateData.alasan_urgensi = payload.alasan_urgensi;
                updateData.status = 'baru';
            } else {
                updateData.is_banding = 0;
                updateData.alasan_urgensi = null;
            }

            await ref.update(updateData);
            return { data: { status: 200, message: 'Ulasan berhasil disimpan.', data: { ...current, ...updateData } } };
        }

        // 6. Create Kategori
        if (path === '/kategori/create') {
            const ref = rtdb.ref('kategori').push();
            const id = ref.key;
            const data = { id, ...payload, created_at: new Date().toISOString() };
            await ref.set(data);
            return { data: { status: 201, data } };
        }

        // 7. Create Pelapor
        if (path === '/pelapor/create') {
            const ref = rtdb.ref('pelapor').push();
            const id = ref.key;
            const data = { id, ...payload, created_at: new Date().toISOString() };
            await ref.set(data);
            return { data: { status: 201, data } };
        }

        // 8. Create Petugas (Users)
        if (path === '/users/create') {
            const ref = rtdb.ref('users').push();
            let id = ref.key;
            const data = { id, ...payload, created_at: new Date().toISOString() };

            // Buat user di Auth jika email & password tersedia
            if (payload.email && payload.password) {
                try {
                    const authRef = await auth.createUserWithEmailAndPassword(payload.email, payload.password);
                    id = authRef.user.uid;
                    data.id = id;
                    await rtdb.ref(`users/${id}`).set(data);
                    return { data: { status: 201, data } };
                } catch (e) {
                    console.warn('Gagal mendaftarkan user ke Firebase Auth:', e.message);
                }
            }
            await rtdb.ref(`users/${id}`).set(data);
            return { data: { status: 201, data } };
        }

        throw new Error(`Endpoint POST ${url} tidak dikenali di Firebase API.`);
    },

    async put(url, payload = {}, config = {}) {
        const path = url.split('?')[0];

        // 1. Update Laporan
        if (path.startsWith('/laporan/update/')) {
            const id = path.split('/').pop();
            const ref = rtdb.ref(`laporan/${id}`);
            await ref.update({ ...payload, updated_at: new Date().toISOString() });
            const doc = await ref.once('value');
            return { data: { status: 200, data: doc.val() } };
        }

        // 2. Update Kategori
        if (path.startsWith('/kategori/update/')) {
            const id = path.split('/').pop();
            const ref = rtdb.ref(`kategori/${id}`);
            await ref.update(payload);
            const doc = await ref.once('value');
            return { data: { status: 200, data: doc.val() } };
        }

        // 3. Update Pelapor
        if (path.startsWith('/pelapor/update/')) {
            const id = path.split('/').pop();
            const ref = rtdb.ref(`pelapor/${id}`);
            await ref.update(payload);
            const doc = await ref.once('value');
            return { data: { status: 200, data: doc.val() } };
        }

        // 4. Update Petugas (Users)
        if (path.startsWith('/users/update/')) {
            const id = path.split('/').pop();
            const ref = rtdb.ref(`users/${id}`);
            await ref.update(payload);
            const doc = await ref.once('value');
            return { data: { status: 200, data: doc.val() } };
        }

        throw new Error(`Endpoint PUT ${url} tidak dikenali di Firebase API.`);
    },

    async delete(url, config = {}) {
        const path = url.split('?')[0];

        // 1. Delete Laporan
        if (path.startsWith('/laporan/delete/')) {
            const id = path.split('/').pop();
            await rtdb.ref(`laporan/${id}`).remove();
            return { data: { status: 200, message: 'Laporan dihapus' } };
        }

        // 2. Delete Kategori
        if (path.startsWith('/kategori/delete/')) {
            const id = path.split('/').pop();
            await rtdb.ref(`kategori/${id}`).remove();
            return { data: { status: 200, message: 'Kategori dihapus' } };
        }

        // 3. Delete Pelapor
        if (path.startsWith('/pelapor/delete/')) {
            const id = path.split('/').pop();
            await rtdb.ref(`pelapor/${id}`).remove();
            return { data: { status: 200, message: 'Pelapor dihapus' } };
        }

        // 4. Delete Petugas (Users)
        if (path.startsWith('/users/delete/')) {
            const id = path.split('/').pop();
            await rtdb.ref(`users/${id}`).remove();
            return { data: { status: 200, message: 'Petugas dihapus' } };
        }

        throw new Error(`Endpoint DELETE ${url} tidak dikenali di Firebase API.`);
    },

    interceptors: {
        request: { use: () => { } },
        response: { use: () => { } }
    }
};