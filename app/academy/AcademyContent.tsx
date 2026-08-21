"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  smoothReveal,
  heroReveal,
  cardReveal,
  staggerApple,
  staggerItemSmooth,
  staggerDelay,
} from "@/lib/utils/premiumMotion";
import { ACADEMY_PIECES, type AcademyPiece } from "@/lib/data/academy-content";
import { BookOpen, Sparkles, Zap, Clock, Users, ArrowRight } from "lucide-react";

type IconProps = React.SVGProps<SVGSVGElement>;

const IconBase: React.FC<IconProps> = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props} />
);

const IconKnowledge = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 2l7 4v5c0 5.5-3.8 10-7 12-3.2-2-7-6.5-7-12V6l7-4z" />
  </IconBase>
);
const IconNumbers = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </IconBase>
);
const IconLetters = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 7V4h16v3" />
    <path d="M12 4v16" />
    <path d="M8 20h8" />
  </IconBase>
);
const IconStars = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </IconBase>
);
const IconCycle = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 4a8 8 0 1 1 0 16" />
    <path d="M12 4v8l4 2" />
  </IconBase>
);
const IconBook = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 4h16v16H4z" />
    <path d="M4 4l8 8 8-8" />
  </IconBase>
);
const IconHand = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M18 11V6a2 2 0 0 0-4 0v1" />
    <path d="M14 10V4a2 2 0 0 0-4 0v2" />
    <path d="M10 10.5V5a2 2 0 0 0-4 0v9" />
    <path d="M18 11a2 2 0 0 1 2 2v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2a2 2 0 0 1 2-2" />
  </IconBase>
);
const IconGraduation = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M22 10v6M2 10l10-7 10 7-10 7L2 10z" />
    <path d="M6 12v5c0 2 6 4 6 4s6-2 6-4v-5" />
  </IconBase>
);
const IconComputer = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </IconBase>
);
const IconTarget = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);
const IconRepeat = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h13" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H4" />
  </IconBase>
);
const IconSparkle = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 21l1.9-5.8 5.8-1.9-5.8-1.9z" />
  </IconBase>
);
const IconClock = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </IconBase>
);
const IconMap = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 2l9 4.5-9 4.5-9-4.5L12 2z" />
    <path d="M3 15l9 4.5 9-4.5" />
    <path d="M3 10.5l9 4.5 9-4.5" />
  </IconBase>
);
const IconFlame = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 2c1 3-2 5-2 8 0 2.5 2 4 2 4s2-1.5 2-4c0-3-3-5-2-8z" />
    <path d="M10 18c0 1 1.5 2 2 2s2-1 2-2" />
  </IconBase>
);

export const ICON_MAP: Record<string, React.FC<IconProps>> = {
  babilonia: IconKnowledge,
  pitagoras: IconNumbers,
  guematia: IconLetters,
  helenistica: IconStars,
  "zodiaco-chino": IconCycle,
  balliett: IconBook,
  cheiro: IconHand,
  jordan: IconGraduation,
  mccants: IconComputer,
  molino: IconFlame,
  identidad: IconTarget,
  ciclos: IconRepeat,
  entidades: IconSparkle,
  explorar: IconMap,
  numerologia: IconNumbers,
  astrologia: IconStars,
  filosofia: IconBook,
  knowledge: IconKnowledge,
  numbers: IconNumbers,
  letters: IconLetters,
  stars: IconStars,
  cycle: IconCycle,
  book: IconBook,
  hand: IconHand,
  graduation: IconGraduation,
  computer: IconComputer,
  flame: IconFlame,
  target: IconTarget,
  repeat: IconRepeat,
  sparkle: IconSparkle,
  clock: IconClock,
  map: IconMap,
};

// ════════════════════════════════════════════════════
// HOW MOLINO WORKS
// ════════════════════════════════════════════════════

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Tu identidad",
    icon: "target",
    items: ["Fecha de nacimiento", "Nombre", "Número principal", "Animal zodiacal"],
    description: "Molino calcula tus patrones base a partir de datos que ya tenés.",
  },
  {
    step: 2,
    title: "Tus ciclos",
    icon: "repeat",
    items: ["Años personales", "Ciclos zodiacales", "Momento actual"],
    description: "Cada año tiene una energía diferente según tu perfil.",
  },
  {
    step: 3,
    title: "Tus afinidades",
    icon: "sparkle",
    items: ["Marcas", "Lugares", "Personas", "Actividades"],
    description: "Entidades que resuenan con tu patrón simbólico.",
  },
  {
    step: 4,
    title: "Tu momento actual",
    icon: "clock",
    items: ["Contexto temporal", "Recomendaciones", "Descubrimientos"],
    description: "Qué explorar ahora según tus ciclos.",
  },
];

// ════════════════════════════════════════════════════
// COURSES
// ════════════════════════════════════════════════════

function piecesFor(slugs: string[]): AcademyPiece[] {
  return slugs
    .map((slug) => ACADEMY_PIECES.find((p) => p.slug === slug))
    .filter((p): p is AcademyPiece => Boolean(p));
}

const COURSES = [
  {
    id: "intro",
    title: "Introducción a tu mapa personal",
    icon: "target",
    description: "Los conceptos fundamentales detrás de tu mapa personal.",
    color: "from-blue-500/10",
    pieces: piecesFor(["babilonia", "molino"]),
  },
  {
    id: "numerologia",
    title: "Numerología: de Pitágoras al presente",
    icon: "numbers",
    description: "La historia completa de cómo los números se convirtieron en herramienta de autoconocimiento.",
    color: "from-amber-500/10",
    pieces: piecesFor(["pitagoras", "guematia", "balliett", "cheiro", "jordan", "mccants"]),
  },
  {
    id: "astrologia",
    title: "Astrología occidental",
    icon: "stars",
    description: "De la observación babilónica del cielo a la astrología helenística que define signos y casas.",
    color: "from-purple-500/10",
    pieces: piecesFor(["babilonia", "helenistica"]),
  },
  {
    id: "zodiaco",
    title: "Zodíaco oriental y ciclos",
    icon: "cycle",
    description: "Los 12 animales, los elementos y los ciclos de 60 años.",
    color: "from-emerald-500/10",
    pieces: piecesFor(["zodiaco-chino"]),
  },
];

// ════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════

function KnowledgeNode({
  node,
  index,
  isExpanded,
  onToggle,
}: {
  node: AcademyPiece;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="relative pl-16"
    >
      {/* Dot — decorativo */}
      <div
        aria-hidden="true"
        className={`absolute left-4 top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors pointer-events-none ${
          isExpanded ? "border-accent bg-accent/10" : "border-ink/10 bg-background"
        }`}
      >
        <span className="text-sm">
          {(() => {
            const Icon = ICON_MAP[node.icon];
            return Icon ? <Icon className="w-4 h-4" /> : null;
          })()}
        </span>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full text-left group"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-1">{node.era}</p>
        <h3 className="font-heading text-xl font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">{node.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{node.idea}</p>
      </button>

      <div className="flex items-center gap-4 mt-3">
        <Link
          href={`/academy/${node.slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors group"
        >
          <span>Leer más</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-6 rounded-lg border border-border bg-gradient-to-br from-card to-card/50 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted font-semibold mb-1">Origen</p>
                <p className="text-sm text-foreground">{node.origin}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted font-semibold mb-2">Influencia en Molino</p>
                <div className="flex flex-wrap gap-1.5">
                  {node.influence.map((inf) => (
                    <span key={inf} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                      {inf}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted font-semibold mb-1">Cómo se usa</p>
                <p className="text-sm text-foreground">{node.molino}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AcademyContent() {
  const router = useRouter();
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"history" | "courses">("history");

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">

        {/* ═══════════════════════════════════════════════
            HERO — Impactante con mejor contexto
            ═══════════════════════════════════════════════ */}
        <motion.section {...heroReveal} className="mb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">Academia de Molino</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.05] mb-6">
            De dónde viene este sistema
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-3xl leading-relaxed mb-8">
            Molino no inventó nada. Es un pórtico a tradiciones milenarias: desde los ciclos babilónicos hasta la numerología pitagórica, 
            pasando por la astrología helenística y el zodíaco chino. Este recorrido te ayuda a entender cómo se construye tu mapa.
          </p>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                activeTab === "history"
                  ? "bg-accent text-accent-foreground shadow-lg"
                  : "bg-card border border-border hover:border-accent/50"
              }`}
            >
              Viajeros del tiempo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab("courses")}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                activeTab === "courses"
                  ? "bg-accent text-accent-foreground shadow-lg"
                  : "bg-card border border-border hover:border-accent/50"
              }`}
            >
              Cursos temáticos
            </motion.button>
          </div>
        </motion.section>

        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════
              TAB: HISTORY — Tradiciones y sus autores
              ═══════════════════════════════════════════════ */}
          {activeTab === "history" && (
            <motion.section
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-20"
            >
              <div className="mb-12">
                <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-3">Viajeros del tiempo</h2>
                <p className="text-muted max-w-2xl">
                  Las grandes tradiciones simbólicas y los maestros que las llevaron desde la antigüedad hasta hoy.
                </p>
              </div>

              <div className="space-y-8">
                {ACADEMY_PIECES.map((piece, idx) => (
                  <KnowledgeNode
                    key={piece.slug}
                    node={piece}
                    index={idx}
                    isExpanded={expandedNode === piece.slug}
                    onToggle={() => setExpandedNode(expandedNode === piece.slug ? null : piece.slug)}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* ═══════════════════════════════════════════════
              TAB: COURSES — Cursos temáticos
              ═══════════════════════════════════════════════ */}
          {activeTab === "courses" && (
            <motion.section
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-20"
            >
              <div className="mb-12">
                <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-3">Cursos temáticos</h2>
                <p className="text-muted max-w-2xl">
                  Recorridos estructurados por tema: desde numerología hasta astrología oriental.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {COURSES.map((course, idx) => {
                  const CourseIcon = ICON_MAP[course.icon];
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className={`p-8 rounded-xl border border-border bg-gradient-to-br ${course.color} to-background hover:border-accent/50 transition-all group cursor-pointer`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                          {CourseIcon && <CourseIcon className="w-6 h-6 text-accent" />}
                        </div>
                        <span className="text-xs font-mono font-bold text-accent/60">
                          {course.pieces.length} capítulo{course.pieces.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted mb-6 leading-relaxed">{course.description}</p>

                      <div className="flex items-center justify-between pt-6 border-t border-border">
                        <span className="text-xs font-mono uppercase tracking-[0.15em] text-muted">Inicia aquí</span>
                        <Link
                          href={`/academy/${course.pieces[0]?.slug || "babilonia"}`}
                          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors group/link"
                        >
                          <span className="text-sm font-semibold">Empezar</span>
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════
            CÓMO FUNCIONA — Proceso paso a paso
            ═══════════════════════════════════════════════ */}
        <motion.section {...staggerApple} className="mb-20">
          <div className="mb-12">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-3">Cómo Molino usa esto</h2>
            <p className="text-muted max-w-2xl">
              Del conocimiento antiguo al mapa personal moderno: estos son los cuatro pilares de tu lectura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HOW_IT_WORKS.map((item, idx) => {
              const StepIcon = ICON_MAP[item.icon];
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-xl border border-border bg-card hover:border-accent/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 font-mono text-sm font-bold text-accent">
                      {item.step}
                    </span>
                    {StepIcon && <StepIcon className="w-6 h-6 text-accent" />}
                  </div>

                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted mb-4">{item.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {item.items.map((itemText) => (
                      <span key={itemText} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {itemText}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            CTA — Ir a generar tu mapa
            ═══════════════════════════════════════════════ */}
        <motion.section {...staggerApple} className="py-16 px-8 sm:px-12 rounded-xl border border-border bg-gradient-to-br from-accent/10 to-accent/5 text-center">
          <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
          <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Listo para tu mapa</h2>
          <p className="text-muted max-w-2xl mx-auto mb-6">
            Ahora que conocés la historia y la teoría, generá tu mapa personal en segundos y descubrí cómo estos sistemas ancestrales hablan de vos.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors group"
          >
            <span>Generá tu mapa</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.section>
      </main>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        {/* ═══════════════════════════════════════════════
            HERO — mismo criterio que Biblioteca/Atlas: eyebrow
            + font-display grande + bajada.
            ═══════════════════════════════════════════════ */}
        <motion.section {...heroReveal} className="mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted font-medium mb-4">Academia</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05]">
            De dónde viene este sistema
          </h1>
          <p className="text-base sm:text-lg text-muted mt-4 max-w-xl leading-relaxed">
            Aprendé las raíces históricas detrás de tu mapa personal.
            Molino conecta tradiciones de miles de años en una experiencia moderna.
          </p>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            KNOWLEDGE TREE
            ═══════════════════════════════════════════════ */}
        <motion.section {...smoothReveal} className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">El árbol del conocimiento</h2>
          </div>

          <p className="text-sm text-muted mb-8 leading-relaxed">
            Cada nodo representa una tradición que Molino integra. Tocá para explorar.
          </p>

          <section className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-ink/10" aria-hidden="true" />
            <div className="space-y-8">
              {ACADEMY_PIECES.map((node, i) => (
                <KnowledgeNode
                  key={node.id}
                  node={node}
                  index={i}
                  isExpanded={expandedNode === node.id}
                  onToggle={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                />
              ))}
            </div>
          </section>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            HOW MOLINO WORKS
            ═══════════════════════════════════════════════ */}
        <motion.section {...smoothReveal} className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Cómo funciona Molino</h2>
          </div>

          <motion.div {...staggerApple} className="space-y-4">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                {...staggerItemSmooth}
                transition={{ delay: staggerDelay(i, 0.1), duration: 0.4 }}
                className="p-6 rounded-2xl border border-ink/10 bg-card"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl shrink-0">
                    {(() => {
                      const Icon = ICON_MAP[step.icon];
                      return Icon ? <Icon className="w-6 h-6" /> : null;
                    })()}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-accent">Paso {step.step}</span>
                      <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-xs text-muted leading-relaxed mb-2">{step.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.items.map((item) => (
                        <span key={item} className="text-xs px-2 py-0.5 rounded-full bg-background text-muted">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            COURSES
            ═══════════════════════════════════════════════ */}
        <motion.section {...smoothReveal} className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Rutas de aprendizaje</h2>
          </div>

          <motion.div {...staggerApple} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COURSES.map((course, i) => (
              <motion.div
                key={course.id}
                {...staggerItemSmooth}
                transition={{ delay: staggerDelay(i, 0.08), duration: 0.4 }}
                className="p-6 rounded-2xl border border-ink/10 bg-card"
              >
                <span className="text-2xl block mb-3">
                  {(() => {
                    const Icon = ICON_MAP[course.icon];
                    return Icon ? <Icon className="w-6 h-6" /> : null;
                  })()}
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                  {course.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed mb-3">{course.description}</p>
                <div className="flex flex-col gap-1.5">
                  {course.pieces.map((piece) => (
                    <Link
                      key={piece.slug}
                      href={`/academy/${piece.slug}`}
                      className="text-xs text-accent hover:underline"
                    >
                      {piece.title} →
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            DISCLAIMER PREMIUM
            ═══════════════════════════════════════════════ */}
        <motion.section {...smoothReveal} className="mb-16">
          <div className="p-6 rounded-2xl border border-ink/10 bg-card">
            <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3">Transparencia</p>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              Estas tradiciones históricas exploran números y símbolos culturales como herramienta de reflexión personal.
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Las interpretaciones pertenecen al campo simbólico y cultural, no constituyen predicciones científicas.
              Este mapa combina numerología, astrología y zodíaco chino de forma transparente y educativa.
            </p>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            CTA
            ═══════════════════════════════════════════════ */}
        <motion.section {...smoothReveal} className="text-center">
          <div className="p-8 rounded-2xl border border-ink/10 bg-card">
            <p className="text-sm text-muted mb-4">
              ¿Querés ver cómo se aplican estas tradiciones en tu perfil?
            </p>
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px]"
            >
              Ver mi mapa
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
