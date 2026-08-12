"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import { fadeUp } from "@/lib/utils/motion";
import { saveOnboardingData } from "@/lib/session/ephemeral";

function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year] = value.split("-").map(Number);
  const birth = new Date(`${value}T00:00:00`);
  return year >= 1900 && birth < new Date();
}

export default function HeroInstrument() {
  const router = useRouter();
  const [dateValue, setDateValue] = useState("");
  const dateInputRef = useRef<DateInputHandle>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDateValid = isValidBirthDate(dateValue);

  const handleGenerate = useCallback(() => {
    if (!isDateValid) {
      dateInputRef.current?.reportIncomplete();
      return;
    }
    setIsSubmitting(true);
    const [year, month, day] = dateValue.split("-");
    saveOnboardingData({ day, month, year, dateValue, dateOfBirth: dateValue });
    router.push("/onboarding");
  }, [dateValue, isDateValid, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && isDateValid) handleGenerate();
    },
    [isDateValid, handleGenerate]
  );

  const handleDateChange = useCallback((value: string) => {
    setDateValue(value);
  }, []);

  return (
    <section className="relative bg-background min-h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-4rem)] flex items-center overflow-hidden border-t border-ink/10">
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-8 py-8 text-center w-full">
        {/* Live region for accessibility */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isSubmitting && "Generando tu mapa..."}
          {!isSubmitting && isDateValid && "Fecha válida. Lista para generar tu mapa."}
        </div>

        {/* MENSAJE — claro y editorial */}
        <motion.h1
          {...fadeUp}
          className="font-display text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-tight text-foreground leading-[1.05] mb-3"
        >
          Tu fecha de nacimiento
          <br className="hidden sm:block" /> es la clave.
        </motion.h1>

        <motion.p
          {...fadeUp}
          className="text-base sm:text-lg text-muted/70 leading-relaxed max-w-md mx-auto mb-8"
        >
          Molino la transforma en tu mapa personal: tus patrones, tus ciclos y tus afinidades.
        </motion.p>

        {/* FECHA — input real DD/MM/AAAA */}
        <motion.div
          {...fadeUp}
          className="mb-6"
          onKeyDown={handleKeyDown}
        >
          <DateInput ref={dateInputRef} value={dateValue} onChange={handleDateChange} />
        </motion.div>

        {/* CTA — el único botón de acción */}
        <motion.div {...fadeUp} className="flex justify-center mb-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!isDateValid || isSubmitting}
            className={`
              inline-flex items-center justify-center gap-3
              px-8 py-4
              font-heading font-semibold uppercase tracking-[0.1em] text-sm sm:text-base
              rounded-md
              transition-all duration-200 ease-out
              min-h-[48px] min-w-[280px]
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
              ${isDateValid && !isSubmitting
                ? "bg-accent text-accent-foreground hover:bg-accent-hover shadow-[0_0_30px_rgba(124,140,255,0.25)]"
                : "bg-ink/10 text-muted cursor-not-allowed"
              }
              ${isSubmitting ? "cursor-wait" : ""}
            `}
            aria-busy={isSubmitting}
            aria-disabled={!isDateValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
                  </svg>
                </motion.span>
                Generando tu mapa…
              </>
            ) : (
              "Generar mi mapa"
            )}
          </button>
        </motion.div>

        <motion.p
          {...fadeUp}
          className="font-mono text-xs text-muted/70 tracking-wide"
        >
          Gratis. Sin registro.
          {" · "}
          <a href="/ejemplo" className="underline decoration-muted/40 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
            Ver un ejemplo
          </a>
        </motion.p>
      </div>
    </section>
  );
}
