'use client';

import React from 'react';
import { HelpCircle, Shield } from 'lucide-react';

interface UncertaintyCardProps {
  uncertainties: string[];
  disclaimer: string;
}

export function UncertaintyCard({
  uncertainties,
  disclaimer,
}: UncertaintyCardProps) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 text-xs">
      <div className="flex items-center gap-2 text-slate-300">
        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <h4 className="font-semibold text-slate-200">
          Unverified Elements & Analytical Boundaries
        </h4>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
        <p className="text-slate-400 font-medium">
          What could NOT be established from this content:
        </p>
        <ul className="space-y-1.5 pl-1">
          {uncertainties && uncertainties.length > 0 ? (
            uncertainties.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-500 font-mono">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))
          ) : (
            <li className="text-slate-400">
              Underlying network hop headers and originating carrier routing cannot be determined.
            </li>
          )}
        </ul>
      </div>

      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400">
        <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Analytical Disclaimer: </strong>
          {disclaimer ||
            'TrustLens provides probabilistic analysis based on observable digital signals. This is not a cybersecurity or legal guarantee. Always verify through authoritative, independently obtained channels.'}
        </p>
      </div>
    </div>
  );
}
