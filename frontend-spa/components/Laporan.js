// components/Laporan.js
const LaporanComponent = {
    template: `
    <div class="min-h-screen bg-gray-100 flex">

        <!-- SIDEBAR (reuse layout) -->
        <aside class="w-64 bg-blue-900 min-h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-40">
            <div class="p-6 border-b border-blue-800">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                        <span class="text-blue-900 font-black text-lg">E</span>
                    </div>
                    <div>
                        <p class="text-white font-bold text-sm">E-Report</p>
                        <p class="text-blue-300 text-xs">{{ user.role === 'admin' ? 'Admin Panel' : 'Petugas Panel' }}</p>
                    </div>
                </div>
            </div>
            <div class="px-4 py-4 border-b border-blue-800">
                <div class="bg-blue-800 rounded-xl p-3">
                    <p class="text-white font-semibold text-sm">{{ user.nama }}</p>
                    <p class="text-blue-300 text-xs uppercase tracking-wide">{{ user.role }}</p>
                </div>
            </div>
            <nav class="flex-1 p-4 space-y-1">
                <router-link to="/dashboard"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-800 hover:text-white transition-colors text-sm font-medium"
                    active-class="bg-blue-700 text-white">
                    <span>📊</span><span>Dashboard</span>
                </router-link>
                <router-link to="/laporan"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-800 hover:text-white transition-colors text-sm font-medium"
                    active-class="bg-blue-700 text-white">
                    <span>📋</span><span>Laporan Pengaduan</span>
                </router-link>
                <router-link v-if="user.role === 'admin'" to="/kategori"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-800 hover:text-white transition-colors text-sm font-medium"
                    active-class="bg-blue-700 text-white">
                    <span>🏷️</span><span>Kategori Aduan</span>
                </router-link>
                <router-link v-if="user.role === 'admin'" to="/pelapor"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-800 hover:text-white transition-colors text-sm font-medium"
                    active-class="bg-blue-700 text-white">
                    <span>👥</span><span>Data Pelapor</span>
                </router-link>
            </nav>
            <div class="p-4">
                <button @click="doLogout"
                    class="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl transition-colors text-sm font-semibold">
                    <span>🚪</span><span>Keluar</span>
                </button>
            </div>
        </aside>
 
        <!-- MAIN -->
        <main class="ml-64 flex-1 p-8">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-black text-gray-800">📋 Laporan Pengaduan</h1>
                    <p class="text-gray-500 text-sm mt-1">Kelola seluruh laporan pengaduan masyarakat</p>
                </div>
                <button v-if="user.role === 'admin'" @click="openModal()"
                    class="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-lg">
                    + Tambah Laporan
                </button>
            </div>

            <!-- Filter Status -->
            <div class="flex gap-2 mb-5">
                <button v-for="s in ['semua','baru','diproses','selesai','ditolak']" :key="s"
                    @click="filterStatus = s; fetchData()"
                    :class="filterStatus === s
                        ? 'bg-blue-700 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'"
                    class="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors">
                    {{ s }}
                </button>
            </div>

            <!-- Tabel -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div v-if="loading" class="p-6 space-y-3">
                    <div v-for="i in 5" :key="i" class="h-10 bg-gray-100 rounded animate-pulse"></div>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th class="text-left px-5 py-3">Kode</th>
                                <th class="text-left px-5 py-3">Judul Laporan</th>
                                <th class="text-left px-5 py-3">Kategori</th>
                                <th class="text-left px-5 py-3">Pelapor</th>
                                <th class="text-left px-5 py-3">Status</th>
                                <th class="text-left px-5 py-3">Tanggal</th>
                                <th class="text-center px-5 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-if="!filteredData.length">
                                <td colspan="7" class="text-center py-12 text-gray-400">
                                    Tidak ada data laporan.
                                </td>
                            </tr>
                            <tr v-for="item in filteredData" :key="item.id"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-5 py-4">
                                    <span class="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                        {{ item.kode_laporan }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 font-medium text-gray-800 max-w-xs">
                                    <p class="truncate">{{ item.judul_laporan }}</p>
                                    <p class="text-xs text-gray-400 truncate">{{ item.lokasi }}</p>
                                </td>
                                <td class="px-5 py-4 text-gray-500">{{ item.nama_kategori }}</td>
                                <td class="px-5 py-4 text-gray-500">{{ item.nama_pelapor }}</td>
                                <td class="px-5 py-4">
                                    <span :class="badgeClass(item.status)"
                                        class="text-xs font-semibold px-3 py-1 rounded-full capitalize">
                                        {{ item.status }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 text-gray-500 text-xs">{{ item.tanggal_laporan }}</td>
                                <td class="px-5 py-4">
                                    <div class="flex items-center justify-center gap-2">
                                        <button @click="openModal(item)"
                                            class="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                                            Edit
                                        </button>
                                        <button v-if="user.role === 'admin'" @click="confirmDelete(item)"
                                            class="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <!-- ── MODAL TAMBAH / EDIT ─────────────────────────── -->
        <div v-if="showModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="font-bold text-gray-800">{{ isEdit ? '✏️ Edit Laporan' : '➕ Tambah Laporan' }}</h3>
                    <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>

                <div class="p-6 space-y-4">
                    <!-- Alert error -->
                    <div v-if="formError" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                        {{ formError }}
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Judul Laporan *</label>
                            <input v-model="form.judul_laporan" type="text" :disabled="user.role !== 'admin'"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Pelapor *</label>
                            <select v-model="form.pelapor_id" :disabled="user.role !== 'admin'"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500">
                                <option value="">-- Pilih Pelapor --</option>
                                <option v-for="p in pelaporList" :key="p.id" :value="p.id">
                                    {{ p.nama_pelapor }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Kategori *</label>
                            <select v-model="form.kategori_id" :disabled="user.role !== 'admin'"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500">
                                <option value="">-- Pilih Kategori --</option>
                                <option v-for="k in kategoriList" :key="k.id" :value="k.id">
                                    {{ k.nama_kategori }}
                                </option>
                            </select>
                        </div>

                        <div class="col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Lokasi *</label>
                            <input v-model="form.lokasi" type="text" :disabled="user.role !== 'admin'"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Tanggal Laporan *</label>
                            <input v-model="form.tanggal_laporan" type="date" :disabled="user.role !== 'admin'"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                            <select v-model="form.status"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option value="baru">Baru</option>
                                <option value="diproses">Diproses</option>
                                <option value="selesai">Selesai</option>
                                <option value="ditolak">Ditolak</option>
                            </select>
                        </div>

                        <!-- Tugaskan Petugas (Hanya Admin) -->
                        <div v-if="user.role === 'admin'" class="col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Tugaskan Petugas</label>
                            <select v-model="form.petugas_id"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option value="">-- Pilih Petugas --</option>
                                <option v-for="o in officerList" :key="o.id" :value="o.id">
                                    {{ o.nama }} ({{ o.role }})
                                </option>
                            </select>
                        </div>

                        <div class="col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Isi Laporan *</label>
                            <textarea v-model="form.isi_laporan" rows="4" :disabled="user.role !== 'admin'"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none disabled:bg-gray-100 disabled:text-gray-500"></textarea>
                        </div>

                        <div class="col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Catatan Petugas</label>
                            <textarea v-model="form.catatan_petugas" rows="2" placeholder="Progres pengerjaan..."
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"></textarea>
                        </div>
                    </div>
                </div>

                <div class="px-6 pb-6 flex gap-3 justify-end">
                    <button @click="showModal = false"
                        class="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">
                        Batal
                    </button>
                    <button @click="saveData" :disabled="saving"
                        class="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                        {{ saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Laporan') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- MODAL KONFIRMASI HAPUS -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div class="text-center">
                    <div class="text-5xl mb-4">🗑️</div>
                    <h3 class="font-bold text-gray-800 text-lg mb-2">Hapus Laporan?</h3>
                    <p class="text-gray-500 text-sm mb-6">
                        Laporan <strong>{{ deleteTarget?.kode_laporan }}</strong> akan dihapus permanen.
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div class="flex gap-3 justify-center">
                        <button @click="showDeleteModal = false"
                            class="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">
                            Batal
                        </button>
                        <button @click="deleteData" :disabled="saving"
                            class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                            {{ saving ? 'Menghapus...' : 'Ya, Hapus' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
    `,

    data() {
        return {
            loading:         true,
            saving:          false,
            dataList:        [],
            kategoriList:    [],
            pelaporList:     [],
            officerList:     [],
            filterStatus:    'semua',
            showModal:       false,
            showDeleteModal: false,
            isEdit:          false,
            deleteTarget:    null,
            formError:       '',
            form:            this.defaultForm(),
            user:            JSON.parse(localStorage.getItem('auth_user') || '{}'),
        };
    },

    computed: {
        filteredData() {
            if (this.filterStatus === 'semua') return this.dataList;
            return this.dataList.filter(d => d.status === this.filterStatus);
        }
    },

    async mounted() {
        await Promise.all([this.fetchData(), this.fetchKategori(), this.fetchPelapor(), this.fetchOfficers()]);
    },

    methods: {
        defaultForm() {
            return {
                pelapor_id: '', kategori_id: '', petugas_id: '', judul_laporan: '',
                isi_laporan: '', lokasi: '', foto_bukti: '',
                status: 'baru', tanggal_laporan: '', catatan_petugas: '',
            };
        },

        async fetchData() {
            this.loading = true;
            try {
                const res = await api.get('/laporan');
                this.dataList = res.data.data || [];
            } catch (e) { console.error(e); }
            finally { this.loading = false; }
        },

        async fetchKategori() {
            const res = await api.get('/kategori');
            this.kategoriList = res.data.data || [];
        },

        async fetchPelapor() {
            const res = await api.get('/pelapor');
            this.pelaporList = res.data.data || [];
        },

        async fetchOfficers() {
            if (this.user.role !== 'admin') return;
            try {
                const res = await api.get('/users');
                this.officerList = (res.data.data || []).filter(u => u.role === 'petugas');
            } catch (e) {
                console.error(e);
            }
        },

        openModal(item = null) {
            this.formError = '';
            if (item) {
                this.isEdit = true;
                this.form   = {
                    pelapor_id:       item.pelapor_id,
                    kategori_id:      item.kategori_id,
                    petugas_id:       item.petugas_id || '',
                    judul_laporan:    item.judul_laporan,
                    isi_laporan:      item.isi_laporan,
                    lokasi:           item.lokasi,
                    status:           item.status,
                    tanggal_laporan:  item.tanggal_laporan,
                    catatan_petugas:  item.catatan_petugas || '',
                };
                this.editId = item.id;
            } else {
                this.isEdit = false;
                this.form   = this.defaultForm();
                this.form.tanggal_laporan = new Date().toISOString().split('T')[0];
                this.editId = null;
            }
            this.showModal = true;
        },

        async saveData() {
            this.formError = '';
            if (!this.form.judul_laporan || !this.form.pelapor_id || !this.form.kategori_id) {
                this.formError = 'Judul, pelapor, dan kategori wajib diisi.';
                return;
            }
            this.saving = true;
            try {
                if (this.isEdit) {
                    await api.put(`/laporan/update/${this.editId}`, this.form);
                } else {
                    await api.post('/laporan/create', this.form);
                }
                this.showModal = false;
                await this.fetchData();
            } catch (e) {
                this.formError = e.response?.data?.message || 'Gagal menyimpan data.';
            } finally {
                this.saving = false;
            }
        },

        confirmDelete(item) {
            this.deleteTarget = item;
            this.showDeleteModal = true;
        },

        async deleteData() {
            this.saving = true;
            try {
                await api.delete(`/laporan/delete/${this.deleteTarget.id}`);
                this.showDeleteModal = false;
                this.deleteTarget = null;
                await this.fetchData();
            } catch (e) {
                alert('Gagal menghapus data.');
            } finally {
                this.saving = false;
            }
        },

        async doLogout() {
            try { await api.post('/auth/logout'); } catch (e) {}
            localStorage.clear();
            this.$router.push('/login');
        },

        badgeClass(status) {
            const map = {
                baru: 'bg-yellow-100 text-yellow-700',
                diproses: 'bg-blue-100 text-blue-700',
                selesai: 'bg-green-100 text-green-700',
                ditolak: 'bg-red-100 text-red-700',
            };
            return map[status] || 'bg-gray-100 text-gray-600';
        }
    }
};
