import { AnalysisRequest, TrustLensAnalysis } from './types';

export interface AIProvider {
  readonly name: string;
  readonly model: string;
  isAvailable(): boolean;
  analyze(request: AnalysisRequest): Promise<TrustLensAnalysis>;
}
