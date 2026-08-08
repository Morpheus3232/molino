"use client";

import { motion } from "framer-motion";
import { getScoreColor, getScoreLabel } from "@/lib/utils/score";

interface ScoreDisplayProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

export default function ScoreDisplay({ score, size = "md" }: ScoreDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`font-bold uppercase tracking-[0.2em] ${sizeClasses[size]} px-3 py-1`}
      style={{ color: getScoreColor(score), backgroundColor: "var(--score-bg)" }}
    >
      {getScoreLabel(score)}
    </motion.div>
  );
}
