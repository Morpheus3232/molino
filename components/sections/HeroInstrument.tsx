"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import StickyMobileCTA from "@/components/ui/StickyMobileCTA";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import { saveOnboardingData } from "@/lib/session/ephemeral";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import type { UserProfile } from "@/types/user";

function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year] = value.split("-").map(Number);
  const birth = new Date(`${value}T00:00:00`);
  return year >= 1900 && birth < new Date();
}

export default function HeroInstrument() {
  const router = useRouter();
  const [dateValue, setDateValue] = useState("");
  const dateValueRef = useRef("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dateInputRef = useRef<DateInputHandle>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getOrCreateProfile());
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

  const handleDateChange = useCallback((value: string) => {
    dateValueRef.current = value;
    setDateValue(value);
  }, []);

  const isReturningUser = mounted && Boolean(profile?.birthDate);

  if (isReturningUser) {
    return (
      <section
        id="mapa-form"
        className="relative bg-paper min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-8 py-16 sm:py-24 text-center w-full">
          <motion.div {...fadeUp} className="space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">Bienvenido de vuelta</p>
              <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-ink leading-tight">
                Tu mapa te está esperando.
              </h1>
            </div>

            <div className="flex justify-center pt-4">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-paper rounded-lg font-heading font-bold uppercase tracking-[0.08em] transition-all duration-200 hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-[0_4px_20px_rgba(154,74,24,0.2)]"
              >
                Ver mi mapa
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="mapa-form"
      className="relative bg-paper min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-8 py-16 sm:py-24 text-center w-full">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isSubmitting && "Generando tu mapa..."}
          {!isSubmitting && isDateValid && "Fecha válida. Lista para generar tu mapa."}
        </div>

        <motion.div {...fadeUp} className="space-y-8">
          {/* Eyebrow */}
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Descubrí tu patrón</p>

          {/* Main Headline */}
          <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-ink leading-tight">
            Ingresá tu fecha de nacimiento.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-xl mx-auto">
            Molino cruza numerología, astrología y zodíaco chino en tiempo real.
            <br className="hidden sm:block" />
            Sin registro. Sin guardar. Solo tu navegador.
          </p>

          {/* Privacy Badge */}
          <div className="flex justify-center pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Cálculo 100% local</span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="w-full pt-4"
          >
            <div className="mb-6">
              <DateInput ref={dateInputRef} value={dateValue} onChange={handleDateChange} />
            </div>

            <button
              type="submit"
              aria-busy={isSubmitting}
              disabled={!isDateValid || isSubmitting}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 sm:px-12 text-base sm:text-lg font-heading font-bold uppercase tracking-[0.08em] rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-[56px] ${
                isDateValid && !isSubmitting
                  ? "bg-accent text-paper shadow-[0_4px_20px_rgba(154,74,24,0.2)] hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  : "bg-ink/5 text-muted cursor-not-allowed"
              }`}
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
                  Generando…
                </>
              ) : (
                <>
                  Ver tu mapa
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Microcopy */}
          <p className="font-mono text-xs text-muted/70 tracking-wide pt-4">
            Toma 30 segundos ·{" "}
            <Link href="/ejemplo" className="text-accent hover:underline underline-offset-2 transition-colors">
              Ver ejemplo interactivo
            </Link>
          </p>
        </motion.div>
      </div>

      <StickyMobileCTA value={dateValue} onChange={handleDateChange} onGenerate={handleGenerate} canGenerate={isDateValid} ctaLabel="Ver tu mapa" />
    </section>
  );
}
