import { NextResponse } from 'next/server';

export async function GET() {
  // Triggering new build with updated SMTP env vars
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
