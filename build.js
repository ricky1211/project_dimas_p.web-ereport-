const fs = require('fs');
const path = require('path');

console.log('Starting build...');

try {
  // Hapus folder dist lama jika ada untuk pembersihan
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('Cleaned existing dist folder.');
  }

  // Buat folder dist baru
  fs.mkdirSync('dist', { recursive: true });

  // Salin konten dari frontend-spa ke dist
  fs.cpSync('frontend-spa', 'dist', { recursive: true });
  console.log('Successfully copied frontend-spa to dist!');

  // Ambil API Key dari environment variables (Vercel atau local env)
  let apiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;

  // Jika tidak ada di environment, coba cari di file backend-api/env atau .env
  if (!apiKey) {
    const envPaths = [
      path.join(__dirname, 'backend-api', 'env'),
      path.join(__dirname, 'backend-api', '.env'),
      path.join(__dirname, '.env')
    ];
    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/VITE_FIREBASE_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);
        if (match && match[1] && !match[1].startsWith('Isi_Dengan')) {
          apiKey = match[1];
          console.log(`Found API Key in ${path.basename(envPath)}`);
          break;
        }
      }
    }
  }

  if (apiKey) {
    console.log('Injecting Firebase API Key into dist/js/firebase-api.js...');
    const apiPath = path.join(__dirname, 'dist', 'js', 'firebase-api.js');
    if (fs.existsSync(apiPath)) {
      let content = fs.readFileSync(apiPath, 'utf8');
      content = content.replace('[GCP_API_KEY]', apiKey);
      fs.writeFileSync(apiPath, content, 'utf8');
      console.log('API Key successfully injected into dist/js/firebase-api.js!');
    }
  } else {
    console.warn('WARNING: VITE_FIREBASE_API_KEY not found in environment. Placeholders not replaced.');
  }

} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

