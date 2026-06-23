<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Libraries\FirestoreClient;

class DashboardController extends ResourceController
{
    protected $format = 'json';
    private FirestoreClient $db;

    public function __construct()
    {
        $this->db = new FirestoreClient();
    }

    private function getLoggedInUser(): ?array
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
            $users = $this->db->collection('users')->where('token', '==', $token);
            return empty($users) ? null : $users[0];
        }
        return null;
    }

    public function stats()
    {
        $user      = $this->getLoggedInUser();
        $isPetugas = ($user && ($user['data']['role'] ?? '') === 'petugas');
        $petugasId = $user ? $user['id'] : null;

        // Ambil semua data dari Firestore
        $semuaLaporan  = $this->db->collection('laporan')->get();
        $semuaKategori = $this->db->collection('kategori_aduan')->get();
        $semuaPelapor  = $this->db->collection('pelapor')->get();

        // Filter laporan berdasarkan petugas jika diperlukan
        if ($isPetugas) {
            $semuaLaporan = array_values(array_filter(
                $semuaLaporan,
                fn($d) => ($d['data']['petugas_id'] ?? '') === $petugasId
            ));
        }

        // Hitung per status
        $totalBaru     = 0;
        $totalDiproses = 0;
        $totalSelesai  = 0;
        $totalDitolak  = 0;
        foreach ($semuaLaporan as $d) {
            match ($d['data']['status'] ?? '') {
                'baru'     => $totalBaru++,
                'diproses' => $totalDiproses++,
                'selesai'  => $totalSelesai++,
                'ditolak'  => $totalDitolak++,
                default    => null,
            };
        }

        // Laporan terbaru 5 dengan relasi
        usort($semuaLaporan, fn($a, $b) => strcmp($b['data']['created_at'] ?? '', $a['data']['created_at'] ?? ''));
        $kategoriMap = [];
        foreach ($semuaKategori as $k) {
            $kategoriMap[$k['id']] = $k['data']['nama_kategori'] ?? '';
        }
        $pelaporMap = [];
        foreach ($semuaPelapor as $p) {
            $pelaporMap[$p['id']] = $p['data']['nama_pelapor'] ?? '';
        }
        $laporanTerbaru = [];
        foreach (array_slice($semuaLaporan, 0, 5) as $d) {
            $laporanTerbaru[] = [
                'id'              => $d['id'],
                'kode_laporan'    => $d['data']['kode_laporan']    ?? '',
                'judul_laporan'   => $d['data']['judul_laporan']   ?? '',
                'status'          => $d['data']['status']          ?? '',
                'tanggal_laporan' => $d['data']['tanggal_laporan'] ?? '',
                'catatan_petugas' => $d['data']['catatan_petugas'] ?? '',
                'rating'          => $d['data']['rating']          ?? 0,
                'feedback_warga'  => $d['data']['feedback_warga']  ?? '',
                'is_banding'      => $d['data']['is_banding']      ?? 0,
                'alasan_urgensi'  => $d['data']['alasan_urgensi']  ?? '',
                'nama_pelapor'    => $pelaporMap[$d['data']['pelapor_id'] ?? ''] ?? '-',
                'nama_kategori'   => $kategoriMap[$d['data']['kategori_id'] ?? ''] ?? '-',
            ];
        }

        // Statistik per kategori
        $statKategori = [];
        foreach ($semuaLaporan as $d) {
            $kid  = $d['data']['kategori_id'] ?? '';
            $nama = $kategoriMap[$kid] ?? 'Lainnya';
            if (!isset($statKategori[$nama])) $statKategori[$nama] = 0;
            $statKategori[$nama]++;
        }
        $statKategoriArr = [];
        foreach ($statKategori as $nama => $jumlah) {
            $statKategoriArr[] = ['nama_kategori' => $nama, 'jumlah' => $jumlah];
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Statistik dashboard berhasil diambil.',
            'data'    => [
                'total_laporan'  => count($semuaLaporan),
                'total_baru'     => $totalBaru,
                'total_diproses' => $totalDiproses,
                'total_selesai'  => $totalSelesai,
                'total_ditolak'  => $totalDitolak,
                'total_kategori' => count($semuaKategori),
                'total_pelapor'  => count($semuaPelapor),
                'laporan_terbaru'=> $laporanTerbaru,
                'stat_kategori'  => $statKategoriArr,
            ],
        ]);
    }
}
