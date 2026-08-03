"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface JourneyProps {
  /** Si el usuario ya tiene mapa, el paso 01 deja de vender "creá tu mapa"
   *  (ya lo hizo) y se convierte en una entrada a su propio mapa. */
  hasProfile?: boolean;
}

const steps: Array<{
  number: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}> = [
  { number: "01", title: "DESCUBRÍ", description: "Creá tu mapa con tu fecha de nacimiento. Sin registro, al instante.", href: "/onboarding", cta: "EMPEZÁ AHORA" },
  { number: "02", title: "ENTENDÉ", description: "Conocé tu mapa de numerología, zodíaco y astrología en un solo lugar.", href: "/profile", cta: "ARMÁ TU MAPA" },
  { number: "03", title: "EXPLORÁ", description: "Descubrí patrones, ciclos y sincronías ocultas en tu perfil.", href: "/explore", cta: "MIRÁ TUS PATRONES" },
  { number: "04", title: "CONECTÁ", description: "Compará tu perfil con países, ciudades y marcas que resuenan con vos.", href: "/affinity", cta: "COMPARÁ AFINIDADES" },
  { number: "05", title: "REFLEXIONÁ", description: "Tomá perspectiva con tu lectura completa de todos los sistemas.", href: "/biblioteca", cta: "LEÉ MÁS" },
];

/**
 * Lista numerada a escala editorial: el numeral es el elemento grafico y cada
 * paso ocupa una fila completa, en vez de cinco columnas apretadas.
 */
export default function Journey({ hasProfile = false }: JourneyProps) {
  const resolved = hasProfile
    ? [
        { ...steps[0], description: "Tu mapa ya está listo: identidad, mundo, círculo e inteligencia en un solo lugar.", href: "/profile", cta: "VER MI MAPA" },
        ...steps.slice(1),
      ]
    : steps;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="pt-20 pb-12 lg:pt-28 lg:pb-16"
        >
          <p className="eyebrow-brutalist mb-6">RECORRIDO</p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.88] tracking-tight text-foreground">
            CINCO PASOS
            <br />
            HACIA ADENTRO.
          </h2>
          <p className="text-base lg:text-lg text-muted mt-8 max-w-xl leading-relaxed">
            De tu fecha de nacimiento a una lectura completa de identidad, patrones y conexiones.
          </p>
        </motion.div>

        {/* Una fila por paso: el numeral manda */}
        <div className="border-t border-ink/10">
          {resolved.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
                href={step.href}
                className="group grid grid-cols-1 md:grid-cols-12 items-baseline gap-4 md:gap-8 border-b border-ink/10 px-0 py-8 lg:py-12 transition-colors hover:bg-ink/[0.02]"
              >
                <span className="md:col-span-2 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.85] text-ink/15 transition-colors group-hover:text-accent">
                  {step.number}
                </span>

                <h3 className="md:col-span-3 font-display text-2xl lg:text-4xl leading-[0.95] text-foreground">
                  {step.title}
                </h3>

                <p className="md:col-span-5 text-sm lg:text-base text-muted leading-relaxed">
                  {step.description}
                </p>

                <span className="md:col-span-2 md:text-right inline-flex md:justify-end items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                  {step.cta}
                  <span
                    className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="h-8 lg:h-12" />
      </div>
    </section>
  );
}
