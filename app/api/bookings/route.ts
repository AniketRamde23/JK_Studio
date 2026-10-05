import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { z } from 'zod';

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(10, 'Valid 10-digit phone number is required'),
  customerEmail: z.string().email('Valid email address is required'),
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
  consentTerms: z.boolean().refine(val => val === true, 'You must accept the terms & policies'),
  consentPortfolio: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validatedData = bookingSchema.parse(json);

    const result = db.createBooking({
      ...validatedData,
      slot: validatedData.slot || 'Full Day',
    });

    return NextResponse.json({
      success: true,
      publicId: result.booking.publicId,
      token: result.booking.token,
      booking: result.booking,
      message: 'Your frame is reserved. Request received.',
    }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 400 });
  }
}
