<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class UserController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new UserModel();
        $users = $model->select('id, nama, email, role, created_at')->findAll();

        return $this->respond([
            'status' => 200,
            'message' => 'Data user berhasil diambil.',
            'data'   => $users,
        ]);
    }

    public function show($id = null)
    {
        $model = new UserModel();
        $user  = $model->select('id, nama, email, role, created_at')->find($id);

        if (!$user) {
            return $this->respond(['status' => 404, 'message' => 'User tidak ditemukan.'], 404);
        }

        return $this->respond(['status' => 200, 'data' => $user]);
    }

    public function create()
    {
        $model = new UserModel();
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'nama'     => 'required|min_length[3]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[6]',
            'role'     => 'in_list[admin,petugas]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond(['status' => 422, 'message' => $this->validator->getErrors()], 422);
        }

        $input['password'] = password_hash($input['password'], PASSWORD_DEFAULT);
        $id = $model->insert($input);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'User berhasil ditambahkan.',
            'data'    => $model->select('id, nama, email, role')->find($id),
        ]);
    }

    public function update($id = null)
    {
        $model = new UserModel();
        if (!$model->find($id)) {
            return $this->respond(['status' => 404, 'message' => 'User tidak ditemukan.'], 404);
        }

        $input = $this->request->getJSON(true) ?? [];
        if (!empty($input['password'])) {
            $input['password'] = password_hash($input['password'], PASSWORD_DEFAULT);
        } else {
            unset($input['password']);
        }

        $model->update($id, $input);
        return $this->respond(['status' => 200, 'message' => 'User berhasil diperbarui.']);
    }

    public function delete($id = null)
    {
        $model = new UserModel();
        if (!$model->find($id)) {
            return $this->respond(['status' => 404, 'message' => 'User tidak ditemukan.'], 404);
        }

        $model->delete($id);
        return $this->respondDeleted(['status' => 200, 'message' => 'User berhasil dihapus.']);
    }
}
