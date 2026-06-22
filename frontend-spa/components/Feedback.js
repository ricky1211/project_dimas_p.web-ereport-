// components/Feedback.js
const FeedbackComponent = {
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
                <router-link v-if="user.role === 'admin'" to="/kategori"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
                    active-class="bg-blue-50 text-blue-700 font-semibold">
                    <span>🏷️</span><span>Kategori Aduan</span>
                </router-link>
                <router-link v-if="user.role === 'admin'" to="/pelapor"
                    class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
                    active-class="bg-blue-50 text-blue-700 font-semibold">
                    <span>👥</span><span>Data Pelapor</span>
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

        <!-- MAIN -->
        <main class="ml-64 flex-1 p-8">
            <div class="mb-6">
                <h1 class="text-2xl font-black text-gray-800">💬 Ulasan & Feedback Warga</h1>
                <p class="text-gray-500 text-sm mt-1">Kelola rating kepuasan dan pengajuan banding laporan masyarakat</p>
            </div>

            <!-- KPI Cards -->
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div v-for="i in 3" :key="i" class="bg-white rounded-2xl h-24 animate-pulse"></div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p class="text-3xl font-black text-blue-600">{{ totalUlasan }}</p>
                    <p class="text-gray-500 text-sm mt-1">Total Ulasan Masuk</p>
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p class="text-3xl font-black text-yellow-500">★ {{ avgRating }}</p>
                    <p class="text-gray-500 text-sm mt-1">Rata-rata Rating Kepuasan</p>
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p class="text-3xl font-black text-amber-600">{{ totalBanding }}</p>
                    <p class="text-gray-500 text-sm mt-1">Pengajuan Banding Urgensi</p>
                </div>
            </div>

            <!-- List Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div v-if="loading" class="p-6 space-y-3">
                    <div v-for="i in 4" :key="i" class="h-10 bg-gray-100 rounded animate-pulse"></div>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th class="text-left px-5 py-3">Kode</th>
                                <th class="text-left px-5 py-3">Pelapor</th>
                                <th class="text-left px-5 py-3">Judul Aduan</th>
                                <th class="text-left px-5 py-3">Rating</th>
                                <th class="text-left px-5 py-3">Ulasan Feedback</th>
                                <th class="text-left px-5 py-3">Tipe</th>
                                <th class="text-left px-5 py-3">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-if="!feedbackList.length">
                                <td colspan="7" class="text-center py-12 text-gray-400">
                                    Belum ada ulasan atau feedback dari warga.
                                </td>
                            </tr>
                            <tr v-for="item in feedbackList" :key="item.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-5 py-4">
                                    <span class="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">
                                        {{ item.kode_laporan }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 font-semibold text-gray-800">{{ item.nama_pelapor }}</td>
                                <td class="px-5 py-4 text-gray-700 max-w-xs truncate" :title="item.judul_laporan">
                                    {{ item.judul_laporan }}
                                </td>
                                <td class="px-5 py-4">
                                    <div class="text-yellow-500 font-bold">★ {{ item.rating }}/5</div>
                                </td>
                                <td class="px-5 py-4 text-gray-600 max-w-sm">
                                    <p class="font-medium text-xs text-slate-800">{{ item.feedback_warga }}</p>
                                    <div v-if="item.is_banding === '1' || item.is_banding === 1" 
                                        class="mt-1 bg-amber-50 border border-amber-100 p-2 rounded text-[11px] text-amber-800">
                                        <strong>Urgensi Banding:</strong> {{ item.alasan_urgensi }}
                                    </div>
                                </td>
                                <td class="px-5 py-4">
                                    <span v-if="item.is_banding === '1' || item.is_banding === 1" 
                                        class="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">
                                        Banding
                                    </span>
                                    <span v-else 
                                        class="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase">
                                        Ulasan
                                    </span>
                                </td>
                                <td class="px-5 py-4 text-gray-400 text-xs">{{ item.tanggal_laporan }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
    `,

    data() {
        return {
            loading: true,
            feedbackList: [],
            user: JSON.parse(localStorage.getItem('auth_user') || '{}'),
        };
    },

    computed: {
        totalUlasan() {
            return this.feedbackList.length;
        },
        avgRating() {
            if (!this.feedbackList.length) return '0.0';
            const sum = this.feedbackList.reduce((acc, curr) => acc + parseInt(curr.rating), 0);
            return (sum / this.feedbackList.length).toFixed(1);
        },
        totalBanding() {
            return this.feedbackList.filter(item => item.is_banding === '1' || item.is_banding === 1).length;
        }
    },

    async mounted() {
        await this.fetchFeedback();
    },

    methods: {
        async fetchFeedback() {
            this.loading = true;
            try {
                const res = await api.get('/laporan');
                const list = res.data.data || [];
                // Saring laporan yang memiliki rating/feedback
                this.feedbackList = list.filter(item => item.rating !== null && item.rating !== '');
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
            }
        },

        async doLogout() {
            try { await api.post('/auth/logout'); } catch (e) {}
            localStorage.clear();
            this.$router.push('/login');
        }
    }
};
