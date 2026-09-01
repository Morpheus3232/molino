"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
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

/**
 * Entrada para quien llega con un código de un influencer. Va último y en
 * tamaño de nota al pie a propósito: la gran mayoría llega sin código, y
 * para esa mayoría esto no debe competir con "Ver tu mapa". Quien sí tiene
 * uno lo está buscando, y un link chico alcanza.
 */
function CouponLink() {
  return (
    <p className="pt-4 text-xs text-muted">
      ¿Tenés un código?{" "}
      <Link href="/canjear" className="font-semibold text-accent underline-offset-4 hover:underline">
        Canjealo acá
      </Link>
    </p>
  );
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
    const eyebrowText = profile?.name ? `Hola, ${profile.name}` : "Tu mapa personal";
    return (
      <section
        id="mapa-form"
        className="relative bg-paper min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-8 py-16 sm:py-24 text-center w-full">
          <motion.div {...fadeUpMount} className="space-y-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-6">
                {eyebrowText}
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

            <CouponLink />
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
            Tres sistemas, una fecha
            <span className="inline-block h-px w-8 bg-border" aria-hidden="true" />
          </p>

          {/* Molino context — qué es esta calculadora */}
          <p className="font-mono text-[11px] sm:text-xs text-muted/80 max-w-md mx-auto leading-relaxed">
            Molino cruza tu fecha de nacimiento con numerología pitagórica,
            astrología occidental y zodíaco chino para devolver un mapa
            simbólico de tu patrón personal.
          </p>

          {/* Headline dramático — serif editorial, remate en itálica con
              gradiente cálido animado */}
          <h1 className="font-display font-normal normal-case tracking-tight text-ink leading-[0.95] text-[clamp(2.75rem,7vw,5rem)]">
            Tu fecha no es un dato.
            <span className="block mt-2 italic text-gradient-warm">Es un patrón.</span>
          </h1>

          {/* Subheadline */}
          <motion.p {...fadeUpMountDelayed(0.12)} className="text-lg sm:text-xl text-muted leading-relaxed max-w-xl mx-auto">
            Cada mapa es casi único: se construye desde tu fecha de nacimiento
            leída como un código de ocho dígitos.
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
                    : "border-2 border-accent/40 text-accent cursor-not-allowed"
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

              {!isDateValid && !isSubmitting && (
                <p className="text-xs text-muted" role="status">
                  Completá tu fecha de nacimiento para continuar.
                </p>
              )}
            </form>

            {/* "Ver ejemplo interactivo" es la única salida que no pide un
                dato personal — es la respuesta a "¿qué me van a mostrar?"
                sin pedir la fecha primero, así que es el CTA secundario
                declarado del hero, no un link escondido. */}
            <div className="pt-8">
              <Link
                href="/ejemplo"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border text-sm font-heading font-semibold text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                Ver ejemplo interactivo
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Privacidad — una sola línea de confianza */}
            <p className="pt-6 flex items-center justify-center gap-2 text-xs font-mono text-accent">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              Cálculo 100% local · toma 30 segundos
            </p>

            <CouponLink />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
