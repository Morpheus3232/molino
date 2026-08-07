"use client";

import { motion } from "framer-motion";

const METRICS = [
  { value: "3", label: "Sistemas cruzados" },
  { value: "1", label: "Mapa personal" },
  { value: "0", label: "Datos en servidores" },
];

export default function TrustMetrics() {
  return (
    <section className="bg-background border-t border-ink/10 py-12 sm:py-16">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 text-center">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {metric.value}
              </div>
              <div className="label-micro mt-2 text-muted/70 max-w-[8rem]">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}