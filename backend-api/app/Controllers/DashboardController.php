<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class DashboardController extends ResourceController
{
    protected $format = 'json';

    public function stats()
    {
        $db = \Config\Database::connect();

        $totalLaporan  = $db->table('laporan')->countAllResults();
        $totalBaru     = $db->table('laporan')->where('status', 'baru')->countAllResults();
        $totalDiproses = $db->table('laporan')->where('status', 'diproses')->countAllResults();
        $totalSelesai  = $db->table('laporan')->where('status', 'selesai')->countAllResults();
        $totalDitolak  = $db->table('laporan')->where('status', 'ditolak')->countAllResults();
        $totalKategori = $db->table('kategori_aduan')->countAllResults();
        $totalPelapor  = $db->table('pelapor')->countAllResults();

        // Laporan terbaru 5
        $laporanTerbaru = $db->table('laporan l')
            ->select('l.kode_laporan, l.judul_laporan, l.status, l.tanggal_laporan, p.nama_pelapor, k.nama_kategori')
            ->join('pelapor p', 'p.id = l.pelapor_id', 'left')
            ->join('kategori_aduan k', 'k.id = l.kategori_id', 'left')
            ->orderBy('l.created_at', 'DESC')
            ->limit(5)
            ->get()
            ->getResultArray();

        // Statistik per kategori
        $statKategori = $db->table('laporan l')
            ->select('k.nama_kategori, COUNT(l.id) as jumlah')
            ->join('kategori_aduan k', 'k.id = l.kategori_id', 'left')
            ->groupBy('k.nama_kategori')
            ->get()
            ->getResultArray();

        return $this->respond([
            'status'  => 200,
            'message' => 'Statistik dashboard berhasil diambil.',
            'data'    => [
                'total_laporan'  => $totalLaporan,
                'total_baru'     => $totalBaru,
                'total_diproses' => $totalDiproses,
                'total_selesai'  => $totalSelesai,
                'total_ditolak'  => $totalDitolak,
                'total_kategori' => $totalKategori,
                'total_pelapor'  => $totalPelapor,
                'laporan_terbaru'=> $laporanTerbaru,
                'stat_kategori'  => $statKategori,
            ],
        ]);
    }
}
