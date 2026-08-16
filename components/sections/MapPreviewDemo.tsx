"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Hash, Sun, Compass, ArrowRight, ShieldCheck, Check } from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import type { UserProfile } from "@/types/user";

const DEMO_PROFILES = [
  {
    name: "Ana",
    birthDate: "15/03/1990",
    lifePath: 1,
    archetype: "El Iniciador",
    quote: "La fuerza de abrir caminos donde otros solo ven límites.",
    sunSign: "Piscis",
    element: "Agua",
    modality: "Mutable",
    chineseAnimal: "Caballo de Metal",
    chineseTraits: ["Independencia", "Ritmo acelerado", "Estructura"],
    yearCycle: 9,
    yearTheme: "Cierre y Liberación",
    insight: "Combina el impulso pionero del Camino 1 con la intuición empática de Piscis y la resistencia del Caballo de Metal. Ideal para liderar proyectos con propósito humano.",
    strengths: ["Iniciativa rápida", "Percepción no verbal", "Autonomía"],
    challenges: ["Tendencia a asumir todo sola", "Dificultad para soltar el control"],
  },
  {
    name: "Lucas",
    birthDate: "22/07/1988",
    lifePath: 7,
    archetype: "El Sabio Analítico",
    quote: "El entendimiento profundo que nace del silencio y la observación.",
    sunSign: "Cáncer",
    element: "Agua",
    modality: "Cardinal",
    chineseAnimal: "Dragón de Tierra",
    chineseTraits: ["Magnetismo", "Visión sólida", "Pragmatismo"],
    yearCycle: 7,
    yearTheme: "Introspección y Sabiduría",
    insight: "Mente investigadora que necesita espacios de soledad para procesar decisiones. El Dragón de Tierra le da un anclaje realista a su alta sensibilidad emocional.",
    strengths: ["Capacidad analítica", "Lealtad incondicional", "Visión estratégica"],
    challenges: ["Aislamiento excesivo", "Rumiación de pensamientos"],
  },
  {
    name: "Sofía",
    birthDate: "11/11/1995",
    lifePath: 11,
    archetype: "El Visionario Intuitivo",
    quote: "Canalizar inspiración elevada hacia transformaciones tangibles.",
    sunSign: "Escorpio",
    element: "Agua",
    modality: "Fijo",
    chineseAnimal: "Cerdo de Madera",
    chineseTraits: ["Generosidad", "Empatía", "Creatividad"],
    yearCycle: 6,
    yearTheme: "Armonía y Relaciones",
    insight: "Número Maestro 11 con doble intensidad intuitiva. Su gran desafío es no absorber el estrés ajeno y canalizar su visión en arte, enseñanza o mentoría.",
    strengths: ["Alta intuición", "Poder transformador", "Magnetismo auténtico"],
    challenges: ["Sobrecarga sensorial", "Autoexigencia desmedida"],
  },
];

export default function MapPreviewDemo() {
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"general" | "numerologia" | "astrologia" | "zodiaco">("general");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getOrCreateProfile());
  }, []);

  const current = DEMO_PROFILES[activeProfileIndex];

  const scrollToForm = () => {
    const form = document.getElementById("mapa-form");
    form?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Demo ficticia para convencer a quien todavía no generó su mapa — para
  // quien ya tiene perfil guardado, mostrar a "Ana" es ruido, no un ejemplo.
  if (mounted && profile?.birthDate) return null;

  return (
    <section aria-label="Demostración interactiva de mapa personal" className="bg-card border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="outline" className="mb-3">
            Demostración en Vivo
          </Badge>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            Así se lee tu mapa simbólico
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            Cada lectura cruza tres dimensiones para mostrarte patrones que operan en simultáneo. Seleccioná un perfil para ver cómo cambia la dinámica:
          </p>

          {/* Profile Switcher Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {DEMO_PROFILES.map((p, idx) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setActiveProfileIndex(idx);
                  setActiveTab("general");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                  activeProfileIndex === idx
                    ? "bg-accent text-background font-bold border-accent shadow-sm"
                    : "bg-background text-muted border-ink/10 hover:border-ink/25 hover:text-foreground"
                }`}
              >
                {p.name} ({p.birthDate})
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Map Showcase Card */}
        <div className="rounded-3xl border border-accent/25 bg-background p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar of Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink/10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                CAMINO DE VIDA {current.lifePath} · {current.archetype}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">
                {current.name}
              </h3>
              <p className="text-xs text-muted italic mt-0.5">
                &ldquo;{current.quote}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-ink/5 border border-ink/10 text-xs font-mono text-muted">
                {current.sunSign} ({current.element})
              </span>
              <span className="px-3 py-1 rounded-xl bg-ink/5 border border-ink/10 text-xs font-mono text-muted">
                {current.chineseAnimal}
              </span>
            </div>
          </div>

          {/* 3 Pillars Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeTab === "general"
                  ? "bg-accent/15 border-accent text-accent font-bold"
                  : "bg-card border-ink/5 text-muted hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider block text-muted">01 · Síntesis</span>
              <span className="text-xs font-heading font-semibold block mt-0.5">Visión Integral</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("numerologia")}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeTab === "numerologia"
                  ? "bg-accent/15 border-accent text-accent font-bold"
                  : "bg-card border-ink/5 text-muted hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider block text-muted">02 · Numerología</span>
              <span className="text-xs font-heading font-semibold block mt-0.5">Camino {current.lifePath}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("astrologia")}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeTab === "astrologia"
                  ? "bg-accent/15 border-accent text-accent font-bold"
                  : "bg-card border-ink/5 text-muted hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider block text-muted">03 · Astrología</span>
              <span className="text-xs font-heading font-semibold block mt-0.5">Sol en {current.sunSign}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("zodiaco")}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeTab === "zodiaco"
                  ? "bg-accent/15 border-accent text-accent font-bold"
                  : "bg-card border-ink/5 text-muted hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider block text-muted">04 · Zodíaco Chino</span>
              <span className="text-xs font-heading font-semibold block mt-0.5">{current.chineseAnimal}</span>
            </button>
          </div>

          {/* Dynamic Content Panel */}
          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-ink/10">
            <AnimatePresence mode="wait">
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {current.insight}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-ink/5">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                        ✓ Fortalezas Clave
                      </span>
                      <ul className="space-y-1 text-xs text-muted">
                        {current.strengths.map((s) => (
                          <li key={s} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
                        ⚠ Punto de Atención
                      </span>
                      <ul className="space-y-1 text-xs text-muted">
                        {current.challenges.map((c) => (
                          <li key={c} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "numerologia" && (
                <motion.div
                  key="numerologia"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-3"
                >
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    El Propósito del Camino {current.lifePath}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    El Camino de Vida describe el aprendizaje central de esta encarnación. En el caso de {current.name}, la lección radica en desarrollar {current.archetype.toLowerCase()} con madurez y constancia.
                  </p>
                  <div className="p-3 rounded-xl bg-background border border-ink/5 text-xs font-mono text-accent">
                    Ciclo Anual 2026: Año Personal {current.yearCycle} ({current.yearTheme})
                  </div>
                </motion.div>
              )}

              {activeTab === "astrologia" && (
                <motion.div
                  key="astrologia"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-3"
                >
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    Sol en {current.sunSign} · Elemento {current.element}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    El Sol indica la fuente de vitalidad y cómo la persona busca autorrealizarse. La modalidad {current.modality} determina el modo en que procesa los cambios y la toma de iniciativa.
                  </p>
                </motion.div>
              )}

              {activeTab === "zodiaco" && (
                <motion.div
                  key="zodiaco"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-3"
                >
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    {current.chineseAnimal}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    El zodíaco chino refleja los ritmos instintivos y la interacción con el entorno social. Rasgos característicos: {current.chineseTraits.join(", ")}.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Footer */}
          <div className="mt-8 pt-6 border-t border-ink/10 text-center">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-gold-foreground font-heading text-xs uppercase tracking-wider font-bold rounded-xl hover:bg-gold-hover transition-colors shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generá tu mapa</span>
            </button>
            <p className="font-mono text-[11px] text-muted mt-2">
              100% privado en tu navegador · Sin registro ni costo
            </p>
          </div>
        </div>

        <p className="text-center mt-8 font-mono text-xs text-muted">
          Profundizá:{" "}
          <Link href="/conocimiento/numerologia" className="underline decoration-muted/40 underline-offset-2 hover:text-accent transition-colors">
            Numerología
          </Link>
          {" · "}
          <Link href="/conocimiento/astrologia" className="underline decoration-muted/40 underline-offset-2 hover:text-accent transition-colors">
            Astrología
          </Link>
          {" · "}
          <Link href="/conocimiento/zodiaco-chino" className="underline decoration-muted/40 underline-offset-2 hover:text-accent transition-colors">
            Zodíaco Chino
          </Link>
        </p>
      </div>
    </section>
  );
}
