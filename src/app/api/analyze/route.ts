import { NextRequest, NextResponse } from 'next/server';
import { aiAnalysisService } from '@/lib/ai/AIAnalysisService';
import { AnalysisRequest } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { type, content, fileData, mimeType, fileName, userNotes, redactPii } = body;

    if (!type || !['image', 'text', 'url', 'document'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid input type. Must be "image", "text", "url", or "document".' },
        { status: 400 }
      );
    }

    if (!content && !fileData) {
      return NextResponse.json(
        { success: false, error: 'Please provide either text content, a URL, or an uploaded file.' },
        { status: 400 }
      );
    }

    const requestPayload: AnalysisRequest = {
      type,
      content: typeof content === 'string' ? content : undefined,
      fileData: typeof fileData === 'string' ? fileData : undefined,
      mimeType: typeof mimeType === 'string' ? mimeType : undefined,
      fileName: typeof fileName === 'string' ? fileName : undefined,
      userNotes: typeof userNotes === 'string' ? userNotes : undefined,
      redactPii: Boolean(redactPii),
    };

    const analysis = await aiAnalysisService.analyze(requestPayload);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'An unexpected error occurred during analysis.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const providerInfo = aiAnalysisService.getActiveProviderInfo();
  return NextResponse.json({
    success: true,
    provider: providerInfo,
  });
}
