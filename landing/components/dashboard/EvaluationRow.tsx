"use client";

import React from "react";
import { Target, Activity, ShieldCheck, FileCheck } from "lucide-react";

interface EvalProps {
  evaluation: any;
}

export function EvaluationRow({ evaluation }: EvalProps) {
  if (!evaluation) return null;

  const stats = [
    { label: "Accuracy", value: `${evaluation.accuracy || 0}%`, icon: Target, color: "text-blue-400", border: "border-blue-500/20" },
    { label: "Precision", value: `${evaluation.precision || 0}%`, icon: Activity, color: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "Recall", value: `${evaluation.recall || 0}%`, icon: ShieldCheck, color: "text-purple-400", border: "border-purple-500/20" },
    { label: "F1 Score", value: `${evaluation.f1 || 0}%`, icon: FileCheck, color: "text-rose-400", border: "border-rose-500/20" }
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest px-2">Live Evaluation Agent</h3>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`glass rounded-xl p-4 border border-white/[0.05] relative overflow-hidden group hover:bg-white/[0.02] transition-colors`}>
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity bg-current ${stat.color}`} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-white/40 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-[10px] uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-3xl font-display font-bold text-white tracking-tight">{stat.value}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">vs ground_truth</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
