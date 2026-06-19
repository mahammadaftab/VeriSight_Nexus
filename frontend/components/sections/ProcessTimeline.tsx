"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PROCESS_STEPS } from "@/lib/constants";
import {
  Upload,
  MessageSquare,
  ClipboardCheck,
  ShieldAlert,
  Brain,
  FileOutput,
} from "lucide-react";

const STEP_ICONS = [Upload, MessageSquare, ClipboardCheck, ShieldAlert, Brain, FileOutput];

export default function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-indigo-400/80 tracking-widest uppercase mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            From Upload to{" "}
            <span className="gradient-text-purple">Decision</span>
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-base sm:text-lg">
            Six streamlined steps from evidence submission to structured,
            auditable output.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Vertical line (mobile) */}
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/10 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = STEP_ICONS[index];
              const gradients = [
                "from-blue-500 to-cyan-500",
                "from-purple-500 to-pink-500",
                "from-emerald-500 to-teal-500",
                "from-orange-500 to-amber-500",
                "from-red-500 to-rose-500",
                "from-indigo-500 to-violet-500",
              ];

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.12 }}
                  className="relative pl-14 lg:pl-0"
                >
                  {/* Step node */}
                  <div className="lg:flex lg:justify-center lg:mb-6">
                    <div className="absolute left-3.5 top-0 lg:static">
                      <div
                        className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br ${gradients[index]} flex items-center justify-center relative`}
                      >
                        <span className="text-xs font-bold text-white">
                          {step.step}
                        </span>
                        {/* Pulse */}
                        {inView && (
                          <motion.div
                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradients[index]} opacity-30`}
                            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.3,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:text-center">
                    <div className="flex lg:justify-center mb-2">
                      <Icon className="w-4 h-4 text-white/30" />
                    </div>
                    <h3 className="text-sm font-semibold text-white/80 mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-white/35 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
