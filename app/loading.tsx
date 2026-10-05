import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none">
      <div className="relative flex flex-col items-center gap-4">
        {/* Shimmering Ring */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-gold/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-gold animate-spin [animation-duration:800ms]" />
          <span className="font-serif text-gold text-xs font-semibold tracking-widest">JK</span>
        </div>
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-text-muted/80 animate-pulse">
          Loading Frame
        </span>
      </div>
    </div>
  );
}
