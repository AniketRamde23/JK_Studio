import React from 'react';
import { db } from '@/lib/db/store';
import { Footer } from '@/components/navigation/Footer';
import { PhotographyView } from '@/components/gallery/PhotographyView';

export const metadata = {
  title: 'Photography Studio & Gallery — JK',
  description: 'Fine-art wedding chronicles, chiaroscuro portraits, and high-fashion editorial campaigns by JK Photography.',
};

export default function PhotographyPage() {
  const images = db.getGalleryImages();

  return (
    <>
      <main className="min-h-screen pt-24 pb-20">
        <PhotographyView images={images} />
      </main>
      <Footer />
    </>
  );
}
