"use client";

import { motion } from "framer-motion";

interface NumberBadgeProps {
  number: number;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export default function NumberBadge({ number, color = "#4A5568", size = "sm" }: NumberBadgeProps) {
  const sizes = {
    sm: "h-7 w-7 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`inline-flex items-center justify-center rounded-full font-medium ${sizes[size]}`}
      style={{ backgroundColor: `${color}20`, color }}
    >
      {number}
    </motion.span>
  );
}
