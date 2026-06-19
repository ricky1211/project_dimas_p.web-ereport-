// components/Home.js
const HomeComponent = {
    template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">

        <!-- NAVBAR -->
        <nav class="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                            <span class="text-blue-800 font-black text-lg">E</span>
                        </div>
                        <span class="text-white font-bold text-xl tracking-wide">E-Report</span>
                    </div>
                    <router-link to="/login"
                        class="bg-white text-blue-800 font-semibold px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm shadow">
                        🔐 Login Admin
                    </router-link>
                </div>
            </div>
        </nav>

        <!-- HERO SECTION -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
            <div class="inline-flex items-center bg-white/15 text-white text-sm px-4 py-1.5 rounded-full mb-6 border border-white/30">
                📣 Sistem Pengaduan Resmi Layanan Masyarakat
            </div>
            <h1 class="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
                Suarakan <span class="text-yellow-300">Keluhanmu</span><br/>Kami Siap Merespons
            </h1>
            <p class="text-blue-200 text-lg max-w-2xl mx-auto mb-10">
                Platform pengaduan resmi warga. Laporkan masalah infrastruktur, keamanan, kebersihan,
                dan layanan publik secara mudah, cepat, dan transparan.
            </p>
        </div>

        <!-- TAB TOGGLE -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-center animate-fade-in">
            <div class="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 inline-flex space-x-1 shadow-lg">
                <button @click="activeTab = 'dashboard'"
                    :class="activeTab === 'dashboard'
                        ? 'bg-white text-blue-900 shadow-md font-bold'
                        : 'text-white hover:bg-white/10 font-semibold'"
                    class="px-6 py-3 rounded-xl text-sm transition-all flex items-center space-x-2">
                    <span>📊</span>
                    <span>Dashboard Laporan Masuk</span>
                </button>
                <button @click="activeTab = 'form'"
                    :class="activeTab === 'form'
                        ? 'bg-white text-blue-900 shadow-md font-bold'
                        : 'text-white hover:bg-white/10 font-semibold'"
                    class="px-6 py-3 rounded-xl text-sm transition-all flex items-center space-x-2">
                    <span>✍️</span>
                    <span>Buat Pengaduan Warga</span>
                </button>
            </div>
        </div>

        <div v-if="activeTab === 'dashboard'" class="space-y-2">
            <!-- STATISTIK CARDS -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div v-for="i in 4" :key="i"
                        class="bg-white/10 animate-pulse rounded-2xl h-28"></div>
                </div>

                <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white rounded-2xl p-5 text-center shadow-xl">
                        <p class="text-4xl font-black text-blue-700">{{ stats.total_laporan }}</p>
                        <p class="text-gray-500 text-sm mt-1 font-medium">Total Laporan</p>
                    </div>
                    <div class="bg-yellow-400 rounded-2xl p-5 text-center shadow-xl">
                        <p class="text-4xl font-black text-yellow-900">{{ stats.total_baru }}</p>
                        <p class="text-yellow-800 text-sm mt-1 font-medium">Laporan Baru</p>
                    </div>
                    <div class="bg-blue-400 rounded-2xl p-5 text-center shadow-xl">
                        <p class="text-4xl font-black text-blue-900">{{ stats.total_diproses }}</p>
                        <p class="text-blue-800 text-sm mt-1 font-medium">Diproses</p>
                    </div>
                    <div class="bg-green-400 rounded-2xl p-5 text-center shadow-xl">
                        <p class="text-4xl font-black text-green-900">{{ stats.total_selesai }}</p>
                        <p class="text-green-800 text-sm mt-1 font-medium">Terselesaikan</p>
                    </div>
                </div>
            </div>

            <!-- LAPORAN TERBARU -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <h2 class="text-white font-bold text-2xl mb-6">📋 Laporan Terbaru</h2>
                <div v-if="loading" class="space-y-3">
                    <div v-for="i in 3" :key="i" class="bg-white/10 animate-pulse rounded-xl h-16"></div>
                </div>
                <div v-else class="bg-white rounded-2xl overflow-hidden shadow-xl">
                    <div v-if="stats.laporan_terbaru && stats.laporan_terbaru.length">
                        <div v-for="(item, idx) in stats.laporan_terbaru" :key="idx"
                            class="flex items-center justify-between px-6 py-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
                            <div class="flex items-center space-x-4">
                                <span class="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {{ item.kode_laporan }}
                                </span>
                                <div>
                                    <p class="font-semibold text-gray-800 text-sm">{{ item.judul_laporan }}</p>
                                    <p class="text-gray-400 text-xs">{{ item.nama_kategori }} • {{ item.nama_pelapor }}</p>
                                </div>
                            </div>
                            <span :class="badgeClass(item.status)"
                                class="text-xs font-semibold px-3 py-1 rounded-full capitalize">
                                {{ item.status }}
                            </span>
                        </div>
                    </div>
                    <div v-else class="py-12 text-center text-gray-400">
                        Belum ada laporan yang masuk.
                    </div>
                </div>
            </div>
        </div>

        <!-- FORM PENGADUAN WARGA -->
        <div v-if="activeTab === 'form'" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div class="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20">
                <div class="text-center mb-8">
                    <span class="text-3xl">✍️</span>
                    <h2 class="text-2xl font-black text-gray-800 mt-2">Buat Pengaduan Baru</h2>
                    <p class="text-gray-500 text-sm mt-1">Isi formulir berikut untuk mengirimkan pengaduan Anda secara langsung.</p>
                </div>

                <!-- Alert sukses / error -->
                <div v-if="successMsg" class="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-6 text-sm flex items-center space-x-2">
                    <span>✅</span> <span>{{ successMsg }}</span>
                </div>
                <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-6 text-sm flex items-center space-x-2">
                    <span>⚠️</span> <span>{{ errorMsg }}</span>
                </div>

                <form @submit.prevent="submitComplaint" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Data Warga -->
                        <div class="col-span-1">
                            <label class="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Nama Lengkap *</label>
                            <input v-model="form.nama_pelapor" type="text" required placeholder="Contoh: Budi Santoso"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" />
                        </div>
                        <div class="col-span-1">
                            <label class="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">NIK (16 Digit) *</label>
                            <input v-model="form.nik" type="text" required maxlength="16" placeholder="Contoh: 3201234567890001"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" />
                        </div>
                        <div class="col-span-1">
                            <label class="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">No. Telepon *</label>
                            <input v-model="form.no_telepon" type="tel" required placeholder="Contoh: 081234567890"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" />
                        </div>
                        <div class="col-span-1">
                            <label class="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Kategori *</label>
                            <select v-model="form.kategori_id" required
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all">
                                <option value="">-- Pilih Kategori --</option>
                                <option v-for="k in kategoriList" :key="k.id" :value="k.id">
                                    {{ k.nama_kategori }}
                                </option>
                            </select>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Alamat Lengkap *</label>
                            <input v-model="form.alamat" type="text" required placeholder="Contoh: Jl. Merdeka No. 10, RT 03/RW 05, Bogor"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" />
                        </div>

                        <!-- Data Laporan -->
                        <div class="col-span-2">
                            <hr class="border-gray-100 my-2" />
                        </div>

                        <div class="col-span-2">
                            <label class="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Judul Laporan *</label>
                            <input v-model="form.judul_laporan" type="text" required placeholder="Tulis ringkasan masalah"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" />
                        </div>
                        <div class="col-span-2">
                            <label class="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Lokasi Kejadian *</label>
                            <input v-model="form.lokasi" type="text" required placeholder="Contoh: Dekat pertigaan pasar"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" />
                        </div>
                        <div class="col-span-2">
                            <label class="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Isi Laporan *</label>
                            <textarea v-model="form.isi_laporan" rows="4" required placeholder="Jelaskan secara rinci kronologi masalah..."
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm resize-none transition-all"></textarea>
                        </div>
                    </div>

                    <div class="flex justify-end pt-4">
                        <button type="submit" :disabled="submitting"
                            class="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50 flex items-center space-x-2">
                            <span>{{ submitting ? 'Mengirimkan...' : 'Kirim Pengaduan 🚀' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="border-t border-white/20 py-6 text-center text-blue-300 text-sm">
            © 2024 E-Report — Sistem Pengaduan Layanan Masyarakat
        </div>
    </div>
    `,

    data() {
        return {
            activeTab: 'dashboard',
            loading: true,
            submitting: false,
            stats: {},
            kategoriList: [],
            successMsg: '',
            errorMsg: '',
            form: {
                nama_pelapor: '',
                nik: '',
                no_telepon: '',
                alamat: '',
                judul_laporan: '',
                kategori_id: '',
                lokasi: '',
                isi_laporan: ''
            }
        };
    },

    async mounted() {
        await Promise.all([this.fetchStats(), this.fetchKategori()]);
    },

    methods: {
        async fetchStats() {
            try {
                const res = await api.get('/dashboard/stats');
                this.stats = res.data.data;
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
            }
        },

        async fetchKategori() {
            try {
                const res = await api.get('/kategori');
                this.kategoriList = res.data.data || [];
            } catch (e) {
                console.error(e);
            }
        },

        async submitComplaint() {
            this.successMsg = '';
            this.errorMsg = '';
            
            if (this.form.nik.length !== 16 || isNaN(this.form.nik)) {
                this.errorMsg = 'NIK harus berupa 16 digit angka.';
                return;
            }

            this.submitting = true;
            try {
                const res = await api.post('/laporan/public-create', this.form);
                this.successMsg = 'Pengaduan Anda berhasil dikirim! Kode Laporan: ' + res.data.data.kode_laporan;
                this.form = {
                    nama_pelapor: '',
                    nik: '',
                    no_telepon: '',
                    alamat: '',
                    judul_laporan: '',
                    kategori_id: '',
                    lokasi: '',
                    isi_laporan: ''
                };
                await this.fetchStats();
            } catch (e) {
                this.errorMsg = e.response?.data?.message || 'Gagal mengirim pengaduan. Silakan coba lagi.';
            } finally {
                this.submitting = false;
            }
        },

        badgeClass(status) {
            const map = {
                baru:      'bg-yellow-100 text-yellow-700',
                diproses:  'bg-blue-100 text-blue-700',
                selesai:   'bg-green-100 text-green-700',
                ditolak:   'bg-red-100 text-red-700',
            };
            return map[status] || 'bg-gray-100 text-gray-600';
        }
    }
};
