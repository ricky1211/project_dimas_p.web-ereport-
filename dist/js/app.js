// js/app.js
const app = Vue.createApp({});
app.use(router);

// Tunggu sistem navigasi router siap 100% baru tampilkan UI
router.isReady().then(() => {
    app.mount('#app');
});