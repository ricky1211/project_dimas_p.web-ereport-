const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Konfigurasi Project ID Firebase Anda
const PROJECT_ID = 'ereportnew';

function encodeValue(val) {
  if (val === null) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  return { stringValue: String(val) };
}

function encodeFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    fields[key] = encodeValue(value);
  }
  return fields;
}

async function testToken(token) {
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    return res.status !== 401;
  } catch (e) {
    return false;
  }
}

async function getAccessTokenFromServiceAccount(sa) {
  const { JWT } = require('google-auth-library');
  const jwtClient = new JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ['https://www.googleapis.com/auth/datastore']
  });
  const creds = await jwtClient.authorize();
  return creds.access_token;
}

async function getAccessTokenFromCLI() {
  const userProfile = process.env.USERPROFILE || process.env.HOMEPATH;
  const configPath = path.join(userProfile, '.config', 'configstore', 'firebase-tools.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error('Konfigurasi Firebase CLI tidak ditemukan. Silakan jalankan "firebase login" terlebih dahulu.');
  }

  let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  let accessToken = config.tokens?.access_token;

  if (!accessToken) {
    throw new Error('Token akses tidak ditemukan. Silakan jalankan "firebase login" terlebih dahulu.');
  }

  console.log('Memeriksa masa berlaku token Firebase CLI...');
  const isActive = await testToken(accessToken);
  if (!isActive) {
    console.log('Token kedaluwarsa. Melakukan refresh token otomatis menggunakan Firebase CLI...');
    try {
      execSync('npx -y firebase-tools@latest projects:list', { stdio: 'ignore' });
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      accessToken = config.tokens?.access_token;
      console.log('Refresh token berhasil!');
    } catch (err) {
      throw new Error('Gagal me-refresh token secara otomatis. Silakan jalankan ulang "firebase login" di terminal Anda.');
    }
  } else {
    console.log('Token Firebase CLI aktif!');
  }

  return accessToken;
}

async function getAccessToken() {
  // Let's resolve the path relative to process.cwd() (the root folder) to find firebase-service-account.json
  const saPath = path.join(process.cwd(), 'firebase-service-account.json');
  if (fs.existsSync(saPath)) {
    try {
      const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
      if (sa.private_key && sa.private_key.indexOf('MASUKKAN_PRIVATE_KEY') === -1) {
        console.log('Menghubungkan menggunakan Service Account (firebase-service-account.json)...');
        return await getAccessTokenFromServiceAccount(sa);
      }
    } catch (e) {
      console.warn('Gagal membaca file firebase-service-account.json:', e.message);
    }
  }

  console.log('firebase-service-account.json tidak ditemukan atau masih berupa template.');
  console.log('Mencoba menyambungkan menggunakan sesi Firebase CLI Anda yang aktif...');
  return await getAccessTokenFromCLI();
}

async function mulaiImport() {
  try {
    const accessToken = await getAccessToken();

    const importFilePath = path.join(process.cwd(), 'firebase-import.json');
    if (!fs.existsSync(importFilePath)) {
      throw new Error('File data "firebase-import.json" tidak ditemukan di folder root.');
    }

    const data = JSON.parse(fs.readFileSync(importFilePath, 'utf8'));

    console.log('\nMemulai proses pengunggahan data massal ke Cloud Firestore...');

    for (const [collectionId, docs] of Object.entries(data)) {
      console.log(`\n[Koleksi: ${collectionId}]`);
      const docEntries = Object.entries(docs);
      
      for (const [docId, docData] of docEntries) {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionId}/${docId}`;
        const body = {
          fields: encodeFields(docData)
        };
        
        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Gagal mengunggah dokumen "${docId}" ke koleksi "${collectionId}": ${errText}`);
        }
        console.log(`  + Berhasil mengunggah dokumen: ${docId}`);
      }
    }

    console.log('\nSelamat! Semua data berhasil dimasukkan ke Firestore sekaligus.');
  } catch (error) {
    console.error('\nProses import gagal:', error.message);
  }
}

mulaiImport();
