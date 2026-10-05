import {
  ActingProfile,
  ActingProject,
  Service,
  Package,
  Addon,
  TravelZone,
  GalleryImage,
  Booking,
  BlockedDate,
  ActingEnquiry,
  Testimonial,
  SiteSettings,
  ContactMessage,
  SlotRequest
} from './types';
import realGalleryData from './real-gallery-data.json';

export const initialSiteSettings: SiteSettings = {
  brandName: "Kashinath Jale (JK Studio)",
  tagline: "I perform stories on screen. I preserve stories through my lens.",
  actorInstagram: "actor_jk_",
  photoInstagram: "jkphotography2168",
  whatsappNumber: "+919177856208",
  contactEmail: "contact@actorjk.com",
  phone: "+91 91778 56208",
  baseCity: "Hyderabad",
  advancePercentage: 30,
  gstPercentage: 18,
  autoWatermark: true,
};

export const initialActingProfile: ActingProfile = {
  id: "prof_1",
  name: "Kashinath Jale",
  stageName: "Kashinath Jale",
  bio: "Trained in method and physical theatre, Kashinath Jale transitions effortlessly between high-voltage cinematic intensity and understated vulnerability. With visceral dedication to every frame, backed by extensive training in cinematic combat, Kalaripayattu, and equestrian arts.",
  shortBio: "Actor · Storyteller · Classical & Modern Screen Performer based between Hyderabad & Mumbai.",
  location: "Hyderabad & Mumbai (Travels Pan-India)",
  languages: ["Telugu (Native)", "Hindi (Fluent)", "English (Fluent)", "Tamil (Conversational)"],
  height: "6'1\" (185 cm)",
  skills: [
    "Method Acting",
    "Screen Combat & Stunts",
    "Kalaripayattu & Martial Arts",
    "Horse Riding",
    "Voice Modulation & Dubbing",
    "Precision Driving"
  ],
  showreelUrl: "https://assets.mixkit.co/videos/preview/mixkit-dramatic-close-up-of-a-man-in-the-dark-42880-large.mp4",
  resumeUrl: "#",
  headshotPackUrl: "#",
};

export const initialActingProjects: ActingProject[] = [
  {
    id: "act_1",
    title: "Vajra: The Iron Veil",
    type: "Movie",
    role: "Vikram Dev (Lead Antagonist)",
    director: "Karthik Varma",
    production: "Mythri Movie Makers",
    year: 2025,
    description: "A high-stakes neo-noir thriller set in the Deccan badlands. Portrayed the ruthless yet philosophic syndicate chieftain Vikram Dev. Features 4 intense hand-to-hand fight sequences.",
    posterUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-dramatic-close-up-of-a-man-in-the-dark-42880-large.mp4",
    featured: true,
    visible: true,
    sortOrder: 1,
  },
  {
    id: "act_2",
    title: "Shadows in the Mist",
    type: "Movie",
    role: "Inspector Samar Sen (Protagonist)",
    director: "Anurag Sen",
    production: "CineGlow Studios",
    year: 2024,
    description: "Official Selection at IFFI Goa 2024. A psychological investigation into forgotten disappearances across the Nilgiri hills. Acclaimed for understated, intense character portrayal.",
    posterUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-looking-out-over-the-ocean-at-sunset-41120-large.mp4",
    featured: true,
    visible: true,
    sortOrder: 2,
  },
  {
    id: "act_3",
    title: "Echoes of Malabar",
    type: "Web Series",
    role: "Raghav Menon",
    director: "Naveen Raj",
    production: "Prime Video India",
    year: 2024,
    description: "A sweeping historical family saga set across three decades in coastal Kerala. Spanned 6 episodes exploring generational honor, betrayal, and redemption.",
    posterUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    visible: true,
    sortOrder: 3,
  },
  {
    id: "act_4",
    title: "Royal Enfield: Untamed Soul",
    type: "Ad / TVC",
    role: "The Lone Wanderer (Solo Lead)",
    director: "Rohan Kapoor",
    production: "Equinox Films",
    year: 2024,
    description: "National television commercial broadcast across 8 channels and OTT platforms. Shot entirely on location in Ladakh.",
    posterUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    visible: true,
    sortOrder: 4,
  },
  {
    id: "act_5",
    title: "Macbeth Re-imagined",
    type: "Theatre",
    role: "Macbeth",
    director: "Dr. Arundhati Ghosh",
    production: "Prithvi Theatre Festival",
    year: 2023,
    description: "A 90-minute physical theatre adaptation exploring the psychic disintegration of ambition. Performed across Mumbai, Bangalore, and Hyderabad.",
    posterUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    visible: true,
    sortOrder: 5,
  }
];

export const initialServices: Service[] = [
  {
    id: "srv_weddings",
    slug: "weddings",
    name: "Weddings & Celebrations",
    tagline: "Unscripted emotions captured with silver-screen intimacy.",
    description: "We don't shoot stiff postures; we capture the breath between moments. From poignant pheras under twilight mandaps to joyful dancing, every frame is treated like a master shot in cinema.",
    coverImage: "/photos/optimized/1.1.webp",
    startingPricePaise: 7500000, // ₹75,000
    active: true,
    sortOrder: 1,
  },
  {
    id: "srv_portraits",
    slug: "portraits",
    name: "Portraits & Headshots",
    tagline: "Dramatic, character-defining portraits for artists and visionaries.",
    description: "Crafted with intentional tungsten and chiaroscuro lighting. Tailored for actors needing standout audition headshots, directors, authors, and entrepreneurs seeking portraits with genuine presence.",
    coverImage: "/photos/optimized/5.webp",
    startingPricePaise: 1800000, // ₹18,000
    active: true,
    sortOrder: 2,
  },
  {
    id: "srv_editorial",
    slug: "editorial",
    name: "Fashion & Editorial Campaigns",
    tagline: "Visual narratives that elevate designer collections and brand identity.",
    description: "Combining high-fashion aesthetics with cinematic moodboards. We engineer light, location, and choreography to construct unforgettable brand imagery.",
    coverImage: "/photos/optimized/13.webp",
    startingPricePaise: 4500000, // ₹45,000
    active: true,
    sortOrder: 3,
  },
  {
    id: "srv_cinema",
    slug: "cinema-stills",
    name: "On-Set Cinema Stills & BTS",
    tagline: "Authentic on-set documentary stills that capture the film's soul.",
    description: "Quiet, non-intrusive blimped coverage of feature films, series productions, and high-profile commercial sets. Preserving the sweat, camaraderie, and magic behind the lens.",
    coverImage: "/photos/optimized/19.webp",
    startingPricePaise: 3500000, // ₹35,000
    active: true,
    sortOrder: 4,
  }
];

export const initialPackages: Package[] = [
  // Wedding packages
  {
    id: "pkg_w_silver",
    serviceId: "srv_weddings",
    name: "Silver Ceremony",
    pricePaise: 7500000, // ₹75,000
    durationHours: 8,
    photographers: 2,
    editedPhotos: 60,
    deliverables: [
      "1 Candid Photographer + 1 Traditional Lead",
      "Coverage of 1 Major Event / Ceremony",
      "350+ Color-graded High-Res Digital Stills",
      "60 Signature Fine-Art Retouched Images",
      "Private Online Proofing & Download Gallery (1 Year)"
    ],
    popular: false,
    active: true,
  },
  {
    id: "pkg_w_gold",
    serviceId: "srv_weddings",
    name: "Gold Cinema Experience",
    pricePaise: 13500000, // ₹1,35,000
    durationHours: 16,
    photographers: 3,
    editedPhotos: 120,
    deliverables: [
      "2-Day Multi-Session Coverage (e.g. Sangeet + Wedding)",
      "2 Senior Candid Photographers + 1 Cinematographer",
      "Aerial Drone Cinematic Establishing Views",
      "750+ Curated Color-graded Files",
      "120 Signature Magazine-Grade Retouched Stills",
      "3-4 Minute 4K Cinematic Teaser Film",
      "Complimentary Pre-Wedding Couple Session (2 Hours)"
    ],
    popular: true,
    active: true,
  },
  {
    id: "pkg_w_royal",
    serviceId: "srv_weddings",
    name: "The Royal Heirloom",
    pricePaise: 24000000, // ₹2,40,000
    durationHours: 24,
    photographers: 4,
    editedPhotos: 200,
    deliverables: [
      "Complete 3-Day Wedding Chronicle (Haldi, Sangeet, Muhurtham, Reception)",
      "Dedicated Full Crew directed personally by JK",
      "Cinematic Teaser + 15-Minute Highlight Film in 4K",
      "Handcrafted Italian Leather-bound Flush Mount Heirloom Album (40 Pages)",
      "2 Parent Albums (Mini replicas)",
      "Same-day Edit Teaser for Social Media Reels",
      "Raw Stills archive delivered on Custom Hard Drive"
    ],
    popular: false,
    active: true,
  },

  // Portrait packages
  {
    id: "pkg_p_actor",
    serviceId: "srv_portraits",
    name: "The Actor's Portfolio",
    pricePaise: 1800000, // ₹18,000
    durationHours: 2,
    photographers: 1,
    editedPhotos: 12,
    deliverables: [
      "2 Hours In-Studio or Controlled Natural Light",
      "3 Wardrobe / Look Transitions",
      "Character Direction by JK (Dramatics & Micro-expressions)",
      "12 Master-Retouched Headshots (Casting Spec 8x10 & 2:3)",
      "Ready-to-Print Contact Sheet PDF"
    ],
    popular: true,
    active: true,
  },
  {
    id: "pkg_p_editorial",
    serviceId: "srv_portraits",
    name: "Creative Visionary",
    pricePaise: 3200000, // ₹32,000
    durationHours: 4,
    photographers: 1,
    editedPhotos: 25,
    deliverables: [
      "Half-day Studio + Architectural Location",
      "5 Styled Looks with Custom Light Scenarios",
      "Creative Moodboard & Lighting Design",
      "25 Fine-Art Retouched High-Res Images",
      "Editorial Press Kit Ready Layouts"
    ],
    popular: false,
    active: true,
  },

  // Fashion / Editorial packages
  {
    id: "pkg_e_lookbook",
    serviceId: "srv_editorial",
    name: "Collection Lookbook",
    pricePaise: 4500000, // ₹45,000
    durationHours: 6,
    photographers: 2,
    editedPhotos: 40,
    deliverables: [
      "6 Hours Studio Shoot with Professional Lighting Grid",
      "Coverage for up to 15 Garments / Designer Looks",
      "40 Retouched Editorial Catalog & E-Commerce Ready Stills",
      "Color Accuracy Calibrated Delivery"
    ],
    popular: false,
    active: true,
  },
  {
    id: "pkg_e_campaign",
    serviceId: "srv_editorial",
    name: "Cinematic Brand Campaign",
    pricePaise: 9500000, // ₹95,000
    durationHours: 10,
    photographers: 2,
    editedPhotos: 75,
    deliverables: [
      "Full Day On-Location / Set Production",
      "Concept Development, Lighting Design & Art Direction",
      "75 Retouched Master Frames (Billboard & Web Resolution)",
      "3 Short-Form Motion Vignettes (Vertical 4K for Instagram/Adverts)"
    ],
    popular: true,
    active: true,
  },

  // Cinema stills packages
  {
    id: "pkg_c_day",
    serviceId: "srv_cinema",
    name: "Production Day Stills",
    pricePaise: 3500000, // ₹35,000
    durationHours: 10,
    photographers: 1,
    editedPhotos: 50,
    deliverables: [
      "10 Hours On-Set Coverage with Sound-Blimped Mirrorless Cameras",
      "Continuous BTS & Master Character Frames",
      "50 Retouched High-Impact Publicity Stills",
      "Same-Day Press Release Selection for PR"
    ],
    popular: true,
    active: true,
  }
];

export const initialAddons: Addon[] = [
  {
    id: "add_drone",
    name: "Aerial Drone 4K Cinematography",
    description: "Licensed drone pilot capturing cinematic establishing aerials of the venue and surroundings.",
    pricePaise: 1200000, // ₹12,000
    unit: "per day",
    appliesToServices: ["srv_weddings", "srv_editorial"],
  },
  {
    id: "add_album",
    name: "Handcrafted Flush-Mount Album (40 Pgs)",
    description: "Archival paper, lay-flat binding with genuine leather/linen cover engraved with custom foil monogram.",
    pricePaise: 1800000, // ₹18,000
    unit: "per book",
    appliesToServices: ["srv_weddings", "srv_portraits"],
  },
  {
    id: "add_rush",
    name: "24-Hour Express Sneak Peek (20 Edits)",
    description: "High-priority editorial turnaround within 24 hours for immediate social media & press release.",
    pricePaise: 600000, // ₹6,000
    unit: "per booking",
    appliesToServices: ["srv_weddings", "srv_portraits", "srv_editorial", "srv_cinema"],
  },
  {
    id: "add_extra_hour",
    name: "Extra On-Set Hour",
    description: "Overtime coverage per additional hour with complete crew.",
    pricePaise: 500000, // ₹5,000
    unit: "per hour",
    appliesToServices: ["srv_weddings", "srv_portraits", "srv_editorial", "srv_cinema"],
  },
  {
    id: "add_raw_drive",
    name: "Archival 2TB Hard Drive with All RAWs",
    description: "Rugged high-speed hard drive containing entire uncompressed RAW dataset and high-res JPEG masters.",
    pricePaise: 450000, // ₹4,500
    unit: "per booking",
    appliesToServices: ["srv_weddings", "srv_portraits", "srv_editorial", "srv_cinema"],
  }
];

export const initialTravelZones: TravelZone[] = [
  {
    id: "zone_local",
    name: "Local Hyderabad / Secunderabad",
    cities: ["Hyderabad", "Secunderabad", "Cyberabad", "Gachibowli", "Jubilee Hills"],
    chargePaise: 0,
  },
  {
    id: "zone_south",
    name: "Southern Hubs (Bangalore / Chennai / Vijayawada)",
    cities: ["Bangalore", "Bengaluru", "Chennai", "Vijayawada", "Visakhapatnam", "Warangal"],
    chargePaise: 650000, // ₹6,500
  },
  {
    id: "zone_west",
    name: "Western Hubs (Mumbai / Pune / Goa)",
    cities: ["Mumbai", "Pune", "Goa", "Nashik", "Ahmedabad"],
    chargePaise: 900000, // ₹9,000
  },
  {
    id: "zone_north",
    name: "Northern Hubs (Delhi NCR / Jaipur / Udaipur)",
    cities: ["Delhi", "New Delhi", "Noida", "Gurugram", "Jaipur", "Udaipur", "Chandigarh"],
    chargePaise: 1200000, // ₹12,000
  },
  {
    id: "zone_dest",
    name: "Destination / International",
    cities: ["Kerala", "Andamans", "Dubai", "Bali", "Other International"],
    chargePaise: 2500000, // ₹25,000 base + client arranges flights & accommodation
  }
];

export const initialGalleryImages: GalleryImage[] = realGalleryData as GalleryImage[];

export const initialTestimonials: Testimonial[] = [
  {
    id: "t_1",
    name: "Aditya & Sanjana Rao",
    role: "Hyderabad",
    serviceName: "Gold Cinema Experience",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    text: "JK and his team didn't just photograph our wedding; they gave us a cinema-grade heirloom. Every guest remarked on how calm, artistic, and unobtrusive they were. The teaser brought our entire family to tears.",
    rating: 5,
    featured: true,
    visible: true,
    verifiedBooking: true,
  },
  {
    id: "t_2",
    name: "Vikramaditya Kulkarni",
    role: "Film Director",
    serviceName: "The Actor's Portfolio",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    text: "Because JK is an actor himself, his camera direction is on another tier. He directed micro-expressions and angles that got me shortlisted by two major casting agencies within three weeks.",
    rating: 5,
    featured: true,
    visible: true,
    verifiedBooking: true,
  },
  {
    id: "t_3",
    name: "Pooja Reddy",
    role: "Founder, Vastra Couture",
    serviceName: "Cinematic Brand Campaign",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    text: "We shot our festive campaign with JK in Rajasthan. His lighting sensibilities transformed ordinary locations into poetic frames. Our conversion rate on the collection jumped 40% after launching the visuals.",
    rating: 5,
    featured: true,
    visible: true,
    verifiedBooking: true,
  }
];

export const initialBlockedDates: BlockedDate[] = [
  {
    id: "block_1",
    startDate: "2026-10-18",
    endDate: "2026-10-22",
    type: "MOVIE",
    privateNote: "Feature Film Climax Shoot - Ramoji Film City (Action sequence)",
  },
  {
    id: "block_2",
    startDate: "2026-11-05",
    endDate: "2026-11-08",
    type: "MOVIE",
    privateNote: "Web Series Schedule in Ooty",
  },
  {
    id: "block_3",
    startDate: "2026-11-20",
    endDate: "2026-11-20",
    type: "PERSONAL",
    privateNote: "Family Engagement",
  }
];

export const initialBookings: Booking[] = [
  {
    id: "b_1",
    publicId: "PH-2026-0001",
    token: "tok_jk_8829141",
    customerId: "cust_1",
    customer: {
      id: "cust_1",
      name: "Rohit & Meera Sharma",
      phone: "+91 98480 12345",
      email: "rohit.sharma@example.com",
      createdAt: "2026-10-01T08:00:00Z"
    },
    serviceId: "srv_weddings",
    packageId: "pkg_w_gold",
    status: "CONFIRMED",
    paymentStatus: "PARTIALLY_PAID",
    priceSnapshot: {
      packagePaise: 13500000,
      extraHoursPaise: 0,
      travelPaise: 0,
      addonsPaise: 1200000,
      gstPaise: 2646000,
      totalPaise: 17346000,
      advancePaise: 5203800,
    },
    sessions: [
      {
        id: "sess_1",
        date: "2026-10-25",
        slot: "Full Day",
        sessionName: "Sangeet & Cocktail",
        locationName: "Taj Falaknuma Palace",
        city: "Hyderabad",
      },
      {
        id: "sess_2",
        date: "2026-10-26",
        slot: "Full Day",
        sessionName: "Muhurtham & Reception",
        locationName: "Taj Falaknuma Palace",
        city: "Hyderabad",
      }
    ],
    selectedAddonIds: ["add_drone"],
    notes: "Please capture aerial shots of the sunset palace illumination.",
    adminNotes: "Client paid advance via bank transfer on Oct 1. Camera team A assigned.",
    consentTerms: true,
    consentPortfolio: true,
    createdAt: "2026-10-01T08:15:00Z"
  },
  {
    id: "b_2",
    publicId: "PH-2026-0002",
    token: "tok_jk_7736182",
    customerId: "cust_2",
    customer: {
      id: "cust_2",
      name: "Aryan Deshmukh",
      phone: "+91 99220 54321",
      email: "aryan.deshmukh@gmail.com",
      createdAt: "2026-10-01T09:30:00Z"
    },
    serviceId: "srv_portraits",
    packageId: "pkg_p_actor",
    status: "PENDING",
    paymentStatus: "PENDING",
    priceSnapshot: {
      packagePaise: 1800000,
      extraHoursPaise: 0,
      travelPaise: 0,
      addonsPaise: 600000,
      gstPaise: 432000,
      totalPaise: 2832000,
      advancePaise: 849600,
    },
    sessions: [
      {
        id: "sess_3",
        date: "2026-10-14",
        slot: "Morning",
        sessionName: "Audition Headshot Shoot",
        locationName: "JK Creative Studio, Jubilee Hills",
        city: "Hyderabad",
      }
    ],
    selectedAddonIds: ["add_rush"],
    notes: "Need 2 dramatic low-key looks for upcoming Hindi web series audition.",
    consentTerms: true,
    consentPortfolio: true,
    createdAt: "2026-10-01T09:35:00Z"
  }
];

export const initialActingEnquiries: ActingEnquiry[] = [
  {
    id: "enq_1",
    name: "Mukesh Chhabra Casting Co.",
    company: "MCCC Mumbai",
    email: "casting@mccc.in",
    phone: "+91 98200 11223",
    project: "Project 'Kavach' (Feature Film)",
    role: "Parallel Lead / ATS Commander",
    projectType: "Feature Film",
    datesNeeded: "Dec 2026 - Jan 2027",
    message: "We reviewed JK's combat reel from Vajra. The director is keen on auditioning him for the role of ATS commander. Please let us know his dates for screen test in Mumbai next week.",
    status: "NEW",
    createdAt: "2026-09-30T14:20:00Z",
  }
];

export const initialContactMessages: ContactMessage[] = [
  {
    id: "msg_1",
    name: "Devika Shenoy",
    email: "devika@vogueindia.com",
    phone: "+91 98110 99887",
    subject: "Editorial Feature Inquiry",
    message: "Hi JK, we are planning a visual piece on 'Cinematic Dual Identities' for an upcoming digital issue and would love to feature you and your photo series.",
    status: "NEW",
    createdAt: "2026-10-01T07:10:00Z"
  }
];

export const initialSlotRequests: SlotRequest[] = [
  {
    id: "slot_1",
    publicId: "SLOT-2026-0001",
    eventName: "Birthday Function",
    date: "2026-10-25",
    time: "06:00 PM",
    customerName: "Rahul Sharma",
    phone: "+91 98490 11223",
    notes: "Evening celebration with family and friends at Jubilee Hills.",
    status: "NEW",
    createdAt: "2026-10-05T09:30:00Z"
  },
  {
    id: "slot_2",
    publicId: "SLOT-2026-0002",
    eventName: "Wedding",
    date: "2026-10-28",
    time: "10:00 AM",
    customerName: "Priya Patel",
    phone: "+91 97654 32109",
    notes: "Traditional morning ceremony.",
    status: "CONTACTED",
    createdAt: "2026-10-04T14:15:00Z"
  },
  {
    id: "slot_3",
    publicId: "SLOT-2026-0003",
    eventName: "Engagement",
    date: "2026-11-02",
    time: "07:00 PM",
    customerName: "Arjun Verma",
    phone: "+91 99887 66554",
    notes: "Ring ceremony evening reception.",
    status: "CONFIRMED",
    createdAt: "2026-10-03T11:00:00Z"
  }
];
