"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Logo from "@/components/ui/Logo";

// Intro ultra-liviano y no bloqueante: objetivo <=250ms con fade rápido.
// Pointer-events-none para nunca bloquear clics o LCP del usuario en el hero.
const MIN_DISPLAY_MS = 250;
const FADE_MS = 200;
const SESSION_KEY = "molino-intro-seen";

/**
 * Intro de carga del sitio: brand intro sutil y no bloqueante.
 * Desaparece rápidamente tras el primer paint sin retrasar LCP ni interactividad.
 * Solo aparece una vez por sesión y respeta prefers-reduced-motion.
 */
export default function SiteIntro() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"wind" | "fade" | "gone">("wind");

  useEffect(() => {
    if (reducedMotion) {
      setPhase("gone");
      return;
    }

    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
        setPhase("gone");
        return;
      }
    } catch {
      setPhase("gone");
      return;
    }

    let minTimer: ReturnType<typeof setTimeout> | null = null;
    let fadeTimer: ReturnType<typeof setTimeout> | null = null;

    const startFade = () => {
      setPhase((prev) => (prev === "gone" ? "gone" : "fade"));
      fadeTimer = setTimeout(() => {
        setPhase("gone");
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
      }, FADE_MS);
    };

    minTimer = setTimeout(() => {
      startFade();
    }, MIN_DISPLAY_MS);

    return () => {
      if (minTimer) clearTimeout(minTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [reducedMotion]);

  if (phase === "gone" || reducedMotion) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="site-intro"
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fade" ? 0 : 1 }}
        exit={{ opacity: 0, transition: { duration: FADE_MS / 1000, ease: "easeOut" } }}
        transition={{ duration: FADE_MS / 1000, ease: "easeOut" }}
        aria-hidden="true"
      >
        {/* Líneas de viento */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-ink/15"
              style={{
                top: `${28 + i * 14}%`,
                left: "-25%",
                width: `${18 + i * 3}%`,
              }}
              animate={{ x: ["0vw", "130vw"], opacity: [0, 0.7, 0] }}
              transition={{
                duration: 1.8 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Molino con aspas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center gap-6"
        >
          <div className="relative">
            <Logo wind className="w-24 h-24 sm:w-32 sm:h-32 text-ink" />
            {/* Halo detrás del molino */}
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-20 -z-10"
              style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
              aria-hidden="true"
            />
          </div>

          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl tracking-tight uppercase text-ink">Molino</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-muted mt-2">
              Mapa personal de autoconocimiento
            </p>
          </div>
        </motion.div>

        {/* Progreso de carga */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-px bg-ink/10 overflow-hidden" aria-hidden="true">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: MIN_DISPLAY_MS / 1000, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}