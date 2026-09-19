'use client';

import React, { useMemo } from 'react';
import { Globe, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { inspectUrl } from '@/lib/inspectors/urlInspector';

interface UrlInputModeProps {
  url: string;
  onUrlChange: (url: string) => void;
}

export function UrlInputMode({ url, onUrlChange }: UrlInputModeProps) {
  const inspection = useMemo(() => {
    if (!url || url.trim().length < 3) return null;
    return inspectUrl(url);
  }, [url]);

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-500 pointer-events-none">
          <Globe className="w-5 h-5 text-cyan-400" />
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Enter website link (e.g., https://wellsfargo-protect.top/login or suspicious.com)"
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-900/50 border border-slate-700/80 hover:border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none text-slate-200 placeholder-slate-500 text-sm font-mono transition-all"
        />

        {url && (
          <button
            type="button"
            onClick={() => onUrlChange('')}
            className="absolute right-3 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Clear URL"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Real-time Domain Inspection Chip */}
      {inspection && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Target Hostname:</span>
              <span className="font-mono font-medium text-slate-200 bg-slate-800 px-2 py-0.5 rounded-md">
                {inspection.domain}
              </span>
            </div>

            {inspection.isSuspicious ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                Structural Flags Detected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Standard Domain Format
              </span>
            )}
          </div>

          {inspection.suspiciousSignals.length > 0 ? (
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 font-medium">Quick Pre-Scan Indicators:</p>
              <ul className="space-y-1">
                {inspection.suspiciousSignals.map((signal, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs text-amber-300/90">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
              URL syntax appears syntactically structured. Click &ldquo;Analyze Safely&rdquo; for full AI safety inspection.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
