'use client';

import React, { useState } from 'react';
import { TrustLensAnalysis } from '@/lib/ai/types';
import { RiskOverviewBadge } from './RiskOverviewBadge';
import { DemandsMatrix } from './DemandsMatrix';
import { RiskSignalsAccordion } from './RiskSignalsAccordion';
import { PositiveSignalsCard } from './PositiveSignalsCard';
import { LinkSafetyAnalysis } from './LinkSafetyAnalysis';
import { ActionPlanSection } from './ActionPlanSection';
import { VerificationChecklist } from './VerificationChecklist';
import { UncertaintyCard } from './UncertaintyCard';
import { ExportReportModal } from './ExportReportModal';
import { Button } from '../ui/Button';
import {
  ArrowLeft,
  Download,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Cpu,
  Clock,
} from 'lucide-react';

interface AnalysisResultViewProps {
  analysis: TrustLensAnalysis;
  onReset: () => void;
  onSaveToHistory?: (analysis: TrustLensAnalysis) => void;
  isSaved?: boolean;
}

export function AnalysisResultView({
  analysis,
  onReset,
  onSaveToHistory,
  isSaved = false,
}: AnalysisResultViewProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [savedLocally, setSavedLocally] = useState(isSaved);

  const handleSave = () => {
    if (onSaveToHistory) {
      onSaveToHistory(analysis);
      setSavedLocally(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onReset}
        >
          Scan Another Item
        </Button>

        <div className="flex items-center gap-2">
          {/* Metadata pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{analysis.metadata?.providerName || 'TrustLens'}</span>
            {analysis.metadata?.processingTimeMs ? (
              <>
                <span>•</span>
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{analysis.metadata.processingTimeMs}ms</span>
              </>
            ) : null}
          </div>

          {onSaveToHistory && (
            <Button
              type="button"
              variant={savedLocally ? 'outline' : 'secondary'}
              size="sm"
              leftIcon={
                savedLocally ? (
                  <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Bookmark className="w-4 h-4 text-slate-400" />
                )
              }
              onClick={handleSave}
              disabled={savedLocally}
            >
              {savedLocally ? 'Saved to History' : 'Save Analysis'}
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => setIsExportOpen(true)}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* 1. Risk Overview & Executive Assessment */}
      <RiskOverviewBadge
        overallRisk={analysis.overallRisk}
        confidence={analysis.confidence}
        headline={analysis.headline}
        summary={analysis.summary}
        detectedEntities={analysis.detectedEntities}
      />

      {/* 2. Detected Demands & Solicitations Matrix */}
      <DemandsMatrix requests={analysis.requestsDetected} />

      {/* 3. Action Plan: WHAT TO DO vs WHAT TO AVOID */}
      <ActionPlanSection
        recommendedActions={analysis.recommendedActions}
        avoidActions={analysis.avoidActions}
      />

      {/* 4. Observable Risk Signals (Evidence-First) */}
      <RiskSignalsAccordion signals={analysis.riskSignals} />

      {/* 5. Positive / Legitimate Signals (Balanced perspective) */}
      <PositiveSignalsCard signals={analysis.positiveSignals} />

      {/* 6. Extracted Links & Destination Analysis */}
      <LinkSafetyAnalysis links={analysis.links} />

      {/* 7. Interactive Independent Verification Checklist */}
      <VerificationChecklist steps={analysis.verificationSteps} />

      {/* 8. Uncertainty Disclosure & Disclaimers */}
      <UncertaintyCard
        uncertainties={analysis.uncertainty}
        disclaimer={analysis.disclaimer}
      />

      {/* Bottom Floating Reset Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="text-sm font-semibold text-slate-200">
            Have another message or screenshot to evaluate?
          </p>
          <p className="text-xs text-slate-400">
            TrustLens is designed to be your persistent companion whenever you feel uncertain.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={onReset}
        >
          New Analysis
        </Button>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        analysis={analysis}
      />
    </div>
  );
}
