"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, fadeUpDelayed, staggerItem } from "@/lib/utils/motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const story = [
  "Molino nació de la idea de que el autoconocimiento no necesita ser complicado ni sensacionalista.",
  "Cruzamos tres sistemas ancestrales —numerología, astrología y zodíaco chino— en una sola herramienta directa y honesta.",
  "No creemos en predicciones del futuro. Creemos en patrones que ya estás viviendo y que, al nombrarlos, te permiten decidir con más claridad.",
  "Cada mapa que generás es tuyo. No lo guardamos, no lo vendemos, no te pedimos nada a cambio.",
];

const values = [
  {
    title: "Sin sensacionalismo",
    description: "Sin clickbait, sin alarmas. Solo información clara.",
  },
  {
    title: "Privacidad real",
    description: "Nada de tu información llega a nuestros servidores. Nunca.",
  },
  {
    title: "Tres lenguajes, una persona",
    description: "Numerología, astrología y zodíaco chino en un solo lugar.",
  },
];

export default function NosotrosContent() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
        <nav className="flex items-center gap-2 text-xs text-muted mb-10" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Quiénes somos</span>
        </nav>

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-24">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05] max-w-3xl">
            Quiénes estamos detrás de Molino
          </h1>
          <p className="text-muted/70 mt-4 text-lg">
            Autoconocimiento sin ruido, desde 2026.
          </p>
        </motion.section>

        {/* Historia */}
        <motion.section {...fadeUpDelayed(0.05)} className="mb-20 max-w-2xl">
          <div className="space-y-5">
            {story.map((paragraph, i) => (
              <p key={i} className="text-base sm:text-lg text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.section>

        {/* Nuestro enfoque */}
        <motion.section {...fadeUpDelayed(0.1)} className="mb-20" aria-labelledby="enfoque-heading">
          <h2 id="enfoque-heading" className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground mb-10">
            Nuestro enfoque
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" role="list" aria-label="Nuestro enfoque">
            {values.map((value, i) => (
              <motion.div key={value.title} role="listitem" {...staggerItem}>
                <Card padding="lg" className="h-full">
                  <p className="font-mono text-xs font-semibold tracking-[0.2em] text-accent mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-heading text-lg text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeUpDelayed(0.15)} className="text-center border-t border-ink/10 pt-16">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground mb-3">
            Conocé tu mapa
          </h2>
          <p className="text-sm text-muted mb-8 max-w-sm mx-auto">
            Generá tu mapa personal en segundos, gratis y sin registro.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link href="/">
              Generar mi perfil
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
          <p className="font-mono text-xs text-muted/70 tracking-wide mt-4">
            Gratis · Sin registro · Sin guardar datos
          </p>
        </motion.section>
      </main>
    </div>
  );
}
