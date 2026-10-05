import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const images = db.getGalleryImages(category);

  return NextResponse.json({
    images,
    total: images.length,
    category: category || 'all',
  });
}
