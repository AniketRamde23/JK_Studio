import React, { Suspense } from 'react';
import { db } from '@/lib/db/store';
import { Footer } from '@/components/navigation/Footer';
import { BookingWizard } from '@/components/booking/BookingWizard';

export const metadata = {
  title: 'Book a Shoot — JK Cinematic Photography',
  description: 'Schedule a photography commission or fine-art portrait session with JK. Check live availability and receive instant quote estimation.',
};

export default function BookPage() {
  const services = db.getServices();
  const packages = db.getPackages();
  const addons = db.getAddons();
  const travelZones = db.getTravelZones();

  return (
    <>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-6 text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-gold">
            Direct Commission
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-text font-normal">
            Reserve Your Frame
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
            Select your event, date, and location. We place a complimentary reservation hold while we consult with you.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-xs font-mono text-gold">Loading booking engine...</div>}>
          <BookingWizard
            services={services}
            packages={packages}
            addons={addons}
            travelZones={travelZones}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
