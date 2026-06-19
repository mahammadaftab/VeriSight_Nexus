"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export default function LivePlatformPreview() {
  return (
    <section className="relative min-h-[120vh] py-32 px-6 flex flex-col items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 bg-[#030014]" />
      <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
        >
          Not a prototype. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">A live platform.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white/50 mb-10"
        >
          Nexus Core is fully operational. Connect to our API or use the command center to process real claims right now.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold overflow-hidden transition-transform hover:scale-105"
          >
            <span className="relative z-10">Launch Command Center</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 100, rotateX: 20 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[1400px] mx-auto rounded-xl border border-white/20 bg-black shadow-[0_0_100px_rgba(59,130,246,0.3)] overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        {/* Mockup Topbar */}
        <div className="h-10 border-b border-white/10 bg-[#0a0a0a] flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="mx-auto flex items-center gap-2 px-3 py-1 bg-white/5 rounded-md border border-white/10">
            <Terminal className="w-3 h-3 text-white/40" />
            <span className="text-[10px] text-white/40 font-mono">nexus.verisight.io/dashboard</span>
          </div>
        </div>
        
        {/* Iframe to live dashboard to literally prove it's real */}
        <div className="w-full aspect-video bg-[#030014] relative">
          <div className="absolute inset-0 flex items-center justify-center text-white/20">
            <p className="text-sm font-mono animate-pulse">Loading live production environment...</p>
          </div>
          {/* We use an iframe pointing to the actual dashboard so it literally is the real app! */}
          <iframe 
            src="/dashboard" 
            className="absolute inset-0 w-full h-full border-0 relative z-10"
            style={{ pointerEvents: 'none' }} // Disable pointer events so they click the hero button instead
          />
        </div>
      </motion.div>
    </section>
  );
}
