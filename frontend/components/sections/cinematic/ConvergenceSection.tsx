"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Network } from "lucide-react";

export default function ConvergenceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0.5, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], [20, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
      
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <motion.div 
        style={{ scale, opacity, filter: `blur(${blur}px)` }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        {/* Core Glowing Orb */}
        <div className="relative flex items-center justify-center w-64 h-64 md:w-96 md:h-96">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-[100px] opacity-50 animate-pulse" />
          <div className="absolute inset-4 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full blur-[40px] opacity-80" />
          
          <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 bg-[#030014] rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.6)]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay rounded-full" />
            <Network className="w-16 h-16 md:w-24 md:h-24 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </div>

          {/* Orbiting Elements (simulated via CSS) */}
          <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
            <div className="absolute -top-4 left-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
          </div>
          <div className="absolute inset-[-20%] animate-[spin_15s_linear_infinite_reverse]">
            <div className="absolute top-1/2 -right-4 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 text-center max-w-2xl px-6"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-6">
            Enter Nexus Core
          </h2>
          <p className="text-xl text-white/50 font-light">
            We built a multi-agent orchestration layer that replaces chaos with deterministic, verifiable intelligence.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
