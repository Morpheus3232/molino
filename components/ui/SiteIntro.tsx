"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Logo from "@/components/ui/Logo";

const MIN_DISPLAY_MS = 2200;
const FADE_MS = 700;
const SESSION_KEY = "molino-intro-seen";

/**
 * Intro de carga del sitio: un molino grande recibe el viento y sus aspas
 * aceleran mientras la página termina de cargar. Se desvanece al llegar
 * el evento window "load" (con un mínimo de visualización para que la
 * ráfaga se aprecie). Solo aparece una vez por sesión.
 */
export default function SiteIntro() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"wind" | "fade" | "gone">("wind");

  useEffect(() => {
    if (reducedMotion) {
      setPhase("gone");
      return;
    }

    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      setPhase("gone");
      return;
    }

    let minTimer: ReturnType<typeof setTimeout> | null = null;
    let loadTimer: ReturnType<typeof setTimeout> | null = null;
    let fadeTimer: ReturnType<typeof setTimeout> | null = null;

    const startFade = () => {
      if (phase === "gone") return;
      setPhase("fade");
      fadeTimer = setTimeout(() => {
        setPhase("gone");
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
      }, FADE_MS);
    };

    minTimer = setTimeout(() => {
      if (document.readyState === "complete") {
        startFade();
      } else {
        window.addEventListener("load", startFade, { once: true });
      }
    }, MIN_DISPLAY_MS);

    return () => {
      if (minTimer) clearTimeout(minTimer);
      if (loadTimer) clearTimeout(loadTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
      window.removeEventListener("load", startFade);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (phase === "gone") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="site-intro"
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
        exit={{ opacity: 0, transition: { duration: FADE_MS / 1000, ease: "easeOut" } }}
        aria-hidden="true"
      >
        {/* Líneas de viento */}
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
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
                duration: 2.6 + i * 0.6,
                repeat: Infinity,
                delay: i * 0.45,
                ease: "linear",
              }}
            />
          ))}
        </motion.div>

        {/* Molino con aspas acelerando */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center gap-8"
        >
          <motion.div
            animate={{ rotate: [0, 6, 0, -6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <Logo wind className="w-32 h-32 sm:w-40 sm:h-40 text-ink" />
            {/* Halo de viento detrás del molino */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-25 -z-10"
              style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
              aria-hidden="true"
            />
          </motion.div>

          <div className="text-center">
            <p className="font-display text-3xl sm:text-4xl tracking-tight uppercase text-ink">Molino</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-muted mt-3">
              Mapa personal de autoconocimiento
            </p>
          </div>
        </motion.div>

        {/* Progreso de carga */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-40 h-px bg-ink/10 overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            className="h-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: MIN_DISPLAY_MS / 1000, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}