<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\UserModel;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return service('response')
                ->setStatusCode(401)
                ->setContentType('application/json')
                ->setJSON([
                    'status'  => 401,
                    'error'   => 'Unauthorized',
                    'message' => 'Token tidak ditemukan. Harap login terlebih dahulu.'
                ]);
        }

        $token = substr($authHeader, 7);

        $userModel = new UserModel();
        $user = $userModel->where('token', $token)->first();

        if (!$user) {
            return service('response')
                ->setStatusCode(401)
                ->setContentType('application/json')
                ->setJSON([
                    'status'  => 401,
                    'error'   => 'Unauthorized',
                    'message' => 'Token tidak valid atau sesi telah habis.'
                ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // nothing
    }
}
