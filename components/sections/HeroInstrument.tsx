"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import { fadeUp } from "@/lib/utils/motion";
import { saveOnboardingData } from "@/lib/session/ephemeral";
import MolinoField from "@/components/ui/MolinoField";
import RotorCore from "@/components/ui/RotorCore";
import Logo from "@/components/ui/Logo";

function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year] = value.split("-").map(Number);
  const birth = new Date(`${value}T00:00:00`);
  return year >= 1900 && birth < new Date();
}

function parseDigits(dateValue: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return "";
  const [year, month, day] = dateValue.split("-");
  return `${day}${month}${year}`;
}

function getFillProgress(dateValue: string): number {
  const digits = parseDigits(dateValue);
  return digits.length / 8;
}

export default function HeroInstrument() {
  const router = useRouter();
  const [dateValue, setDateValue] = useState("");
  const dateInputRef = useRef<DateInputHandle>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDateValid = isValidBirthDate(dateValue);
  const fillProgress = getFillProgress(dateValue);

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

  // Screen reader announcement for progress
  useEffect(() => {
    if (fillProgress === 1 && isDateValid) {
      // Fecha completa - se anuncia via aria-live en el botón
    }
  }, [fillProgress, isDateValid]);

  return (
    <section className="relative bg-background min-h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-4rem)] flex items-center overflow-hidden border-t border-ink/10">
      {/* CAMPO — fondo instrumental */}
      <MolinoField />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-8 py-8 text-center w-full">
        {/* Live region for accessibility */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {fillProgress > 0 && fillProgress < 1 && `Clave: ${Math.round(fillProgress * 100)}% completada`}
          {fillProgress === 1 && isDateValid && "Clave completa. Lista para generar tu mapa."}
          {isSubmitting && "Generando tu mapa..."}
        </div>

        {/* TÍTULO — editorial, no marketing */}
        <motion.h1
          {...fadeUp}
          className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-tight text-foreground leading-[0.95] mb-2"
        >
          Entiende el mapa.
          <br className="hidden sm:block" /> Decide con claridad.
        </motion.h1>

        <motion.p
          {...fadeUp}
          className="text-base sm:text-lg text-muted/70 leading-relaxed max-w-xl mx-auto mb-10"
        >
          Tu fecha de nacimiento es la clave. Molino la transforma en una estructura personal.
        </motion.p>

        {/* INSTRUMENTO CENTRAL — RotorCore */}
        <motion.div
          {...fadeUp}
          className="relative mx-auto mb-8"
          style={{ maxWidth: "min(48vh, 480px)" }}
        >
          <RotorCore
            fillProgress={fillProgress}
            isSubmitting={isSubmitting}
            isComplete={isDateValid}
          />

          {/* Etiqueta contextual */}
          <motion.p
            className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted/70 transition-colors duration-300"
            style={{
              color: isDateValid ? "var(--color-accent)" : "var(--color-muted)",
              opacity: fillProgress > 0 ? 1 : 0.5,
            }}
          >
            {isSubmitting
              ? "Generando estructura..."
              : isDateValid
                ? "Clave válida · Estructura detectada"
                : fillProgress > 0.75
                  ? "Casi completa..."
                  : fillProgress > 0.5
                    ? "Estructura formándose..."
                    : fillProgress > 0.25
                      ? "Detectando señales..."
                      : fillProgress > 0
                        ? "Ingresando clave..."
                        : "Ingresá tu fecha..."}
          </motion.p>
        </motion.div>

        {/* CLAVE — input real DD/MM/AAAA */}
        <motion.div
          {...fadeUp}
          className="mb-6"
          onKeyDown={handleKeyDown}
        >
          <DateInput ref={dateInputRef} value={dateValue} onChange={handleDateChange} />
        </motion.div>

        {/* BOTÓN DE ACCIÓN — el único CTA visible */}
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
          Gratis. Sin registro. Sin guardar datos.
          {" · "}
          <a href="/ejemplo" className="underline decoration-muted/40 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
            Ver un ejemplo
          </a>
        </motion.p>
      </div>
    </section>
  );
}