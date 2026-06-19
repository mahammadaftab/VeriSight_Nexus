"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShieldAlert,
  ImageOff,
  Scale,
  Clock,
  TrendingDown,
} from "lucide-react";
import { PAIN_POINTS } from "@/lib/constants";

const ICONS: Record<string, React.ElementType> = {
  ShieldAlert,
  ImageOff,
  Scale,
  Clock,
  TrendingDown,
};

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="problem" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-red-400/80 tracking-widest uppercase mb-4">
            The Problem
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Manual Claim Review is{" "}
            <span className="text-red-400/90">Broken</span>
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-base sm:text-lg">
            Traditional evidence review suffers from systemic inefficiencies
            that cost the industry billions annually.
          </p>
        </motion.div>

        {/* Broken workflow visualization */}
        <div className="relative mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 max-w-4xl mx-auto"
          >
            {["Submit Claim", "Manual Review", "Evidence Check", "Decision", "Report"].map(
              (step, i) => (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex-1 glass-card rounded-xl p-4 text-center relative group">
                    <div className="text-sm font-medium text-white/40 group-hover:text-white/60 transition-colors">
                      {step}
                    </div>
                    {/* Broken indicator */}
                    {i > 0 && i < 4 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500/80 animate-pulse" />
                    )}
                  </div>
                  {i < 4 && (
                    <div className="hidden sm:block w-6 sm:w-8 h-px mx-1 relative">
                      <div className="absolute inset-0 bg-red-500/20" />
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={inView ? { scaleX: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                        className="absolute inset-0 bg-gradient-to-r from-red-500/40 to-red-500/10 origin-left"
                        style={{
                          clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${
                            i === 1 || i === 2 ? "40% 50%" : "0 0"
                          })`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            )}
          </motion.div>
        </div>

        {/* Pain points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PAIN_POINTS.map((point, index) => {
            const Icon = ICONS[point.icon];
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="glass-card rounded-xl p-5 group hover:border-red-500/20"
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/15 transition-colors">
                  <Icon className="w-5 h-5 text-red-400/70" />
                </div>
                <h3 className="text-sm font-semibold text-white/80 mb-2">
                  {point.title}
                </h3>
                <p className="text-xs text-white/35 leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
