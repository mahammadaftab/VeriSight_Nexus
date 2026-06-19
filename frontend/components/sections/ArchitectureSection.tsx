"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ARCHITECTURE_LAYERS } from "@/lib/constants";

export default function ArchitectureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="architecture" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-cyan-400/80 tracking-widest uppercase mb-4">
            System Design
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Enterprise{" "}
            <span className="gradient-text-blue">Architecture</span>
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-base sm:text-lg">
            A layered, production-grade architecture designed for scalability,
            reliability, and observability.
          </p>
        </motion.div>

        {/* Architecture diagram */}
        <div className="max-w-2xl mx-auto">
          {/* Layer stack */}
          <div className="space-y-3">
            {ARCHITECTURE_LAYERS.map((layer, index) => (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="relative group"
              >
                {/* Connection line to next layer */}
                {index < ARCHITECTURE_LAYERS.length - 1 && (
                  <div className="absolute left-1/2 bottom-0 translate-y-full w-px h-3 z-10">
                    <motion.div
                      className="w-full h-full"
                      style={{ backgroundColor: layer.color + "40" }}
                      initial={{ scaleY: 0 }}
                      animate={inView ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    />
                    {/* Animated data dot */}
                    {inView && (
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: layer.color }}
                        animate={{ y: [0, 12], opacity: [1, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: index * 0.4,
                        }}
                      />
                    )}
                  </div>
                )}

                <div className="glass-card rounded-xl p-4 sm:p-5 flex items-center gap-4 hover:border-white/12 transition-all duration-300 relative overflow-hidden">
                  {/* Colored left accent */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                    style={{ backgroundColor: layer.color + "60" }}
                  />

                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse at 0% 50%, ${layer.color}08 0%, transparent 70%)`,
                    }}
                  />

                  {/* Node indicator */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: layer.color + "15" }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                    </div>
                    {/* Pulse */}
                    {inView && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{ border: `1px solid ${layer.color}` }}
                        animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      />
                    )}
                  </div>

                  <div className="relative">
                    <h3 className="text-sm sm:text-base font-semibold text-white/80">
                      {layer.name}
                    </h3>
                    <p className="text-xs text-white/35">{layer.description}</p>
                  </div>

                  {/* Status */}
                  <div className="ml-auto flex-shrink-0 hidden sm:flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-[10px] text-white/30 font-medium">ACTIVE</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
