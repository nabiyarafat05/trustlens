import { AIProvider } from './AIProvider';
import { AnalysisRequest, TrustLensAnalysis } from './types';
import { GeminiProvider } from './providers/GeminiProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { HeuristicFallbackProvider } from './providers/HeuristicFallbackProvider';
import { redactSensitiveData } from '../inspectors/redaction';

export class AIAnalysisService {
  private primaryProvider: AIProvider;
  private fallbackProvider: HeuristicFallbackProvider;

  constructor() {
    this.fallbackProvider = new HeuristicFallbackProvider();

    // Priority 1: Gemini if key available
    const gemini = new GeminiProvider();
    if (gemini.isAvailable()) {
      this.primaryProvider = gemini;
      return;
    }

    // Priority 2: OpenAI if key available
    const openAI = new OpenAIProvider();
    if (openAI.isAvailable()) {
      this.primaryProvider = openAI;
      return;
    }

    // Priority 3: Built-in Heuristic & Threat Intelligence Fallback
    this.primaryProvider = this.fallbackProvider;
  }

  public getActiveProviderInfo(): { name: string; model: string; isFallback: boolean } {
    return {
      name: this.primaryProvider.name,
      model: this.primaryProvider.model,
      isFallback: this.primaryProvider === this.fallbackProvider,
    };
  }

  public async analyze(request: AnalysisRequest): Promise<TrustLensAnalysis> {
    const startTime = Date.now();

    // 1. Optional PII sanitization / redaction
    let processedContent = request.content || '';
    if (request.redactPii && processedContent) {
      const redacted = redactSensitiveData(processedContent);
      processedContent = redacted.redactedText;
    }

    const sanitizedRequest: AnalysisRequest = {
      ...request,
      content: processedContent,
    };

    // 2. Attempt primary AI provider
    try {
      if (this.primaryProvider.isAvailable()) {
        const result = await this.primaryProvider.analyze(sanitizedRequest);
        return {
          ...result,
          metadata: {
            ...result.metadata,
            inputType: request.type,
            processingTimeMs: Date.now() - startTime,
            providerName: this.primaryProvider.name,
            modelName: this.primaryProvider.model,
          },
        };
      }
    } catch (primaryErr) {
      console.warn(
        `[AIAnalysisService] Primary provider (${this.primaryProvider.name}) failed or rate-limited:`,
        primaryErr
      );
      // Seamlessly fall through to heuristic engine
    }

    // 3. Resilient fallback execution
    const fallbackResult = await this.fallbackProvider.analyze(sanitizedRequest);
    return {
      ...fallbackResult,
      metadata: {
        ...fallbackResult.metadata,
        inputType: request.type,
        processingTimeMs: Date.now() - startTime,
        providerName: `${this.fallbackProvider.name} (Active Fallback)`,
        modelName: this.fallbackProvider.model,
      },
    };
  }
}

// Singleton instance
export const aiAnalysisService = new AIAnalysisService();
