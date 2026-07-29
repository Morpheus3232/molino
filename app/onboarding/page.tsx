"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Hash, Sun, Moon, ArrowRight, Loader2 } from "lucide-react";
import UniversityFooter from "@/components/layout/UniversityFooter";
import ScrollDatePicker from "@/components/ui/ScrollDatePicker";
import { analytics } from "@/lib/analytics/analytics";
import { saveOnboardingData, loadOnboardingData, clearOnboardingData } from "@/lib/session/ephemeral";

const STEPS = [
  { id: 1, title: "Tu fecha", description: "Ingresá tu fecha de nacimiento" },
  { id: 2, title: "Qué analizamos", description: "Vista previa de los 3 motores" },
  { id: 3, title: "Generar", description: "Crear tu mapa personal" },
];

const ENGINES_PREVIEW = [
  { icon: Hash, title: "Numerología", details: "Camino de Vida, Expresión, Alma, Personalidad, Día de Nacimiento" },
  { icon: Sun, title: "Astrología", details: "Signo Solar, Lunar, Ascendente, Casas, Aspectos planetarios" },
  { icon: Moon, title: "Zodíaco Chino", details: "Animal, Elemento, Pilares (Año/Mes/Día/Hora), Ciclo Sexagenario" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [dateValue, setDateValue] = useState("1990-01-01");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDateChange = useCallback((value: string) => {
    setDateValue(value);
  }, []);

  const isDateValid = dateValue && /^\d{4}-\d{2}-\d{2}$/.test(dateValue);

  const handleNext = () => {
    if (step === 1 && isDateValid) {
      // Parse date for storage
      const [year, month, day] = dateValue.split("-");
      // Save date to session for next steps
      saveOnboardingData({ day, month, year, dateValue, dateOfBirth: dateValue });
      analytics.track({ type: "onboarding_completed", data: { step: 1, date: dateValue } });
      setStep(2);
    } else if (step === 2) {
      analytics.track({ type: "onboarding_completed", data: { step: 2 } });
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGenerate = async () => {
    if (!isDateValid) return;
    setIsGenerating(true);
    try {
      // Load saved data (date of birth)
      const saved = loadOnboardingData();
      const dob = saved?.dateOfBirth || dateValue;
      
      analytics.track({ type: "onboarding_completed", data: { date: dob } });
      
      // Clear onboarding data since we're redirecting to profile
      clearOnboardingData();
      
      // Redirect to profile with the date as query param
      // The profile page will calculate everything from the date
      router.push(`/profile?dob=${dob}`);
    } catch (error) {
      console.error("Error generating profile:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getProgressWidth = () => {
    return `${((step - 1) / (STEPS.length - 1)) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-20 lg:py-28" id="main-content">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 sm:mb-14"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label="Progreso del asistente"
        >
          <div className="flex items-center gap-2 mb-3">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 ${
                    i + 1 < step
                      ? "bg-accent text-white"
                      : i + 1 === step
                      ? "bg-accent text-white ring-4 ring-accent/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                  initial={false}
                  animate={{ scale: i + 1 <= step ? 1 : 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {i + 1 < step ? <Check className="w-5 h-5" /> : s.id}
                </motion.div>
                {i < STEPS.length - 1 && (
                  <motion.div
                    className={`h-1 flex-1 max-w-[120px] mx-2 rounded-full overflow-hidden transition-colors ${
                      i + 1 < step ? "bg-accent" : "bg-muted"
                    }`}
                    style={{ width: i + 1 < step ? "100%" : "0%" }}
                    initial={false}
                    animate={{ width: i + 1 < step ? "100%" : "0%" }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Paso {step} de {STEPS.length}: {STEPS[step - 1].title}
          </p>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-8"
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-3">
                  Paso 1 de 3
                </p>
                <h1 className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
                  ¿Cuándo naciste?
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Solo necesitamos tu fecha de nacimiento. Sin registro, sin cookies, sin datos personales extra.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mx-auto max-w-sm"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 text-center mb-6">
                  Seleccioná tu fecha de nacimiento
                </p>
                <ScrollDatePicker value={dateValue} onChange={handleDateChange} />
                <p className="mt-6 text-sm text-muted-foreground text-center">
                  Tu fecha nunca sale de tu navegador.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-10"
              >
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isDateValid}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 text-base bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[56px] disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-lg"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-10"
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-3">
                  Paso 2 de 3
                </p>
                <h1 className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
                  Qué vamos a analizar
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Tres sistemas simbólicos, una sola lectura integrada. Tu fecha de nacimiento
                  activa los tres motores al mismo tiempo.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-4 mb-10"
                role="list"
                aria-label="Motores de análisis"
              >
                {ENGINES_PREVIEW.map((engine, i) => (
                  <motion.article
                    key={engine.title}
                    role="listitem"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + i * 0.08 }}
                    className="p-5 rounded-xl border border-border bg-card text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent flex-shrink-0 group-hover:bg-accent group-hover:text-background transition-colors">
                        <engine.icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-heading uppercase text-lg font-semibold text-foreground mb-1">
                          {engine.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {engine.details}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 text-base border-2 border-border text-foreground hover:border-accent/50 hover:text-accent min-h-[56px] rounded-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" aria-hidden="true" />
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 text-base bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[56px] rounded-lg transition-all"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-10"
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-3">
                  Paso 3 de 3
                </p>
                <h1 className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
                  Generá tu mapa
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Todo listo. Un clic y tu mapa personal de autoconocimiento estará listo.
                  Podrás explorar tu identidad, tu mundo, tu círculo y tu inteligencia.
                </p>
              </motion.div>

              {/* Date confirmation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-10 p-5 rounded-xl border border-border bg-card"
              >
                <p className="text-sm text-muted-foreground mb-2">Fecha confirmada</p>
                <p className="font-heading uppercase text-2xl font-semibold text-foreground">
                  {dateValue ? new Date(dateValue + "T00:00:00").toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }) : "—"}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 text-base border-2 border-border text-foreground hover:border-accent/50 hover:text-accent min-h-[56px] rounded-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" aria-hidden="true" />
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 text-base bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[56px] rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                      Generando tu mapa...
                    </>
                  ) : (
                    <>
                      Generar mi mapa
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-8 text-sm text-muted-foreground/60"
              >
                Tu información se procesa localmente en tu navegador. Nada se envía a servidores.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <UniversityFooter />
    </div>
  );
}