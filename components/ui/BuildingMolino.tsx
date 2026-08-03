"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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
 */
const STEPS = [
  "Leyendo tu mapa",
  "Cruzando tus sistemas",
  "Detectando tus tensiones",
  "Preparando tu síntesis",
];

const STEP_INTERVAL_MS = 550;
const CATCH_UP_INTERVAL_MS = 140;

export default function BuildingMolino({ done, onComplete }: BuildingMolinoProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const doneRef = useRef(done);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    doneRef.current = done;
    onCompleteRef.current = onComplete;
  }, [done, onComplete]);

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

  return (
    <div role="status" aria-live="polite" className="py-6">
      <span className="sr-only">
        {done ? "Tu síntesis está lista." : `${STEPS[activeIndex]}…`}
      </span>
      <ul aria-hidden="true" className="space-y-3">
        {STEPS.map((step, i) => {
          const isComplete = i < activeIndex || (done && i <= activeIndex);
          const isActive = i === activeIndex && !isComplete;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  isComplete ? "border-accent bg-accent" : "border-ink/15 bg-transparent"
                }`}
              >
                {isComplete && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--color-paper)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {isActive && (
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-accent"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </span>
              <span
                className={`text-sm transition-colors duration-300 ${isComplete ? "text-foreground" : isActive ? "text-foreground" : "text-muted"}`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
