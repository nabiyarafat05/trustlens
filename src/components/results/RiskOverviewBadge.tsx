'use client';

import React from 'react';
import { RiskLevel } from '@/lib/ai/types';
import { ShieldAlert, AlertTriangle, CheckCircle2, HelpCircle, Flame } from 'lucide-react';

interface RiskOverviewBadgeProps {
  overallRisk: RiskLevel;
  confidence: number;
  headline: string;
  summary: string;
  detectedEntities: string[];
}

export function RiskOverviewBadge({
  overallRisk,
  confidence,
  headline,
  summary,
  detectedEntities,
}: RiskOverviewBadgeProps) {
  const config = {
    critical: {
      label: 'CRITICAL ATTENTION',
      tagline: 'Acute Deception Markers Present',
      colorBg: 'from-red-950/90 to-rose-950/60 border-red-500/50 shadow-glow-alert',
      textColor: 'text-red-300',
      badgeBg: 'bg-red-900/60 text-red-200 border-red-500/60',
      icon: <Flame className="w-6 h-6 text-red-400 shrink-0" />,
    },
    high: {
      label: 'HIGH ATTENTION',
      tagline: 'Several Signals Require Independent Verification',
      colorBg: 'from-orange-950/90 to-amber-950/60 border-orange-500/50 shadow-glow-alert',
      textColor: 'text-orange-300',
      badgeBg: 'bg-orange-900/60 text-orange-200 border-orange-500/60',
      icon: <ShieldAlert className="w-6 h-6 text-orange-400 shrink-0" />,
    },
    medium: {
      label: 'MODERATE CAUTION',
      tagline: 'Anomalies Detected — Proceed Carefully',
      colorBg: 'from-amber-950/90 to-yellow-950/60 border-amber-500/50',
      textColor: 'text-amber-300',
      badgeBg: 'bg-amber-900/60 text-amber-200 border-amber-500/60',
      icon: <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />,
    },
    low: {
      label: 'LOW OBSERVED RISK',
      tagline: 'Standard Communication Patterns Observed',
      colorBg: 'from-emerald-950/90 to-teal-950/60 border-emerald-500/50 shadow-glow-trust',
      textColor: 'text-emerald-300',
      badgeBg: 'bg-emerald-900/60 text-emerald-200 border-emerald-500/60',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />,
    },
    unclear: {
      label: 'UNCLEAR / INSUFFICIENT DATA',
      tagline: 'Ambiguous Content Requires Manual Verification',
      colorBg: 'from-slate-900/90 to-slate-800/60 border-slate-700',
      textColor: 'text-slate-300',
      badgeBg: 'bg-slate-800 text-slate-300 border-slate-700',
      icon: <HelpCircle className="w-6 h-6 text-slate-400 shrink-0" />,
    },
  }[overallRisk];

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-br ${config.colorBg} border transition-all duration-200`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${config.badgeBg}`}
              >
                {config.label}
              </span>
              <span className="text-xs text-slate-400">
                Confidence: <strong className="text-slate-200">{confidence}%</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1">
              {config.tagline}
            </p>
          </div>
        </div>

        {/* Claimed / Detected Entity tags */}
        {detectedEntities && detectedEntities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[11px] text-slate-400">Claimed Sender:</span>
            {detectedEntities.map((entity, i) => (
              <span
                key={i}
                className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/10 text-slate-200"
              >
                {entity}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Headline & Summary */}
      <div className="mt-4 space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {headline}
        </h3>
        <p className="text-sm text-slate-200/90 leading-relaxed max-w-4xl">
          {summary}
        </p>
      </div>
    </div>
  );
}
