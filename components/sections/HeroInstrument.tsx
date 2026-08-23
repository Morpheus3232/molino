"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import StickyMobileCTA from "@/components/ui/StickyMobileCTA";
import { fadeUpMount, fadeUpMountDelayed } from "@/lib/utils/motion";
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
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-8 py-16 sm:py-24 text-center w-full">
          <motion.div {...fadeUpMount} className="space-y-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-6">
                Bienvenido de vuelta
              </p>
              <h1 className="font-display font-normal normal-case tracking-tight text-ink leading-[0.95] text-[clamp(3rem,8vw,5.5rem)]">
                Tu mapa te está{" "}
                <em className="text-gradient-warm">esperando</em>.
              </h1>
            </div>

            <motion.div {...fadeUpMountDelayed(0.15)} className="flex justify-center pt-2">
              <Link
                href="/profile"
                className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-accent text-paper rounded-lg font-heading font-bold uppercase tracking-[0.08em] transition-colors duration-200 hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Ver mi mapa
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </motion.div>
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
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-8 py-16 sm:py-24 text-center w-full">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isSubmitting && "Generando tu mapa..."}
          {!isSubmitting && isDateValid && "Fecha válida. Lista para generar tu mapa."}
        </div>

        <motion.div {...fadeUpMount} className="space-y-10">
          {/* Eyebrow */}
          <p className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
            <span className="inline-block h-px w-8 bg-border" aria-hidden="true" />
            Descubrí tu patrón
            <span className="inline-block h-px w-8 bg-border" aria-hidden="true" />
          </p>

          {/* Headline dramático — serif editorial, remate en itálica con
              gradiente cálido animado */}
          <h1 className="font-display font-normal normal-case tracking-tight text-ink leading-[0.95] text-[clamp(2.75rem,7vw,5rem)]">
            Tu fecha no es un dato.
            <span className="block mt-2 italic text-gradient-warm">Es un patrón.</span>
          </h1>

          {/* Subheadline */}
          <motion.p {...fadeUpMountDelayed(0.12)} className="text-lg sm:text-xl text-muted leading-relaxed max-w-xl mx-auto">
            Se calculan numerología, astrología y zodíaco chino a partir de tu fecha.
            <br className="hidden sm:block" />
            Sin registro. Tu fecha no se envía a ningún servidor.
          </motion.p>

          {/* Form */}
          <motion.div {...fadeUpMountDelayed(0.2)}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              className="w-full space-y-6"
            >
              <DateInput ref={dateInputRef} value={dateValue} onChange={handleDateChange} />

              <button
                type="submit"
                aria-busy={isSubmitting}
                disabled={!isDateValid || isSubmitting}
                className={`group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-4 text-base sm:text-lg font-heading font-bold uppercase tracking-[0.08em] rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-[56px] ${
                  isDateValid && !isSubmitting
                    ? "bg-accent text-paper hover:bg-accent-hover active:scale-[0.98]"
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

            {/* Privacidad + microcopy — juntos, una sola línea de confianza */}
            <div className="pt-8 space-y-3">
              <p className="flex items-center justify-center gap-2 text-xs font-mono text-accent">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Cálculo 100% local
              </p>
              <p className="font-mono text-xs text-muted/70 tracking-wide">
                Toma 30 segundos ·{" "}
                <Link href="/ejemplo" className="text-accent hover:underline underline-offset-2 transition-colors">
                  Ver ejemplo interactivo
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <StickyMobileCTA value={dateValue} onChange={handleDateChange} onGenerate={handleGenerate} canGenerate={isDateValid} ctaLabel="Ver tu mapa" />
    </section>
  );
}
