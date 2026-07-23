"use client";

import { motion } from "framer-motion";
import { getScoreColor, getScoreLabel, getScoreBgColor } from "@/lib/utils/score";

interface ScoreDisplayProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

export default function ScoreDisplay({ score, label, size = "md" }: ScoreDisplayProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`font-bold ${getScoreColor(score)} ${sizeClasses[size]} px-3 py-1 rounded-full`}
    >
      {score}%
    </motion.div>
  );
}
