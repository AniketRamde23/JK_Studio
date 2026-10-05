import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  const services = db.getServices();
  const packages = db.getPackages();
  const travelZones = db.getTravelZones();
  const addons = db.getAddons();

  return NextResponse.json({
    services,
    packages,
    travelZones,
    addons
  });
}
