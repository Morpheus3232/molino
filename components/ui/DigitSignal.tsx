"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";

interface DigitSignalProps {
  digit: string;
  index: number;
  isActive: boolean;
  isComplete: boolean;
  group: 0 | 1 | 2; // 0=day, 1=month, 2=year
}

const GROUP_LABELS = ["DÍA", "MES", "AÑO"] as const;

export default function DigitSignal({ digit, index, isActive, isComplete, group }: DigitSignalProps) {
  const reduceMotion = useSafeReducedMotion();
  const filled = digit !== "" && digit !== "·";

  return (
    <motion.div
      initial={false}
      animate={
        filled
          ? { opacity: 1, scale: 1, y: 0 }
          : isActive
            ? { opacity: reduceMotion ? 1 : 0.6, scale: reduceMotion ? 1 : 1.08, y: reduceMotion ? 0 : -4 }
            : { opacity: 0.25, scale: 0.92, y: 0 }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : filled
            ? { duration: 0.22, ease: "easeOut" }
            : isActive
              ? { duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
              : { duration: 0.3, ease: "easeOut" }
      }
      className={`flex h-12 w-9 items-center justify-center border-b-2 font-mono text-2xl tabular-nums transition-colors duration-300 ${
        filled
          ? "border-accent/70 text-foreground"
          : isActive
            ? "border-accent/50 text-accent/60"
            : "border-border/40 text-muted/40"
      }`}
      style={{ willChange: "transform, opacity" }}
    >
      {filled ? digit : "·"}
    </motion.div>
  );
}