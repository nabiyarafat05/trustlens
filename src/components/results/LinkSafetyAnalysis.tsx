'use client';

import React from 'react';
import { DetectedLink } from '@/lib/ai/types';
import { Link2, CheckCircle, ShieldAlert } from 'lucide-react';

interface LinkSafetyAnalysisProps {
  links: DetectedLink[];
}

export function LinkSafetyAnalysis({ links }: LinkSafetyAnalysisProps) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-slate-200">
          Extracted Links & Destination Analysis ({links.length})
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">
          Destination domains inspected for typosquatting, suspicious TLDs, and redirection patterns.
        </p>
      </div>

      <div className="space-y-2.5">
        {links.map((link, idx) => {
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                link.isSuspicious
                  ? 'bg-red-950/20 border-red-500/30'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Link2
                    className={`w-4 h-4 shrink-0 ${
                      link.isSuspicious ? 'text-red-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="font-mono text-xs text-slate-200 truncate">
                    {link.url}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Host: {link.domain || 'unresolved'}
                  </span>

                  {link.isSuspicious ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40">
                      <ShieldAlert className="w-3 h-3 text-red-400" />
                      Suspicious
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      Standard Domain
                    </span>
                  )}
                </div>
              </div>

              {link.suspiciousSignals && link.suspiciousSignals.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <p className="text-[11px] font-medium text-red-300">Detected Link Signals:</p>
                  <ul className="space-y-1 pl-1">
                    {link.suspiciousSignals.map((signal, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                        <span className="text-red-400">•</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
