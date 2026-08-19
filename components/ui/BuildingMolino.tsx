"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import Logo from "@/components/ui/Logo";

interface BuildingMolinoProps {
  /** True once the real fetch has settled (success or error) and the
   * checklist should catch up to a finished state. */
  done: boolean;
  /** Fired once, after the checklist has visually finished — the caller
   * swaps in real content only after this, never the instant `done` flips,
   * so the reveal always completes instead of cutting off mid-step. */
  onComplete: () => void;
}

/**
 * Post-payment reveal for the paid synthesis (personal_profile). Payment
 * confirmation already happened in PremiumGate — by the time this mounts,
 * there is exactly one real wait left (the /api/intelligence/interpret
 * fetch, usually a few seconds). A single "Preparando tu lectura…" pulse
 * undersold that moment for what it's actually gating: the deepest,
 * highest-priced content in the product.
 *
 * This paces a short checklist instead of one flat spinner. The first steps
 * describe deterministic work Molino already did before this component
 * mounted (patterns/tensions are computed synchronously in
 * IntelligenceScreen); the last step is the one that's actually still
 * pending. `done` can flip true at any point — early (fast AI response) or
 * late — and the checklist always catches up to a real finished state
 * instead of either stalling on a false wait or cutting off mid-step.
 *
 * The presentation reads as a document being composed for the reader: the
 * active step is typeset as the headline, a hairline progress rule tracks
 * the build with a blinking composing caret, and the checklist below logs
 * each finished step. All motion degrades gracefully under
 * prefers-reduced-motion (checked via useReducedMotion); the pacing logic
 * itself is unaffected.
 */
const STEPS = [
  "Leyendo tu mapa",
  "Cruzando tus sistemas",
  "Detectando tus tensiones",
  "Preparando tu síntesis",
];

const STEP_INTERVAL_MS = 550;
const CATCH_UP_INTERVAL_MS = 140;

const CHECK_MARK = (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--color-paper)"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function BuildingMolino({ done, onComplete }: BuildingMolinoProps) {
  const reduceMotion = useSafeReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const doneRef = useRef(done);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    doneRef.current = done;
    onCompleteRef.current = onComplete;
  }, [done, onComplete]);

  // El checklist deja de avanzar en el penúltimo paso hasta que `done` sea
  // real — si la IA tarda (puede pasar), esos ~10s+ se sentían como un
  // bloque vacío y estático. Este mensaje confirma que sigue en curso, sin
  // fingir progreso que no existe. Mismo copy/umbral que el loading no-premium
  // (ver LOADING_MESSAGE_STEPS en MolinoInterpretation.tsx) para consistencia.
  const [showReassurance, setShowReassurance] = useState(false);
  useEffect(() => {
    if (done) {
      setShowReassurance(false);
      return;
    }
    const timer = setTimeout(() => setShowReassurance(true), 10000);
    return () => clearTimeout(timer);
  }, [done]);

  useEffect(() => {
    // Walks through the steps on its own pace, but never advances past the
    // second-to-last step while the real fetch is still pending — the last
    // step only completes once `done` actually flips true (see the catch-up
    // effect below), so the checklist never claims work is finished before
    // it is.
    const interval = setInterval(() => {
      if (doneRef.current) {
        clearInterval(interval);
        return;
      }
      setActiveIndex((i) => Math.min(i + 1, STEPS.length - 2));
    }, STEP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!done) return;
    // Real content is ready. If the checklist hasn't visually caught up yet
    // (fast AI response beat the pacing above), fast-forward through the
    // remaining steps instead of jumping straight to "finished" — the
    // checklist should always be seen completing, never skipped. Once the
    // last step is actually reached, hold for one beat on the fully-checked
    // state before handing off, so "complete" reads as a real moment instead
    // of a mid-step cut.
    let holdTimeout: ReturnType<typeof setTimeout> | null = null;
    const interval = setInterval(() => {
      setActiveIndex((i) => {
        if (i >= STEPS.length - 1) {
          clearInterval(interval);
          if (!holdTimeout) {
            holdTimeout = setTimeout(() => onCompleteRef.current(), 450);
          }
          return i;
        }
        return i + 1;
      });
    }, CATCH_UP_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      if (holdTimeout) clearTimeout(holdTimeout);
    };
  }, [done]);

  const isReady = done && activeIndex >= STEPS.length - 1;
  const completedCount = STEPS.reduce(
    (count, _, i) => count + (i < activeIndex || (done && i <= activeIndex) ? 1 : 0),
    0
  );
  const progress = completedCount / STEPS.length;
  const counter = Math.min(activeIndex + 1, STEPS.length);
  const hero = isReady ? "Tu síntesis está lista" : STEPS[activeIndex];

  const fadeIn = (duration: number, delay = 0) => ({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: reduceMotion ? 0 : duration, ease: "easeOut" as const, delay: reduceMotion ? 0 : delay },
    },
  });

  return (
    <div role="status" aria-live="polite" className="py-6">
      <span className="sr-only">
        {done ? "Tu síntesis está lista." : `${STEPS[activeIndex]}…`}
      </span>

      <motion.div
        aria-hidden="true"
        className="w-full max-w-md"
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduceMotion ? 0 : 0.07,
              delayChildren: reduceMotion ? 0 : 0.05,
            },
          },
        }}
      >
        {/* Molino girando — ancla visual mientras se arma la lectura; antes
            esta pantalla era 100% texto en una columna angosta, con mucho
            aire alrededor que se leía como "se rompió" en esperas largas. */}
        <motion.div variants={fadeIn(0.4)} className="mb-5 flex justify-center">
          <Logo spinning className="h-12 w-12 text-accent" />
        </motion.div>

        {/* Overline — framing the process, not the price */}
        <motion.p
          variants={fadeIn(0.4)}
          className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted"
        >
          Construyendo tu lectura
        </motion.p>

        {/* Hero — the step being composed, typeset as the headline */}
        <motion.h3
          key={hero}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut", delay: reduceMotion ? 0 : 0.08 }}
          className="mt-3 text-balance font-heading text-2xl uppercase leading-[1.05] tracking-tight text-foreground sm:text-3xl"
        >
          {hero}
        </motion.h3>

        {/* Progress hairline + composing caret */}
        <div className="relative mt-4 h-px bg-ink/10">
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
          />
          {!isReady && (
            <motion.span
              className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-accent"
              initial={false}
              animate={{ left: `${progress * 100}%`, opacity: reduceMotion ? 0.6 : [1, 0.25, 1] }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      left: { duration: 0.5, ease: "easeOut" },
                      opacity: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                    }
              }
            />
          )}
        </div>

        {/* Meta row — state word + step counter */}
        <motion.div variants={fadeIn(0.4)} className="mt-3 flex items-baseline justify-between">
          <p
            className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
              isReady ? "text-accent" : "text-muted/70"
            }`}
          >
            {isReady ? "Lista" : "En proceso"}
          </p>
          <p className="font-mono text-xs tracking-[0.2em] text-muted/70">
            {String(counter).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
          </p>
        </motion.div>

        {/* Checklist — editorial log of the build */}
        <motion.ul
          variants={{ hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.05 } } }}
          className="mt-6 border-t border-ink/10"
        >
          {STEPS.map((step, i) => {
            const isComplete = i < activeIndex || (done && i <= activeIndex);
            const isActive = i === activeIndex && !isComplete;
            return (
              <motion.li
                key={step}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: reduceMotion ? 0 : 0.35, ease: "easeOut" as const },
                  },
                }}
                className="relative flex items-center gap-3 py-3.5 pl-5"
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-accent"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`w-5 shrink-0 font-mono text-xs tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-muted/70"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`flex-1 text-sm transition-colors duration-300 ${
                    isActive ? "text-foreground" : isComplete ? "text-foreground/75" : "text-muted/70"
                  }`}
                >
                  {step}
                </span>
                <span className="flex w-5 shrink-0 items-center justify-center">
                  {isComplete ? (
                    <motion.span
                      initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={
                        reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 24 }
                      }
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-accent bg-accent"
                    >
                      {CHECK_MARK}
                    </motion.span>
                  ) : null}
                </span>
              </motion.li>
            );
          })}
        </motion.ul>

        {showReassurance && !isReady && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
            className="mt-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted"
          >
            Esto está tomando más de lo usual, gracias por tu paciencia…
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
