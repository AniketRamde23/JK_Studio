'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Mail, Phone, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide on admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-ink-line bg-ink-stage text-text-muted mt-auto pt-16 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold/50 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/jk_logo.jpg"
                  alt="JK Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-2xl text-text font-medium block leading-none">
                  JK
                </span>
                <span className="text-[11px] uppercase tracking-widest text-gold font-mono block mt-1.5">
                  Actor · Photographer · Storyteller
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-md pt-2 text-text/80 font-serif italic text-lg">
              "I perform stories on screen. I preserve stories through my lens."
            </p>
            <p className="text-xs text-text-muted">
              Operating out of Hyderabad & Mumbai · Available worldwide for cinematic film projects and destination photo commissions.
            </p>
          </div>

          {/* Dual Brand Socials (PRD Sec 2 & 7.11) */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-text font-semibold">
              The Two Worlds
            </h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/actor_jk_"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-lg border border-ink-line bg-ink-curtain hover:border-gold/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Instagram size={17} className="text-gold" />
                  <div>
                    <div className="text-xs font-medium text-text group-hover:text-gold transition-colors">
                      @actor_jk_
                    </div>
                    <div className="text-[11px] text-text-muted">Screen & Acting Universe</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-text-muted group-hover:text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="https://instagram.com/jkphotography2168"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-lg border border-ink-line bg-ink-curtain hover:border-gold/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Instagram size={17} className="text-gold" />
                  <div>
                    <div className="text-xs font-medium text-text group-hover:text-gold transition-colors">
                      @jkphotography2168
                    </div>
                    <div className="text-[11px] text-text-muted">Photography & Frames</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-text-muted group-hover:text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Quick Links & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-text font-semibold">
              Direct Inquiries
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors flex items-center gap-2">
                  <Mail size={13} className="text-gold" /> Casting & Collaboration
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-gold transition-colors flex items-center gap-2">
                  <Phone size={13} className="text-gold" /> Reserve Photography Slot
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold transition-colors">
                  Admin Command Center
                </Link>
              </li>
              <li className="pt-2 border-t border-ink-line flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                <Link href="/privacy" className="hover:text-text">Privacy Policy</Link>
                <span>·</span>
                <Link href="/terms" className="hover:text-text">Terms</Link>
                <span>·</span>
                <Link href="/refund-policy" className="hover:text-text">Refund & Reschedule</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-ink-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} JK. All rights reserved. GST-compliant invoicing available.
          </div>
          <div className="text-text-muted font-mono text-[11px]">
            Designed with cinematic rigor & passion.
          </div>
        </div>
      </div>
    </footer>
  );
}
