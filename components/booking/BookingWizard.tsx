'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  User,
  Phone,
  Mail,
  AlertCircle,
  Navigation,
  Loader2,
  Building,
  Home,
  Hash,
  PhoneCall,
  Heart,
  Camera,
  Film,
  PartyPopper,
  Edit3,
  CheckCircle,
} from 'lucide-react';
import { Service, Package, Addon, TravelZone } from '@/lib/db/types';

interface Props {
  services: Service[];
  packages: Package[];
  addons: Addon[];
  travelZones: TravelZone[];
}

const PRESET_FUNCTIONS = [
  { id: 'wedding', name: 'Wedding / Marriage', icon: Heart },
  { id: 'reception', name: 'Reception Gala', icon: Sparkles },
  { id: 'engagement', name: 'Engagement / Ring Ceremony', icon: Heart },
  { id: 'pre-wedding', name: 'Pre-Wedding / Couple Shoot', icon: Camera },
  { id: 'birthday', name: 'Birthday / Anniversary', icon: PartyPopper },
  { id: 'half-saree', name: 'Half Saree / Dhoti Ceremony', icon: Sparkles },
  { id: 'baby-shower', name: 'Baby Shower / Seemantham', icon: Heart },
  { id: 'housewarming', name: 'Housewarming (Gruhapravesam)', icon: Home },
  { id: 'corporate', name: 'Corporate / Brand Event', icon: Building },
  { id: 'fashion', name: 'Fashion & Model Portfolio', icon: Camera },
  { id: 'cinema', name: 'Cinema BTS & Actor Headshots', icon: Film },
  { id: 'others', name: 'Others (Specify Event)', icon: Edit3 },
];

export function BookingWizard({ services, packages, addons, travelZones }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wizard Step: 1: Event & Date, 2: Location, 3: Customer Details & Confirm
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1: Function / Event Selection & Dates
  const [selectedFunction, setSelectedFunction] = useState<string>('Wedding / Marriage');
  const [isOthers, setIsOthers] = useState(false);
  const [customFunction, setCustomFunction] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('Full Day');

  // Step 2: Location Details
  const [selectedTravelZoneId, setSelectedTravelZoneId] = useState<string>(travelZones[0]?.id || '');
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState(travelZones[0]?.cities[0] || 'Hyderabad');
  const [stateName, setStateName] = useState('Telangana');
  const [district, setDistrict] = useState('Hyderabad');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationDetectedMsg, setLocationDetectedMsg] = useState('');

  // Step 3: Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [callPreference, setCallPreference] = useState('Anytime');
  const [notes, setNotes] = useState('');
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPortfolio, setConsentPortfolio] = useState(true);

  // Submission & Flow state
  const [submitting, setSubmitting] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{ publicId: string; token: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Availability map for current viewing month
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Geolocation auto-detection handler
  const handleUseCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser. Please enter your location manually.');
      return;
    }
    setDetectingLocation(true);
    setLocationDetectedMsg('');
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          if (!res.ok) throw new Error('Reverse geocode failed');
          const data = await res.json();
          const addr = data.address || {};

          const detectedState = addr.state || '';
          const detectedDistrict = addr.state_district || addr.county || addr.city || addr.town || '';
          const detectedCity = addr.city || addr.town || addr.village || addr.suburb || detectedDistrict || 'Hyderabad';
          const detectedArea = addr.suburb || addr.neighbourhood || addr.residential || addr.road || '';
          const detectedPincode = addr.postcode || '';

          if (detectedState) setStateName(detectedState);
          if (detectedDistrict) setDistrict(detectedDistrict);
          if (detectedCity) setCity(detectedCity);
          if (detectedArea) setArea(detectedArea);
          if (detectedPincode) setPincode(detectedPincode);

          const summary = [detectedArea, detectedCity, detectedState, detectedPincode].filter(Boolean).join(', ');
          setLocationDetectedMsg(`Auto-detected: ${summary}`);
        } catch (err) {
          setLocationDetectedMsg('Location coordinates captured. Please refine area & landmark below.');
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setDetectingLocation(false);
        setErrorMsg('Location permission was denied or unavailable. Please fill in your address details manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Fetch live availability from API
  useEffect(() => {
    async function fetchAvailability() {
      setLoadingAvailability(true);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const res = await fetch(`/api/availability?month=${year}-${month}`);
        if (res.ok) {
          const data = await res.json();
          setAvailabilityMap(data.availability || {});
        }
      } catch (err) {
        // Fallback default
      } finally {
        setLoadingAvailability(false);
      }
    }
    fetchAvailability();
  }, []);

  const handleSelectFunction = (item: typeof PRESET_FUNCTIONS[0]) => {
    if (item.id === 'others') {
      setIsOthers(true);
      setSelectedFunction('Others');
    } else {
      setIsOthers(false);
      setSelectedFunction(item.name);
      setCustomFunction('');
    }
  };

  const effectiveFunctionName = isOthers
    ? (customFunction.trim() || 'Others (Custom Event)')
    : selectedFunction;

  const goToStep = (targetStep: number) => {
    setErrorMsg('');

    // Step 1 Validation: Function & Dates
    if (targetStep > 1 && step === 1) {
      if (isOthers && !customFunction.trim()) {
        setErrorMsg('Please specify the name of your function/event in the text field.');
        return;
      }
      if (selectedDates.length === 0) {
        setErrorMsg('Please select at least one shoot/event date on the calendar.');
        return;
      }
    }

    // Step 2 Validation: Location
    if (targetStep > 2 && step === 2) {
      if (!stateName.trim() || !district.trim()) {
        setErrorMsg('Please enter your State and District / City.');
        return;
      }
    }

    setDirection(targetStep > step ? 1 : -1);
    setStep(targetStep);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const toggleDateSelection = (dateStr: string) => {
    const status = availabilityMap[dateStr];
    if (status === 'UNAVAILABLE') return;

    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr].sort());
    }
  };

  const handleSubmitBooking = async () => {
    setErrorMsg('');
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMsg('Please enter your full name, 10-digit mobile number, and email address.');
      return;
    }
    if (selectedDates.length === 0) {
      setErrorMsg('Please select at least one shoot date.');
      return;
    }
    if (!consentTerms) {
      setErrorMsg('Please confirm your agreement with the terms and consultation policy.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          alternatePhone,
          customerEmail,
          callPreference,
          functionType: effectiveFunctionName,
          serviceId: services[0]?.id || 'weddings',
          packageId: packages[0]?.id || 'custom-consultation',
          dates: selectedDates,
          slot: selectedSlot,
          locationName: locationName || 'Client Venue',
          city: district || city || 'Hyderabad',
          state: stateName,
          district,
          area,
          pincode,
          travelZoneId: selectedTravelZoneId,
          notes,
          consentTerms,
          consentPortfolio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit reservation hold');
      }

      setShutterFlash(true);
      setTimeout(() => setShutterFlash(false), 500);

      setBookingSuccess({
        publicId: data.publicId,
        token: data.token,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating reservation');
    } finally {
      setSubmitting(false);
    }
  };

  // Calendar dates generation (Current + next 35 days)
  const renderCalendar = () => {
    const today = new Date();
    const daysInView = 35;
    const days: Date[] = [];
    for (let i = 0; i < daysInView; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d);
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-mono uppercase text-text-muted">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((dateObj) => {
            const dateStr = dateObj.toISOString().split('T')[0];
            const isSelected = selectedDates.includes(dateStr);
            const status = availabilityMap[dateStr] || 'AVAILABLE';
            const isUnavailable = status === 'UNAVAILABLE';
            const isLimited = status === 'LIMITED';
            const dayNum = dateObj.getDate();
            const monthShort = dateObj.toLocaleString('en-US', { month: 'short' });

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isUnavailable}
                onClick={() => toggleDateSelection(dateStr)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-between min-h-[64px] transition-all relative ${
                  isSelected
                    ? 'border-gold bg-gold/20 text-text ring-1 ring-gold shadow-md'
                    : isUnavailable
                    ? 'border-ink-line/30 bg-ink-curtain/40 opacity-35 cursor-not-allowed text-text-muted'
                    : 'border-ink-line bg-ink-curtain hover:border-gold/40 text-text'
                }`}
              >
                <span className="text-[10px] font-mono text-text-muted">{monthShort}</span>
                <span className="text-sm font-semibold">{dayNum}</span>

                <div className="flex items-center gap-1 mt-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isUnavailable
                        ? 'bg-status-unavailable'
                        : isLimited
                        ? 'bg-status-limited'
                        : 'bg-status-available'
                    }`}
                  />
                  <span className="text-[9px] font-mono text-text-muted">
                    {isUnavailable ? 'Booked' : isLimited ? '1 Left' : 'Open'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-2 border-t border-ink-line">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-available" /> Open
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-limited" /> Limited Slot
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-unavailable" /> Unavailable
            </span>
          </div>
          <span className="text-gold-hi">Click to toggle multi-day events</span>
        </div>
      </div>
    );
  };

  // SUCCESS CONFIRMATION SCREEN
  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-5 text-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center mx-auto text-gold shadow-xl shadow-gold/20">
          <CheckCircle size={40} />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold">
            Reservation Hold Active
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-text font-normal">
            Your Frame is Protected
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
            Thank you, <strong className="text-text">{customerName}</strong>. Your shoot date hold has been registered with reference ID below. JK will reach out to you via call/WhatsApp to discuss all your creative vision, requirements, and custom investment.
          </p>
        </div>

        {/* Ticket card */}
        <div className="rounded-xl border border-ink-line bg-ink-curtain p-6 max-w-md mx-auto text-left space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-ink-line pb-3">
            <span className="text-xs text-text-muted">Booking Reference</span>
            <span className="text-sm font-mono font-bold text-gold-hi">{bookingSuccess.publicId}</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-text-muted">Function / Event</div>
            <div className="font-medium text-text font-serif text-base">{effectiveFunctionName}</div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-text-muted">Reserved Date(s)</div>
            <div className="font-mono text-gold">{selectedDates.join(', ')} ({selectedSlot})</div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-text-muted">Shoot Location</div>
            <div className="text-text">
              {[locationName, area, district, stateName, pincode].filter(Boolean).join(', ') || city}
            </div>
          </div>

          <div className="pt-2 border-t border-ink-line flex items-center justify-between text-xs">
            <span className="text-text-muted">Pricing Consultation</span>
            <span className="text-xs font-mono text-gold-hi font-medium">Discussed on phone call</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => router.push(`/booking/${bookingSuccess.token}`)}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gold text-ink font-semibold text-xs tracking-wider uppercase hover:bg-gold-hi transition-colors"
          >
            Track Reservation Status
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-ink-line bg-ink-stage text-text hover:text-gold text-xs font-medium tracking-wider uppercase transition-colors"
          >
            Return to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto py-10 px-5 sm:px-8">
      {/* Shutter Flash Animation overlay */}
      {shutterFlash && (
        <div className="fixed inset-0 z-[100] bg-white animate-shutter-flash pointer-events-none" />
      )}

      {/* Stepper: 3 Steps (Event & Date -> Location -> Customer Details) */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs font-mono mb-3">
          <span className="text-gold font-medium">Step {step} of 3</span>
          <span className="text-text-muted">
            {step === 1 && '1. Event & Date'}
            {step === 2 && '2. Location & Venue'}
            {step === 3 && '3. Customer Details & Hold'}
          </span>
        </div>
        <div className="relative h-1 w-full bg-ink-line rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-gold"
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-3xl mx-auto mb-6 p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps (8 cols) */}
        <div className="lg:col-span-8 bg-ink-stage border border-ink-line rounded-2xl p-6 sm:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1: EVENT / FUNCTION & DATE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 24 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
                    Occasion & Timeline
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-text font-normal">
                    Select Your Function & Date
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    Choose the event type from the options below, or select Others to mention your specific occasion.
                  </p>
                </div>

                {/* Function / Event Type Options */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-text-muted block">
                    What function or event is it? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PRESET_FUNCTIONS.map((item) => {
                      const Icon = item.icon;
                      const isSelected = item.id === 'others'
                        ? isOthers
                        : selectedFunction === item.name && !isOthers;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectFunction(item)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 text-xs ${
                            isSelected
                              ? 'border-gold bg-gold/15 text-gold-hi shadow-md shadow-gold/10 font-medium'
                              : 'border-ink-line bg-ink-curtain text-text hover:border-gold/40'
                          }`}
                        >
                          <Icon size={16} className={isSelected ? 'text-gold' : 'text-text-muted'} />
                          <span className="truncate">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* "Others" Custom Function Text Input */}
                  {isOthers && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl border border-gold/60 bg-gold/10 space-y-2 mt-3"
                    >
                      <label className="text-xs font-mono uppercase text-gold-hi flex items-center gap-1.5">
                        <Edit3 size={13} className="text-gold" />
                        <span>Specify Your Function / Occasion Name *</span>
                      </label>
                      <input
                        type="text"
                        autoFocus
                        placeholder="e.g. Sangeet & Mehendi, Pooja Ceremony, Graduation Gala, Retirement Celebration..."
                        value={customFunction}
                        onChange={(e) => setCustomFunction(e.target.value)}
                        className="w-full h-11 px-4 rounded-lg bg-ink-curtain border border-gold/40 text-sm text-text focus:border-gold outline-none"
                      />
                      <p className="text-[11px] text-text-muted">
                        Type the exact function or ceremony so JK can prepare tailored cinematography requirements.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Shoot Date(s) & Slot Selection */}
                <div className="space-y-4 pt-4 border-t border-ink-line">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-text-muted block">
                        Select Shoot / Event Date(s) *
                      </label>
                      <p className="text-xs text-text-muted">
                        Pick one or multiple dates for multi-day celebrations.
                      </p>
                    </div>

                    {/* Slot Picker */}
                    <div className="flex items-center gap-1.5 bg-ink-curtain border border-ink-line p-1 rounded-lg">
                      {['Full Day', 'Morning', 'Evening'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            selectedSlot === slot
                              ? 'bg-gold text-ink font-semibold shadow-sm'
                              : 'text-text-muted hover:text-text'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {loadingAvailability ? (
                    <div className="py-12 text-center text-xs font-mono text-gold flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Checking calendar availability...</span>
                    </div>
                  ) : (
                    renderCalendar()
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink-line text-text-muted hover:text-text text-xs uppercase font-medium"
                  >
                    <ChevronLeft size={15} />
                    <span>Cancel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-ink font-medium text-xs tracking-wider uppercase hover:bg-gold-hi transition-colors shadow-md shadow-gold/20"
                  >
                    <span>Proceed to Location</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SHOOT LOCATION */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 24 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
                      Event Venue & Address
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-text font-normal">
                      Shoot Location
                    </h2>
                    <p className="text-xs text-text-muted mt-1">
                      Enter state, district, area, and venue, or auto-detect using your current GPS location.
                    </p>
                  </div>

                  {/* Geolocation Button */}
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={detectingLocation}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gold/50 bg-gold/15 hover:bg-gold/25 text-gold-hi text-xs font-mono transition-all self-start sm:self-auto shadow-sm active:scale-95"
                  >
                    {detectingLocation ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-gold" />
                        <span>Detecting GPS...</span>
                      </>
                    ) : (
                      <>
                        <Navigation size={14} className="fill-gold/40 text-gold" />
                        <span>Use Current Location</span>
                      </>
                    )}
                  </button>
                </div>

                {locationDetectedMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <Check size={15} className="text-emerald-400 flex-shrink-0" />
                    <span>{locationDetectedMsg}</span>
                  </div>
                )}

                {/* Structured Location Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {/* State */}
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                    <label className="text-xs font-mono uppercase text-text-muted flex items-center gap-1.5">
                      <MapPin size={12} className="text-gold" />
                      <span>State *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Telangana"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                    />
                  </div>

                  {/* District / City */}
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                    <label className="text-xs font-mono uppercase text-text-muted flex items-center gap-1.5">
                      <Building size={12} className="text-gold" />
                      <span>District / City *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setCity(e.target.value);
                      }}
                      className="w-full h-11 px-3.5 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                    />
                  </div>

                  {/* Area / Locality */}
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                    <label className="text-xs font-mono uppercase text-text-muted flex items-center gap-1.5">
                      <Home size={12} className="text-gold" />
                      <span>Area / Locality</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jubilee Hills, Gachibowli"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                    />
                  </div>

                  {/* Pincode */}
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                    <label className="text-xs font-mono uppercase text-text-muted flex items-center gap-1.5">
                      <Hash size={12} className="text-gold" />
                      <span>Pincode</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit PIN"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-11 px-3.5 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text font-mono focus:border-gold outline-none"
                    />
                  </div>

                  {/* Venue / Landmark Full Width */}
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
                    <label className="text-xs font-mono uppercase text-text-muted">
                      Venue / Function Hall / Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Taj Falaknuma Palace, Novotel, Ramoji Film City, or Private Residence"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink-line text-text-muted hover:text-text text-xs uppercase font-medium"
                  >
                    <ChevronLeft size={15} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-ink font-medium text-xs tracking-wider uppercase hover:bg-gold-hi transition-colors shadow-md shadow-gold/20"
                  >
                    <span>Customer Details</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CUSTOMER DETAILS & CONFIRM */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 24 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
                    Contact & Hold Confirmation
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-text font-normal">
                    Customer Details
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    Your shoot reservation hold is placed immediately with 100% free hold protection.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-text-muted flex items-center gap-1.5">
                      <User size={13} className="text-gold" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sanjana Reddy"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-text-muted flex items-center gap-1.5">
                        <Phone size={13} className="text-gold" />
                        <span>Primary Phone / WhatsApp *</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        placeholder="10-digit mobile number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-text-muted flex items-center gap-1.5">
                        <PhoneCall size={13} className="text-gold" />
                        <span>Alternate Phone / WhatsApp (Optional)</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        placeholder="Secondary contact number"
                        value={alternatePhone}
                        onChange={(e) => setAlternatePhone(e.target.value)}
                        className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-text-muted flex items-center gap-1.5">
                      <Mail size={13} className="text-gold" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none"
                    />
                  </div>

                  {/* Preferred Call Timing */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-mono uppercase text-text-muted flex items-center gap-1.5">
                      <Clock size={13} className="text-gold" />
                      <span>Preferred Consultation Call Timing</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Anytime', val: 'Anytime' },
                        { label: 'Morning (9AM-12PM)', val: 'Morning (9 AM - 12 PM)' },
                        { label: 'Afternoon (12PM-5PM)', val: 'Afternoon (12 PM - 5 PM)' },
                        { label: 'Evening (5PM-9PM)', val: 'Evening (5 PM - 9 PM)' },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setCallPreference(item.val)}
                          className={`px-3 py-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                            callPreference === item.val
                              ? 'border-gold bg-gold/15 text-gold-hi font-semibold shadow-sm'
                              : 'border-ink-line bg-ink-curtain text-text-muted hover:border-gold/40 hover:text-text'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-text-muted">
                      Vision / Event Details / Specific Shot Ideas
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your timing, theme, traditional ceremonies, or specific shots desired..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-4 rounded-lg bg-ink-curtain border border-ink-line text-sm text-text focus:border-gold outline-none resize-none"
                    />
                  </div>

                  {/* Consent checkboxes */}
                  <div className="space-y-3 pt-2 text-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentTerms}
                        onChange={(e) => setConsentTerms(e.target.checked)}
                        className="mt-0.5 accent-gold w-4 h-4 rounded"
                      />
                      <span className="text-text-muted">
                        I agree to the <span className="text-gold underline">Booking & Consultation Policies</span> (Pricing and terms discussed directly on consultation call).
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentPortfolio}
                        onChange={(e) => setConsentPortfolio(e.target.checked)}
                        className="mt-0.5 accent-gold w-4 h-4 rounded"
                      />
                      <span className="text-text-muted">
                        Model/Client Release: I consent to selected high-resolution frames being showcased in JK's portfolio.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink-line text-text-muted hover:text-text text-xs uppercase font-medium"
                  >
                    <ChevronLeft size={15} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitBooking}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold text-ink font-semibold text-xs tracking-wider uppercase hover:bg-gold-hi disabled:opacity-50 transition-all shadow-lg shadow-gold/20"
                  >
                    {submitting ? (
                      <span>Reserving your slot...</span>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Reserve Frame Now</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Sticky Reservation Summary (4 cols) */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="rounded-2xl border border-ink-line bg-ink-stage p-6 space-y-5 shadow-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-gold block">
              Reservation Summary
            </span>

            <div className="space-y-3 pb-4 border-b border-ink-line text-xs">
              <div>
                <span className="text-text-muted">Function / Event</span>
                <p className="font-serif text-base text-text font-medium mt-0.5">
                  {effectiveFunctionName}
                </p>
              </div>

              <div>
                <span className="text-text-muted">Shoot Date(s)</span>
                <p className="font-mono text-text mt-0.5">
                  {selectedDates.length > 0 ? selectedDates.join(', ') : 'Not yet selected'}
                </p>
                <p className="text-[11px] text-text-muted">{selectedSlot}</p>
              </div>

              <div>
                <span className="text-text-muted">Shoot Location</span>
                <p className="text-text font-medium mt-0.5">
                  {[locationName, area, district, stateName, pincode].filter(Boolean).join(', ') || city || 'Hyderabad'}
                </p>
              </div>

              {customerName && (
                <div className="pt-2 border-t border-ink-line/50">
                  <span className="text-text-muted">Client Contact</span>
                  <p className="text-text font-medium mt-0.5">{customerName}</p>
                  <p className="font-mono text-[11px] text-gold-hi">{customerPhone || 'Phone pending'}</p>
                  {callPreference && (
                    <p className="text-[11px] text-text-muted">Call: {callPreference}</p>
                  )}
                </div>
              )}
            </div>

            {/* Pricing on Call Consultation Notice */}
            <div className="p-4 rounded-xl bg-gold/10 border border-gold/40 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-gold font-medium">
                <Phone size={14} className="text-gold" />
                <span>Pricing Finalized on Phone Call</span>
              </div>
              <p className="text-text-muted leading-relaxed text-[11px]">
                Pricing will be discussed directly on a phone call according to all your specific customer requirements, shoot duration, and creative deliverables.
              </p>
              <div className="pt-2 border-t border-gold/20 flex justify-between items-center text-xs">
                <span className="text-text font-medium">Initial Hold:</span>
                <span className="font-mono text-gold-hi font-bold">100% Free Date Reservation</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-text-muted leading-relaxed">
              No immediate online payment is required. JK will contact you directly to discuss all requirements, quote estimation, and production specifics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
