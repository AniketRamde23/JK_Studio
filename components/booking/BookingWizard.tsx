'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  CheckCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Send,
  MessageCircle,
  AlertCircle,
  Loader2,
  Heart,
  PartyPopper,
  Camera,
  Film,
  Building,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_EVENTS = [
  { label: 'Wedding', icon: Heart },
  { label: 'Birthday', icon: PartyPopper },
  { label: 'Engagement', icon: Heart },
  { label: 'Reception', icon: Sparkles },
  { label: 'Pre-Wedding', icon: Camera },
  { label: 'Fashion / Editorial', icon: Camera },
  { label: 'Cinema BTS / Headshots', icon: Film },
  { label: 'Other', icon: HelpCircle },
];

const TIME_PRESETS = [
  '09:00 AM',
  '11:00 AM',
  '02:00 PM',
  '05:00 PM (Golden Hour)',
  '06:00 PM',
  '07:30 PM',
  'Full Day Shoot',
];

interface Props {
  initialEvent?: string;
}

export function BookingWizard({ initialEvent }: Props) {
  // Form fields
  const [eventName, setEventName] = useState(initialEvent || 'Wedding');
  const [customEvent, setCustomEvent] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Date selection
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date());
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Time & Customer
  const [selectedTime, setSelectedTime] = useState<string>('06:00 PM');
  const [customTime, setCustomTime] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedData, setSubmittedData] = useState<{
    eventName: string;
    date: string;
    time: string;
    customerName: string;
    phone: string;
  } | null>(null);

  // Fetch availability when calendar month changes
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      try {
        const year = currentCalendarMonth.getFullYear();
        const month = String(currentCalendarMonth.getMonth() + 1).padStart(2, '0');
        const res = await fetch(`/api/availability?month=${year}-${month}`);
        if (res.ok) {
          const data = await res.json();
          setAvailabilityMap(data.availability || {});
        }
      } catch (err) {
        console.error('Failed fetching calendar availability:', err);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [currentCalendarMonth]);

  // Handle Event selection
  const handleEventSelect = (label: string) => {
    if (label === 'Other') {
      setIsOtherSelected(true);
      setEventName(customEvent || 'Special Event');
    } else {
      setIsOtherSelected(false);
      setEventName(label);
    }
  };

  // Calendar Helpers
  const year = currentCalendarMonth.getFullYear();
  const month = currentCalendarMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentCalendarMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarMonth(new Date(year, month + 1, 1));
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Check selected date status
  const dateStatus = selectedDate ? (availabilityMap[selectedDate] || 'AVAILABLE') : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const finalEventName = isOtherSelected ? (customEvent.trim() || 'Custom Function') : eventName;

    if (!finalEventName) {
      setErrorMessage('Please specify your function or event name.');
      return;
    }
    if (!selectedDate) {
      setErrorMessage('Please pick an event date on the calendar.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    const finalTime = customTime.trim() || selectedTime;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: finalEventName,
          date: selectedDate,
          time: finalTime,
          customerName: customerName.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit slot request.');
      }

      // Success! Fire celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c6a85e', '#ffffff', '#e5c07b', '#4ade80'],
        });
      } catch (e) {
        // Confetti fallback
      }

      setSubmittedData({
        eventName: finalEventName,
        date: selectedDate,
        time: finalTime,
        customerName: customerName.trim(),
        phone: phone.trim(),
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Success View (Direct from User Specification) ---
  if (submittedData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl bg-surface/90 border border-gold/30 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6 overflow-hidden"
        >
          {/* Subtle gold glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/15 border border-gold/40 text-gold shadow-lg shadow-gold/10">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl text-text font-normal">
              Slot Request Sent! 🎉
            </h2>
            <p className="text-base text-text-muted">
              Thank you, <span className="text-text font-medium">{submittedData.customerName}</span>.
            </p>
          </div>

          {/* Requested Details Box */}
          <div className="p-5 rounded-xl bg-background/80 border border-border/80 text-left space-y-2.5">
            <p className="text-xs uppercase tracking-wider text-text-muted font-mono">
              I've received your request for:
            </p>
            <div className="text-lg font-serif text-text font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold shrink-0" />
              <span>{submittedData.eventName}</span>
            </div>
            <div className="text-sm font-mono text-gold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gold shrink-0" />
              <span>{formatDisplayDate(submittedData.date)} · {submittedData.time}</span>
            </div>
          </div>

          <p className="text-sm text-text-muted leading-relaxed">
            I'll contact you shortly on <span className="font-mono text-text font-medium">{submittedData.phone}</span> to discuss the details and pricing.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-surface-elevated border border-border hover:border-gold/50 text-text text-sm font-medium transition-colors"
            >
              Back to Website
            </Link>
            <a
              href={`https://wa.me/919177856208?text=${encodeURIComponent(`Hi Kashinath, I just submitted a slot request for ${submittedData.eventName} on ${formatDisplayDate(submittedData.date)} (${submittedData.time}). Looking forward to speaking with you!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp (+91 91778 56208)</span>
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Main Booking Form (< 1 Minute Flow) ---
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl bg-surface/80 border border-border/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8 space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-gold font-semibold">
            Simple 1-Minute Booking
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-text font-normal">
            Book a Slot
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto">
            Tell me when and what you're celebrating. I'll call you to discuss your requirements and pricing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 text-xs sm:text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* 1. What is the Event? */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted">
              1. What is the event?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_EVENTS.map(item => {
                const isSelected = (!isOtherSelected && eventName === item.label) || (isOtherSelected && item.label === 'Other');
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleEventSelect(item.label)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-gold bg-gold/15 text-text font-medium shadow-sm shadow-gold/10'
                        : 'border-border/80 bg-background/50 hover:bg-surface-elevated text-text-muted hover:text-text'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-gold' : 'text-text-muted'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom input if Other or custom preference */}
            {isOtherSelected && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-1"
              >
                <input
                  type="text"
                  placeholder="Specify Event / Function Name (e.g. Half Saree, Brand Shoot, Housewarming)"
                  value={customEvent}
                  onChange={(e) => {
                    setCustomEvent(e.target.value);
                    setEventName(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-gold/40 text-text placeholder:text-text-muted/60 text-xs sm:text-sm focus:outline-none focus:border-gold"
                  autoFocus
                />
              </motion.div>
            )}
          </div>

          {/* 2. Date Selection with Live Availability */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-gold" />
                <span>2. Date</span>
              </label>

              {/* Status Indicator pill */}
              {selectedDate && (
                <div className="text-[11px] font-mono flex items-center gap-1.5">
                  {dateStatus === 'AVAILABLE' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available
                    </span>
                  )}
                  {dateStatus === 'LIMITED' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-700/60 text-amber-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      I'll confirm availability
                    </span>
                  )}
                  {dateStatus === 'UNAVAILABLE' && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-950/70 border border-rose-700/60 text-rose-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Unavailable (Filming Shoot)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Interactive Calendar Card */}
            <div className="p-4 rounded-xl bg-background/80 border border-border/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded hover:bg-surface text-text-muted hover:text-text transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-serif text-sm font-medium text-text">
                  {currentCalendarMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded hover:bg-surface text-text-muted hover:text-text transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-text-muted">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isPast = dateStr < todayStr;
                  const isSelected = selectedDate === dateStr;
                  const status = availabilityMap[dateStr] || 'AVAILABLE';
                  const isBlocked = status === 'UNAVAILABLE';

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={isPast || isBlocked}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-8 rounded-lg text-xs font-mono transition-all flex flex-col items-center justify-center relative ${
                        isSelected
                          ? 'bg-gold text-background font-bold shadow-md shadow-gold/20'
                          : isPast
                          ? 'text-text-muted/30 cursor-not-allowed'
                          : isBlocked
                          ? 'text-rose-400/50 bg-rose-950/20 line-through cursor-not-allowed'
                          : 'hover:bg-surface-elevated text-text'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {!isPast && !isSelected && (
                        <span
                          className={`w-1 h-1 rounded-full ${
                            isBlocked ? 'bg-rose-500' : status === 'LIMITED' ? 'bg-amber-400' : 'bg-emerald-500/80'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected date readout */}
              {selectedDate ? (
                <div className="pt-2 border-t border-border/60 text-xs flex items-center justify-between text-text">
                  <span className="text-text-muted">Selected Date:</span>
                  <span className="font-mono text-gold font-medium">
                    {formatDisplayDate(selectedDate)}
                  </span>
                </div>
              ) : (
                <p className="text-center text-[11px] text-text-muted/70 pt-1">
                  Click a date on the calendar to reserve
                </p>
              )}
            </div>
          </div>

          {/* 3. Preferred Time */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>3. Preferred Time</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_PRESETS.map(t => {
                const isSelected = selectedTime === t && !customTime;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedTime(t);
                      setCustomTime('');
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                      isSelected
                        ? 'border-gold bg-gold/15 text-gold font-semibold'
                        : 'border-border/80 bg-background/50 hover:bg-surface-elevated text-text-muted hover:text-text'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-text-muted">
                4. Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-gold text-text placeholder:text-text-muted/50 text-xs sm:text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-text-muted">
                5. Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-gold font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="91778 56208"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-gold text-text placeholder:text-text-muted/50 text-xs sm:text-sm focus:outline-none font-mono transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Optional notes */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-text-muted">
              Notes / Venue details (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Location is Jubilee Hills, Hyderabad. Evening 50 guests."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-background border border-border focus:border-gold text-text placeholder:text-text-muted/40 text-xs sm:text-sm focus:outline-none resize-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gold hover:bg-gold-light text-background font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/30 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Slot Request...</span>
              </>
            ) : (
              <>
                <span>REQUEST SLOT</span>
                <span className="text-lg">→</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-text-muted">
            No upfront payment needed. We will call you directly to discuss requirements and confirm.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
