<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\LaporanModel;

class LaporanController extends ResourceController
{
    protected $format    = 'json';
    protected $modelName = LaporanModel::class;

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

    // GET /api/laporan
    public function index()
    {
        $model  = new LaporanModel();
        $status = $this->request->getGet('status');

        $user = $this->getLoggedInUser();
        $data = $model->getLaporanWithRelations();

        if ($user && $user['role'] === 'petugas') {
            // Petugas hanya melihat laporan yang ditugaskan kepadanya
            $data = array_filter($data, fn($item) => (int)$item['petugas_id'] === (int)$user['id']);
            $data = array_values($data);
        }

        if ($status && $status !== 'semua') {
            $data = array_filter($data, fn($item) => $item['status'] === $status);
            $data = array_values($data);
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Data laporan berhasil diambil.',
            'count'   => count($data),
            'data'    => $data,
        ]);
    }

    // GET /api/laporan/:id
    public function show($id = null)
    {
        $model = new LaporanModel();
        $data  = $model->getLaporanWithRelations($id);

        if (!$data) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Data laporan tidak ditemukan.',
            ], 404);
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Detail laporan berhasil diambil.',
            'data'    => $data,
        ]);
    }

    // POST /api/laporan/create (PROTECTED)
    public function create()
    {
        $model = new LaporanModel();
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        if (!$model->validate($input)) {
            return $this->respond([
                'status'  => 422,
                'error'   => 'Validation Error',
                'message' => $model->errors(),
            ], 422);
        }

        $input['kode_laporan'] = $model->generateKodeLaporan();

        // Handle upload foto jika ada
        $foto = $this->request->getFile('foto_bukti');
        if ($foto && $foto->isValid() && !$foto->hasMoved()) {
            $namaFoto = $foto->getRandomName();
            $foto->move(WRITEPATH . 'uploads/laporan', $namaFoto);
            $input['foto_bukti'] = $namaFoto;
        }

        $id = $model->insert($input);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Laporan berhasil ditambahkan.',
            'data'    => $model->getLaporanWithRelations($id),
        ]);
    }

    // PUT /api/laporan/update/:id (PROTECTED)
    public function update($id = null)
    {
        $model = new LaporanModel();

        if (!$model->find($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Laporan tidak ditemukan.',
            ], 404);
        }

        $input = $this->request->getJSON(true) ?? [];

        if (empty($input)) {
            $input = $this->request->getRawInput();
        }

        $model->update($id, $input);

        return $this->respond([
            'status'  => 200,
            'message' => 'Laporan berhasil diperbarui.',
            'data'    => $model->getLaporanWithRelations($id),
        ]);
    }

    // DELETE /api/laporan/delete/:id (PROTECTED)
    public function delete($id = null)
    {
        $model = new LaporanModel();

        if (!$model->find($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Laporan tidak ditemukan.',
            ], 404);
        }

        $model->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Laporan berhasil dihapus.',
        ]);
    }

    // POST /api/laporan/public-create
    public function publicCreate()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'nama_pelapor'   => 'required|min_length[3]',
            'nik'            => 'required|exact_length[16]|numeric',
            'no_telepon'     => 'required|min_length[10]',
            'alamat'         => 'required',
            'judul_laporan'  => 'required|min_length[5]',
            'isi_laporan'    => 'required|min_length[10]',
            'kategori_id'    => 'required|integer',
            'lokasi'         => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'  => 422,
                'error'   => 'Validation Error',
                'message' => $this->validator->getErrors(),
            ], 422);
        }

        // 1. Proses data pelapor (warga)
        $pelaporModel = new \App\Models\PelaporModel();
        $nik = $input['nik'];
        $pelapor = $pelaporModel->where('nik', $nik)->first();

        $pelaporData = [
            'nama_pelapor' => $input['nama_pelapor'],
            'nik'          => $nik,
            'no_telepon'   => $input['no_telepon'],
            'alamat'       => $input['alamat'],
        ];

        if ($pelapor) {
            $pelaporId = $pelapor['id'];
            $pelaporModel->update($pelaporId, $pelaporData);
        } else {
            $pelaporId = $pelaporModel->insert($pelaporData);
        }

        // 2. Proses data laporan
        $laporanModel = new LaporanModel();
        
        $foto_bukti = null;
        $foto = $this->request->getFile('foto_bukti');
        if ($foto && $foto->isValid() && !$foto->hasMoved()) {
            $namaFoto = $foto->getRandomName();
            $foto->move(WRITEPATH . 'uploads/laporan', $namaFoto);
            $foto_bukti = $namaFoto;
        } else if (!empty($input['foto_bukti'])) {
            $foto_bukti = $input['foto_bukti'];
        }

        $laporanData = [
            'kode_laporan'    => $laporanModel->generateKodeLaporan(),
            'pelapor_id'      => $pelaporId,
            'kategori_id'     => $input['kategori_id'],
            'petugas_id'      => null,
            'judul_laporan'   => $input['judul_laporan'],
            'isi_laporan'     => $input['isi_laporan'],
            'lokasi'          => $input['lokasi'],
            'foto_bukti'      => $foto_bukti,
            'status'          => 'baru',
            'tanggal_laporan' => $input['tanggal_laporan'] ?? date('Y-m-d'),
        ];

        $id = $laporanModel->insert($laporanData);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Pengaduan Anda berhasil dikirim.',
            'data'    => $laporanModel->getLaporanWithRelations($id),
        ]);
    }
}
