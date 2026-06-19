<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Filters\CSRF;
use CodeIgniter\Filters\DebugToolbar;
use CodeIgniter\Filters\Honeypot;
use CodeIgniter\Filters\InvalidChars;
use CodeIgniter\Filters\SecureHeaders;

class Filters extends BaseConfig
{
    public array $aliases = [
        'csrf'          => CSRF::class,
        'toolbar'       => DebugToolbar::class,
        'honeypot'      => Honeypot::class,
        'invalidchars'  => InvalidChars::class,
        'secureheaders' => SecureHeaders::class,
        'cors'          => \App\Filters\CorsFilter::class,
        'auth'          => \App\Filters\AuthFilter::class,
    ];

    public array $globals = [
        'before' => [
            'cors',
            // 'honeypot',
            // 'csrf',
            // 'invalidchars',
        ],
        'after' => [
            'cors',
            'toolbar',
            // 'honeypot',
            // 'secureheaders',
        ],
    ];

    public array $methods = [];

    public array $filters = [
        'auth' => [
            'before' => [
                'api/laporan/create',
                'api/laporan/update/*',
                'api/laporan/delete/*',
                'api/kategori/create',
                'api/kategori/update/*',
                'api/kategori/delete/*',
                'api/pelapor/create',
                'api/pelapor/update/*',
                'api/pelapor/delete/*',
                'api/users/*',
            ],
        ],
    ];
}
