'use client';

import React, { useState } from 'react';
import { VerificationStep } from '@/lib/ai/types';
import { CheckSquare, Square, Compass } from 'lucide-react';

interface VerificationChecklistProps {
  steps: VerificationStep[];
}

export function VerificationChecklist({ steps }: VerificationChecklistProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (!steps || steps.length === 0) return null;

  const progressPercent = Math.round((completedSteps.size / steps.length) * 100);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Interactive Independent Verification Checklist
            </h4>
            <p className="text-xs text-slate-400">
              Mark off verification checkpoints as you perform them safely.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono text-cyan-300">
            {completedSteps.size} of {steps.length} verified ({progressPercent}%)
          </span>
          <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const isDone = completedSteps.has(idx);

          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`p-3.5 rounded-xl border transition-all duration-150 flex items-start gap-3 cursor-pointer select-none ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                  : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800 text-slate-200'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-cyan-400 shrink-0 focus:outline-none"
              >
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                )}
              </button>

              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs font-semibold ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}
                  >
                    {step.step}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700">
                    Channel: {step.channel}
                  </span>
                </div>
                {step.details && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
