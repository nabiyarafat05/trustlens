'use client';

import React from 'react';
import { PositiveSignal } from '@/lib/ai/types';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface PositiveSignalsCardProps {
  signals: PositiveSignal[];
}

export function PositiveSignalsCard({ signals }: PositiveSignalsCardProps) {
  if (!signals || signals.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Positive & Legitimate Indicators ({signals.length})
            </h4>
            <p className="text-xs text-slate-400">
              Elements consistent with legitimate digital communication.
            </p>
          </div>
        </div>

        <Badge variant="trust" size="sm">
          Balanced Assessment
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {signals.map((sig, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1 text-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-200">{sig.title}</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed pl-5.5">
              {sig.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
