import React from 'react';
import { db } from '@/lib/db/store';
import { Footer } from '@/components/navigation/Footer';
import { ActingView } from '@/components/acting/ActingView';

export const metadata = {
  title: 'Acting Portfolio & Showreel — JK',
  description: 'Screen performances, showreel, theatrical training, and casting profile for JK.',
};

export default function ActingPage() {
  const profile = db.getActingProfile();

  return (
    <>
      <main className="min-h-screen pt-24 pb-16">
        <ActingView profile={profile} />
      </main>
      <Footer />
    </>
  );
}
