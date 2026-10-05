import {
  Booking,
  BookingStatus,
  BookingStatusHistory,
  Hold,
  BlockedDate,
  ActingProfile,
  ActingProject,
  Service,
  Package,
  Addon,
  TravelZone,
  GalleryImage,
  ActingEnquiry,
  ContactMessage,
  Testimonial,
  SiteSettings,
  PriceSnapshot,
  Customer,
  SlotRequest,
  SlotRequestStatus
} from './types';
import {
  initialSiteSettings,
  initialActingProfile,
  initialActingProjects,
  initialServices,
  initialPackages,
  initialAddons,
  initialTravelZones,
  initialGalleryImages,
  initialTestimonials,
  initialBlockedDates,
  initialBookings,
  initialActingEnquiries,
  initialContactMessages,
  initialSlotRequests
} from './seed-data';

// Singleton in-memory persistent store with clean operations
class DatabaseStore {
  private siteSettings: SiteSettings = { ...initialSiteSettings };
  private actingProfile: ActingProfile = { ...initialActingProfile };
  private actingProjects: ActingProject[] = [...initialActingProjects];
  private services: Service[] = [...initialServices];
  private packages: Package[] = [...initialPackages];
  private addons: Addon[] = [...initialAddons];
  private travelZones: TravelZone[] = [...initialTravelZones];
  private galleryImages: GalleryImage[] = [...initialGalleryImages];
  private testimonials: Testimonial[] = [...initialTestimonials];
  private blockedDates: BlockedDate[] = [...initialBlockedDates];
  private bookings: Booking[] = [...initialBookings];
  private slotRequests: SlotRequest[] = [...initialSlotRequests];
  private holds: Hold[] = [];
  private statusHistory: BookingStatusHistory[] = [];
  private actingEnquiries: ActingEnquiry[] = [...initialActingEnquiries];
  private contactMessages: ContactMessage[] = [...initialContactMessages];

  constructor() {
    this.cleanExpiredHolds();
  }

  // --- Site Settings ---
  getSettings(): SiteSettings {
    return { ...this.siteSettings };
  }

  updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.siteSettings = { ...this.siteSettings, ...updates };
    return this.siteSettings;
  }

  // --- Acting Profile & Projects ---
  getActingProfile(): ActingProfile {
    return { ...this.actingProfile };
  }

  updateActingProfile(updates: Partial<ActingProfile>): ActingProfile {
    this.actingProfile = { ...this.actingProfile, ...updates };
    return this.actingProfile;
  }

  getActingProjects(): ActingProject[] {
    return [...this.actingProjects].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  addActingProject(project: Omit<ActingProject, 'id'>): ActingProject {
    const newProj: ActingProject = {
      ...project,
      id: `act_${Date.now()}`,
    };
    this.actingProjects.push(newProj);
    return newProj;
  }

  updateActingProject(id: string, updates: Partial<ActingProject>): ActingProject | null {
    const idx = this.actingProjects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.actingProjects[idx] = { ...this.actingProjects[idx], ...updates };
    return this.actingProjects[idx];
  }

  deleteActingProject(id: string): boolean {
    const lenBefore = this.actingProjects.length;
    this.actingProjects = this.actingProjects.filter(p => p.id !== id);
    return this.actingProjects.length < lenBefore;
  }

  // --- Services & Packages ---
  getServices(): Service[] {
    return [...this.services].filter(s => s.active).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getAllServicesAdmin(): Service[] {
    return [...this.services].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.services.find(s => s.slug === slug);
  }

  getPackages(serviceId?: string): Package[] {
    if (serviceId) {
      return this.packages.filter(p => p.serviceId === serviceId && p.active);
    }
    return this.packages.filter(p => p.active);
  }

  getAllPackagesAdmin(): Package[] {
    return [...this.packages];
  }

  getPackageById(id: string): Package | undefined {
    return this.packages.find(p => p.id === id);
  }

  getAddons(): Addon[] {
    return [...this.addons];
  }

  getTravelZones(): TravelZone[] {
    return [...this.travelZones];
  }

  // --- Gallery ---
  getGalleryImages(category?: string): GalleryImage[] {
    if (category && category !== 'all') {
      return this.galleryImages
        .filter(img => img.categorySlug === category)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return [...this.galleryImages].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  addGalleryImage(img: Omit<GalleryImage, 'id'>): GalleryImage {
    const newImg: GalleryImage = {
      ...img,
      id: `gal_${Date.now()}`,
    };
    this.galleryImages.push(newImg);
    return newImg;
  }

  deleteGalleryImage(id: string): boolean {
    const prev = this.galleryImages.length;
    this.galleryImages = this.galleryImages.filter(i => i.id !== id);
    return this.galleryImages.length < prev;
  }

  // --- Testimonials ---
  getTestimonials(): Testimonial[] {
    return this.testimonials.filter(t => t.visible);
  }

  getAllTestimonialsAdmin(): Testimonial[] {
    return [...this.testimonials];
  }

  // --- Blocked Dates (Movie shoots, personal) ---
  getBlockedDates(): BlockedDate[] {
    return [...this.blockedDates];
  }

  addBlockedDate(data: Omit<BlockedDate, 'id'>): BlockedDate {
    const newBlock: BlockedDate = {
      ...data,
      id: `block_${Date.now()}`,
    };
    this.blockedDates.push(newBlock);
    return newBlock;
  }

  deleteBlockedDate(id: string): boolean {
    const prev = this.blockedDates.length;
    this.blockedDates = this.blockedDates.filter(b => b.id !== id);
    return this.blockedDates.length < prev;
  }

  // --- Availability Resolution (PRD Sec 8.3) ---
  // Public returns only AVAILABLE | LIMITED | UNAVAILABLE (never private movie reason!)
  getAvailability(dateStr: string, slot?: string): 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' {
    this.cleanExpiredHolds();

    // Check if blocked by owner (e.g. Movie shoot or personal)
    const isBlocked = this.blockedDates.some(b => {
      const start = b.startDate;
      const end = b.endDate || b.startDate;
      const matchesDate = dateStr >= start && dateStr <= end;
      if (!matchesDate) return false;
      if (b.slot && slot) {
        return b.slot === slot || b.slot === 'Full Day';
      }
      return true;
    });

    if (isBlocked) {
      return 'UNAVAILABLE';
    }

    // Check confirmed or active production bookings
    const confirmedCount = this.bookings.filter(b => {
      if (b.status !== 'CONFIRMED' && b.status !== 'ADVANCE_PAID' && b.status !== 'SCHEDULED') {
        return false;
      }
      return b.sessions.some(s => {
        if (s.date !== dateStr) return false;
        if (slot && s.slot !== 'Full Day' && slot !== 'Full Day') {
          return s.slot === slot;
        }
        return true;
      });
    }).length;

    if (confirmedCount >= 2) {
      return 'UNAVAILABLE';
    } else if (confirmedCount === 1) {
      return 'LIMITED';
    }

    return 'AVAILABLE';
  }

  // Clean expired holds (PRD Sec 8.4)
  private cleanExpiredHolds() {
    const now = new Date().toISOString();
    this.holds = this.holds.filter(h => h.expiresAt > now);
  }

  // --- Price Quote Calculator (PRD Sec 7.7) ---
  // All math in integer paise, never floats!
  calculatePriceQuote(params: {
    packageId: string;
    extraHours?: number;
    travelZoneId?: string;
    selectedAddonIds?: string[];
  }): PriceSnapshot {
    const pkg = this.getPackageById(params.packageId) || this.packages[0];
    const packagePaise = pkg ? pkg.pricePaise : 0;
    const extraHours = Math.max(0, params.extraHours || 0);
    const extraHoursPaise = extraHours * 500000; // ₹5,000 per hour in paise

    let travelPaise = 0;
    if (params.travelZoneId) {
      const zone = this.travelZones.find(z => z.id === params.travelZoneId);
      if (zone) {
        travelPaise = zone.chargePaise;
      }
    }

    let addonsPaise = 0;
    if (params.selectedAddonIds && params.selectedAddonIds.length > 0) {
      for (const addonId of params.selectedAddonIds) {
        const addon = this.addons.find(a => a.id === addonId);
        if (addon) {
          addonsPaise += addon.pricePaise;
        }
      }
    }

    const subtotalPaise = packagePaise + extraHoursPaise + travelPaise + addonsPaise;
    const gstRate = this.siteSettings.gstPercentage / 100;
    const gstPaise = Math.round(subtotalPaise * gstRate);
    const totalPaise = subtotalPaise + gstPaise;

    const advanceRate = this.siteSettings.advancePercentage / 100;
    const advancePaise = Math.round(totalPaise * advanceRate);

    return {
      packagePaise,
      extraHoursPaise,
      travelPaise,
      addonsPaise,
      gstPaise,
      totalPaise,
      advancePaise,
    };
  }

  // --- Bookings Management ---
  getBookings(): Booking[] {
    return [...this.bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getBookingByToken(token: string): Booking | undefined {
    return this.bookings.find(b => b.token === token);
  }

  getBookingByPublicId(publicId: string): Booking | undefined {
    return this.bookings.find(b => b.publicId.toLowerCase() === publicId.toLowerCase());
  }

  createBooking(data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    alternatePhone?: string;
    callPreference?: string;
    functionType?: string;
    serviceId: string;
    packageId: string;
    dates: string[];
    slot: string;
    locationName: string;
    city: string;
    state?: string;
    district?: string;
    area?: string;
    pincode?: string;
    travelZoneId?: string;
    extraHours?: number;
    selectedAddonIds?: string[];
    notes?: string;
    consentTerms: boolean;
    consentPortfolio: boolean;
  }): { booking: Booking; hold: Hold } {
    this.cleanExpiredHolds();

    // Check availability for all dates requested (only block if owner has locked date for movie/personal)
    for (const d of data.dates) {
      const isBlocked = this.blockedDates.some(b => {
        const start = b.startDate;
        const end = b.endDate || b.startDate;
        return d >= start && d <= end;
      });
      if (isBlocked) {
        throw new Error(`Date ${d} is unavailable due to prior production filming schedule. Please select another date.`);
      }
    }

    // Price snapshot computed strictly on server
    const priceSnapshot = this.calculatePriceQuote({
      packageId: data.packageId,
      extraHours: data.extraHours,
      travelZoneId: data.travelZoneId,
      selectedAddonIds: data.selectedAddonIds,
    });

    const bookingCount = this.bookings.length + 1;
    const currentYear = new Date().getFullYear();
    const publicId = `PH-${currentYear}-${String(bookingCount).padStart(4, '0')}`;
    const token = `tok_jk_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    const bookingId = `b_${Date.now()}`;
    const customerId = `cust_${Date.now()}`;

    const customer: Customer = {
      id: customerId,
      name: data.customerName,
      phone: data.customerPhone,
      email: data.customerEmail,
      alternatePhone: data.alternatePhone,
      callPreference: data.callPreference,
      createdAt: new Date().toISOString(),
    };

    const sessions = data.dates.map((date, idx) => ({
      id: `sess_${Date.now()}_${idx}`,
      date,
      slot: (data.slot as any) || 'Full Day',
      sessionName: data.functionType || 'Shoot Session',
      functionType: data.functionType,
      locationName: data.locationName,
      city: data.city,
      state: data.state,
      district: data.district,
      area: data.area,
      pincode: data.pincode,
    }));

    const newBooking: Booking = {
      id: bookingId,
      publicId,
      token,
      customerId,
      customer,
      serviceId: data.serviceId,
      packageId: data.packageId,
      functionType: data.functionType,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      priceSnapshot,
      sessions,
      selectedAddonIds: data.selectedAddonIds || [],
      notes: data.notes,
      consentTerms: data.consentTerms,
      consentPortfolio: data.consentPortfolio,
      createdAt: new Date().toISOString(),
    };

    // Create atomic hold with 24h expiration (PRD Sec 8.4)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const hold: Hold = {
      id: `hold_${Date.now()}`,
      date: data.dates[0],
      slot: data.slot,
      bookingId,
      expiresAt,
    };

    this.holds.push(hold);
    this.bookings.unshift(newBooking);

    // Record status history
    this.statusHistory.push({
      id: `hist_${Date.now()}`,
      bookingId,
      fromStatus: 'CREATED',
      toStatus: 'PENDING',
      changedBy: 'customer',
      note: 'Initial booking request submitted',
      at: new Date().toISOString(),
    });

    return { booking: newBooking, hold };
  }

  updateBookingStatus(
    bookingId: string,
    toStatus: BookingStatus,
    changedBy: string = 'admin',
    note?: string
  ): Booking | null {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    const fromStatus = booking.status;
    booking.status = toStatus;

    if (toStatus === 'CONFIRMED' || toStatus === 'ADVANCE_PAID') {
      booking.paymentStatus = 'PARTIALLY_PAID';
    } else if (toStatus === 'DELIVERED') {
      booking.paymentStatus = 'PAID';
    } else if (toStatus === 'CANCELLED' || toStatus === 'REFUNDED') {
      // Release holds immediately
      this.holds = this.holds.filter(h => h.bookingId !== bookingId);
    }

    this.statusHistory.push({
      id: `hist_${Date.now()}`,
      bookingId,
      fromStatus,
      toStatus,
      changedBy,
      note,
      at: new Date().toISOString(),
    });

    return booking;
  }

  updateBookingAdminNotes(bookingId: string, adminNotes: string): Booking | null {
    const b = this.bookings.find(item => item.id === bookingId);
    if (!b) return null;
    b.adminNotes = adminNotes;
    return b;
  }

  getStatusHistory(bookingId: string): BookingStatusHistory[] {
    return this.statusHistory.filter(h => h.bookingId === bookingId);
  }

  // --- Acting Enquiries & Contact ---
  getActingEnquiries(): ActingEnquiry[] {
    return [...this.actingEnquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addActingEnquiry(data: Omit<ActingEnquiry, 'id' | 'createdAt' | 'status'>): ActingEnquiry {
    const newEnq: ActingEnquiry = {
      ...data,
      id: `enq_${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    this.actingEnquiries.unshift(newEnq);
    return newEnq;
  }

  updateActingEnquiryStatus(id: string, status: 'NEW' | 'REPLIED' | 'ARCHIVED'): boolean {
    const item = this.actingEnquiries.find(e => e.id === id);
    if (!item) return false;
    item.status = status;
    return true;
  }

  getContactMessages(): ContactMessage[] {
    return [...this.contactMessages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addContactMessage(data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...data,
      id: `msg_${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    this.contactMessages.unshift(newMsg);
    return newMsg;
  }

  // --- Simple Slot Requests (Book a Slot) ---
  getSlotRequests(): SlotRequest[] {
    return [...this.slotRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getSlotRequestById(id: string): SlotRequest | undefined {
    return this.slotRequests.find(r => r.id === id);
  }

  createSlotRequest(data: {
    eventName: string;
    date: string;
    time: string;
    customerName: string;
    phone: string;
    notes?: string;
  }): SlotRequest {
    const counter = this.slotRequests.length + 1;
    const currentYear = new Date().getFullYear();
    const publicId = `SLOT-${currentYear}-${String(counter).padStart(4, '0')}`;
    const newRequest: SlotRequest = {
      id: `slot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      publicId,
      eventName: data.eventName.trim(),
      date: data.date,
      time: data.time,
      customerName: data.customerName.trim(),
      phone: data.phone.trim(),
      notes: data.notes?.trim() || undefined,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    this.slotRequests.unshift(newRequest);
    return newRequest;
  }

  updateSlotRequestStatus(id: string, status: SlotRequestStatus): SlotRequest | null {
    const req = this.slotRequests.find(r => r.id === id);
    if (!req) return null;
    req.status = status;
    return req;
  }

  deleteSlotRequest(id: string): boolean {
    const idx = this.slotRequests.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.slotRequests.splice(idx, 1);
    return true;
  }

  // --- Dashboard KPIs ---
  getDashboardStats() {
    const totalSlotRequests = this.slotRequests.length;
    const newSlotRequests = this.slotRequests.filter(s => s.status === 'NEW').length;
    const contactedSlotRequests = this.slotRequests.filter(s => s.status === 'CONTACTED').length;
    const confirmedSlotRequests = this.slotRequests.filter(s => s.status === 'CONFIRMED').length;

    const totalBookings = this.bookings.length;
    const pendingBookings = this.bookings.filter(b => b.status === 'PENDING').length;
    const confirmedBookings = this.bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'ADVANCE_PAID' || b.status === 'SCHEDULED').length;
    const completedBookings = this.bookings.filter(b => b.status === 'SHOOT_COMPLETED' || b.status === 'DELIVERED').length;

    // Calculate total confirmed/paid revenue in paise
    const totalRevenuePaise = this.bookings
      .filter(b => b.status !== 'CANCELLED' && b.status !== 'REJECTED')
      .reduce((sum, b) => sum + (b.priceSnapshot?.totalPaise || 0), 0);

    const newEnquiriesCount = this.actingEnquiries.filter(e => e.status === 'NEW').length;

    return {
      totalSlotRequests,
      newSlotRequests,
      contactedSlotRequests,
      confirmedSlotRequests,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalRevenuePaise,
      newEnquiriesCount,
      activeBlockedDays: this.blockedDates.length,
    };
  }
}

// Global singleton instance
const globalStore = global as unknown as { __jk_db_store?: DatabaseStore };
export const db = globalStore.__jk_db_store || new DatabaseStore();
if (process.env.NODE_ENV !== 'production') {
  globalStore.__jk_db_store = db;
}
