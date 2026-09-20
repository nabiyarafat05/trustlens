'use client';

import React, { useState, useEffect } from 'react';
import { X, Cpu, Key, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [providerInfo, setProviderInfo] = useState<{
    name: string;
    model: string;
    isFallback: boolean;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/analyze')
        .then((res) => res.json())
        .then((data) => {
          if (data.provider) setProviderInfo(data.provider);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-6 bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-lg">Engine & Environment Status</h3>
              <p className="text-xs text-slate-400">TrustLens AI Provider Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-5 space-y-5 text-sm text-slate-300">
          {/* Active Engine Card */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Active Analysis Provider
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Operational
              </span>
            </div>

            <div>
              <p className="font-semibold text-slate-100 text-base">
                {providerInfo ? providerInfo.name : 'TrustLens Engine'}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Model: {providerInfo ? providerInfo.model : 'adaptive'}
              </p>
            </div>

            {providerInfo?.isFallback && (
              <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
                <p className="font-medium text-cyan-300">Built-in Threat & Heuristic Engine Active</p>
                <p className="text-[11px] text-cyan-400/90 mt-0.5">
                  Analyzing via pre-trained risk signatures, URL heuristics, and threat rules without requiring external API tokens.
                </p>
              </div>
            )}
          </div>

          {/* Configuration Guide */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Connecting Live Multimodal AI Keys</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To enable cloud multimodal models (Google Gemini or OpenAI Vision), add either of these variables in your local <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">.env.local</code> file:
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-1 break-all">
              <p className="text-slate-500"># Google Gemini (Multimodal Vision)</p>
              <p className="text-emerald-400">GEMINI_API_KEY=&quot;your-api-key-here&quot;</p>
              <p className="text-slate-500 mt-2"># Or OpenAI / OpenAI-Compatible (Ollama, Groq, etc.)</p>
              <p className="text-cyan-400">OPENAI_API_KEY=&quot;your-api-key-here&quot;</p>
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-medium text-slate-200">Privacy & Security Design</p>
              <p className="text-slate-400 leading-relaxed">
                All AI calls happen server-side. Your API keys and raw inputs are never exposed in browser network bundles. An optional client-side PII scrubber is available before scanning.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
