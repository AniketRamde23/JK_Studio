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

export async function GET() {
  return NextResponse.json({ slotRequests: db.getSlotRequests() });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = slotRequestSchema.parse(json);

    const slotRequest = db.createSlotRequest(validated);

    // Send email notification to owner
    try {
      await sendSlotRequestNotificationEmail(slotRequest);
    } catch (err) {
      console.error('[SlotRequest] Email dispatch error:', err);
    }

    return NextResponse.json({
      success: true,
      slotRequest,
      message: 'Slot request received! I will contact you shortly to discuss details and pricing.',
    }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to submit slot request' }, { status: 400 });
  }
}
