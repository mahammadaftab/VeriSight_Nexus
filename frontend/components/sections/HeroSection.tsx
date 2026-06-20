"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import dynamic from "next/dynamic";

const NeuralParticles = dynamic(() => import("@/components/visuals/NeuralParticles"), { ssr: false });
const AICommandCenter = dynamic(() => import("@/components/visuals/AICommandCenter"), { ssr: false });

export default function HeroSection() {
  return (
    <section
      id="product"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-16 px-4"
    >
      {/* Background layers */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="aurora-bg" />
      <NeuralParticles />

      {/* Radial spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-blue-500/[0.07] via-purple-500/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-white/60 tracking-wide">
            Built for Enterprise-Scale Evidence Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="gradient-text-hero">
            Transforming Images, Claims,
          </span>
          <br />
          <span className="gradient-text-hero">
            and History Into
          </span>
          <br />
          <span className="text-white">
            Trusted Decisions.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-white/50 leading-relaxed mb-10"
        >
          NexusVerify combines Vision AI, Evidence Intelligence, Risk Analytics,
          and Multi-Agent Reasoning to automate damage claim verification with
          explainable decisions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a href="/dashboard" className="btn-primary group" id="hero-cta-primary">
            <span>Launch Analysis</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#architecture" className="btn-secondary group" id="hero-cta-secondary">
            <Layers className="w-4 h-4" />
            <span>Explore Architecture</span>
          </a>
        </motion.div>

        {/* AI Command Center */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <AICommandCenter />
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-space-900 to-transparent pointer-events-none" />
    </section>
  );
}
