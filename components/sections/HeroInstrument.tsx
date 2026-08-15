"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Bookmark } from "lucide-react";
import Link from "next/link";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import StickyMobileCTA from "@/components/ui/StickyMobileCTA";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import { saveOnboardingData } from "@/lib/session/ephemeral";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import type { UserProfile } from "@/types/user";

function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year] = value.split("-").map(Number);
  const birth = new Date(`${value}T00:00:00`);
  return year >= 1900 && birth < new Date();
}

const CTA_LABEL = "Descubrí tu mapa";

export default function HeroInstrument() {
  const router = useRouter();
  const [dateValue, setDateValue] = useState("");
  const dateValueRef = useRef("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedProfile, setSavedProfile] = useState<{ name?: string; birthDate: string } | null>(null);
  const dateInputRef = useRef<DateInputHandle>(null);

  useEffect(() => {
    const profile = loadProfileFromStorage();
    if (profile && profile.birthDate) {
      setSavedProfile({ name: profile.name, birthDate: profile.birthDate });
    }
  }, []);

  const isDateValid = isValidBirthDate(dateValue);

  const handleGenerate = useCallback((explicitDate?: string) => {
    let targetDate = typeof explicitDate === "string" && explicitDate ? explicitDate : dateValueRef.current || dateValue;
    if (typeof document !== "undefined") {
      const d = (document.querySelector("input[name='birthdate-day']") as HTMLInputElement)?.value?.replace(/\D/g, "") || "";
      const m = (document.querySelector("input[name='birthdate-month']") as HTMLInputElement)?.value?.replace(/\D/g, "") || "";
      const y = (document.querySelector("input[name='birthdate-year']") as HTMLInputElement)?.value?.replace(/\D/g, "") || "";
      if (d.length >= 1 && m.length >= 1 && y.length === 4) {
        targetDate = `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }
    }
    if (!isValidBirthDate(targetDate)) {
      dateInputRef.current?.reportIncomplete();
      return;
    }
    setIsSubmitting(true);
    const [year, month, day] = targetDate.split("-");
    saveOnboardingData({ day, month, year, dateValue: targetDate, dateOfBirth: targetDate });
    router.push("/onboarding");
  }, [dateValue, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleGenerate();
    },
    [handleGenerate]
  );

  const handleDateChange = useCallback((value: string) => {
    dateValueRef.current = value;
    setDateValue(value);
  }, []);

  const ctaClass = `
    group inline-flex items-center justify-center gap-3
    font-heading font-bold uppercase tracking-[0.08em]
    rounded-md transition-all duration-200 ease-out
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
    ${
      isDateValid && !isSubmitting
        ? "bg-gold text-gold-foreground shadow-[0_0_35px_rgba(245,176,34,0.35)] hover:bg-gold-hover hover:shadow-[0_0_45px_rgba(245,176,34,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
        : "bg-ink/10 text-muted cursor-not-allowed"
    }
  `;

  return (
    <section
      id="mapa-form"
      className="relative bg-background min-h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-4rem)] flex items-center overflow-hidden border-t border-ink/10"
    >
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-8 py-8 text-center w-full">
        {/* Live region for accessibility */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isSubmitting && "Generando tu mapa..."}
          {!isSubmitting && isDateValid && "Fecha válida. Lista para generar tu mapa."}
        </div>

        {/* Saved Profile Quick Access or Privacy Badge */}
        <motion.div {...fadeUpDelayed(0)} className="mb-6 flex justify-center">
          {savedProfile ? (
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 transition-all text-xs font-mono font-bold shadow-sm"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Tu mapa está listo ({savedProfile.name || "Mi Mapa"}) → Ver resultado</span>
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink/5 border border-ink/10 text-muted text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span title="Premium/IA: se procesa externamente solo cuando vos lo activás, con proveedores bajo acuerdo de confidencialidad.">Cálculo local por defecto</span>
            </div>
          )}
        </motion.div>

        {/* Headline emocional */}
        <motion.h1
          {...fadeUpDelayed(0.05)}
          className="font-display text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-tight text-foreground leading-[1.05] mb-4"
        >
          Entendete mejor.
          <br className="hidden sm:block" /> Decidí con más claridad.
        </motion.h1>

        <motion.p
          {...fadeUpDelayed(0.1)}
          className="text-base sm:text-lg text-muted/70 leading-relaxed max-w-md mx-auto mb-8"
        >
          Una matriz estructurada de numerología, astrología y zodíaco chino. No predice — te da más perspectiva para decidir vos. En 30 segundos.
        </motion.p>

        {/* Formulario de Fecha y Generación */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="w-full"
        >
          {/* FECHA — input real DD/MM/AAAA */}
          <motion.div {...fadeUpDelayed(0.15)} className="mb-5">
            <DateInput ref={dateInputRef} value={dateValue} onChange={handleDateChange} />
          </motion.div>

          {/* CTA principal — grande, dorado */}
          <motion.div {...fadeUpDelayed(0.2)} className="flex justify-center mb-3">
            <button
              type="button"
              onClick={() => handleGenerate()}
              aria-busy={isSubmitting}
              className={`${ctaClass} px-10 py-4 sm:px-12 text-base sm:text-lg min-h-[56px] w-full sm:w-auto`}
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
                <>
                  {CTA_LABEL}
                  <ArrowRight
                    className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </motion.div>
        </form>

        {/* Microcopy de urgencia */}
        <motion.p
          {...fadeUpDelayed(0.25)}
          className="font-mono text-xs text-muted/70 tracking-wide mb-5"
        >
          Gratis · Toma 30 segundos · Sin registro
        </motion.p>

        <motion.p {...fadeUpDelayed(0.3)} className="font-mono text-xs text-muted/70 tracking-wide">
          <Link href="/ejemplo" className="underline decoration-muted/40 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
            Ver un ejemplo interactivo
          </Link>
        </motion.p>
      </div>

      {/* Sticky CTA mobile — reusable, sincronizado con el input del hero */}
      <StickyMobileCTA
        value={dateValue}
        onChange={handleDateChange}
        onGenerate={handleGenerate}
        canGenerate={isDateValid && !isSubmitting}
        showAfter={1}
        ctaLabel="Generar mapa"
      />
    </section>
  );
}
