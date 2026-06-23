<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Libraries\FirestoreClient;

class LaporanController extends ResourceController
{
    protected $format = 'json';

    private FirestoreClient $db;

    public function __construct()
    {
        $this->db = new FirestoreClient();
    }

    // Ambil user dari Bearer token
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

    // Embed relasi (kategori, pelapor, petugas) ke dalam data laporan
    private function embedRelasi(array $laporanDoc): array
    {
        $data = $laporanDoc['data'];
        $data['id'] = $laporanDoc['id'];

        if (!empty($data['kategori_id'])) {
            $kat = $this->db->collection('kategori_aduan')->getById($data['kategori_id']);
            $data['nama_kategori'] = $kat['data']['nama_kategori'] ?? '-';
        }
        if (!empty($data['pelapor_id'])) {
            $pel = $this->db->collection('pelapor')->getById($data['pelapor_id']);
            $pelData = $pel['data'] ?? [];
            $data['nama_pelapor'] = $pelData['nama_pelapor'] ?? '-';
            $data['nik']          = $pelData['nik']          ?? '';
            $data['no_telepon']   = $pelData['no_telepon']   ?? '';
        }
        if (!empty($data['petugas_id'])) {
            $pet = $this->db->collection('users')->getById($data['petugas_id']);
            $data['nama_petugas'] = $pet['data']['nama'] ?? '-';
        } else {
            $data['nama_petugas'] = '';
        }
        return $data;
    }

    // Generate kode laporan otomatis: RPT-YYYY-NNN
    private function generateKodeLaporan(): string
    {
        $year     = date('Y');
        $semua    = $this->db->collection('laporan')->get();
        $filtered = array_filter($semua, fn($d) => str_starts_with($d['data']['kode_laporan'] ?? '', "RPT-{$year}"));
        $kodes    = array_column(array_column($filtered, 'data'), 'kode_laporan');
        $nums     = [];
        foreach ($kodes as $k) {
            $parts = explode('-', $k);
            if (count($parts) === 3) $nums[] = (int) $parts[2];
        }
        $next = empty($nums) ? 1 : max($nums) + 1;
        return 'RPT-' . $year . '-' . str_pad($next, 3, '0', STR_PAD_LEFT);
    }

    // GET /api/laporan
    public function index()
    {
        $user   = $this->getLoggedInUser();
        $status = $this->request->getGet('status');
        $semua  = $this->db->collection('laporan')->get();

        // Filter berdasarkan petugas_id jika role petugas
        if ($user && ($user['data']['role'] ?? '') === 'petugas') {
            $semua = array_filter($semua, fn($d) => ($d['data']['petugas_id'] ?? '') === $user['id']);
            $semua = array_values($semua);
        }

        // Filter berdasarkan status
        if ($status && $status !== 'semua') {
            $semua = array_filter($semua, fn($d) => ($d['data']['status'] ?? '') === $status);
            $semua = array_values($semua);
        }

        // Urutkan terbaru dulu
        usort($semua, fn($a, $b) => strcmp($b['data']['created_at'] ?? '', $a['data']['created_at'] ?? ''));

        $data = array_map([$this, 'embedRelasi'], $semua);

        return $this->respond([
            'status'  => 200,
            'message' => 'Data laporan berhasil diambil.',
            'count'   => count($data),
            'data'    => array_values($data),
        ]);
    }

    // GET /api/laporan/:id
    public function show($id = null)
    {
        $doc = $this->db->collection('laporan')->getById($id);

        if (!$doc) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Data laporan tidak ditemukan.',
            ], 404);
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Detail laporan berhasil diambil.',
            'data'    => $this->embedRelasi($doc),
        ]);
    }

    // POST /api/laporan/create (PROTECTED)
    public function create()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost() ?? [];

        // Validasi wajib
        $required = ['pelapor_id', 'kategori_id', 'judul_laporan', 'isi_laporan', 'lokasi', 'tanggal_laporan'];
        foreach ($required as $f) {
            if (empty($input[$f])) {
                return $this->respond([
                    'status'  => 422,
                    'error'   => 'Validation Error',
                    'message' => "Field '{$f}' wajib diisi.",
                ], 422);
            }
        }

        // Handle upload foto jika ada
        $fotoBukti = $input['foto_bukti'] ?? null;
        $foto      = $this->request->getFile('foto_bukti');
        if ($foto && $foto->isValid() && !$foto->hasMoved()) {
            $namaFoto  = $foto->getRandomName();
            $foto->move(WRITEPATH . 'uploads/laporan', $namaFoto);
            $fotoBukti = $namaFoto;
        }

        $laporanData = [
            'kode_laporan'    => $this->generateKodeLaporan(),
            'pelapor_id'      => $input['pelapor_id'],
            'kategori_id'     => $input['kategori_id'],
            'petugas_id'      => $input['petugas_id'] ?? '',
            'judul_laporan'   => $input['judul_laporan'],
            'isi_laporan'     => $input['isi_laporan'],
            'lokasi'          => $input['lokasi'],
            'foto_bukti'      => $fotoBukti ?? '',
            'status'          => 'baru',
            'tanggal_laporan' => $input['tanggal_laporan'],
            'catatan_petugas' => '',
            'rating'          => 0,
            'feedback_warga'  => '',
            'is_banding'      => 0,
            'alasan_urgensi'  => '',
            'created_at'      => date('Y-m-d H:i:s'),
            'updated_at'      => date('Y-m-d H:i:s'),
        ];

        $newId = $this->db->collection('laporan')->add($laporanData);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Laporan berhasil ditambahkan.',
            'data'    => $this->embedRelasi(['id' => $newId, 'data' => $laporanData]),
        ]);
    }

    // PUT /api/laporan/update/:id (PROTECTED)
    public function update($id = null)
    {
        $doc = $this->db->collection('laporan')->getById($id);
        if (!$doc) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Laporan tidak ditemukan.',
            ], 404);
        }

        $input = $this->request->getJSON(true) ?? [];
        if (empty($input)) {
            parse_str($this->request->getRawInput(), $input);
        }

        $allowed = [
            'judul_laporan', 'isi_laporan', 'lokasi', 'status',
            'catatan_petugas', 'petugas_id', 'foto_bukti',
            'tanggal_laporan', 'kategori_id',
        ];
        $update = [];
        foreach ($allowed as $key) {
            if (array_key_exists($key, $input)) {
                $update[$key] = $input[$key] === '' ? '' : $input[$key];
            }
        }
        $update['updated_at'] = date('Y-m-d H:i:s');

        $this->db->collection('laporan')->doc($id)->update($update);

        return $this->respond([
            'status'  => 200,
            'message' => 'Laporan berhasil diperbarui.',
            'data'    => $this->embedRelasi($this->db->collection('laporan')->getById($id)),
        ]);
    }

    // DELETE /api/laporan/delete/:id (PROTECTED)
    public function delete($id = null)
    {
        if (!$this->db->collection('laporan')->getById($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Laporan tidak ditemukan.',
            ], 404);
        }

        $this->db->collection('laporan')->doc($id)->delete();

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Laporan berhasil dihapus.',
        ]);
    }

    // POST /api/laporan/public-create (PUBLIK - tanpa auth)
    public function publicCreate()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost() ?? [];

        $required = [
            'nama_pelapor', 'nik', 'no_telepon', 'alamat',
            'judul_laporan', 'isi_laporan', 'kategori_id', 'lokasi',
        ];
        foreach ($required as $f) {
            if (empty($input[$f])) {
                return $this->respond([
                    'status'  => 422,
                    'error'   => 'Validation Error',
                    'message' => "Field '{$f}' wajib diisi.",
                ], 422);
            }
        }

        // 1. Cari atau buat pelapor berdasarkan NIK
        $nik          = $input['nik'];
        $pelaporExist = $this->db->collection('pelapor')->where('nik', '==', $nik);
        $pelaporData  = [
            'nama_pelapor' => $input['nama_pelapor'],
            'nik'          => $nik,
            'no_telepon'   => $input['no_telepon'],
            'alamat'       => $input['alamat'],
            'updated_at'   => date('Y-m-d H:i:s'),
        ];

        if (!empty($pelaporExist)) {
            $pelaporId = $pelaporExist[0]['id'];
            $this->db->collection('pelapor')->doc($pelaporId)->update($pelaporData);
        } else {
            $pelaporData['created_at'] = date('Y-m-d H:i:s');
            $pelaporId = $this->db->collection('pelapor')->add($pelaporData);
        }

        // 2. Handle foto
        $fotoBukti = $input['foto_bukti'] ?? '';
        $foto      = $this->request->getFile('foto_bukti');
        if ($foto && $foto->isValid() && !$foto->hasMoved()) {
            $namaFoto  = $foto->getRandomName();
            $foto->move(WRITEPATH . 'uploads/laporan', $namaFoto);
            $fotoBukti = $namaFoto;
        }

        // 3. Buat laporan
        $laporanData = [
            'kode_laporan'    => $this->generateKodeLaporan(),
            'pelapor_id'      => $pelaporId,
            'kategori_id'     => $input['kategori_id'],
            'petugas_id'      => '',
            'judul_laporan'   => $input['judul_laporan'],
            'isi_laporan'     => $input['isi_laporan'],
            'lokasi'          => $input['lokasi'],
            'foto_bukti'      => $fotoBukti,
            'status'          => 'baru',
            'tanggal_laporan' => $input['tanggal_laporan'] ?? date('Y-m-d'),
            'catatan_petugas' => '',
            'rating'          => 0,
            'feedback_warga'  => '',
            'is_banding'      => 0,
            'alasan_urgensi'  => '',
            'created_at'      => date('Y-m-d H:i:s'),
            'updated_at'      => date('Y-m-d H:i:s'),
        ];

        $newId = $this->db->collection('laporan')->add($laporanData);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Pengaduan Anda berhasil dikirim.',
            'data'    => $this->embedRelasi(['id' => $newId, 'data' => $laporanData]),
        ]);
    }

    // POST /api/laporan/feedback/:id
    public function submitFeedback($id = null)
    {
        $doc = $this->db->collection('laporan')->getById($id);
        if (!$doc) {
            return $this->respond(['status' => 404, 'message' => 'Laporan tidak ditemukan.'], 404);
        }

        $laporan = $doc['data'];

        if (!in_array($laporan['status'] ?? '', ['diproses', 'selesai', 'ditolak'])) {
            return $this->respond([
                'status'  => 400,
                'message' => 'Feedback hanya dapat diberikan jika laporan diproses, selesai, atau ditolak.',
            ], 400);
        }

        $input = $this->request->getJSON(true) ?? $this->request->getPost() ?? [];

        $updateData = [
            'rating'         => (int) ($input['rating'] ?? 0),
            'feedback_warga' => $input['feedback_warga'] ?? '',
            'updated_at'     => date('Y-m-d H:i:s'),
        ];

        $isBanding = isset($input['is_banding']) && (int) $input['is_banding'] === 1 && ($laporan['status'] ?? '') === 'ditolak';
        if ($isBanding) {
            $updateData['is_banding']    = 1;
            $updateData['alasan_urgensi'] = $input['alasan_urgensi'] ?? '';
            $updateData['status']         = 'baru';
        }

        $this->db->collection('laporan')->doc($id)->update($updateData);

        return $this->respond([
            'status'  => 200,
            'message' => $isBanding
                ? 'Banding dan ulasan berhasil diajukan. Laporan akan ditinjau kembali.'
                : 'Ulasan berhasil disimpan. Terima kasih!',
            'data'    => $this->embedRelasi($this->db->collection('laporan')->getById($id)),
        ]);
    }

    // POST /api/laporan/feedback-by-kode/:kode (PUBLIK)
    public function feedbackByKode($kode = null)
    {
        $docs = $this->db->collection('laporan')->where('kode_laporan', '==', $kode);
        if (empty($docs)) {
            return $this->respond(['status' => 404, 'message' => 'Laporan tidak ditemukan.'], 404);
        }

        $doc     = $docs[0];
        $id      = $doc['id'];
        $laporan = $doc['data'];

        if (!in_array($laporan['status'] ?? '', ['diproses', 'selesai', 'ditolak'])) {
            return $this->respond([
                'status'  => 400,
                'message' => 'Feedback hanya dapat diberikan jika laporan diproses, selesai, atau ditolak.',
            ], 400);
        }

        $input = $this->request->getJSON(true) ?? $this->request->getPost() ?? [];

        $updateData = [
            'rating'         => (int) ($input['rating'] ?? 0),
            'feedback_warga' => $input['feedback_warga'] ?? '',
            'is_banding'     => 0,
            'alasan_urgensi' => '',
            'updated_at'     => date('Y-m-d H:i:s'),
        ];

        $isBanding = isset($input['is_banding']) && (int) $input['is_banding'] === 1 && ($laporan['status'] ?? '') === 'ditolak';
        if ($isBanding) {
            $updateData['is_banding']    = 1;
            $updateData['alasan_urgensi'] = $input['alasan_urgensi'] ?? '';
            $updateData['status']         = 'baru';
        }

        $this->db->collection('laporan')->doc($id)->update($updateData);

        return $this->respond([
            'status'  => 200,
            'message' => $isBanding
                ? 'Banding dan ulasan berhasil diajukan. Laporan akan ditinjau kembali.'
                : 'Ulasan berhasil disimpan. Terima kasih!',
            'data'    => $this->embedRelasi($this->db->collection('laporan')->getById($id)),
        ]);
    }
}
