<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class DashboardController extends ResourceController
{
    protected $format = 'json';

    private function getLoggedInUser()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
            $userModel = new \App\Models\UserModel();
            return $userModel->where('token', $token)->first();
        }
        return null;
    }

    public function stats()
    {
        $db = \Config\Database::connect();
        $user = $this->getLoggedInUser();
        $isPetugas = ($user && $user['role'] === 'petugas');
        $petugasId = $user ? $user['id'] : null;

        $totalLaporanQuery = $db->table('laporan');
        $totalBaruQuery = $db->table('laporan')->where('status', 'baru');
        $totalDiprosesQuery = $db->table('laporan')->where('status', 'diproses');
        $totalSelesaiQuery = $db->table('laporan')->where('status', 'selesai');
        $totalDitolakQuery = $db->table('laporan')->where('status', 'ditolak');

        if ($isPetugas) {
            $totalLaporanQuery->where('petugas_id', $petugasId);
            $totalBaruQuery->where('petugas_id', $petugasId);
            $totalDiprosesQuery->where('petugas_id', $petugasId);
            $totalSelesaiQuery->where('petugas_id', $petugasId);
            $totalDitolakQuery->where('petugas_id', $petugasId);
        }

        $totalLaporan  = $totalLaporanQuery->countAllResults();
        $totalBaru     = $totalBaruQuery->countAllResults();
        $totalDiproses = $totalDiprosesQuery->countAllResults();
        $totalSelesai  = $totalSelesaiQuery->countAllResults();
        $totalDitolak  = $totalDitolakQuery->countAllResults();
        
        $totalKategori = $db->table('kategori_aduan')->countAllResults();
        $totalPelapor  = $db->table('pelapor')->countAllResults();

        // Laporan terbaru 5
        $laporanTerbaruQuery = $db->table('laporan l')
            ->select('l.kode_laporan, l.judul_laporan, l.status, l.tanggal_laporan, p.nama_pelapor, k.nama_kategori')
            ->join('pelapor p', 'p.id = l.pelapor_id', 'left')
            ->join('kategori_aduan k', 'k.id = l.kategori_id', 'left');

        if ($isPetugas) {
            $laporanTerbaruQuery->where('l.petugas_id', $petugasId);
        }

        $laporanTerbaru = $laporanTerbaruQuery->orderBy('l.created_at', 'DESC')
            ->limit(5)
            ->get()
            ->getResultArray();

        // Statistik per kategori
        $statKategoriQuery = $db->table('laporan l')
            ->select('k.nama_kategori, COUNT(l.id) as jumlah')
            ->join('kategori_aduan k', 'k.id = l.kategori_id', 'left');

        if ($isPetugas) {
            $statKategoriQuery->where('l.petugas_id', $petugasId);
        }

        $statKategori = $statKategoriQuery->groupBy('k.nama_kategori')
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
