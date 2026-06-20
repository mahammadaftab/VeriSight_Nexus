"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Activity, CheckCircle2, Circle, Loader2, AlertTriangle, PlayCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  userId: string;
}

interface StepEvent {
  agent: string;
  status: 'processing' | 'completed';
  result?: any;
  timestamp?: string;
}

interface Props {
  userId: string;
  steps: StepEvent[];
  isAnalyzing: boolean;
  isDone: boolean;
  finalResult: any;
  error: string | null;
  onAnalyze: () => void;
}

export function AgentActivityFeed({ 
  userId, 
  steps, 
  isAnalyzing, 
  isDone, 
  finalResult, 
  error, 
  onAnalyze 
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current && steps.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [steps]);

  return (
    <div className="flex flex-col h-full glass rounded-xl border border-white/10 overflow-hidden relative">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-white/90">Agent Activity Feed</h2>
        </div>
        {!isAnalyzing && !isDone && (
          <button 
            onClick={onAnalyze}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            <PlayCircle className="w-4 h-4" />
            Analyze Live
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {steps.length === 0 && !isAnalyzing && !error && (
          <div className="h-full flex flex-col items-center justify-center text-white/40 text-sm">
            <Activity className="w-12 h-12 mb-4 opacity-20" />
            <p>Click Analyze Live to start the multi-agent pipeline stream.</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Event Stream */}
        <div className="flex flex-col gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="w-full flex flex-col p-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/[0.07]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  {step.status === 'processing' ? (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <h3 className="font-medium text-sm text-white/90 tracking-wide">{step.agent}</h3>
                </div>
                <div className="flex items-center gap-3">
                  {step.timestamp && <span className="text-[10px] font-mono text-white/40">{step.timestamp}</span>}
                  <span className={cn("text-[11px] font-medium uppercase tracking-wider", step.status === 'processing' ? 'text-blue-400 animate-pulse' : 'text-emerald-400/80')}>
                    {step.status === 'processing' ? 'Running' : 'Done'}
                  </span>
                </div>
              </div>
              
              {step.result && (
                <details className="mt-2 group">
                  <summary className="text-[11px] text-white/50 hover:text-white/80 transition-colors font-medium cursor-pointer select-none outline-none list-none flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center group-open:rotate-90 transition-transform">
                      ▶
                    </span>
                    <span className="group-open:hidden">View Details</span>
                    <span className="hidden group-open:inline">Hide Details</span>
                  </summary>
                  <div className="mt-3 bg-black/40 rounded-lg p-3 text-[11px] leading-relaxed font-mono text-white/60 overflow-x-auto border border-white/[0.05] max-h-[250px] overflow-y-auto custom-scrollbar">
                    <pre>{JSON.stringify(step.result, null, 2)}</pre>
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>

        {/* Final Decision Result */}
        {isDone && finalResult && (
          <div className="mt-8 p-5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl animate-slide-up-fade">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Final Verdict & Investigation Brief
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <p className="text-xs text-white/40 mb-1">Claim Status</p>
                <p className="text-sm font-semibold capitalize text-white/90">{finalResult.final_status}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <p className="text-xs text-white/40 mb-1">Severity Estimate</p>
                <p className="text-sm font-semibold capitalize text-white/90">{finalResult.severity}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-white/40">Claim Health Score</p>
                    <span className={cn("text-xs font-bold", finalResult.health_score > 70 ? "text-emerald-400" : finalResult.health_score > 40 ? "text-amber-400" : "text-red-400")}>{finalResult.health_score}/100</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-blue-500" style={{width: `${finalResult.health_score}%`}}></div></div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-white/40">Fraud Risk Score</p>
                    <span className={cn("text-xs font-bold", finalResult.fraud_score > 50 ? "text-red-400" : finalResult.fraud_score > 20 ? "text-amber-400" : "text-emerald-400")}>{finalResult.fraud_score}/100</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-1.5"><div className={cn("h-1.5 rounded-full", finalResult.fraud_score > 50 ? "bg-red-500" : "bg-emerald-500")} style={{width: `${finalResult.fraud_score}%`}}></div></div>
              </div>
            </div>
            
            {finalResult.copilot && (
                <div className="bg-black/20 rounded-lg p-3 border border-white/5 mb-4">
                    <p className="text-xs text-blue-400 font-semibold mb-2">Copilot Recommendation: {finalResult.copilot.recommended_action}</p>
                    <p className="text-sm text-white/80 leading-relaxed mb-2">{finalResult.copilot.reason}</p>
                    <div className="text-xs text-white/50 space-y-1">
                        <p><span className="text-white/70">Evidence:</span> {finalResult.copilot.evidence_summary}</p>
                        <p><span className="text-white/70">Concerns:</span> {finalResult.copilot.potential_concerns}</p>
                    </div>
                </div>
            )}

            <div className="bg-black/20 rounded-lg p-3 border border-white/5">
              <p className="text-xs text-white/40 mb-1">AI Explanation Justification</p>
              <p className="text-sm text-white/80 leading-relaxed">{finalResult.justification}</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
