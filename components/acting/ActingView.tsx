'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Download,
  Calendar,
  Send,
  CheckCircle,
  Play,
  X,
  ExternalLink,
  Shield,
  Layers,
  MapPin,
  Languages
} from 'lucide-react';
import { ActingProfile, ActingProject } from '@/lib/db/types';

interface Props {
  profile: ActingProfile;
  projects: ActingProject[];
}

const CATEGORIES = ['All', 'Movie', 'Web Series', 'Ad / TVC', 'Theatre'] as const;

export function ActingView({ profile, projects }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ActingProject | null>(null);
  const [playingReel, setPlayingReel] = useState(false);

  // Casting Form State
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProject, setFormProject] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formProjectType, setFormProjectType] = useState('Feature Film');
  const [formDates, setFormDates] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.type === activeCategory);

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries/acting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          company: formCompany,
          email: formEmail,
          phone: formPhone,
          project: formProject,
          role: formRole,
          projectType: formProjectType,
          datesNeeded: formDates,
          message: formMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry');

      setSubmitSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting casting enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-24 py-12 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* 1. Profile Header (PRD Sec 7.3 & Design Spec 4.3) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden border border-ink-line bg-ink-curtain shadow-2xl">
          <Image
            src="/photos/optimized/5.webp"
            alt="JK Acting Headshot"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold">
              Screen Performance & Classical Arts
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-text font-normal">
              {profile.name}
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-gold-hi">
              "{profile.shortBio}"
            </p>
          </div>

          <p className="text-sm leading-relaxed text-text-muted max-w-xl font-sans">
            {profile.bio}
          </p>

          {/* Facts Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-ink-line text-xs">
            <div>
              <span className="text-text-muted block text-[11px] font-mono">Location</span>
              <span className="font-medium text-text">{profile.location}</span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px] font-mono">Height</span>
              <span className="font-mono text-text">{profile.height}</span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px] font-mono">Languages</span>
              <span className="text-text">Telugu, Hindi, English</span>
            </div>
          </div>

          {/* Skills list */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
              Specialized Screen Skills
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-xs font-mono border border-ink-line bg-ink-curtain text-text/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Downloads (PRD Sec 7.3) */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#casting-enquiry"
              className="px-6 py-3 rounded-full bg-gold text-ink font-semibold text-xs tracking-wider uppercase hover:bg-gold-hi transition-colors shadow-lg shadow-gold/15"
            >
              Casting Inquiry
            </a>
            <button
              onClick={() => alert('Download CV (PDF): Feature active for production casting.')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-ink-line bg-ink-stage text-text hover:border-gold hover:text-gold text-xs font-medium tracking-wider uppercase transition-colors"
            >
              <Download size={14} />
              <span>Actor CV / Bio Pack</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Showreel Section */}
      <section className="rounded-2xl border border-ink-line bg-ink-stage p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
              Screen Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-text font-normal">
              2025 Cinematic Showreel
            </h2>
          </div>
          <span className="text-xs font-mono text-text-muted">4K HDR Montage · 02:45</span>
        </div>

        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-ink-line bg-black shadow-2xl">
          <video
            src="/videos/acting_showreel.mp4"
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        </div>
      </section>

      {/* 3. Credits Grid (PRD Sec 7.3: Movies, Short Films, Web Series, Ads, Theatre) */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
              Filmography & Stage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-text font-normal">
              Acting Credits
            </h2>
          </div>

          {/* Filter Chips (Design Spec 7.13: sliding pill) */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-gold text-ink font-semibold shadow-md'
                    : 'bg-ink-curtain border border-ink-line text-text-muted hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2:3 Poster Grid (Design Spec 3.3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              whileHover={{ y: -4 }}
              className="group rounded-xl border border-ink-line bg-ink-stage overflow-hidden cursor-pointer hover:border-gold/50 transition-all shadow-xl"
              data-cursor="photo"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-ink-curtain">
                <Image
                  src={project.posterUrl}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-ink/80 backdrop-blur-sm border border-ink-line text-[11px] font-mono text-gold-hi uppercase">
                  {project.type} · {project.year}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif text-2xl text-text font-medium group-hover:text-gold transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs font-mono text-gold-hi">
                  {project.role}
                </p>
                <p className="text-xs text-text-muted">
                  Dir: {project.director} · {project.production}
                </p>
                <p className="text-xs text-text/80 line-clamp-2 pt-1">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Casting Enquiry Form (PRD Sec 7.9) */}
      <section id="casting-enquiry" className="rounded-2xl border border-ink-line bg-ink-stage p-6 sm:p-12 max-w-4xl mx-auto shadow-2xl">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-gold">
            Casting Representation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-text font-normal">
            "Casting a project? Send the details."
          </h2>
          <p className="text-xs text-text-muted">
            Direct pipeline to JK's talent management team. We prioritize feature film and lead script submissions.
          </p>
        </div>

        {submitSuccess ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 rounded-full bg-status-available/15 border border-status-available text-status-available flex items-center justify-center mx-auto">
              <CheckCircle size={28} />
            </div>
            <h3 className="font-serif text-2xl text-text">Inquiry Received</h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Thank you for reaching out. JK's management will review your production brief and get back to you promptly.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="text-xs font-mono text-gold underline pt-2"
            >
              Submit another project enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitEnquiry} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-text-muted">Your Name / Casting Director</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mukesh Chhabra"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-text-muted">Production House / Agency</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dharma / Mythri / OTT Original"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-text-muted">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="casting@agency.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-text-muted">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98000 00000"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-text-muted">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="Project working title"
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-text-muted">Character / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Antagonist / Commander"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-text-muted">Tentative Dates</label>
                <input
                  type="text"
                  placeholder="e.g. Nov 2026 - Jan 2027"
                  value={formDates}
                  onChange={(e) => setFormDates(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-text-muted">Project Brief & Details</label>
              <textarea
                rows={4}
                required
                placeholder="Synopsis, director details, audition dates, or look-test locations..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full p-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none resize-none"
              />
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold text-ink font-semibold text-xs tracking-wider uppercase hover:bg-gold-hi disabled:opacity-50 transition-colors shadow-lg shadow-gold/15"
              >
                <Send size={15} />
                <span>{submitting ? 'Transmitting Brief...' : 'Send Casting Enquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Showreel Fullscreen Modal */}
      <AnimatePresence>
        {playingReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-ink-line shadow-2xl">
              <button
                onClick={() => setPlayingReel(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-ink/80 border border-ink-line text-text hover:text-gold flex items-center justify-center transition-colors"
                aria-label="Close showreel"
              >
                <X size={20} />
              </button>
              <video
                src={profile.showreelUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-ink-stage border border-ink-line rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-ink-curtain border border-ink-line text-text-muted hover:text-text flex items-center justify-center transition-colors"
                aria-label="Close project details"
              >
                <X size={18} />
              </button>

              <span className="text-xs font-mono text-gold uppercase tracking-wider block">
                {selectedProject.type} · {selectedProject.year}
              </span>

              <h3 className="font-serif text-3xl text-text font-normal">
                {selectedProject.title}
              </h3>

              <div className="font-mono text-xs text-gold-hi">
                Character: {selectedProject.role}
              </div>

              <div className="text-xs text-text-muted">
                Director: {selectedProject.director} | Production: {selectedProject.production}
              </div>

              <p className="text-sm text-text/80 leading-relaxed pt-2">
                {selectedProject.description}
              </p>

              <div className="pt-4 border-t border-ink-line flex justify-end">
                <a
                  href="#casting-enquiry"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-full bg-gold text-ink text-xs font-semibold uppercase tracking-wider hover:bg-gold-hi transition-colors"
                >
                  Inquire for Similar Role
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
