// Core entities as defined in PRD v2.0 Section 11

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ADVANCE_PAID'
  | 'SCHEDULED'
  | 'SHOOT_COMPLETED'
  | 'PROCESSING'
  | 'DELIVERED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'UNPAID'
  | 'PENDING'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Full Day' | 'Custom';

export type BlockedDateType = 'MOVIE' | 'PERSONAL' | 'OTHER';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  alternatePhone?: string;
  callPreference?: string;
  notes?: string;
  createdAt: string;
}

export interface ActingProfile {
  id: string;
  name: string;
  stageName: string;
  bio: string;
  shortBio: string;
  location: string;
  languages: string[];
  height: string;
  skills: string[];
  showreelUrl: string;
  resumeUrl: string;
  headshotPackUrl: string;
}

export interface ActingProject {
  id: string;
  title: string;
  type: 'Movie' | 'Short Film' | 'Web Series' | 'Ad / TVC' | 'Music Video' | 'Theatre';
  role: string;
  director: string;
  production: string;
  year: number;
  description: string;
  posterUrl: string;
  videoUrl?: string;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  startingPricePaise: number;
  active: boolean;
  sortOrder: number;
}

export interface Package {
  id: string;
  serviceId: string;
  name: string;
  pricePaise: number;
  durationHours: number;
  photographers: number;
  editedPhotos: number;
  deliverables: string[];
  popular: boolean;
  active: boolean;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  pricePaise: number;
  unit: string;
  appliesToServices: string[];
}

export interface TravelZone {
  id: string;
  name: string;
  cities: string[];
  chargePaise: number;
}

export interface GalleryImage {
  id: string;
  categorySlug: 'weddings' | 'portraits' | 'editorial' | 'cinema-stills';
  title: string;
  caption: string;
  url: string;
  thumbUrl: string;
  watermarkedUrl: string;
  featured: boolean;
  sortOrder: number;
  width: number;
  height: number;
}

export interface PriceSnapshot {
  packagePaise: number;
  extraHoursPaise: number;
  travelPaise: number;
  addonsPaise: number;
  gstPaise: number;
  totalPaise: number;
  advancePaise: number;
}

export interface BookingSession {
  id: string;
  date: string; // YYYY-MM-DD
  slot: TimeSlot;
  sessionName?: string; // Haldi, Mehendi, Wedding, etc.
  locationName: string;
  city: string;
  state?: string;
  district?: string;
  area?: string;
  pincode?: string;
  functionType?: string;
}

export interface BookingStatusHistory {
  id: string;
  bookingId: string;
  fromStatus: BookingStatus | 'CREATED';
  toStatus: BookingStatus;
  changedBy: string; // 'customer' | 'admin' | 'system'
  note?: string;
  at: string;
}

export interface Hold {
  id: string;
  date: string;
  slot: string;
  bookingId: string;
  expiresAt: string;
}

export interface BlockedDate {
  id: string;
  startDate: string;
  endDate: string;
  slot?: string;
  type: BlockedDateType;
  privateNote: string; // Shown only to admin! Public sees "Unavailable"
}

export interface Booking {
  id: string;
  publicId: string; // e.g. PH-2026-0001
  token: string;    // random secret token for url access
  customerId: string;
  customer?: Customer;
  serviceId: string;
  packageId: string;
  functionType?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  priceSnapshot: PriceSnapshot;
  sessions: BookingSession[];
  selectedAddonIds: string[];
  notes?: string;
  adminNotes?: string;
  consentTerms: boolean;
  consentPortfolio: boolean;
  createdAt: string;
}

export interface ActingEnquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  project: string;
  role: string;
  projectType: string;
  datesNeeded: string;
  message: string;
  status: 'NEW' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'NEW' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  serviceName: string;
  photoUrl: string;
  text: string;
  rating: number;
  featured: boolean;
  visible: boolean;
  verifiedBooking: boolean;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  actorInstagram: string;
  photoInstagram: string;
  whatsappNumber: string;
  contactEmail: string;
  phone: string;
  baseCity: string;
  advancePercentage: number;
  gstPercentage: number;
  autoWatermark: boolean;
}
