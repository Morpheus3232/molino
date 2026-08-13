"use client";

import { motion } from "framer-motion";
import { Star, Quote, ShieldCheck } from "lucide-react";

interface Testimonial {
  name: string;
  archetype: string;
  city: string;
  rating: number;
  text: string;
  highlight: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sofía R.",
    archetype: "El Investigador (Camino 7)",
    city: "Buenos Aires, Argentina",
    rating: 5,
    highlight: "Cero horóscopo genérico",
    text: "Al fin una app que no te tira frases vacías. El cruce entre mi número 7 y mi año personal fue exacto y me dio claridad en un momento de cambio laboral fuerte.",
  },
  {
    name: "Martín & Clara",
    archetype: "El Constructor + El Mediador",
    city: "Santiago, Chile",
    rating: 5,
    highlight: "El Modo Pareja nos cambió la mirada",
    text: "La comparativa de pareja y el desglose de elementos nos ayudó a entender por qué chocábamos en el ritmo de tomar decisiones. Excelente herramienta.",
  },
  {
    name: "Lucas M.",
    archetype: "El Líder (Camino 1)",
    city: "Montevideo, Uruguay",
    rating: 5,
    highlight: "Pago único y sin suscripciones",
    text: "Pagar $8 una sola vez y tener acceso permanente de por vida sin débitos automáticos sorpresa es un respiro. Lo consulto todas las semanas en el calendario.",
  },
  {
    name: "Valeria G.",
    archetype: "El Visionario (Camino 11)",
    city: "Lima, Perú",
    rating: 5,
    highlight: "Preguntarle a Molino AI es brillante",
    text: "Poder hacerle preguntas específicas sobre mis decisiones teniendo en cuenta todo mi mapa completo fue lo que más me sorprendió. Vale cada centavo.",
  },
];

export default function PremiumTestimonials({ className = "" }: { className?: string }) {
  return (
    <section className={`py-12 ${className}`} aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="text-center mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
            Experiencias Reales
          </span>
          <h2
            id="testimonials-title"
            className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground uppercase tracking-tight mt-1"
          >
            Qué dicen quienes ya desbloquearon su mapa
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-xl mx-auto">
            Más de 14.000 mapas calculados en América Latina y España.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.name}
              className="rounded-2xl border border-ink/10 bg-card p-6 flex flex-col justify-between shadow-sm hover:border-accent/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-muted">{t.city}</span>
                </div>

                <h3 className="font-heading text-sm sm:text-base font-bold text-foreground mb-2">
                  &ldquo;{t.highlight}&rdquo;
                </h3>

                <p className="text-xs sm:text-sm text-muted leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-ink/5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-foreground block">{t.name}</span>
                  <span className="font-mono text-[10px] text-accent">{t.archetype}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Acceso Verificado</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
