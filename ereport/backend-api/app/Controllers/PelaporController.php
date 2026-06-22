<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\PelaporModel;

class PelaporController extends ResourceController
{
    protected $format    = 'json';
    protected $modelName = PelaporModel::class;

    // GET /api/pelapor
    public function index()
    {
        $model = new PelaporModel();
        $data  = $model->orderBy('created_at', 'DESC')->findAll();

        return $this->respond([
            'status'  => 200,
            'message' => 'Data pelapor berhasil diambil.',
            'count'   => count($data),
            'data'    => $data,
        ]);
    }

    // GET /api/pelapor/:id
    public function show($id = null)
    {
        $model = new PelaporModel();
        $data  = $model->find($id);

        if (!$data) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Data pelapor tidak ditemukan.',
            ], 404);
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Detail pelapor berhasil diambil.',
            'data'    => $data,
        ]);
    }

    // POST /api/pelapor/create (PROTECTED)
    public function create()
    {
        $model = new PelaporModel();
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
            'message' => 'Data pelapor berhasil ditambahkan.',
            'data'    => $model->find($id),
        ]);
    }

    // PUT /api/pelapor/update/:id (PROTECTED)
    public function update($id = null)
    {
        $model = new PelaporModel();

        if (!$model->find($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Data pelapor tidak ditemukan.',
            ], 404);
        }

        $input = $this->request->getJSON(true) ?? [];
        $model->update($id, $input);

        return $this->respond([
            'status'  => 200,
            'message' => 'Data pelapor berhasil diperbarui.',
            'data'    => $model->find($id),
        ]);
    }

    // DELETE /api/pelapor/delete/:id (PROTECTED)
    public function delete($id = null)
    {
        $model = new PelaporModel();

        if (!$model->find($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Data pelapor tidak ditemukan.',
            ], 404);
        }

        $model->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Data pelapor berhasil dihapus.',
        ]);
    }
}
