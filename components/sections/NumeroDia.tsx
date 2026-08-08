"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { fadeUp } from "@/lib/utils/motion";
import { getDailyNumber } from "@/lib/numerology/daily";
import { getDailyReflection } from "@/lib/numerology/daily";
import {
  DAY_NUMBER_CONTENT,
  buildCalculationBreakdown,
} from "@/lib/numerology/dayNumberContent";

function formatDateLong(date: Date): string {
  const d = date.getDate();
  const month = date.toLocaleDateString("es-419", { month: "long" });
  const year = date.getFullYear();
  const weekday = date.toLocaleDateString("es-419", { weekday: "long" });
  return `${weekday}, ${d} ${month} ${year}`;
}

export default function NumeroDia() {
  const router = useRouter();
  const today = new Date();
  const dailyNumber = getDailyNumber(today);
  const reflection = getDailyReflection(dailyNumber, today);
  const content = DAY_NUMBER_CONTENT[dailyNumber];
  const calculation = buildCalculationBreakdown(today);
  const isMaster = [11, 22, 28, 33].includes(dailyNumber);

  return (
    <section className="relative bg-background min-h-[70vh] flex items-center justify-center border-t border-ink/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12 text-center">
        <motion.p {...fadeUp} className="eyebrow-brutalist mb-5">
          NÚMERO DEL DÍA
        </motion.p>

        <motion.p {...fadeUp} className="text-sm sm:text-base text-muted/70 mb-12 max-w-xl mx-auto">
          {formatDateLong(today)}
        </motion.p>

        <motion.div {...fadeUp} className="mb-6">
          <div className="font-display text-[clamp(6rem,20vw,12rem)] font-bold tracking-tight text-foreground leading-[0.85]">
            {dailyNumber}
          </div>
          {isMaster && (
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mt-3">
              {reflection.title === "Maestro"
                ? "Número Maestro — Intuición y visión"
                : reflection.title === "Constructor"
                  ? "Número Maestro — Constructor visionario"
                  : reflection.title === "Guía"
                    ? "Número Maestro de Maestros — Servicio"
                    : "Número de la Riqueza — Autoridad"}
            </p>
          )}
        </motion.div>

        <motion.h2 {...fadeUp} className="font-display text-xl sm:text-2xl tracking-tight text-foreground uppercase mb-5">
          {content?.theme ?? reflection.title}
        </motion.h2>

        <motion.p {...fadeUp} className="text-base sm:text-lg text-muted/70 leading-relaxed max-w-xl mx-auto mb-8">
          {content?.description ?? reflection.text}
        </motion.p>

        <motion.p {...fadeUp} className="font-mono text-xs text-accent/60 tracking-wide mb-12">
          {calculation}
        </motion.p>

        <motion.div {...fadeUp} className="flex justify-center">
          <Button
            onClick={() => router.push("/onboarding")}
            className="group w-auto sm:w-[220px]"
            size="lg"
          >
            <span className="flex items-center gap-2 justify-center">
              CREAR MI MAPA
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
