"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { METRICS } from "@/lib/constants";

function AnimatedCounter({
  value,
  suffix,
  prefix,
  duration = 2000,
  inView,
}: {
  value: number;
  suffix: string;
  prefix: string;
  duration?: number;
  inView: boolean;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const startTime = performance.now();
    const isDecimal = value % 1 !== 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * value;

      setDisplayed(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (progress < 1) {
        start = requestAnimationFrame(animate);
      }
    };

    start = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(start);
  }, [inView, value, duration]);

  return (
    <span>
      {prefix}
      {value % 1 !== 0 ? displayed.toFixed(1) : displayed.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function MetricsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-12 sm:py-16">
      <div className="section-divider mb-12" />
      <div
        ref={ref}
        className="max-w-6xl mx-auto px-4 sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8"
        >
          {METRICS.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1.5 tracking-tight">
                <AnimatedCounter
                  value={metric.value}
                  suffix={metric.suffix}
                  prefix={metric.prefix}
                  inView={inView}
                />
              </div>
              <div className="text-xs sm:text-sm text-white/40 font-medium">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="section-divider mt-12" />
    </section>
  );
}
