import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  let requests = db.getSlotRequests();

  if (status && status !== 'ALL') {
    requests = requests.filter(r => r.status === status);
  }

  return NextResponse.json({ slotRequests: requests });
}
