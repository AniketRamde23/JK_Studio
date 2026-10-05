import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  const blockedDates = db.getBlockedDates();
  const bookings = db.getBookings();

  return NextResponse.json({
    blockedDates,
    bookings: bookings.map(b => ({
      id: b.id,
      publicId: b.publicId,
      customerName: b.customer?.name,
      status: b.status,
      sessions: b.sessions,
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startDate, endDate, slot, type, privateNote } = body;

    if (!startDate || !privateNote) {
      return NextResponse.json({ error: 'startDate and privateNote are required' }, { status: 400 });
    }

    const newBlock = db.addBlockedDate({
      startDate,
      endDate: endDate || startDate,
      slot: slot || 'Full Day',
      type: type || 'MOVIE',
      privateNote,
    });

    return NextResponse.json({ success: true, blockedDate: newBlock }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add blocked date' }, { status: 400 });
  }
}
