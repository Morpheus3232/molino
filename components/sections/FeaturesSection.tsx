"use client";

import React from "react";
import { Calendar, Users, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

// CORE: lo que sostiene el mapa personal (mismo criterio que Fase 3 de la
// auditoría — mapa / ciclos / afinidades). El resto es ecosistema: útil,
// pero no debería competir en peso visual con el núcleo del producto.
const coreFeatures: Feature[] = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Hoy",
    description: "Tu vibración del día, actualizada cada 24 horas. Ciclos numerológicos y astrales.",
    href: "/hoy",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Ciclos",
    description: "Ventanas óptimas para decisiones. Tu calendario de ciclos personales.",
    href: "/calendario",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Afinidades",
    description: "Cómo tu mapa se conecta con otra persona, o con lugares y marcas.",
    href: "/pareja",
  },
];

const ecosystemLinks: { title: string; href: string }[] = [
  { title: "Journal", href: "/journal" },
  { title: "Atlas", href: "/atlas" },
  { title: "Exportar tu mapa", href: "/profile" },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-ink overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-5">
            Tu mapa, en movimiento
          </p>
          <h2 className="font-display font-normal normal-case tracking-tight text-paper leading-[1.05] text-[clamp(2.25rem,5vw,3.5rem)]">
            El mapa cambia{" "}
            <em className="text-gradient-warm-dark">con la fecha.</em>
          </h2>
        </div>

        {/* Core Grid — 3 capacidades de un mismo sistema, no 3 productos */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-paper/10 border-y border-paper/10"
        >
          {coreFeatures.map((feature, idx) => (
            <div key={idx}>
              <Link href={feature.href} className="group block h-full p-8 md:p-10 space-y-4 transition-colors duration-300 hover:bg-paper/[0.03]">
                <div className="text-accent">
                  {feature.icon}
                </div>

                <h3 className="font-display italic font-normal normal-case text-2xl text-paper">
                  {feature.title}
                </h3>

                <p className="text-paper/70 leading-relaxed text-sm">
                  {feature.description}
                </p>

                <span className="inline-flex items-center gap-1 font-mono text-xs text-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explorar →
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* Ecosistema — accesible, sin competir en peso con el core */}
        <div
          className="mt-10 pt-8 border-t border-paper/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40">
            También en tu mapa:
          </span>
          {ecosystemLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-paper/60 hover:text-accent-light transition-colors underline-offset-4 hover:underline"
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Premium — el detalle (precio y tabla gratis/Pro) vive en /premium:
            PremiumGate es la fuente única. Acá va la línea que hace falta para
            saber que existe, nada más. Antes esto era un grid de 3 perks que
            repetía esa tabla y el precio dos veces en la misma pantalla. */}
        <div className="mt-20 pt-10 border-t border-paper/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <h3 className="font-display font-normal normal-case text-2xl sm:text-3xl text-paper tracking-tight leading-[1.1] max-w-md">
            Ver tu mapa es gratis.{" "}
            <em className="text-gradient-warm-dark">Entenderlo es Premium.</em>
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
