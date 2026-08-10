"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import UniversityFooter from "@/components/layout/UniversityFooter";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import Button from "@/components/ui/Button";
import { analytics } from "@/lib/analytics/analytics";
import { saveOnboardingData, loadOnboardingData, clearOnboardingData } from "@/lib/session/ephemeral";
import { markOnboardingCompleted } from "@/lib/session/discovery";
import LocationStep from "@/components/onboarding/LocationStep";
import DimensionsPreview from "@/components/onboarding/DimensionsPreview";

const STEPS = [
  { id: "date", label: "Fecha", description: "Tu fecha de nacimiento — la base de todo" },
  { id: "preview", label: "Adelanto", description: "Vos ya tenés dimensiones, sin dar tu nombre" },
  { id: "location", label: "Ubicación", description: "País actual (opcional) para afinidades culturales" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"date" | "preview" | "location">("date");
  const [dateValue, setDateValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const dateInputRef = useRef<DateInputHandle>(null);

  const handleDateChange = useCallback((value: string) => {
    setDateValue(value);
  }, []);

  // La fecha ya pudo haberse enviado desde el hero de la home: si está
  // guardada, la precargamos y saltamos directo al paso de adelanto.
  useEffect(() => {
    const stored = loadOnboardingData();
    if (stored?.dateValue && /^\d{4}-\d{2}-\d{2}$/.test(stored.dateValue)) {
      setDateValue(stored.dateValue);
      setStep("preview");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDateSubmit = () => {
    if (!isDateValid) {
      dateInputRef.current?.reportIncomplete();
      return;
    }
    changeStep("preview");
  };

  const changeStep = (next: "date" | "preview" | "location") => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleFinish = () => {
    setIsGenerating(true);
    try {
      const [year, month, day] = dateValue.split("-");
      saveOnboardingData({ day, month, year, dateValue, dateOfBirth: dateValue });
      analytics.track({ type: "onboarding_completed" });
      markOnboardingCompleted();
      clearOnboardingData();
      router.push(`/profile?dob=${dateValue}&first=1`);
    } catch (error) {
      console.error("Error generating profile:", error);
      setIsGenerating(false);
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && isDateValid) handleDateSubmit();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDateValid, dateValue]
  );

  const currentStepIndex = STEPS.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-xl px-4 sm:px-8 lg:px-12 py-16 sm:py-24" id="main-content">
        
        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
          role="navigation"
          aria-label="Progreso del onboarding"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            {STEPS.map((s, i) => (
              <span
                key={s.id}
                className={`font-mono text-xs font-semibold tracking-[0.2em] uppercase transition-colors ${
                  i <= currentStepIndex ? "text-accent" : "text-muted/70"
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>
          <div className="w-full max-w-md mx-auto h-1 bg-ink/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full bg-accent rounded-full"
            />
          </div>
        </motion.div>

        {step === "date" ? (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[0.9] mb-4">
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
              transition={{ duration: 0.25 }}
              className="mb-8"
              onKeyDown={handleKeyDown}
            >
              <DateInput ref={dateInputRef} value={dateValue} onChange={handleDateChange} />
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center"
            >
              <Button
                variant="accent"
                size="lg"
                onClick={handleDateSubmit}
                aria-disabled={!isDateValid}
                className={!isDateValid ? "opacity-50" : ""}
              >
                Continuar
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </>
        ) : step === "preview" ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-6"
            >
              <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground leading-[0.95]">
                Esto ya dice algo de vos
              </h1>
              <p className="mt-2 text-sm text-muted">Y todavía no sabemos tu nombre.</p>
            </motion.div>

            <DimensionsPreview birthDate={dateValue} />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center"
            >
              <Button variant="accent" size="lg" onClick={() => changeStep("location")}>
                Ver mi mapa completo
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </>
        ) : (
          <LocationStep onDone={handleFinish} isSubmitting={isGenerating} />
        )}
      </main>
      <UniversityFooter />
    </div>
  );
}