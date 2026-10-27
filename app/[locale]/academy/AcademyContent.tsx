"use client";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { ACADEMY_PIECES, type AcademyPiece } from "@/lib/data/academy-content";
import { ACADEMY_GUIDES, getAcademyGuideBySlug } from "@/lib/data/academy-guides";
import { BookOpen, Zap, Clock, Users, ArrowRight } from "lucide-react";
import { PageHero, KnowledgeSection, Closing } from "@/components/knowledge/Kit";

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

interface Course {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  pieces: AcademyPiece[];
  /** Slug de la guía práctica (academy-guides.ts) que complementa este curso, si existe. */
  guideSlug?: string;
}

const COURSES: Course[] = [
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
    description: "De la observación babilónica del cielo a Ptolomeo, que fijó las fechas de los signos.",
    color: "from-purple-500/10",
    pieces: piecesFor(["babilonia", "helenistica", "ptolomeo"]),
  },
  {
    id: "zodiaco",
    title: "Zodíaco oriental y ciclos",
    icon: "cycle",
    description: "Los 12 animales, los elementos y los ciclos de 60 años: de dónde vienen y cómo funcionan en tu mapa.",
    color: "from-emerald-500/10",
    pieces: piecesFor(["zou-yan", "calendario-taichu", "zodiaco-chino"]),
    guideSlug: "como-funciona-el-zodiaco-chino",
  },
];

// ════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════

function KnowledgeNode({
  node,
  isExpanded,
  onToggle,
}: {
  node: AcademyPiece;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const panelId = `academia-${node.slug}`;
  return (
    <li className="border-b border-ink/15">
      <div className="grid grid-cols-1 md:grid-cols-[11rem_1fr_auto] gap-x-10 gap-y-1 py-8 items-baseline">
        <p className="text-base text-muted">{node.era}</p>
        <div>
          <h3 className="font-display text-[clamp(1.75rem,3vw,2.4rem)] leading-tight text-foreground">
            <Link href={`/academy/${node.slug}`} className="hover:underline underline-offset-[6px]">
              {node.title}
            </Link>
          </h3>
          <p className="mt-2 text-lg text-foreground/80 leading-relaxed max-w-2xl">{node.idea}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          className="justify-self-start md:justify-self-end text-base underline underline-offset-4 hover:no-underline min-h-[44px]"
        >
          {isExpanded ? "Cerrar" : "Qué tomó Molino"}
        </button>
      </div>
      {isExpanded && (
        <dl id={panelId} className="md:ml-[13.5rem] mb-8 border-t-2 border-ink divide-y divide-ink/15 max-w-3xl">
          {[
            ["Origen", node.origin],
            ["Influencia", node.influence.join(", ")],
            ["Cómo se usa", node.molino],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 py-4">
              <dt className="font-display text-xl text-foreground">{k}</dt>
              <dd className="text-lg text-foreground/85 leading-relaxed">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  );
}

export default function AcademyContent() {
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Academia" }]}
        eyebrow="Academia · historia y método"
        title="De dónde viene este sistema"
        lead="Molino no inventó nada: junta tradiciones de miles de años, de los ciclos babilónicos a la numerología pitagórica y el zodíaco chino. Este recorrido muestra cómo se arma tu mapa."
        imageKey="academia/hub"
      />

      <KnowledgeSection label="Empezá por acá" title="Entendé Molino en diez minutos" intro="Guías cortas y prácticas, en orden: cada una se apoya en la anterior.">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/15 border border-ink/15">
          {ACADEMY_GUIDES.map((guide, idx) => (
            <li key={guide.slug} className="bg-background">
              <Link href={`/academy/${guide.slug}`} className="group grid grid-cols-[3rem_1fr] gap-x-4 h-full p-7 sm:p-8 hover:bg-paper-alt/70 transition-colors">
                <span className="font-display text-4xl leading-none text-muted tabular-nums">{idx + 1}</span>
                <span>
                  <span className="block font-display text-2xl leading-tight text-foreground group-hover:underline underline-offset-4">{guide.title}</span>
                  <span className="mt-2 block text-lg text-foreground/80 leading-relaxed">{guide.subtitle}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </KnowledgeSection>

      <KnowledgeSection
        label="Las tradiciones"
        title="Viajeros del tiempo"
        intro="Las grandes tradiciones simbólicas y quienes las llevaron de la antigüedad hasta hoy, en orden."
        tone="alt"
      >
        <ol className="border-t-2 border-ink">
          {ACADEMY_PIECES.map((piece) => (
            <KnowledgeNode
              key={piece.slug}
              node={piece}
              isExpanded={expandedNode === piece.slug}
              onToggle={() => setExpandedNode(expandedNode === piece.slug ? null : piece.slug)}
            />
          ))}
        </ol>
      </KnowledgeSection>

      <KnowledgeSection label="Cursos" title="Recorridos por tema" intro="Los mismos capítulos, agrupados por sistema.">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
          {COURSES.map((course) => {
            const relatedGuide = course.guideSlug ? getAcademyGuideBySlug(course.guideSlug) : undefined;
            return (
              <li key={course.id} className="bg-background p-7 sm:p-9 flex flex-col">
                <p className="text-base text-muted">
                  {course.pieces.length} capítulo{course.pieces.length !== 1 ? "s" : ""}
                </p>
                <h3 className="mt-2 font-display text-3xl leading-tight text-foreground">{course.title}</h3>
                <p className="mt-3 text-lg text-foreground/80 leading-relaxed flex-1">{course.description}</p>
                <ol className="mt-5 border-t border-ink/15 divide-y divide-ink/10 text-base">
                  {course.pieces.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/academy/${p.slug}`} className="block py-2.5 hover:underline underline-offset-4">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ol>
                {relatedGuide && (
                  <Link href={`/academy/${relatedGuide.slug}`} className="mt-5 text-base text-muted underline underline-offset-4 hover:text-foreground">
                    ¿Ya sabés la historia? La guía práctica
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </KnowledgeSection>

      <KnowledgeSection
        label="El método"
        title="Cómo Molino usa esto"
        intro="Del conocimiento antiguo al mapa personal: los cuatro pasos de tu lectura."
        tone="alt"
      >
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/15 border border-ink/15">
          {HOW_IT_WORKS.map((item) => (
            <li key={item.step} className="bg-background p-7 sm:p-8">
              <span className="font-display text-5xl leading-none text-foreground tabular-nums">{item.step}</span>
              <h3 className="mt-4 font-display text-2xl text-foreground">{item.title}</h3>
              <p className="mt-2 text-lg text-foreground/80 leading-relaxed">{item.description}</p>
              <p className="mt-4 text-base text-muted">{item.items.join(" · ")}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16">
          <Closing
            title="Listo para tu mapa"
            text="Ya conocés la historia y el método. Tu mapa aplica los tres sistemas a tu fecha de nacimiento, con la cuenta a la vista."
            href="/profile"
            cta="Crear mi mapa"
          />
        </div>
      </KnowledgeSection>
    </main>
  );
}
