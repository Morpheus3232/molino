"use client";

import { motion } from "framer-motion";
import { useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-[60] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}