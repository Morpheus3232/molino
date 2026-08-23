"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useRevealFallback } from "@/lib/hooks/useRevealFallback";

interface SectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function Section({ children, className, delay = 0 }: SectionProps) {
  // Failsafe anti-blanco: si whileInView no dispara Y la sección ya está
  // cerca del viewport, animate fuerza visible tras 1.5s — ver
  // useRevealFallback. Below-the-fold sigue dependiendo de whileInView.
  const { ref, forceVisible } = useRevealFallback();
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      {...(forceVisible
        ? { animate: { opacity: 1, y: 0 } }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.1 },
          })}
      transition={{ duration: 0.6, delay }}
      className={`section-spacing ${className || ""}`}
    >
      {children}
    </motion.section>
  );
}
