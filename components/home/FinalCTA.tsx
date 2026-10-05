'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Mail, ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 px-5 sm:px-8 max-w-5xl mx-auto text-center border-t border-ink-line">
      <div className="space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-gold block">
          Initiate Collaboration
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text font-normal leading-tight max-w-3xl mx-auto">
          Planning something worth remembering?
        </h2>

        <p className="text-text-muted text-sm sm:text-base max-w-lg mx-auto">
          Whether you need a compelling screen presence for your next production or timeless imagery for your milestone event.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/book"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gold text-ink font-semibold text-xs tracking-wider uppercase hover:bg-gold-hi shadow-lg hover:shadow-gold/20 transition-all duration-200"
          >
            <Calendar size={15} />
            <span>Book a Slot</span>
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full border border-ink-line bg-ink-curtain text-text font-medium text-xs tracking-wider uppercase hover:border-gold/50 hover:text-gold transition-all duration-200"
          >
            <Mail size={15} />
            <span>Send a Casting Enquiry</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
