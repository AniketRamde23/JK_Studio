'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export function ShowreelTeaser() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="py-20 md:py-28 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
            Motion Portfolio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-text font-normal">
            Acting Showreel
          </h2>
        </div>
        <p className="text-text-muted text-xs sm:text-sm font-mono">
          4K Cinematic Reel · Kashinath Jale Screen Performances
        </p>
      </div>

      {/* Showreel Video Container (Video as the cover) */}
      <div
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
        className="group relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-ink-line bg-black cursor-pointer shadow-2xl select-none"
        data-cursor="video"
      >
        <video
          ref={videoRef}
          src="/videos/acting_showreel.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate nofullscreen"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out pointer-events-none select-none"
        />

        {/* Transparent Security Shield Overlay */}
        <div className="absolute inset-0 z-10 select-none bg-transparent" />

        {/* Ambient Dark Gradient on edges for text legibility */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink/90 via-transparent to-ink/20 pointer-events-none" />

        {/* Play/Pause overlay indicator on pause */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold text-ink flex items-center justify-center shadow-2xl"
            >
              <Play size={28} className="fill-ink translate-x-0.5" />
            </motion.div>
          </div>
        )}

        {/* Bottom Bar Info & Quick Audio/Screen Controls */}
        <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gold-hi bg-ink/80 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded backdrop-blur-sm border border-gold/30">
              Featured Reel 2025
            </span>
            <h3 className="font-serif text-sm sm:text-xl text-text font-medium drop-shadow-md line-clamp-1 sm:line-clamp-none">
              Vajra / Shadows in the Mist / Malabar
            </h3>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto self-end sm:self-auto">
            <button
              onClick={toggleMute}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-ink/85 border border-ink-line text-text hover:text-gold hover:border-gold/50 backdrop-blur-md transition-colors text-[11px] sm:text-xs font-mono"
              aria-label={isMuted ? "Unmute showreel audio" : "Mute showreel audio"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-gold" />}
              <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 rounded-full bg-ink/85 border border-ink-line text-text hover:text-gold hover:border-gold/50 backdrop-blur-md transition-colors"
              aria-label="Fullscreen video"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
