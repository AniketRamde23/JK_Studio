'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';
import { GalleryImage } from '@/lib/db/types';

interface Props {
  images: GalleryImage[];
}

export function FeaturedPhotography({ images }: Props) {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (img: GalleryImage, idx: number) => {
    setActiveImage(img);
    setCurrentIndex(idx);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIdx);
    setActiveImage(images[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIdx);
    setActiveImage(images[prevIdx]);
  };

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
            Visual Portfolio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-text font-normal">
            Frames & Intimacies
          </h2>
        </div>
        <Link
          href="/photography"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-gold hover:text-gold-hi transition-colors group"
        >
          <span>See the full 3D gallery</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Horizontal serial strip (Design Spec 4.1 Section D) */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 pt-2 px-5 sm:px-8 scrollbar-none snap-x cursor-grab active:cursor-grabbing">
        {[...images]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((img, idx) => {
            const isLandscape = img.width >= img.height;
            return (
              <motion.div
                key={img.id}
                onClick={() => openLightbox(img, idx)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className={`relative flex-shrink-0 rounded-2xl overflow-hidden border border-ink-line bg-ink-curtain snap-start cursor-pointer group shadow-2xl ${
                  isLandscape ? 'w-[340px] sm:w-[500px] h-[380px]' : 'w-[250px] sm:w-[300px] h-[380px]'
                }`}
                data-cursor="photo"
              >
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none select-none"
                />
                {/* Transparent click shield */}
                <div 
                  onContextMenu={(e) => e.preventDefault()}
                  className="absolute inset-0 z-10 bg-transparent select-none" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Serial Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-ink/75 backdrop-blur-md border border-ink-line text-[10px] font-mono text-gold-hi font-medium">
                  {img.title}
                </div>

                <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gold-hi block">
                    {img.categorySlug}
                  </span>
                  <p className="font-serif text-base text-text font-medium truncate">
                    {img.title}
                  </p>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Fullscreen Lightbox (Design Spec 7.3) */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8"
            onClick={() => setActiveImage(null)}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-mono text-text-muted">
                {currentIndex + 1} / {images.length} · {activeImage.categorySlug.toUpperCase()}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(null);
                }}
                className="w-10 h-10 rounded-full border border-ink-line bg-ink-curtain text-text hover:text-gold flex items-center justify-center transition-colors"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Stage */}
            <div
              className="relative flex-1 flex items-center justify-center py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-10 w-12 h-12 rounded-full border border-ink-line bg-ink/70 text-text hover:text-gold flex items-center justify-center backdrop-blur-md transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>

              <div 
                onContextMenu={(e) => e.preventDefault()}
                className="relative max-w-4xl max-h-[75vh] w-full h-full flex items-center justify-center select-none"
              >
                <Image
                  src={activeImage.url}
                  alt={activeImage.title}
                  fill
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="object-contain pointer-events-none select-none"
                  priority
                />

                {/* Transparent Security Shield Overlay */}
                <div 
                  onContextMenu={(e) => e.preventDefault()}
                  className="absolute inset-0 z-10 bg-transparent select-none" 
                />

                {/* Protective Lightbox Watermark Badge */}
                <div className="absolute bottom-3 right-3 z-20 px-3 py-1 rounded bg-black/75 border border-white/10 text-[10px] font-mono tracking-widest uppercase text-white/80 backdrop-blur-md pointer-events-none select-none">
                  © Kashinath Jale Studio · Protected
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-10 w-12 h-12 rounded-full border border-ink-line bg-ink/70 text-text hover:text-gold flex items-center justify-center backdrop-blur-md transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Caption & Action */}
            <div
              className="max-w-2xl mx-auto text-center space-y-3 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-xl sm:text-2xl text-text font-normal">
                {activeImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted">
                {activeImage.caption}
              </p>
              <div className="pt-2">
                <Link
                  href={`/book?service=${activeImage.categorySlug === 'weddings' ? 'srv_weddings' : 'srv_portraits'}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-ink text-xs font-semibold tracking-wider uppercase hover:bg-gold-hi transition-colors"
                >
                  <Calendar size={14} />
                  Book a similar shoot
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
