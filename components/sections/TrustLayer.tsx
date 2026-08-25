"use client";

import React from "react";
import { Lock, Code2, DollarSign, Github } from "lucide-react";
import Link from "next/link";

interface TrustPoint {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const trustPoints: TrustPoint[] = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: "100% Local",
    description: "Cada cálculo ocurre en tu navegador. Tu fecha de nacimiento nunca sale de tu CPU.",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Open Source",
    description: "Código MIT disponible en GitHub. Auditá, verificá, usa donde quieras.",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Justo",
    description: "$8, pago de una sola vez. Premium incluido. Sin suscripciones ocultas.",
  },
];


export default function TrustLayer() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-paper border-t border-border">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          className="mb-20 text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">
            Arquitectura
          </p>

          <h2 className="font-display font-normal normal-case tracking-tight text-ink mb-6 leading-[1.05] text-[clamp(2.5rem,5vw,4rem)]">
            Privacidad <em className="text-accent">por diseño.</em>
          </h2>

          <p
            className="text-lg sm:text-xl text-muted leading-relaxed max-w-3xl mx-auto font-light"
          >
            No es una promesa. Es cómo está construido.
          </p>
        </div>

        {/* Trust Points — lista plana */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border mb-8"
        >
          {trustPoints.map((point, idx) => (
            <div key={idx} className="p-8 md:px-8 space-y-3">
              <div className="text-accent">{point.icon}</div>
              <h3 className="font-heading text-lg font-bold text-ink">
                {point.title}
              </h3>
              <p className="text-muted leading-relaxed text-sm">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <p
          className="text-center text-xs text-muted max-w-2xl mx-auto mb-16"
        >
          * El cálculo del mapa es 100% local. Premium y las interpretaciones con IA guardan un hash irreversible de tu perfil —nunca tu fecha en claro— según nuestra{" "}
          <Link href="/privacidad" className="underline hover:text-ink">
            política de privacidad
          </Link>
          .
        </p>

        {/* CTA to GitHub */}
        <div
          className="mt-16 text-center"
        >
          <Link
            href="https://github.com/Morpheus3232/molino"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border border-border text-ink font-heading font-semibold text-sm transition-colors duration-200 hover:border-accent hover:text-accent group"
          >
            <Github className="w-5 h-5" />
            Ver código en GitHub
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
