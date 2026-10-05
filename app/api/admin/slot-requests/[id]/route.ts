import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { SlotRequestStatus } from '@/lib/db/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = db.updateSlotRequestStatus(params.id, status as SlotRequestStatus);
    if (!updated) {
      return NextResponse.json({ error: 'Slot request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, slotRequest: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update slot request' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = db.deleteSlotRequest(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Slot request not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete slot request' }, { status: 400 });
  }
}
