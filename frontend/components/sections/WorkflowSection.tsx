"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { WORKFLOW_AGENTS } from "@/lib/constants";

export default function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="workflow" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-purple-400/80 tracking-widest uppercase mb-4">
            Agent Pipeline
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Multi-Agent{" "}
            <span className="gradient-text-purple">Orchestration</span>
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-base sm:text-lg">
            Seven specialized agents collaborate through a coordinated pipeline
            to deliver accurate, explainable decisions.
          </p>
        </motion.div>

        {/* Pipeline Visualization */}
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical connection line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-pink-500/30 origin-top"
          />

          {/* Animated data flow on the line */}
          {inView && (
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px overflow-hidden">
              <motion.div
                className="w-full h-8 bg-gradient-to-b from-transparent via-purple-400/60 to-transparent"
                animate={{ y: ["-100%", "800%"] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          )}

          {/* Agent nodes */}
          <div className="space-y-3">
            {WORKFLOW_AGENTS.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.12 }}
                className="relative pl-14 sm:pl-20"
              >
                {/* Node dot */}
                <div className="absolute left-4 sm:left-6 top-5 z-10">
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      borderColor: agent.color,
                      backgroundColor: `${agent.color}20`,
                    }}
                  >
                    {/* Pulse ring */}
                    {inView && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ borderColor: agent.color, border: `1px solid ${agent.color}` }}
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Card */}
                <button
                  onClick={() => setExpanded(expanded === agent.id ? null : agent.id)}
                  className="w-full text-left glass-card rounded-xl p-4 sm:p-5 group hover:border-white/15 transition-all duration-300"
                  id={`workflow-agent-${agent.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: agent.color }}
                      />
                      <h3 className="text-sm sm:text-base font-semibold text-white/80 group-hover:text-white transition-colors">
                        {agent.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline text-[10px] font-medium text-emerald-400/60 bg-emerald-400/8 px-2 py-0.5 rounded-full">
                        {agent.status.toUpperCase()}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-white/30 transition-transform duration-300 ${
                          expanded === agent.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {expanded === agent.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-white/40 mt-3 pt-3 border-t border-white/[0.04] leading-relaxed">
                          {agent.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
