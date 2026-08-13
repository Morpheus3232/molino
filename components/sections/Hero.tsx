"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import SocialCounter from "@/components/ui/SocialCounter";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import { saveOnboardingData } from "@/lib/session/ephemeral";

function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year] = value.split("-").map(Number);
  const birth = new Date(`${value}T00:00:00`);
  return year >= 1900 && birth < new Date();
}

const CTA_LABEL = "Descubrí tu mapa";

export default function Hero() {
  const router = useRouter();
  const [dateValue, setDateValue] = useState("");
  const [showSticky, setShowSticky] = useState(false);
  const dateInputRef = useRef<DateInputHandle>(null);
  const heroRef = useRef<HTMLElement>(null);
  const isDateValid = isValidBirthDate(dateValue);

  const handleGenerate = useCallback(() => {
    if (!isDateValid) {
      dateInputRef.current?.reportIncomplete();
      return;
    }
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

  // Sticky CTA en mobile: aparece cuando el usuario scrollea por debajo del hero.
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof window === "undefined") return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      setShowSticky(rect.bottom < 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative bg-background min-h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-4rem)] flex items-center overflow-hidden border-t border-ink/10"
    >
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-8 py-8 text-center w-full">
        {/* Contador social honesto y acumulativo — arriba del título */}
        <motion.div {...fadeUpDelayed(0)} className="mb-6 flex justify-center">
          <SocialCounter
            number={35000}
            text="mapas calculados de forma 100% privada"
            className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em]"
          />
        </motion.div>

        <motion.h1
          {...fadeUpDelayed(0.05)}
          className="font-display text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-tight text-foreground leading-[1.05] mb-4"
        >
          ¿Por qué repetís los mismos patrones?
          <br className="hidden sm:block" /> Tu fecha de nacimiento tiene la respuesta.
        </motion.h1>

        <motion.p
          {...fadeUpDelayed(0.1)}
          className="text-base sm:text-lg text-muted/70 leading-relaxed max-w-md mx-auto mb-8"
        >
          Tu mapa personal revela quién sos, cómo decidís y cuándo actuar. En 30 segundos.
        </motion.p>

        <motion.div
          {...fadeUpDelayed(0.15)}
          className="mb-5"
          onKeyDown={handleKeyDown}
        >
          <DateInput ref={dateInputRef} value={dateValue} onChange={setDateValue} />
        </motion.div>

        {/* CTA principal — grande, dorado, con estado disabled */}
        <motion.div {...fadeUpDelayed(0.2)} className="flex justify-center mb-3">
          <button
            type="button"
            onClick={handleGenerate}
            aria-disabled={!isDateValid}
            className={`
              group inline-flex items-center justify-center gap-3
              px-10 py-4 sm:px-12
              font-heading font-bold uppercase tracking-[0.08em] text-base sm:text-lg
              rounded-md transition-all duration-200 ease-out
              min-h-[56px] w-full sm:w-auto
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
              ${
                isDateValid
                  ? "bg-gold text-gold-foreground shadow-[0_0_35px_rgba(245,176,34,0.35)] hover:bg-gold-hover hover:shadow-[0_0_45px_rgba(245,176,34,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                  : "bg-ink/10 text-muted cursor-not-allowed"
              }
            `}
          >
            {CTA_LABEL}
            <ArrowRight
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </motion.div>

        {/* Microcopy de urgencia */}
        <motion.p
          {...fadeUpDelayed(0.25)}
          className="font-mono text-xs text-muted/70 tracking-wide mb-5"
        >
          Gratis · Toma 30 segundos · Sin registro
        </motion.p>

        <motion.div {...fadeUpDelayed(0.3)} className="flex justify-center mb-4">
          <Badge variant="muted">Tus patrones, tu mapa</Badge>
        </motion.div>

        <motion.p {...fadeUpDelayed(0.35)} className="font-mono text-xs text-muted/70 tracking-wide">
          <Link href="/ejemplo" className="underline decoration-muted/40 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
            Ver un ejemplo
          </Link>
        </motion.p>
      </div>

      {/* Sticky CTA mobile — solo aparece al scrollear por debajo del hero */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 inset-x-0 z-50 md:hidden p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-background/90 backdrop-blur border-t border-ink/10"
          >
            <button
              type="button"
              onClick={handleGenerate}
              aria-disabled={!isDateValid}
              className={`
                group inline-flex w-full items-center justify-center gap-3
                px-6 py-3.5 font-heading font-bold uppercase tracking-[0.08em] text-base
                rounded-md transition-all duration-200 ease-out min-h-[52px]
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
                ${
                  isDateValid
                    ? "bg-gold text-gold-foreground shadow-[0_0_35px_rgba(245,176,34,0.35)] active:scale-[0.99]"
                    : "bg-ink/10 text-muted cursor-not-allowed"
                }
              `}
            >
              {CTA_LABEL}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <p className="mt-2 text-center font-mono text-[11px] text-muted/70">
              Gratis · Sin registro
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
