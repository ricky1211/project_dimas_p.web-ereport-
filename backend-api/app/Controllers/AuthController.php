<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'  => 422,
                'error'   => 'Validation Error',
                'message' => $this->validator->getErrors(),
            ], 422);
        }

        $userModel = new UserModel();
        $email     = $this->request->getJSON(true)['email'] ?? $this->request->getPost('email');
        $password  = $this->request->getJSON(true)['password'] ?? $this->request->getPost('password');

        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->respond([
                'status'  => 401,
                'error'   => 'Unauthorized',
                'message' => 'Email atau password salah.',
            ], 401);
        }

        // Generate token
        $token = bin2hex(random_bytes(32));
        $userModel->update($user['id'], ['token' => $token]);

        return $this->respond([
            'status'  => 200,
            'message' => 'Login berhasil.',
            'data'    => [
                'id'    => $user['id'],
                'nama'  => $user['nama'],
                'email' => $user['email'],
                'role'  => $user['role'],
                'token' => $token,
            ],
        ], 200);
    }

    public function logout()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
            $userModel = new UserModel();
            $user = $userModel->where('token', $token)->first();
            if ($user) {
                $userModel->update($user['id'], ['token' => null]);
            }
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Logout berhasil.',
        ], 200);
    }
}
