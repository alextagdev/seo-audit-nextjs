import { NextRequest, NextResponse } from 'next/server';
import { sendAuditReport } from '@/lib/server/email-sender';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, auditData } = await request.json();

    if (!email || !auditData) {
      return NextResponse.json(
        { message: 'Email-ul și datele audit sunt obligatorii' },
        { status: 400 }
      );
    }

    await sendAuditReport(email, auditData);

    return NextResponse.json({
      success: true,
      message: 'Raportul a fost trimis cu succes!'
    });

  } catch (error: any) {
    console.error('Send report error:', error);
    return NextResponse.json(
      { message: 'Eroare la trimiterea raportului', error: error.message },
      { status: 500 }
    );
  }
}
