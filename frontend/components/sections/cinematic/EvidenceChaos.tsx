"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Image as ImageIcon, MessageSquare, FileText } from "lucide-react";

export default function EvidenceChaos() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms for various elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const y4 = useTransform(scrollYProgress, [0, 1], [200, -300]);
  
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-10, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <section ref={containerRef} className="relative min-h-[150vh] flex items-center justify-center overflow-hidden bg-[#030014]">
      
      {/* Background gradient mask to blend with previous/next sections */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-[#030014] via-transparent to-[#030014]" />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
          Drowning in <span className="text-amber-400">Chaos</span>
        </h2>
        <p className="text-xl text-white/50">
          Unstructured chats, blurry photos, conflicting evidence rules, and fractured history. How can any human process this instantly?
        </p>
      </div>

      {/* Floating Elements layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Mock Image 1 */}
        <motion.div style={{ y: y1, rotate: rotate1 }} className="absolute top-[20%] left-[10%] glass p-2 rounded-xl border border-white/10 w-48 shadow-2xl">
          <div className="w-full aspect-video bg-black/50 rounded-lg flex items-center justify-center relative overflow-hidden">
             <ImageIcon className="w-8 h-8 text-white/20" />
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent mix-blend-overlay" />
          </div>
          <div className="p-2">
            <div className="h-2 w-24 bg-white/20 rounded mb-2" />
            <div className="h-2 w-16 bg-white/10 rounded" />
          </div>
        </motion.div>

        {/* Mock Chat */}
        <motion.div style={{ y: y3, rotate: rotate2 }} className="absolute top-[40%] right-[15%] glass p-4 rounded-xl border border-white/10 w-64 shadow-2xl">
          <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/50 font-mono">User Transcript</span>
          </div>
          <div className="space-y-3">
            <div className="bg-blue-500/10 rounded-lg p-2 text-[10px] text-white/70 ml-4 border border-blue-500/20">
              "The laptop screen cracked when I dropped it..."
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-[10px] text-white/70 mr-4 border border-white/10">
              "Can you provide a picture of the serial number?"
            </div>
          </div>
        </motion.div>

        {/* Mock Image 2 */}
        <motion.div style={{ y: y2, rotate: rotate1 }} className="absolute top-[60%] left-[25%] glass p-2 rounded-xl border border-white/10 w-56 shadow-2xl opacity-60">
          <div className="w-full aspect-square bg-black/50 rounded-lg flex items-center justify-center relative overflow-hidden">
             <ImageIcon className="w-8 h-8 text-white/20" />
             <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-transparent mix-blend-overlay" />
          </div>
        </motion.div>

        {/* Mock Rule */}
        <motion.div style={{ y: y4, rotate: rotate2 }} className="absolute top-[15%] right-[30%] glass p-4 rounded-xl border border-red-500/20 w-72 shadow-2xl bg-red-500/5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400/80 font-mono">REQ_004</span>
          </div>
          <p className="text-[10px] text-white/60 font-mono leading-relaxed">
            "Must show visible impact point. Must include time-stamp. If liquid damage, show oxidation."
          </p>
        </motion.div>

        {/* Mock JSON Blob */}
        <motion.div style={{ y: y1 }} className="absolute top-[75%] right-[20%] glass p-4 rounded-xl border border-white/5 w-64 shadow-2xl opacity-40">
           <pre className="text-[8px] text-emerald-400/50 font-mono">
{`{
  "user_history": {
    "claims_ytd": 4,
    "avg_payout": 1200,
    "risk_score": 85
  },
  "flags": ["high_velocity"]
}`}
           </pre>
        </motion.div>

      </div>
    </section>
  );
}
