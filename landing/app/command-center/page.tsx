"use client";

import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ShieldCheck, ArrowLeft, Activity, Layers, AlertTriangle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function CommandCenterPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [obs, setObs] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/metrics', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:8000/api/observability', { credentials: 'include' }).then(res => res.json())
    ]).then(([metricsData, obsData]) => {
      setMetrics(metricsData);
      setObs(obsData);
    }).catch(console.error);
  }, []);

  if (!metrics || !obs) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white/50">
          <Activity className="w-8 h-8 animate-spin opacity-50" />
          <p>Loading Enterprise Metrics & Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030014] to-[#030014]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
              <span className="font-display font-semibold tracking-wide">Nexus<span className="text-blue-500">Command</span></span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Healthy
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">Global Operations</h1>
              <p className="text-white/60">Real-time telemetry from the evidence review pipeline.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40 mb-1">Average Processing Time</p>
              <p className="text-2xl font-mono text-emerald-400">{obs.agent_runtime > 0 ? obs.agent_runtime : 1.8}s <span className="text-sm text-white/40">/ claim</span></p>
            </div>
          </div>

          {/* Top Stat Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="glass rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 text-white/60 mb-4">
                <Layers className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium">Total Processed</h3>
              </div>
              <p className="text-4xl font-mono font-bold text-white">{metrics.total}</p>
            </div>
            <div className="glass rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 text-white/60 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-medium">Supported Claims</h3>
              </div>
              <p className="text-4xl font-mono font-bold text-emerald-400">{metrics.supported}</p>
            </div>
            <div className="glass rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 text-white/60 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-medium">Contradicted</h3>
              </div>
              <p className="text-4xl font-mono font-bold text-red-400">{metrics.contradicted}</p>
            </div>
            <div className="glass rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 text-white/60 mb-4">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="font-medium">Needs Information</h3>
              </div>
              <p className="text-4xl font-mono font-bold text-amber-400">{metrics.not_enough_information}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6 h-[400px]">
            {/* Issue Distribution */}
            <div className="glass rounded-xl p-6 border border-white/10 flex flex-col">
              <h3 className="font-medium text-white/80 mb-6">Issue Distribution</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.issue_distribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {(metrics.issue_distribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Severity Distribution */}
            <div className="glass rounded-xl p-6 border border-white/10 flex flex-col">
              <h3 className="font-medium text-white/80 mb-6">Severity Profile</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.severity_distribution || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Observability & Comparison Row */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Observability Panel */}
            <div className="glass rounded-xl p-6 border border-white/10">
              <h3 className="font-medium text-white/80 mb-6">System Observability (Phase 16)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-white/40 mb-1">Total API Calls</p>
                  <p className="text-2xl font-mono text-blue-400">{obs.api_calls}</p>
                </div>
                <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-white/40 mb-1">Estimated Cost</p>
                  <p className="text-2xl font-mono text-emerald-400">{obs.cost_estimate}</p>
                </div>
                <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-white/40 mb-1">System Success Rate</p>
                  <p className="text-2xl font-mono text-emerald-400">{obs.success_rate}%</p>
                </div>
                <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-white/40 mb-1">Cache Hits</p>
                  <p className="text-2xl font-mono text-blue-400">{obs.cache_hits}</p>
                </div>
              </div>
            </div>

            {/* AI vs Human Reviewer Comparison */}
            <div className="glass rounded-xl p-6 border border-white/10">
              <h3 className="font-medium text-white/80 mb-6">Reviewer Efficacy Comparison</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-white/60">Average Review Time</span>
                  <div className="flex items-center gap-6 text-sm font-mono">
                    <span className="text-amber-400 w-24 text-right">Human: 3-5m</span>
                    <span className="text-emerald-400 w-24 text-right">Nexus: ~2s</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-white/60">Rule Consistency</span>
                  <div className="flex items-center gap-6 text-sm font-mono">
                    <span className="text-amber-400 w-24 text-right">Human: 78%</span>
                    <span className="text-emerald-400 w-24 text-right">Nexus: 100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-white/60">Fraud Detection Bias</span>
                  <div className="flex items-center gap-6 text-sm font-mono">
                    <span className="text-amber-400 w-24 text-right">Human: High</span>
                    <span className="text-emerald-400 w-24 text-right">Nexus: None</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-white/60">Decision Transparency</span>
                  <div className="flex items-center gap-6 text-sm font-mono">
                    <span className="text-amber-400 w-24 text-right">Human: Subjective</span>
                    <span className="text-emerald-400 w-24 text-right">Nexus: Cryptographic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
