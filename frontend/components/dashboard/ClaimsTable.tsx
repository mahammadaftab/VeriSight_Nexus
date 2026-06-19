"use client";

import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Claim {
  user_id: string;
  claim_object: string;
  claim_status: string;
  severity: string;
  risk_flags: string;
}

interface Props {
  claims: Claim[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ClaimsTable({ claims, selectedId, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = claims.filter(c => 
    c.user_id.toLowerCase().includes(search.toLowerCase()) ||
    c.claim_object.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'supported': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'contradicted': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'not_enough_information': return <HelpCircle className="w-4 h-4 text-amber-400" />;
      default: return <div className="w-2 h-2 rounded-full bg-blue-400/50" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  return (
    <div className="flex flex-col h-full glass rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <h2 className="font-semibold text-white/90">Claims Queue</h2>
        <span className="text-xs text-white/40 font-mono">{claims.length} Total</span>
      </div>
      
      <div className="p-3 border-b border-white/10 space-y-3">
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(claims.map(c => c.claim_object))).filter(Boolean).map((obj) => (
            <button 
              key={obj}
              onClick={() => setSearch(obj)} 
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[10px] uppercase tracking-wider rounded border border-white/10 transition-colors"
            >
              {obj}
            </button>
          ))}
          {search && (
            <button onClick={() => setSearch("")} className="px-2 py-1 text-[10px] uppercase text-red-400 hover:bg-red-500/10 rounded transition-colors">
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text"
              placeholder="Search ID or object..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white/90 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <button className="px-2 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white transition-colors flex items-center gap-1 text-xs shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-white/5">
          {filtered.map((claim, index) => {
            const hasRisk = claim.risk_flags !== 'none' && claim.risk_flags !== '';
            return (
              <button
                key={`${claim.user_id}-${index}`}
                onClick={() => onSelect(claim.user_id)}
                className={cn(
                  "w-full text-left p-4 hover:bg-white/5 transition-colors flex items-center justify-between group",
                  selectedId === claim.user_id ? "bg-white/10 border-l-2 border-blue-500" : "border-l-2 border-transparent"
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-blue-400">{claim.user_id}</span>
                    {hasRisk && <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-white/60 capitalize">{claim.claim_object}</span>
                    <span className={cn("px-2 py-0.5 rounded-full border", getSeverityColor(claim.severity))}>
                      {claim.severity}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  {getStatusIcon(claim.claim_status)}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
