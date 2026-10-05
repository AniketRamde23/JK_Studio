'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';
import { Service } from '@/lib/db/types';

interface Props {
  services: Service[];
}

export function ServicesPreview({ services }: Props) {
  return (
    <section className="py-20 md:py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-ink-line">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
            Commissions & Sessions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-text font-normal">
            Services & Packages
          </h2>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-gold hover:text-gold-hi transition-colors group"
        >
          <span>View all packages & add-ons</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="group relative rounded-xl border border-ink-line bg-ink-curtain overflow-hidden flex flex-col justify-between hover:border-gold/40 transition-all duration-300"
            data-cursor="photo"
          >
            {/* 4:5 Image Container (Design Spec 3.3) */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-stage">
              <Image
                src={service.coverImage}
                alt={service.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-curtain via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-ink/80 backdrop-blur-md border border-ink-line text-[11px] font-mono text-gold font-medium">
                Quote on Call
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-serif text-xl text-text font-medium group-hover:text-gold-hi transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {service.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-ink-line flex items-center justify-between">
                <Link
                  href={`/services#${service.slug}`}
                  className="text-xs text-text-muted hover:text-gold transition-colors"
                >
                  View Details
                </Link>

                <Link
                  href={`/book?service=${service.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold/15 text-gold hover:bg-gold hover:text-ink text-xs font-medium transition-all"
                >
                  <Calendar size={13} />
                  <span>Book</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
