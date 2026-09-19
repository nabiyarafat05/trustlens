import { NextRequest, NextResponse } from 'next/server';
import { inspectUrl } from '@/lib/inspectors/urlInspector';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid URL string is required.' },
        { status: 400 }
      );
    }

    const inspection = inspectUrl(url);

    return NextResponse.json({
      success: true,
      inspection,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to inspect URL.' },
      { status: 500 }
    );
  }
}
