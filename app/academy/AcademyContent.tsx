"use client";

import { useState } from "react";
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
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

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

const ICON_MAP: Record<string, React.FC<IconProps>> = {
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
};

const KNOWLEDGE_TREE = [
  {
    id: "babilonia",
    era: "~3000 a.C.",
    title: "Babilonia",
    icon: "knowledge",
    origin: "Mesopotamia (actual Irak)",
    idea: "Los babilonios observaron los ciclos celestes y los conectaron con la vida terrestre.",
    influence: ["Astronomía", "Ciclos planetarios", "Simbolismo celestial"],
    molino: "Base del sistema de ciclos y timing",
  },
  {
    id: "pitagoras",
    era: "~570 a.C.",
    title: "Pitágoras",
    icon: "numbers",
    origin: "Grecia antigua",
    idea: "\"Todo es número\" — el universo tiene patrones matemáticos.",
    influence: ["Numerología", "Tetraktys", "Música de las esferas"],
    molino: "Base del sistema de números y Life Path",
  },
  {
    id: "guematia",
    era: "~300 a.C.",
    title: "Guematría y Cábala",
    icon: "letters",
    origin: "Tradición hebrea",
    idea: "Cada letra tiene un valor numérico. El nombre revela la esencia.",
    influence: ["Valores numéricos", "Conexiones simbólicas", "Significado del nombre"],
    molino: "Influencia en Expression Number y Soul Number",
  },
  {
    id: "helenistica",
    era: "Siglo I d.C.",
    title: "Astrología helenística",
    icon: "stars",
    origin: "Roma/Egipto",
    idea: "Fusión de babilónica + filosofía griega: signos, casas, aspectos.",
    influence: ["Signos zodiacales", "Casas astrológicas", "Aspectos planetarios"],
    molino: "Base del sistema de astrología occidental",
  },
  {
    id: "zodiaco-chino",
    era: "Siglo V",
    title: "Zodíaco chino",
    icon: "cycle",
    origin: "China imperial",
    idea: "12 animales, ciclos de 60 años, elementos Yin/Yang.",
    influence: ["12 animales", "Ciclos de 60 años", "Elementos"],
    molino: "Base del sistema de zodíaco chino y animales",
  },
  {
    id: "balliett",
    era: "~1905",
    title: "L. Dow Balliett",
    icon: "book",
    origin: "Estados Unidos",
    idea: "Popularizó la numerología moderna. Introdujo el Life Path como concepto central.",
    influence: ["Life Path", "Números maestros", "Interpretación moderna"],
    molino: "Formalización del cálculo de Camino de Vida",
  },
  {
    id: "cheiro",
    era: "~1920",
    title: "Cheiro y Florence Campbell",
    icon: "hand",
    origin: "Irlanda/EE.UU.",
    idea: "Popularización masiva de la numerología y la quiromancia.",
    influence: ["Numerología popular", "Acessibilidad", "Cultura pop"],
    molino: "Hizo la numerología accesible para el público general",
  },
  {
    id: "jordan",
    era: "~1960",
    title: "Juno Jordan",
    icon: "graduation",
    origin: "Estados Unidos",
    idea: "Formalizó la escuela de numerología pitagórica moderna.",
    influence: ["Escuela pitagórica", "Análisis profundo", "Compatibilidad"],
    molino: "Base del análisis de compatibilidad numérica",
  },
  {
    id: "mccants",
    era: "~2000",
    title: "Glynis McCants",
    icon: "computer",
    origin: "Estados Unidos",
    idea: "Numerología para la era digital. Ciclos personales y compatibilidad.",
    influence: ["Ciclos personales", "Compatibilidad digital", "Aplicaciones modernas"],
    molino: "Inspiración para ciclos personales y recomendaciones",
  },
  {
    id: "molino",
    era: "Hoy",
    title: "Molino",
    icon: "flame",
    origin: "Plataforma global",
    idea: "Inteligencia Personal: combina tradiciones históricas en una experiencia interactiva.",
    influence: ["Numerología", "Astrología", "Zodíaco chino", "IA", "Recomendaciones"],
    molino: "Convergencia de todas las tradiciones en una plataforma moderna",
  },
];

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

const COURSES = [
  {
    id: "intro",
    title: "Introducción a la Inteligencia Personal",
    icon: "target",
    lessons: 5,
    description: "Los conceptos fundamentales detrás de tu mapa personal.",
  },
  {
    id: "numerologia",
    title: "Numerología: de Pitágoras al presente",
    icon: "numbers",
    lessons: 8,
    description: "La historia completa de cómo los números se convirtieron en herramienta de autoconocimiento.",
  },
  {
    id: "zodiaco",
    title: "Zodíaco oriental y ciclos",
    icon: "cycle",
    lessons: 6,
    description: "Los 12 animales, los elementos y los ciclos de 60 años.",
  },
  {
    id: "mapa",
    title: "Cómo leer tu mapa personal",
    icon: "map",
    lessons: 4,
    description: "Guía práctica para interpretar tu Inteligencia Personal.",
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
  node: typeof KNOWLEDGE_TREE[0];
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
      {/* Dot */}
      <button
        type="button"
        onClick={onToggle}
        className={`absolute left-4 top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
          isExpanded ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent/50"
        }`}
      >
        <span className="text-sm">{node.icon}</span>
      </button>

      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">{node.era}</p>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-1">{node.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{node.idea}</p>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-5 rounded-xl border border-border bg-background/50 space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Origen</p>
                <p className="text-xs text-foreground">{node.origin}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Influencia en Molino</p>
                <div className="flex flex-wrap gap-1.5">
                  {node.influence.map((inf) => (
                    <span key={inf} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                      {inf}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Cómo se usa</p>
                <p className="text-xs text-foreground">{node.molino}</p>
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

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* ═══════════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════════ */}
        <motion.section {...heroReveal} className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">La Academia</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-6">
            De dónde viene este sistema
          </h1>
          <p className="text-base text-muted max-w-xl leading-relaxed">
            Aprendé las raíces históricas detrás de tu Inteligencia Personal.
            Molino conecta tradiciones de miles de años en una experiencia moderna.
          </p>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            KNOWLEDGE TREE
            ═══════════════════════════════════════════════ */}
        <motion.section {...smoothReveal} className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">El árbol del conocimiento</h2>
          </div>

          <p className="text-sm text-muted mb-8 leading-relaxed">
            Cada nodo representa una tradición que Molino integra. Tocá para explorar.
          </p>

          <section className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border" aria-hidden="true" />
            <div className="space-y-8">
              {KNOWLEDGE_TREE.map((node, i) => (
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
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Cómo funciona Molino</h2>
          </div>

          <motion.div {...staggerApple} className="space-y-4">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                {...staggerItemSmooth}
                transition={{ delay: staggerDelay(i, 0.1), duration: 0.4 }}
                className="p-5 rounded-xl border border-border bg-card"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl shrink-0">{step.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-accent">Paso {step.step}</span>
                      <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-xs text-muted/70 leading-relaxed mb-2">{step.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.items.map((item) => (
                        <span key={item} className="text-[10px] px-2 py-0.5 rounded-full bg-background text-muted">
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
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Rutas de aprendizaje</h2>
          </div>

          <motion.div {...staggerApple} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COURSES.map((course, i) => (
              <motion.div
                key={course.id}
                {...staggerItemSmooth}
                transition={{ delay: staggerDelay(i, 0.08), duration: 0.4 }}
                className="p-5 rounded-xl border border-border bg-card hover:border-accent/50 transition-colors cursor-pointer group"
                onClick={() => {/* TODO: navigate to course */}}
              >
                <span className="text-2xl block mb-3">{course.icon}</span>
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                  {course.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed mb-2">{course.description}</p>
                <p className="text-[10px] text-accent font-medium">{course.lessons} lecciones →</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            DISCLAIMER PREMIUM
            ═══════════════════════════════════════════════ */}
        <motion.section {...smoothReveal} className="mb-16">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Transparencia</p>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              Molino explora tradiciones históricas de números y símbolos culturales como herramienta de reflexión personal.
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Las interpretaciones pertenecen al campo simbólico y cultural, no constituyen predicciones científicas.
              Molino combina numerología, astrología y zodíaco chino de forma transparente y educativa.
            </p>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            CTA
            ═══════════════════════════════════════════════ */}
        <motion.section {...smoothReveal} className="text-center">
          <div className="p-8 rounded-2xl border border-border bg-card">
            <p className="text-sm text-muted mb-4">
              ¿Querés ver cómo se aplican estas tradiciones en tu perfil?
            </p>
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[44px]"
            >
              Ver mi Inteligencia Personal
            </button>
          </div>
        </motion.section>
      </main>
      <UniversityFooter />
    </div>
  );
}
