'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageSquare, Calendar, Phone } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Acting', href: '/acting' },
  { name: 'Photography', href: '/photography' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      // Hide on scroll down, show on scroll up (Design Spec 7.10)
      if (currentScrollY > 150 && currentScrollY > lastScrollY && !mobileMenuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  // Don't show public nav on /admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled
            ? 'bg-ink/85 backdrop-blur-md border-b border-ink-line py-3.5 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo / Monogram */}
          <Link
            href="/"
            prefetch={true}
            onMouseEnter={() => router.prefetch('/')}
            onTouchStart={() => router.prefetch('/')}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="JK Home"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold/60 group-hover:border-gold transition-all duration-300 shadow-md group-hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/jk_logo.jpg"
                alt="JK Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-wider text-text group-hover:text-gold-hi transition-colors font-medium leading-none">
                JK
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-gold leading-none mt-1">
                Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  onMouseEnter={() => router.prefetch(link.href)}
                  onTouchStart={() => router.prefetch(link.href)}
                  className={`group relative px-4 py-1.5 text-sm transition-colors duration-200 ${
                    isActive ? 'text-text font-medium' : 'text-text-muted hover:text-text'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {/* Gliding active indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavTabUnderline"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold rounded-full shadow-[0_0_8px_rgba(200,169,107,0.6)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {/* Subtle hover guide on inactive links */}
                  {!isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+919177856208"
              className="hidden lg:flex items-center gap-2 text-xs font-mono text-text-muted hover:text-gold transition-colors py-1 px-2.5 rounded-full border border-ink-line/60 bg-ink-curtain/50"
            >
              <Phone size={13} className="text-gold" />
              <span>+91 91778 56208</span>
            </a>
            <Link
              href="/book"
              prefetch={true}
              onMouseEnter={() => router.prefetch('/book')}
              onTouchStart={() => router.prefetch('/book')}
              className="relative inline-flex items-center justify-center px-5 py-2 text-xs font-medium tracking-wider uppercase text-ink bg-gold hover:bg-gold-hi rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-gold/20 hover:shadow-lg"
            >
              Book a Slot
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-text-muted hover:text-text rounded-full hover:bg-ink-curtain"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Iris Menu (Design Spec 3.1 & 7.10) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 92% 5%)', opacity: 0 }}
            animate={{ clipPath: 'circle(150% at 92% 5%)', opacity: 1 }}
            exit={{ clipPath: 'circle(0% at 92% 5%)', opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-ink-stage flex flex-col justify-center px-8 md:hidden"
          >
            <div className="space-y-6">
              <span className="text-[11px] font-mono tracking-widest text-gold uppercase block mb-2">
                Navigation
              </span>
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08 * idx, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    prefetch={true}
                    onTouchStart={() => router.prefetch(link.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-3xl text-text hover:text-gold block transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="pt-6 border-t border-ink-line space-y-3"
              >
                <a
                  href="tel:+919177856208"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 border border-ink-line rounded-full bg-ink-curtain text-xs font-mono text-gold-hi hover:border-gold transition-colors"
                >
                  <Phone size={14} />
                  <span>Call +91 91778 56208</span>
                </a>
                <Link
                  href="/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gold text-ink rounded-full text-sm font-semibold tracking-wider uppercase"
                >
                  <Calendar size={16} /> Book a Slot
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center py-2 text-xs text-text-muted hover:text-text"
                >
                  Admin command center
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Bar (PRD Sec 6.2 & Design Spec 3.1) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center gap-3">
        <Link
          href="/book"
          className="flex-1 py-3 px-4 bg-gold text-ink font-semibold text-xs tracking-wider uppercase rounded-full shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Calendar size={15} /> Book a Slot
        </Link>
        <a
          href="https://wa.me/919177856208?text=Hi%20Kashinath,%20I%20am%20interested%20in%20discussing%20a%20project."
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-ink-curtain border border-ink-line rounded-full flex items-center justify-center text-[#25D366] shadow-xl hover:border-gold/40 active:scale-95 transition-all"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare size={20} />
        </a>
      </div>
    </>
  );
}
