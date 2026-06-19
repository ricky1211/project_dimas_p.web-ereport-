<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\LaporanModel;

class LaporanController extends ResourceController
{
    protected $format    = 'json';
    protected $modelName = LaporanModel::class;

    // GET /api/laporan
    public function index()
    {
        $model  = new LaporanModel();
        $status = $this->request->getGet('status');

        $data = $model->getLaporanWithRelations();

        if ($status) {
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
}
