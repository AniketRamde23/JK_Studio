import React from 'react';
import { Footer } from '@/components/navigation/Footer';

export const metadata = {
  title: 'Terms of Service — JK',
  description: 'Terms and conditions governing photography commissions and acting talent engagements with JK.',
};

export default function TermsPage() {
  return (
    <>
      <main className="min-h-screen pt-28 pb-20 px-5 sm:px-8 max-w-4xl mx-auto space-y-8 text-xs sm:text-sm text-text-muted leading-relaxed">
        <div className="space-y-2 border-b border-ink-line pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-gold">Legal Framework</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-text font-normal">Terms of Service</h1>
          <p className="text-xs font-mono text-text-muted">Effective Date: October 1, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">1. Commission Bookings & Atomic Holds</h2>
          <p>
            When you request a photography shoot through our platform, an initial hold of 24 hours is placed on your chosen date. Pricing, deliverables, and payment terms are discussed and agreed upon directly during your consultation phone call according to your specific production scope.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">2. Copyright and Licensing</h2>
          <p>
            JK retains fundamental artistic authorship and copyright in all photographs and motion footage captured. Clients receive non-exclusive, perpetual personal usage licenses (for wedding and personal portrait sessions) or specific commercial media buyouts (for fashion lookbooks and campaigns).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">3. Deliverables & Archival</h2>
          <p>
            Color-graded and retouched high-resolution deliverables are served via private online proofing galleries within specified package timelines. Clients may also opt for archival hard-drive delivery.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
