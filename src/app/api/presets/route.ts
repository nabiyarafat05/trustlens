import { NextResponse } from 'next/server';
import { SAMPLE_SCENARIOS } from '@/lib/presets/sampleScenarios';

export async function GET() {
  return NextResponse.json({
    success: true,
    presets: SAMPLE_SCENARIOS.map((s) => ({
      id: s.id,
      category: s.category,
      title: s.title,
      badge: s.badge,
      description: s.description,
      inputType: s.inputType,
      previewText: s.previewText,
      targetContent: s.targetContent,
      expectedRisk: s.expectedRisk,
    })),
  });
}
