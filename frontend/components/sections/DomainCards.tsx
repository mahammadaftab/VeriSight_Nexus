"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { DOMAIN_CARDS } from "@/lib/constants";

export default function DomainCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-cyan-400/80 tracking-widest uppercase mb-4">
            Domain Intelligence
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Multi-Domain{" "}
            <span className="gradient-text-blue">Damage Detection</span>
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-base sm:text-lg">
            Specialized vision models trained for each asset category,
            delivering precision across automotive, electronics, and logistics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {DOMAIN_CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group perspective-1000"
              style={{ perspective: "1000px" }}
            >
              <motion.div
                animate={{
                  rotateY: hoveredIndex === index ? 3 : 0,
                  rotateX: hoveredIndex === index ? -3 : 0,
                  scale: hoveredIndex === index ? 1.02 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`glass-card rounded-2xl p-6 sm:p-8 h-full ${card.borderColor} hover:border-opacity-50 relative overflow-hidden`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Emoji */}
                  <div className="text-4xl mb-5">{card.emoji}</div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold text-white mb-5 tracking-tight`}>
                    {card.title}
                  </h3>

                  {/* Detections */}
                  <div className="mb-5">
                    <div className={`text-[10px] font-semibold ${card.accentColor} tracking-widest uppercase mb-3`}>
                      Detects
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {card.detections.map((d) => (
                        <span
                          key={d}
                          className="px-2.5 py-1 text-xs font-medium text-white/60 bg-white/[0.04] rounded-lg border border-white/[0.06]"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Parts */}
                  <div>
                    <div className={`text-[10px] font-semibold ${card.accentColor} tracking-widest uppercase mb-3`}>
                      Object Parts
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {card.parts.map((p) => (
                        <div
                          key={p}
                          className="flex items-center gap-1.5 text-xs text-white/40"
                        >
                          <div className={`w-1 h-1 rounded-full ${card.accentColor.replace('text-', 'bg-')}`} />
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
