export type RiskLevel = 'low' | 'medium' | 'high' | 'critical' | 'unclear';

export type SignalSeverity = 'low' | 'medium' | 'high';

export type SignalCategory =
  | 'urgency'
  | 'credential_harvesting'
  | 'impersonation'
  | 'financial_pressure'
  | 'suspicious_link'
  | 'coercion'
  | 'technical_anomaly'
  | 'malware_lure'
  | 'generic';

export interface RiskSignal {
  id: string;
  type: SignalCategory;
  severity: SignalSeverity;
  title: string;
  description: string;
  evidence: string;
  whyItMatters: string;
  confidence: number; // 0-100
}

export interface PositiveSignal {
  title: string;
  description: string;
  importance?: 'low' | 'medium' | 'high';
}

export interface RequestsDetected {
  payment: boolean;
  otp: boolean;
  password: boolean;
  personalInformation: boolean;
  identityDocument: boolean;
  bankInformation: boolean;
  urgentAction: boolean;
  remoteAccess?: boolean;
}

export interface DetectedLink {
  url: string;
  domain: string;
  isSuspicious: boolean;
  suspiciousSignals: string[];
  isShortener?: boolean;
}

export interface VerificationStep {
  step: string;
  channel: string;
  details: string;
}

export interface TrustLensAnalysis {
  overallRisk: RiskLevel;
  confidence: number; // 0-100
  summary: string;
  headline: string;
  contentType: 'image' | 'text' | 'url' | 'document';
  detectedEntities: string[];
  observedEvidence: string[]; // Facts directly visible or extractable from input
  riskSignals: RiskSignal[];
  positiveSignals: PositiveSignal[];
  unverifiedClaims: string[]; // Things that cannot be verified from the supplied input
  requestsDetected: RequestsDetected;
  links: DetectedLink[];
  recommendedActions: string[];
  avoidActions: string[];
  verificationSteps: VerificationStep[];
  uncertainty: string[];
  disclaimer: string;
  timestamp: string;
  metadata?: {
    inputType: string;
    processingTimeMs: number;
    providerName: string;
    modelName: string;
    analysisMode?: 'multimodal_ai' | 'heuristic_engine' | 'ai_heuristic_fusion';
    heuristicsApplied?: string[];
    heuristicDisagreement?: boolean;
    disagreementNotes?: string[];
  };
}

export interface AnalysisRequest {
  type: 'image' | 'text' | 'url' | 'document';
  content?: string; // Text content or URL
  fileData?: string; // Base64 string if file/image
  mimeType?: string;
  fileName?: string;
  userNotes?: string;
  redactPii?: boolean;
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: TrustLensAnalysis;
  error?: string;
}
