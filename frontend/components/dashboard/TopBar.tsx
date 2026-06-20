"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, Bell, Settings, UserCircle, 
  ChevronDown, Activity, Globe, Command, DownloadCloud, Loader2
} from "lucide-react";

export function TopBar() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSubmission = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch("http://localhost:8000/api/v1/process-all-claims", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Final submission generated successfully!");
      } else {
        alert("Error generating submission: " + (data.detail || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#030014]/60 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        
        {/* Left: Workspace & Branding */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-[#030014] rounded-md flex items-center justify-center group-hover:bg-transparent transition-colors">
                <Command className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="font-display font-semibold tracking-wide text-white">
              Nexus<span className="text-white/40">Command</span>
            </span>
          </Link>
          
          <div className="h-4 w-px bg-white/10" />
          
          <button 
            onClick={() => alert("Workspace switcher is locked in the current demo environment.")}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <span className="font-medium text-white/90">Acme Corp</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10">PRO</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Center: Global Search & Processing Rate */}
        <div className="flex items-center flex-1 max-w-2xl px-12">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search claims, users, or risk flags..." 
              className="w-full h-9 bg-white/[0.02] border border-white/[0.05] rounded-full pl-9 pr-4 text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  alert(`Searching for: ${e.currentTarget.value}`);
                }
              }}
            />
            <div 
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 cursor-pointer hover:opacity-80"
              onClick={() => alert("Command palette (⌘K) will be available in the next release.")}
            >
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-white/40 border border-white/10">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-white/40 border border-white/10">K</kbd>
            </div>
          </div>
        </div>

        {/* Right: Status, Nav, Profile */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 pr-5 border-r border-white/10">
            <button 
              onClick={handleGenerateSubmission}
              disabled={isGenerating}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white text-[#030014] text-[11px] font-bold tracking-wide hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <DownloadCloud className="w-3 h-3" />}
              {isGenerating ? "GENERATING..." : "GENERATE FINAL SUBMISSION"}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium tracking-wide cursor-help" title="All pipeline systems operational">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM HEALTHY
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-mono tracking-wide cursor-help" title="Average LLM processing latency">
              <Activity className="w-3 h-3" />
              1.8s AVG
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => alert("You have no new notifications.")}
              className="text-white/40 hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border border-[#030014]" />
            </button>
            <button 
              onClick={() => alert("Settings panel is under construction.")}
              className="text-white/40 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <Link href="/profile" className="flex items-center gap-2 group ml-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-sm font-semibold text-white shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
                {user?.name?.charAt(0) || "A"}
              </div>
              <ChevronDown className="w-3 h-3 text-white/40 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
