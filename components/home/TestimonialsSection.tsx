'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, CheckCircle } from 'lucide-react';
import { Testimonial } from '@/lib/db/types';

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: Props) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;
  const current = testimonials[index];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-20 md:py-28 px-5 sm:px-8 max-w-5xl mx-auto border-t border-ink-line text-center"
    >
      <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-3">
        Client Testimonials
      </span>

      <div className="relative min-h-[220px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Stars */}
            <div className="flex items-center justify-center gap-1 text-gold">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} size={16} className="fill-gold" />
              ))}
            </div>

            {/* Quote in large serif */}
            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-text font-normal leading-snug italic max-w-3xl mx-auto">
              "{current.text}"
            </blockquote>

            {/* Client Info */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold/40">
                <Image
                  src={current.photoUrl}
                  alt={current.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-text flex items-center gap-1.5">
                  {current.name}
                  {current.verifiedBooking && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-gold font-mono bg-gold/10 px-1.5 py-0.5 rounded">
                      <CheckCircle size={10} /> Verified
                    </span>
                  )}
                </div>
                <div className="text-xs text-text-muted">
                  {current.role} · {current.serviceName}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bars & Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          className="w-8 h-8 rounded-full border border-ink-line text-text-muted hover:text-text hover:border-gold flex items-center justify-center transition-colors"
          aria-label="Previous quote"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === index ? '28px' : '10px',
                backgroundColor: i === index ? '#C8A96B' : '#262626',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
          className="w-8 h-8 rounded-full border border-ink-line text-text-muted hover:text-text hover:border-gold flex items-center justify-center transition-colors"
          aria-label="Next quote"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
