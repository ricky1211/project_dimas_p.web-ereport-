// components/Dashboard.js
const DashboardComponent = {
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
                        <p class="text-slate-400 text-xs">{{ user.role === 'admin' ? 'Admin Panel' : 'Petugas Panel' }}</p>
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
                <router-link v-if="user.role === 'admin'" to="/petugas"
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
            <div class="mb-8">
                <h1 class="text-2xl font-black text-gray-800">Selamat Datang, {{ user.nama }}! 👋</h1>
                <p class="text-gray-500 text-sm mt-1">Ringkasan data pengaduan masyarakat hari ini.</p>
            </div>

            <!-- Stats Cards -->
            <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div v-for="i in 4" :key="i" class="bg-white rounded-2xl h-28 animate-pulse"></div>
            </div>

            <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p class="text-3xl font-black text-blue-600">{{ stats.total_laporan }}</p>
                    <p class="text-gray-500 text-sm mt-1">Total Laporan</p>
                    <div class="w-8 h-1 bg-blue-500 rounded mt-2"></div>
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p class="text-3xl font-black text-amber-500">{{ stats.total_baru }}</p>
                    <p class="text-gray-500 text-sm mt-1">Laporan Baru</p>
                    <div class="w-8 h-1 bg-amber-400 rounded mt-2"></div>
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p class="text-3xl font-black text-sky-500">{{ stats.total_diproses }}</p>
                    <p class="text-gray-500 text-sm mt-1">Sedang Diproses</p>
                    <div class="w-8 h-1 bg-sky-400 rounded mt-2"></div>
                </div>
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p class="text-3xl font-black text-emerald-600">{{ stats.total_selesai }}</p>
                    <p class="text-gray-500 text-sm mt-1">Selesai</p>
                    <div class="w-8 h-1 bg-emerald-400 rounded mt-2"></div>
                </div>
            </div>

            <!-- ── GRAFIK SECTION ─────────────────────────────────── -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                <!-- Grafik Laporan Masuk (7 hari) -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div class="flex items-center justify-between mb-5">
                        <div>
                            <h2 class="font-bold text-slate-800">📈 Grafik Laporan Masuk</h2>
                            <p class="text-slate-400 text-xs mt-0.5">7 hari terakhir</p>
                        </div>
                        <span class="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Harian</span>
                    </div>
                    <div style="height: 230px; position: relative;">
                        <canvas id="adminChartLaporan"></canvas>
                    </div>
                </div>

                <!-- Grafik Kepuasan Warga -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div class="flex items-center justify-between mb-5">
                        <div>
                            <h2 class="font-bold text-slate-800">⭐ Grafik Kepuasan Warga</h2>
                            <p class="text-slate-400 text-xs mt-0.5">Distribusi rating 1–5 bintang</p>
                        </div>
                        <!-- Legend warna -->
                        <div class="flex items-center gap-3 text-xs">
                            <span class="flex items-center gap-1">
                                <span class="w-3 h-3 rounded bg-red-400 inline-block"></span>
                                <span class="text-slate-500">&lt; 3 (Buruk)</span>
                            </span>
                            <span class="flex items-center gap-1">
                                <span class="w-3 h-3 rounded bg-amber-400 inline-block"></span>
                                <span class="text-slate-500">3–4 (Cukup)</span>
                            </span>
                            <span class="flex items-center gap-1">
                                <span class="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                                <span class="text-slate-500">5 (Puas)</span>
                            </span>
                        </div>
                    </div>

                    <!-- Rating summary -->
                    <div v-if="avgRating !== null" class="flex items-center gap-3 mb-4 p-3 rounded-xl"
                        :class="avgRating < 3 ? 'bg-red-50 border border-red-100' : avgRating >= 5 ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'">
                        <div class="text-3xl font-black"
                            :class="avgRating < 3 ? 'text-red-500' : avgRating >= 5 ? 'text-emerald-600' : 'text-amber-500'">
                            {{ avgRating.toFixed(1) }}
                        </div>
                        <div>
                            <div class="flex items-center gap-0.5 text-sm">
                                <span v-for="s in 5" :key="s"
                                    :class="s <= Math.round(avgRating) ? (avgRating < 3 ? 'text-red-400' : avgRating >= 5 ? 'text-emerald-500' : 'text-amber-400') : 'text-gray-200'">★</span>
                            </div>
                            <p class="text-xs mt-0.5"
                                :class="avgRating < 3 ? 'text-red-500 font-semibold' : avgRating >= 5 ? 'text-emerald-600 font-semibold' : 'text-amber-600'">
                                {{ avgRating < 3 ? '⚠️ Kepuasan Rendah' : avgRating >= 5 ? '✅ Kepuasan Sempurna' : '📊 Kepuasan Cukup' }}
                                <span class="text-slate-400 font-normal ml-1">(dari {{ totalRated }} ulasan)</span>
                            </p>
                        </div>
                    </div>

                    <div style="height: 170px; position: relative;">
                        <canvas id="adminChartKepuasan"></canvas>
                    </div>
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
                                <th class="text-left px-6 py-3">Rating</th>
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
                                    <span v-if="item.rating"
                                        class="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
                                        :class="item.rating < 3 ? 'bg-red-100 text-red-600' : item.rating >= 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                                        ★ {{ item.rating }}
                                    </span>
                                    <span v-else class="text-gray-300 text-xs">—</span>
                                </td>
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
            avgRating: null,
            totalRated: 0,
            _chartLaporan: null,
            _chartKepuasan: null,
        };
    },

    async mounted() {
        await this.fetchStats();
        await this.fetchAndRenderCharts();
    },

    unmounted() {
        if (this._chartLaporan)  { this._chartLaporan.destroy();  this._chartLaporan  = null; }
        if (this._chartKepuasan) { this._chartKepuasan.destroy(); this._chartKepuasan = null; }
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

        async fetchAndRenderCharts() {
            try {
                const res  = await api.get('/laporan');
                const list = res.data.data || [];
                this.buildRatingSummary(list);
                this.renderChartLaporan(list);
                this.renderChartKepuasan(list);
            } catch (e) {
                console.error('Chart error', e);
            }
        },

        buildRatingSummary(list) {
            const rated = list.filter(i => i.rating && parseInt(i.rating) >= 1);
            if (!rated.length) { this.avgRating = null; return; }
            const sum = rated.reduce((acc, i) => acc + parseInt(i.rating), 0);
            this.avgRating  = sum / rated.length;
            this.totalRated = rated.length;
        },

        // Grafik Laporan Masuk – 7 hari terakhir
        renderChartLaporan(list) {
            const days   = [];
            const counts = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                days.push(d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }));
                const dateStr = d.toISOString().slice(0, 10);
                counts.push(list.filter(item => (item.tanggal_laporan || '').slice(0, 10) === dateStr).length);
            }

            const ctx = document.getElementById('adminChartLaporan');
            if (!ctx) return;
            if (this._chartLaporan) this._chartLaporan.destroy();

            this._chartLaporan = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: days,
                    datasets: [{
                        label: 'Laporan Masuk',
                        data: counts,
                        backgroundColor: 'rgba(59,130,246,0.75)',
                        borderColor: 'rgba(59,130,246,1)',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: c => ` ${c.parsed.y} laporan` } }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#94a3b8' } },
                        y: { beginAtZero: true, ticks: { precision: 0, font: { size: 11 }, color: '#94a3b8' }, grid: { color: '#f1f5f9' } }
                    }
                }
            });
        },

        // Grafik Kepuasan – distribusi rating 1–5
        // Warna: rating < 3 → merah | 3–4 → kuning | 5 → hijau
        renderChartKepuasan(list) {
            const dist = [0, 0, 0, 0, 0];
            list.forEach(item => {
                const r = parseInt(item.rating);
                if (r >= 1 && r <= 5) dist[r - 1]++;
            });

            const bgColors = [
                'rgba(239,68,68,0.85)',   // ★1 – merah
                'rgba(239,68,68,0.65)',   // ★2 – merah muda
                'rgba(251,191,36,0.85)',  // ★3 – kuning
                'rgba(251,191,36,0.65)',  // ★4 – kuning muda
                'rgba(16,185,129,0.90)',  // ★5 – hijau
            ];
            const borderColors = [
                'rgb(239,68,68)',
                'rgb(239,68,68)',
                'rgb(251,191,36)',
                'rgb(251,191,36)',
                'rgb(16,185,129)',
            ];

            const ctx = document.getElementById('adminChartKepuasan');
            if (!ctx) return;
            if (this._chartKepuasan) this._chartKepuasan.destroy();

            this._chartKepuasan = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['★ 1', '★★ 2', '★★★ 3', '★★★★ 4', '★★★★★ 5'],
                    datasets: [{
                        label: 'Jumlah Ulasan',
                        data: dist,
                        backgroundColor: bgColors,
                        borderColor: borderColors,
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: c => ` ${c.parsed.y} ulasan` } }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#94a3b8' } },
                        y: { beginAtZero: true, ticks: { precision: 0, font: { size: 11 }, color: '#94a3b8' }, grid: { color: '#f1f5f9' } }
                    }
                }
            });
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
