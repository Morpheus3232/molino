"use client";

import { motion } from "framer-motion";

interface EnergyBarsProps {
  bars: Record<string, number>;
  color?: string;
}

export default function EnergyBars({ bars, color = "#4A5568" }: EnergyBarsProps) {
  const entries = Object.entries(bars);

  return (
    <div className="space-y-3">
      {entries.map(([label, value], index) => (
        <div key={label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-muted">{label}</span>
            <span className="font-medium text-foreground">{value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
