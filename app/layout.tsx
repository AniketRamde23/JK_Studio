import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { MediaProtection } from '@/components/security/MediaProtection';
import { NavigationProgress } from '@/components/navigation/NavigationProgress';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kashinath Jale (JK) — Actor & Cinematic Photography Portfolio',
  description: 'I perform stories on screen. I preserve stories through my lens. Cinematic portfolio, showreel, and online photography booking.',
  keywords: ['Kashinath Jale', 'Actor', 'Cinematic Photography', 'Wedding Photography', 'Hyderabad Actor', 'JK Photography', 'Editorial Stills'],
  authors: [{ name: 'Kashinath Jale' }],
  openGraph: {
    title: 'Kashinath Jale (JK) — Actor & Cinematic Photography Portfolio',
    description: 'I perform stories on screen. I preserve stories through my lens.',
    url: 'https://actorjk.com',
    siteName: 'Kashinath Jale — Actor & Photography',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'JK Cinematic Portfolio',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-ink text-text font-sans antialiased selection:bg-gold/20 selection:text-gold-hi min-h-screen flex flex-col">
        <NavigationProgress />
        <div className="film-grain" aria-hidden="true" />
        <MediaProtection />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
