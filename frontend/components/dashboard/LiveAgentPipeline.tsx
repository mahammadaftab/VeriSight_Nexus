"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Eye, Scale, ShieldAlert, FileSearch, HelpCircle, Network } from "lucide-react";

interface PipelineProps {
  activeAgent: string | null;
  agentStatus: Record<string, string>;
}

const AGENTS = [
  { id: "Claim Extraction Agent", icon: FileSearch, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/50" },
  { id: "Evidence Validation Agent", icon: Scale, color: "text-indigo-400", bg: "bg-indigo-500/20", border: "border-indigo-500/50" },
  { id: "Vision Inspection Agent", icon: Eye, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/50" },
  { id: "Object Part Agent", icon: Network, color: "text-fuchsia-400", bg: "bg-fuchsia-500/20", border: "border-fuchsia-500/50" },
  { id: "Risk Assessment Agent", icon: ShieldAlert, color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/50" },
  { id: "Decision Agent", icon: Cpu, color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/50" },
  { id: "Explanation Agent", icon: HelpCircle, color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/50" },
  { id: "Output Generator Service", icon: Network, color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/50" },
];

export function LiveAgentPipeline({ activeAgent, agentStatus }: PipelineProps) {
  return (
    <div className="w-full glass rounded-2xl border border-white/[0.05] p-4 flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium text-white/50 uppercase tracking-widest flex items-center gap-2">
          <Network className="w-4 h-4 text-white/40" />
          Execution Pipeline
        </h2>
        {activeAgent && (
          <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono text-blue-400">PROCESSING</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar pb-2">
        {AGENTS.map((agent, index) => {
          const isActive = activeAgent === agent.id;
          const isDone = agentStatus[agent.id] === "completed";
          
          return (
            <React.Fragment key={agent.id}>
              {/* Node */}
              <div className={`relative flex flex-col items-center justify-center gap-2 w-[120px] shrink-0 p-2 rounded-xl border transition-all duration-300 ${
                isActive ? "bg-white/[0.05] border-white/20 shadow-lg shadow-blue-500/10 scale-105" : 
                isDone ? "bg-white/[0.02] border-white/10" : "bg-transparent border-transparent opacity-50"
              }`}>
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                    isActive ? agent.border + " " + agent.bg : 
                    isDone ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10 bg-black/40"
                  }`}
                  animate={{ boxShadow: isActive ? "0 0 15px rgba(59, 130, 246, 0.4)" : "none" }}
                  transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                >
                  <agent.icon className={`w-4 h-4 ${isActive ? agent.color : isDone ? "text-emerald-400" : "text-white/20"}`} />
                </motion.div>
                <div className="text-center w-full">
                  <p className="text-[10px] font-medium text-white/80 leading-tight w-full truncate px-1">{agent.id.replace(" Agent", "").replace(" Service", "")}</p>
                  {agent.id === "Output Generator Service" && agentStatus[agent.id] && agentStatus[agent.id] !== "processing" && (
                    <p className="text-[8px] text-cyan-400 mt-0.5 animate-pulse">{agentStatus[agent.id].toUpperCase()}</p>
                  )}
                </div>
                
                {/* Horizontal Progress Bar beneath icon */}
                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden mt-1 relative">
                   {isDone && !isActive ? (
                     <div className="absolute inset-0 bg-emerald-500" />
                   ) : isActive ? (
                     <motion.div 
                       className={`absolute top-0 left-0 bottom-0 w-full ${agent.bg.replace('/20', '/80')}`}
                       initial={{ x: "-100%" }}
                       animate={{ x: "0%" }}
                       transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                     />
                   ) : null}
                </div>
              </div>

              {/* Arrow Connection */}
              {index < AGENTS.length - 1 && (
                <div className="flex-1 min-w-[20px] h-[2px] bg-white/5 relative overflow-hidden shrink-0">
                  {/* If previous is done or active, highlight line */}
                  {(isDone || isActive) && (
                    <motion.div 
                      className={`absolute inset-0 ${isActive ? 'bg-gradient-to-r from-blue-500 to-transparent' : 'bg-emerald-500/50'}`}
                      initial={{ x: isActive ? "-100%" : "0%" }}
                      animate={{ x: isActive ? "100%" : "0%" }}
                      transition={{ duration: 1.5, repeat: isActive ? Infinity : 0, ease: "linear" }}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
