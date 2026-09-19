import { AIProvider } from '../AIProvider';
import { AnalysisRequest, TrustLensAnalysis } from '../types';
import { AnalysisParser } from '../AnalysisParser';

export class OpenAIProvider implements AIProvider {
  readonly name = 'OpenAI Compatible Vision';
  readonly model: string;
  private apiKey: string | undefined;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
    this.model = process.env.AI_MODEL || 'gpt-4o';
    this.baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async analyze(request: AnalysisRequest): Promise<TrustLensAnalysis> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured.');
    }

    const systemPrompt = `You are TrustLens, an expert cybersecurity digital safety analyst.
Analyze potentially suspicious digital content (images, screenshots, SMS, emails, documents, or URLs).
CRITICAL PRINCIPLE:
Do NOT claim with certainty that something is a scam or legitimate.
Instead, provide:
1. An objective risk assessment (overallRisk: low, medium, high, critical, unclear)
2. Evidence and signals that led to the assessment (with severity, title, exact quote/visual evidence, whyItMatters explaining the psychological/security risk, and confidence)
3. Balanced positive signals (e.g., standard domain, no urgency, authentic communication tone)
4. Requests detected (payment, otp, password, personalInformation, identityDocument, bankInformation, urgentAction, remoteAccess)
5. Links extracted and evaluated
6. Actionable recommendations ("What to do")
7. Actions to avoid ("What to avoid")
8. Clear uncertainty (what could NOT be verified)
9. Disclaimer.

Return ONLY a valid JSON object matching the TrustLens analysis schema.`;

    const userContent: any[] = [];

    if (request.content) {
      userContent.push({
        type: 'text',
        text: `CONTENT TO ANALYZE (${request.type.toUpperCase()}):\n${request.content}\n${request.userNotes ? `User Notes: ${request.userNotes}` : ''}`,
      });
    }

    if (request.fileData) {
      const dataUri = request.fileData.startsWith('data:')
        ? request.fileData
        : `data:${request.mimeType || 'image/png'};base64,${request.fileData}`;

      userContent.push({
        type: 'image_url',
        image_url: {
          url: dataUri,
        },
      });
    }

    const endpoint = `${this.baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const contentText = data?.choices?.[0]?.message?.content;

    if (!contentText) {
      throw new Error('OpenAI returned an empty response.');
    }

    return AnalysisParser.parse(contentText, request, this.name, this.model);
  }
}
