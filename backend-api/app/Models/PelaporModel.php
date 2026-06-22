<?php

namespace App\Models;

use CodeIgniter\Model;

class PelaporModel extends Model
{
    protected $table            = 'pelapor';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    protected $allowedFields = [
        'nama_pelapor', 'nik', 'no_telepon', 'alamat'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'nama_pelapor' => 'required|min_length[3]',
        'nik'          => 'required|exact_length[16]|numeric',
        'no_telepon'   => 'required|min_length[10]',
        'alamat'       => 'required',
    ];
}
