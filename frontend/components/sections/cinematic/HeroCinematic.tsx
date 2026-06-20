"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Network, Image as ImageIcon, MessageSquare, History, FileText, Cpu, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HeroCinematic() {
  const [step, setStep] = useState(0);

  // Sequence loops every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (idx: number) => step >= idx;

  return (
    <section className="relative min-h-[110vh] flex flex-col items-center justify-center pt-32 pb-32 overflow-hidden px-6">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Floating Evidence Cards */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[5%] md:left-[15%] glass p-3 rounded-xl border border-white/10 hidden md:flex items-center gap-3 backdrop-blur-md opacity-60 z-0"
      >
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white">Car Damage</span>
          <span className="text-[10px] text-white/50">Processing visual...</span>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[40%] right-[5%] md:right-[15%] glass p-3 rounded-xl border border-white/10 hidden md:flex items-center gap-3 backdrop-blur-md opacity-50 z-0"
      >
        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white">Confidence Score</span>
          <span className="text-[10px] text-emerald-400 font-mono">98.2%</span>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[30%] left-[10%] md:left-[20%] glass p-3 rounded-xl border border-white/10 hidden md:flex items-center gap-3 backdrop-blur-md opacity-40 z-0"
      >
        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-red-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white">Risk Score</span>
          <span className="text-[10px] text-red-400 font-mono">High Risk</span>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 25, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[20%] right-[10%] md:right-[20%] glass p-3 rounded-xl border border-white/10 hidden md:flex items-center gap-3 backdrop-blur-md opacity-40 z-0"
      >
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white">Laptop Crack</span>
          <span className="text-[10px] text-white/50">Awaiting...</span>
        </div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[900px] mx-auto mb-24 mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-semibold text-white/80 tracking-[0.2em] uppercase">Introducing Nexus Core</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] font-display font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 mb-10"
        >
          Intelligence,<br />Orchestrated.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-16 font-light leading-relaxed"
        >
          A multi-agent neural network designed to ingest chaotic evidence, orchestrate deep visual analysis, and autonomously generate trusted decisions in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-full font-semibold overflow-hidden transition-transform hover:scale-105 active:scale-95 text-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">Enter Command Center</span>
            <Network className="w-5 h-5 relative" />
          </Link>
          
          <Link
            href="/docs"
            className="px-8 py-5 text-white/60 hover:text-white font-medium transition-colors text-lg"
          >
            Read Architecture
          </Link>
        </motion.div>
      </div>

      {/* AI Core Visualization Centerpiece */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-auto pb-12"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          
          {/* Inputs */}
          <div className="flex flex-row md:flex-col gap-4 z-10">
            <div className={`flex items-center gap-3 glass px-4 py-3 rounded-xl border transition-all duration-500 ${isActive(0) ? 'border-blue-500/50 bg-blue-500/10 scale-105' : 'border-white/10 opacity-50'}`}>
              <ImageIcon className={`w-5 h-5 ${isActive(0) ? 'text-blue-400' : 'text-white/40'}`} />
              <span className="text-sm font-medium text-white/80 hidden md:block">Images</span>
            </div>
            <div className={`flex items-center gap-3 glass px-4 py-3 rounded-xl border transition-all duration-500 ${isActive(0) ? 'border-purple-500/50 bg-purple-500/10 scale-105 delay-100' : 'border-white/10 opacity-50'}`}>
              <MessageSquare className={`w-5 h-5 ${isActive(0) ? 'text-purple-400' : 'text-white/40'}`} />
              <span className="text-sm font-medium text-white/80 hidden md:block">Conversation</span>
            </div>
            <div className={`flex items-center gap-3 glass px-4 py-3 rounded-xl border transition-all duration-500 ${isActive(0) ? 'border-amber-500/50 bg-amber-500/10 scale-105 delay-200' : 'border-white/10 opacity-50'}`}>
              <History className={`w-5 h-5 ${isActive(0) ? 'text-amber-400' : 'text-white/40'}`} />
              <span className="text-sm font-medium text-white/80 hidden md:block">User History</span>
            </div>
            <div className={`flex items-center gap-3 glass px-4 py-3 rounded-xl border transition-all duration-500 ${isActive(0) ? 'border-emerald-500/50 bg-emerald-500/10 scale-105 delay-300' : 'border-white/10 opacity-50'}`}>
              <FileText className={`w-5 h-5 ${isActive(0) ? 'text-emerald-400' : 'text-white/40'}`} />
              <span className="text-sm font-medium text-white/80 hidden md:block">Evidence Rules</span>
            </div>
          </div>

          {/* Flow to Center */}
          <div className="absolute left-[20%] right-[50%] top-1/2 h-0.5 -translate-y-1/2 hidden md:block z-0">
             <div className="w-full h-full bg-white/5 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: isActive(1) ? "100%" : "-100%" }}
                  transition={{ duration: 1, repeat: isActive(1) && !isActive(2) ? Infinity : 0 }}
                />
             </div>
          </div>

          {/* Nexus Core */}
          <div className={`relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center transition-all duration-1000 ${isActive(1) ? 'shadow-[0_0_80px_rgba(59,130,246,0.5)] scale-110' : 'scale-100 opacity-50'}`}>
            <div className={`absolute inset-0 rounded-full border border-white/20 bg-black/50 backdrop-blur-xl transition-all duration-1000 ${isActive(1) ? 'border-blue-500/50 bg-blue-900/20' : ''}`} />
            <Cpu className={`w-12 h-12 md:w-16 md:h-16 relative z-10 transition-colors duration-1000 ${isActive(1) ? 'text-blue-400' : 'text-white/20'}`} />
            
            {/* Core Pulses */}
            {isActive(1) && (
              <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping opacity-20" style={{ animationDuration: '2s' }} />
            )}
          </div>

          {/* Flow to Decision */}
          <div className="absolute left-[50%] right-[20%] top-1/2 h-0.5 -translate-y-1/2 hidden md:block z-0">
             <div className="w-full h-full bg-white/5 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: isActive(2) ? "100%" : "-100%" }}
                  transition={{ duration: 1, repeat: isActive(2) && !isActive(3) ? Infinity : 0 }}
                />
             </div>
          </div>

          {/* Decision Output */}
          <div className={`flex flex-col items-center gap-3 glass px-8 py-6 rounded-2xl border transition-all duration-1000 z-10 ${isActive(3) ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.3)] scale-110' : 'border-white/10 opacity-30 grayscale'}`}>
            <CheckCircle2 className={`w-8 h-8 ${isActive(3) ? 'text-emerald-400' : 'text-white/40'}`} />
            <span className="text-lg font-bold text-white tracking-wide">Approved</span>
            {isActive(3) && (
              <span className="text-xs font-mono text-emerald-400/80 uppercase">Confidence: 99.8%</span>
            )}
          </div>

        </div>
      </motion.div>
    </section>
  );
}
