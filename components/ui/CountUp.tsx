"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/utils/motion-hooks";

/**
 * Animated counter — Spotify Wrapped / Apple Health style.
 * Counts from 0 to target number when in viewport.
 * Respects prefers-reduced-motion: shows final value immediately.
 */
export default function CountUp({
  target,
  duration = 1.2,
  className = "",
  prefix = "",
  suffix = "",
}: {
  target: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (reducedMotion) {
      setCount(target);
      return;
    }
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration, reducedMotion]);

  return (
    <motion.span
      ref={ref}
      initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
    >
      {prefix}{count}{suffix}
    </motion.span>
  );
}
