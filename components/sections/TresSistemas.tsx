"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Divider from "@/components/ui/Divider";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";

const systems = [
  {
    title: "Numerología",
    subtitle: "Tu fecha de nacimiento revela patrones que ya estás viviendo.",
    href: "/conocimiento/numerologia",
    description: "Directo, cuantificable. Tu número de vida, tu expresión, tu año personal.",
    badge: "numerology" as const,
    badgeLabel: "NÚMEROS",
  },
  {
    title: "Astrología",
    subtitle: "Tu lugar en el cosmos te da un mapa energético único.",
    href: "/conocimiento/astrologia",
    description: "Geográfico, visual. Tu signo solar y, si sumás hora y lugar de nacimiento, también tu luna y tu ascendente.",
    badge: "astrology" as const,
    badgeLabel: "COSMOS",
  },
  {
    title: "Zodiaco Chino",
    subtitle: "Tu año define un ciclo que guía tus decisiones.",
    href: "/conocimiento/zodiaco-chino",
    description: "Tradicional, simbólico. Tu animal, tu elemento, tu pilar del año.",
    badge: "zodiac" as const,
    badgeLabel: "CICLOS",
  },
];

export default function TresSistemas() {
  const router = useRouter();

  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.h2
          {...fadeUpDelayed(0)}
          className="type-h2 text-center mb-4"
        >
          Qué hace diferente a Molino
        </motion.h2>

        <motion.p
          {...fadeUpDelayed(0.05)}
          className="type-caption text-center text-muted mb-12"
        >
          Tres lenguajes de autoconocimiento en uno
        </motion.p>

        <Divider variant="star" className="mb-12" />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {systems.map((system, i) => (
            <motion.div
              key={system.title}
              {...fadeUpDelayed(0.1 + i * 0.1)}
              className="flex flex-col h-full"
            >
              <div className="mb-4">
                <Badge variant={system.badge}>{system.badgeLabel}</Badge>
              </div>

              <h3 className="type-h3 mb-2">{system.title}</h3>

              <p className="type-caption text-muted mb-4">
                {system.subtitle}
              </p>

              <Divider variant="rule" className="my-6" />

              <p className="type-body text-muted/80 leading-relaxed flex-1 mb-6">
                {system.description}
              </p>

              <Link
                href={system.href}
                className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors font-heading text-sm font-semibold uppercase tracking-wider"
              >
                Conocer más
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <Divider variant="accent" className="my-12" />

        <motion.div
          {...fadeUpDelayed(0.4)}
          className="text-center"
        >
          <p className="type-h3 mb-8 max-w-2xl mx-auto">
            ¿Listo para descubrirte?
          </p>
          <Button
            variant="gold"
            size="lg"
            onClick={() => router.push("/onboarding")}
            className="group inline-flex items-center gap-2"
          >
            Generá tu mapa personal
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}