// js/api.js
// Konfigurasi Axios dengan Request & Response Interceptors

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ── REQUEST INTERCEPTOR ──────────────────────────────────────────
// Otomatis menyuntikkan token dari localStorage ke setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR ─────────────────────────────────────────
// Menangkap error 401 secara global → hapus sesi → redirect login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('isLoggedIn');
            alert('⚠️ Sesi Anda telah habis atau tidak valid. Silakan login kembali.');
            window.location.hash = '/login';
        }
        return Promise.reject(error);
    }
);
