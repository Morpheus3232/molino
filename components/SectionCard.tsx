"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function SectionCard({ children, className = "", delay = 0 }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`rounded-2xl bg-card p-5 shadow-lg border border-border ${className}`}
    >
      {children}
    </motion.div>
  );
}
