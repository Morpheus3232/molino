"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Halftone from "@/components/ui/Halftone";

const systems = [
  {
    index: "01",
    micro: "LOS NÚMEROS",
    title: "NUMEROLOGÍA",
    description: "Tu estructura interior revelada a través de los números de tu fecha de nacimiento.",
    href: "/conocimiento/numerologia",
    texture: "grid" as const,
  },
  {
    index: "02",
    micro: "EL CIELO",
    title: "ASTROLOGÍA",
    description: "Tu momento de nacimiento en el mapa celeste y la posición de los astros.",
    href: "/conocimiento/astrologia",
    texture: "circle" as const,
  },
  {
    index: "03",
    micro: "LOS CICLOS",
    title: "ZODÍACO CHINO",
    description: "Tu energía en el tiempo, según la sabiduría ancestral de los ciclos animales.",
    href: "/conocimiento/zodiaco-chino",
    texture: "spiral" as const,
  },
];

const cellPad = "p-8 lg:p-12";

/**
 * Seccion oscura full-bleed. Rompe el blanco del resto de la home y le da
 * ritmo de contraste a la pagina, como en la referencia editorial.
 */
export default function SystemsPreview() {
  return (
    <section className="section-full-bleed bg-ink text-paper relative overflow-hidden">
      {/* Textura de fondo: decorativa. Recostada en la esquina y a baja opacidad
          para que no compita con el titular. */}
      <div className="pointer-events-none absolute -right-40 -top-40 w-[34rem] h-[34rem] text-paper/[0.045]">
        <Halftone variant="spiral" resolution={30} className="w-full h-full" />
      </div>

      <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="pt-20 pb-12 lg:pt-28 lg:pb-16"
        >
          <p className="font-mono text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">
            SISTEMAS SIMBÓLICOS
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.88] tracking-tight text-paper max-w-4xl">
            UNA MISMA PERSONA.
            <br />
            TRES FORMAS
            <br />
            DE OBSERVARLA.
          </h2>
        </motion.div>

        {/* Tres columnas, divididas por bordes finos */}
        <div className="flex flex-wrap border-t border-paper/15">
          {systems.map((system, i) => (
            <motion.div
              key={system.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`w-full md:w-1/3 ${i < 2 ? "md:border-r border-paper/15" : ""} ${
                i < systems.length - 1 ? "border-b md:border-b-0 border-paper/15" : ""
              }`}
            >
              <Link
                href={system.href}
                aria-label={`Leer más sobre ${system.title}`}
                className={`group relative flex h-full flex-col ${cellPad} pb-16 lg:pb-20 transition-colors hover:bg-paper/[0.04]`}
              >
                {/* Numeral grande como firma visual */}
                <span className="font-display text-6xl lg:text-7xl leading-none text-paper/15 mb-8 transition-colors group-hover:text-accent">
                  {system.index}
                </span>

                <p className="font-mono text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-accent mb-4">
                  {system.micro}
                </p>
                <h3 className="font-display text-3xl lg:text-4xl leading-[0.92] text-paper mb-6">
                  {system.title}
                </h3>
                <p className="text-sm lg:text-base text-paper/60 leading-relaxed mb-10">
                  {system.description}
                </p>

                <span className="mt-auto inline-flex items-center gap-2 font-mono text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-paper">
                  LEER MÁS
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

        <div className="h-20 lg:h-28" />
      </div>
    </section>
  );
}
