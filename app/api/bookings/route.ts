import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { sendSlotRequestNotificationEmail } from '@/lib/email';
import { z } from 'zod';

const slotRequestSchema = z.object({
  eventName: z.string().min(2, 'Function or Event name is required'),
  date: z.string().min(4, 'Valid date is required'),
  time: z.string().min(1, 'Preferred time is required'),
  customerName: z.string().min(2, 'Your name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  notes: z.string().optional(),
});

const legacyBookingSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(10, 'Valid 10-digit phone number is required'),
  customerEmail: z.string().email('Valid email address is required').optional().default('customer@example.com'),
  alternatePhone: z.string().optional(),
  callPreference: z.string().optional(),
  functionType: z.string().min(1, 'Please select or enter the function/event type'),
  serviceId: z.string().optional().default('srv_weddings'),
  packageId: z.string().optional().default('pkg_w_gold'),
  dates: z.array(z.string()).min(1, 'At least one date is required'),
  slot: z.string().default('Full Day'),
  locationName: z.string().optional().default('Client Chosen Venue'),
  city: z.string().optional().default('Hyderabad'),
  state: z.string().optional(),
  district: z.string().optional(),
  area: z.string().optional(),
  pincode: z.string().optional(),
  travelZoneId: z.string().optional(),
  extraHours: z.number().min(0).optional(),
  selectedAddonIds: z.array(z.string()).optional(),
  notes: z.string().optional(),
  consentTerms: z.boolean().optional().default(true),
  consentPortfolio: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    // Check if this is a simple "Book a Slot" request
    if (json.eventName || (!json.dates && json.date)) {
      const validated = slotRequestSchema.parse({
        eventName: json.eventName || json.functionType || 'Photography Event',
        date: json.date || (json.dates && json.dates[0]) || '',
        time: json.time || json.slot || '06:00 PM',
        customerName: json.customerName || '',
        phone: json.phone || json.customerPhone || '',
        notes: json.notes || '',
      });

      const slotRequest = db.createSlotRequest(validated);

      // Trigger email notification to owner (background safe)
      try {
        await sendSlotRequestNotificationEmail(slotRequest);
      } catch (mailErr) {
        console.error('Failed sending email notification:', mailErr);
      }

      return NextResponse.json({
        success: true,
        slotRequest,
        message: 'Slot request received! I will contact you shortly to discuss details and pricing.',
      }, { status: 201 });
    }

    // Legacy multi-step booking compatibility
    const validatedData = legacyBookingSchema.parse(json);
    const result = db.createBooking({
      ...validatedData,
      customerEmail: validatedData.customerEmail || 'client@example.com',
      slot: validatedData.slot || 'Full Day',
      consentTerms: true,
    });

    // Also create a companion slot request and send notification
    const companionSlot = db.createSlotRequest({
      eventName: validatedData.functionType,
      date: validatedData.dates[0] || new Date().toISOString().split('T')[0],
      time: validatedData.slot,
      customerName: validatedData.customerName,
      phone: validatedData.customerPhone,
      notes: validatedData.notes,
    });

    try {
      await sendSlotRequestNotificationEmail(companionSlot);
    } catch (mailErr) {
      console.error('Failed sending email notification:', mailErr);
    }

    return NextResponse.json({
      success: true,
      publicId: result.booking.publicId,
      token: result.booking.token,
      booking: result.booking,
      slotRequest: companionSlot,
      message: 'Your frame is reserved. Request received.',
    }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 400 });
  }
}
