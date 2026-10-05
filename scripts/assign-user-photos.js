const fs = require('fs');
const path = require('path');

const processed = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../lib/db/processed-photos.json'), 'utf8')
);

console.log(`Loaded ${processed.length} photos.`);

// Split the 39 photos intelligently across the categories:
// 1. Weddings & Celebrations (e.g. 10 photos)
// 2. Portraits & Headshots (e.g. 10 photos)
// 3. Fashion & Editorial (e.g. 10 photos)
// 4. Cinema Stills & BTS (e.g. 9 photos)

const dscPhotos = processed.filter(p => p.original.startsWith('DSC_'));
const imgPhotos = processed.filter(p => p.original.startsWith('IMG_'));

console.log(`DSC raw camera photos: ${dscPhotos.length}, Processed/Mobile: ${imgPhotos.length}`);

// We will map all 39 photos into GalleryImage records
const galleryImages = processed.map((p, idx) => {
  let categorySlug = 'portraits';
  if (idx < 10) {
    categorySlug = 'weddings';
  } else if (idx < 20) {
    categorySlug = 'portraits';
  } else if (idx < 30) {
    categorySlug = 'editorial';
  } else {
    categorySlug = 'cinema-stills';
  }

  const baseTitle = p.original.replace(/\.[^/.]+$/, "");
  const titles = {
    weddings: [
      "Sacred Twilight Rituals",
      "Vows in Amber Light",
      "The Bridal Radiance",
      "Celebration & Candids",
      "Gilded Mandap Moments",
      "Silken Shadows & Joy",
      "Festive Family Symphony",
      "Intimate Twilight Reverence",
      "Pheras of Destiny",
      "The Golden Garland"
    ],
    portraits: [
      "Behind the Lens — JK Signature",
      "Chiaroscuro & Gaze",
      "Character Study in Monochrome",
      "Gaze into the Horizon",
      "The Method Expression",
      "Shadows & Bone Structure",
      "The Solitary Visionary",
      "Raw Human Presence",
      "Tungsten Key Profile",
      "Subtle Vulnerability"
    ],
    editorial: [
      "Sari Silhouette in Motion",
      "Modern Couture in Architecture",
      "The Velvet Odyssey",
      "High-Fashion Editorial Spread",
      "Vibrant Heritage Geometry",
      "The Indigo Monolith",
      "Contemporary Drapes",
      "Elegance & Chiaroscuro",
      "Haute Couture Chronicle",
      "The Minimalist Silhouette"
    ],
    'cinema-stills': [
      "Between Takes at 3 AM",
      "Sound-Blimped Set Chronicle",
      "Director's Frame Monitor",
      "Tungsten Arc & Rain FX",
      "The Climax Stunt Setup",
      "Shadows Behind the Camera",
      "Cinematic Lighting Blueprint",
      "The Final Clapboard",
      "Raw Production Cadence"
    ]
  };

  const catList = titles[categorySlug] || titles.portraits;
  const itemTitle = catList[idx % catList.length] || `Visual Study ${baseTitle}`;

  return {
    id: `gal_real_${idx + 1}`,
    categorySlug,
    title: itemTitle,
    caption: `Shot by JK on location. 35mm optical framing and bespoke cinematic color grading (${baseTitle}).`,
    url: p.optimized,
    thumbUrl: p.thumb,
    watermarkedUrl: p.optimized,
    featured: idx % 3 === 0,
    sortOrder: idx + 1,
    width: p.width,
    height: p.height,
  };
});

fs.writeFileSync(
  path.join(__dirname, '../lib/db/real-gallery-data.json'),
  JSON.stringify(galleryImages, null, 2)
);

console.log('Generated real gallery data json with', galleryImages.length, 'entries.');
