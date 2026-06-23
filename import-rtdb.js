const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Project ID Firebase Anda
const PROJECT_ID = 'ereportnew';

async function getAccessToken() {
  const userProfile = process.env.USERPROFILE || process.env.HOMEPATH;
  const configPath = path.join(userProfile, '.config', 'configstore', 'firebase-tools.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('Kredensial Firebase CLI tidak ditemukan. Silakan jalankan "firebase login" terlebih dahulu.');
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.tokens?.access_token;
}

async function run() {
  try {
    console.log('Mendapatkan token akses Firebase...');
    const token = await getAccessToken();

    console.log('Mencari instance Realtime Database aktif...');
    let instancesRaw;
    try {
      instancesRaw = execSync(`npx -y firebase-tools@latest database:instances:list --project ${PROJECT_ID} --json`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    } catch (e) {
      throw new Error('Gagal memeriksa database. Pastikan Anda sudah ter-login ke Firebase CLI.');
    }

    const resInstances = JSON.parse(instancesRaw);
    const instancesList = resInstances.result || (Array.isArray(resInstances) ? resInstances : []);
    
    // Firebase CLI mengembalikan array objek untuk instances
    if (!instancesList || instancesList.length === 0) {
      console.log('\n❌ Realtime Database BELUM dibuat di Firebase Console Anda!');
      console.log('Silakan ikuti langkah berikut:');
      console.log('1. Buka Firebase Console -> Pilih project "ereportnew"');
      console.log('2. Buka menu samping kiri -> "Build" -> "Realtime Database"');
      console.log('3. Klik tombol "Create Database"');
      console.log('4. Pilih lokasi (Singapore / US), klik Next');
      console.log('5. Pilih "Start in test mode", klik "Enable"');
      console.log('6. Setelah selesai dibuat, jalankan kembali script ini (node import-rtdb.js)\n');
      return;
    }

    const dbUrl = instancesList[0].databaseUrl;
    console.log(`Database terdeteksi: ${dbUrl}`);

    console.log('Membaca file data firebase-import.json...');
    const importFilePath = path.join(__dirname, 'firebase-import.json');
    if (!fs.existsSync(importFilePath)) {
      throw new Error('File data "firebase-import.json" tidak ditemukan di root.');
    }
    const data = fs.readFileSync(importFilePath, 'utf8');

    console.log('Mengunggah data ke Realtime Database...');
    const res = await fetch(`${dbUrl}/.json`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: data
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal mengunggah data: ${errText}`);
    }

    console.log('✅ Sukses! Semua data berhasil diimpor ke Realtime Database.');
  } catch (err) {
    console.error('\nTerjadi kesalahan:', err.message);
  }
}

run();
