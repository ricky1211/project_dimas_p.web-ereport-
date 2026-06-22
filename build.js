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
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
