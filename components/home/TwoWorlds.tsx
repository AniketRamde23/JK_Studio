'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Film, Camera, ArrowRight } from 'lucide-react';

export function TwoWorlds() {
  const [activeWorld, setActiveWorld] = useState<'actor' | 'photographer' | null>(null);

  return (
    <section className="relative py-24 md:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14 space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-gold">
          Dual Artistry
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-text font-normal">
          Two Worlds. One Visionary.
        </h2>
        <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto">
          "I perform stories on screen. I preserve stories through my lens." Choose a realm to explore.
        </p>
      </div>

      {/* Two Worlds Container (Design Spec 7.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[580px]">
        {/* ACTOR WORLD */}
        <motion.div
          onHoverStart={() => setActiveWorld('actor')}
          onHoverEnd={() => setActiveWorld(null)}
          animate={{
            opacity: activeWorld === 'photographer' ? 0.55 : 1,
            scale: activeWorld === 'actor' ? 1.01 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="group relative rounded-xl overflow-hidden border border-ink-line bg-ink-stage flex flex-col justify-end p-6 sm:p-8 md:p-12 min-h-[440px] sm:min-h-[520px] shadow-2xl"
          data-cursor="photo"
        >
          {/* Background Poster Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/photos/optimized/5.webp"
              alt="The Actor - In Front of the Camera"
              fill
              draggable={false}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none select-none"
            />
            {/* Warm gold spotlight overlay (Design Spec 1.3) */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
            <div className="absolute inset-0 bg-[#C8A96B]/10 mix-blend-color-dodge opacity-60" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink/80 backdrop-blur-md border border-gold/40 text-gold text-xs font-mono tracking-wider uppercase">
              <Film size={13} />
              In front of the camera
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-text font-medium leading-tight">
              The Actor
            </h3>

            <p className="text-sm sm:text-base text-text/80 max-w-md font-sans">
              Method discipline, screen combat, and raw emotional vulnerability. Lead and antagonist roles across Indian cinema and streaming features.
            </p>

            <div className="pt-2">
              <Link
                href="/acting"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gold text-ink font-medium text-xs tracking-wider uppercase hover:bg-gold-hi transition-all group-hover:shadow-lg group-hover:shadow-gold/20"
              >
                <span>Explore Acting</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* PHOTOGRAPHER WORLD */}
        <motion.div
          onHoverStart={() => setActiveWorld('photographer')}
          onHoverEnd={() => setActiveWorld(null)}
          animate={{
            opacity: activeWorld === 'actor' ? 0.55 : 1,
            scale: activeWorld === 'photographer' ? 1.01 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="group relative rounded-xl overflow-hidden border border-ink-line bg-ink-stage flex flex-col justify-end p-6 sm:p-8 md:p-12 min-h-[440px] sm:min-h-[520px] shadow-2xl"
          data-cursor="photo"
        >
          {/* Background Photography Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/jk_logo.jpg"
              alt="Photography World - Behind the Lens"
              fill
              draggable={false}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none select-none"
            />
            {/* Cool neutral studio light overlay (Design Spec 1.3) */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
            <div className="absolute inset-0 bg-[#A8C4EC]/10 mix-blend-color-dodge opacity-50" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink/80 backdrop-blur-md border border-[#A8C4EC]/40 text-[#A8C4EC] text-xs font-mono tracking-wider uppercase">
              <Camera size={13} />
              Behind the lens
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-text font-medium leading-tight">
              The Photographer
            </h3>

            <p className="text-sm sm:text-base text-text/80 max-w-md font-sans">
              Sculpting light and capturing unrepeatable truth. Editorial portraits, luxury wedding chronicles, and on-set cinema stills.
            </p>

            <div className="pt-2">
              <Link
                href="/photography"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-text text-ink font-medium text-xs tracking-wider uppercase hover:bg-white transition-all group-hover:shadow-lg"
              >
                <span>Explore Photography</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
