// components/Petugas.js
// Halaman manajemen petugas — hanya dapat diakses oleh admin

const PetugasComponent = {
    template: `
    <div class="min-h-screen bg-[#f8fafc] flex">

        <!-- SIDEBAR -->
        <aside class="w-64 bg-white min-h-screen flex flex-col fixed left-0 top-0 border-r border-slate-100 z-40">
            <div class="p-6 border-b border-slate-100">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span class="text-white font-black text-lg">E</span>
                    </div>
                    <div>
                        <p class="text-slate-800 font-bold text-sm">E-Report</p>
                        <p class="text-slate-400 text-xs">Admin Panel</p>
                    </div>
                </div>
            </div>

            <!-- User info -->
            <div class="px-4 py-4 border-b border-slate-100">
                <div class="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p class="text-slate-700 font-semibold text-sm">{{ user.nama }}</p>
                    <p class="text-slate-400 text-xs uppercase tracking-wide">{{ user.role }}</p>
                </div>
            </div>

            <!-- Nav -->
            <nav class="flex-1 p-4 space-y-1">
                <router-link to="/dashboard"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
                    active-class="bg-blue-50 text-blue-700 font-semibold">
                    <span>📊</span><span>Dashboard</span>
                </router-link>
                <router-link to="/laporan"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
                    active-class="bg-blue-50 text-blue-700 font-semibold">
                    <span>📋</span><span>Laporan Pengaduan</span>
                </router-link>
                <router-link to="/kategori"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
                    active-class="bg-blue-50 text-blue-700 font-semibold">
                    <span>🏷️</span><span>Kategori Aduan</span>
                </router-link>
                <router-link to="/pelapor"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
                    active-class="bg-blue-50 text-blue-700 font-semibold">
                    <span>👥</span><span>Data Pelapor</span>
                </router-link>
                <router-link to="/petugas"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
                    active-class="bg-blue-50 text-blue-700 font-semibold">
                    <span>👮</span><span>Manajemen Petugas</span>
                </router-link>
                <router-link to="/feedback"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
                    active-class="bg-blue-50 text-blue-700 font-semibold">
                    <span>💬</span><span>Ulasan Warga</span>
                </router-link>
            </nav>

            <!-- Logout -->
            <div class="p-4">
                <button @click="doLogout"
                    class="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl transition-colors text-sm font-semibold">
                    <span>🚪</span><span>Keluar</span>
                </button>
            </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="ml-64 flex-1 p-8">

            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-2xl font-black text-gray-800">👮 Manajemen Petugas</h1>
                    <p class="text-gray-500 text-sm mt-1">Kelola akun petugas lapangan yang dapat memproses laporan.</p>
                </div>
                <button @click="openModal()"
                    class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm text-sm transition-all">
                    <span class="text-lg leading-none">＋</span>
                    <span>Tambah Petugas</span>
                </button>
            </div>

            <!-- Alert -->
            <div v-if="alertMsg" class="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
                :class="alertType === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-600'">
                <span>{{ alertType === 'success' ? '✅' : '⚠️' }}</span>
                <span>{{ alertMsg }}</span>
            </div>

            <!-- Tabel Petugas -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 class="font-bold text-slate-800">Daftar Petugas</h2>
                    <span class="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">
                        {{ petugas.length }} petugas terdaftar
                    </span>
                </div>

                <div v-if="loading" class="p-8">
                    <div v-for="i in 3" :key="i" class="h-12 bg-slate-100 animate-pulse rounded-xl mb-3"></div>
                </div>

                <div v-else-if="petugas.length === 0" class="py-16 text-center text-slate-400">
                    <div class="text-5xl mb-3">👮</div>
                    <p class="font-semibold">Belum ada petugas terdaftar.</p>
                    <p class="text-sm mt-1">Klik tombol "Tambah Petugas" untuk mendaftarkan petugas baru.</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th class="text-left px-6 py-3">No</th>
                                <th class="text-left px-6 py-3">Nama</th>
                                <th class="text-left px-6 py-3">Email</th>
                                <th class="text-left px-6 py-3">Role</th>
                                <th class="text-left px-6 py-3">Terdaftar</th>
                                <th class="text-center px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            <tr v-for="(p, idx) in petugas" :key="p.id" class="hover:bg-slate-50 transition-colors">
                                <td class="px-6 py-4 text-slate-400 text-xs font-mono">{{ idx + 1 }}</td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                                            :class="p.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'">
                                            {{ p.nama.charAt(0).toUpperCase() }}
                                        </div>
                                        <span class="font-semibold text-slate-800">{{ p.nama }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-slate-500">{{ p.email }}</td>
                                <td class="px-6 py-4">
                                    <span class="text-xs font-bold px-3 py-1 rounded-full capitalize"
                                        :class="p.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                                        {{ p.role }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-slate-400 text-xs">{{ formatDate(p.created_at) }}</td>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <button @click="openModal(p)"
                                            class="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-200">
                                            ✏️ Edit
                                        </button>
                                        <button v-if="p.id !== user.id" @click="confirmDelete(p)"
                                            class="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-200">
                                            🗑️ Hapus
                                        </button>
                                        <span v-else class="text-xs text-slate-300 px-3 py-1.5">Akun Aktif</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <!-- ── MODAL TAMBAH / EDIT PETUGAS ──────────────────────── -->
        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            @click.self="closeModal()">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 animate-scale-in">

                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-xl font-black text-slate-800">
                            {{ editMode ? '✏️ Edit Petugas' : '➕ Tambah Petugas Baru' }}
                        </h3>
                        <p class="text-slate-400 text-xs mt-0.5">
                            {{ editMode ? 'Perbarui data akun petugas.' : 'Isi data untuk membuat akun petugas baru.' }}
                        </p>
                    </div>
                    <button @click="closeModal()" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
                </div>

                <!-- Form error -->
                <div v-if="formError" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm flex items-start gap-2">
                    <span>⚠️</span><span>{{ formError }}</span>
                </div>

                <form @submit.prevent="submitForm" class="space-y-4">
                    <!-- Nama -->
                    <div>
                        <label class="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Nama Lengkap *</label>
                        <input v-model="form.nama" type="text" required placeholder="Contoh: Andi Wijaya"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" />
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Email *</label>
                        <input v-model="form.email" type="email" required placeholder="petugas@ereport.id"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" />
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1.5">
                            {{ editMode ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password *' }}
                        </label>
                        <div class="relative">
                            <input v-model="form.password" :type="showPass ? 'text' : 'password'"
                                :required="!editMode" placeholder="Min. 6 karakter"
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all pr-12" />
                            <button type="button" @click="showPass = !showPass"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg">
                                {{ showPass ? '🙈' : '👁️' }}
                            </button>
                        </div>
                    </div>

                    <!-- Role -->
                    <div>
                        <label class="block text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Role *</label>
                        <select v-model="form.role" required
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all">
                            <option value="petugas">Petugas</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <!-- Tombol -->
                    <div class="flex gap-3 pt-2">
                        <button type="button" @click="closeModal()"
                            class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-xl text-sm transition-all">
                            Batal
                        </button>
                        <button type="submit" :disabled="submitting"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2">
                            <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            <span>{{ submitting ? 'Menyimpan...' : (editMode ? 'Simpan Perubahan' : 'Tambah Petugas') }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ── MODAL KONFIRMASI HAPUS ────────────────────────────── -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            @click.self="showDeleteModal = false">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-8 text-center">
                <div class="text-5xl mb-4">🗑️</div>
                <h3 class="text-xl font-black text-slate-800 mb-2">Hapus Petugas?</h3>
                <p class="text-slate-500 text-sm mb-6">
                    Anda akan menghapus akun <strong class="text-slate-800">{{ deleteTarget?.nama }}</strong>.
                    Tindakan ini tidak dapat dibatalkan.
                </p>
                <div class="flex gap-3">
                    <button @click="showDeleteModal = false"
                        class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-xl text-sm">
                        Batal
                    </button>
                    <button @click="doDelete" :disabled="submitting"
                        class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-3 rounded-xl text-sm shadow-sm">
                        {{ submitting ? 'Menghapus...' : 'Ya, Hapus' }}
                    </button>
                </div>
            </div>
        </div>

    </div>
    `,

    data() {
        return {
            user:            JSON.parse(localStorage.getItem('auth_user') || '{}'),
            petugas:         [],
            loading:         true,
            submitting:      false,
            alertMsg:        '',
            alertType:       'success',
            // Modal form
            showModal:       false,
            editMode:        false,
            editId:          null,
            showPass:        false,
            form: { nama: '', email: '', password: '', role: 'petugas' },
            formError:       '',
            // Modal hapus
            showDeleteModal: false,
            deleteTarget:    null,
        };
    },

    async mounted() {
        // Guard: hanya admin yang boleh akses halaman ini
        if (this.user.role !== 'admin') {
            this.$router.push('/dashboard');
            return;
        }
        await this.fetchPetugas();
    },

    methods: {
        // ── DATA ──────────────────────────────────────────────────
        async fetchPetugas() {
            this.loading = true;
            try {
                const res = await api.get('/users');
                this.petugas = res.data.data || [];
            } catch (e) {
                this.showAlert('Gagal memuat data petugas.', 'error');
            } finally {
                this.loading = false;
            }
        },

        // ── MODAL FORM ────────────────────────────────────────────
        openModal(item = null) {
            this.formError = '';
            this.showPass  = false;
            if (item) {
                // Edit mode
                this.editMode = true;
                this.editId   = item.id;
                this.form     = { nama: item.nama, email: item.email, password: '', role: item.role };
            } else {
                // Tambah mode
                this.editMode = false;
                this.editId   = null;
                this.form     = { nama: '', email: '', password: '', role: 'petugas' };
            }
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
        },

        async submitForm() {
            this.formError = '';

            if (!this.editMode && this.form.password.length < 6) {
                this.formError = 'Password minimal 6 karakter.';
                return;
            }
            if (this.editMode && this.form.password && this.form.password.length < 6) {
                this.formError = 'Password baru minimal 6 karakter.';
                return;
            }

            this.submitting = true;
            try {
                if (this.editMode) {
                    const payload = { nama: this.form.nama, email: this.form.email, role: this.form.role };
                    if (this.form.password) payload.password = this.form.password;
                    await api.put(`/users/update/${this.editId}`, payload);
                    this.showAlert(`Akun "${this.form.nama}" berhasil diperbarui.`, 'success');
                } else {
                    await api.post('/users/create', this.form);
                    this.showAlert(`Petugas "${this.form.nama}" berhasil ditambahkan.`, 'success');
                }
                this.closeModal();
                await this.fetchPetugas();
            } catch (e) {
                const msg = e.response?.data?.message;
                this.formError = typeof msg === 'object'
                    ? Object.values(msg).join(' ')
                    : (msg || 'Gagal menyimpan data.');
            } finally {
                this.submitting = false;
            }
        },

        // ── HAPUS ─────────────────────────────────────────────────
        confirmDelete(item) {
            this.deleteTarget    = item;
            this.showDeleteModal = true;
        },

        async doDelete() {
            if (!this.deleteTarget) return;
            this.submitting = true;
            try {
                await api.delete(`/users/delete/${this.deleteTarget.id}`);
                this.showAlert(`Akun "${this.deleteTarget.nama}" berhasil dihapus.`, 'success');
                this.showDeleteModal = false;
                this.deleteTarget    = null;
                await this.fetchPetugas();
            } catch (e) {
                this.showAlert('Gagal menghapus petugas.', 'error');
            } finally {
                this.submitting = false;
            }
        },

        // ── HELPERS ───────────────────────────────────────────────
        showAlert(msg, type = 'success') {
            this.alertMsg  = msg;
            this.alertType = type;
            setTimeout(() => { this.alertMsg = ''; }, 4000);
        },

        formatDate(dt) {
            if (!dt) return '—';
            return new Date(dt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        },

        async doLogout() {
            try { await api.post('/auth/logout'); } catch (e) {}
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            this.$router.push('/login');
        },
    }
};
