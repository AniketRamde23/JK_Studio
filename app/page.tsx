import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import { Footer } from '@/components/navigation/Footer';
import { HeroSceneWrapper } from '@/components/three/HeroSceneWrapper';
import { TwoWorlds } from '@/components/home/TwoWorlds';
import { ShowreelTeaser } from '@/components/home/ShowreelTeaser';
import { FeaturedPhotography } from '@/components/home/FeaturedPhotography';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { FinalCTA } from '@/components/home/FinalCTA';
import { ArrowDown, Calendar, Film } from 'lucide-react';

export default function HomePage() {
  const services = db.getServices();
  const galleryImages = db.getGalleryImages();

  return (
    <>

      <main className="min-h-screen">
        {/* SECTION A: HERO (PRD Sec 6.3 & 7.1, Design Spec Sec 4.1 Section A) */}
        <section className="relative min-h-[90svh] sm:min-h-[92vh] md:min-h-screen flex items-end pb-16 md:pb-24 px-5 sm:px-8 max-w-7xl mx-auto overflow-hidden">
          {/* 3D Scene Layer (Occupies right 60% on desktop, lazy loaded) */}
          <HeroSceneWrapper />

          {/* Hero Content (Left-aligned, bottom-left of viewport) */}
          <div className="relative z-10 max-w-2xl space-y-6 pt-24">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-gold font-medium">
                  Actor · Photographer · Storyteller
                </span>
              </div>

              {/* Display XL Name (Design Spec 2.2) */}
              <h1 className="font-serif text-4xl xs:text-5xl sm:text-7xl md:text-8xl text-text font-normal tracking-tight leading-[0.95] break-words">
                Kashinath Jale
              </h1>
              <span className="text-xs sm:text-sm font-mono tracking-widest text-gold-hi block pt-1">
                (JK Studio)
              </span>
            </div>

            <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-text/90 font-light leading-snug">
              "Every frame tells a story."
            </p>

            <p className="text-xs sm:text-sm text-text-muted max-w-md leading-relaxed font-sans">
              Performing narratives on screen with method intensity, and preserving raw human truths behind the lens. Based between Hyderabad and Mumbai.
            </p>

            {/* CTAs (Design Spec 3.2 & 4.1) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/photography"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-ink-line bg-ink-curtain/90 backdrop-blur-sm text-text hover:border-gold hover:text-gold text-xs font-medium tracking-wider uppercase transition-all duration-200"
              >
                <Film size={14} />
                <span>Explore my work</span>
              </Link>

              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-ink hover:bg-gold-hi text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-lg shadow-gold/15"
              >
                <Calendar size={14} />
                <span>Book a shoot</span>
              </Link>
            </div>

            {/* Scroll Hint */}
            <div className="pt-6 flex items-center gap-2 text-[11px] font-mono text-text-muted/60">
              <ArrowDown size={13} className="animate-bounce text-gold" />
              <span>Scroll to explore the universe</span>
            </div>
          </div>
        </section>

        {/* SECTION B: TWO WORLDS (PRD Sec 7.2 & Design Spec Sec 4.1 B) */}
        <TwoWorlds />

        {/* SECTION C: SHOWREEL TEASER (PRD Sec 7.3 & Design Spec Sec 4.1 C) */}
        <ShowreelTeaser />

        {/* SECTION D: FEATURED PHOTOGRAPHY (PRD Sec 7.4 & Design Spec Sec 4.1 D) */}
        <FeaturedPhotography images={galleryImages} />

        {/* SECTION E: SERVICES PREVIEW (PRD Sec 7.5 & Design Spec Sec 4.1 E) */}
        <ServicesPreview services={services} />


        {/* SECTION G: FINAL CTA + FOOTER (PRD Sec 6.3 G) */}
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
