"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/utils/motion-hooks";
import { startLoading, stopLoading } from "@/lib/utils/loadingSignal";

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

// Cuánto gira el molino del header en cada navegación. El rotor tarda 1.1s
// por vuelta (ver Logo.tsx) — menos que eso y el giro es imperceptible, se
// corta a mitad de camino. 1100ms deja ver una vuelta completa y limpia.
const NAV_SPIN_MS = 1100;

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const mounted = useRef(false);

  useEffect(() => {
    // La primera carga ya tiene su propia animación en SiteIntro — el molino
    // del header solo gira en navegaciones posteriores, no al montar.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    startLoading();
    const timer = setTimeout(stopLoading, NAV_SPIN_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

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
