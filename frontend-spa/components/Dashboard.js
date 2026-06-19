// components/Dashboard.js
const DashboardComponent = {
    template: `
    <div class="min-h-screen bg-gray-100 flex">

        <!-- SIDEBAR -->
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
 
            <!-- User info -->
            <div class="px-4 py-4 border-b border-blue-800">
                <div class="bg-blue-800 rounded-xl p-3">
                    <p class="text-white font-semibold text-sm">{{ user.nama }}</p>
                    <p class="text-blue-300 text-xs uppercase tracking-wide">{{ user.role }}</p>
                </div>
            </div>
 
            <!-- Nav -->
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

            <!-- Logout -->
            <div class="p-4">
                <button @click="doLogout"
                    class="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl transition-colors text-sm font-semibold">
                    <span>🚪</span><span>Keluar</span>
                </button>
            </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="ml-64 flex-1 p-8">

            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-2xl font-black text-gray-800">Selamat Datang, {{ user.nama }}! 👋</h1>
                <p class="text-gray-500 text-sm mt-1">Ringkasan data pengaduan masyarakat hari ini.</p>
            </div>

            <!-- Stats Cards -->
            <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div v-for="i in 4" :key="i" class="bg-white rounded-2xl h-28 animate-pulse"></div>
            </div>

            <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p class="text-3xl font-black text-blue-700">{{ stats.total_laporan }}</p>
                    <p class="text-gray-500 text-sm mt-1">Total Laporan</p>
                    <div class="w-8 h-1 bg-blue-700 rounded mt-2"></div>
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p class="text-3xl font-black text-yellow-500">{{ stats.total_baru }}</p>
                    <p class="text-gray-500 text-sm mt-1">Laporan Baru</p>
                    <div class="w-8 h-1 bg-yellow-500 rounded mt-2"></div>
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p class="text-3xl font-black text-blue-500">{{ stats.total_diproses }}</p>
                    <p class="text-gray-500 text-sm mt-1">Sedang Diproses</p>
                    <div class="w-8 h-1 bg-blue-500 rounded mt-2"></div>
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p class="text-3xl font-black text-green-600">{{ stats.total_selesai }}</p>
                    <p class="text-gray-500 text-sm mt-1">Selesai</p>
                    <div class="w-8 h-1 bg-green-600 rounded mt-2"></div>
                </div>
            </div>

            <!-- Tabel Laporan Terbaru -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 class="font-bold text-gray-800">📋 Laporan Terbaru</h2>
                    <router-link to="/laporan" class="text-blue-600 text-sm hover:underline font-medium">
                        Lihat semua →
                    </router-link>
                </div>

                <div v-if="loading" class="p-6">
                    <div v-for="i in 3" :key="i" class="h-10 bg-gray-100 rounded animate-pulse mb-3"></div>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th class="text-left px-6 py-3">Kode</th>
                                <th class="text-left px-6 py-3">Judul</th>
                                <th class="text-left px-6 py-3">Kategori</th>
                                <th class="text-left px-6 py-3">Pelapor</th>
                                <th class="text-left px-6 py-3">Status</th>
                                <th class="text-left px-6 py-3">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="item in stats.laporan_terbaru" :key="item.kode_laporan"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <span class="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                        {{ item.kode_laporan }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 font-medium text-gray-800 max-w-xs truncate">
                                    {{ item.judul_laporan }}
                                </td>
                                <td class="px-6 py-4 text-gray-500">{{ item.nama_kategori }}</td>
                                <td class="px-6 py-4 text-gray-500">{{ item.nama_pelapor }}</td>
                                <td class="px-6 py-4">
                                    <span :class="badgeClass(item.status)"
                                        class="text-xs font-semibold px-3 py-1 rounded-full capitalize">
                                        {{ item.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-gray-500">{{ item.tanggal_laporan }}</td>
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
            stats:   {},
            user:    JSON.parse(localStorage.getItem('auth_user') || '{}'),
        };
    },

    async mounted() {
        await this.fetchStats();
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

        async doLogout() {
            try {
                await api.post('/auth/logout');
            } catch (e) {
                // lanjutkan logout meski API gagal
            }
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            this.$router.push('/login');
        },

        badgeClass(status) {
            const map = {
                baru:     'bg-yellow-100 text-yellow-700',
                diproses: 'bg-blue-100 text-blue-700',
                selesai:  'bg-green-100 text-green-700',
                ditolak:  'bg-red-100 text-red-700',
            };
            return map[status] || 'bg-gray-100 text-gray-600';
        }
    }
};
