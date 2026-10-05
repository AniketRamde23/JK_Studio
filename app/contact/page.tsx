'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/navigation/Footer';
import {
  Film,
  Camera,
  Calendar,
  Send,
  CheckCircle,
  MessageSquare,
  Instagram,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';

export default function ContactPage() {
  // General contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setSentSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error transmitting message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen pt-28 pb-20 px-5 sm:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold">
            Direct Communications
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-text font-normal">
            Connect with Kashinath Jale (JK)
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Dedicated pathways for cinematic auditions, casting inquiries, and bespoke photography commissions.
          </p>
        </div>

        {/* Two Large Equal Panels (Design Spec Sec 4.7) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel 1: Acting & Casting Enquiry */}
          <div className="rounded-2xl border border-ink-line bg-ink-stage p-8 space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
                <Film size={22} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-gold tracking-widest block">
                  Casting Directors & Producers
                </span>
                <h2 className="font-serif text-3xl text-text font-medium mt-1">
                  Acting & Screen Inquiries
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                For script submissions, screen test requests, look tests, and casting director inquiries for feature films, web series, and commercials.
              </p>
            </div>

            <div className="pt-4 border-t border-ink-line flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/acting#casting-enquiry"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gold text-ink font-semibold text-xs tracking-wider uppercase hover:bg-gold-hi transition-colors shadow-lg shadow-gold/15"
              >
                <span>Open Casting Form</span>
                <ArrowRight size={14} />
              </Link>
              <a
                href="mailto:casting@actorjk.com"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-ink-line bg-ink-curtain text-text text-xs uppercase hover:text-gold hover:border-gold transition-colors"
              >
                <Mail size={14} />
                <span>casting@actorjk.com</span>
              </a>
            </div>
          </div>

          {/* Panel 2: Photography Commission */}
          <div className="rounded-2xl border border-ink-line bg-ink-stage p-8 space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#A8C4EC]/10 border border-[#A8C4EC]/40 flex items-center justify-center text-[#A8C4EC]">
                <Camera size={22} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-[#A8C4EC] tracking-widest block">
                  Couples & Brands
                </span>
                <h2 className="font-serif text-3xl text-text font-medium mt-1">
                  Photography Commissions
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Reserve wedding chronicles, fine-art portrait sittings, or brand fashion campaigns. Enjoy personalized phone consultation and atomic date hold protection.
              </p>
            </div>

            <div className="pt-4 border-t border-ink-line flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-text text-ink font-semibold text-xs tracking-wider uppercase hover:bg-white transition-colors shadow-lg"
              >
                <Calendar size={14} />
                <span>Launch Booking Engine</span>
              </Link>
              <a
                href="https://wa.me/919177856208"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-ink-line bg-ink-curtain text-[#25D366] text-xs uppercase hover:border-[#25D366] transition-colors"
              >
                <MessageSquare size={14} />
                <span>Direct WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* General Direct Message Form & Direct Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-ink-line">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
                Studio Coordinates
              </span>
              <h3 className="font-serif text-2xl text-text font-normal">
                Direct Channels
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1">
                <span className="text-text-muted text-[11px]">Primary Email</span>
                <p className="text-sm font-sans text-text font-medium">contact@actorjk.com</p>
              </div>

              <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1">
                <span className="text-text-muted text-[11px]">Direct Management Line</span>
                <p className="text-sm font-sans text-text font-medium">
                  <a href="tel:+919177856208" className="hover:text-gold transition-colors text-gold">
                    +91 91778 56208
                  </a>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-ink-line bg-ink-stage space-y-1">
                <span className="text-text-muted text-[11px]">Primary Production Hubs</span>
                <p className="text-sm font-sans text-text font-medium">Jubilee Hills, Hyderabad · Andheri West, Mumbai</p>
              </div>
            </div>

            {/* Socials */}
            <div className="pt-2 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted block">
                Instagram Profiles
              </span>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/actor_jk_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-3 rounded-xl border border-ink-line bg-ink-curtain hover:border-gold/50 flex items-center gap-2 text-xs transition-colors"
                >
                  <Instagram size={16} className="text-gold" />
                  <span className="text-text">@actor_jk_</span>
                </a>
                <a
                  href="https://instagram.com/jkphotography2168"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-3 rounded-xl border border-ink-line bg-ink-curtain hover:border-gold/50 flex items-center gap-2 text-xs transition-colors"
                >
                  <Instagram size={16} className="text-gold" />
                  <span className="text-text">@jkphotography2168</span>
                </a>
              </div>
            </div>
          </div>

          {/* Direct Message Form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-ink-line bg-ink-stage p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-text font-normal mb-2">
              Send a General Note
            </h3>
            <p className="text-xs text-text-muted mb-6">
              Press inquiries, collaborations, or general questions.
            </p>

            {sentSuccess ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-status-available/15 border border-status-available text-status-available flex items-center justify-center mx-auto">
                  <CheckCircle size={24} />
                </div>
                <h4 className="font-serif text-xl text-text">Message Delivered</h4>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  Thank you for writing. We will respond to your inquiry within 24 hours.
                </p>
                <button
                  onClick={() => setSentSuccess(false)}
                  className="text-xs font-mono text-gold underline pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-text-muted">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-text-muted">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-text-muted">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98000 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-text-muted">Subject</label>
                    <input
                      type="text"
                      placeholder="Collaboration / Press / Inquiry"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-text-muted">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gold text-ink font-semibold text-xs tracking-wider uppercase hover:bg-gold-hi transition-colors shadow-lg shadow-gold/15"
                >
                  <Send size={14} />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
