// components/Home.js
const HomeComponent = {
    template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-800">

        <!-- NAVBAR -->
        <nav class="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span class="text-white font-black text-lg">E</span>
                        </div>
                        <span class="text-slate-800 font-bold text-xl tracking-wide">E-Report</span>
                    </div>
                    <router-link to="/login"
                        class="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2 rounded-lg border border-slate-200 transition-colors text-sm shadow-sm">
                        🔐 Login Admin
                    </router-link>
                </div>
            </div>
        </nav>

        <!-- HERO SECTION -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
            <div class="inline-flex items-center bg-blue-50 text-blue-600 text-sm px-4 py-1.5 rounded-full mb-6 border border-blue-100 font-medium">
                📣 Sistem Pengaduan Resmi Layanan Masyarakat
            </div>
            <h1 class="text-5xl md:text-6xl font-black text-slate-800 leading-tight mb-4">
                Suarakan <span class="text-blue-600">Keluhanmu</span><br/>Kami Siap Merespons
            </h1>
            <p class="text-slate-550 text-lg max-w-2xl mx-auto mb-10">
                Platform pengaduan resmi warga. Laporkan masalah infrastruktur, keamanan, kebersihan,
                dan layanan publik secara mudah, cepat, dan transparan.
            </p>
        </div>

        <!-- TAB TOGGLE -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-center animate-fade-in">
            <div class="bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 inline-flex space-x-1 shadow-sm">
                <button @click="activeTab = 'dashboard'"
                    :class="activeTab === 'dashboard'
                        ? 'bg-white text-slate-850 shadow font-bold'
                        : 'text-slate-600 hover:bg-slate-200/50 font-semibold'"
                    class="px-6 py-3 rounded-xl text-sm transition-all flex items-center space-x-2">
                    <span>📊</span>
                    <span>Dashboard Laporan Masuk</span>
                </button>
                <button @click="activeTab = 'form'"
                    :class="activeTab === 'form'
                        ? 'bg-white text-slate-850 shadow font-bold'
                        : 'text-slate-600 hover:bg-slate-200/50 font-semibold'"
                    class="px-6 py-3 rounded-xl text-sm transition-all flex items-center space-x-2">
                    <span>✍️</span>
                    <span>Buat Pengaduan Warga</span>
                </button>
                <button @click="activeTab = 'lacak'"
                    :class="activeTab === 'lacak'
                        ? 'bg-white text-slate-850 shadow font-bold'
                        : 'text-slate-600 hover:bg-slate-200/50 font-semibold'"
                    class="px-6 py-3 rounded-xl text-sm transition-all flex items-center space-x-2">
                    <span>🔍</span>
                    <span>Lacak & Ulas Pengaduan</span>
                </button>
            </div>
        </div>

        <div v-if="activeTab === 'dashboard'" class="space-y-2">
            <!-- STATISTIK CARDS -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div v-for="i in 4" :key="i"
                        class="bg-slate-100 animate-pulse rounded-2xl h-28"></div>
                </div>

                <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm">
                        <p class="text-4xl font-black text-slate-800">{{ stats.total_laporan }}</p>
                        <p class="text-slate-500 text-sm mt-1 font-medium">Total Laporan</p>
                    </div>
                    <div class="bg-amber-50/80 border border-amber-100/70 rounded-2xl p-5 text-center shadow-sm">
                        <p class="text-4xl font-black text-amber-700">{{ stats.total_baru }}</p>
                        <p class="text-amber-800 text-sm mt-1 font-medium">Laporan Baru</p>
                    </div>
                    <div class="bg-sky-50/80 border border-sky-100/70 rounded-2xl p-5 text-center shadow-sm">
                        <p class="text-4xl font-black text-sky-700">{{ stats.total_diproses }}</p>
                        <p class="text-sky-850 text-sm mt-1 font-medium">Diproses</p>
                    </div>
                    <div class="bg-emerald-50/80 border border-emerald-100/70 rounded-2xl p-5 text-center shadow-sm">
                        <p class="text-4xl font-black text-emerald-700">{{ stats.total_selesai }}</p>
                        <p class="text-emerald-800 text-sm mt-1 font-medium">Terselesaikan</p>
                    </div>
                </div>
            </div>

            <!-- LAPORAN TERBARU -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <h2 class="text-slate-800 font-bold text-2xl mb-6">📋 Laporan Terbaru</h2>
                <div v-if="loading" class="space-y-3">
                    <div v-for="i in 3" :key="i" class="bg-slate-100 animate-pulse rounded-xl h-16"></div>
                </div>
                <div v-else class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                    <div v-if="stats.laporan_terbaru && stats.laporan_terbaru.length">
                        <div v-for="(item, idx) in stats.laporan_terbaru" :key="idx"
                            @click="clickLacakLaporan(item.kode_laporan)"
                            class="flex items-center justify-between px-6 py-4 border-b last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                            title="Klik untuk melacak & beri ulasan">
                            <div class="flex items-center space-x-4">
                                <span class="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                    {{ item.kode_laporan }}
                                </span>
                                <div>
                                    <p class="font-semibold text-gray-800 text-sm">{{ item.judul_laporan }}</p>
                                    <p class="text-gray-400 text-xs">{{ item.nama_kategori }} • {{ item.nama_pelapor }}</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <span v-if="item.rating" class="text-xs font-bold text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                                    ★ {{ item.rating }}
                                </span>
                                <span :class="badgeClass(item.status)"
                                    class="text-xs font-semibold px-3 py-1 rounded-full capitalize">
                                    {{ item.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="py-12 text-center text-gray-400">
                        Belum ada laporan yang masuk.
                    </div>
                </div>
            </div>

            <!-- TESTIMONIAL BOARD -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <h2 class="text-slate-800 font-bold text-2xl mb-6">💬 Ulasan & Feedback Warga</h2>
                <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="i in 3" :key="i" class="bg-slate-100 animate-pulse rounded-2xl h-40"></div>
                </div>
                <div v-else>
                    <div v-if="testimonials && testimonials.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div v-for="(item, idx) in testimonials" :key="idx"
                            class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                        {{ item.kode_laporan }}
                                    </span>
                                    <div class="flex items-center text-yellow-500 text-sm">
                                        <span v-for="star in parseInt(item.rating)" :key="star">★</span>
                                        <span v-for="star in (5 - parseInt(item.rating))" :key="'empty-'+star" class="text-gray-300">★</span>
                                    </div>
                                </div>
                                <p class="text-slate-700 text-sm italic mb-4 leading-relaxed">
                                    "{{ item.feedback_warga }}"
                                </p>
                            </div>
                            <div class="border-t border-slate-50 pt-4 mt-auto">
                                <p class="font-semibold text-slate-800 text-xs">{{ item.nama_pelapor }}</p>
                                <p class="text-slate-450 text-[10px] mt-0.5">{{ item.nama_kategori }} • Laporan {{ item.status }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="bg-white rounded-2xl border border-slate-100 py-12 text-center text-gray-400">
                        Belum ada ulasan kepuasan dari warga.
                    </div>
                </div>
            </div>

            <!-- GRAFIK SECTION -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <!-- Grafik Laporan Masuk -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="font-bold text-slate-800 text-base">📈 Grafik Laporan Masuk</h3>
                                <p class="text-slate-400 text-xs mt-0.5">7 hari terakhir</p>
                            </div>
                            <span class="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Harian</span>
                        </div>
                        <div class="relative" style="height:220px">
                            <canvas id="chartLaporanMasuk"></canvas>
                        </div>
                    </div>

                    <!-- Grafik Kepuasan -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="font-bold text-slate-800 text-base">⭐ Grafik Kepuasan Warga</h3>
                                <p class="text-slate-400 text-xs mt-0.5">Distribusi rating 1–5 bintang</p>
                            </div>
                            <div class="flex items-center gap-2 text-xs">
                                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block"></span><span class="text-slate-500">&lt; 3</span></span>
                                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block"></span><span class="text-slate-500">3–4</span></span>
                                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span><span class="text-slate-500">5 ⭐</span></span>
                            </div>
                        </div>
                        <div class="relative" style="height:220px">
                            <canvas id="chartKepuasan"></canvas>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- FORM PENGADUAN WARGA -->
        <div v-if="activeTab === 'form'" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100/80">
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
                            class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-md shadow-blue-100 transition-all text-sm disabled:opacity-50 flex items-center space-x-2">
                            <span>{{ submitting ? 'Mengirimkan...' : 'Kirim Pengaduan 🚀' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- LACAK & FEEDBACK -->
        <div v-if="activeTab === 'lacak'" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100/80">
                <div class="text-center mb-8">
                    <span class="text-3xl">🔍</span>
                    <h2 class="text-2xl font-black text-gray-800 mt-2">Lacak & Beri Feedback Laporan</h2>
                    <p class="text-gray-500 text-sm mt-1">Masukkan Kode Laporan Anda untuk melihat perkembangan status dan memberikan ulasan kepuasan.</p>
                </div>

                <div class="flex gap-3 mb-8 max-w-lg mx-auto">
                    <input v-model="lacakKode" type="text" placeholder="Contoh: RPT-2024-001"
                        class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all font-mono"
                        @keyup.enter="searchReport" />
                    <button @click="searchReport" :disabled="searchingReport"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm text-sm transition-colors disabled:opacity-50">
                        {{ searchingReport ? 'Mencari...' : 'Cari Laporan' }}
                    </button>
                </div>

                <div v-if="lacakError" class="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm text-center max-w-lg mx-auto mb-6">
                    <span>⚠️</span> <span>{{ lacakError }}</span>
                </div>

                <!-- Hasil Lacak Laporan -->
                <div v-if="lacakResult" class="border-t border-slate-100 pt-8 mt-8 space-y-6">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div>
                            <span class="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {{ lacakResult.kode_laporan }}
                            </span>
                            <h3 class="text-xl font-bold text-slate-800 mt-2">{{ lacakResult.judul_laporan }}</h3>
                            <p class="text-slate-400 text-xs mt-1">Kategori: {{ lacakResult.nama_kategori }} • Pelapor: {{ lacakResult.nama_pelapor }} • {{ lacakResult.tanggal_laporan }}</p>
                        </div>
                        <div>
                            <span :class="badgeClass(lacakResult.status)"
                                class="text-sm font-bold px-4 py-2 rounded-full capitalize shadow-sm">
                                Status: {{ lacakResult.status }}
                            </span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Detail -->
                        <div class="space-y-4">
                            <div>
                                <h4 class="text-xs uppercase tracking-wider font-semibold text-gray-400">Lokasi Kejadian</h4>
                                <p class="text-slate-700 text-sm font-medium mt-1">{{ lacakResult.lokasi }}</p>
                            </div>
                            <div>
                                <h4 class="text-xs uppercase tracking-wider font-semibold text-gray-400">Isi Laporan</h4>
                                <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line mt-1">{{ lacakResult.isi_laporan }}</p>
                            </div>
                        </div>

                        <!-- Catatan Petugas & Feedback -->
                        <div class="space-y-6">
                            <div class="bg-blue-50/50 border border-blue-100/65 p-5 rounded-2xl">
                                <h4 class="text-xs uppercase tracking-wider font-bold text-blue-700 mb-2">📋 Catatan Progres Petugas</h4>
                                <p v-if="lacakResult.catatan_petugas" class="text-slate-750 text-sm leading-relaxed whitespace-pre-line">
                                    {{ lacakResult.catatan_petugas }}
                                </p>
                                <p v-else class="text-slate-400 text-xs italic">
                                    Belum ada catatan atau pengerjaan dari petugas.
                                </p>
                            </div>

                            <!-- Rating & Feedback Warga -->
                            <div class="border-t border-slate-100 pt-6">
                                <!-- Jika status baru (belum bisa memberi feedback) -->
                                <div v-if="lacakResult.status === 'baru'" class="text-slate-400 text-xs italic">
                                    Feedback dan rating kepuasan dapat diberikan setelah laporan mulai dikerjakan (status diproses, selesai, atau ditolak).
                                </div>

                                <!-- Jika sudah diproses/selesai/ditolak -->
                                <div v-else>

                                    <!-- ── Sudah pernah memberi feedback: tampilkan + tombol Edit ── -->
                                    <div v-if="lacakResult.rating && !editingFeedback">
                                        <div class="bg-emerald-50/50 border border-emerald-100/60 p-5 rounded-2xl">
                                            <div class="flex items-start justify-between mb-3">
                                                <h4 class="text-xs uppercase tracking-wider font-bold text-emerald-800">
                                                    💚 {{ lacakResult.is_banding === '1' || lacakResult.is_banding === 1 ? 'Banding & Feedback Anda' : 'Feedback Anda' }}
                                                </h4>
                                                <button @click="startEditFeedback()"
                                                    class="text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                                                    ✏️ Edit Ulasan
                                                </button>
                                            </div>
                                            <div class="flex items-center space-x-0.5 text-yellow-500 text-xl mb-2">
                                                <span v-for="star in parseInt(lacakResult.rating)" :key="star">★</span>
                                                <span v-for="star in (5 - parseInt(lacakResult.rating))" :key="'empty-'+star" class="text-gray-300">★</span>
                                                <span class="text-slate-500 text-xs ml-2 font-semibold">({{ lacakResult.rating }}/5)</span>
                                            </div>
                                            <p class="text-slate-700 text-sm italic leading-relaxed">
                                                "{{ lacakResult.feedback_warga }}"
                                            </p>
                                            <div v-if="lacakResult.is_banding === '1' || lacakResult.is_banding === 1" class="mt-4 pt-4 border-t border-emerald-100/60">
                                                <h5 class="text-xs uppercase font-bold text-emerald-900 mb-1">Alasan Urgensi Banding:</h5>
                                                <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-white/60 p-3 rounded-lg border border-emerald-100/40">
                                                    {{ lacakResult.alasan_urgensi }}
                                                </p>
                                            </div>
                                        </div>
                                        <p class="text-slate-400 text-xs mt-2 text-center">Ulasan dapat diubah kapan saja selama laporan masih aktif.</p>
                                    </div>

                                    <!-- ── Form feedback (baru atau edit) ── -->
                                    <div v-if="!lacakResult.rating || editingFeedback" class="space-y-4">

                                        <!-- Judul form -->
                                        <div class="flex items-center justify-between">
                                            <h4 class="text-sm font-bold text-slate-800">
                                                {{ editingFeedback ? '✏️ Edit Ulasan & Rating' : (lacakResult.status === 'ditolak' ? 'Ajukan Banding & Ulasan' : 'Beri Rating Kepuasan & Ulasan') }}
                                            </h4>
                                            <button v-if="editingFeedback" @click="editingFeedback = false"
                                                class="text-xs text-slate-400 hover:text-slate-600">✕ Batal</button>
                                        </div>

                                        <!-- Info edit mode -->
                                        <div v-if="editingFeedback" class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-xs text-blue-700 flex items-center gap-2">
                                            <span>ℹ️</span><span>Ubah rating dan ulasan Anda di bawah, lalu klik Simpan.</span>
                                        </div>

                                        <!-- Checkbox Banding jika ditolak -->
                                        <div v-if="lacakResult.status === 'ditolak' && !editingFeedback" class="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex items-start space-x-3">
                                            <input v-model="feedbackForm.is_banding" type="checkbox" id="chk-banding"
                                                class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                            <label for="chk-banding" class="text-xs text-slate-700 select-none cursor-pointer">
                                                <span class="font-bold text-amber-900 block mb-0.5">Saya ingin mengajukan banding untuk diproses ulang</span>
                                                Jika dicentang, laporan Anda akan dimasukkan kembali ke antrean pengerjaan dengan alasan urgensi yang Anda berikan.
                                            </label>
                                        </div>

                                        <!-- Star selector -->
                                        <div>
                                            <label class="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Rating Kepuasan *</label>
                                            <div class="flex items-center space-x-1">
                                                <button v-for="star in 5" :key="star" type="button"
                                                    @click="feedbackForm.rating = star"
                                                    class="text-3xl focus:outline-none transition-transform hover:scale-110"
                                                    :class="star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'">
                                                    ★
                                                </button>
                                                <span v-if="feedbackForm.rating" class="ml-2 text-xs font-bold"
                                                    :class="feedbackForm.rating < 3 ? 'text-red-500' : feedbackForm.rating >= 5 ? 'text-emerald-600' : 'text-amber-500'">
                                                    {{ ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Puas'][feedbackForm.rating] }}
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Feedback text -->
                                        <div>
                                            <label class="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Ulasan *</label>
                                            <textarea v-model="feedbackForm.feedback_warga" rows="3" required placeholder="Tuliskan masukan Anda terhadap proses laporan ini..."
                                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm resize-none transition-all"></textarea>
                                        </div>

                                        <!-- Alasan Urgensi jika centang banding -->
                                        <div v-if="feedbackForm.is_banding && !editingFeedback">
                                            <label class="block text-xs uppercase tracking-wider font-bold text-amber-800 mb-2">Alasan Urgensi Banding *</label>
                                            <textarea v-model="feedbackForm.alasan_urgensi" rows="3" required placeholder="Jelaskan alasan urgensi/mendesak mengapa laporan Anda harus diproses ulang..."
                                                class="w-full px-4 py-3 bg-amber-50/20 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm resize-none transition-all"></textarea>
                                        </div>

                                        <div v-if="feedbackSuccess" class="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-xs flex items-center gap-2">
                                            <span>✅</span><span>{{ feedbackSuccess }}</span>
                                        </div>
                                        <div v-if="feedbackError" class="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex items-center gap-2">
                                            <span>⚠️</span><span>{{ feedbackError }}</span>
                                        </div>

                                        <button @click="submitFeedback" :disabled="submittingFeedback || !feedbackForm.rating"
                                            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-sm text-sm transition-all flex items-center justify-center gap-2">
                                            <svg v-if="submittingFeedback" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                            </svg>
                                            <span>{{ submittingFeedback ? 'Menyimpan...' : (editingFeedback ? '💾 Simpan Perubahan' : (feedbackForm.is_banding ? 'Kirim Banding & Ulasan 🚀' : 'Kirim Ulasan & Rating 🚀')) }}</span>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="border-t border-slate-100 py-6 text-center text-slate-400 text-sm mt-8">
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
            testimonials: [],
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
            },
            lacakKode: '',
            searchingReport: false,
            lacakError: '',
            lacakResult: null,
            feedbackSuccess: '',
            feedbackError: '',
            submittingFeedback: false,
            editingFeedback: false,
            feedbackForm: {
                rating: 0,
                feedback_warga: '',
                is_banding: false,
                alasan_urgensi: ''
            },
            _chartLaporan: null,
            _chartKepuasan: null,
        };
    },

    async mounted() {
        await Promise.all([this.fetchStats(), this.fetchKategori(), this.fetchTestimonials()]);
        await this.fetchAndRenderCharts();
    },

    unmounted() {
        if (this._chartLaporan) { this._chartLaporan.destroy(); this._chartLaporan = null; }
        if (this._chartKepuasan) { this._chartKepuasan.destroy(); this._chartKepuasan = null; }
    },

    watch: {
        activeTab(newTab) {
            if (newTab === 'dashboard') {
                this.$nextTick(() => {
                    this.fetchAndRenderCharts();
                });
            }
        }
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
        },

        clickLacakLaporan(kode) {
            this.activeTab = 'lacak';
            this.lacakKode = kode;
            this.searchReport();
        },

        async searchReport() {
            this.lacakError = '';
            this.lacakResult = null;
            this.feedbackSuccess = '';
            this.feedbackError = '';
            this.editingFeedback = false;
            this.feedbackForm = { rating: 0, feedback_warga: '', is_banding: false, alasan_urgensi: '' };

            if (!this.lacakKode) {
                this.lacakError = 'Silakan masukkan Kode Laporan.';
                return;
            }

            this.searchingReport = true;
            try {
                const res = await api.get('/laporan');
                const list = res.data.data || [];
                const found = list.find(item => item.kode_laporan.toUpperCase() === this.lacakKode.trim().toUpperCase());

                if (found) {
                    this.lacakResult = found;
                } else {
                    this.lacakError = 'Laporan dengan kode tersebut tidak ditemukan.';
                }
            } catch (e) {
                this.lacakError = 'Gagal memuat laporan. Silakan coba lagi.';
                console.error(e);
            } finally {
                this.searchingReport = false;
            }
        },

        async submitFeedback() {
            this.feedbackSuccess = '';
            this.feedbackError = '';

            if (this.feedbackForm.rating < 1 || this.feedbackForm.rating > 5) {
                this.feedbackError = 'Silakan pilih rating kepuasan (1-5 bintang).';
                return;
            }

            if (!this.feedbackForm.feedback_warga.trim()) {
                this.feedbackError = 'Ulasan feedback wajib diisi.';
                return;
            }

            if (this.feedbackForm.is_banding && !this.feedbackForm.alasan_urgensi.trim()) {
                this.feedbackError = 'Alasan urgensi banding wajib diisi.';
                return;
            }

            this.submittingFeedback = true;
            try {
                const payload = {
                    rating: this.feedbackForm.rating,
                    feedback_warga: this.feedbackForm.feedback_warga,
                    is_banding: this.feedbackForm.is_banding ? 1 : 0,
                    alasan_urgensi: this.feedbackForm.is_banding ? this.feedbackForm.alasan_urgensi : null
                };

                const res = await api.post(`/laporan/feedback/${this.lacakResult.id}`, payload);
                this.feedbackSuccess = res.data.message || 'Feedback berhasil dikirim!';
                
                this.lacakResult.rating = this.feedbackForm.rating;
                this.lacakResult.feedback_warga = this.feedbackForm.feedback_warga;
                this.lacakResult.is_banding = this.feedbackForm.is_banding ? 1 : 0;
                this.lacakResult.alasan_urgensi = this.feedbackForm.is_banding ? this.feedbackForm.alasan_urgensi : null;

                if (this.feedbackForm.is_banding) {
                    this.lacakResult.status = 'baru';
                }
                
                this.editingFeedback = false;
                
                await this.fetchStats();
                await this.fetchTestimonials();
            } catch (e) {
                this.feedbackError = e.response?.data?.message || 'Gagal mengirim ulasan. Silakan coba lagi.';
            } finally {
                this.submittingFeedback = false;
            }
        },

        startEditFeedback() {
            this.editingFeedback = true;
            this.feedbackForm.rating = parseInt(this.lacakResult.rating) || 0;
            this.feedbackForm.feedback_warga = this.lacakResult.feedback_warga || '';
            this.feedbackForm.is_banding = this.lacakResult.is_banding === '1' || this.lacakResult.is_banding === 1;
            this.feedbackForm.alasan_urgensi = this.lacakResult.alasan_urgensi || '';
        },

        async fetchTestimonials() {
            try {
                const res = await api.get('/laporan');
                const list = res.data.data || [];
                this.testimonials = list.filter(item => item.rating && item.feedback_warga);
            } catch (e) {
                console.error(e);
            }
        },

        // ── CHARTS ──────────────────────────────────────────────────────
        async fetchAndRenderCharts() {
            try {
                const res = await api.get('/laporan');
                const list = res.data.data || [];
                this.renderChartLaporan(list);
                this.renderChartKepuasan(list);
            } catch (e) {
                console.error('Chart fetch error', e);
            }
        },

        renderChartLaporan(list) {
            // Buat label 7 hari terakhir
            const days = [];
            const counts = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                const dateStr = d.toISOString().slice(0, 10); // YYYY-MM-DD
                days.push(label);
                const count = list.filter(item => {
                    const tgl = (item.tanggal_laporan || '').slice(0, 10);
                    return tgl === dateStr;
                }).length;
                counts.push(count);
            }

            const ctx = document.getElementById('chartLaporanMasuk');
            if (!ctx) return;
            if (this._chartLaporan) { this._chartLaporan.destroy(); }

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
                        tooltip: {
                            callbacks: {
                                label: ctx => ` ${ctx.parsed.y} laporan`
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 11 }, color: '#94a3b8' }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: { precision: 0, font: { size: 11 }, color: '#94a3b8' },
                            grid: { color: '#f1f5f9' }
                        }
                    }
                }
            });
        },

        renderChartKepuasan(list) {
            // Hitung distribusi rating 1–5
            const dist = [0, 0, 0, 0, 0]; // index 0 = rating 1
            list.forEach(item => {
                const r = parseInt(item.rating);
                if (r >= 1 && r <= 5) dist[r - 1]++;
            });

            // Warna: < 3 merah, 3-4 kuning, 5 hijau
            const colors = [
                'rgba(239,68,68,0.8)',   // 1 – merah
                'rgba(239,68,68,0.65)', // 2 – merah muda
                'rgba(251,191,36,0.8)', // 3 – kuning
                'rgba(251,191,36,0.65)',// 4 – kuning muda
                'rgba(16,185,129,0.85)',// 5 – hijau
            ];
            const borders = [
                'rgba(239,68,68,1)',
                'rgba(239,68,68,1)',
                'rgba(251,191,36,1)',
                'rgba(251,191,36,1)',
                'rgba(16,185,129,1)',
            ];

            const ctx = document.getElementById('chartKepuasan');
            if (!ctx) return;
            if (this._chartKepuasan) { this._chartKepuasan.destroy(); }

            this._chartKepuasan = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['★ 1', '★★ 2', '★★★ 3', '★★★★ 4', '★★★★★ 5'],
                    datasets: [{
                        label: 'Jumlah Ulasan',
                        data: dist,
                        backgroundColor: colors,
                        borderColor: borders,
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
                        tooltip: {
                            callbacks: {
                                label: ctx => ` ${ctx.parsed.y} ulasan`
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 11 }, color: '#94a3b8' }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: { precision: 0, font: { size: 11 }, color: '#94a3b8' },
                            grid: { color: '#f1f5f9' }
                        }
                    }
                }
            });
        }
    }
};
