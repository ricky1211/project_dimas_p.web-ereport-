<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\KategoriModel;

class KategoriController extends ResourceController
{
    protected $format    = 'json';
    protected $modelName = KategoriModel::class;

    // GET /api/kategori
    public function index()
    {
        $model = new KategoriModel();
        $data  = $model->orderBy('nama_kategori', 'ASC')->findAll();

        return $this->respond([
            'status'  => 200,
            'message' => 'Data kategori berhasil diambil.',
            'count'   => count($data),
            'data'    => $data,
        ]);
    }

    // GET /api/kategori/:id
    public function show($id = null)
    {
        $model = new KategoriModel();
        $data  = $model->find($id);

        if (!$data) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Detail kategori berhasil diambil.',
            'data'    => $data,
        ]);
    }

    // POST /api/kategori/create (PROTECTED)
    public function create()
    {
        $model = new KategoriModel();
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        if (!$model->validate($input)) {
            return $this->respond([
                'status'  => 422,
                'error'   => 'Validation Error',
                'message' => $model->errors(),
            ], 422);
        }

        $id = $model->insert($input);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Kategori berhasil ditambahkan.',
            'data'    => $model->find($id),
        ]);
    }

    // PUT /api/kategori/update/:id (PROTECTED)
    public function update($id = null)
    {
        $model = new KategoriModel();

        if (!$model->find($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }

        $input = $this->request->getJSON(true) ?? [];
        $model->update($id, $input);

        return $this->respond([
            'status'  => 200,
            'message' => 'Kategori berhasil diperbarui.',
            'data'    => $model->find($id),
        ]);
    }

    // DELETE /api/kategori/delete/:id (PROTECTED)
    public function delete($id = null)
    {
        $model = new KategoriModel();

        if (!$model->find($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }

        $model->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }
}
