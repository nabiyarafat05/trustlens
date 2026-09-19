'use client';

import React, { useState, useMemo } from 'react';
import { TrustLensAnalysis, RiskLevel } from '@/lib/ai/types';
import {
  History,
  Search,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ScanHistoryDrawerProps {
  history: TrustLensAnalysis[];
  onSelectAnalysis: (analysis: TrustLensAnalysis) => void;
  onClearHistory: () => void;
  onDeleteItem: (timestamp: string) => void;
}

export function ScanHistoryDrawer({
  history,
  onSelectAnalysis,
  onClearHistory,
  onDeleteItem,
}: ScanHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesRisk =
        filterRisk === 'all' || item.overallRisk.toLowerCase() === filterRisk.toLowerCase();

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        item.headline.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.detectedEntities.some((e) => e.toLowerCase().includes(query));

      return matchesRisk && matchesSearch;
    });
  }, [history, searchQuery, filterRisk]);

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'high':
        return <ShieldAlert className="w-4 h-4 text-orange-400" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'low':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Controls */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past scans..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {['all', 'critical', 'high', 'medium', 'low'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterRisk(level)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer text-xs ${
                  filterRisk === level
                    ? 'bg-slate-800 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={onClearHistory}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-200">
            {history.length === 0 ? 'No Past Scans Saved' : 'No Matching Records'}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {history.length === 0
              ? 'When you analyze content and click "Save Analysis", your reports will be securely stored here in your browser.'
              : 'Try clearing your search query or selecting a different risk filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item, idx) => {
            return (
              <div
                key={item.timestamp || idx}
                className="glass-panel-interactive rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                onClick={() => onSelectAnalysis(item)}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                    {getRiskIcon(item.overallRisk)}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          item.overallRisk === 'critical'
                            ? 'critical'
                            : item.overallRisk === 'high'
                            ? 'alert'
                            : item.overallRisk === 'medium'
                            ? 'caution'
                            : 'trust'
                        }
                        size="sm"
                      >
                        {item.overallRisk.toUpperCase()}
                      </Badge>
                      <h5 className="text-sm font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                        {item.headline}
                      </h5>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {item.summary}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span>Type: {item.contentType}</span>
                      <span>•</span>
                      <span>{item.riskSignals.length} risk signals</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.timestamp);
                    }}
                    className="text-slate-500 hover:text-red-400"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center text-xs text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                    <span>View Analysis</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
