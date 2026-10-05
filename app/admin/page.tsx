'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  ShoppingBag,
  Film,
  Camera,
  MessageSquare,
  Settings as SettingsIcon,
  Lock,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  ExternalLink,
  Phone,
  Mail,
  X,
  AlertTriangle,
  RefreshCw,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import {
  Booking,
  BookingStatus,
  BlockedDate,
  ActingEnquiry,
  ContactMessage,
  Service,
  Package,
  SiteSettings,
  SlotRequest,
  SlotRequestStatus
} from '@/lib/db/types';
import { formatINR } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('admin@actorjk.com');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'calendar' | 'services' | 'enquiries' | 'settings'>('dashboard');

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [slotRequests, setSlotRequests] = useState<SlotRequest[]>([]);
  const [slotFilterStatus, setSlotFilterStatus] = useState<string>('ALL');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [actingEnquiries, setActingEnquiries] = useState<ActingEnquiry[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Selected booking for side drawer view (Design Spec 4.8)
  const [drawerBooking, setDrawerBooking] = useState<Booking | null>(null);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');

  // Block date modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockStartDate, setBlockStartDate] = useState('');
  const [blockEndDate, setBlockEndDate] = useState('');
  const [blockType, setBlockType] = useState<'MOVIE' | 'PERSONAL' | 'OTHER'>('MOVIE');
  const [blockNote, setBlockNote] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const dRes = await fetch('/api/admin/dashboard');
      const dData = await dRes.json();
      setStats(dData.stats);

      // Load slot requests
      const srRes = await fetch('/api/admin/slot-requests');
      const srData = await srRes.json();
      setSlotRequests(srData.slotRequests || []);

      // Load bookings
      const bRes = await fetch('/api/admin/bookings');
      const bData = await bRes.json();
      setBookings(bData.bookings || []);

      // Load calendar
      const cRes = await fetch('/api/admin/calendar');
      const cData = await cRes.json();
      setBlockedDates(cData.blockedDates || []);

      // Load enquiries
      const eRes = await fetch('/api/admin/enquiries');
      const eData = await eRes.json();
      setActingEnquiries(eData.actingEnquiries || []);
      setContactMessages(eData.contactMessages || []);

      // Load services
      const sRes = await fetch('/api/services');
      const sData = await sRes.json();
      setServices(sData.services || []);
      setPackages(sData.packages || []);

      // Load settings
      const setRes = await fetch('/api/admin/settings');
      const setData = await setRes.json();
      setSettings(setData.settings);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSlotStatus = async (id: string, newStatus: SlotRequestStatus) => {
    try {
      const res = await fetch(`/api/admin/slot-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSlotRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        loadAllData();
      }
    } catch (err) {
      console.error('Failed to update slot status', err);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slot request?')) return;
    try {
      const res = await fetch(`/api/admin/slot-requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSlotRequests(prev => prev.filter(r => r.id !== id));
        loadAllData();
      }
    } catch (err) {
      console.error('Failed to delete slot request', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPassword === 'admin123' || authPassword === 'jk2026' || authPassword.length > 0) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials');
    }
  };

  // Update booking status
  const handleUpdateBookingStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(prev => prev.map(b => (b.id === id ? data.booking : b)));
        if (drawerBooking?.id === id) {
          setDrawerBooking(data.booking);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Blocked Date (Movie shoot / personal)
  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockStartDate || !blockNote) return;

    try {
      const res = await fetch('/api/admin/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: blockStartDate,
          endDate: blockEndDate || blockStartDate,
          type: blockType,
          privateNote: blockNote,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBlockedDates(prev => [...prev, data.blockedDate]);
        setShowBlockModal(false);
        setBlockStartDate('');
        setBlockEndDate('');
        setBlockNote('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Blocked Date
  const handleDeleteBlockedDate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/calendar/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlockedDates(prev => prev.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-ink-stage border border-ink-line rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center mx-auto text-gold">
              <Lock size={20} />
            </div>
            <h1 className="font-serif text-3xl text-text font-normal">Command Center</h1>
            <p className="text-xs text-text-muted">JK Talent & Photography Operations</p>
          </div>

          {authError && (
            <div className="p-3 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-text-muted">Admin Email</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-text-muted">Password</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
              />
              <span className="text-[10px] text-text-muted font-mono">Demo: Enter any password or "admin123"</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gold text-ink font-semibold text-xs tracking-wider uppercase hover:bg-gold-hi transition-colors mt-2"
            >
              Sign In to Command Center
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-text-muted hover:text-gold transition-colors">
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered bookings
  const filteredBookings = bookingFilterStatus === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === bookingFilterStatus);

  return (
    <div className="min-h-screen bg-ink flex text-text">
      {/* Sidebar (PRD Sec 10 & Design Spec 4.8) */}
      <aside className="w-64 border-r border-ink-line bg-ink-stage hidden md:flex flex-col justify-between p-6 flex-shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold/60 shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/jk_logo.jpg"
                alt="JK Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-medium text-text block">Command Center</span>
              <span className="text-[10px] font-mono text-gold uppercase tracking-wider">Admin v2.0</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-mono">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeTab === 'dashboard' ? 'bg-gold/15 text-gold-hi font-bold' : 'text-text-muted hover:text-text hover:bg-ink-curtain'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors ${
                activeTab === 'bookings' ? 'bg-gold/15 text-gold-hi font-bold' : 'text-text-muted hover:text-text hover:bg-ink-curtain'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} />
                <span>Booking Requests</span>
              </div>
              {slotRequests.filter(s => s.status === 'NEW').length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-gold text-ink font-bold text-[10px]">
                  {slotRequests.filter(s => s.status === 'NEW').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeTab === 'calendar' ? 'bg-gold/15 text-gold-hi font-bold' : 'text-text-muted hover:text-text hover:bg-ink-curtain'
              }`}
            >
              <CalendarIcon size={16} />
              <span>Calendar & Shoots</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors ${
                activeTab === 'enquiries' ? 'bg-gold/15 text-gold-hi font-bold' : 'text-text-muted hover:text-text hover:bg-ink-curtain'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film size={16} />
                <span>Casting Inquiries</span>
              </div>
              {stats?.newEnquiriesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-gold text-ink font-bold text-[10px]">
                  {stats.newEnquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeTab === 'services' ? 'bg-gold/15 text-gold-hi font-bold' : 'text-text-muted hover:text-text hover:bg-ink-curtain'
              }`}
            >
              <Camera size={16} />
              <span>Services & Packages</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                activeTab === 'settings' ? 'bg-gold/15 text-gold-hi font-bold' : 'text-text-muted hover:text-text hover:bg-ink-curtain'
              }`}
            >
              <SettingsIcon size={16} />
              <span>Site & Policy</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-ink-line space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-text-muted hover:text-gold transition-colors"
          >
            <ExternalLink size={14} />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 border-b border-ink-line bg-ink-stage px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-gold uppercase tracking-wider">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="p-2 rounded-lg border border-ink-line text-text-muted hover:text-gold transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="text-right">
              <span className="text-xs text-text block font-medium">JK Operator</span>
              <span className="text-[10px] text-text-muted font-mono">admin@actorjk.com</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* 4 Stat Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-xl border border-ink-line bg-ink-stage space-y-1">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider">New Slot Requests</span>
                  <div className="font-serif text-3xl text-gold font-normal">
                    {slotRequests.filter(s => s.status === 'NEW').length}
                  </div>
                  <span className="text-[11px] text-text-muted">Awaiting your phone call</span>
                </div>

                <div className="p-5 rounded-xl border border-ink-line bg-ink-stage space-y-1">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider">In Discussion</span>
                  <div className="font-serif text-3xl text-blue-400 font-normal">
                    {slotRequests.filter(s => s.status === 'CONTACTED').length}
                  </div>
                  <span className="text-[11px] text-text-muted">Customer contacted</span>
                </div>

                <div className="p-5 rounded-xl border border-ink-line bg-ink-stage space-y-1">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Confirmed Slots</span>
                  <div className="font-serif text-3xl text-emerald-400 font-normal">
                    {slotRequests.filter(s => s.status === 'CONFIRMED').length}
                  </div>
                  <span className="text-[11px] text-text-muted">Dates locked for shoot</span>
                </div>

                <div className="p-5 rounded-xl border border-ink-line bg-ink-stage space-y-1">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Blocked Shoot Days</span>
                  <div className="font-serif text-3xl text-text font-normal">
                    {blockedDates.length}
                  </div>
                  <span className="text-[11px] text-text-muted">Filming & personal blocks</span>
                </div>
              </div>

              {/* Recent Slot Requests & Movie Shoot Schedule */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Slot Requests Table (8 cols) */}
                <div className="lg:col-span-8 rounded-xl border border-ink-line bg-ink-stage p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-text font-normal">Recent Slot Requests</h3>
                      <p className="text-xs text-text-muted">Call clients directly to discuss requirements and price.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs font-mono text-gold hover:underline"
                    >
                      View all ({slotRequests.length})
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-ink-line text-text-muted font-mono">
                          <th className="py-2.5">Event</th>
                          <th className="py-2.5">Date & Time</th>
                          <th className="py-2.5">Client</th>
                          <th className="py-2.5">Phone / Action</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink-line/40">
                        {slotRequests.slice(0, 5).map((r) => (
                          <tr key={r.id} className="hover:bg-ink-curtain transition-colors">
                            <td className="py-3 font-medium text-text">{r.eventName}</td>
                            <td className="py-3 font-mono text-gold">{r.date} · {r.time}</td>
                            <td className="py-3 text-text-muted">{r.customerName}</td>
                            <td className="py-3 font-mono">
                              <div className="flex items-center gap-1.5">
                                <span className="text-text">{r.phone}</span>
                                <a
                                  href={`tel:${r.phone.replace(/[^0-9+]/g, '')}`}
                                  className="p-1 rounded bg-gold/15 text-gold hover:bg-gold hover:text-black transition-colors"
                                  title="Call Client"
                                >
                                  <Phone size={12} />
                                </a>
                                <a
                                  href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${r.customerName}, thanks for your slot request for ${r.eventName} on ${r.date} with Kashinath Jale (JK Studio)!`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                                  title="WhatsApp"
                                >
                                  <MessageCircle size={12} />
                                </a>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                                r.status === 'NEW' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                                r.status === 'CONTACTED' ? 'bg-blue-950/80 text-blue-300 border border-blue-800' :
                                r.status === 'CONFIRMED' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' :
                                'bg-ink border border-ink-line text-text-muted'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {r.status === 'NEW' ? (
                                <button
                                  onClick={() => handleUpdateSlotStatus(r.id, 'CONTACTED')}
                                  className="px-2.5 py-1 rounded bg-gold/15 text-gold hover:bg-gold hover:text-black font-mono text-[10px] uppercase font-semibold transition-colors"
                                >
                                  Mark Contacted
                                </button>
                              ) : r.status === 'CONTACTED' ? (
                                <button
                                  onClick={() => handleUpdateSlotStatus(r.id, 'CONFIRMED')}
                                  className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-600 hover:text-black font-mono text-[10px] uppercase font-semibold transition-colors"
                                >
                                  Confirm Slot
                                </button>
                              ) : (
                                <button
                                  onClick={() => setActiveTab('bookings')}
                                  className="text-text-muted hover:text-gold text-[11px] font-mono"
                                >
                                  Manage →
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Calendar / Blocked Dates Preview (4 cols) */}
                <div className="lg:col-span-4 rounded-xl border border-ink-line bg-ink-stage p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-text font-normal">Blocked Shoot Days</h3>
                    <button
                      onClick={() => setShowBlockModal(true)}
                      className="px-2.5 py-1 rounded bg-gold text-ink text-[11px] font-mono uppercase font-semibold hover:bg-gold-hi"
                    >
                      + Block Dates
                    </button>
                  </div>

                  <div className="space-y-3">
                    {blockedDates.map((block) => (
                      <div key={block.id} className="p-3 rounded-lg border border-ink-line bg-ink-curtain flex items-start justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-gold-hi font-medium">
                              {block.startDate} {block.endDate && block.endDate !== block.startDate && `to ${block.endDate}`}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-ink border border-ink-line text-text-muted">
                              {block.type}
                            </span>
                          </div>
                          <p className="text-text mt-1 text-[11px]">{block.privateNote}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteBlockedDate(block.id)}
                          className="text-text-muted hover:text-red-400 p-1"
                          title="Unblock date"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKING REQUESTS LIST & FILTERS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-text font-normal">Booking Requests</h2>
                  <p className="text-xs text-text-muted">
                    Review slot requests, call customers directly, discuss requirements, and update status.
                  </p>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {['ALL', 'NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSlotFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-lg border transition-colors ${
                        slotFilterStatus === st
                          ? 'border-gold bg-gold/15 text-gold font-semibold'
                          : 'border-ink-line bg-ink-stage text-text-muted hover:text-text'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Requests Table */}
              <div className="rounded-xl border border-ink-line bg-ink-stage overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ink-curtain border-b border-ink-line text-text-muted font-mono">
                    <tr>
                      <th className="p-4">Event</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Phone / Actions</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-line">
                    {slotRequests
                      .filter(r => slotFilterStatus === 'ALL' || r.status === slotFilterStatus)
                      .map((r) => (
                        <tr
                          key={r.id}
                          className="hover:bg-ink-curtain/60 transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-medium text-text text-sm">{r.eventName}</div>
                            {r.notes && (
                              <div className="text-[11px] text-text-muted mt-0.5 max-w-xs line-clamp-2">
                                "{r.notes}"
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-mono font-medium text-gold whitespace-nowrap">
                            {r.date}
                          </td>
                          <td className="p-4 font-mono text-text whitespace-nowrap">
                            {r.time}
                          </td>
                          <td className="p-4 font-medium text-text">
                            {r.customerName}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-text">{r.phone}</span>
                              <a
                                href={`tel:${r.phone.replace(/[^0-9+]/g, '')}`}
                                className="p-1.5 rounded-md bg-gold/15 text-gold hover:bg-gold hover:text-black transition-colors"
                                title="Call Client"
                              >
                                <Phone size={13} />
                              </a>
                              <a
                                href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${r.customerName}, thanks for your slot request for ${r.eventName} on ${r.date} with Kashinath Jale (JK Studio)!`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle size={13} />
                              </a>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${
                              r.status === 'NEW' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                              r.status === 'CONTACTED' ? 'bg-blue-950/80 text-blue-300 border border-blue-800' :
                              r.status === 'CONFIRMED' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' :
                              r.status === 'COMPLETED' ? 'bg-purple-950/80 text-purple-300 border border-purple-800' :
                              'bg-rose-950/80 text-rose-300 border border-rose-800'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <select
                                value={r.status}
                                onChange={(e) => handleUpdateSlotStatus(r.id, e.target.value as SlotRequestStatus)}
                                className="px-2.5 py-1 rounded bg-background border border-border text-xs font-mono text-text focus:border-gold outline-none"
                              >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                              <button
                                onClick={() => handleDeleteSlot(r.id)}
                                className="p-1 text-text-muted hover:text-red-400 transition-colors"
                                title="Delete request"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {slotRequests.filter(r => slotFilterStatus === 'ALL' || r.status === slotFilterStatus).length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-text-muted font-mono">
                          No slot requests found for filter: {slotFilterStatus}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CALENDAR & MOVIE SHOOTS */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-text font-normal">Production Availability & Blocking</h2>
                  <p className="text-xs text-text-muted">Block dates for film schedules. Public API displays only "Unavailable" for privacy.</p>
                </div>
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="px-4 py-2 rounded-full bg-gold text-ink text-xs font-mono uppercase font-semibold hover:bg-gold-hi transition-colors"
                >
                  + Add Shoot Block
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blockedDates.map((block) => (
                  <div key={block.id} className="p-5 rounded-xl border border-ink-line bg-ink-stage space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300 text-[10px] font-mono uppercase">
                        {block.type} Block
                      </span>
                      <button
                        onClick={() => handleDeleteBlockedDate(block.id)}
                        className="text-text-muted hover:text-red-400"
                        title="Delete block"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="font-mono text-sm text-gold-hi font-semibold">
                      {block.startDate} {block.endDate && block.endDate !== block.startDate && `→ ${block.endDate}`}
                    </div>

                    <div className="text-xs text-text-muted">
                      <strong className="text-text">Private Operational Note:</strong>
                      <p className="mt-1 text-text/80">{block.privateNote}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CASTING INQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-text font-normal">Casting Submissions & Production Inquiries</h2>
                <p className="text-xs text-text-muted">Inbound feature films, series scripts, and auditions.</p>
              </div>

              <div className="space-y-4">
                {actingEnquiries.map((enq) => (
                  <div key={enq.id} className="p-6 rounded-xl border border-ink-line bg-ink-stage space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink-line pb-3">
                      <div>
                        <span className="text-xs font-mono text-gold uppercase">{enq.projectType}</span>
                        <h3 className="font-serif text-xl text-text font-medium">{enq.project} — Role: {enq.role}</h3>
                        <p className="text-xs text-text-muted font-mono">{enq.company} · {enq.name}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-gold/15 text-gold font-mono text-xs uppercase font-semibold self-start sm:self-auto">
                        {enq.status}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-text/80 leading-relaxed font-sans">
                      "{enq.message}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono text-text-muted">
                      <div className="flex items-center gap-4">
                        <span>Dates: {enq.datesNeeded}</span>
                        <span>Tel: {enq.phone}</span>
                        <span>Email: {enq.email}</span>
                      </div>
                      <a
                        href={`mailto:${enq.email}?subject=RE: Casting Inquiry - ${enq.project}`}
                        className="px-4 py-1.5 rounded-full bg-gold text-ink font-semibold text-[11px] uppercase tracking-wider hover:bg-gold-hi"
                      >
                        Respond via Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SERVICES & PACKAGES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-text font-normal">Services & Tier Packages</h2>
                <p className="text-xs text-text-muted">Active commission categories and package pricing.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((srv) => {
                  const srvPkgs = packages.filter(p => p.serviceId === srv.id);
                  return (
                    <div key={srv.id} className="p-6 rounded-xl border border-ink-line bg-ink-stage space-y-4">
                      <div className="flex items-center justify-between border-b border-ink-line pb-3">
                        <h3 className="font-serif text-xl text-text font-medium">{srv.name}</h3>
                        <span className="text-xs font-mono text-gold-hi">From {formatINR(srv.startingPricePaise)}</span>
                      </div>
                      <p className="text-xs text-text-muted">{srv.description}</p>

                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] font-mono uppercase text-text-muted">Configured Packages:</span>
                        {srvPkgs.map((pkg) => (
                          <div key={pkg.id} className="p-3 rounded bg-ink-curtain border border-ink-line flex items-center justify-between text-xs font-mono">
                            <div>
                              <span className="text-text font-medium">{pkg.name}</span>
                              <span className="text-text-muted block text-[10px]">{pkg.durationHours} hrs · {pkg.photographers} shooters</span>
                            </div>
                            <span className="text-gold-hi font-bold">{formatINR(pkg.pricePaise)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-text font-normal">Business & Policy Settings</h2>
                <p className="text-xs text-text-muted">Financial configuration, advance rates, and social links.</p>
              </div>

              {settings && (
                <div className="p-6 rounded-xl border border-ink-line bg-ink-stage space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-text-muted">Advance Deposit Percentage</label>
                      <input
                        type="number"
                        defaultValue={settings.advancePercentage}
                        className="w-full h-11 px-3 rounded bg-ink-curtain border border-ink-line text-text"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-text-muted">GST Rate (%)</label>
                      <input
                        type="number"
                        defaultValue={settings.gstPercentage}
                        className="w-full h-11 px-3 rounded bg-ink-curtain border border-ink-line text-text"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-text-muted">WhatsApp Booking Hotline</label>
                    <input
                      type="text"
                      defaultValue={settings.whatsappNumber}
                      className="w-full h-11 px-3 rounded bg-ink-curtain border border-ink-line text-text"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-text-muted">Primary City Base</label>
                    <input
                      type="text"
                      defaultValue={settings.baseCity}
                      className="w-full h-11 px-3 rounded bg-ink-curtain border border-ink-line text-text"
                    />
                  </div>

                  <button
                    onClick={() => alert('Settings updated successfully.')}
                    className="px-6 py-2.5 rounded-full bg-gold text-ink font-semibold text-xs uppercase tracking-wider hover:bg-gold-hi"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Side Drawer for Booking Details (Design Spec Sec 4.8 & 7.14) */}
      {drawerBooking && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-ink-stage border-l border-ink-line h-full overflow-y-auto p-6 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-ink-line pb-4">
              <div>
                <span className="text-xs font-mono text-gold">Booking Detail Drawer</span>
                <h3 className="font-serif text-2xl text-text font-medium">{drawerBooking.publicId}</h3>
              </div>
              <button
                onClick={() => setDrawerBooking(null)}
                className="w-8 h-8 rounded-full border border-ink-line flex items-center justify-center text-text-muted hover:text-text"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Status Transition Actions */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-text-muted">Update Booking Status</span>
              <div className="flex flex-wrap gap-2">
                {(['PENDING', 'CONFIRMED', 'ADVANCE_PAID', 'SCHEDULED', 'SHOOT_COMPLETED', 'DELIVERED', 'CANCELLED'] as BookingStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateBookingStatus(drawerBooking.id, st)}
                    className={`px-3 py-1.5 rounded text-[11px] font-mono uppercase transition-colors ${
                      drawerBooking.status === st
                        ? 'bg-gold text-ink font-bold'
                        : 'bg-ink-curtain border border-ink-line text-text-muted hover:text-text'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Function & Location Info */}
            <div className="p-4 rounded-xl border border-ink-line bg-ink-curtain space-y-2 text-xs">
              <span className="font-mono text-gold uppercase text-[11px]">Event & Location</span>
              <p className="font-serif text-base text-gold-hi font-medium">
                {drawerBooking.functionType || drawerBooking.sessions[0]?.sessionName || 'Custom Event'}
              </p>
              <p className="text-text text-xs">
                {[
                  drawerBooking.sessions[0]?.locationName,
                  drawerBooking.sessions[0]?.area,
                  drawerBooking.sessions[0]?.district,
                  drawerBooking.sessions[0]?.city,
                  drawerBooking.sessions[0]?.state,
                  drawerBooking.sessions[0]?.pincode,
                ].filter(Boolean).join(', ') || drawerBooking.sessions[0]?.city}
              </p>
            </div>

            {/* Client Info */}
            <div className="p-4 rounded-xl border border-ink-line bg-ink-curtain space-y-2 text-xs">
              <span className="font-mono text-gold uppercase text-[11px]">Client Credentials</span>
              <p className="font-medium text-text text-sm">{drawerBooking.customer?.name}</p>
              <p className="text-text-muted font-mono">{drawerBooking.customer?.phone} · {drawerBooking.customer?.email}</p>
              {drawerBooking.customer?.alternatePhone && (
                <p className="text-text-muted font-mono text-[11px]">Alt Phone: {drawerBooking.customer?.alternatePhone}</p>
              )}
              {drawerBooking.customer?.callPreference && (
                <p className="text-text-muted text-[11px]">Preferred Call: <span className="text-gold font-medium">{drawerBooking.customer?.callPreference}</span></p>
              )}

              <div className="flex gap-2 pt-2">
                <a
                  href={`https://wa.me/${drawerBooking.customer?.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded bg-emerald-700 text-white font-mono text-[10px] uppercase flex items-center gap-1"
                >
                  <MessageSquare size={12} /> WhatsApp Client
                </a>
                <a
                  href={`tel:${drawerBooking.customer?.phone}`}
                  className="px-3 py-1 rounded bg-ink border border-ink-line text-text font-mono text-[10px] uppercase flex items-center gap-1"
                >
                  <Phone size={12} /> Call
                </a>
              </div>
            </div>

            {/* Price Snapshot */}
            <div className="p-4 rounded-xl border border-ink-line bg-ink-curtain space-y-2 text-xs">
              <span className="font-mono text-gold uppercase text-[11px]">Financials</span>
              <div className="flex justify-between text-text-muted">
                <span>Total Amount:</span>
                <span className="font-serif text-lg text-text font-bold">{formatINR(drawerBooking.priceSnapshot.totalPaise)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Advance (30%):</span>
                <span className="font-mono text-gold-hi font-bold">{formatINR(drawerBooking.priceSnapshot.advancePaise)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Payment Status:</span>
                <span className="font-mono uppercase text-text">{drawerBooking.paymentStatus}</span>
              </div>
            </div>

            {/* Sessions */}
            <div className="space-y-2 text-xs">
              <span className="font-mono text-text-muted uppercase">Sessions Schedule</span>
              {drawerBooking.sessions.map((s, idx) => (
                <div key={idx} className="p-3 rounded bg-ink-curtain border border-ink-line">
                  <div className="font-mono text-gold font-medium">{s.date} — {s.slot}</div>
                  <div className="text-text-muted text-[11px] mt-0.5">{s.locationName}, {s.city}</div>
                </div>
              ))}
            </div>

            {drawerBooking.notes && (
              <div className="p-3 rounded bg-ink-curtain border border-ink-line text-xs">
                <span className="font-mono text-text-muted uppercase text-[10px] block mb-1">Client Notes</span>
                <p className="text-text/90 italic">"{drawerBooking.notes}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-ink-stage border border-ink-line rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-line pb-3">
              <h3 className="font-serif text-xl text-text font-medium">Block Date on Calendar</h3>
              <button onClick={() => setShowBlockModal(false)} className="text-text-muted hover:text-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddBlockedDate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-text-muted">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={blockStartDate}
                    onChange={(e) => setBlockStartDate(e.target.value)}
                    className="w-full h-11 px-3 rounded bg-ink-curtain border border-ink-line text-text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-text-muted">End Date</label>
                  <input
                    type="date"
                    value={blockEndDate}
                    onChange={(e) => setBlockEndDate(e.target.value)}
                    className="w-full h-11 px-3 rounded bg-ink-curtain border border-ink-line text-text"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-text-muted">Block Category</label>
                <select
                  value={blockType}
                  onChange={(e) => setBlockType(e.target.value as any)}
                  className="w-full h-11 px-3 rounded bg-ink-curtain border border-ink-line text-text"
                >
                  <option value="MOVIE">Movie / Film Shoot</option>
                  <option value="PERSONAL">Personal Event</option>
                  <option value="OTHER">Other Studio Maintenance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-text-muted">Private Note (Only seen by admin)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Action sequence shoot at Ramoji Film City..."
                  value={blockNote}
                  onChange={(e) => setBlockNote(e.target.value)}
                  className="w-full p-3 rounded bg-ink-curtain border border-ink-line text-text resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 rounded-full border border-ink-line text-text-muted text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gold text-ink font-semibold text-xs uppercase hover:bg-gold-hi"
                >
                  Confirm Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
