import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  const settings = db.getSettings();
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = db.updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 400 });
  }
}
