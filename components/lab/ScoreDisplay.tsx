"use client";

import { motion } from "framer-motion";
import { getScoreColor } from "@/lib/utils/score";

interface ScoreDisplayProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

export default function ScoreDisplay({ score, label, size = "md" }: ScoreDisplayProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`font-bold ${sizeClasses[size]} px-3 py-1`}
      style={{ color: getScoreColor(score), backgroundColor: "var(--score-bg)" }}
    >
      {score}%
    </motion.div>
  );
}
