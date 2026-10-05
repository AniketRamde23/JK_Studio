import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Phone number is required'),
  subject: z.string().default('General Inquiry'),
  message: z.string().min(10, 'Message is required'),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = contactSchema.parse(json);

    const message = db.addContactMessage(data);

    return NextResponse.json({
      success: true,
      message: 'Message delivered. We will respond within 24 hours.',
      data: message,
    }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 400 });
  }
}
