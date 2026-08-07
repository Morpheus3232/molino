"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { fadeUp } from "@/lib/utils/motion";
import { getPersonalDayForDate, calculateLifePath } from "@/lib/calculations";

/**
 * Explicación del número del día (ejemplo real):
 * Fecha: 11/03/1990 → Life Path = 1+1+0+3+1+9+9+0 = 24 → 2+4 = 6
 * Hoy (ejemplo 07/08/2026): Personal Day = 6 + (7+8+2+0+2+6) = 6+25 = 31 → 3+1 = 4
 * 
 * El número 11 es un "Número Maestro" — no se reduce.
 * Significado: Intuición elevada, visión, inspiración, canalización.
 * Día 11: Ideal para conectar con tu propósito, meditar, escribir, crear.
 */

export default function NumeroDia() {
  const router = useRouter();
  // Ejemplo real: nacida 11/03/1990 → Life Path 6
  // Hoy 07/08/2026 → Personal Day = 6 + (7+8+2+0+2+6) = 6+25=31→4
  // Pero para demo usamos 11 como número maestro
  const dailyNumber = 11;
  const lifePathExample = 6;
  const today = new Date();
  const calculatedDay = getPersonalDayForDate(11, 3, 1990, today);

  return (
    <section className="relative bg-background min-h-[70vh] flex items-center justify-center border-t border-ink/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12 text-center">
        <motion.p {...fadeUp} className="eyebrow-brutalist mb-5">
          NÚMERO DEL DÍA
        </motion.p>

        <motion.p {...fadeUp} className="text-sm sm:text-base text-muted/70 mb-10 max-w-xl mx-auto">
          Un número · Un mapa · Conocerte
        </motion.p>

        <motion.div {...fadeUp} className="mb-10">
          <div className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.85]">
            {dailyNumber}
          </div>
          <motion.p className="font-mono text-xs tracking-[0.2em] uppercase text-accent/70 mt-2">
            Número Maestro — Intuición y visión
          </motion.p>
        </motion.div>

        <motion.p {...fadeUp} className="text-base sm:text-lg text-muted/60 leading-relaxed max-w-xl mx-auto mb-6">
          Hoy es día 11: canalizá tu intuición. Escribí, meditá, escuchá.
        </motion.p>

        <motion.p {...fadeUp} className="text-sm text-muted/50 leading-relaxed max-w-xl mx-auto mb-12">
          Ejemplo: nacida 11/03/1990 (Vida 6) → hoy día {calculatedDay}.
          <br />
          Tu número personal cambia cada día según tu fecha de nacimiento.
        </motion.p>

        <motion.div {...fadeUp} className="flex justify-center">
          <Button
            onClick={() => router.push("/onboarding")}
            className="group w-auto sm:w-[220px]"
            size="lg"
          >
            <span className="flex items-center gap-2 justify-center">
              EMPEZÁ
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}