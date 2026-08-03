"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import UniversityFooter from "@/components/layout/UniversityFooter";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import Button from "@/components/ui/Button";
import { analytics } from "@/lib/analytics/analytics";
import { saveOnboardingData, clearOnboardingData } from "@/lib/session/ephemeral";
import { markOnboardingCompleted } from "@/lib/session/discovery";
import LocationStep from "@/components/onboarding/LocationStep";
import DimensionsPreview from "@/components/onboarding/DimensionsPreview";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"date" | "preview" | "location">("date");
  const [dateValue, setDateValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const dateInputRef = useRef<DateInputHandle>(null);

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

  const handleDateSubmit = () => {
    if (!isDateValid) {
      dateInputRef.current?.reportIncomplete();
      return;
    }
    changeStep("preview");
  };

  // Al cambiar de paso hay que volver arriba: el header es fijo (z-50) y si
  // el scroll queda donde estaba (el usuario bajó para ver el adelanto), el
  // botón del paso siguiente queda pegado arriba, detrás del header, y es
  // imposible de clickear. Mismo patrón que ProfileClient al entrar a un tab.
  const changeStep = (next: "date" | "preview" | "location") => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleFinish = () => {
    setIsGenerating(true);
    try {
      const [year, month, day] = dateValue.split("-");
      saveOnboardingData({ day, month, year, dateValue, dateOfBirth: dateValue });
      // No mandamos la fecha real al tracker: /filosofia promete que la
      // fecha de nacimiento no se asocia a analytics. Solo registramos que
      // el onboarding se completó.
      analytics.track({ type: "onboarding_completed" });
      // Marca el onboarding como completado para que discovery.ts active el
      // "próximo descubrimiento" del hub y deje de mostrar el CTA guiado a
      // usuarios que ya pasaron por el recorrido.
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

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-xl px-4 sm:px-6 py-16 sm:py-24" id="main-content">
        {step === "date" ? (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <p className="eyebrow-brutalist mb-3">
                Mapa personal de autoconocimiento
              </p>
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

            {/* CTA — nada aparece debajo de los campos de fecha salvo esto */}
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
            {/* Adelanto — la primera devolución concreta por haber puesto la
                fecha, antes de pedir nada más. Ver DimensionsPreview.tsx. */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-6"
            >
              <p className="eyebrow-brutalist mb-3">Esto ya dice algo de vos</p>
              <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground leading-[0.95]">
                Y todavía no sabemos tu nombre.
              </h1>
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