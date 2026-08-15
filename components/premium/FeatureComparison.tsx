"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles, Shield, Zap, Lock, Unlock } from "lucide-react";

interface FeatureItem {
  name: string;
  category: string;
  free: boolean;
  premium: boolean;
  highlight?: boolean;
  description?: string;
}

const FEATURES: FeatureItem[] = [
  {
    category: "Identidad & Síntesis",
    name: "Mapa básico (Camino de Vida, Signo Solar, Animal Chino)",
    free: true,
    premium: true,
    description: "Cálculo fáctico y exacto de tus tres coordenadas simbólicas.",
  },
  {
    category: "Identidad & Síntesis",
    name: "Síntesis profunda cruzada (Conexión de los 3 sistemas)",
    free: false,
    premium: true,
    highlight: true,
    description: "Lectura personalizada que explica qué significa la combinación exacta de tus energías.",
  },
  {
    category: "Identidad & Síntesis",
    name: "Detección de patrones y tensiones ocultas",
    free: false,
    premium: true,
    highlight: true,
    description: "Análisis de desfasajes entre tu elemento occidental y ritmo lunar.",
  },
  {
    category: "Tiempo & Ciclos",
    name: "Energía del día actual",
    free: true,
    premium: true,
    description: "Número del día y vibración básica.",
  },
  {
    category: "Tiempo & Ciclos",
    name: "Calendario de energía diaria completa y fases lunares",
    free: false,
    premium: true,
    description: "Lectura simbólica día a día para planificar decisiones clave.",
  },
  {
    category: "Tiempo & Ciclos",
    name: "Mapa de evolución temporal y ciclos anuales",
    free: false,
    premium: true,
    description: "Lectura de tu Año Personal actual y proyección a 5 años.",
  },
  {
    category: "Relaciones & Conexiones",
    name: "Afinidades y resonancia con el mundo",
    free: true,
    premium: true,
    description: "Conexión simbólica con países, ciudades y marcas afines.",
  },
  {
    category: "Relaciones & Conexiones",
    name: "Modo Pareja y análisis relacional profundo",
    free: true,
    premium: true,
    description: "Comparativa de mapas lado a lado con puntos de fricción y sinergias.",
  },
  {
    category: "Herramientas & IA",
    name: "Preguntale a Molino (chat de IA)",
    free: false,
    premium: true,
    highlight: true,
    description: "Consultas ilimitadas sobre tus decisiones, momentos y arquetipo.",
  },
  {
    category: "Herramientas & IA",
    name: "Exportación en alta calidad PNG y PDF sin marcas",
    free: true,
    premium: true,
    description: "Tarjetas optimizadas para Instagram, OpenGraph e informes personales.",
  },
  {
    category: "Privacidad & Acceso",
    name: "100% privado en tu navegador (sin cookies invasivas)",
    free: true,
    premium: true,
    description: "Tus datos nunca se venden ni se guardan en bases de datos publicitarias.",
  },
  {
    category: "Privacidad & Acceso",
    name: "Acceso permanente de por vida (pago único)",
    free: false,
    premium: true,
    highlight: true,
    description: "Sin suscripciones recurrentes forzadas. Pagás una vez, lo tenés siempre.",
  },
];

export default function FeatureComparison({ className = "" }: { className?: string }) {
  // Group by category
  const categories = Array.from(new Set(FEATURES.map((f) => f.category)));

  return (
    <section className={`py-12 ${className}`} aria-labelledby="feature-comparison-title">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="text-center mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
            Transparencia Total
          </span>
          <h2
            id="feature-comparison-title"
            className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground uppercase tracking-tight mt-1"
          >
            Gratis vs Premium
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-xl mx-auto">
            El mapa esencial siempre es gratis. El acceso Premium desbloquea la síntesis profunda y la interacción sin límites.
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-2xl border border-ink/10 bg-card overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink/10 bg-background/50">
                <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted w-1/2">
                  Funcionalidad
                </th>
                <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted text-center w-1/4">
                  Gratis ($0)
                </th>
                <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-accent text-center w-1/4 bg-accent/5 border-l border-accent/20">
                  <span className="flex items-center justify-center gap-1 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Premium ($8 USD)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const catFeatures = FEATURES.filter((f) => f.category === category);
                return (
                  <tr key={category} className="contents">
                    <td
                      colSpan={3}
                      className="py-2.5 px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4A843] bg-ink/[0.03] border-y border-ink/10 font-bold"
                    >
                      {category}
                    </td>
                    {catFeatures.map((f) => (
                      <tr
                        key={f.name}
                        className={`border-b border-ink/5 transition-colors hover:bg-ink/[0.02] ${
                          f.highlight ? "bg-accent/[0.02]" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-xs sm:text-sm text-foreground">
                          <span className="font-semibold block">{f.name}</span>
                          {f.description && (
                            <span className="text-xs text-muted block mt-0.5 font-normal">
                              {f.description}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {f.free ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted/40 mx-auto" />
                          )}
                        </td>
                        <td className="py-4 px-6 text-center bg-accent/5 border-l border-accent/15">
                          {f.premium ? (
                            <Check className="w-4 h-4 text-accent mx-auto stroke-[2.5]" />
                          ) : (
                            <X className="w-4 h-4 text-muted/40 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View */}
        <div className="md:hidden space-y-6">
          {categories.map((category) => {
            const catFeatures = FEATURES.filter((f) => f.category === category);
            return (
              <div
                key={category}
                className="rounded-2xl border border-ink/10 bg-card p-5 space-y-4"
              >
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#D4A843] font-bold border-b border-ink/10 pb-2">
                  {category}
                </h3>
                <div className="space-y-3.5">
                  {catFeatures.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <span className="font-semibold text-foreground block">{f.name}</span>
                        {f.description && (
                          <span className="text-[11px] text-muted block mt-0.5">
                            {f.description}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            f.free
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-ink/5 text-muted/60"
                          }`}
                        >
                          Free
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            f.premium
                              ? "bg-accent text-background"
                              : "bg-ink/5 text-muted/60"
                          }`}
                        >
                          Pro
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Anchor Box */}
        <div className="mt-12 rounded-3xl border border-accent/25 bg-card/70 p-6 sm:p-8">
          <div className="text-center sm:text-left mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold block mb-1">
              Ancla de Valor & Transparencia
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              ¿Por qué $8 USD en pago único de por vida?
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Comparamos nuestra propuesta de valor con las opciones habituales del mercado:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-background border border-ink/5 space-y-1">
              <span className="text-[11px] font-mono text-muted block">Consulta Personal Tradicional</span>
              <span className="text-sm font-bold text-foreground line-through opacity-60">$50 – $120 USD</span>
              <p className="text-xs text-muted leading-relaxed">Sesión de 1 hora, sin reporte interactivo ni actualizaciones de por vida.</p>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-ink/5 space-y-1">
              <span className="text-[11px] font-mono text-muted block">Apps con Suscripción Mensual</span>
              <span className="text-sm font-bold text-foreground line-through opacity-60">$10 – $15 / mes</span>
              <p className="text-xs text-muted leading-relaxed">Pagos recurrentes que suman $120 al año y recopilan datos para publicidad.</p>
            </div>

            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 space-y-1">
              <span className="text-[11px] font-mono text-accent font-bold block">Molino Premium</span>
              <span className="text-lg font-bold text-accent">$8 USD · Pago Único</span>
              <p className="text-xs text-foreground/90 leading-relaxed">Menos de un café. Acceso vitalicio permanente, informe de 25 páginas y 0 tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
