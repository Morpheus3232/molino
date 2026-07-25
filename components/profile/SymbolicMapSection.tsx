"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import {
  smoothReveal,
  heroReveal,
  cardReveal,
  emojiBounce,
  popIn,
  staggerApple,
  staggerItemSmooth,
  staggerDelay,
} from "@/lib/utils/premiumMotion";
import type { UserProfile } from "@/types/user";
import {
  resolveYearCycle,
  getYearCycleHistory,
  calculateYearResonance,
  YEAR_CYCLE_META,
  type YearCycle,
  type YearCycleHistory,
  type YearResonance,
} from "@/lib/engines/yearCycleEngine";
import {
  getRelationshipMap,
  getAnimalProfile,
  type Animal,
  type AnimalRelation,
} from "@/lib/data/animalRelations";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { formatAnimalSimple, formatAnimalEmoji, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import SymbolicMapShareableCard from "@/components/profile/SymbolicMapShareableCard";

interface SymbolicMapSectionProps {
  profile: UserProfile;
}

const TRAIT_DESCRIPTIONS: Record<string, string> = {
  Rata: "Tu energía base se define por la astucia, la adaptabilidad y una curiosidad natural que te impulsa a explorar.",
  Buey: "Tu energía base se define por la fuerza, la determinación y una lealtad que construye con paciencia.",
  Tigre: "Tu energía base se define por el coraje, la pasión y un liderazgo natural que inspira a otros.",
  Conejo: "Tu energía base se define por la elegancia, la sensibilidad y una intuición que busca armonía.",
  Dragón: "Tu energía base se define por el poder, la visión y una ambición que trasciende lo ordinario.",
  Serpiente: "Tu energía base se define por la sabiduría, la profundidad y un magnetismo que atrae lo profundo.",
  Caballo: "Tu energía base se define por el movimiento, la independencia y una sed de exploración constante.",
  Cabra: "Tu energía base se define por la creatividad, la sensibilidad y un ojo artístico natural.",
  Mono: "Tu energía base se define por el ingenio, la versatilidad y una chispa que resuelve con inteligencia.",
  Gallo: "Tu energía base se define por la puntualidad, la observación y un coraje que dice las cosas como son.",
  Perro: "Tu energía base se define por la lealtad, la honradez y un instinto protector incondicional.",
  Cerdo: "Tu energía base se define por la generosidad, el optimismo y una calidez que abraza la vida.",
};

const FRIEND_DESCRIPTIONS: Record<string, string> = {
  triad: "Potencia movimiento, iniciativa y expansión",
  harmonious: "Se complementan de forma natural y equilibrada",
};

export default function SymbolicMapSection({ profile }: SymbolicMapSectionProps) {
  const router = useRouter();
  const [showShareCard, setShowShareCard] = useState(false);

  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);

  const yearCycle = useMemo(() => resolveYearCycle(userAnimal), [userAnimal]);
  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const cycleHistory = useMemo(() => getYearCycleHistory(userAnimal), [userAnimal]);
  const yearResonance = useMemo(() => calculateYearResonance(userAnimal, yearCycle.yearAnimal), [userAnimal, yearCycle.yearAnimal]);
  const profile_ = useMemo(() => getAnimalProfile(userAnimal), [userAnimal]);

  if (!userAnimal) return null;

  const elementColor = ELEMENT_COLORS[profile.chineseZodiacInfo?.element ?? "Fuego"] ?? "#C49A2A";
  const display = getZodiacDisplay(userAnimal);

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* ═══════════════════════════════════════════════
            HEADER
            ═══════════════════════════════════════════════ */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Mi Mapa Personal</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            Descubrí qué energías te acompañan, cuáles potenciar y cuáles requieren más atención.
          </p>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            CARD PRINCIPAL — Identidad
            ═══════════════════════════════════════════════ */}
        <motion.div {...heroReveal} className="mt-8">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            {/* Accent bar */}
            <div className="h-1.5" style={{ backgroundColor: elementColor }} />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Animal hero */}
                <div className="text-center shrink-0">
                  <motion.span {...emojiBounce} className="text-7xl sm:text-8xl block mb-3">{display.emoji}</motion.span>
                  <p className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{display.name}</p>
                  <p className="text-xs text-muted mt-1">Tu energía base</p>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm text-foreground leading-relaxed mb-4">
                    {TRAIT_DESCRIPTIONS[userAnimal] ?? "Energía única en el ciclo del zodíaco chino."}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                    <span className="px-3 py-1.5 rounded-lg bg-background">
                      <span className="text-muted">Elemento:</span>{" "}
                      <span className="font-medium text-foreground">{profile.chineseZodiacInfo?.element ?? "—"}</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-background">
                      <span className="text-muted">Año:</span>{" "}
                      <span className="font-medium text-foreground">{userYear}</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-background">
                      <span className="text-muted">Grupo:</span>{" "}
                      <span className="font-medium text-foreground">{profile_.traits.join(" · ")}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            CICLO ACTUAL
            ═══════════════════════════════════════════════ */}
        <motion.div {...fadeUp} className="mt-6">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h3 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu momento actual</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Year animal */}
              <div className="text-center shrink-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-1">{yearCycle.year}</p>
                <span className="text-5xl block mb-1">{formatAnimalEmoji(yearCycle.yearAnimal)}</span>
                <p className="font-serif text-lg font-semibold text-foreground">Año del {yearCycle.yearAnimal}</p>
              </div>

              {/* Cycle info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-3">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ color: yearResonance.color, backgroundColor: `${yearResonance.color}12` }}
                  >
                    {yearResonance.label}
                  </span>
                  <span className="text-sm" style={{ color: yearResonance.color }}>
                    {"★".repeat(yearCycle.level)}{"☆".repeat(5 - yearCycle.level)}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-2">
                  {yearResonance.advice}
                </p>
                <p className="text-xs text-muted/60 italic">
                  {yearCycle.explanation}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Línea de ciclos</p>
              <motion.div
                {...staggerApple}
                className="flex items-center gap-1 overflow-x-auto pb-2"
              >
                {cycleHistory.map((c, i) => {
                  const isCurrent = c.year === yearCycle.year;
                  const meta = YEAR_CYCLE_META[c.cycleType];
                  return (
                    <motion.div
                      key={c.year}
                      {...staggerItemSmooth}
                      transition={{ duration: 0.4, delay: staggerDelay(i, 0.04) }}
                      className={`flex flex-col items-center min-w-[48px] py-2 px-1 rounded-lg transition-colors ${
                        isCurrent ? "bg-accent/10 border border-accent/30" : "hover:bg-muted/30"
                      }`}
                    >
                      <span className="text-[9px] text-muted">{c.year}</span>
                      <span className="text-base my-0.5">{formatAnimalEmoji(c.animal)}</span>
                      <span className="text-[8px]" style={{ color: meta.color }}>
                        {"★".repeat(meta.stars)}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            ENERGÍAS FAVORABLES
            ═══════════════════════════════════════════════ */}
        <motion.div {...fadeUp} className="mt-6">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h3 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Mis energías favorables</h3>
            </div>

            {/* Same animal — hero */}
            <div className="p-4 rounded-xl mb-3" style={{ backgroundColor: `${elementColor}08`, border: `1px solid ${elementColor}20` }}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{display.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{display.name}</p>
                  <p className="text-xs text-muted">Tu mismo animal — resonancia natural</p>
                </div>
                <span className="text-sm font-bold" style={{ color: "#2D5A3D" }}>★★★★★</span>
              </div>
            </div>

            {/* Friends */}
            <div className="space-y-2">
              {relationMap.friends.map((rel, i) => (
                <motion.div
                  key={rel.animal}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-background/50"
                >
                  <span className="text-2xl">{formatAnimalEmoji(rel.animal)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{rel.animal}</p>
                    <p className="text-[10px] text-muted">
                      {rel.type === "triad" ? "Tríada compatible" : "Armonía natural (Liu He)"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-medium text-[#4A6FA5]">★★★★☆</span>
                    <p className="text-[9px] text-muted mt-0.5">
                      {FRIEND_DESCRIPTIONS[rel.type] ?? ""}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-muted/50 mt-4 italic">
              Signos tradicionalmente asociados con mayor armonía.
            </p>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            ENERGÍAS PARA OBSERVAR
            ═══════════════════════════════════════════════ */}
        {relationMap.challenging.length > 0 && (
          <motion.div {...fadeUp} className="mt-6">
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h3 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Energías para observar</h3>
              </div>

              <div className="space-y-2">
                {relationMap.challenging.map((rel, i) => (
                  <motion.div
                    key={rel.animal}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-background/50"
                  >
                    <span className="text-2xl">{formatAnimalEmoji(rel.animal)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{rel.animal}</p>
                      <p className="text-[10px] text-muted">
                        {rel.type === "clash" ? "Opuestos en el ciclo" : "Relación de atención"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-medium text-[#B45309]">★★☆☆☆</span>
                      <p className="text-[9px] text-muted mt-0.5">
                        {rel.type === "clash"
                          ? "Puede requerir mayor estrategia y flexibilidad"
                          : "Requiere planificación y consciencia"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-muted/50 mt-4 italic">
                Relaciones de adaptación según la tradición. No son negativas — son oportunidades de crecimiento.
              </p>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════
            EXPLORAR
            ═══════════════════════════════════════════════ */}
        <motion.div {...fadeUp} className="mt-6">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h3 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Explorar</h3>
            </div>
            <p className="text-sm text-muted mb-4">
              Encontrá marcas y lugares que comparten símbolos compatibles con tu perfil.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ExploreCard
                emoji="🏷"
                title="Marcas alineadas"
                description="Descubrí qué marcas resuenan con tu energía"
                onClick={() => router.push("/affinity/recommendations/brands")}
              />
              <ExploreCard
                emoji="🌎"
                title="Destinos compatibles"
                description="Países y ciudades con resonancia simbólica"
                onClick={() => router.push("/affinity/recommendations/countries")}
              />
              <ExploreCard
                emoji="🏛"
                title="Todas las entidades"
                description="Explorá el mapa completo de afinidades"
                onClick={() => router.push("/affinity")}
              />
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            SHARE
            ═══════════════════════════════════════════════ */}
        <motion.div {...fadeUp} className="mt-6">
          <div className="p-5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Compartir mi mapa simbólico</p>
              <p className="text-xs text-muted mt-0.5">Mostrá tu identidad zodiacal a tus contactos</p>
            </div>
            <button
              type="button"
              onClick={() => setShowShareCard(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all px-5 py-2.5 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px]"
            >
              Compartir
            </button>
          </div>
        </motion.div>

        {/* Shareable card modal */}
        <AnimatePresence>
          {showShareCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
              onClick={() => setShowShareCard(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-[480px] w-full"
              >
                <SymbolicMapShareableCard
                  userAnimal={userAnimal}
                  userYear={userYear}
                  element={profile.chineseZodiacInfo?.element}
                  yearAnimal={yearCycle.yearAnimal}
                  year={yearCycle.year}
                  yearResonance={yearResonance}
                  friends={relationMap.friends}
                  challenging={relationMap.challenging}
                />
                <button
                  type="button"
                  onClick={() => setShowShareCard(false)}
                  className="mt-4 w-full text-center text-sm text-muted hover:text-foreground transition-colors"
                >
                  Cerrar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Academy link */}
        <motion.div {...fadeUp} className="mt-6">
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <p className="text-xs text-muted mb-2">¿De dónde viene este sistema?</p>
            <button
              type="button"
              onClick={() => router.push("/academy")}
              className="text-xs font-medium text-accent hover:underline"
            >
              Explorá La Academia →
            </button>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div {...fadeUp} className="mt-8">
          <p className="text-[10px] text-muted/50 text-center leading-relaxed">
            Análisis personal basado en tradiciones culturales del zodíaco chino. No constituye predicción científica ni determina resultados reales.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════

function ExploreCard({
  emoji,
  title,
  description,
  onClick,
}: {
  emoji: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left p-4 rounded-xl border border-border bg-background/50 hover:border-accent/50 transition-colors group"
    >
      <span className="text-xl block mb-2">{emoji}</span>
      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{title}</p>
      <p className="text-xs text-muted mt-1">{description}</p>
    </button>
  );
}
