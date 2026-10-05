'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Filter,
  Camera,
  Layers
} from 'lucide-react';
import { GalleryImage } from '@/lib/db/types';

interface Props {
  images: GalleryImage[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Works' },
  { id: 'weddings', label: 'Weddings & Celebrations' },
  { id: 'portraits', label: 'Portraits & Headshots' },
  { id: 'editorial', label: 'Fashion & Campaigns' },
  { id: 'cinema-stills', label: 'Cinema Stills & BTS' },
];

export function PhotographyView({ images }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewTheme, setViewTheme] = useState<'dark' | 'paper'>('dark');

  const filteredImages = (
    activeCategory === 'all'
      ? images
      : images.filter(img => img.categorySlug === activeCategory)
  ).slice().sort((a, b) => a.sortOrder - b.sortOrder);

  const openLightbox = (img: GalleryImage) => {
    const idx = filteredImages.findIndex(i => i.id === img.id);
    setCurrentIndex(idx >= 0 ? idx : 0);
    setActiveImage(img);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIdx);
    setActiveImage(filteredImages[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIdx);
    setActiveImage(filteredImages[prevIdx]);
  };

  return (
    <div className="space-y-16">
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto px-5 space-y-4">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold">
          Fine-Art Visuals
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-text font-normal leading-tight">
          "When I'm not on screen, I'm behind the lens."
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto">
          Every human gaze has its own cinematography. We craft intentional lighting, unscripted candids, and heirloom prints.
        </p>

        {/* View Surface Switcher (Design Spec Sec 1.3 & 2.1: Black vs Paper #EDE8DF) */}
        <div className="pt-2 flex items-center justify-center gap-3 text-xs font-mono">
          <span className="text-text-muted">Viewing Surface:</span>
          <button
            onClick={() => setViewTheme('dark')}
            className={`px-3 py-1 rounded-full border transition-all ${
              viewTheme === 'dark'
                ? 'bg-ink border-gold text-gold-hi shadow'
                : 'bg-ink-curtain border-ink-line text-text-muted'
            }`}
          >
            Blackout Stage
          </button>
          <button
            onClick={() => setViewTheme('paper')}
            className={`px-3 py-1 rounded-full border transition-all ${
              viewTheme === 'paper'
                ? 'bg-[#EDE8DF] border-[#C8A96B] text-[#14120F] font-semibold shadow'
                : 'bg-ink-curtain border-ink-line text-text-muted'
            }`}
          >
            Warm Paper (#EDE8DF)
          </button>
        </div>
      </section>

      {/* Category Filter Chips (PRD Sec 7.4) */}
      <div className="flex flex-wrap items-center justify-center gap-2 px-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
              activeCategory === cat.id
                ? 'bg-gold text-ink font-semibold shadow-lg shadow-gold/15'
                : 'bg-ink-curtain border border-ink-line text-text-muted hover:text-text'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Canvas with Optional Paper Surface */}
      <section
        className={`transition-colors duration-500 py-12 px-5 sm:px-8 ${
          viewTheme === 'paper'
            ? 'bg-[#EDE8DF] text-[#14120F]'
            : 'bg-transparent text-text'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {filteredImages.length === 0 ? (
            <div className="text-center py-20 font-mono text-xs text-text-muted">
              Photos for this category are coming soon.
            </div>
          ) : (
            /* Clean Masonry / Varied Grid */
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredImages.map((img) => (
                <motion.div
                  key={img.id}
                  onClick={() => openLightbox(img)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className={`break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer group shadow-2xl ${
                    viewTheme === 'paper'
                      ? 'border border-[#DCD6C9] bg-white'
                      : 'border border-ink-line bg-ink-curtain'
                  }`}
                  data-cursor="photo"
                >
                  <div 
                    onContextMenu={(e) => e.preventDefault()}
                    className="relative w-full aspect-auto select-none"
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      loading="lazy"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out select-none pointer-events-none"
                    />

                    {/* Transparent Click Shield */}
                    <div 
                      onContextMenu={(e) => e.preventDefault()}
                      className="absolute inset-0 z-10 bg-transparent select-none" 
                    />

                    {/* Watermark notice watermark overlay (PRD 1.2) */}
                    <div className="absolute top-3 right-3 z-20 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-black/60 text-white/70 backdrop-blur-sm pointer-events-none select-none">
                      © Kashinath Jale Studio
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-gold-hi block">
                        {img.categorySlug}
                      </span>
                      <p className="font-serif text-lg font-medium">
                        {img.title}
                      </p>
                      <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                        {img.caption}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottom CTA on Gallery (PRD Sec 7.4) */}
          <div className="text-center pt-16 space-y-4">
            <h3 className={`font-serif text-2xl sm:text-3xl ${viewTheme === 'paper' ? 'text-[#14120F]' : 'text-text'}`}>
              Envisioning a similar aesthetic?
            </h3>
            <div>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold text-ink font-semibold text-xs tracking-wider uppercase hover:bg-gold-hi transition-colors shadow-lg shadow-gold/20"
              >
                <Calendar size={15} />
                <span>Book a Similar Shoot</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
            {/* Lightbox Top */}
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-mono text-text-muted">
                Frame {currentIndex + 1} of {filteredImages.length} · {activeImage.categorySlug.toUpperCase()}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(null);
                }}
                className="w-10 h-10 rounded-full border border-ink-line bg-ink-curtain text-text hover:text-gold flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Lightbox Center */}
            <div
              className="relative flex-1 flex items-center justify-center py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-10 w-12 h-12 rounded-full border border-ink-line bg-ink/70 text-text hover:text-gold flex items-center justify-center backdrop-blur-md transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>

              <div 
                onContextMenu={(e) => e.preventDefault()}
                className="relative max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center select-none"
              >
                <img
                  src={activeImage.url}
                  alt={activeImage.title}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="max-h-[75vh] max-w-full object-contain rounded-md select-none pointer-events-none"
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

              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-10 w-12 h-12 rounded-full border border-ink-line bg-ink/70 text-text hover:text-gold flex items-center justify-center backdrop-blur-md transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Lightbox Bottom */}
            <div
              className="max-w-2xl mx-auto text-center space-y-3 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-xl sm:text-2xl text-text font-normal">
                {activeImage.title}
              </h3>
              <p className="text-xs text-text-muted">
                {activeImage.caption}
              </p>
              <div className="pt-2">
                <Link
                  href={`/book?service=${activeImage.categorySlug === 'weddings' ? 'srv_weddings' : 'srv_portraits'}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-ink text-xs font-semibold tracking-wider uppercase hover:bg-gold-hi transition-colors"
                >
                  <Calendar size={14} />
                  <span>Book this aesthetic</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
