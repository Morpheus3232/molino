"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/lib/hooks/useProfile";
import {
  resolveYearCycle,
  calculateYearResonance,
  getCurrentYearAnimal,
  YEAR_CYCLE_META,
  type YearCycle,
  type YearResonance,
} from "@/lib/engines/yearCycleEngine";
import {
  getRelationshipMap,
  getAnimalProfile,
  getRelation,
  type Animal,
} from "@/lib/data/animalRelations";
import { sortLightEntities } from "@/lib/affinity-light";
import type { LightweightEntity } from "@/types/atlas";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import {
  formatAnimalSimple,
  formatAnimalEmoji,
  getZodiacDisplay,
} from "@/lib/utils/zodiacDisplay";
import {
  smoothReveal,
  heroReveal,
  cardReveal,
  popIn,
  emojiBounce,
  staggerApple,
  staggerItemSmooth,
  staggerDelay,
} from "@/lib/utils/premiumMotion";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

const TIER_COLOR: Record<string, string> = {
  "resonancia-alta": "#2D5A3A",
  "afinidad-media": "#4A6FA5",
  complementarios: "#D4A843",
  desafiante: "#B45309",
  distante: "#838C95",
};
const TIER_LABEL: Record<string, string> = {
  "resonancia-alta": "Resonancia alta",
  "afinidad-media": "Afinidad media",
  complementarios: "Complementarios",
  desafiante: "Desafiante",
  distante: "Distante",
};

const ANIMAL_TRAITS: Record<string, string> = {
  Rata: "movimiento, astucia y adaptabilidad",
  Buey: "fuerza, determinación y constancia",
  Tigre: "coraje, pasión y liderazgo",
  Gato: "elegancia, sensibilidad e intuición",
  Dragón: "poder, visión y ambición",
  Serpiente: "sabiduría, profundidad y magnetismo",
  Caballo: "movimiento, independencia y exploración",
  Cabra: "creatividad, armonía y sensibilidad",
  Mono: "ingenio, versatilidad y chispa",
  Gallo: "puntualidad, observación y coraje",
  Perro: "lealtad, honradez y protección",
  Cerdo: "generosidad, optimismo y calidez",
};

const DISCOVERIES_TEMPLATES: ((user: string, year: string) => { title: string; detail: string })[] = [
  (u, y) => ({
    title: `Tu signo comparte tríada con ${getTriadPartners(u).join(" y ")}.`,
    detail: "Las tríadas San He agrupan animales por elemento oculto compartido.",
  }),
  (u, y) => ({
    title: u === y
      ? "Tu ciclo actual coincide con tu animal natal."
      : `Tu animal (${u}) y el año (${y}) tienen una relación de ${getRelationLabel(u, y)}.`,
    detail: "El ciclo anual agrega una dimensión temporal a tu perfil.",
  }),
  (u) => ({
    title: `Tu energía base se define por ${ANIMAL_TRAITS[u] ?? "cualidades únicas"}.`,
    detail: "Cada animal del zodíaco chino tiene cualidades tradicionales específicas.",
  }),
  (u) => ({
    title: `${getLiuHePartner(u)} es tu pareja armoniosa natural (Liu He).`,
    detail: "Los pares Liu Se complementan de forma natural según la tradición.",
  }),
];

export default function InsightsContent({ catalog }: { catalog: LightweightEntity[] }) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });

  const userAnimal = (profile?.chineseZodiac ?? "") as Animal;
  const userYear = parseInt(profile?.birthDate?.split("-")[0] || "0", 10);

  const yearCycle = useMemo(() => resolveYearCycle(userAnimal), [userAnimal]);
  const yearResonance = useMemo(
    () => calculateYearResonance(userAnimal, yearCycle.yearAnimal),
    [userAnimal, yearCycle.yearAnimal]
  );
  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  // Afinidad = exclusivamente zodíaco chino (affinity-light, misma fuente que /affinity, /hoy y ProfileHub).
  const recommendations = useMemo(() => {
    if (!profile) return [];
    return sortLightEntities(profile.chineseZodiac || "", catalog)
      .filter(r => r.tier === "resonancia-alta" || r.tier === "afinidad-media")
      .slice(0, 5);
  }, [profile, catalog]);
  const profile_ = useMemo(() => userAnimal ? getAnimalProfile(userAnimal) : null, [userAnimal]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
          <p className="sr-only" role="status" aria-label="Cargando tu inteligencia...">
            Cargando tu inteligencia...
          </p>
          <div className="animate-pulse">
            <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-4" />
            <div className="h-9 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
            <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-8" />
            <div className="h-64 bg-[var(--skeleton)] border border-ink/10 rounded-md mb-6" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-[var(--skeleton)] border-t border-ink/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">
            Mis patrones
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Tu mapa en movimiento
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Creá tu perfil para acceder a tu inteligencia personal diaria.
          </p>
          <Button variant="primary" size="lg" onClick={() => router.push("/onboarding")}>Crear mi perfil</Button>
        </div>
      </div>
    );
  }

  const display = getZodiacDisplay(userAnimal);
  const elementColor = ELEMENT_COLORS[profile.chineseZodiacInfo?.element ?? "Fuego"] ?? "#C49A2A";
  const discovery = getDiscovery(userAnimal, yearCycle.yearAnimal);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        {/* ═══════════════════════════════════════════════
            HEADER
            ═══════════════════════════════════════════════ */}
        <motion.div {...smoothReveal} className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">
            Mis patrones
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-2">
            Tu mapa hoy
          </h1>
          <p className="text-sm text-muted">
            Exploración personal basada en tradiciones culturales.
          </p>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            BLOQUE 1: HOY EN TU PERFIL
            ═══════════════════════════════════════════════ */}
        <motion.section {...heroReveal} className="mb-8">
          <div className="relative overflow-hidden rounded-md border border-border bg-card shadow-sm">
            <div className="h-1.5" style={{ backgroundColor: elementColor }} />
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Hoy en tu perfil</h2>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <motion.div {...emojiBounce} className="text-center shrink-0">
                  <span className="text-6xl sm:text-7xl block mb-2">{display.emoji}</span>
                  <p className="font-heading text-2xl font-bold text-foreground">{display.name}</p>
                </motion.div>

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-3">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-sm"
                      style={{ color: yearResonance.color, backgroundColor: `${yearResonance.color}12` }}
                    >
                      {yearResonance.label}
                    </span>
                    <span className="text-sm" style={{ color: yearResonance.color }}>
                      {yearCycle.level >= 4 ? "Presencia marcada" : yearCycle.level >= 3 ? "Presencia moderada" : "Presencia sutil"}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-2">
                    Tu energía simbólica actual está alineada con{" "}
                    <span className="font-medium">{ANIMAL_TRAITS[userAnimal] ?? "cualidades únicas"}</span>.
                  </p>
                  <p className="text-xs text-muted">
                    {yearResonance.advice}
                  </p>
                </div>
              </div>

              {/* Year context */}
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                <span className="text-xl">{formatAnimalEmoji(yearCycle.yearAnimal)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{yearCycle.year} — Año del {yearCycle.yearAnimal}</p>
                  <p className="text-xs text-muted">{yearCycle.label}</p>
                </div>
                <span className="text-xs font-medium" style={{ color: yearResonance.color }}>
                  {yearResonance.type === "alignment" ? "5/5" : yearResonance.type === "harmony" ? "4/5" : yearResonance.type === "neutral" ? "3/5" : "2/5"}
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            BLOQUE 2: RECOMENDACIÓN DEL MOMENTO
            ═══════════════════════════════════════════════ */}
        {recommendations.length > 0 && (
          <motion.section {...cardReveal} className="mb-8">
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Algo que conecta contigo</h2>
              </div>

              <div className="space-y-3">
                {recommendations.slice(0, 3).map((rec, i) => (
                  <motion.button
                    key={rec.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: staggerDelay(i, 0.1), duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    onClick={() => router.push(`/affinity/${rec.type}/${rec.id}`)}
                    className="w-full text-left p-4 rounded-md bg-background/50 hover:bg-background transition-all duration-200 ease-out hover:-translate-y-[2px] group flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2"
                  >
                    <span className="text-2xl shrink-0">{rec.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                        {rec.name}
                      </p>
                      <p className="text-xs text-muted truncate">{rec.relationship}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] shrink-0" style={{ color: TIER_COLOR[rec.tier] }}>
                      {TIER_LABEL[rec.tier]}
                    </p>
                  </motion.button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => router.push("/affinity/recommendations/brands")}
                className="mt-4 text-xs text-accent hover:underline w-full text-center"
              >
                Ver todas las recomendaciones →
              </button>
            </div>
          </motion.section>
        )}

        {/* ═══════════════════════════════════════════════
            BLOQUE 3: DESCUBRIMIENTOS
            ═══════════════════════════════════════════════ */}
        <motion.section {...cardReveal} className="mb-8">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Sabías que...</h2>
            </div>

            <motion.div
              {...staggerApple}
              className="space-y-3"
            >
              <motion.div {...staggerItemSmooth} className="p-4 rounded-md bg-background/50">
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="font-medium">{discovery.title}</span>
                </p>
                <p className="text-xs text-muted mt-1">{discovery.detail}</p>
              </motion.div>

              <motion.div {...staggerItemSmooth} className="p-4 rounded-md bg-background/50">
                <p className="text-sm text-foreground leading-relaxed">
                  Encontramos <span className="font-medium">{recommendations.length} entidades</span> con presencia en tu mapa.
                </p>
                <p className="text-xs text-muted mt-1">Marcas, destinos y más, ordenados por su presencia simbólica en tu mapa.</p>
              </motion.div>

              {yearResonance.type === "alignment" && (
                <motion.div {...staggerItemSmooth} className="p-4 rounded-md bg-background/50">
                  <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-medium">Tu ciclo actual coincide con tu animal natal.</span>
                  </p>
                  <p className="text-xs text-muted mt-1">Un momento de alineación según la tradición.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            BLOQUE 4: CONTRASTES
            ═══════════════════════════════════════════════ */}
        {relationMap.challenging.length > 0 && (
          <motion.section {...cardReveal} className="mb-8">
            <div className="p-6 rounded-md border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Opuestos</h2>
              </div>

              <p className="text-xs text-muted mb-4 leading-relaxed">
                Algunas tradiciones consideran ciertos símbolos como energías opuestas o desafiantes.
                No significa evitar, sino conocer diferentes dinámicas.
              </p>

              <div className="flex flex-wrap gap-2">
                {relationMap.challenging.map((rel, i) => (
                  <motion.div
                    key={rel.animal}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: staggerDelay(i, 0.08), duration: 0.3 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-background/50"
                  >
                    <span className="text-lg">{formatAnimalEmoji(rel.animal)}</span>
                    <span className="text-xs font-medium text-foreground">{rel.animal}</span>
                    <span className="text-xs text-muted">Complementario</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ═══════════════════════════════════════════════
            BLOQUE 5: PROGRESO PERSONAL
            ═══════════════════════════════════════════════ */}
        <motion.section {...cardReveal} className="mb-8">
          <div className="p-6 rounded-md border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Tu progreso</h2>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">Perfil completado</span>
                <span className="text-xs font-medium text-foreground">
                  <CountUp target={80} suffix="%" duration={1} />
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "80%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: elementColor }}
                />
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-2">
              <ProgressMilestone label="Identidad" done />
              <ProgressMilestone label="Ciclos" done />
              <ProgressMilestone label="Afinidades" done />
              <ProgressMilestone label="Recomendaciones" done />
              <ProgressMilestone label="Academia" done={false} onClick={() => router.push("/academy")} />
              <ProgressMilestone label="Mapa mundial completo" done={false} onClick={() => router.push("/affinity")} />
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════ */}
        <motion.div {...smoothReveal} className="mt-8 text-center">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px]"
          >
            Ver mi mapa completo
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div {...smoothReveal} className="mt-8">
          <p className="text-xs text-muted text-center leading-relaxed">
            Análisis personal basado en tradiciones culturales del zodíaco chino. No constituye predicción científica ni determina resultados reales.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

// ════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════

function ProgressMilestone({
  label,
  done,
  onClick,
}: {
  label: string;
  done: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-full flex items-center gap-3 p-2.5 rounded-md transition-colors ${
        done ? "bg-background/30" : "bg-background/50 hover:bg-background/80"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
        done ? "bg-success text-success-foreground" : "bg-muted/20 text-muted"
      }`}>
        {done ? "✓" : "○"}
      </span>
      <span className={`text-xs ${done ? "text-foreground" : "text-muted"}`}>{label}</span>
      {onClick && !done && (
        <span className="ml-auto text-xs text-accent">Explorar →</span>
      )}
    </button>
  );
}

// ════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════

function getDiscovery(user: Animal, year: string) {
  const idx = Math.floor(Math.random() * DISCOVERIES_TEMPLATES.length);
  return DISCOVERIES_TEMPLATES[idx](user, year);
}

function getTriadPartners(animal: string): string[] {
  const map = getRelationshipMap(animal as Animal);
  return map.friends.filter(r => r.type === "triad").map(r => r.animal);
}

function getLiuHePartner(animal: string): string {
  const profile = getAnimalProfile(animal as Animal);
  return profile ? profile.liuHePartner : "";
}

function getRelationLabel(a: string, b: string): string {
  if (a === b) return "misma energía";
  const rel = getRelation(a as Animal, b as Animal);
  if (rel.type === "triad") return "tríada";
  if (rel.type === "harmonious") return "armonía natural";
  return "energías independientes";
}
