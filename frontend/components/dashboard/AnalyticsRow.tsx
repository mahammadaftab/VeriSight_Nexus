"use client";

import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface AnalyticsProps {
  metrics: any;
}

export function AnalyticsRow({ metrics }: AnalyticsProps) {
  if (!metrics) return null;

  const { 
    issue_distribution = [], 
    severity_distribution = [],
    object_distribution = [],
    risk_distribution = []
  } = metrics;

  return (
    <div className="grid grid-cols-4 gap-6">
      
      {/* Issue Distribution */}
      <div className="glass rounded-2xl p-5 border border-white/[0.05] flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4">Issue Distribution</h3>
        <div className="flex-1 min-h-[200px] relative z-10">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <PieChart>
              <Pie
                data={issue_distribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {(issue_distribution).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(3,0,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Severity Profile */}
      <div className="glass rounded-2xl p-5 border border-white/[0.05] flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4">Severity Profile</h3>
        <div className="flex-1 min-h-[200px] relative z-10">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <BarChart data={severity_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: 'rgba(3,0,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Object Topology */}
      <div className="glass rounded-2xl p-5 border border-white/[0.05] flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4">Object Topology</h3>
        <div className="flex-1 min-h-[200px] relative z-10">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <BarChart data={object_distribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={60} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: 'rgba(3,0,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="glass rounded-2xl p-5 border border-white/[0.05] flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4">Risk Vectors</h3>
        <div className="flex-1 min-h-[200px] relative z-10">
          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <PieChart>
              <Pie
                data={risk_distribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {risk_distribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#ef4444', '#a855f7'][index % 4]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(3,0,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
