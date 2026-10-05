import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, note, adminNotes } = body;

    let updated = null;
    if (status) {
      updated = db.updateBookingStatus(params.id, status, 'admin', note);
    }

    if (adminNotes !== undefined) {
      updated = db.updateBookingAdminNotes(params.id, adminNotes);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking: updated,
      history: db.getStatusHistory(params.id),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update booking' }, { status: 400 });
  }
}
