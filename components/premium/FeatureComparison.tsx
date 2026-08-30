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
    description: "Cálculo determinista de tus tres coordenadas simbólicas.",
  },
  // Fase 4 — corrección de exactitud. Estas dos filas decían "✗ gratis", y
  // desde que `buildSynthesis` es el modelo canónico (Fase 2) eso es
  // literalmente falso: los cruces entre sistemas, las tensiones estructurales
  // y la lista de incertidumbre se calculan sin IA y se muestran en la Lectura
  // gratuita. Lo que se paga NO es el análisis: es la interpretación escrita y
  // la conversación. Marcarlas como exclusivas Pro era vender como cerrado algo
  // que el producto ya regala.
  {
    category: "Identidad & Síntesis",
    name: "Cruces entre los 3 sistemas, con su evidencia",
    free: true,
    premium: true,
    description:
      "Dónde dos o tres sistemas coinciden, calculado sin IA y con la derivación a la vista. Si no hay cruce real, se dice.",
  },
  {
    category: "Identidad & Síntesis",
    name: "Tensiones estructurales y qué no se puede afirmar de vos",
    free: true,
    premium: true,
    description:
      "Las contradicciones entre señales (ritmo, modo, elemento) y la lista explícita de límites del cálculo.",
  },
  {
    category: "Identidad & Síntesis",
    name: "La Lectura escrita — interpretación narrativa de tu síntesis",
    free: false,
    premium: true,
    highlight: true,
    description:
      "El punto ciego, cómo operás en la práctica y qué implica cada cruce, redactado para tu mapa concreto.",
  },
  {
    category: "Identidad & Síntesis",
    name: "Número de la Suerte",
    free: false,
    premium: true,
    description: "Un número de referencia personal calculado a partir de tu mes y año de nacimiento, con la fórmula siempre visible — no una promesa de fortuna.",
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
    name: "Calendario energético y mapa de evolución",
    free: false,
    premium: true,
    description: "Lectura simbólica de tus ciclos personales, proyección de tu Año Personal actual y los próximos 5 años, con fases lunares para planificar decisiones clave.",
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
    category: "Herramientas",
    name: "Preguntale a Molino",
    free: false,
    premium: true,
    highlight: true,
    description: "50 consultas incluidas con la IA que ya conoce tu mapa completo, sin tener que explicar tu contexto.",
  },
  {
    category: "Privacidad & Acceso",
    name: "Sin cookies invasivas ni tracking de comportamiento",
    free: true,
    premium: true,
    description: "Tus datos nunca se venden ni se guardan en bases de datos publicitarias. Premium usa un hash de tu perfil para validar el acceso — nunca tu fecha de nacimiento en claro.",
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
            El mapa y la síntesis calculada son gratis, siempre. Lo Pro es la interpretación
            escrita y la conversación con tu mapa.
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-xl border border-ink/10 bg-card overflow-hidden shadow-sm">
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
                      className="py-2.5 px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-gold bg-ink/[0.03] border-y border-ink/10 font-bold"
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
                            <Check className="w-4 h-4 text-success mx-auto" />
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
                className="rounded-xl border border-ink/10 bg-card p-5 space-y-4"
              >
                <h3 className="font-mono text-xs uppercase tracking-wider text-gold font-bold border-b border-ink/10 pb-2">
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
                              ? "bg-success/10 text-success border border-success/30"
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

        {/* A dónde va el dinero.
            Fase 4: acá había un bloque "Ancla de Valor" que comparaba los 8
            dólares contra consultas de $50–$120 y suscripciones de $10–$15/mes,
            con los precios ajenos tachados. Eso es anclaje de precio — una
            táctica de venta que el proyecto rechaza explícitamente, y que
            además le pedía al lector que valorara Molino por lo que NO es.
            Si la lectura vale, se sostiene sola. */}
        <div className="mt-12 border-t border-ink/10 pt-8">
          <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
            Qué paga ese pago único
          </h3>
          <p className="text-sm text-muted mt-3 leading-relaxed max-w-2xl">
            Cada lectura Pro y cada pregunta que le hacés a tu mapa son una llamada real a un
            modelo de lenguaje, y eso tiene un costo por uso. Los 8 dólares cubren ese costo y
            sostienen el trabajo de mantener el proyecto abierto: los motores de cálculo, el
            atlas de entidades con sus fuentes, y la parte gratuita, que es la mayor parte.
          </p>
          <p className="text-sm text-muted mt-3 leading-relaxed max-w-2xl">
            No hay suscripción, no hay renovación y no vendemos datos — no tenemos ninguno que
            vender. Si el mapa y la lectura gratuitos ya te alcanzan, está perfecto: para eso
            son.
          </p>
        </div>
      </div>
    </section>
  );
}
