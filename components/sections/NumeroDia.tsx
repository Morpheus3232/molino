"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Grainient from "@/components/Grainient";
import Logo from "@/components/ui/Logo";
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
    <section className="relative bg-background min-h-[85vh] overflow-hidden border-t border-ink/10">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <Grainient timeSpeed={0.06} grainAmount={0.1} zoom={1.4} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/20 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 lg:px-12 py-20 sm:py-28 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-4 items-center">
        <div className="text-center lg:text-left order-2 lg:order-1">
          <motion.p {...fadeUp} className="text-sm sm:text-base text-muted/70 mb-8">
            {formatDateLong(today)}
          </motion.p>

          <motion.div {...fadeUp} className="mb-6">
            <div className="font-display text-[clamp(5rem,14vw,8.5rem)] font-bold tracking-tight text-foreground leading-[0.85]">
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

          <motion.p {...fadeUp} className="text-base sm:text-lg text-muted/70 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6">
            {content?.description ?? reflection.text}
          </motion.p>

          <motion.p {...fadeUp} className="font-mono text-xs text-accent/70 tracking-wide mb-10">
            {calculation}
          </motion.p>

          <motion.div {...fadeUp} className="flex justify-center lg:justify-start">
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

        <motion.div
          {...fadeUp}
          className="order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          <div className="relative flex items-center justify-center w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-20 -z-10"
              style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
              aria-hidden="true"
            />
            <Logo className="w-full h-full text-ink" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
