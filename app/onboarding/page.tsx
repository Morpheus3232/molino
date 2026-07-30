"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hash, Sun, Moon, ArrowRight, Loader2 } from "lucide-react";
import UniversityFooter from "@/components/layout/UniversityFooter";
import DateInput from "@/components/ui/DateInput";
import { analytics } from "@/lib/analytics/analytics";
import { saveOnboardingData, clearOnboardingData } from "@/lib/session/ephemeral";

const ENGINES_PREVIEW = [
  { icon: Hash, title: "Numerología", details: "Camino de Vida, Expresión, Alma, Personalidad" },
  { icon: Sun, title: "Astrología", details: "Signo Solar, Lunar, Ascendente, Casas" },
  { icon: Moon, title: "Zodíaco Chino", details: "Animal, Elemento, Pilares, Ciclo Sexagenario" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [dateValue, setDateValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDateChange = useCallback((value: string) => {
    setDateValue(value);
  }, []);

  const isDateValid = Boolean(
    dateValue &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateValue) &&
    (() => {
      const [y] = dateValue.split("-").map(Number);
      const birth = new Date(dateValue + "T00:00:00");
      return y >= 1900 && birth < new Date();
    })()
  );

  const handleGenerate = async () => {
    if (!isDateValid) return;
    setIsGenerating(true);
    try {
      const [year, month, day] = dateValue.split("-");
      saveOnboardingData({ day, month, year, dateValue, dateOfBirth: dateValue });
      // No mandamos la fecha real al tracker: /filosofia promete que la
      // fecha de nacimiento no se asocia a analytics. Solo registramos que
      // el onboarding se completó.
      analytics.track({ type: "onboarding_completed" });
      clearOnboardingData();
      router.push(`/profile?dob=${dateValue}`);
    } catch (error) {
      console.error("Error generating profile:", error);
      setIsGenerating(false);
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && isDateValid) handleGenerate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDateValid, dateValue]
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-xl px-4 sm:px-6 py-16 sm:py-24" id="main-content">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-3">
            Mapa personal de autoconocimiento
          </p>
          <h1 className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
            ¿Cuándo naciste?
          </h1>
          <p className="text-base text-muted-foreground max-w-sm mx-auto">
            Solo tu fecha. Sin registro, sin cookies, sin datos personales extra.
          </p>
        </motion.div>

        {/* Date Input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
          onKeyDown={handleKeyDown}
        >
          <DateInput value={dateValue} onChange={handleDateChange} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!isDateValid || isGenerating}
            className="inline-flex items-center justify-center gap-2 font-semibold px-10 py-4 text-base bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[56px] disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                Generando tu mapa...
              </>
            ) : (
              <>
                Ver mi mapa
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </>
            )}
          </button>
        </motion.div>

        {/* Engines preview — info block, not a step */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 text-center mb-4">
            Qué vamos a analizar
          </p>
          <div className="space-y-2" role="list" aria-label="Motores de análisis">
            {ENGINES_PREVIEW.map((engine, i) => (
              <motion.div
                key={engine.title}
                role="listitem"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.07 }}
                className="flex items-center gap-3 p-3.5 rounded-lg border border-border bg-card"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 text-accent flex-shrink-0">
                  <engine.icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-heading uppercase text-sm font-semibold text-foreground">{engine.title}</p>
                  <p className="text-xs text-muted-foreground">{engine.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground/50 text-center">
            Tu fecha nunca sale de tu navegador.
          </p>
        </motion.div>

      </main>
      <UniversityFooter />
    </div>
  );
}