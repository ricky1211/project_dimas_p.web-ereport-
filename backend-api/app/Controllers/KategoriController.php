<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Libraries\FirestoreClient;

class KategoriController extends ResourceController
{
    protected $format = 'json';
    private FirestoreClient $db;

    public function __construct()
    {
        $this->db = new FirestoreClient();
    }

    // GET /api/kategori
    public function index()
    {
        $docs = $this->db->collection('kategori_aduan')->get();
        usort($docs, fn($a, $b) => strcmp($a['data']['nama_kategori'] ?? '', $b['data']['nama_kategori'] ?? ''));
        $data = array_map(fn($d) => array_merge(['id' => $d['id']], $d['data']), $docs);

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
        $doc = $this->db->collection('kategori_aduan')->getById($id);
        if (!$doc) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }
        return $this->respond([
            'status'  => 200,
            'message' => 'Detail kategori berhasil diambil.',
            'data'    => array_merge(['id' => $doc['id']], $doc['data']),
        ]);
    }

    // POST /api/kategori/create (PROTECTED)
    public function create()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost() ?? [];

        if (empty($input['nama_kategori'])) {
            return $this->respond([
                'status'  => 422,
                'error'   => 'Validation Error',
                'message' => ['nama_kategori' => 'Nama kategori wajib diisi.'],
            ], 422);
        }

        $data = [
            'nama_kategori' => $input['nama_kategori'],
            'deskripsi'     => $input['deskripsi'] ?? '',
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s'),
        ];

        $newId = $this->db->collection('kategori_aduan')->add($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Kategori berhasil ditambahkan.',
            'data'    => array_merge(['id' => $newId], $data),
        ]);
    }

    // PUT /api/kategori/update/:id (PROTECTED)
    public function update($id = null)
    {
        if (!$this->db->collection('kategori_aduan')->getById($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }

        $input  = $this->request->getJSON(true) ?? [];
        $update = [];
        if (isset($input['nama_kategori'])) $update['nama_kategori'] = $input['nama_kategori'];
        if (isset($input['deskripsi']))     $update['deskripsi']     = $input['deskripsi'];
        $update['updated_at'] = date('Y-m-d H:i:s');

        $this->db->collection('kategori_aduan')->doc($id)->update($update);

        $doc = $this->db->collection('kategori_aduan')->getById($id);
        return $this->respond([
            'status'  => 200,
            'message' => 'Kategori berhasil diperbarui.',
            'data'    => array_merge(['id' => $doc['id']], $doc['data']),
        ]);
    }

    // DELETE /api/kategori/delete/:id (PROTECTED)
    public function delete($id = null)
    {
        if (!$this->db->collection('kategori_aduan')->getById($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }

        $this->db->collection('kategori_aduan')->doc($id)->delete();

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }
}
