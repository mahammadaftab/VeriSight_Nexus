"use client";

import React from "react";
import { Layers, ShieldCheck, AlertTriangle, Activity, CheckCircle, HelpCircle } from "lucide-react";

interface MetricsProps {
  metrics: any;
}

export function ExecutiveMetrics({ metrics }: MetricsProps) {
  if (!metrics) return null;

  const total = metrics.total || 0;
  const completed = metrics.completed || 0;
  const active = total - completed;
  const confidence = completed > 0 && metrics.supported ? Math.round((metrics.supported / completed) * 100) : 0;

  const cards = [
    {
      title: "Total Claims",
      value: total,
      icon: Layers,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Active Claims",
      value: active < 0 ? 0 : active,
      icon: Activity,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20"
    },
    {
      title: "Supported",
      value: metrics.supported || 0,
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      title: "Contradicted",
      value: metrics.contradicted || 0,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    },
    {
      title: "Need Info",
      value: metrics.not_enough_information || 0,
      icon: HelpCircle,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    },
    {
      title: "Avg Support Confidence",
      value: `${confidence}%`,
      icon: CheckCircle,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {cards.map((card) => (
        <div 
          key={card.title}
          className="flex items-center gap-4 rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 h-[80px]"
        >
          <div className={`p-2.5 rounded-xl ${card.bg} ${card.border} border shrink-0`}>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">{card.title}</h3>
            <p className="text-2xl font-display font-bold text-white tracking-tight leading-none mt-1">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
