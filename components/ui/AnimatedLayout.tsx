"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

  // Sin AnimatePresence a propósito (P0, 2026-08-22): con AnimatePresence,
  // key={pathname} se desincroniza del contenido real en navegación
  // client-side de Next.js — React ya pintó los children de la ruta nueva
  // mientras pathname todavía reporta la ruta vieja por un render más. Cuando
  // pathname se actualiza recién en el render siguiente, AnimatePresence lee
  // eso como "la instancia vieja debe salir" y le aplica la exit animation
  // (opacity → 0) al mismo nodo DOM que ya tiene pintado el contenido nuevo
  // — nunca vuelve a entrar. Resultado: página en blanco hasta refrescar.
  // Un motion.div plano fuera de AnimatePresence no tiene ese problema: el
  // cambio de key siempre dispara un remount limpio (initial → animate), sin
  // ventana de carrera. Se pierde el crossfade de salida de la ruta vieja;
  // el fade-in de la ruta nueva se mantiene igual.
  return (
    <motion.div
      key={pathname}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
