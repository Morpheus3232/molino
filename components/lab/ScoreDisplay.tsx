"use client";

import { motion } from "framer-motion";
import { getScoreBgColor, getScoreLabel } from "@/lib/utils/score";

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
      className={`font-bold ${getScoreBgColor(score)} ${sizeClasses[size]} px-3 py-1`}
    >
      {score}%
    </motion.div>
  );
}
