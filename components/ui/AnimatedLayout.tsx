"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/utils/motion";

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? undefined : { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
        transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
