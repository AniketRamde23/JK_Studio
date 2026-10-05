'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getDeviceTier, DeviceTier } from '@/lib/device-tier';

// Lazy-load R3F canvas (PRD Sec 9.2 & Prompt 4)
const LazyHeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => null,
});

export function HeroSceneWrapper() {
  const [tier, setTier] = useState<DeviceTier>('high');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTier(getDeviceTier());
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-transparent z-0" />
    );
  }

  // Graceful 2D fallback for low-tier, reduced-motion, or mobile devices without WebGL
  if (tier === 'low') {
    return (
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-[12000ms] ease-out hover:scale-100"
          style={{
            backgroundImage: `url('/photos/optimized/1.webp')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/50 to-transparent" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <LazyHeroScene />
      {/* Cinematic vignette (Design Spec 2.4) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_95%)]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-ink via-ink/70 to-transparent md:w-1/2" />
    </div>
  );
}
