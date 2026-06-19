"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileSearch, Eye, ShieldAlert, Scale, Cpu, Network } from "lucide-react";

const AGENTS = [
  { id: "Claim Extraction", icon: FileSearch, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", x: "-30%", y: "-40%" },
  { id: "Vision Inspection", icon: Eye, color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", x: "30%", y: "-40%" },
  { id: "Evidence Rules", icon: Scale, color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", x: "-40%", y: "20%" },
  { id: "Risk Assessment", icon: ShieldAlert, color: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-500/10", x: "40%", y: "20%" },
  { id: "Decision Engine", icon: Cpu, color: "text-amber-400", border: "border-amber-500/50", bg: "bg-amber-500/20", x: "0%", y: "0%", core: true },
];

export default function MultiAgentGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={containerRef} className="relative min-h-[120vh] flex flex-col items-center justify-center py-24 overflow-hidden">
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 mb-32">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
          Multi-Agent <span className="text-purple-400">Orchestration</span>
        </h2>
        <p className="text-xl text-white/50">
          Not a single LLM prompt. A synchronized team of specialized AI agents working together to cross-examine evidence, validate rules, and eliminate hallucinations.
        </p>
      </div>

      <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center">
        
        {/* SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>
          {/* We use simplified straight lines pointing to center (50%, 50%) */}
          <motion.line x1="20%" y1="10%" x2="50%" y2="50%" stroke="rgba(59,130,246,0.3)" strokeWidth="2" strokeDasharray="5,5" />
          <motion.line x1="80%" y1="10%" x2="50%" y2="50%" stroke="rgba(168,85,247,0.3)" strokeWidth="2" strokeDasharray="5,5" />
          <motion.line x1="10%" y1="70%" x2="50%" y2="50%" stroke="rgba(16,185,129,0.3)" strokeWidth="2" strokeDasharray="5,5" />
          <motion.line x1="90%" y1="70%" x2="50%" y2="50%" stroke="rgba(244,63,94,0.3)" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* Animated data pulses flowing to center */}
          <motion.circle r="4" fill="#60A5FA" style={{ pathLength: pathProgress }}>
            <animateMotion dur="2s" repeatCount="indefinite" path="M 200,60 L 500,300" />
          </motion.circle>
          <motion.circle r="4" fill="#C084FC">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 800,60 L 500,300" />
          </motion.circle>
          <motion.circle r="4" fill="#34D399">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 100,420 L 500,300" />
          </motion.circle>
          <motion.circle r="4" fill="#FB7185">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 900,420 L 500,300" />
          </motion.circle>
        </svg>

        {/* Nodes */}
        {AGENTS.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`absolute flex flex-col items-center gap-3 ${agent.core ? 'z-20' : 'z-10'}`}
            style={{ 
              transform: `translate(${agent.x}, ${agent.y})` 
            }}
          >
            <div className={`
              flex items-center justify-center rounded-2xl border backdrop-blur-md transition-all
              ${agent.core ? 'w-24 h-24 md:w-32 md:h-32 shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-pulse' : 'w-16 h-16 md:w-20 md:h-20 hover:scale-110 cursor-pointer'}
              ${agent.border} ${agent.bg}
            `}>
              <agent.icon className={`${agent.core ? 'w-10 h-10 md:w-14 md:h-14' : 'w-8 h-8 md:w-10 md:h-10'} ${agent.color}`} />
            </div>
            <div className="bg-[#030014]/80 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <p className={`text-xs md:text-sm font-medium ${agent.core ? 'text-amber-400 font-bold' : 'text-white/80'}`}>
                {agent.id}
              </p>
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}
