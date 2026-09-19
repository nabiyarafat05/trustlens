import { TrustLensAnalysisSchema } from './schema';
import { TrustLensAnalysis, AnalysisRequest } from './types';

export class AnalysisParser {
  /**
   * Cleans and extracts raw JSON string from AI model responses
   */
  static extractJsonString(rawText: string): string {
    let text = rawText.trim();

    // 1. Check for standard markdown code blocks
    const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
    const match = text.match(jsonBlockRegex);
    if (match && match[1]) {
      text = match[1].trim();
    } else {
      // 2. Look for outermost JSON brackets { ... }
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        text = text.substring(firstBrace, lastBrace + 1);
      }
    }

    // 3. Clean up common formatting anomalies
    // Strip trailing commas before closing braces/brackets
    text = text.replace(/,\s*([}\]])/g, '$1');

    return text;
  }

  /**
   * Safely parses, validates, and normalizes AI analysis output
   */
  static parse(
    rawOutput: string | object,
    request: AnalysisRequest,
    providerName: string = 'AI Service',
    modelName: string = 'model'
  ): TrustLensAnalysis {
    const startTime = Date.now();
    let parsedObject: unknown;

    try {
      if (typeof rawOutput === 'string') {
        const cleanedJson = this.extractJsonString(rawOutput);
        parsedObject = JSON.parse(cleanedJson);
      } else {
        parsedObject = rawOutput;
      }
    } catch (err) {
      console.warn('[AnalysisParser] Failed to parse JSON from AI model output:', err);
      return this.createGracefulFallback(request, providerName, modelName, 'Failed to parse model response as JSON');
    }

    // Validate with Zod
    const validationResult = TrustLensAnalysisSchema.safeParse(parsedObject);

    if (validationResult.success) {
      const data = validationResult.data;
      return {
        ...data,
        metadata: {
          inputType: request.type,
          processingTimeMs: Date.now() - startTime,
          providerName,
          modelName,
        },
      };
    }

    console.warn('[AnalysisParser] Schema validation issues detected:', validationResult.error.format());

    // Repair partial output if possible
    if (typeof parsedObject === 'object' && parsedObject !== null) {
      return this.repairPartialAnalysis(parsedObject as Record<string, unknown>, request, providerName, modelName);
    }

    return this.createGracefulFallback(request, providerName, modelName, 'Model output did not match expected schema');
  }

  /**
   * Repairs an object that partially satisfies the schema
   */
  private static repairPartialAnalysis(
    partial: Record<string, unknown>,
    request: AnalysisRequest,
    providerName: string,
    modelName: string
  ): TrustLensAnalysis {
    const rawRisk = String(partial.overallRisk || 'unclear').toLowerCase();
    const validRisks = ['low', 'medium', 'high', 'critical', 'unclear'] as const;
    const overallRisk = validRisks.includes(rawRisk as any) ? (rawRisk as any) : 'medium';

    return {
      overallRisk,
      confidence: typeof partial.confidence === 'number' ? Math.max(0, Math.min(100, partial.confidence)) : 70,
      summary: typeof partial.summary === 'string' ? partial.summary : 'The content was analyzed and several signals were evaluated.',
      headline: typeof partial.headline === 'string' ? partial.headline : 'Analysis completed with cautionary observations',
      contentType: request.type,
      detectedEntities: Array.isArray(partial.detectedEntities) ? partial.detectedEntities.map(String) : [],
      observedEvidence: Array.isArray(partial.observedEvidence) ? partial.observedEvidence.map(String) : [],
      riskSignals: Array.isArray(partial.riskSignals)
        ? (partial.riskSignals as any[]).map((sig, idx) => ({
            id: sig?.id || `sig_repair_${idx}`,
            type: sig?.type || 'generic',
            severity: ['low', 'medium', 'high'].includes(sig?.severity) ? sig.severity : 'medium',
            title: sig?.title || 'Suspicious Pattern Detected',
            description: sig?.description || 'Signal identified during inspection.',
            evidence: sig?.evidence || 'Observable content pattern',
            whyItMatters: sig?.whyItMatters || 'This pattern frequently aligns with social engineering attempts.',
            confidence: typeof sig?.confidence === 'number' ? sig.confidence : 75,
          }))
        : [],
      positiveSignals: Array.isArray(partial.positiveSignals)
        ? (partial.positiveSignals as any[]).map((pos) => ({
            title: pos?.title || 'Standard Pattern',
            description: pos?.description || 'Elements consistent with normal communication.',
            importance: pos?.importance || 'medium',
          }))
        : [],
      unverifiedClaims: Array.isArray(partial.unverifiedClaims) ? partial.unverifiedClaims.map(String) : [],
      requestsDetected: {
        payment: Boolean((partial.requestsDetected as any)?.payment),
        otp: Boolean((partial.requestsDetected as any)?.otp),
        password: Boolean((partial.requestsDetected as any)?.password),
        personalInformation: Boolean((partial.requestsDetected as any)?.personalInformation),
        identityDocument: Boolean((partial.requestsDetected as any)?.identityDocument),
        bankInformation: Boolean((partial.requestsDetected as any)?.bankInformation),
        urgentAction: Boolean((partial.requestsDetected as any)?.urgentAction),
        remoteAccess: Boolean((partial.requestsDetected as any)?.remoteAccess),
      },
      links: Array.isArray(partial.links)
        ? (partial.links as any[]).map((lnk) => ({
            url: lnk?.url || '',
            domain: lnk?.domain || '',
            isSuspicious: Boolean(lnk?.isSuspicious),
            suspiciousSignals: Array.isArray(lnk?.suspiciousSignals) ? lnk.suspiciousSignals : [],
            isShortener: Boolean(lnk?.isShortener),
          }))
        : [],
      recommendedActions: Array.isArray(partial.recommendedActions)
        ? partial.recommendedActions.map(String)
        : [
            'Verify any sensitive requests directly through the organization official website or mobile app.',
            'Do not share passwords, PINs, or one-time verification codes.',
            'Report the communication to your IT or security team if received on a work account.',
          ],
      avoidActions: Array.isArray(partial.avoidActions)
        ? partial.avoidActions.map(String)
        : [
            'Do not click embedded links or download attachments.',
            'Do not call back phone numbers provided directly inside the message.',
            'Do not send money or cryptocurrency to resolve an urgent deadline.',
          ],
      verificationSteps: Array.isArray(partial.verificationSteps)
        ? (partial.verificationSteps as any[]).map((v) => ({
            step: v?.step || 'Verify sender identity independently',
            channel: v?.channel || 'Official Directory',
            details: v?.details || 'Find official contact information independently.',
          }))
        : [
            {
              step: 'Check the official portal',
              channel: 'Independent Browser Search',
              details: 'Navigate to the organization known website without clicking links in the message.',
            },
          ],
      uncertainty: Array.isArray(partial.uncertainty)
        ? partial.uncertainty.map(String)
        : ['Cryptographic email headers and originating server IP cannot be verified from the provided content alone.'],
      disclaimer:
        'TrustLens provides probabilistic analysis based on observable digital signals. This is not a cybersecurity guarantee or legal counsel. Always verify through authoritative channels.',
      timestamp: new Date().toISOString(),
      metadata: {
        inputType: request.type,
        processingTimeMs: 15,
        providerName,
        modelName: `${modelName} (repaired)`,
      },
    };
  }

  /**
   * Graceful fallback when parsing completely fails
   */
  public static createGracefulFallback(
    request: AnalysisRequest,
    providerName: string,
    modelName: string,
    reason: string
  ): TrustLensAnalysis {
    return {
      overallRisk: 'unclear',
      confidence: 40,
      summary: `The system encountered difficulty during structured analysis (${reason}). Exercise heightened caution with this content until it can be independently examined.`,
      headline: 'Content Requires Manual Caution & Independent Verification',
      contentType: request.type,
      detectedEntities: ['Unverified Sender'],
      observedEvidence: [
        request.content
          ? `Text content provided (${request.content.length} characters)`
          : request.fileName
          ? `File payload: ${request.fileName}`
          : 'Content payload received for processing',
      ],
      riskSignals: [
        {
          id: 'sig_unclear_format',
          type: 'technical_anomaly',
          severity: 'medium',
          title: 'Unverifiable Structure / Ambiguous Content',
          description: 'The content could not be cleanly mapped into standard threat profiles.',
          evidence: 'Ambiguous or complex formatting',
          whyItMatters: 'Unverified requests should always be treated with conservative caution.',
          confidence: 50,
        },
      ],
      positiveSignals: [],
      unverifiedClaims: [
        'Sender identity, domain ownership, and account standing cannot be verified from ambiguous input.',
      ],
      requestsDetected: {
        payment: false,
        otp: false,
        password: false,
        personalInformation: false,
        identityDocument: false,
        bankInformation: false,
        urgentAction: false,
        remoteAccess: false,
      },
      links: [],
      recommendedActions: [
        'Do not click any embedded links or provide credentials.',
        'Navigate independently to the relevant organization official website.',
        'Inspect the sender email address or contact info carefully.',
      ],
      avoidActions: [
        'Do not respond directly to unsolicited communications.',
        'Never disclose OTP codes, passwords, or personal identity numbers.',
      ],
      verificationSteps: [
        {
          step: 'Independent Channel Verification',
          channel: 'Direct Phone / Portal',
          details: 'Use a previously saved bookmark or phone number from the back of your card or official bill.',
        },
      ],
      uncertainty: [
        'Automated AI analysis produced an ambiguous structure.',
        'Originating IP address and transmission headers could not be verified.',
      ],
      disclaimer:
        'TrustLens provides probabilistic analysis based on observable digital signals. This is not a cybersecurity or legal guarantee.',
      timestamp: new Date().toISOString(),
      metadata: {
        inputType: request.type,
        processingTimeMs: 0,
        providerName,
        modelName: `${modelName} (fallback)`,
      },
    };
  }
}
