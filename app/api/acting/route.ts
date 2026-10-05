import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  const profile = db.getActingProfile();
  const projects = db.getActingProjects();

  return NextResponse.json({
    profile,
    projects
  });
}
