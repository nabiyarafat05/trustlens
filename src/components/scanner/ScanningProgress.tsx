'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Cpu, FileCheck, Loader2 } from 'lucide-react';

const STEPS = [
  { label: 'Normalizing input data & formatting...', icon: Search },
  { label: 'Scanning threat signatures & domain reputation...', icon: Cpu },
  { label: 'Analyzing urgency, coercion & credential requests...', icon: ShieldCheck },
  { label: 'Synthesizing evidence-first risk evaluation...', icon: FileCheck },
];

export function ScanningProgress() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-300">
      {/* Radar scanning circle */}
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-cyan-950/40 border border-cyan-500/40 shadow-glow-cyan">
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping" />
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-semibold text-slate-100">
          Analyzing Digital Content
        </h3>
        <p className="text-xs text-slate-400">
          Evaluating contextual signals, deceptive language patterns, and destination infrastructure.
        </p>
      </div>

      {/* Steps checklist */}
      <div className="w-full max-w-sm p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-left">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 text-xs transition-opacity duration-200 ${
                isDone
                  ? 'text-emerald-400'
                  : isCurrent
                  ? 'text-cyan-300 font-medium'
                  : 'text-slate-600 opacity-60'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                  isDone
                    ? 'bg-emerald-950 border-emerald-500/50'
                    : isCurrent
                    ? 'bg-cyan-950 border-cyan-400 animate-pulse'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                {isDone ? (
                  <span className="text-[10px] font-bold">✓</span>
                ) : (
                  <Icon className="w-2.5 h-2.5" />
                )}
              </div>
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
