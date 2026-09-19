const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'www');

// Ensure www exists and is clean
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Files to copy
const filesToCopy = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.webmanifest',
  'sw.js'
];

filesToCopy.forEach((file) => {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outDir, file));
    console.log(`✓ Copied ${file} -> www/`);
  }
});

// Copy icons directory
const srcIcons = path.join(rootDir, 'icons');
const dstIcons = path.join(outDir, 'icons');
if (fs.existsSync(srcIcons)) {
  fs.cpSync(srcIcons, dstIcons, { recursive: true });
  console.log('✓ Copied icons/ -> www/icons/');
}

console.log('AttendWise mobile build package created in www/ successfully!');
