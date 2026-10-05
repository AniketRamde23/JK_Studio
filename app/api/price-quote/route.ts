import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageId, extraHours, travelZoneId, selectedAddonIds } = body;

    if (!packageId) {
      return NextResponse.json({ error: 'packageId is required' }, { status: 400 });
    }

    const quote = db.calculatePriceQuote({
      packageId,
      extraHours: Number(extraHours) || 0,
      travelZoneId,
      selectedAddonIds: Array.isArray(selectedAddonIds) ? selectedAddonIds : [],
    });

    return NextResponse.json({
      quote,
      currency: 'INR',
      unit: 'paise',
      advancePercentage: db.getSettings().advancePercentage,
      gstPercentage: db.getSettings().gstPercentage,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error calculating price quote' }, { status: 400 });
  }
}
