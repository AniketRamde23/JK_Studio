import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/store';
import { Footer } from '@/components/navigation/Footer';
import {
  CheckCircle,
  Calendar,
  MapPin,
  ShieldCheck,
  Phone,
  Mail,
  Clock,
  User,
  PhoneCall,
  FileText,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';

export const revalidate = 0;

export default function BookingTrackerPage({
  params,
}: {
  params: { token: string };
}) {
  const token = params.token;
  let booking = db.getBookingByToken(token);
  if (!booking) {
    booking = db.getBookingByPublicId(token);
  }

  if (!booking) {
    notFound();
  }

  const session = booking.sessions[0];
  const fullAddress = [
    session?.locationName,
    session?.area,
    session?.district,
    session?.city,
    session?.state,
    session?.pincode,
  ].filter(Boolean).join(', ') || session?.city || 'Local Hyderabad';

  const eventName = booking.functionType || session?.sessionName || 'Photography Session';

  return (
    <>
      <main className="min-h-screen pt-28 pb-20 px-5 sm:px-8 max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-text-muted hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="rounded-2xl border border-ink-line bg-ink-stage p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-2xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-gold uppercase tracking-widest">
                Reservation Active
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-text font-normal">
              Booking Information
            </h1>
            <p className="text-xs text-text-muted font-mono">
              Reference ID: <span className="text-gold-hi font-bold">{booking.publicId}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-full font-mono text-xs uppercase font-semibold bg-gold/15 text-gold-hi border border-gold/40 shadow-sm flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>Date Hold Reserved</span>
            </span>
          </div>
        </div>

        {/* Main Booking Information Card */}
        <div className="rounded-2xl border border-ink-line bg-ink-curtain p-6 sm:p-8 space-y-8 shadow-2xl">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
              Confirmed Details
            </span>
            <h2 className="font-serif text-2xl text-text font-normal">
              Event & Location Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Occasion / Function */}
            <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1">
              <span className="text-text-muted text-[11px] font-mono uppercase flex items-center gap-1.5">
                <FileText size={12} className="text-gold" />
                <span>Function / Event</span>
              </span>
              <p className="font-serif text-lg text-gold-hi font-medium">
                {eventName}
              </p>
            </div>

            {/* Shoot Dates */}
            <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1">
              <span className="text-text-muted text-[11px] font-mono uppercase flex items-center gap-1.5">
                <Calendar size={12} className="text-gold" />
                <span>Shoot Date(s) & Slot</span>
              </span>
              <p className="font-mono text-sm text-text font-semibold">
                {booking.sessions.map((s) => `${s.date} (${s.slot})`).join(', ')}
              </p>
            </div>

            {/* Location */}
            <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1 md:col-span-2">
              <span className="text-text-muted text-[11px] font-mono uppercase flex items-center gap-1.5">
                <MapPin size={12} className="text-gold" />
                <span>Shoot Location</span>
              </span>
              <p className="text-sm text-text font-medium leading-relaxed">
                {fullAddress}
              </p>
            </div>

            {/* Client Name */}
            <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1">
              <span className="text-text-muted text-[11px] font-mono uppercase flex items-center gap-1.5">
                <User size={12} className="text-gold" />
                <span>Customer Name</span>
              </span>
              <p className="text-sm text-text font-medium">
                {booking.customer?.name}
              </p>
            </div>

            {/* Primary Phone */}
            <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1">
              <span className="text-text-muted text-[11px] font-mono uppercase flex items-center gap-1.5">
                <Phone size={12} className="text-gold" />
                <span>Primary Phone / WhatsApp</span>
              </span>
              <p className="font-mono text-sm text-gold-hi font-semibold">
                {booking.customer?.phone}
              </p>
            </div>

            {/* Alternate Phone (if provided) */}
            {booking.customer?.alternatePhone && (
              <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1">
                <span className="text-text-muted text-[11px] font-mono uppercase flex items-center gap-1.5">
                  <PhoneCall size={12} className="text-gold" />
                  <span>Alternate Phone</span>
                </span>
                <p className="font-mono text-sm text-text font-medium">
                  {booking.customer?.alternatePhone}
                </p>
              </div>
            )}

            {/* Email Address */}
            <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1">
              <span className="text-text-muted text-[11px] font-mono uppercase flex items-center gap-1.5">
                <Mail size={12} className="text-gold" />
                <span>Email Address</span>
              </span>
              <p className="font-mono text-sm text-text font-medium">
                {booking.customer?.email}
              </p>
            </div>

            {/* Call Timing */}
            {booking.customer?.callPreference && (
              <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1">
                <span className="text-text-muted text-[11px] font-mono uppercase flex items-center gap-1.5">
                  <Clock size={12} className="text-gold" />
                  <span>Preferred Consultation Timing</span>
                </span>
                <p className="text-sm text-gold font-medium">
                  {booking.customer?.callPreference}
                </p>
              </div>
            )}

            {/* Vision / Notes */}
            {booking.notes && (
              <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1 md:col-span-2">
                <span className="text-text-muted text-[11px] font-mono uppercase">
                  Event Notes / Special Requests
                </span>
                <p className="text-sm text-text leading-relaxed">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          {/* Pricing & Consultation Notice */}
          <div className="p-5 rounded-xl bg-gold/10 border border-gold/40 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-gold font-medium text-sm">
              <Phone size={16} />
              <span>Personalized Phone Consultation</span>
            </div>
            <p className="text-text-muted leading-relaxed">
              Kashinath Jale will contact you on your registered phone number according to your preferred call timing to finalize pricing, shoot coverage hours, camera crew size, and creative deliverables.
            </p>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={`https://wa.me/919177856208?text=Hi%20Kashinath,%20regarding%20my%20booking%20reference%20${booking.publicId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-mono text-xs uppercase tracking-wider hover:bg-emerald-500 transition-colors shadow-lg"
          >
            <MessageSquare size={15} />
            <span>WhatsApp (+91 91778 56208)</span>
          </a>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-ink-line bg-ink-stage text-text hover:text-gold text-xs font-mono uppercase tracking-wider transition-colors"
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
