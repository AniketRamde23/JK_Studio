import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { z } from 'zod';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().min(2, 'Production house / Agency name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Phone number is required'),
  project: z.string().min(2, 'Project title is required'),
  role: z.string().min(2, 'Role description is required'),
  projectType: z.string().min(2, 'Project type is required'),
  datesNeeded: z.string().min(2, 'Dates or schedule required'),
  message: z.string().min(10, 'Message details required'),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = enquirySchema.parse(json);

    const enquiry = db.addActingEnquiry(data);

    return NextResponse.json({
      success: true,
      enquiry,
      message: 'Casting enquiry received. JK’s team will review and respond promptly.'
    }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to submit enquiry' }, { status: 400 });
  }
}
