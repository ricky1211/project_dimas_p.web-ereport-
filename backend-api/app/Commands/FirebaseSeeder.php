<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Libraries\FirestoreClient;

/**
 * Pengganti database.sql — isi data awal ke Firestore
 * Jalankan: php spark firebase:seed
 */
class FirebaseSeeder extends BaseCommand
{
    protected $group       = 'Firebase';
    protected $name        = 'firebase:seed';
    protected $description = 'Isi data awal (seed) ke Firestore — pengganti import database.sql';

    public function run(array $params): void
    {
        $db = new FirestoreClient();

        CLI::write('🔥 Memulai seeding data ke Firestore...', 'yellow');

        // ── Users ─────────────────────────────────────────────────────────────
        CLI::write('📌 Membuat users...', 'cyan');
        $adminId = $db->collection('users')->add([
            'nama'       => 'Administrator',
            'email'      => 'admin@ereport.id',
            'password'   => password_hash('password', PASSWORD_DEFAULT),
            'role'       => 'admin',
            'token'      => '',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        $petugasId = $db->collection('users')->add([
            'nama'       => 'Petugas Satu',
            'email'      => 'petugas@ereport.id',
            'password'   => password_hash('password', PASSWORD_DEFAULT),
            'role'       => 'petugas',
            'token'      => '',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        CLI::write("  ✅ Admin   ID: {$adminId}", 'green');
        CLI::write("  ✅ Petugas ID: {$petugasId}", 'green');

        // ── Kategori ──────────────────────────────────────────────────────────
        CLI::write('📌 Membuat kategori aduan...', 'cyan');
        $kategoris = [
            ['nama_kategori' => 'Infrastruktur',    'deskripsi' => 'Jalan rusak, jembatan, drainase, fasilitas umum'],
            ['nama_kategori' => 'Keamanan',         'deskripsi' => 'Ketertiban, kriminalitas, keamanan lingkungan'],
            ['nama_kategori' => 'Kebersihan',       'deskripsi' => 'Sampah, limbah, kebersihan lingkungan'],
            ['nama_kategori' => 'Pelayanan Publik', 'deskripsi' => 'Pelayanan pemerintah dan administrasi'],
            ['nama_kategori' => 'Bencana Alam',     'deskripsi' => 'Banjir, longsor, dan bencana alam lainnya'],
        ];
        $kategoriIds = [];
        foreach ($kategoris as $k) {
            $id = $db->collection('kategori_aduan')->add(array_merge($k, [
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]));
            $kategoriIds[] = $id;
            CLI::write("  ✅ {$k['nama_kategori']} → {$id}", 'green');
        }

        // ── Pelapor ───────────────────────────────────────────────────────────
        CLI::write('📌 Membuat data pelapor...', 'cyan');
        $pelapors = [
            ['nama_pelapor' => 'Budi Santoso', 'nik' => '3201234567890001', 'no_telepon' => '081234567890', 'alamat' => 'Jl. Merdeka No. 10, Bogor'],
            ['nama_pelapor' => 'Siti Rahayu',  'nik' => '3201234567890002', 'no_telepon' => '082345678901', 'alamat' => 'Jl. Sudirman No. 25, Bogor'],
            ['nama_pelapor' => 'Ahmad Fauzi',  'nik' => '3201234567890003', 'no_telepon' => '083456789012', 'alamat' => 'Perumahan Griya Asri Blok C No. 7'],
        ];
        $pelaporIds = [];
        foreach ($pelapors as $p) {
            $id = $db->collection('pelapor')->add(array_merge($p, [
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]));
            $pelaporIds[] = $id;
            CLI::write("  ✅ {$p['nama_pelapor']} → {$id}", 'green');
        }

        // ── Laporan ───────────────────────────────────────────────────────────
        CLI::write('📌 Membuat laporan contoh...', 'cyan');
        $laporans = [
            [
                'kode_laporan'    => 'RPT-' . date('Y') . '-001',
                'pelapor_id'      => $pelaporIds[0],
                'kategori_id'     => $kategoriIds[0],
                'petugas_id'      => '',
                'judul_laporan'   => 'Jalan Berlubang di Jl. Ahmad Yani',
                'isi_laporan'     => 'Terdapat lubang besar di tengah jalan yang sangat membahayakan pengendara.',
                'lokasi'          => 'Jl. Ahmad Yani KM 3, Bogor',
                'foto_bukti'      => '',
                'status'          => 'diproses',
                'tanggal_laporan' => date('Y-m-d'),
                'catatan_petugas' => '',
                'rating'          => 0,
                'feedback_warga'  => '',
                'is_banding'      => 0,
                'alasan_urgensi'  => '',
            ],
            [
                'kode_laporan'    => 'RPT-' . date('Y') . '-002',
                'pelapor_id'      => $pelaporIds[1],
                'kategori_id'     => $kategoriIds[2],
                'petugas_id'      => '',
                'judul_laporan'   => 'Tumpukan Sampah Tidak Diangkut',
                'isi_laporan'     => 'Sampah di TPS sudah menumpuk lebih dari 5 hari dan menimbulkan bau tidak sedap.',
                'lokasi'          => 'TPS Jl. Pajajaran, Bogor',
                'foto_bukti'      => '',
                'status'          => 'baru',
                'tanggal_laporan' => date('Y-m-d'),
                'catatan_petugas' => '',
                'rating'          => 0,
                'feedback_warga'  => '',
                'is_banding'      => 0,
                'alasan_urgensi'  => '',
            ],
            [
                'kode_laporan'    => 'RPT-' . date('Y') . '-003',
                'pelapor_id'      => $pelaporIds[2],
                'kategori_id'     => $kategoriIds[1],
                'petugas_id'      => $petugasId,
                'judul_laporan'   => 'Pencurian Motor di Parkiran',
                'isi_laporan'     => 'Telah terjadi pencurian sepeda motor di area parkiran pasar.',
                'lokasi'          => 'Parkiran Pasar Bogor, Jl. Dewi Sartika',
                'foto_bukti'      => '',
                'status'          => 'selesai',
                'tanggal_laporan' => date('Y-m-d'),
                'catatan_petugas' => 'Laporan telah ditindaklanjuti bersama kepolisian setempat.',
                'rating'          => 4,
                'feedback_warga'  => 'Terima kasih sudah ditangani.',
                'is_banding'      => 0,
                'alasan_urgensi'  => '',
            ],
        ];
        foreach ($laporans as $l) {
            $id = $db->collection('laporan')->add(array_merge($l, [
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]));
            CLI::write("  ✅ {$l['kode_laporan']} → {$id}", 'green');
        }

        CLI::write('', '');
        CLI::write('🎉 Seeding selesai! Data berhasil dimasukkan ke Firestore.', 'green');
        CLI::write('');
        CLI::write('Akun login:', 'yellow');
        CLI::write('  Admin   → admin@ereport.id / password', 'white');
        CLI::write('  Petugas → petugas@ereport.id / password', 'white');
    }
}
