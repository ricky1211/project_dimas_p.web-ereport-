// components/Login.js
const LoginComponent = {
    template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex items-center justify-center px-4">
        <div class="w-full max-w-md">

            <!-- Card -->
            <div class="bg-white border border-slate-100 rounded-3xl shadow-lg p-8">

                <!-- Logo -->
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-100">
                        <span class="text-white font-black text-3xl">E</span>
                    </div>
                    <h1 class="text-2xl font-black text-gray-800">Masuk ke E-Report</h1>
                    <p class="text-gray-400 text-sm mt-1">Panel Administrasi Pengaduan</p>
                </div>

                <!-- Alert Error -->
                <div v-if="errorMsg"
                    class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm flex items-start gap-2">
                    <span class="mt-0.5">⚠️</span>
                    <span>{{ errorMsg }}</span>
                </div>

                <!-- Form -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                        <input
                            v-model="form.email"
                            type="email"
                            placeholder="admin@ereport.id"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                            @keyup.enter="doLogin"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                        <div class="relative">
                            <input
                                v-model="form.password"
                                :type="showPass ? 'text' : 'password'"
                                placeholder="••••••••"
                                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm pr-12"
                                @keyup.enter="doLogin"
                            />
                            <button
                                type="button"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                                @click="showPass = !showPass">
                                {{ showPass ? '🙈' : '👁️' }}
                            </button>
                        </div>
                    </div>

                    <button
                        @click="doLogin"
                        :disabled="loading"
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-100 text-sm">
                        <span v-if="loading">⏳ Memverifikasi...</span>
                        <span v-else>🔐 Masuk Sekarang</span>
                    </button>
                </div>

                <!-- Link kembali -->
                <div class="text-center mt-6">
                    <router-link to="/" class="text-blue-600 text-sm hover:underline font-medium">
                        ← Kembali ke Beranda
                    </router-link>
                </div>

                <!-- Info akun demo -->
                <div class="mt-6 bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
                    <p class="font-semibold mb-1">Akun Demo:</p>
                    <p>Email: <span class="font-mono text-blue-600">admin@ereport.id</span></p>
                    <p>Password: <span class="font-mono text-blue-600">password</span></p>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            form:     { email: '', password: '' },
            loading:  false,
            errorMsg: '',
            showPass: false,
        };
    },

    methods: {
        async doLogin() {
            this.errorMsg = '';
            if (!this.form.email || !this.form.password) {
                this.errorMsg = 'Email dan password wajib diisi.';
                return;
            }

            this.loading = true;
            try {
                const res = await api.post('/auth/login', this.form);
                const data = res.data.data;

                // Simpan ke localStorage
                localStorage.setItem('isLoggedIn',  'true');
                localStorage.setItem('auth_token',  data.token);
                localStorage.setItem('auth_user',   JSON.stringify({
                    id:    data.id,
                    nama:  data.nama,
                    email: data.email,
                    role:  data.role,
                }));

                this.$router.push('/dashboard');
            } catch (err) {
                this.errorMsg = err.response?.data?.message || 'Login gagal. Periksa kembali kredensial Anda.';
            } finally {
                this.loading = false;
            }
        }
    }
};
