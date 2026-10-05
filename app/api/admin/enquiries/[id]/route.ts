import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    const ok = db.updateActingEnquiryStatus(params.id, status);
    if (!ok) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update enquiry' }, { status: 400 });
  }
}
