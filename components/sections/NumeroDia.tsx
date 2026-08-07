"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { fadeUp } from "@/lib/utils/motion";
import { getPersonalDayForDate } from "@/lib/calculations";

export default function NumeroDia() {
  const router = useRouter();
  const dailyNumber = getPersonalDayForDate(1, 1, 2000, new Date());

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
        </motion.div>

        <motion.p {...fadeUp} className="text-base sm:text-lg text-muted/60 leading-relaxed max-w-xl mx-auto mb-12">
          Tu número de hoy te invita a...
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