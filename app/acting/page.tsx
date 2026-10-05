import React from 'react';
import { db } from '@/lib/db/store';
import { Footer } from '@/components/navigation/Footer';
import { ActingView } from '@/components/acting/ActingView';

export const metadata = {
  title: 'Acting Portfolio & Filmography — JK',
  description: 'Screen performances, showreel, theatrical training, and acting credits across feature films and web series for JK.',
};

export default function ActingPage() {
  const profile = db.getActingProfile();
  const projects = db.getActingProjects();

  return (
    <>
      <main className="min-h-screen pt-24 pb-16">
        <ActingView profile={profile} projects={projects} />
      </main>
      <Footer />
    </>
  );
}
