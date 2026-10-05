import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');
  let from = searchParams.get('from');
  const to = searchParams.get('to');
  const slot = searchParams.get('slot') || undefined;

  if (!from && month) {
    from = `${month}-01`;
  }
  if (!from) {
    from = new Date().toISOString().split('T')[0];
  }

  const startDate = new Date(from);
  const endDate = to ? new Date(to) : new Date(startDate.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 days default

  const availabilityMap: Record<string, 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'> = {};

  const current = new Date(startDate);
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    availabilityMap[dateStr] = db.getAvailability(dateStr, slot);
    current.setDate(current.getDate() + 1);
  }

  return NextResponse.json({
    from: from,
    to: endDate.toISOString().split('T')[0],
    availability: availabilityMap,
  });
}
