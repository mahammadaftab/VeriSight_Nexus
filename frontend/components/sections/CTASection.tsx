"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background effects */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-purple-500/[0.05] to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-medium text-white/50 tracking-wide">
              Ready for Production
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Make Every Claim{" "}
            <br className="hidden sm:block" />
            Decision{" "}
            <span className="gradient-text-hero">Defensible.</span>
          </h2>

          <p className="max-w-xl mx-auto text-base sm:text-lg text-white/40 leading-relaxed mb-10">
            Transform evidence into trusted, explainable outcomes with
            NexusVerify. Deploy in minutes, scale to millions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/dashboard" className="btn-primary group" id="cta-start-analysis">
              <span>Start Analysis</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#documentation" className="btn-secondary group" id="cta-view-docs">
              <BookOpen className="w-4 h-4" />
              <span>View Documentation</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
