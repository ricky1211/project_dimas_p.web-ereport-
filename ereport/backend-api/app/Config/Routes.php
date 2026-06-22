<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// Handle OPTIONS preflight untuk CORS
$routes->options('(:any)', static function () {
    return service('response')
        ->setStatusCode(200)
        ->setHeader('Access-Control-Allow-Origin', '*')
        ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

// =============================================
// ROUTE PUBLIK (Tanpa Token)
// =============================================

// Auth
$routes->post('api/auth/login', 'AuthController::login');
$routes->post('api/auth/logout', 'AuthController::logout');

// GET publik - data untuk landing page
$routes->get('api/laporan', 'LaporanController::index');
$routes->get('api/laporan/(:num)', 'LaporanController::show/$1');
$routes->post('api/laporan/public-create', 'LaporanController::publicCreate');
$routes->post('api/laporan/feedback/(:num)', 'LaporanController::submitFeedback/$1');
$routes->post('api/laporan/feedback-by-kode/(:segment)', 'LaporanController::feedbackByKode/$1');
$routes->get('api/kategori', 'KategoriController::index');
$routes->get('api/kategori/(:num)', 'KategoriController::show/$1');
$routes->get('api/pelapor', 'PelaporController::index');
$routes->get('api/pelapor/(:num)', 'PelaporController::show/$1');
$routes->get('api/dashboard/stats', 'DashboardController::stats');

// =============================================
// ROUTE TERPROTEKSI (Wajib Token - via filter)
// =============================================

// Laporan CRUD
$routes->post('api/laporan/create', 'LaporanController::create');
$routes->put('api/laporan/update/(:num)', 'LaporanController::update/$1');
$routes->delete('api/laporan/delete/(:num)', 'LaporanController::delete/$1');

// Kategori CRUD
$routes->post('api/kategori/create', 'KategoriController::create');
$routes->put('api/kategori/update/(:num)', 'KategoriController::update/$1');
$routes->delete('api/kategori/delete/(:num)', 'KategoriController::delete/$1');

// Pelapor CRUD
$routes->post('api/pelapor/create', 'PelaporController::create');
$routes->put('api/pelapor/update/(:num)', 'PelaporController::update/$1');
$routes->delete('api/pelapor/delete/(:num)', 'PelaporController::delete/$1');

// Users
$routes->get('api/users', 'UserController::index');
$routes->get('api/users/(:num)', 'UserController::show/$1');
$routes->post('api/users/create', 'UserController::create');
$routes->put('api/users/update/(:num)', 'UserController::update/$1');
$routes->delete('api/users/delete/(:num)', 'UserController::delete/$1');
