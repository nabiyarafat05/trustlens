'use client';

import React, { useState } from 'react';
import { RiskSignal } from '@/lib/ai/types';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  HelpCircle,
  Clock,
  KeyRound,
  UserX,
  CreditCard,
  Link2,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface RiskSignalsAccordionProps {
  signals: RiskSignal[];
}

export function RiskSignalsAccordion({ signals }: RiskSignalsAccordionProps) {
  // Open all high severity signals by default
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(signals.map((s) => s.id))
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'urgency':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'credential_harvesting':
        return <KeyRound className="w-4 h-4 text-red-400" />;
      case 'impersonation':
        return <UserX className="w-4 h-4 text-orange-400" />;
      case 'financial_pressure':
        return <CreditCard className="w-4 h-4 text-rose-400" />;
      case 'suspicious_link':
        return <Link2 className="w-4 h-4 text-purple-400" />;
      case 'coercion':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'technical_anomaly':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  if (!signals || signals.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-200">
            Observable Risk Signals ({signals.length})
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any signal to review observable evidence and threat rationale.
          </p>
        </div>

        <button
          onClick={() => {
            if (expandedIds.size === signals.length) {
              setExpandedIds(new Set());
            } else {
              setExpandedIds(new Set(signals.map((s) => s.id)));
            }
          }}
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          {expandedIds.size === signals.length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="space-y-3">
        {signals.map((signal) => {
          const isExpanded = expandedIds.has(signal.id);
          const isHigh = signal.severity === 'high';
          const isMedium = signal.severity === 'medium';

          return (
            <div
              key={signal.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isHigh
                  ? 'bg-slate-900/80 border-red-500/30'
                  : isMedium
                  ? 'bg-slate-900/80 border-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Header Bar */}
              <button
                type="button"
                onClick={() => toggleExpand(signal.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isHigh
                        ? 'bg-red-950/80 text-red-400 border border-red-500/30'
                        : isMedium
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {getCategoryIcon(signal.type)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isHigh ? 'alert' : isMedium ? 'caution' : 'default'}
                        size="sm"
                      >
                        {signal.severity.toUpperCase()}
                      </Badge>
                      <h5 className="text-sm font-semibold text-slate-100 break-words line-clamp-2">
                        {signal.title}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-400 break-words line-clamp-2 mt-0.5">
                      {signal.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                    {signal.confidence}% confidence
                  </span>
                  <div className="p-1 rounded-lg text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expandable Body */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 bg-black/20 text-xs">
                  {/* Evidence Snippet */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Observable Evidence
                    </span>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-amber-200/90 leading-relaxed break-all">
                      {signal.evidence}
                    </div>
                  </div>

                  {/* Why it Matters / Threat Rationale */}
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-xs">
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Why this pattern matters</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {signal.whyItMatters}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
