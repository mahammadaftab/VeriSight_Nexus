"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Eye,
  MessageSquareText,
  ClipboardCheck,
  ShieldCheck,
  Gauge,
  FileText,
} from "lucide-react";
import { FEATURES } from "@/lib/constants";

const ICONS: Record<string, React.ElementType> = {
  Eye,
  MessageSquareText,
  ClipboardCheck,
  ShieldCheck,
  Gauge,
  FileText,
};

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-blue-400/80 tracking-widest uppercase mb-4">
            Capabilities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Enterprise{" "}
            <span className="gradient-text-blue">Intelligence</span>{" "}
            Suite
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-base sm:text-lg">
            Six specialized modules working in concert to deliver
            comprehensive claim verification.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((feature, index) => {
            const Icon = ICONS[feature.icon];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group relative"
              >
                <div className="glass-card rounded-2xl p-6 sm:p-7 h-full relative overflow-hidden hover:border-white/15 transition-all duration-500">
                  {/* Gradient accent on hover */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 flex items-center justify-center mb-5 relative`}>
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-10`} />
                    <Icon className="w-5 h-5 text-white/80 relative z-10" />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-semibold text-white mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Metric badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                    <span className="text-xs font-medium text-white/50">
                      {feature.metric}
                    </span>
                  </div>

                  {/* Mini visualization bar */}
                  <div className="mt-5 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${70 + index * 5}%` } : {}}
                      transition={{ duration: 1.5, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${feature.gradient} opacity-50`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
