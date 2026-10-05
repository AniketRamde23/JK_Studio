import React, { Suspense } from 'react';
import { Footer } from '@/components/navigation/Footer';
import { BookingWizard } from '@/components/booking/BookingWizard';

export const metadata = {
  title: 'Book a Slot — JK Studio',
  description: 'Request a photography slot with JK. Direct personal consultation without complex forms or online payments.',
};

export default function BookPage() {
  return (
    <>
      <main className="min-h-screen pt-24 pb-16">
        <Suspense fallback={<div className="text-center py-20 text-xs font-mono text-gold">Loading booking slot...</div>}>
          <BookingWizard />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
