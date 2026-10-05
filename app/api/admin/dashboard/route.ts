import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  const stats = db.getDashboardStats();
  const recentBookings = db.getBookings().slice(0, 5);
  const enquiries = db.getActingEnquiries().slice(0, 5);
  const blockedDates = db.getBlockedDates();

  return NextResponse.json({
    stats,
    recentBookings,
    enquiries,
    blockedDates,
  });
}
