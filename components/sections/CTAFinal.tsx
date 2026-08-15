"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import DateInput, { type DateInputHandle } from "@/components/ui/DateInput";
import { fadeUp } from "@/lib/utils/motion";
import { saveOnboardingData } from "@/lib/session/ephemeral";

function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year] = value.split("-").map(Number);
  const birth = new Date(`${value}T00:00:00`);
  return year >= 1900 && birth < new Date();
}

export default function CTAFinal() {
  const router = useRouter();
  const [dateValue, setDateValue] = useState("");
  const dateInputRef = useRef<DateInputHandle>(null);
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

  return (
    <section className="bg-accent/[0.05] border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-8 lg:px-12 text-center">
        <motion.h2 {...fadeUp} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[0.9] mb-3">
          Tu claridad está a un clic.
        </motion.h2>

        <motion.p {...fadeUp} className="text-base sm:text-lg text-muted/70 leading-relaxed mb-8 max-w-md mx-auto">
          Ingresá tu fecha de nacimiento y recibí tu mapa personal en segundos.
        </motion.p>

        <motion.div {...fadeUp} className="w-[90%] sm:w-auto mx-auto mb-4" onKeyDown={handleKeyDown}>
          <DateInput ref={dateInputRef} value={dateValue} onChange={setDateValue} />
        </motion.div>

        <motion.div {...fadeUp} className="flex justify-center mb-3">
          <Button
            variant="accent"
            size="lg"
            onClick={handleGenerate}
            aria-disabled={!isDateValid ? "true" : undefined}
            className={`w-[90%] sm:w-auto ${!isDateValid ? "opacity-50" : ""}`}
          >
            Crear mi mapa
          </Button>
        </motion.div>

        <motion.p {...fadeUp} className="font-mono text-xs text-muted/70 tracking-wide">
          Gratis · Sin registro · Sin guardar datos
          {" · "}
          <Link href="/ejemplo" className="underline decoration-muted/40 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
            Ver un ejemplo →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}