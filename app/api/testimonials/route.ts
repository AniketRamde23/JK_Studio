import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  const testimonials = db.getTestimonials();
  return NextResponse.json({ testimonials });
}
