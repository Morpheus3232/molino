"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
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

export default function Hero() {
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
    <section className="relative bg-background min-h-[100dvh] lg:h-[calc(100dvh-3.5rem)] flex items-center overflow-hidden border-t border-ink/10">
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-8 py-8 text-center w-full">
        <motion.h1
          {...fadeUp}
          className="font-display text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-tight text-foreground leading-[1.05] mb-3"
        >
          Descubrí quién sos.
          <br className="hidden sm:block" /> En un solo lugar.
        </motion.h1>

        <motion.p {...fadeUp} className="text-base sm:text-lg text-muted/70 leading-relaxed max-w-md mx-auto mb-6">
          Numerología, astrología y zodíaco chino cruzados en tu mapa personal.
        </motion.p>

        <motion.div
          {...fadeUp}
          className="w-[90%] sm:w-auto mx-auto mb-4"
          onKeyDown={handleKeyDown}
        >
          <DateInput ref={dateInputRef} value={dateValue} onChange={setDateValue} />
        </motion.div>

        <motion.div {...fadeUp} className="flex justify-center mb-4">
          <Badge variant="muted">Gratis · Sin registro</Badge>
        </motion.div>

        <motion.div {...fadeUp} className="flex justify-center mb-3">
          <Button
            variant="accent"
            size="lg"
            onClick={handleGenerate}
            aria-disabled={!isDateValid}
            className={`w-[90%] sm:w-auto ${!isDateValid ? "opacity-50" : ""}`}
          >
            Generar mi mapa
          </Button>
        </motion.div>

        <motion.p {...fadeUp} className="font-mono text-xs text-muted/70 tracking-wide">
          Gratis. Sin registro. Sin guardar datos.
          {" · "}
          <Link href="/ejemplo" className="underline decoration-muted/40 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
            Ver un ejemplo
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
