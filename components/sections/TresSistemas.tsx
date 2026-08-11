"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { fadeUp } from "@/lib/utils/motion";

const systems = [
  {
    title: "Numerología",
    subtitle: "Tu fecha y hora revelan patrones que ya estás viviendo.",
    href: "/conocimiento/numerologia",
    description: "Directo, cuantificable. Tu número de vida, tu expresión, tu año personal.",
  },
  {
    title: "Astrología",
    subtitle: "Tu lugar en el cosmos te da un mapa energético único.",
    href: "/conocimiento/astrologia",
    description: "Geográfico, visual. Tu sol, tu luna, tu ascendente. El cielo de tu nacimiento.",
  },
  {
    title: "Zodiaco Chino",
    subtitle: "Tu año define un ciclo que guía tus decisiones.",
    href: "/conocimiento/zodiaco-chino",
    description: "Tradicional, simbólico. Tu animal, tu elemento, tu pilar del año.",
  },
];

export default function TresSistemas() {
  const router = useRouter();

  return (
    <section className="bg-card border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.h2 {...fadeUp} className="font-display text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight text-foreground text-center mb-16">
          Qué hace diferente a Molino.
        </motion.h2>

        <motion.div
          {...fadeUp}
          className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-ink/10"
        >
          {systems.map((system, i) => (
            <motion.div
              key={system.title}
              {...fadeUp}
              style={{ transitionDelay: `${i * 0.08}s` }}
              className="pt-8 lg:pt-0 first:pt-0 lg:px-8 first:pl-0 last:pr-0"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-2 h-2 rounded-full shrink-0 bg-muted" aria-hidden="true" />
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                  {system.title}
                </h3>
              </div>
              <p className="text-sm text-muted/70 leading-relaxed mb-4">
                {system.subtitle}
              </p>
              <p className="text-xs text-muted/70 leading-relaxed">
                {system.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="text-center mt-16 pt-8 border-t border-ink/10">
          <p className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-6 max-w-xl mx-auto leading-tight">
            Tres lenguajes, una sola persona.
          </p>
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