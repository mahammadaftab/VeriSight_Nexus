"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PERFORMANCE_METRICS } from "@/lib/constants";

function CircularProgress({
  value,
  unit,
  color,
  label,
  delay,
  inView,
}: {
  value: number;
  unit: string;
  color: string;
  label: string;
  delay: number;
  inView: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const normalizedValue = unit === "%" ? value : unit === "s" ? (value / 5) * 100 : unit === "$" ? value * 100 : value;

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / 2000, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(parseFloat((eased * value).toFixed(unit === "$" ? 2 : 1)));

      if (progress < 1) {
        start = requestAnimationFrame(animate);
      }
    };

    const timeout = setTimeout(() => {
      start = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      cancelAnimationFrame(start);
      clearTimeout(timeout);
    };
  }, [inView, value, delay, unit]);

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset } : {}}
            transition={{ duration: 2, delay, ease: "easeOut" }}
            className="drop-shadow-lg"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg sm:text-xl font-display font-bold text-white">
            {unit === "$" ? `$${displayValue.toFixed(2)}` : displayValue % 1 === 0 ? displayValue : displayValue.toFixed(1)}
          </span>
          <span className="text-[10px] text-white/30">
            {unit !== "$" ? unit : ""}
          </span>
        </div>
      </div>
      <span className="text-xs sm:text-sm font-medium text-white/50 text-center">
        {label}
      </span>
    </div>
  );
}

export default function PerformanceMetrics() {
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
          <span className="inline-block text-xs font-semibold text-amber-400/80 tracking-widest uppercase mb-4">
            Performance
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Enterprise{" "}
            <span className="text-amber-400/90">Benchmarks</span>
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-base sm:text-lg">
            Measured on real-world claim datasets with production configurations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card rounded-2xl p-8 sm:p-12"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-6">
            {PERFORMANCE_METRICS.map((metric, index) => (
              <CircularProgress
                key={metric.label}
                value={metric.value}
                unit={metric.unit}
                color={metric.color}
                label={metric.label}
                delay={0.3 + index * 0.15}
                inView={inView}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
