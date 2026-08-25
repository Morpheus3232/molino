"use client";

import Link from "next/link";
import { FileText, Calendar, Users, ArrowRight } from "lucide-react";

const PREMIUM_PERKS = [
  {
    icon: FileText,
    title: "Informe con Síntesis Narrativa",
    desc: "Tu mapa completo interpretado en profundidad — narrativa personal y chat interactivo para profundizar en tu síntesis.",
  },
  {
    icon: Calendar,
    title: "Ciclos Anuales 2026–2030",
    desc: "Ciclos personales extendidos de Años y Meses para planificar decisiones importantes.",
  },
  {
    icon: Users,
    title: "Sinergia Vincular Avanzada",
    desc: "Comparativas ilimitadas con socios, familia y pareja con matriz de elementos cruzados.",
  },
];

export default function PremiumTeaser() {
  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-24 relative">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-4">
            Una capa más profunda de lectura
          </p>

          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold tracking-tight leading-[1.08]"
          >
            Ver tu mapa es gratis.
            <br />
            <span className="text-accent">Entenderlo es Premium.</span>
          </h2>

          <p className="text-sm sm:text-base text-muted mt-4 leading-relaxed">
            Gratis: numerología, astrología y zodíaco chino cruzados, con su fórmula visible.
            Premium: la síntesis que conecta esas piezas entre sí — <strong>$8 USD</strong>, un solo pago, acceso de por vida.
          </p>
        </div>

        {/* 3 capacidades adicionales — lista plana */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10 border-y border-ink/10 mb-10">
          {PREMIUM_PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.title} className="p-6 md:px-8 space-y-3">
                <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                <h3 className="font-heading text-base font-bold text-foreground">
                  {perk.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Acceso — texto, no banner de venta */}
        <div className="text-center max-w-xl mx-auto">
          <p className="text-sm text-muted mb-4">
            Acceso de por vida, <strong className="text-foreground">$8 USD</strong> — un solo pago, sin suscripción.
          </p>
          <Link
            href="/premium"
            className="inline-flex items-center justify-center gap-2 font-mono text-xs text-accent hover:underline underline-offset-2 group"
          >
            Ver el detalle de Premium
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
