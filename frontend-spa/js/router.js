// js/router.js
// Konfigurasi Vue Router dengan Navigation Guard

const routes = [
    {
        path: '/',
        component: HomeComponent,
        meta: { requiresAuth: false }
    },
    {
        path: '/login',
        component: LoginComponent,
        meta: { requiresAuth: false }
    },
    {
        path: '/dashboard',
        component: DashboardComponent,
        meta: { requiresAuth: true }
    },
    {
        path: '/laporan',
        component: LaporanComponent,
        meta: { requiresAuth: true }
    },
    {
        path: '/kategori',
        component: KategoriComponent,
        meta: { requiresAuth: true }
    },
    {
        path: '/pelapor',
        component: PelaporComponent,
        meta: { requiresAuth: true }
    },
    // Redirect semua path tidak dikenal ke home
    { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

// ── NAVIGATION GUARD ─────────────────────────────────────────────
// Cegat akses ke rute requiresAuth jika belum login
router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (to.meta.requiresAuth && !isLoggedIn) {
        // Belum login → lempar ke halaman login
        next({ path: '/login' });
    } else if (to.path === '/login' && isLoggedIn) {
        // Sudah login tapi akses halaman login → redirect ke dashboard
        next({ path: '/dashboard' });
    } else {
        next();
    }
});
