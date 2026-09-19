import { z } from 'zod';

export const RiskLevelEnum = z.enum(['low', 'medium', 'high', 'critical', 'unclear']);
export const SignalSeverityEnum = z.enum(['low', 'medium', 'high']);
export const SignalCategoryEnum = z.enum([
  'urgency',
  'credential_harvesting',
  'impersonation',
  'financial_pressure',
  'suspicious_link',
  'coercion',
  'technical_anomaly',
  'malware_lure',
  'generic',
]);

export const RiskSignalSchema = z.object({
  id: z.string().default(() => `sig_${Math.random().toString(36).substring(2, 9)}`),
  type: SignalCategoryEnum.default('generic'),
  severity: SignalSeverityEnum,
  title: z.string().min(1),
  description: z.string(),
  evidence: z.string().default('Observable message content and context'),
  whyItMatters: z.string().default('This pattern is frequently observed in deceptive manipulation attempts.'),
  confidence: z.number().min(0).max(100).default(80),
});

export const PositiveSignalSchema = z.object({
  title: z.string(),
  description: z.string(),
  importance: z.enum(['low', 'medium', 'high']).optional().default('medium'),
});

export const RequestsDetectedSchema = z.object({
  payment: z.boolean().default(false),
  otp: z.boolean().default(false),
  password: z.boolean().default(false),
  personalInformation: z.boolean().default(false),
  identityDocument: z.boolean().default(false),
  bankInformation: z.boolean().default(false),
  urgentAction: z.boolean().default(false),
  remoteAccess: z.boolean().optional().default(false),
});

export const DetectedLinkSchema = z.object({
  url: z.string(),
  domain: z.string().default(''),
  isSuspicious: z.boolean().default(false),
  suspiciousSignals: z.array(z.string()).default([]),
  isShortener: z.boolean().optional().default(false),
});

export const VerificationStepSchema = z.object({
  step: z.string(),
  channel: z.string().default('Official Portal'),
  details: z.string().default(''),
});

export const TrustLensAnalysisSchema = z.object({
  overallRisk: RiskLevelEnum,
  confidence: z.number().min(0).max(100).default(75),
  summary: z.string(),
  headline: z.string().default('Analysis complete'),
  contentType: z.enum(['image', 'text', 'url', 'document']).default('text'),
  detectedEntities: z.array(z.string()).default([]),
  observedEvidence: z.array(z.string()).default([]),
  riskSignals: z.array(RiskSignalSchema).default([]),
  positiveSignals: z.array(PositiveSignalSchema).default([]),
  unverifiedClaims: z.array(z.string()).default([]),
  requestsDetected: RequestsDetectedSchema.default({
    payment: false,
    otp: false,
    password: false,
    personalInformation: false,
    identityDocument: false,
    bankInformation: false,
    urgentAction: false,
    remoteAccess: false,
  }),
  links: z.array(DetectedLinkSchema).default([]),
  recommendedActions: z.array(z.string()).default([]),
  avoidActions: z.array(z.string()).default([]),
  verificationSteps: z.array(VerificationStepSchema).default([]),
  uncertainty: z.array(z.string()).default([]),
  disclaimer: z.string().default(
    'TrustLens provides probabilistic analysis based on observable digital signals. This is not a cybersecurity or legal guarantee. Always verify requests through official, independently obtained channels.'
  ),
  timestamp: z.string().default(() => new Date().toISOString()),
  metadata: z
    .object({
      inputType: z.string().default('unknown'),
      processingTimeMs: z.number().default(0),
      providerName: z.string().default('TrustLens Engine'),
      modelName: z.string().default('default'),
      analysisMode: z.enum(['multimodal_ai', 'heuristic_engine', 'ai_heuristic_fusion']).optional(),
      heuristicsApplied: z.array(z.string()).optional(),
      heuristicDisagreement: z.boolean().optional(),
      disagreementNotes: z.array(z.string()).optional(),
    })
    .optional(),
});

export type ValidatedTrustLensAnalysis = z.infer<typeof TrustLensAnalysisSchema>;
