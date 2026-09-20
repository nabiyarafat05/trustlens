import { AIProvider } from '../AIProvider';
import { AnalysisRequest, TrustLensAnalysis, RiskSignal, PositiveSignal, DetectedLink, SignalCategory } from '../types';
import { inspectUrl } from '../../inspectors/urlInspector';
import { SAMPLE_SCENARIOS } from '../../presets/sampleScenarios';

export class HeuristicFallbackProvider implements AIProvider {
  readonly name = 'TrustLens Heuristic Engine';
  readonly model = 'rule-based-v1.0';

  isAvailable(): boolean {
    return true; // Always available offline or as fallback
  }

  async analyze(request: AnalysisRequest): Promise<TrustLensAnalysis> {
    const startTime = Date.now();
    const content = (request.content || '').trim();

    if (request.type === 'image' && !content) {
      return {
        overallRisk: 'unclear',
        confidence: 35,
        headline: 'Image Requires Visual Verification',
        summary: 'No readable text was extracted from this image, so the heuristic engine cannot assess its visual or contextual risk signals.',
        contentType: 'image',
        detectedEntities: ['Unverified Sender'],
        observedEvidence: ['Image received without readable text for heuristic inspection.'],
        riskSignals: [],
        positiveSignals: [],
        unverifiedClaims: ['The image contents, sender identity, and any embedded destination cannot be verified by the offline heuristic engine.'],
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
          'Verify any request through the organization official website or app opened independently.',
          'Do not provide credentials, payment details, PINs, or one-time codes based on the image alone.',
        ],
        avoidActions: [
          'Do not click links or call phone numbers shown in the image until independently verified.',
        ],
        verificationSteps: [
          {
            step: 'Use an independent official channel',
            channel: 'Official Website or App',
            details: 'Check for the same alert after navigating independently to the claimed organization.',
          },
        ],
        uncertainty: [
          'The offline heuristic engine cannot determine visual content without readable extracted text.',
        ],
        disclaimer: 'TrustLens provides probabilistic analysis based on observable digital signals. This image could not be fully inspected without readable text or a configured vision AI provider.',
        timestamp: new Date().toISOString(),
        metadata: {
          inputType: request.type,
          processingTimeMs: Date.now() - startTime,
          providerName: this.name,
          modelName: this.model,
          heuristicsApplied: ['Image Text Extraction Unavailable'],
        },
      };
    }

    // 1. Check if the content matches one of our curated sample scenarios exactly
    const matchedPreset = SAMPLE_SCENARIOS.find((s) => {
      return (
        s.targetContent.trim() === content ||
        (s.inputType === 'url' && s.targetContent.toLowerCase() === content.toLowerCase())
      );
    });

    if (matchedPreset) {
      return {
        ...matchedPreset.precomputedAnalysis,
        metadata: {
          inputType: request.type,
          processingTimeMs: Date.now() - startTime,
          providerName: this.name,
          modelName: `${this.model} (preset-matched)`,
          heuristicsApplied: ['Preset Pattern Library Match', 'Exact Signature Verification'],
        },
      };
    }

    // 2. Perform comprehensive dynamic heuristic inspection
    const lower = content.toLowerCase();
    const riskSignals: RiskSignal[] = [];
    const positiveSignals: PositiveSignal[] = [];
    const appliedHeuristics: string[] = [];

    // Link detection & inspection
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const rawUrls: string[] = Array.from(content.match(urlRegex) || []);
    if (request.type === 'url' && !rawUrls.includes(content)) {
      rawUrls.push(content);
    }

    const detectedLinks: DetectedLink[] = [];
    for (const rawUrl of Array.from(new Set(rawUrls))) {
      const inspection = inspectUrl(rawUrl);
      detectedLinks.push({
        url: inspection.url,
        domain: inspection.domain,
        isSuspicious: inspection.isSuspicious,
        suspiciousSignals: inspection.suspiciousSignals,
        isShortener: inspection.isShortener,
      });

      if (inspection.isSuspicious) {
        riskSignals.push({
          id: `sig_url_${Math.random().toString(36).substring(2, 7)}`,
          type: 'suspicious_link',
          severity: inspection.riskScore > 60 ? 'high' : 'medium',
          title: `Suspicious Destination Domain (${inspection.domain})`,
          description: inspection.suspiciousSignals.join('; ') || 'Domain exhibits characteristics common in phishing schemes.',
          evidence: inspection.url,
          whyItMatters: 'Malicious links redirect targets to counterfeit forms designed to harvest credentials or install malware.',
          confidence: Math.min(95, 60 + inspection.riskScore / 3),
        });
        appliedHeuristics.push('URL Structural Risk Analysis');
      }
    }

    // A. Urgency / Coercion Detection
    const urgencyPatterns = [
      { pattern: /within\s+(?:24\s*hours?|30\s*minutes?|immediate(?:ly)?|today)/i, label: 'Tight Time Pressure' },
      { pattern: /account(?:\s+will\s+be)?\s+(?:suspended|locked|terminated|blocked|closed)/i, label: 'Account Suspension Threat' },
      { pattern: /urgent\s*action\s*required|act\s*now|immediate\s*attention/i, label: 'Urgent Action Directive' },
      { pattern: /unauthorized\s+transaction|fraud\s+detected|security\s+breach/i, label: 'Alledged Security Threat' },
    ];

    let hasUrgency = false;
    for (const { pattern, label } of urgencyPatterns) {
      const match = content.match(pattern);
      if (match) {
        hasUrgency = true;
        riskSignals.push({
          id: `sig_urgency_${Math.random().toString(36).substring(2, 7)}`,
          type: 'urgency',
          severity: 'high',
          title: `Artificial Urgency: ${label}`,
          description: `The communication applies psychological pressure using terms like "${match[0]}".`,
          evidence: match[0],
          whyItMatters: 'Artificial urgency discourages critical verification and pressures victims into hasty mistakes.',
          confidence: 90,
        });
        appliedHeuristics.push('Urgency Keyword Heuristic');
        break;
      }
    }

    // B. Credential / Sensitive Information Harvest
    const credentialPatterns = [
      { pattern: /enter\s+(?:your\s+)?(?:password|passcode|pin|security\s*questions?)/i, title: 'Password/PIN Solicitation', type: 'credential_harvesting' as SignalCategory },
      { pattern: /(?:one-time|otp|verification)\s*(?:code|pin)/i, title: 'One-Time Verification Code (OTP) Solicitation', type: 'credential_harvesting' as SignalCategory },
      { pattern: /social\s*security(?:\s*number)?|\bssn\b/i, title: 'Government ID / SSN Solicitation', type: 'credential_harvesting' as SignalCategory },
      { pattern: /card\s*number|cvv|expiry\s*date|security\s*code\s*on\s*back/i, title: 'Payment Card Details Requested', type: 'financial_pressure' as SignalCategory },
    ];

    let hasOtp = false;
    let hasPassword = false;
    let hasSsn = false;
    let hasCard = false;

    for (const item of credentialPatterns) {
      const match = content.match(item.pattern);
      if (match) {
        if (item.title.includes('OTP')) hasOtp = true;
        if (item.title.includes('Password')) hasPassword = true;
        if (item.title.includes('SSN')) hasSsn = true;
        if (item.title.includes('Card')) hasCard = true;

        riskSignals.push({
          id: `sig_cred_${Math.random().toString(36).substring(2, 7)}`,
          type: item.type,
          severity: 'high',
          title: item.title,
          description: `The content seeks sensitive authentication credentials ("${match[0]}").`,
          evidence: match[0],
          whyItMatters: 'Legitimate service providers will never ask for your password or full card security code via unsolicited messages.',
          confidence: 94,
        });
        appliedHeuristics.push('Credential Harvest Classifier');
      }
    }

    // C. Financial demands & crypto
    const financialPatterns = [
      { pattern: /\b(?:crypto|bitcoin|btc|usdt|ethereum|gift\s*card|wire\s*transfer|cash\s*app|zelle|venmo)\b/i, title: 'Unconventional or Irreversible Payment Method' },
      { pattern: /\b(?:deposit|collateral|advance\s*fee|activation\s*fee|clearance\s*charge)\b/i, title: 'Upfront Fee Demand' },
      { pattern: /\$\s*[\d,]+(?:\.\d{2})?/i, title: 'High-Value Financial Transaction Mention' },
    ];

    let hasPayment = hasCard;
    for (const item of financialPatterns) {
      const match = content.match(item.pattern);
      if (match) {
        hasPayment = true;
        riskSignals.push({
          id: `sig_fin_${Math.random().toString(36).substring(2, 7)}`,
          type: 'financial_pressure',
          severity: item.title.includes('Irreversible') ? 'high' : 'medium',
          title: item.title,
          description: `Direct reference to payment or money transfer: "${match[0]}".`,
          evidence: match[0],
          whyItMatters: 'Scammers frequently request payment methods that cannot be reversed or traced once sent.',
          confidence: 86,
        });
        appliedHeuristics.push('Financial Pattern Heuristic');
        break;
      }
    }

    // D. Remote access request
    const remotePatterns = /\b(?:anydesk|teamviewer|ultraviewer|remote\s*access|screen\s*share|zoho\s*assist)\b/i;
    const remoteMatch = content.match(remotePatterns);
    const hasRemote = Boolean(remoteMatch);
    if (remoteMatch) {
      riskSignals.push({
        id: `sig_remote_${Math.random().toString(36).substring(2, 7)}`,
        type: 'technical_anomaly',
        severity: 'high',
        title: 'Remote Access Software Solicitation',
        description: `Mention of remote access utility "${remoteMatch[0]}".`,
        evidence: remoteMatch[0],
        whyItMatters: 'Attackers use remote access tools to take control of victim computers to manipulate bank accounts and transfer funds.',
        confidence: 95,
      });
      appliedHeuristics.push('Remote Access Threat Classifier');
    }

    // E. Impersonation / Entity Extraction
    const brandKeywords = [
      'paypal', 'wells fargo', 'chase', 'bank of america', 'citi', 'usps', 'fedex',
      'ups', 'dhl', 'irs', 'geek squad', 'apple', 'microsoft', 'amazon', 'netflix',
      'google', 'binance', 'coinbase', 'whatsapp', 'telegram'
    ];

    const detectedEntities: string[] = [];
    for (const brand of brandKeywords) {
      if (lower.includes(brand)) {
        detectedEntities.push(brand.toUpperCase());
      }
    }
    if (detectedEntities.length === 0) {
      detectedEntities.push('Unspecified Sender');
    }

    // F. Positive Signals (Balance check)
    if (!hasUrgency && !lower.includes('immediately') && !lower.includes('locked')) {
      positiveSignals.push({
        title: 'Calm & Non-Coercive Language',
        description: 'Does not employ aggressive deadlines, threats of arrest, or immediate account closure.',
        importance: 'medium',
      });
    }

    if (!hasPassword && !hasOtp && !hasSsn) {
      positiveSignals.push({
        title: 'No Direct Credential Solicitation',
        description: 'Does not explicitly ask for account passwords, PINs, or one-time verification tokens.',
        importance: 'medium',
      });
    }

    if (detectedLinks.length > 0 && detectedLinks.every((l) => !l.isSuspicious)) {
      positiveSignals.push({
        title: 'Standard Reputable Domains',
        description: 'All extracted links point to recognized and well-established domains.',
        importance: 'high',
      });
    }

    // Determine Overall Risk Level
    const highSignals = riskSignals.filter((s) => s.severity === 'high');
    const mediumSignals = riskSignals.filter((s) => s.severity === 'medium');

    let overallRisk: 'low' | 'medium' | 'high' | 'critical' | 'unclear' = 'low';
    let headline = 'No Critical Threats Detected';
    let summary = 'The scanned content does not exhibit acute threat indicators. Always maintain standard digital awareness.';

    if (highSignals.length >= 2 || (hasRemote && hasUrgency)) {
      overallRisk = 'critical';
      headline = 'Critical Threat Profile: Multiple Severe Deception Markers';
      summary = 'The message contains multiple overlapping social engineering signals, including urgency, credential solicitation, or unverified external links.';
    } else if (highSignals.length === 1 || mediumSignals.length >= 2) {
      overallRisk = 'high';
      headline = 'High Attention: Significant Suspicious Signals Requiring Caution';
      summary = 'Several observable indicators deviate from normal corporate practices. Independent verification is strongly advised before engaging.';
    } else if (mediumSignals.length === 1 || riskSignals.length > 0) {
      overallRisk = 'medium';
      headline = 'Moderate Caution: Mild Anomalies or Unverified Claims';
      summary = 'The communication warrants careful inspection. Take safe precautions and do not follow unprompted instructions.';
    }

    if (riskSignals.length === 0 && detectedEntities.length === 1 && detectedEntities[0] === 'Unspecified Sender' && content.length < 100) {
      overallRisk = 'unclear';
      headline = 'Insufficient Context for a Risk Judgment';
      summary = 'The content contains too little attributable context to distinguish a routine notice from a deceptive request. Verify the sender and purpose independently.';
    }

    // Generate Safe Actions
    const recommendedActions = [
      'Independently visit the official company website or app without clicking links in the message.',
      'If this claims to be from your bank, call the customer service number on the back of your physical card.',
      'Check your account notification center or statements directly.',
    ];
    if (hasUrgency) {
      recommendedActions.push('Pause and do not let artificial deadlines force immediate compliance.');
    }

    const avoidActions = [
      'Do not click embedded links, open attachments, or download suggested software.',
      'Never disclose passwords, two-factor SMS codes, or PINs to anyone.',
      'Do not call phone numbers provided directly within this communication.',
    ];
    if (hasRemote) {
      avoidActions.push('Do NOT install remote desktop utilities (AnyDesk, TeamViewer, QuickAssist).');
    }

    return {
      overallRisk,
      confidence: riskSignals.length > 0 ? 88 : 75,
      headline,
      summary,
      contentType: request.type,
      detectedEntities,
      riskSignals,
      positiveSignals,
      requestsDetected: {
        payment: hasPayment,
        otp: hasOtp,
        password: hasPassword,
        personalInformation: hasSsn || lower.includes('personal') || lower.includes('address'),
        identityDocument: hasSsn || lower.includes('passport') || lower.includes('driver license'),
        bankInformation: hasCard || lower.includes('bank account') || lower.includes('routing'),
        urgentAction: hasUrgency,
        remoteAccess: hasRemote,
      },
      links: detectedLinks,
      recommendedActions,
      avoidActions,
      verificationSteps: [
        {
          step: 'Search Official Directory',
          channel: 'Independent Browser Search',
          details: 'Search for the official homepage and contact information directly in your web browser.',
        },
        {
          step: 'Confirm Account Standing',
          channel: 'Authenticated Mobile App',
          details: 'Log into the official mobile app to see if any genuine security alerts appear in your inbox.',
        },
      ],
      uncertainty: [
        'Transmission headers, mail routing records, and origin IP cannot be established from plain content.',
        'Whether you maintain an authentic relationship with the claimed brand is unknown to TrustLens.',
      ],
      disclaimer:
        'TrustLens provides probabilistic analysis based on observable digital signals. This is not a cybersecurity or legal guarantee. Always verify through authoritative channels.',
      timestamp: new Date().toISOString(),
      metadata: {
        inputType: request.type,
        processingTimeMs: Date.now() - startTime,
        providerName: this.name,
        modelName: this.model,
        heuristicsApplied: appliedHeuristics,
      },
    };
  }
}
