"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { EVALUATION_EXAMPLES } from "@/lib/constants";

const STATUS_ICONS = {
  Supported: CheckCircle2,
  Contradicted: XCircle,
  "Not Enough Information": AlertCircle,
};

export default function EvaluationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeExample, setActiveExample] = useState(0);

  return (
    <section id="evaluation" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-emerald-400/80 tracking-widest uppercase mb-4">
            Decision Examples
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Explainable{" "}
            <span className="gradient-text-emerald">Verdicts</span>
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-base sm:text-lg">
            Every decision includes structured justifications grounded in
            specific image evidence.
          </p>
        </motion.div>

        {/* Example selector tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-2 sm:gap-3 mb-10"
        >
          {EVALUATION_EXAMPLES.map((example, index) => {
            const Icon = STATUS_ICONS[example.type as keyof typeof STATUS_ICONS];
            return (
              <button
                key={example.type}
                onClick={() => setActiveExample(index)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeExample === index
                    ? "glass-strong text-white"
                    : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
                }`}
                id={`eval-tab-${example.type.toLowerCase().replace(/\s/g, "-")}`}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: example.color }}
                />
                <span className="hidden sm:inline">{example.type}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Example card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeExample}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            {(() => {
              const example = EVALUATION_EXAMPLES[activeExample];
              const Icon = STATUS_ICONS[example.type as keyof typeof STATUS_ICONS];
              return (
                <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${example.color}60, transparent)`,
                    }}
                  />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: example.color + "15" }}
                      >
                        <Icon className="w-5 h-5" style={{ color: example.color }} />
                      </div>
                      <div>
                        <div
                          className="text-sm font-semibold"
                          style={{ color: example.color }}
                        >
                          {example.type}
                        </div>
                        <div className="text-xs text-white/40">{example.summary}</div>
                      </div>
                    </div>
                    {/* Confidence */}
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold text-white">
                        {example.confidence}%
                      </div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">
                        Confidence
                      </div>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="h-1.5 rounded-full bg-white/[0.04] mb-6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${example.confidence}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: example.color }}
                    />
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                        Object
                      </div>
                      <div className="text-sm font-medium text-white/70">
                        {example.claimObject}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                        Issue
                      </div>
                      <div className="text-sm font-medium text-white/70">
                        {example.issueType}
                      </div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                        Part
                      </div>
                      <div className="text-sm font-medium text-white/70">
                        {example.objectPart}
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="glass rounded-xl p-4">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">
                      AI Explanation
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {example.explanation}
                    </p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
