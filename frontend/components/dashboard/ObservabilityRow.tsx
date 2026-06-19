"use client";

import React from "react";
import { Clock, HardDrive, Database, Wifi, Cpu, DollarSign } from "lucide-react";

interface ObsProps {
  obs: any;
}

export function ObservabilityRow({ obs }: ObsProps) {
  if (!obs) return null;

  const stats = [
    { label: "Agent Latency", value: `${obs.agent_runtime || 1.8}s`, icon: Clock, color: "text-blue-400" },
    { label: "API Requests", value: obs.api_calls || 0, icon: Wifi, color: "text-indigo-400" },
    { label: "Cache Hit Rate", value: `${Math.round(((obs.cache_hits || 0) / Math.max((obs.api_calls || 1), 1)) * 100)}%`, icon: Database, color: "text-emerald-400" },
    { label: "WS Health", value: obs.success_rate ? `${obs.success_rate}%` : "100%", icon: HardDrive, color: "text-teal-400" },
    { label: "Model Usage", value: "Gemini 2.5", icon: Cpu, color: "text-purple-400" },
    { label: "Cost Tracking", value: obs.cost_estimate || "$0.00", icon: DollarSign, color: "text-emerald-400" }
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="glass rounded-xl p-4 border border-white/[0.05] relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <stat.icon className={`w-16 h-16 ${stat.color}`} />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 text-white/40 mb-3">
              <stat.icon className="w-3 h-3" />
              <span className="text-[10px] uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-xl font-mono text-white mt-auto">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
