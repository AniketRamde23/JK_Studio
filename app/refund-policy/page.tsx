import React from 'react';
import { Footer } from '@/components/navigation/Footer';

export const metadata = {
  title: 'Refund & Reschedule Policy — JK',
  description: 'Cancellation, rescheduling, and advance refund terms for photography bookings with JK.',
};

export default function RefundPolicyPage() {
  return (
    <>
      <main className="min-h-screen pt-28 pb-20 px-5 sm:px-8 max-w-4xl mx-auto space-y-8 text-xs sm:text-sm text-text-muted leading-relaxed">
        <div className="space-y-2 border-b border-ink-line pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-gold">PRD Specification 8.6</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-text font-normal">Refund & Reschedule Policy</h1>
          <p className="text-xs font-mono text-text-muted">Effective Date: October 1, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">1. Advance Payment</h2>
          <p>
            Payment terms, advances, and milestones are discussed and agreed upon directly during your personalized phone consultation according to your custom production requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">2. Rescheduling Policy</h2>
          <p>
            We recognize that film shoots, family ceremonies, and weather patterns can necessitate date shifts.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-text">Free Rescheduling:</strong> Reschedules requested at least 7 days prior to the shoot date are 100% complimentary, subject to alternate date availability.</li>
            <li><strong className="text-text">Under 7 Days:</strong> Date changes requested less than 7 days prior may incur crew mobilization adjustments of 10% of the package value.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">3. Client Cancellation & Refunds</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-text">More than 14 Days Notice:</strong> 100% full refund of the advance deposit.</li>
            <li><strong className="text-text">7 to 14 Days Notice:</strong> 50% refund of the advance deposit.</li>
            <li><strong className="text-text">Less than 7 Days Notice:</strong> Non-refundable (advance absorbed towards retained dates and crew blockage).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text font-medium">4. Producer/Artist Cancellation (Screen Schedule Conflicts)</h2>
          <p>
            In the rare event that JK is mandated on set for sudden film schedule extensions, you will receive an immediate <strong className="text-text">100% full refund</strong> along with JK's personal assistance in securing an esteemed peer cinematographer or lead photographer of equivalent tier.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
