'use client';

import React from 'react';
import { SAMPLE_SCENARIOS, SampleScenario } from '@/lib/presets/sampleScenarios';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface PresetPickerProps {
  onSelectPreset: (scenario: SampleScenario) => void;
}

export function PresetPicker({ onSelectPreset }: PresetPickerProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Try Realistic Test Scenarios</span>
        </div>
        <span className="text-[11px] text-slate-500">Instant 1-click preview</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {SAMPLE_SCENARIOS.slice(0, 6).map((scenario) => {
          const isLegitimate = scenario.expectedRisk === 'low';

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectPreset(scenario)}
              className="group text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 transition-all duration-150 flex flex-col justify-between space-y-2 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <Badge
                    variant={isLegitimate ? 'trust' : 'alert'}
                    size="sm"
                    icon={
                      isLegitimate ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ShieldAlert className="w-3 h-3 text-red-400" />
                      )
                    }
                  >
                    {scenario.badge}
                  </Badge>
                  <span className="text-[10px] uppercase font-mono text-slate-500">
                    {scenario.inputType}
                  </span>
                </div>

                <h5 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {scenario.title}
                </h5>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <div className="flex items-center justify-end text-[11px] font-medium text-cyan-400 group-hover:translate-x-0.5 transition-transform pt-1">
                <span>Load Sample</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
