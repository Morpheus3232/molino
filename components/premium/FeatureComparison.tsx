"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { Check, X, Shield, Zap, Lock, Unlock } from "lucide-react";

interface FeatureItem {
  name: string;
  category: string;
  free: boolean;
  premium: boolean;
  highlight?: boolean;
  description?: string;
}

const FEATURES = (L: Pick2): FeatureItem[] => ([
  {
    category: "Identidad & Síntesis",
    name: L("Mapa básico (Camino de Vida, Signo Solar, Animal Chino)", "Basic map (Life Path, Sun Sign, Chinese Animal)"),
    free: true,
    premium: true,
    description: L("Cálculo determinista de tus tres coordenadas simbólicas.", "Deterministic calculation of your three symbolic coordinates."),
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
    name: L("Cruces entre los 3 sistemas, con su evidencia", "Crossings between the 3 systems, with their evidence"),
    free: true,
    premium: true,
    description:
      L("Dónde dos o tres sistemas coinciden, calculado sin IA y con la derivación a la vista. Si no hay cruce real, se dice.", "Where two or three systems agree, calculated without AI and with the derivation in plain sight. If there's no real crossing, it says so."),
  },
  {
    category: "Identidad & Síntesis",
    name: L("Tensiones estructurales y qué no se puede afirmar de vos", "Structural tensions and what can't be claimed about you"),
    free: true,
    premium: true,
    description:
      L("Las contradicciones entre señales (ritmo, modo, elemento) y la lista explícita de límites del cálculo.", "The contradictions between signals (rhythm, mode, element) and the explicit list of the calculation's limits."),
  },
  {
    category: "Identidad & Síntesis",
    name: L("La Lectura escrita — interpretación narrativa de tu síntesis", "The written Reading — a narrative interpretation of your synthesis"),
    free: false,
    premium: true,
    highlight: true,
    description:
      L("El punto ciego, cómo operás en la práctica y qué implica cada cruce, redactado para tu mapa concreto.", "Your blind spot, how you operate in practice and what each crossing implies, written for your specific map."),
  },
  {
    category: "Identidad & Síntesis",
    name: L("Número de la Suerte", "Lucky Number"),
    free: false,
    premium: true,
    description: L("Un número de referencia personal calculado a partir de tu mes y año de nacimiento, con la fórmula siempre visible — no una promesa de fortuna.", "A personal reference number calculated from your month and year of birth, with the formula always visible — not a promise of fortune."),
  },
  {
    category: "Tiempo & Ciclos",
    name: L("Energía del día actual", "Today's energy"),
    free: true,
    premium: true,
    description: L("Número del día y vibración básica.", "Number of the day and basic vibration."),
  },
  {
    category: "Tiempo & Ciclos",
    name: L("Calendario energético y mapa de evolución", "Energy calendar and evolution map"),
    free: false,
    premium: true,
    description: L("Lectura simbólica de tus ciclos personales, proyección de tu Año Personal actual y los próximos 5 años, con fases lunares para planificar decisiones clave.", "A symbolic reading of your personal cycles, a projection of your current Personal Year and the next 5 years, with moon phases to plan key decisions."),
  },
  {
    category: "Relaciones & Conexiones",
    name: L("Afinidades y resonancia con el mundo", "Affinities and resonance with the world"),
    free: true,
    premium: true,
    description: L("Conexión simbólica con países, ciudades y marcas afines.", "Symbolic connection with kindred countries, cities and brands."),
  },
  {
    category: "Relaciones & Conexiones",
    name: L("Modo Pareja y análisis relacional profundo", "Couple Mode and in-depth relationship analysis"),
    free: true,
    premium: true,
    description: L("Comparativa de mapas lado a lado con puntos de fricción y sinergias.", "A side-by-side map comparison with points of friction and synergies."),
  },
  {
    category: "Herramientas",
    name: L("Preguntale a Molino", "Ask Molino"),
    free: false,
    premium: true,
    highlight: true,
    description: L("50 consultas incluidas con la IA que ya conoce tu mapa completo, sin tener que explicar tu contexto.", "50 questions included with the AI that already knows your complete map, with no need to explain your context."),
  },
  {
    category: "Privacidad & Acceso",
    name: L("Sin cookies invasivas ni tracking de comportamiento", "No invasive cookies or behavioral tracking"),
    free: true,
    premium: true,
    description: L("Tus datos nunca se venden ni se guardan en bases de datos publicitarias. Premium usa un hash de tu perfil para validar el acceso — nunca tu fecha de nacimiento en claro.", "Your data is never sold or stored in advertising databases. Premium uses a hash of your profile to validate access — never your date of birth in plain text."),
  },
  {
    category: "Privacidad & Acceso",
    name: L("Acceso permanente de por vida (pago único)", "Permanent lifetime access (one-time payment)"),
    free: false,
    premium: true,
    highlight: true,
    description: L("Sin suscripciones recurrentes forzadas. Pagás una vez, lo tenés siempre.", "No forced recurring subscriptions. You pay once, you have it forever."),
  },
]);

export default function FeatureComparison({ className = "" }: { className?: string }) {
  const L = useL();
  // Group by category
  const categories = Array.from(new Set(FEATURES(L).map((f) => f.category)));

  return (
    <section className={`py-12 ${className}`} aria-labelledby="feature-comparison-title">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="text-center mb-10">
          <span className="text-sm text-accent font-bold label-caps">{L("Transparencia Total", "Total Transparency")}</span>
          <h2
            id="feature-comparison-title"
            className="section-title text-foreground mt-1"
          >{L("Gratis vs Premium", "Free vs Premium")}</h2>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-xl mx-auto">{L("El mapa y la síntesis calculada son gratis, siempre. Lo Pro es la interpretación escrita y la conversación con tu mapa.", "The map and the calculated synthesis are free, always. Pro is the written interpretation and the conversation with your map.")}</p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-xl border border-ink/10 bg-card overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink/10 bg-background/50">
                <th className="py-4 px-6 text-sm text-muted w-1/2 label-caps">{L("Funcionalidad", "Feature")}</th>
                <th className="py-4 px-6 text-sm text-muted text-center w-1/4 label-caps">{L("Gratis ($0)", "Free ($0)")}</th>
                <th className="py-4 px-6 text-sm text-accent text-center w-1/4 bg-accent/5 border-l border-accent/20 label-caps">
                  <span className="flex items-center justify-center gap-1 font-bold">
                    Premium ($8 USD)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const catFeatures = FEATURES(L).filter((f) => f.category === category);
                return (
                  <Fragment key={category}>
                    <tr className="border-b border-ink/10">
                      <td
                        colSpan={3}
                        className="py-2.5 px-6 text-sm text-gold bg-ink/[0.03] border-y border-ink/10 font-bold label-caps"
                      >
                        {L.t(category)}
                      </td>
                    </tr>
                    {catFeatures.map((f) => (
                      <tr
                        key={f.name}
                        className={`border-b border-ink/5 transition-colors hover:bg-ink/[0.02] ${
                          f.highlight ? "bg-accent/[0.02]" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-xs sm:text-sm text-foreground">
                          <span className="font-semibold block">{L.t(f.name)}</span>
                          {f.description && (
                            <span className="text-xs text-muted block mt-0.5 font-normal">
                              {L.t(f.description)}
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
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View */}
        <div className="md:hidden space-y-6">
          {categories.map((category) => {
            const catFeatures = FEATURES(L).filter((f) => f.category === category);
            return (
              <div
                key={category}
                className="rounded-xl border border-ink/10 bg-card p-5 space-y-4"
              >
                <h3 className="text-sm text-gold font-bold border-b border-ink/10 pb-2 label-caps">
                  {L.t(category)}
                </h3>
                <div className="space-y-3.5">
                  {catFeatures.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <span className="font-semibold text-foreground block">{L.t(f.name)}</span>
                        {f.description && (
                          <span className="text-[11px] text-muted block mt-0.5">
                            {L.t(f.description)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            f.free
                              ? "bg-success/10 text-success border border-success/30"
                              : "bg-ink/5 text-muted/60"
                          }`}
                        >
                          Free
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
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
          <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">{L("Qué paga ese pago único", "What that one-time payment pays for")}</h3>
          <p className="text-sm text-muted mt-3 leading-relaxed max-w-2xl">{L("Cada lectura Pro y cada pregunta que le hacés a tu mapa son una llamada real a un modelo de lenguaje, y eso tiene un costo por uso. Los 8 dólares cubren ese costo y sostienen el trabajo de mantener el proyecto abierto: los motores de cálculo, el atlas de entidades con sus fuentes, y la parte gratuita, que es la mayor parte.", "Every Pro reading and every question you ask your map is a real call to a language model, and that has a per-use cost. The 8 dollars cover that cost and sustain the work of keeping the project open: the calculation engines, the atlas of entities with their sources, and the free part, which is most of it.")}</p>
          <p className="text-sm text-muted mt-3 leading-relaxed max-w-2xl">{L("No hay suscripción, no hay renovación y no vendemos datos — no tenemos ninguno que vender. Si el mapa y la lectura gratuitos ya te alcanzan, está perfecto: para eso son.", "There's no subscription, no renewal and we don't sell data — we don't have any to sell. If the free map and reading are enough for you, that's perfect: that's what they're for.")}</p>
        </div>
      </div>
    </section>
  );
}
