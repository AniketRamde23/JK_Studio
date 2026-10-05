import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const success = db.deleteBlockedDate(params.id);
  if (!success) {
    return NextResponse.json({ error: 'Blocked date not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
