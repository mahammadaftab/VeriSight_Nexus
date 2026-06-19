"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, FileText, Activity, Layers } from "lucide-react";

interface VerdictProps {
  verdict: any;
}

export function AIVerdictPanel({ verdict }: VerdictProps) {
  if (!verdict) {
    return (
      <div className="h-full glass rounded-2xl border border-white/[0.05] p-6 flex items-center justify-center">
        <p className="text-white/30 text-sm text-center">Select a claim to view the AI verdict analysis.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'supported': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'contradicted': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'supported': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'contradicted': return <ShieldAlert className="w-6 h-6 text-red-400" />;
      default: return <AlertTriangle className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="h-full glass rounded-2xl border border-white/[0.05] p-6 flex flex-col relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />

      <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-6">Cryptographic Verdict</h2>

      <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
        
        {/* Status Header */}
        <div className={`p-4 rounded-xl border ${getStatusColor(verdict.final_status)} flex items-center gap-4`}>
          {getStatusIcon(verdict.final_status)}
          <div>
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">Final Decision</p>
            <p className="text-xl font-display font-bold capitalize">{verdict.final_status?.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/20 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <Activity className="w-3 h-3" />
              <span className="text-[10px] uppercase tracking-wider">Health Score</span>
            </div>
            <p className="text-lg font-mono text-white">{verdict.health_score || 0}/100</p>
          </div>
          <div className="bg-black/20 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <ShieldAlert className="w-3 h-3" />
              <span className="text-[10px] uppercase tracking-wider">Fraud Score</span>
            </div>
            <p className="text-lg font-mono text-rose-400">{verdict.fraud_score || 0}/100</p>
          </div>
          <div className="bg-black/20 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-[10px] uppercase tracking-wider">Severity</span>
            </div>
            <p className="text-sm font-medium text-white capitalize">{verdict.severity || 'Unknown'}</p>
          </div>
          <div className="bg-black/20 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <Layers className="w-3 h-3" />
              <span className="text-[10px] uppercase tracking-wider">Confidence</span>
            </div>
            <p className="text-sm font-medium text-blue-400 capitalize">{verdict.confidence || 'N/A'}</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5 relative">
          <div className="flex items-center gap-2 text-white/50 mb-3">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">AI Explanation</span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            {verdict.justification || "No explanation provided by the network."}
          </p>
        </div>

      </div>
    </div>
  );
}
