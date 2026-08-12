"use client";

import React from "react";
import { motion } from "framer-motion";
import Halftone from "@/components/ui/Halftone";

type Tone = "paper" | "paperAlt" | "ink" | "accent";

interface EditorialSectionProps {
  /** Etiqueta corta en mayusculas (mono). Ej: "SISTEMAS SIMBOLICOS". */
  eyebrow?: string;
  /** Titular. Se renderiza a escala display, como en la home. */
  title?: React.ReactNode;
  /** Bajada opcional. */
  intro?: React.ReactNode;
  /**
   * Tono de la seccion. `ink` y `accent` son full-bleed: rompen el ancho del
   * contenedor para dar el ritmo de contraste de la home.
   */
  tone?: Tone;
  /** Textura decorativa de esquina. */
  texture?: "circle" | "spiral" | "wave" | "grid" | "none";
  /** Numeral grande a la izquierda del titular. Ej: "01". */
  numeral?: string;
  /** Nivel del encabezado. La home usa h2; una pagina puede necesitar h1. */
  as?: "h1" | "h2";
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

const TONES: Record<Tone, { wrap: string; eyebrow: string; title: string; intro: string; rule: string }> = {
  paper: {
    wrap: "bg-background",
    eyebrow: "text-accent",
    title: "text-foreground",
    intro: "text-muted",
    rule: "border-ink/10",
  },
  paperAlt: {
    wrap: "section-paper-alt",
    eyebrow: "text-accent",
    title: "text-foreground",
    intro: "text-muted",
    rule: "border-ink/10",
  },
  ink: {
    // "ink" evoca un bloque negro full-bleed (ver comentarios de uso, ej.
    // "SIGNIFICADO — negro full-bleed") — pero en este sitio --color-ink es
    // el tono CLARO de texto y --color-paper es el fondo OSCURO (nombres
    // heredados de un rebuild que invirtió la base clara original sin
    // renombrar las variables). bg-ink acá pintaba el fondo claro, lo
    // opuesto de la intención, y de paso rompía el contraste del eyebrow
    // (pensado para texto claro sobre fondo oscuro). bg-paper/text-ink es
    // el bloque negro real.
    wrap: "section-full-bleed bg-paper text-ink",
    eyebrow: "text-accent-light",
    title: "text-ink",
    intro: "text-ink/70",
    rule: "border-ink/15",
  },
  accent: {
    wrap: "section-full-bleed bg-accent text-paper",
    eyebrow: "text-paper/85",
    title: "text-paper",
    intro: "text-paper/85",
    rule: "border-paper/20",
  },
};

/**
 * Seccion editorial reutilizable — el lenguaje visual de la home, listo para
 * usar en el interior del sitio.
 *
 * El interior venia con encabezados de 11px en mayusculas, que se leian como
 * metadatos y no como titulos. Esto unifica: tipografia a escala, ritmo de
 * contraste entre secciones y textura opcional.
 */
export default function EditorialSection({
  eyebrow,
  title,
  intro,
  tone = "paper",
  texture = "none",
  numeral,
  as = "h2",
  className = "",
  children,
  id,
}: EditorialSectionProps) {
  const t = TONES[tone];
  const isFullBleed = tone === "ink" || tone === "accent";
  const Heading = as;

  return (
    <section
      id={id}
      className={`relative ${texture !== "none" || isFullBleed ? "overflow-hidden" : ""} ${t.wrap} ${className}`}
    >
      {texture !== "none" && (
        <div
          className={`pointer-events-none absolute -right-40 -top-40 w-[34rem] h-[34rem] ${
            isFullBleed ? "text-paper" : "text-ink"
          }`}
          style={{ opacity: isFullBleed ? 0.045 : 0.035 }}
        >
          <Halftone variant={texture} resolution={30} className="w-full h-full" />
        </div>
      )}

      <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {(eyebrow || title || intro) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className={`${isFullBleed ? "pt-20 lg:pt-28" : "pt-16 lg:pt-24"} pb-10 lg:pb-14`}
          >
            {eyebrow && (
              <p
                className={`font-mono text-xs font-semibold tracking-[0.3em] uppercase mb-6 ${t.eyebrow}`}
              >
                {eyebrow}
              </p>
            )}

            {title && (
              <div className="flex items-baseline gap-6">
                {numeral && (
                  <span
                    className={`font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.85] ${
                      isFullBleed ? "text-paper/20" : "text-ink/15"
                    }`}
                    aria-hidden="true"
                  >
                    {numeral}
                  </span>
                )}
                <Heading
                  className={`font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.88] tracking-tight max-w-4xl ${t.title}`}
                >
                  {title}
                </Heading>
              </div>
            )}

            {intro && (
              <p className={`text-base lg:text-lg mt-8 max-w-xl leading-relaxed ${t.intro}`}>
                {intro}
              </p>
            )}
          </motion.div>
        )}

        {children && <div className={`border-t ${t.rule}`}>{children}</div>}

        <div className={isFullBleed ? "h-20 lg:h-28" : "h-12 lg:h-16"} />
      </div>
    </section>
  );
}
