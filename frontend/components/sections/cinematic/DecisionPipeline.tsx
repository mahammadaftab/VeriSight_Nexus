"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";

const PIPELINE_STEPS = [
  {
    title: "1. Visual Reasoning",
    description: "The Vision Agent deeply inspects the submitted images, identifying specific object parts, damage signatures, and calculating a raw severity score.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30"
  },
  {
    title: "2. Rules Validation",
    description: "The Evidence Agent cross-references the visual findings against the exact evidence requirements for that specific object category.",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30"
  },
  {
    title: "3. Risk Assessment",
    description: "The Risk Agent analyzes historical user data, flags inconsistencies in the conversation, and scans the images for digital manipulation or recycling.",
    icon: ShieldAlert,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30"
  },
  {
    title: "4. Final Synthesis",
    description: "The Decision Engine fuses all sub-agent outputs, calculating a final Health Score and outputting a deterministic, explainable verdict.",
    icon: Cpu,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30"
  }
];

export default function DecisionPipeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section ref={containerRef} className="relative py-32 px-6">
      
      <div className="max-w-4xl mx-auto text-center mb-24 relative z-10">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
          Deterministic <span className="text-emerald-400">Pipeline</span>
        </h2>
        <p className="text-xl text-white/50">
          Traceable intelligence. Watch how raw visual and textual data is refined into a confident, actionable decision.
        </p>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Animated connecting line */}
        <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-white/5">
          <motion.div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500"
            style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          />
        </div>

        <div className="space-y-24">
          {PIPELINE_STEPS.map((step, idx) => {
            // Calculate when this specific step should activate based on scroll
            const start = idx * 0.2;
            const end = start + 0.2;
            const opacity = useTransform(scrollYProgress, [start, end], [0.3, 1]);
            const scale = useTransform(scrollYProgress, [start, end], [0.95, 1]);

            return (
              <motion.div 
                key={idx}
                style={{ opacity, scale }}
                className="relative flex items-start gap-8 md:gap-12 pl-4"
              >
                {/* Node */}
                <div className={`relative z-10 w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl border flex items-center justify-center backdrop-blur-md transition-colors ${step.bg} ${step.border}`}>
                  <step.icon className={`w-6 h-6 md:w-8 md:h-8 ${step.color}`} />
                </div>

                {/* Content */}
                <div className="pt-2">
                  <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-lg text-white/50 leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  );
}
