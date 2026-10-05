import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  // Can be retrieved by token or by publicId
  let booking = db.getBookingByToken(token);
  if (!booking) {
    booking = db.getBookingByPublicId(token);
  }

  if (!booking) {
    return NextResponse.json({ error: 'Booking reservation not found' }, { status: 404 });
  }

  const pkg = db.getPackageById(booking.packageId);
  const service = db.getServices().find(s => s.id === booking?.serviceId);
  const history = db.getStatusHistory(booking.id);

  return NextResponse.json({
    booking,
    package: pkg,
    service,
    history,
  });
}
