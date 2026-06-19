<?php

namespace App\Models;

use CodeIgniter\Model;

class LaporanModel extends Model
{
    protected $table            = 'laporan';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    protected $allowedFields = [
        'kode_laporan', 'pelapor_id', 'kategori_id', 'petugas_id', 'judul_laporan',
        'isi_laporan', 'lokasi', 'foto_bukti', 'status',
        'tanggal_laporan', 'catatan_petugas'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'pelapor_id'     => 'required|integer',
        'kategori_id'    => 'required|integer',
        'judul_laporan'  => 'required|min_length[5]',
        'isi_laporan'    => 'required|min_length[10]',
        'lokasi'         => 'required',
        'tanggal_laporan'=> 'required|valid_date',
    ];

    // Join dengan tabel relasi untuk mendapatkan nama kategori, pelapor, & petugas
    public function getLaporanWithRelations($id = null)
    {
        $builder = $this->db->table('laporan l')
            ->select('l.*, p.nama_pelapor, p.nik, p.no_telepon, k.nama_kategori, u.nama as nama_petugas')
            ->join('pelapor p', 'p.id = l.pelapor_id', 'left')
            ->join('kategori_aduan k', 'k.id = l.kategori_id', 'left')
            ->join('users u', 'u.id = l.petugas_id', 'left')
            ->orderBy('l.created_at', 'DESC');

        if ($id !== null) {
            return $builder->where('l.id', $id)->get()->getRowArray();
        }

        return $builder->get()->getResultArray();
    }

    // Generate kode laporan otomatis
    public function generateKodeLaporan(): string
    {
        $year = date('Y');
        $count = $this->where('YEAR(tanggal_laporan)', $year)->countAllResults();
        return 'RPT-' . $year . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);
    }
}
