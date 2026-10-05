const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '../public/photos');
const outputDir = path.join(__dirname, '../public/photos/optimized');
const thumbDir = path.join(__dirname, '../public/photos/thumbs');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

function parseOrder(filename) {
  const base = path.parse(filename).name;
  const num = parseFloat(base);
  if (!isNaN(num)) {
    return num;
  }
  return 999; // for non-numeric like DSC_0048
}

async function run() {
  const files = fs.readdirSync(inputDir).filter(f => {
    const full = path.join(inputDir, f);
    return fs.statSync(full).isFile() && /\.(jpe?g|png|webp)$/i.test(f);
  });

  // Sort files numerically by user-assigned serial numbers
  files.sort((a, b) => {
    const orderA = parseOrder(a);
    const orderB = parseOrder(b);
    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b);
  });

  console.log(`Ordered ${files.length} photos:`);
  console.log(files.map(f => `${f} (order: ${parseOrder(f)})`).join(', '));

  const galleryItems = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    const outWebp = `${baseName}.webp`;
    const fullOutPath = path.join(outputDir, outWebp);
    const thumbOutPath = path.join(thumbDir, outWebp);

    try {
      const meta = await sharp(inputPath).metadata();

      await sharp(inputPath)
        .rotate()
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(fullOutPath);

      await sharp(inputPath)
        .rotate()
        .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(thumbOutPath);

      // Determine category or keep as versatile portfolio
      let categorySlug = 'weddings';
      const order = parseOrder(file);
      if (order >= 1 && order <= 9) {
        categorySlug = 'weddings';
      } else if (order >= 10 && order <= 19) {
        categorySlug = 'portraits';
      } else if (order >= 20 && order <= 29) {
        categorySlug = 'editorial';
      } else {
        categorySlug = 'cinema-stills';
      }

      galleryItems.push({
        id: `gal_frame_${baseName.replace('.', '_')}`,
        categorySlug,
        title: `Frame ${baseName}`,
        caption: `Captured on location by JK. 35mm optical framing and bespoke grade.`,
        url: `/photos/optimized/${outWebp}`,
        thumbUrl: `/photos/thumbs/${outWebp}`,
        watermarkedUrl: `/photos/optimized/${outWebp}`,
        featured: true, // featured so it shows in the Frames & Intimacies strip
        sortOrder: i + 1,
        width: meta.width || 1200,
        height: meta.height || 800,
      });

      console.log(`[${i + 1}/${files.length}] Processed ${file} -> ${outWebp}`);
    } catch (err) {
      console.error(`Failed ${file}:`, err.message);
    }
  }

  fs.writeFileSync(
    path.join(__dirname, '../lib/db/real-gallery-data.json'),
    JSON.stringify(galleryItems, null, 2)
  );

  console.log(`Saved ${galleryItems.length} ordered frames to real-gallery-data.json`);
}

run();
