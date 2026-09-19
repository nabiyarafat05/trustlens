'use client';

import React, { useMemo } from 'react';
import { ShieldAlert, Trash2, Eye, EyeOff } from 'lucide-react';
import { redactSensitiveData } from '@/lib/inspectors/redaction';

interface TextInputModeProps {
  text: string;
  onTextChange: (text: string) => void;
  redactPii: boolean;
  onRedactPiiChange: (enabled: boolean) => void;
}

export function TextInputMode({
  text,
  onTextChange,
  redactPii,
  onRedactPiiChange,
}: TextInputModeProps) {
  const redactionPreview = useMemo(() => {
    if (!text) return null;
    return redactSensitiveData(text);
  }, [text]);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-3">
      {/* Privacy Redaction Switch Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={redactPii}
            onChange={(e) => onRedactPiiChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 focus:ring-offset-slate-900 cursor-pointer"
          />
          <div className="flex items-center gap-1.5 text-slate-300">
            {redactPii ? (
              <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="font-medium">Redact Sensitive PII</span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              (Auto-masks phone numbers, emails, credit cards before analysis)
            </span>
          </div>
        </label>

        {redactPii && redactionPreview && redactionPreview.redactedItemsCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium">
            <ShieldAlert className="w-3 h-3 text-cyan-400" />
            {redactionPreview.redactedItemsCount} item{redactionPreview.redactedItemsCount > 1 ? 's' : ''} masked
          </span>
        )}
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`Paste suspicious text message, email body, job solicitation, or invoice here...\n\nExample:\n"WELLS FARGO ALERT: Your online access has been temporarily suspended due to 3 unauthorized login attempts. Verify immediately at: https://wellsfargo-protect.top..."`}
          rows={7}
          className="w-full p-4 rounded-2xl bg-slate-900/50 border border-slate-700/80 hover:border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none text-slate-200 placeholder-slate-500 text-sm font-sans leading-relaxed resize-y transition-all"
        />

        {text && (
          <button
            type="button"
            onClick={() => onTextChange('')}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Counter & Redaction Info Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span>{charCount} characters</span>
          <span>•</span>
          <span>{wordCount} words</span>
        </div>

        {redactPii && redactionPreview && redactionPreview.typesFound.length > 0 && (
          <div className="text-cyan-400/90 truncate max-w-xs">
            Types detected: {redactionPreview.typesFound.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
