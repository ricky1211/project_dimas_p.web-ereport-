<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Libraries\FirestoreClient;

class PelaporController extends ResourceController
{
    protected $format = 'json';
    private FirestoreClient $db;

    public function __construct()
    {
        $this->db = new FirestoreClient();
    }

    // GET /api/pelapor
    public function index()
    {
        $docs = $this->db->collection('pelapor')->get();
        usort($docs, fn($a, $b) => strcmp($b['data']['created_at'] ?? '', $a['data']['created_at'] ?? ''));
        $data = array_map(fn($d) => array_merge(['id' => $d['id']], $d['data']), $docs);

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
        $doc = $this->db->collection('pelapor')->getById($id);
        if (!$doc) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Data pelapor tidak ditemukan.',
            ], 404);
        }
        return $this->respond([
            'status'  => 200,
            'message' => 'Detail pelapor berhasil diambil.',
            'data'    => array_merge(['id' => $doc['id']], $doc['data']),
        ]);
    }

    // POST /api/pelapor/create (PROTECTED)
    public function create()
    {
        $input    = $this->request->getJSON(true) ?? $this->request->getPost() ?? [];
        $required = ['nama_pelapor', 'nik', 'no_telepon', 'alamat'];
        foreach ($required as $f) {
            if (empty($input[$f])) {
                return $this->respond([
                    'status'  => 422,
                    'error'   => 'Validation Error',
                    'message' => [$f => "Field '{$f}' wajib diisi."],
                ], 422);
            }
        }

        $data = [
            'nama_pelapor' => $input['nama_pelapor'],
            'nik'          => $input['nik'],
            'no_telepon'   => $input['no_telepon'],
            'alamat'       => $input['alamat'],
            'created_at'   => date('Y-m-d H:i:s'),
            'updated_at'   => date('Y-m-d H:i:s'),
        ];

        $newId = $this->db->collection('pelapor')->add($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Data pelapor berhasil ditambahkan.',
            'data'    => array_merge(['id' => $newId], $data),
        ]);
    }

    // PUT /api/pelapor/update/:id (PROTECTED)
    public function update($id = null)
    {
        if (!$this->db->collection('pelapor')->getById($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Data pelapor tidak ditemukan.',
            ], 404);
        }

        $input  = $this->request->getJSON(true) ?? [];
        $update = [];
        foreach (['nama_pelapor', 'nik', 'no_telepon', 'alamat'] as $f) {
            if (isset($input[$f])) $update[$f] = $input[$f];
        }
        $update['updated_at'] = date('Y-m-d H:i:s');

        $this->db->collection('pelapor')->doc($id)->update($update);

        $doc = $this->db->collection('pelapor')->getById($id);
        return $this->respond([
            'status'  => 200,
            'message' => 'Data pelapor berhasil diperbarui.',
            'data'    => array_merge(['id' => $doc['id']], $doc['data']),
        ]);
    }

    // DELETE /api/pelapor/delete/:id (PROTECTED)
    public function delete($id = null)
    {
        if (!$this->db->collection('pelapor')->getById($id)) {
            return $this->respond([
                'status'  => 404,
                'error'   => 'Not Found',
                'message' => 'Data pelapor tidak ditemukan.',
            ], 404);
        }

        $this->db->collection('pelapor')->doc($id)->delete();

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Data pelapor berhasil dihapus.',
        ]);
    }
}
