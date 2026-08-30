"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";

// CORE: lo que sostiene el mapa personal (mismo criterio que Fase 3 de la
// auditoría — mapa / ciclos / afinidades). El resto es ecosistema: útil,
// pero no debería competir en peso visual con el núcleo del producto.
//
// `meta` es la línea mono de arriba de cada tarjeta: dice de qué está hecha
// la pantalla, no la vende. En "Hoy" es la fecha real del visitante —
// resuelta después del mount, porque el servidor renderiza en su propio huso
// y una fecha calculada en render sería un mismatch de hidratación.
const coreFeatures = [
  {
    title: "Hoy",
    meta: null,
    description: "Qué número está activo hoy, y qué te pide.",
    href: "/hoy",
  },
  {
    title: "Ciclos",
    meta: "año · mes · día personal",
    description: "En qué ciclo estás y cuál es la próxima ventana que se abre.",
    href: "/calendario",
  },
  {
    title: "Afinidades",
    meta: "personas · lugares · marcas",
    description: "Con quién resonás por signo, y con qué parte del mundo.",
    href: "/pareja",
  },
];

const ecosystemLinks: { title: string; href: string }[] = [
  { title: "Journal", href: "/journal" },
  { title: "Atlas", href: "/atlas" },
  { title: "Exportar tu mapa", href: "/profile" },
];

export default function FeaturesSection() {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(new Date()),
    );
  }, []);

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-ink overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-5">
            Qué hacés con eso
          </p>
          <h2 className="font-display font-normal normal-case tracking-tight text-paper leading-[1.05] text-[clamp(2.25rem,5vw,3.5rem)]">
            El mapa cambia{" "}
            <em className="text-gradient-warm-dark">con la fecha.</em>
          </h2>
        </div>

        {/* Core Grid — 3 capacidades de un mismo sistema, no 3 productos.
            Antes el "Explorar →" aparecía solo en hover: en touch no existe
            y en desktop escondía la única señal de que la tarjeta es un link.
            Ahora la flecha está siempre y lo que cambia en hover es su
            posición, no su presencia. */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-paper/10 border-y border-paper/10">
          {coreFeatures.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative flex h-full flex-col gap-3 p-8 md:p-10 transition-colors duration-300 hover:bg-paper/[0.04] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
            >
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent-light/80">
                {feature.meta ?? today ?? "\u00a0"}
              </span>

              <h3 className="font-display italic font-normal normal-case text-[1.75rem] text-paper leading-none">
                {feature.title}
              </h3>

              <p className="text-paper/60 leading-relaxed text-sm max-w-xs">
                {feature.description}
              </p>

              <ArrowUpRight
                className="mt-auto pt-6 w-9 h-9 text-paper/35 transition-all duration-300 group-hover:text-accent-light group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {/* Ecosistema — accesible, sin competir en peso con el core */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40 mr-1">
            También en tu mapa
          </span>
          {ecosystemLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm border border-paper/15 px-3 py-1.5 text-sm text-paper/70 transition-colors hover:border-accent-light/60 hover:text-accent-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Premium — el detalle (precio y tabla gratis/Pro) vive en /premium:
            PremiumGate es la fuente única. Acá va la línea que hace falta para
            saber que existe, nada más.

            Fase 4: la línea anterior era "Ver tu mapa es gratis. Entenderlo es
            Premium." Además de contradecir de frente la posición del proyecto
            (el conocimiento no se paga), era FALSA: la Lectura gratuita ya trae
            toda la síntesis determinista —cruces entre sistemas, tensiones,
            patrones, reglas y lo que no se puede afirmar—. Lo que se paga es la
            interpretación escrita y la conversación, no el entendimiento. */}
        <div className="mt-20 pt-10 border-t border-paper/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <h3 className="font-display font-normal normal-case text-2xl sm:text-3xl text-paper tracking-tight leading-[1.1] max-w-lg">
            Tu mapa y tu lectura son gratis.{" "}
            <em className="text-gradient-warm-dark">La conversación es Pro.</em>
          </h3>
          <Link
            href="/premium"
            className="group inline-flex items-center gap-2 font-mono text-xs text-accent-light hover:underline underline-offset-4 shrink-0"
          >
            Ver qué incluye
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
