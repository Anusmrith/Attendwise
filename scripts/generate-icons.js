const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, '../icons/icon.svg');
const iconsDir = path.join(__dirname, '../icons');
const androidResDir = path.join(__dirname, '../android/app/src/main/res');
const iosAppIconDir = path.join(__dirname, '../ios/App/App/Assets.xcassets/AppIcon.appiconset');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. PWA Icons
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192.png'));
  console.log('✓ Generated icons/icon-192.png');

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512.png'));
  console.log('✓ Generated icons/icon-512.png');

  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('✓ Generated icons/apple-touch-icon.png');

  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(iconsDir, 'favicon.png'));
  console.log('✓ Generated icons/favicon.png');

  // Maskable icon with safe-zone padding
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({ top: 51, bottom: 51, left: 51, right: 51, background: '#4f46e5' })
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable.png'));
  console.log('✓ Generated icons/icon-maskable.png');

  // 2. Android Native Launcher Icons
  const androidMipmaps = [
    { folder: 'mipmap-mdpi', size: 48 },
    { folder: 'mipmap-hdpi', size: 72 },
    { folder: 'mipmap-xhdpi', size: 96 },
    { folder: 'mipmap-xxhdpi', size: 144 },
    { folder: 'mipmap-xxxhdpi', size: 192 }
  ];

  if (fs.existsSync(androidResDir)) {
    for (const { folder, size } of androidMipmaps) {
      const targetFolder = path.join(androidResDir, folder);
      if (fs.existsSync(targetFolder)) {
        // Standard square / adaptive
        await sharp(svgBuffer).resize(size, size).png().toFile(path.join(targetFolder, 'ic_launcher.png'));
        
        // Circular round launcher
        const circleSvg = Buffer.from(`
          <svg width="${size}" height="${size}">
            <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#ffffff"/>
          </svg>
        `);
        await sharp(svgBuffer)
          .resize(size, size)
          .composite([{ input: circleSvg, blend: 'dest-in' }])
          .png()
          .toFile(path.join(targetFolder, 'ic_launcher_round.png'));

        // Foreground
        const fgSize = Math.round(size * 0.72);
        const pad = Math.round((size - fgSize) / 2);
        await sharp(svgBuffer)
          .resize(fgSize, fgSize)
          .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toFile(path.join(targetFolder, 'ic_launcher_foreground.png'));

        console.log(`✓ Generated Android icons for ${folder} (${size}x${size})`);
      }
    }
  }

  // 3. iOS App Icon (1024x1024)
  if (fs.existsSync(iosAppIconDir)) {
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(iosAppIconDir, 'AppIcon-512@2x.png'));
    console.log('✓ Generated iOS AppIcon-512@2x.png (1024x1024)');
  }

  console.log('\n🎉 All PWA, Android, and iOS icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
