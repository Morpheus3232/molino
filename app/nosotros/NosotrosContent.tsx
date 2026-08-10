"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, fadeUpDelayed, staggerItem } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";

const story = [
  "Molino nació de la idea de que el autoconocimiento no necesita ser complicado ni sensacionalista. Cruzamos tres sistemas ancestrales —numerología, astrología y zodíaco chino— en una sola herramienta directa y honesta.",
  "No creemos en predicciones del futuro. Creemos en patrones que ya estás viviendo y que, al nombrarlos, te permiten decidir con más claridad.",
  "Empezamos por hartazgo: sitios que prometían certezas absolutas a partir de un solo dato, apps que pedían tu nombre, tu email y tu tarjeta antes de mostrarte nada. Quisimos construir lo contrario — una herramienta que te devuelva algo útil en segundos, sin fricción y sin letra chica.",
  "Somos un equipo chico que trata la privacidad como un principio de diseño, no como una promesa de marketing. Molino sigue creciendo con esa misma idea: cuanto más simple y transparente sea el camino hacia tu mapa, más confiable es lo que encontrás en él.",
];

const values = [
  {
    title: "Sin sensacionalismo",
    description: "No hablamos de destino ni de certezas absolutas. Te mostramos patrones para pensar, no profecías para creer.",
  },
  {
    title: "Privacidad real",
    description: "Tu fecha de nacimiento se calcula en tu navegador. No la guardamos en ningún servidor ni la usamos para otra cosa.",
  },
  {
    title: "Tres lenguajes, una persona",
    description: "Numerología, astrología y zodíaco chino no compiten entre sí: se cruzan para mostrar a la misma persona desde tres ángulos.",
  },
];

export default function NosotrosContent() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">
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
          <div className="mb-10">
            <h2 id="enfoque-heading" className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
              Nuestro enfoque
            </h2>
            <p className="text-muted max-w-xl">
              Tres ideas que guían cada decisión de producto.
            </p>
          </div>

          <div className="space-y-px bg-ink/10" role="list" aria-label="Nuestro enfoque">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                role="listitem"
                {...staggerItem}
                className="p-6 sm:p-8 bg-background"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-semibold tracking-wider text-muted shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeUpDelayed(0.15)} className="text-center border-t border-ink/10 pt-16">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground mb-3">
            ¿Querés ver el tuyo?
          </h2>
          <p className="text-sm text-muted mb-8 max-w-sm mx-auto">
            Generá tu mapa personal en segundos, gratis y sin registro.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link href="/onboarding">
              Conocé tu mapa
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
        </motion.section>
      </main>

      <UniversityFooter />
    </div>
  );
}
