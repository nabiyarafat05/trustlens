'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface ActionPlanSectionProps {
  recommendedActions: string[];
  avoidActions: string[];
}

export function ActionPlanSection({
  recommendedActions,
  avoidActions,
}: ActionPlanSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* WHAT SHOULD I DO? */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-emerald-300">
              WHAT SHOULD I DO?
            </h4>
            <p className="text-xs text-slate-400">
              Safe defensive steps to take right now
            </p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {recommendedActions.map((action, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-200"
            >
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
              <span className="leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* WHAT SHOULD I AVOID? */}
      <div className="glass-panel rounded-3xl p-6 border border-red-500/30 bg-gradient-to-b from-red-950/20 to-slate-900/60 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-950 text-red-400 border border-red-500/40">
            <X className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-red-300">
              WHAT SHOULD I AVOID?
            </h4>
            <p className="text-xs text-slate-400">
              Actions that create acute exposure or financial risk
            </p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {avoidActions.map((action, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-slate-200"
            >
              <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
              <span className="leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
