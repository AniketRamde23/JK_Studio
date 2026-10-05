import React from 'react';
import { Footer } from '@/components/navigation/Footer';

export const metadata = {
  title: 'Privacy Policy — JK',
  description: 'Privacy Policy compliant with India Digital Personal Data Protection (DPDP) Act 2023 for JK Actor & Photography.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="min-h-screen pt-28 pb-20 px-5 sm:px-8 max-w-4xl mx-auto space-y-8 text-xs sm:text-sm text-text-muted leading-relaxed">
        <div className="space-y-2 border-b border-ink-line pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-gold">Compliance & DPDP Act 2023</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-text font-normal">Privacy Policy</h1>
          <p className="text-xs font-mono text-text-muted">Effective Date: October 1, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">1. Purpose and Scope</h2>
          <p>
            This Privacy Policy sets out how JK ("we", "us", "our") collects, processes, and protects your personal data when you interact with our acting portfolio, casting pipelines, or photography booking wizard, in strict compliance with India's Digital Personal Data Protection (DPDP) Act 2023.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">2. Data We Collect</h2>
          <p>We collect only the personal information strictly necessary to fulfill your artistic commission or casting enquiry:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Contact details: Name, phone/WhatsApp number, email address, production house or organization.</li>
            <li>Booking details: Commission dates, event venues, city/destination logistics, and session preferences.</li>
            <li>Visual assets & Model Release: When explicitly consented via our booking wizard, selected final retouched stills may be showcased in our online artistic portfolio.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">3. Data Security & Storage</h2>
          <p>
            All data transmitted through our web application is encrypted via TLS/HTTPS. We do not store raw payment card data on our servers. All financial operations utilize RBI-authorized payment processors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">4. Your DPDP Rights</h2>
          <p>
            Under the DPDP Act 2023, you have the right to access your personal data, request correction of inaccuracies, withdraw consent, or request complete erasure of your contact record by writing to <code>privacy@actorjk.com</code>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
