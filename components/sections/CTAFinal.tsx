"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { fadeUp } from "@/lib/utils/motion";

export default function CTAFinal() {
  const router = useRouter();

  return (
    <section className="bg-card border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-12 text-center">
        <motion.p {...fadeUp} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[0.9] mb-6">
          TU MAPA TE ESPERA.
        </motion.p>

        <motion.p {...fadeUp} className="text-base sm:text-lg text-muted/70 leading-relaxed mb-10 max-w-xl mx-auto">
          Ya conocés los tres lenguajes de Molino.
          <br />
          Numerología, astrología y zodíaco chino convergen
          <br />
          en un solo lugar: tu identidad.
        </motion.p>

        <motion.p {...fadeUp} className="text-sm text-muted/50 leading-relaxed mb-10 max-w-xl mx-auto">
          No hay prisa. No hay presión.
          <br />
          Solo una invitación a conocerte.
        </motion.p>

        <motion.div {...fadeUp} className="flex justify-center">
          <Button
            onClick={() => router.push("/onboarding")}
            className="group w-auto sm:w-[240px]"
            size="lg"
          >
            <span className="flex items-center gap-2 justify-center">
              CREAR MI MAPA
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}