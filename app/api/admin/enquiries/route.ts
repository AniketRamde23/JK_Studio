import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  const enquiries = db.getActingEnquiries();
  const contactMessages = db.getContactMessages();

  return NextResponse.json({
    actingEnquiries: enquiries,
    contactMessages: contactMessages
  });
}
