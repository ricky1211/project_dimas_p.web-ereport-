<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Libraries\FirestoreClient;

class AuthController extends ResourceController
{
    protected $format = 'json';

    // POST /api/auth/login
    public function login()
    {
        $input    = $this->request->getJSON(true) ?? [];
        $email    = $input['email']    ?? $this->request->getPost('email')    ?? '';
        $password = $input['password'] ?? $this->request->getPost('password') ?? '';

        if (!$email || !$password) {
            return $this->respond([
                'status'  => 422,
                'error'   => 'Validation Error',
                'message' => 'Email dan password wajib diisi.',
            ], 422);
        }

        $db    = new FirestoreClient();
        $users = $db->collection('users')->where('email', '==', $email);

        if (empty($users)) {
            return $this->respond([
                'status'  => 401,
                'error'   => 'Unauthorized',
                'message' => 'Email atau password salah.',
            ], 401);
        }

        $userDoc = $users[0];
        $user    = $userDoc['data'];
        $userId  = $userDoc['id'];

        if (!password_verify($password, $user['password'] ?? '')) {
            return $this->respond([
                'status'  => 401,
                'error'   => 'Unauthorized',
                'message' => 'Email atau password salah.',
            ], 401);
        }

        // Generate token baru dan simpan ke Firestore
        $token = bin2hex(random_bytes(32));
        $db->collection('users')->doc($userId)->update([
            'token'      => $token,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);

        return $this->respond([
            'status'  => 200,
            'message' => 'Login berhasil.',
            'data'    => [
                'id'    => $userId,
                'nama'  => $user['nama']  ?? '',
                'email' => $user['email'] ?? '',
                'role'  => $user['role']  ?? 'petugas',
                'token' => $token,
            ],
        ]);
    }

    // POST /api/auth/logout
    public function logout()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
            $db    = new FirestoreClient();
            $users = $db->collection('users')->where('token', '==', $token);
            if (!empty($users)) {
                $db->collection('users')->doc($users[0]['id'])->update([
                    'token'      => '',
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Logout berhasil.',
        ]);
    }
}
