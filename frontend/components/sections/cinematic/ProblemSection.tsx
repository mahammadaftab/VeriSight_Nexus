"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, XCircle, SearchX } from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center py-24 px-6 overflow-hidden mt-40">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0515] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-display font-semibold mb-6 text-white"
        >
          Human review is <span className="text-red-400">breaking.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white/50"
        >
          Manual evidence processing cannot scale. Legacy systems rely on disjointed tools, creating blind spots where fraud thrives and SLA times collapse.
        </motion.p>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Slow Reviews */}
        <motion.div 
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass rounded-2xl p-8 border border-white/5 bg-gradient-to-br from-red-500/5 to-transparent relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full group-hover:bg-red-500/20 transition-colors" />
          <Clock className="w-10 h-10 text-red-400 mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-3">SLA Collapse</h3>
          <p className="text-white/50 leading-relaxed">Claims sit in human queues for days. Context switching between chat logs and image viewers destroys throughput.</p>
        </motion.div>

        {/* Card 2: Missing Evidence */}
        <motion.div 
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass rounded-2xl p-8 border border-white/5 bg-gradient-to-br from-amber-500/5 to-transparent relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full group-hover:bg-amber-500/20 transition-colors" />
          <SearchX className="w-10 h-10 text-amber-400 mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-3">Blind Spots</h3>
          <p className="text-white/50 leading-relaxed">Humans miss micro-details in noisy photos. Evidence rules are applied inconsistently based on operator fatigue.</p>
        </motion.div>

        {/* Card 3: Fraud */}
        <motion.div 
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="glass rounded-2xl p-8 border border-white/5 bg-gradient-to-br from-purple-500/5 to-transparent relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
          <AlertTriangle className="w-10 h-10 text-purple-400 mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-3">Undetected Fraud</h3>
          <p className="text-white/50 leading-relaxed">Sophisticated manipulation and recycled stock imagery bypass basic heuristics, bleeding millions from the bottom line.</p>
        </motion.div>
      </div>
    </section>
  );
}
