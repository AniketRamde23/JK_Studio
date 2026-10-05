import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const service = db.getServiceBySlug(params.slug);
  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const packages = db.getPackages(service.id);
  const addons = db.getAddons().filter(a => a.appliesToServices.includes(service.id));

  return NextResponse.json({
    service,
    packages,
    addons
  });
}
