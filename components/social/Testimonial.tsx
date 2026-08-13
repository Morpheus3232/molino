"use client";

import { motion } from "framer-motion";
import { Compass, Sparkles, ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import Card from "@/components/ui/Card";
import Link from "next/link";

const USE_CASES: {
  archetype: string;
  signature: string;
  context: string;
  insight: string;
  color: string;
}[] = [
  {
    archetype: "Transición Vocacional",
    signature: "Camino de Vida 1 · Aries · Dragón",
    context: "Momento de cambio de empleo o inicio de emprendimiento independiente.",
    insight: "El mapa resalta la necesidad de autonomía y advierte sobre el agotamiento cuando se intenta controlar cada detalle operativo.",
    color: "var(--layer-identity)",
  },
  {
    archetype: "Dinámica de Vínculos & Pareja",
    signature: "Camino de Vida 7 · Cáncer · Buey",
    context: "Comprensión de diferencias de ritmo y comunicación en la pareja.",
    insight: "Explica por qué los períodos de silencio reflexivo no son desapego, sino la forma natural de recargar energía e introspección.",
    color: "var(--layer-astrology)",
  },
  {
    archetype: "Gestión de Múltiples Proyectos",
    signature: "Camino de Vida 5 · Géminis · Caballo",
    context: "Sensación de dispersión creativa y dificultad para cerrar ciclos.",
    insight: "Brinda pautas para alinear inicios y cierres con el Año Personal y la Luna, canalizando la versatilidad sin perder constancia.",
    color: "var(--layer-cycles)",
  },
];

export default function Testimonial() {
  return (
    <section className="bg-ink/[0.02] border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
            Casos de Uso & Aplicación Práctica
          </span>
          <motion.h2 {...fadeUp} className="font-display text-2xl sm:text-3xl text-foreground font-bold mt-2">
            Cómo se traduce el mapa en decisiones reales
          </motion.h2>
          <p className="text-sm text-muted mt-2">
            Cada lectura combina numerología pitagórica, astrología solar y zodíaco chino para ofrecer claridad aplicada.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 list-none">
          {USE_CASES.map((item, i) => (
            <motion.li
              key={item.archetype}
              {...fadeUp}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <Card padding="lg" className="h-full flex flex-col justify-between border-ink/10 bg-card">
                <div>
                  <header className="mb-4 pb-3 border-b border-ink/10">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                      {item.signature}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-foreground mt-1">
                      {item.archetype}
                    </h3>
                  </header>

                  <div className="space-y-3 text-xs sm:text-sm text-muted leading-relaxed">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-foreground/70 font-bold block mb-1">
                        Contexto de Consulta:
                      </span>
                      <p>{item.context}</p>
                    </div>

                    <div className="pt-2 border-t border-ink/5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold block mb-1">
                        Claridad Aportada:
                      </span>
                      <p className="text-foreground/90">{item.insight}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-muted">Cálculo local</span>
                  <Link href="/onboarding" className="text-accent hover:underline inline-flex items-center gap-1">
                    Ver mi mapa <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
