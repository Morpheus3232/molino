"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { subscribeLoading } from "@/lib/utils/loadingSignal";

interface LogoProps {
  className?: string;
  spinning?: boolean;
  wind?: boolean;
}

/**
 * Molino clásico de campo — 4 aspas sólidas que se leen a cualquier tamaño.
 * La torre queda quieta. Solo el rotor gira.
 *
 * - wind: arranque con viento (easeInOut, el rotor acelera como una ráfaga)
 * - spinning: rotación lineal continua (procesos de carga reales)
 * - sin nada: gira durante la carga inicial del sitio y cada navegación
 */
export default function Logo({ className = "w-6 h-6", spinning, wind }: LogoProps) {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const pathRef = useRef(pathname);

  // Gira durante la carga inicial del sitio
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onLoad = () => setInitialLoading(false);
    const t = setTimeout(() => setInitialLoading(false), 3000);
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(t);
    };
  }, []);

  // Navegación terminada: pathname cambió → dejar de girar
  useEffect(() => {
    if (pathRef.current !== pathname) {
      pathRef.current = pathname;
      setNavLoading(false);
    }
  }, [pathname]);

  // Navegación iniciada: clic en enlace interno → girar hasta que cargue
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const el = (e.target as HTMLElement).closest?.("a");
      if (!el) return;
      const href = el.getAttribute("href") ?? "";
      const target = el.getAttribute("target");
      if (
        target === "_blank" ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:")
      ) {
        return;
      }
      setNavLoading(true);
      // Respaldo: si la navegación no cambia de pathname, detener igual
      setTimeout(() => setNavLoading(false), 8000);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => subscribeLoading(setGlobalLoading), []);

  const isWind = wind && !reducedMotion;
  const spinningActive = spinning ?? (globalLoading || navLoading || initialLoading);
  const isSpinning = !wind && spinningActive && !reducedMotion;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* ═══ TORRE — trapezoidal, QUIETA ═══ */}
      <path d="M11 30 L13.8 14.5 L18.2 14.5 L21 30 Z" />
      {/* Travesaños */}
      <line x1="12.3" y1="24" x2="19.7" y2="24" strokeWidth="0.9" />
      <line x1="13" y1="19.5" x2="19" y2="19.5" strokeWidth="0.9" />
      {/* Puerta */}
      <rect x="15" y="24.5" width="2" height="5.5" strokeWidth="0.8" />

      {/* ═══ CAP — cabeza del molino ═══ */}
      <rect x="12.8" y="10.2" width="6.4" height="4.3" strokeWidth="1.6" />

      {/* ═══ ROTOR — 4 aspas sólidas, el único elemento que gira ═══ */}
      <motion.g
        style={{ transformOrigin: "16px 11px" }}
        animate={
          isWind
            ? { rotate: [0, 360] }
            : isSpinning
              ? { rotate: 360 }
              : { rotate: 0 }
        }
        transition={
          isWind
            ? {
                duration: 1.4,
                ease: [0.25, 0.1, 0.25, 1],
                repeat: Infinity,
                repeatType: "mirror",
              }
            : isSpinning
              ? { duration: 1.3, ease: "linear", repeat: Infinity }
              : { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
        }
      >
        {[0, 90, 180, 270].map((angle) => (
          <path
            key={angle}
            transform={`rotate(${angle} 16 11)`}
            d="M13.9 10.6 L15 1.9 L17 1.9 L18.1 10.6 Z"
            fill="currentColor"
            stroke="none"
          />
        ))}
        {/* Cubo central */}
        <circle cx="16" cy="11" r="1.9" fill="currentColor" stroke="none" />
      </motion.g>
    </svg>
  );
}
