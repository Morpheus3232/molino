"use client";

import { motion } from "framer-motion";

interface CompatibilityRingProps {
  score: number;
  color?: string;
  size?: number;
  label?: string;
}

export default function CompatibilityRing({
  score,
  color = "#4A5568",
  size = 80,
  label,
}: CompatibilityRingProps) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-foreground">{score}%</span>
        </div>
      </div>
      {label && <span className="text-xs text-muted">{label}</span>}
    </div>
  );
}
