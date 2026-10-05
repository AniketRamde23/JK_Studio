const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '../public/photos');
const outputDir = path.join(__dirname, '../public/photos/optimized');
const thumbDir = path.join(__dirname, '../public/photos/thumbs');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

async function processAll() {
  const files = fs.readdirSync(inputDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  console.log(`Found ${files.length} images to optimize...`);

  const results = [];

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    const outWebp = `${baseName}.webp`;
    const fullOutPath = path.join(outputDir, outWebp);
    const thumbOutPath = path.join(thumbDir, outWebp);

    try {
      const meta = await sharp(inputPath).metadata();

      // Full display version (max 1920 width, quality 85)
      await sharp(inputPath)
        .rotate() // auto-orient from EXIF
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(fullOutPath);

      // Thumbnail version (max 800 width, quality 80)
      await sharp(inputPath)
        .rotate()
        .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(thumbOutPath);

      results.push({
        original: file,
        optimized: `/photos/optimized/${outWebp}`,
        thumb: `/photos/thumbs/${outWebp}`,
        width: meta.width || 1200,
        height: meta.height || 800,
      });

      console.log(`Processed: ${file} -> ${outWebp}`);
    } catch (e) {
      console.error(`Error processing ${file}:`, e.message);
    }
  }

  fs.writeFileSync(
    path.join(__dirname, '../lib/db/processed-photos.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('Saved processed photos metadata successfully!');
}

processAll();
