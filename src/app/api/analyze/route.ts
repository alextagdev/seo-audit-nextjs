import { NextRequest, NextResponse } from 'next/server';
import { analyzeUrl } from '@/lib/server/seo-analyzer';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { message: 'URL-ul este obligatoriu' },
        { status: 400 }
      );
    }

    const result = await analyzeUrl(url);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { message: 'Eroare la analiza URL-ului', error: error.message },
      { status: 500 }
    );
  }
}
