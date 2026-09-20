'use client';

import React, { useState } from 'react';
import { TrustLensAnalysis } from '@/lib/ai/types';
import { X, Download, FileText, Code, Printer, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: TrustLensAnalysis;
}

export function ExportReportModal({
  isOpen,
  onClose,
  analysis,
}: ExportReportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownReport = (): string => {
    return `# TRUSTLENS SECURITY ASSESSMENT REPORT
*Tagline: "Pause. Scan. Know."*
*Generated at: ${new Date(analysis.timestamp).toLocaleString()}*

---

## 1. EXECUTIVE ASSESSMENT
- **Overall Risk Level**: ${analysis.overallRisk.toUpperCase()}
- **Confidence Rating**: ${analysis.confidence}%
- **Headline**: ${analysis.headline}
- **Summary**: ${analysis.summary}
- **Claimed / Detected Entities**: ${analysis.detectedEntities.join(', ') || 'None'}

---

## 2. OBSERVABLE RISK SIGNALS (${analysis.riskSignals.length})
${analysis.riskSignals
  .map(
    (s, i) => `### ${i + 1}. [${s.severity.toUpperCase()}] ${s.title}
- **Observable Evidence**: \`${s.evidence}\`
- **Why It Matters**: ${s.whyItMatters}
- **Confidence**: ${s.confidence}%
`
  )
  .join('\n')}

---

## 3. BALANCED POSITIVE INDICATORS (${analysis.positiveSignals.length})
${analysis.positiveSignals.map((p) => `- **${p.title}**: ${p.description}`).join('\n') || '- None identified.'}

---

## 4. DETECTED DEMANDS
- **Payment / Wire**: ${analysis.requestsDetected.payment ? 'YES [FLAGGED]' : 'No'}
- **OTP / 2FA Code**: ${analysis.requestsDetected.otp ? 'YES [FLAGGED]' : 'No'}
- **Password**: ${analysis.requestsDetected.password ? 'YES [FLAGGED]' : 'No'}
- **Personal Data (PII)**: ${analysis.requestsDetected.personalInformation ? 'YES [FLAGGED]' : 'No'}
- **Government ID / SSN**: ${analysis.requestsDetected.identityDocument ? 'YES [FLAGGED]' : 'No'}
- **Urgent Action / Deadline**: ${analysis.requestsDetected.urgentAction ? 'YES [FLAGGED]' : 'No'}
- **Remote Access Software**: ${analysis.requestsDetected.remoteAccess ? 'YES [FLAGGED]' : 'No'}

---

## 5. ACTION PLAN

### WHAT SHOULD I DO?
${analysis.recommendedActions.map((a) => `- [ ] ${a}`).join('\n')}

### WHAT SHOULD I AVOID?
${analysis.avoidActions.map((a) => `- [x] DO NOT: ${a}`).join('\n')}

---

## 6. INDEPENDENT VERIFICATION CHANNELS
${analysis.verificationSteps.map((v) => `1. **${v.step}** (via ${v.channel}): ${v.details}`).join('\n')}

---

## 7. BOUNDARIES & UNCERTAINTIES
${analysis.uncertainty.map((u) => `- ${u}`).join('\n')}

---
*Disclaimer: ${analysis.disclaimer}*
`;
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trustlens-report-${analysis.overallRisk}-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(analysis, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trustlens-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto glass-panel rounded-3xl border border-slate-700 p-4 sm:p-6 bg-slate-900/95 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-base">
                Export Security Report
              </h3>
              <p className="text-xs text-slate-400">
                Save or share this analysis for documentation & reporting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownloadMarkdown}
            className="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-left transition-all space-y-1.5 group cursor-pointer"
          >
            <div className="flex items-center justify-between text-cyan-400">
              <FileText className="w-5 h-5" />
              <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm font-semibold text-slate-200">Markdown Audit Report</p>
            <p className="text-xs text-slate-400">
              Human-readable markdown with full checklists and evidence.
            </p>
          </button>

          <button
            onClick={handleDownloadJson}
            className="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-left transition-all space-y-1.5 group cursor-pointer"
          >
            <div className="flex items-center justify-between text-emerald-400">
              <Code className="w-5 h-5" />
              <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm font-semibold text-slate-200">Raw JSON Schema</p>
            <p className="text-xs text-slate-400">
              Machine-readable structured output matching TrustLens schema.
            </p>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopyMarkdown}
            >
              {copied ? 'Copied to Clipboard' : 'Copy Report'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
            >
              Print / Save PDF
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
