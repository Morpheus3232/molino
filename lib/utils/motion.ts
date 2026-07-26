// Centralized framer-motion animation variants
// Use these instead of defining animations inline

import { useEffect, useState } from "react";

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Hook for reduced motion state in components
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// Fade in from below (most common)
export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// Fade in from below with custom delay
export const fadeUpDelayed = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

// Simple fade in
export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

// Scale up from center
export const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

// Stagger container (use with staggerChildren)
export const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, margin: "-40px" },
};

// Stagger item (use inside staggerContainer)
export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

// Page enter (for route transitions)
export const pageEnter = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" as const },
};

// Stagger section reveal (use on section wrapper)
export const staggerSection = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  viewport: { once: true, margin: "-60px" },
};

// Stagger item for cards inside a section
export const staggerCard = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// Number badge reveal (scale + fade)
export const numberReveal = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
};

// Hover lift (for cards)
export const hoverLift = {
  whileHover: { y: -4 },
  transition: { duration: 0.2, ease: "easeOut" as const },
};

// Hover scale (for buttons)
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15, ease: "easeOut" as const },
};
