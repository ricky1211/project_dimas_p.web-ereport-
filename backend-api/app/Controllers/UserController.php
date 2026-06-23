<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Libraries\FirestoreClient;

class UserController extends ResourceController
{
    protected $format = 'json';
    private FirestoreClient $db;

    public function __construct()
    {
        $this->db = new FirestoreClient();
    }

    // GET /api/users
    public function index()
    {
        $docs = $this->db->collection('users')->get();
        $data = array_map(function ($d) {
            $row = $d['data'];
            unset($row['password'], $row['token']);
            $row['id'] = $d['id'];
            return $row;
        }, $docs);

        return $this->respond([
            'status'  => 200,
            'message' => 'Data user berhasil diambil.',
            'data'    => array_values($data),
        ]);
    }

    // GET /api/users/:id
    public function show($id = null)
    {
        $doc = $this->db->collection('users')->getById($id);
        if (!$doc) {
            return $this->respond(['status' => 404, 'message' => 'User tidak ditemukan.'], 404);
        }
        $row = $doc['data'];
        unset($row['password'], $row['token']);
        $row['id'] = $doc['id'];
        return $this->respond(['status' => 200, 'data' => $row]);
    }

    // POST /api/users/create (PROTECTED)
    public function create()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost() ?? [];

        // Validasi
        if (empty($input['nama']) || empty($input['email']) || empty($input['password'])) {
            return $this->respond(['status' => 422, 'message' => 'Nama, email, dan password wajib diisi.'], 422);
        }

        // Cek email unik
        $existing = $this->db->collection('users')->where('email', '==', $input['email']);
        if (!empty($existing)) {
            return $this->respond(['status' => 422, 'message' => ['email' => 'Email sudah digunakan.']], 422);
        }

        $data = [
            'nama'       => $input['nama'],
            'email'      => $input['email'],
            'password'   => password_hash($input['password'], PASSWORD_DEFAULT),
            'role'       => $input['role'] ?? 'petugas',
            'token'      => '',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        $newId = $this->db->collection('users')->add($data);

        unset($data['password'], $data['token']);
        return $this->respondCreated([
            'status'  => 201,
            'message' => 'User berhasil ditambahkan.',
            'data'    => array_merge(['id' => $newId], $data),
        ]);
    }

    // PUT /api/users/update/:id (PROTECTED)
    public function update($id = null)
    {
        if (!$this->db->collection('users')->getById($id)) {
            return $this->respond(['status' => 404, 'message' => 'User tidak ditemukan.'], 404);
        }

        $input  = $this->request->getJSON(true) ?? [];
        $update = [];
        if (!empty($input['nama']))  $update['nama']  = $input['nama'];
        if (!empty($input['email'])) $update['email'] = $input['email'];
        if (!empty($input['role']))  $update['role']  = $input['role'];
        if (!empty($input['password'])) {
            $update['password'] = password_hash($input['password'], PASSWORD_DEFAULT);
        }
        $update['updated_at'] = date('Y-m-d H:i:s');

        $this->db->collection('users')->doc($id)->update($update);

        return $this->respond(['status' => 200, 'message' => 'User berhasil diperbarui.']);
    }

    // DELETE /api/users/delete/:id (PROTECTED)
    public function delete($id = null)
    {
        if (!$this->db->collection('users')->getById($id)) {
            return $this->respond(['status' => 404, 'message' => 'User tidak ditemukan.'], 404);
        }

        $this->db->collection('users')->doc($id)->delete();

        return $this->respondDeleted(['status' => 200, 'message' => 'User berhasil dihapus.']);
    }
}
