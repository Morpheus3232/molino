"use client";

import React from "react";
import { Calendar, Users, Target, FileText, ArrowRight } from "lucide-react";
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

// Antes era una sección aparte (PremiumTeaser) con su propio header, su
// propio grid de 3 columnas y dos menciones del precio — repetía la forma
// del bloque de arriba para responder la misma pregunta implícita ("qué más
// hay"). Fusionado acá como continuación, no como venta aparte.
const PREMIUM_PERKS = [
  {
    icon: FileText,
    title: "Síntesis narrativa + chat",
    desc: "Tu mapa interpretado en profundidad, con conversación interactiva para seguir preguntando.",
  },
  {
    icon: Calendar,
    title: "Ciclos anuales extendidos",
    desc: "Años y meses personales para planificar decisiones importantes con anticipación.",
  },
  {
    icon: Users,
    title: "Sinergia vincular avanzada",
    desc: "Comparativas ilimitadas con socios, familia y pareja.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-ink overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="mb-20 text-center"
        >
          <div className="mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Tu mapa, en movimiento
            </p>
          </div>

          <h2 className="font-display font-normal normal-case tracking-tight text-paper mb-6 leading-[1.05] text-[clamp(2.5rem,5vw,4rem)]">
            El mapa no es estático.{" "}
            <em className="text-gradient-warm-dark">Se actualiza con la fecha y el ciclo.</em>
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

        {/* Premium — una capa más profunda, no una venta aparte */}
        <div className="mt-24 pt-16 border-t border-paper/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-light mb-4">
              Una capa más profunda
            </p>
            <h3 className="font-display text-2xl sm:text-3xl text-paper font-bold tracking-tight leading-[1.1]">
              Ver tu mapa es gratis. Entenderlo es Premium.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-paper/10 border-y border-paper/10 mb-10">
            {PREMIUM_PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.title} className="p-6 md:px-8 space-y-3">
                  <Icon className="w-5 h-5 text-accent-light" aria-hidden="true" />
                  <h4 className="font-heading text-base font-bold text-paper">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-paper/60 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center max-w-xl mx-auto">
            <p className="text-sm text-paper/70 mb-4">
              Acceso de por vida, <strong className="text-paper">$8 USD</strong> — un solo pago, sin suscripción.
            </p>
            <Link
              href="/premium"
              className="inline-flex items-center justify-center gap-2 font-mono text-xs text-accent-light hover:underline underline-offset-2 group"
            >
              Ver el detalle de Premium
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
