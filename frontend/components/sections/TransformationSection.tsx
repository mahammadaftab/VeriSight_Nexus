"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  X,
  Check,
  Users,
  Bot,
  FileSearch,
  Zap,
  Clock,
  Shield,
} from "lucide-react";

const BEFORE_ITEMS = [
  { icon: Users, label: "Manual human reviewers", detail: "15-45 min per claim" },
  { icon: FileSearch, label: "Fragmented evidence checks", detail: "Inconsistent criteria" },
  { icon: Clock, label: "Days to resolution", detail: "Backlogs pile up" },
  { icon: X, label: "No explainability", detail: "Black-box decisions" },
];

const AFTER_ITEMS = [
  { icon: Bot, label: "Multi-agent AI pipeline", detail: "7 specialized agents" },
  { icon: Shield, label: "Standardized validation", detail: "Evidence requirements" },
  { icon: Zap, label: "Sub-2s decisions", detail: "Real-time processing" },
  { icon: Check, label: "Full explainability", detail: "Audit-ready output" },
];

export default function TransformationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-emerald-400/80 tracking-widest uppercase mb-4">
            The Transformation
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            From Manual to{" "}
            <span className="gradient-text-emerald">AI-Driven</span>
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-base sm:text-lg">
            NexusVerify replaces fragmented workflows with a unified,
            explainable intelligence platform.
          </p>
        </motion.div>

        {/* Before/After comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-3 max-w-5xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card rounded-2xl p-6 sm:p-8 border-red-500/10 hover:border-red-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                <X className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Before</h3>
                <p className="text-xs text-red-400/60">Manual, Fragmented, Expensive</p>
              </div>
            </div>
            <div className="space-y-4">
              {BEFORE_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-red-400/50" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/60">{item.label}</div>
                    <div className="text-xs text-white/30">{item.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card rounded-2xl p-6 sm:p-8 border-emerald-500/10 hover:border-emerald-500/20 relative overflow-hidden"
          >
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">After</h3>
                  <p className="text-xs text-emerald-400/60">AI-Driven, Explainable, Scalable</p>
                </div>
              </div>
              <div className="space-y-4">
                {AFTER_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-emerald-400/60" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/70">{item.label}</div>
                      <div className="text-xs text-white/30">{item.detail}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gradient divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="hidden lg:block absolute left-1/2 top-[55%] bottom-[20%] w-px bg-gradient-to-b from-red-500/30 via-purple-500/30 to-emerald-500/30"
        />
      </div>
    </section>
  );
}
