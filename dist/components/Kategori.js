// components/Kategori.js
const KategoriComponent = {
    template: `
    <div class="min-h-screen bg-[#f8fafc] flex">

        <!-- SIDEBAR -->
        <aside class="w-64 bg-white min-h-screen flex flex-col fixed left-0 top-0 border-r border-slate-100 z-40">
            <div class="p-6 border-b border-slate-100">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span class="text-white font-black text-lg">E</span>
                    </div>
                    <div><p class="text-slate-800 font-bold text-sm">E-Report</p><p class="text-slate-400 text-xs">Admin Panel</p></div>
                </div>
            </div>
            <div class="px-4 py-4 border-b border-slate-100">
                <div class="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p class="text-slate-700 font-semibold text-sm">{{ user.nama }}</p>
                    <p class="text-slate-400 text-xs">{{ user.role }}</p>
                </div>
            </div>
            <nav class="flex-1 p-4 space-y-1">
                <router-link to="/dashboard" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium" active-class="bg-blue-50 text-blue-700 font-semibold"><span>📊</span><span>Dashboard</span></router-link>
                <router-link to="/laporan" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium" active-class="bg-blue-50 text-blue-700 font-semibold"><span>📋</span><span>Laporan Pengaduan</span></router-link>
                <router-link to="/kategori" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium" active-class="bg-blue-50 text-blue-700 font-semibold"><span>🏷️</span><span>Kategori Aduan</span></router-link>
                <router-link to="/pelapor" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium" active-class="bg-blue-50 text-blue-700 font-semibold"><span>👥</span><span>Data Pelapor</span></router-link>
                <router-link to="/feedback" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium" active-class="bg-blue-50 text-blue-700 font-semibold"><span>💬</span><span>Ulasan Warga</span></router-link>
            </nav>
            <div class="p-4">
                <button @click="doLogout" class="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl transition-colors text-sm font-semibold">
                    <span>🚪</span><span>Keluar</span>
                </button>
            </div>
        </aside>

        <!-- MAIN -->
        <main class="ml-64 flex-1 p-8">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-black text-gray-800">🏷️ Kategori Aduan</h1>
                    <p class="text-gray-500 text-sm mt-1">Kelola kategori jenis pengaduan masyarakat</p>
                </div>
                <button @click="openModal()"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-md shadow-blue-100">
                    + Tambah Kategori
                </button>
            </div>

            <!-- Grid Kategori -->
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="i in 6" :key="i" class="bg-white rounded-2xl h-32 animate-pulse"></div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-if="!dataList.length" class="col-span-3 text-center py-12 text-gray-400">
                    Belum ada kategori.
                </div>
                <div v-for="item in dataList" :key="item.id"
                    class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between mb-3">
                        <span class="text-2xl">🏷️</span>
                        <div class="flex gap-2">
                            <button @click="openModal(item)"
                                class="text-blue-600 text-xs font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors">
                                Edit
                            </button>
                            <button @click="confirmDelete(item)"
                                class="text-red-600 text-xs font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors">
                                Hapus
                            </button>
                        </div>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-1">{{ item.nama_kategori }}</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">{{ item.deskripsi || 'Tidak ada deskripsi.' }}</p>
                </div>
            </div>
        </main>

        <!-- MODAL TAMBAH/EDIT -->
        <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="font-bold text-gray-800">{{ isEdit ? '✏️ Edit Kategori' : '➕ Tambah Kategori' }}</h3>
                    <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>
                <div class="p-6 space-y-4">
                    <div v-if="formError" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{{ formError }}</div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Kategori *</label>
                        <input v-model="form.nama_kategori" type="text"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                        <textarea v-model="form.deskripsi" rows="3"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"></textarea>
                    </div>
                </div>
                <div class="px-6 pb-6 flex gap-3 justify-end">
                    <button @click="showModal = false"
                        class="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">Batal</button>
                    <button @click="saveData" :disabled="saving"
                        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 shadow-md shadow-blue-100">
                        {{ saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- MODAL HAPUS -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
                <div class="text-5xl mb-4">🗑️</div>
                <h3 class="font-bold text-gray-800 text-lg mb-2">Hapus Kategori?</h3>
                <p class="text-gray-500 text-sm mb-6">Kategori <strong>{{ deleteTarget?.nama_kategori }}</strong> akan dihapus permanen.</p>
                <div class="flex gap-3 justify-center">
                    <button @click="showDeleteModal = false"
                        class="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">Batal</button>
                    <button @click="deleteData" :disabled="saving"
                        class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                        {{ saving ? 'Menghapus...' : 'Ya, Hapus' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            loading: true, saving: false,
            dataList: [],
            showModal: false, showDeleteModal: false,
            isEdit: false, editId: null, deleteTarget: null, formError: '',
            form: { nama_kategori: '', deskripsi: '' },
            user: JSON.parse(localStorage.getItem('auth_user') || '{}'),
        };
    },

    async mounted() { await this.fetchData(); },

    methods: {
        async fetchData() {
            this.loading = true;
            try { const res = await api.get('/kategori'); this.dataList = res.data.data || []; }
            catch (e) { console.error(e); } finally { this.loading = false; }
        },

        openModal(item = null) {
            this.formError = '';
            if (item) { this.isEdit = true; this.editId = item.id; this.form = { nama_kategori: item.nama_kategori, deskripsi: item.deskripsi || '' }; }
            else { this.isEdit = false; this.editId = null; this.form = { nama_kategori: '', deskripsi: '' }; }
            this.showModal = true;
        },

        async saveData() {
            this.formError = '';
            if (!this.form.nama_kategori) { this.formError = 'Nama kategori wajib diisi.'; return; }
            this.saving = true;
            try {
                if (this.isEdit) { await api.put(`/kategori/update/${this.editId}`, this.form); }
                else { await api.post('/kategori/create', this.form); }
                this.showModal = false;
                await this.fetchData();
            } catch (e) { this.formError = e.response?.data?.message || 'Gagal menyimpan.'; }
            finally { this.saving = false; }
        },

        confirmDelete(item) { this.deleteTarget = item; this.showDeleteModal = true; },

        async deleteData() {
            this.saving = true;
            try { await api.delete(`/kategori/delete/${this.deleteTarget.id}`); this.showDeleteModal = false; this.deleteTarget = null; await this.fetchData(); }
            catch (e) { alert('Gagal menghapus.'); } finally { this.saving = false; }
        },

        async doLogout() {
            try { await api.post('/auth/logout'); } catch (e) {}
            localStorage.clear(); this.$router.push('/login');
        }
    }
};
