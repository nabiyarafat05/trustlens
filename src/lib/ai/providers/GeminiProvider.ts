import { AIProvider } from '../AIProvider';
import { AnalysisRequest, TrustLensAnalysis } from '../types';
import { AnalysisParser } from '../AnalysisParser';

export class GeminiProvider implements AIProvider {
  readonly name = 'Google Gemini Multimodal';
  readonly model: string;
  private apiKey: string | undefined;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    this.model = process.env.AI_MODEL || 'gemini-2.5-flash';
    this.baseUrl = process.env.AI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async analyze(request: AnalysisRequest): Promise<TrustLensAnalysis> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const systemPrompt = `You are TrustLens, an expert cybersecurity digital safety analyst.
Your job is to analyze potentially suspicious digital content (images, screenshots, SMS, emails, documents, or URLs).
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
8. Clear uncertainty (what could NOT be verified, such as origin IP, cryptographic email headers, or true sender identity)
9. Disclaimer.

Return ONLY a valid JSON object strictly matching this structure:
{
  "overallRisk": "low" | "medium" | "high" | "critical" | "unclear",
  "confidence": number (0-100),
  "headline": string,
  "summary": string,
  "contentType": "image" | "text" | "url" | "document",
  "detectedEntities": string[],
  "riskSignals": [
    {
      "id": string,
      "type": "urgency" | "credential_harvesting" | "impersonation" | "financial_pressure" | "suspicious_link" | "coercion" | "technical_anomaly" | "malware_lure" | "generic",
      "severity": "low" | "medium" | "high",
      "title": string,
      "description": string,
      "evidence": string,
      "whyItMatters": string,
      "confidence": number (0-100)
    }
  ],
  "positiveSignals": [
    {
      "title": string,
      "description": string,
      "importance": "low" | "medium" | "high"
    }
  ],
  "requestsDetected": {
    "payment": boolean,
    "otp": boolean,
    "password": boolean,
    "personalInformation": boolean,
    "identityDocument": boolean,
    "bankInformation": boolean,
    "urgentAction": boolean,
    "remoteAccess": boolean
  },
  "links": [
    {
      "url": string,
      "domain": string,
      "isSuspicious": boolean,
      "suspiciousSignals": string[],
      "isShortener": boolean
    }
  ],
  "recommendedActions": string[],
  "avoidActions": string[],
  "verificationSteps": [
    {
      "step": string,
      "channel": string,
      "details": string
    }
  ],
  "uncertainty": string[],
  "disclaimer": string
}`;

    const parts: any[] = [{ text: systemPrompt }];

    if (request.content) {
      parts.push({
        text: `CONTENT TO ANALYZE (${request.type.toUpperCase()}):\n${request.content}\n${request.userNotes ? `User Notes: ${request.userNotes}` : ''}`,
      });
    }

    if (request.fileData && request.mimeType) {
      // Clean base64 prefix if present
      const cleanBase64 = request.fileData.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inline_data: {
          mime_type: request.mimeType,
          data: cleanBase64,
        },
      });
    }

    const endpoint = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Gemini returned an empty candidate response.');
    }

    return AnalysisParser.parse(candidateText, request, this.name, this.model);
  }
}
