<?php

namespace App\Models;

use CodeIgniter\Model;

class KategoriModel extends Model
{
    protected $table            = 'kategori_aduan';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    protected $allowedFields = [
        'nama_kategori', 'deskripsi'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'nama_kategori' => 'required|min_length[3]',
    ];

    protected $validationMessages = [
        'nama_kategori' => [
            'required' => 'Nama kategori wajib diisi.',
        ],
    ];
}
