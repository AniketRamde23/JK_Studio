import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  let bookings = db.getBookings();

  if (status && status !== 'ALL') {
    bookings = bookings.filter(b => b.status === status);
  }

  return NextResponse.json({ bookings });
}
