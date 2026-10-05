import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import { Footer } from '@/components/navigation/Footer';
import { Camera, Film, Calendar, Award, Sparkles, MapPin } from 'lucide-react';

export const metadata = {
  title: 'About Kashinath Jale (JK) — Actor, Photographer, Storyteller',
  description: 'The journey, artistic philosophy, and career milestones of Kashinath Jale (JK) spanning classical screen acting and fine-art photography.',
};

export default function AboutPage() {
  const profile = db.getActingProfile();

  const milestones = [
    {
      year: '2025',
      title: 'Vajra: The Iron Veil',
      desc: 'Portrayed lead antagonist Vikram Dev in nationwide theatrical release. Praised for stylized combat sequences.',
    },
    {
      year: '2024',
      title: 'IFFI Official Selection & Editorial Spread',
      desc: 'Starring role in psychological thriller "Shadows in the Mist", alongside shooting high-fashion editorial campaigns across Rajasthan.',
    },
    {
      year: '2023',
      title: 'Theatrical Tour & Prime Video Saga',
      desc: 'Performed titular Macbeth across Prithvi Theatre tour; wrapped 6-episode family epic "Echoes of Malabar".',
    },
    {
      year: '2022',
      title: 'JK Fine-Art Studio Inception',
      desc: 'Formalized dedicated photography commissions, blending sound-blimped cinema stills with unscripted wedding heirlooms.',
    },
  ];

  return (
    <>
      <main className="min-h-screen pt-28 pb-20 px-5 sm:px-8 max-w-7xl mx-auto space-y-20">
        {/* Two-Column Bio Section (Design Spec 4.2) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 4:5 Portrait Left */}
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden border border-ink-line bg-ink-curtain shadow-2xl lg:sticky lg:top-28 max-w-md mx-auto lg:max-w-none w-full">
            <Image
              src="/images/jk_logo.jpg"
              alt="Kashinath Jale Portrait with Camera"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-hi block">
                The Dual Identity
              </span>
              <p className="font-serif text-2xl text-text font-medium">
                Kashinath Jale (JK)
              </p>
            </div>
          </div>

          {/* Sticky Bio Right */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold">
                Philosophy & Background
              </span>
              <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-text font-normal leading-tight">
                "The site is a camera. Every moment has its lens."
              </h1>
              <p className="font-serif italic text-lg text-gold-hi">
                "I perform stories on screen. I preserve stories through my lens."
              </p>
            </div>

            <div className="space-y-4 text-sm text-text-muted leading-relaxed font-sans">
              <p>
                Art has never been an isolated pursuit for Kashinath Jale. As an actor, the craft demands surrendering entirely to character—subordinating vanity to human vulnerability, tension, and kinetic grace.
              </p>
              <p>
                Behind the lens, this empathy transforms into sight. Knowing how it feels to stand beneath scorching tungsten keys allows Kashinath to photograph clients and artists not as subjects to be posed, but as stories in motion.
              </p>
              <p>
                Whether orchestrating a 4K action thriller or directing a quiet moment between a couple at dusk, the commitment remains constant: authentic truth, dramatic composure, and uncompromising aesthetic rigor.
              </p>
            </div>

            {/* Facts Row (Design Spec 4.2) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl border border-ink-line bg-ink-stage text-xs font-mono">
              <div>
                <span className="text-text-muted text-[11px] block">Bases</span>
                <span className="text-text font-medium">Hyderabad / Mumbai</span>
              </div>
              <div>
                <span className="text-text-muted text-[11px] block">Height</span>
                <span className="text-text font-medium">{profile.height}</span>
              </div>
              <div>
                <span className="text-text-muted text-[11px] block">Experience</span>
                <span className="text-gold font-medium">8+ Years Active</span>
              </div>
              <div>
                <span className="text-text-muted text-[11px] block">Dual Medium</span>
                <span className="text-text font-medium">35mm & Screen</span>
              </div>
            </div>

            {/* Career Timeline Milestones (Design Spec 4.2) */}
            <div className="space-y-6 pt-4">
              <h3 className="font-serif text-2xl text-text font-normal">
                Career Milestones
              </h3>

              <div className="space-y-6 border-l-2 border-ink-line pl-6 relative">
                {milestones.map((m, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-gold ring-4 ring-ink" />
                    <span className="text-xs font-mono text-gold-hi uppercase tracking-wider">
                      {m.year}
                    </span>
                    <h4 className="font-serif text-lg text-text font-medium">
                      {m.title}
                    </h4>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-ink-line">
              <Link
                href="/acting"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-ink text-xs font-semibold tracking-wider uppercase hover:bg-gold-hi transition-colors shadow-lg shadow-gold/15"
              >
                <Film size={14} />
                <span>Screen Filmography</span>
              </Link>
              <Link
                href="/photography"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-ink-line bg-ink-curtain text-text text-xs font-medium tracking-wider uppercase hover:border-gold hover:text-gold transition-colors"
              >
                <Camera size={14} />
                <span>Photography Studio</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
