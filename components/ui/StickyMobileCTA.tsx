"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";

interface StickyMobileCTAProps {
  /**
   * Shared birth date (YYYY-MM-DD). The parent owns this state so the hero
   * input and this sticky bar are always in sync.
   */
  value: string;
  onChange: (value: string) => void;
  /** Fired when "Generar mapa" is pressed with a valid date. */
  onGenerate: () => void;
  /** Only shown when a complete, valid date is present. */
  canGenerate?: boolean;
  /** Scroll offset (px) after which the bar appears. Defaults to 0. */
  showAfter?: number;
  /** Button label. */
  ctaLabel?: string;
}

function formatDisplay(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Compact sticky CTA for mobile (< 768px). Appears once the user scrolls past
 * the hero, slides up from the bottom, and hides again near the top. Shares a
 * single date source of truth with the hero, so the two stay in sync. Adds
 * bottom padding to the page so it never covers important content.
 */
export default function StickyMobileCTA({
  value,
  onChange,
  onGenerate,
  canGenerate = false,
  showAfter = 0,
  ctaLabel = "Generar mapa",
}: StickyMobileCTAProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [hideAtTop, setHideAtTop] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);
  const { scrollY, isPastThreshold } = useScrollPosition(showAfter);

  // Track viewport < 768px (mobile). CSS (`md:hidden`) hides it from layout,
  // this only stops us mounting scroll logic on desktop.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Hide when the user scrolls back up near the very top (scrollY < threshold).
  useEffect(() => {
    setHideAtTop(scrollY <= showAfter);
  }, [scrollY, showAfter]);

  const visible = isMobile && isPastThreshold && !hideAtTop;

  // Keep the page bottom clear so the fixed bar never covers content.
  useEffect(() => {
    if (!isMobile) return;
    const prev = document.body.style.paddingBottom;
    document.body.style.paddingBottom = visible ? "5rem" : prev === "5rem" ? "" : prev;
    return () => {
      document.body.style.paddingBottom = prev;
    };
  }, [visible, isMobile]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 inset-x-0 z-50 md:hidden p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-background/85 backdrop-blur-md border-t border-ink/10"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <CalendarDays
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                ref={dateRef}
                type="date"
                value={value}
                onChange={(e) => {
                  if (e.target.value) onChange(e.target.value);
                }}
                aria-label="Fecha de nacimiento"
                className="w-full rounded-md border border-ink/10 bg-ink/[0.04] py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
              <span className="sr-only">{formatDisplay(value) || "Sin fecha"}</span>
            </div>

            <button
              type="button"
              onClick={onGenerate}
              aria-disabled={!canGenerate ? "true" : undefined}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-gold px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-[0.08em] text-gold-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
