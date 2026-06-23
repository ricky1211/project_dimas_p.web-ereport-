<?php

namespace App\Libraries;

/**
 * FirestoreClient
 * Library pengganti semua operasi MySQL/Model CI4.
 * Berkomunikasi langsung dengan Google Firestore REST API.
 *
 * Cara pakai:
 *   $db = new FirestoreClient();
 *   $docs = $db->collection('laporan')->get();
 *   $id   = $db->collection('laporan')->add($data);
 *   $ok   = $db->collection('laporan')->doc($id)->set($data);
 *   $ok   = $db->collection('laporan')->doc($id)->update($data);
 *   $ok   = $db->collection('laporan')->doc($id)->delete();
 *   $doc  = $db->collection('laporan')->getById($id);
 *   $docs = $db->collection('laporan')->where('status', '==', 'baru');
 */
class FirestoreClient
{
    private string $projectId;
    private string $baseUrl;
    private string $accessToken;
    private string $collectionPath = '';

    public function __construct()
    {
        $this->projectId   = env('FIREBASE_PROJECT_ID');
        $this->baseUrl     = "https://firestore.googleapis.com/v1/projects/{$this->projectId}/databases/(default)/documents";
        $this->accessToken = $this->getAccessToken();
    }

    // ── Fluent API ─────────────────────────────────────────────────────────────

    public function collection(string $name): static
    {
        $this->collectionPath = $name;
        return $this;
    }

    public function doc(string $id): DocumentRef
    {
        return new DocumentRef($this->baseUrl, $this->accessToken, $this->collectionPath, $id);
    }

    // ── READ ───────────────────────────────────────────────────────────────────

    /** Ambil semua dokumen dari koleksi */
    public function get(): array
    {
        $url      = "{$this->baseUrl}/{$this->collectionPath}";
        $response = $this->request('GET', $url);
        return $this->parseDocuments($response['documents'] ?? []);
    }

    /** Ambil satu dokumen berdasarkan ID */
    public function getById(string $id): ?array
    {
        $url      = "{$this->baseUrl}/{$this->collectionPath}/{$id}";
        $response = $this->request('GET', $url);
        if (isset($response['error'])) return null;
        return [
            'id'   => $this->extractId($response['name']),
            'data' => $this->decodeFields($response['fields'] ?? []),
        ];
    }

    /**
     * Query: where field op value
     * Operator: '==' | '!=' | '<' | '<=' | '>' | '>='
     */
    public function where(string $field, string $op, mixed $value): array
    {
        $opMap = [
            '=='  => 'EQUAL',
            '!='  => 'NOT_EQUAL',
            '<'   => 'LESS_THAN',
            '<='  => 'LESS_THAN_OR_EQUAL',
            '>'   => 'GREATER_THAN',
            '>='  => 'GREATER_THAN_OR_EQUAL',
        ];
        $body = [
            'structuredQuery' => [
                'from'  => [['collectionId' => $this->collectionPath]],
                'where' => [
                    'fieldFilter' => [
                        'field' => ['fieldPath' => $field],
                        'op'    => $opMap[$op] ?? 'EQUAL',
                        'value' => $this->encodeValue($value),
                    ],
                ],
            ],
        ];
        $url      = "https://firestore.googleapis.com/v1/projects/{$this->projectId}/databases/(default)/documents:runQuery";
        $response = $this->request('POST', $url, $body);
        $results  = [];
        foreach ((array) $response as $item) {
            if (isset($item['document'])) {
                $results[] = [
                    'id'   => $this->extractId($item['document']['name']),
                    'data' => $this->decodeFields($item['document']['fields'] ?? []),
                ];
            }
        }
        return $results;
    }

    // ── WRITE ──────────────────────────────────────────────────────────────────

    /** Tambah dokumen baru (auto-ID), return ID */
    public function add(array $data): ?string
    {
        $url  = "{$this->baseUrl}/{$this->collectionPath}";
        $body = ['fields' => $this->encodeFields($data)];
        $res  = $this->request('POST', $url, $body);
        return isset($res['name']) ? $this->extractId($res['name']) : null;
    }

    // ── HTTP ───────────────────────────────────────────────────────────────────

    public function request(string $method, string $url, array $body = []): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => [
                "Authorization: Bearer {$this->accessToken}",
                'Content-Type: application/json',
            ],
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        if ($body) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }
        $raw = curl_exec($ch);
        curl_close($ch);
        return json_decode($raw ?: '{}', true) ?? [];
    }

    // ── Encoding / Decoding Firestore values ───────────────────────────────────

    public function encodeFields(array $data): array
    {
        $fields = [];
        foreach ($data as $key => $val) {
            $fields[$key] = $this->encodeValue($val);
        }
        return $fields;
    }

    public function encodeValue(mixed $val): array
    {
        return match (true) {
            is_null($val)  => ['nullValue' => null],
            is_bool($val)  => ['booleanValue' => $val],
            is_int($val)   => ['integerValue' => (string) $val],
            is_float($val) => ['doubleValue' => $val],
            is_array($val) => ['mapValue' => ['fields' => $this->encodeFields($val)]],
            default        => ['stringValue' => (string) $val],
        };
    }

    public function decodeFields(array $fields): array
    {
        $result = [];
        foreach ($fields as $key => $wrapper) {
            $result[$key] = $this->decodeValue($wrapper);
        }
        return $result;
    }

    public function decodeValue(array $wrapper): mixed
    {
        if (array_key_exists('nullValue', $wrapper))    return null;
        if (isset($wrapper['stringValue']))              return $wrapper['stringValue'];
        if (isset($wrapper['integerValue']))             return (int) $wrapper['integerValue'];
        if (isset($wrapper['doubleValue']))              return (float) $wrapper['doubleValue'];
        if (isset($wrapper['booleanValue']))             return (bool) $wrapper['booleanValue'];
        if (isset($wrapper['mapValue']))                 return $this->decodeFields($wrapper['mapValue']['fields'] ?? []);
        if (isset($wrapper['arrayValue']))               return array_map([$this, 'decodeValue'], $wrapper['arrayValue']['values'] ?? []);
        return null;
    }

    private function parseDocuments(array $raw): array
    {
        return array_map(fn($doc) => [
            'id'   => $this->extractId($doc['name']),
            'data' => $this->decodeFields($doc['fields'] ?? []),
        ], $raw);
    }

    public function extractId(string $name): string
    {
        return basename($name);
    }

    // ── Auth: Service Account → Access Token ───────────────────────────────────

    private function getAccessToken(): string
    {
        $cacheFile = WRITEPATH . 'cache/firebase_token.json';

        if (file_exists($cacheFile)) {
            $cached = json_decode(file_get_contents($cacheFile), true);
            if ($cached && ($cached['expires_at'] ?? 0) > time() + 60) {
                return $cached['token'];
            }
        }

        $keyPath = env('FIREBASE_SERVICE_ACCOUNT_PATH');
        $key     = json_decode(file_get_contents(ROOTPATH . $keyPath), true);
        $now     = time();

        $header  = rtrim(strtr(base64_encode(json_encode(['alg' => 'RS256', 'typ' => 'JWT'])), '+/', '-_'), '=');
        $payload = rtrim(strtr(base64_encode(json_encode([
            'iss'   => $key['client_email'],
            'scope' => 'https://www.googleapis.com/auth/datastore',
            'aud'   => 'https://oauth2.googleapis.com/token',
            'iat'   => $now,
            'exp'   => $now + 3600,
        ])), '+/', '-_'), '=');

        openssl_sign("{$header}.{$payload}", $sig, $key['private_key'], OPENSSL_ALGO_SHA256);
        $jwt = "{$header}.{$payload}." . rtrim(strtr(base64_encode($sig), '+/', '-_'), '=');

        $ch = curl_init('https://oauth2.googleapis.com/token');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query([
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion'  => $jwt,
            ]),
        ]);
        $res   = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $token = $res['access_token'];

        if (!is_dir(dirname($cacheFile))) {
            mkdir(dirname($cacheFile), 0755, true);
        }
        file_put_contents($cacheFile, json_encode([
            'token'      => $token,
            'expires_at' => $now + 3600,
        ]));

        return $token;
    }
}

// ── DocumentRef ────────────────────────────────────────────────────────────────

class DocumentRef
{
    public function __construct(
        private string $baseUrl,
        private string $accessToken,
        private string $collection,
        private string $id
    ) {}

    private function url(): string
    {
        return "{$this->baseUrl}/{$this->collection}/{$this->id}";
    }

    /** Baca dokumen */
    public function get(): ?array
    {
        $res = $this->req('GET', $this->url());
        if (isset($res['error'])) return null;
        $fs = new FirestoreClient();
        return [
            'id'   => basename($res['name']),
            'data' => $fs->decodeFields($res['fields'] ?? []),
        ];
    }

    /** Overwrite penuh */
    public function set(array $data): bool
    {
        $fs   = new FirestoreClient();
        $body = ['fields' => $fs->encodeFields($data)];
        $res  = $this->req('PATCH', $this->url(), $body);
        return isset($res['name']);
    }

    /** Update sebagian field */
    public function update(array $data): bool
    {
        $fs   = new FirestoreClient();
        $body = ['fields' => $fs->encodeFields($data)];
        $keys = array_keys($data);
        $qs   = implode('&', array_map(fn($k) => 'updateMask.fieldPaths=' . urlencode($k), $keys));
        $res  = $this->req('PATCH', $this->url() . '?' . $qs, $body);
        return isset($res['name']);
    }

    /** Hapus dokumen */
    public function delete(): bool
    {
        $res = $this->req('DELETE', $this->url());
        return empty($res) || !isset($res['error']);
    }

    private function req(string $method, string $url, array $body = []): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => [
                "Authorization: Bearer {$this->accessToken}",
                'Content-Type: application/json',
            ],
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        if ($body) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        $raw = curl_exec($ch);
        curl_close($ch);
        return json_decode($raw ?: '{}', true) ?? [];
    }
}
