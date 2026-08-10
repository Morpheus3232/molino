"use client";

import { useEffect, useState } from "react";
import type { UserProfile } from "@/types/user";
import {
  buildPatterns,
  buildTensions,
  buildRules,
  buildMomentState,
  buildPrinciples,
} from "@/lib/engines/synthesisEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { analyzeTiming } from "@/lib/engines/timingEngine";
import { loadTimingIntention } from "@/lib/session/timingIntention";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { safeNumber } from "@/lib/utils/score";
import PremiumGate from "@/components/profile/PremiumGate";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import type { MolinoInterpretation as MolinoInterpretationType } from "@/lib/engines/intelligenceEngine";
import ChatWithMolino from "@/components/profile/ChatWithMolino";
import EditorialSection from "@/components/ui/EditorialSection";

interface LecturaProfundaProps {
  profile: UserProfile;
}

/** Marca de sección discreta — número + regla fina, el mismo idioma de
 * capítulo que ya usa el resto de /profile (WorldConnections, CircleAlignment).
 * Nunca un kicker genérico: el número es parte de la secuencia real 01→07. */
function SubHeader({
  number,
  title,
  description,
  elementColor,
}: {
  number: string;
  title: string;
  description: string;
  elementColor: string;
}) {
  return (
    <div className="mb-6 sm:mb-8 flex items-start gap-4 sm:gap-5">
      <span
        className="number-display text-xl sm:text-2xl leading-none pt-0.5 shrink-0"
        style={{ color: elementColor }}
        aria-hidden="true"
      >
        {number}
      </span>
      <div className="min-w-0">
        <h3 className="font-heading text-xl sm:text-2xl tracking-tight text-foreground">{title}</h3>
        <p className="text-sm text-muted mt-1">{description}</p>
      </div>
    </div>
  );
}

/**
 * "Ver conexiones" — la trazabilidad de producto de la síntesis: qué piezas
 * ya calculadas (gratis, arriba) sustentan la interpretación paga. Un
 * esquema lineal, no un grafo. Nunca el prompt ni el razonamiento del modelo.
 */
interface ConnectionNode {
  kind: string;
  label: string;
}

function Connections({ nodes }: { nodes: ConnectionNode[] }) {
  const [open, setOpen] = useState(false);
  if (nodes.length === 0) return null;
  return (
    <div className="mt-8 pt-6 border-t border-ink/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="font-mono text-xs uppercase tracking-[0.2em] text-accent hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {open ? "Ocultar conexiones" : "Ver conexiones"}
      </button>
      {open && (
        <div className="mt-5">
          <p className="text-xs text-muted mb-4">Esta lectura conecta:</p>
          <ol className="relative border-l border-ink/15 pl-6 space-y-5">
            {nodes.map((n) => (
              <li key={`${n.kind}-${n.label}`} className="relative">
                <span
                  className="absolute -left-[1.6rem] top-1 w-2 h-2 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent/80">{n.kind}</p>
                <p className="text-sm text-foreground/90 leading-relaxed mt-1">{n.label}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/**
 * FREE — las piezas. Determinístico, sin IA: buildPatterns/buildRules/
 * buildMomentState/analyzeTiming/calculateDailyEnergy, los mismos engines
 * que ya son gratis en el resto del sitio. El usuario sin Premium tiene que
 * poder entender su mapa completo con esto — nunca se oculta para forzar el
 * paywall.
 */
function PiezasLibres({
  profile,
  onData,
}: {
  profile: UserProfile;
  onData: (data: { patterns: ReturnType<typeof buildPatterns>; rules: ReturnType<typeof buildRules>; tensions: ReturnType<typeof buildTensions>; dailyEnergy: ReturnType<typeof calculateDailyEnergy>; timing: ReturnType<typeof analyzeTiming> }) => void;
}) {
  const [savedIntention, setSavedIntention] = useState<ReturnType<typeof loadTimingIntention>>(null);

  useEffect(() => {
    setSavedIntention(loadTimingIntention());
  }, []);

  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  const dailyEnergy = calculateDailyEnergy(profile);
  const patterns = buildPatterns(profile);
  const tensions = buildTensions(profile);
  const rules = buildRules(profile);
  const principles = buildPrinciples(rules, patterns, profile.archetypeInfo);
  const momentState = buildMomentState(profile, dailyEnergy.overallScore, dailyEnergy.theme);
  // Misma intención por defecto que usa el resto del mapa cuando el usuario
  // todavía no eligió una en /hoy — no altera analyzeTiming, solo qué
  // intención se le pasa.
  const timing = analyzeTiming(profile, new Date(), savedIntention || "start_project");

  useEffect(() => {
    onData({ patterns, rules, tensions, dailyEnergy, timing });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, savedIntention]);

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 01 · Tus patrones */}
      {patterns.length > 0 && (
        <div>
          <SubHeader number="01" title="Tus patrones" description="Lo que hoy conviene tener presente" elementColor={elementColor} />
          <div className="max-w-3xl space-y-8 sm:space-y-10">
            {patterns.map((p) => (
              <div key={p.label} className="py-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-3">{p.label}</p>
                <p className="font-heading text-xl sm:text-2xl tracking-tight mb-2" style={{ color: elementColor }}>
                  {p.keyword}
                </p>
                <p className="text-base sm:text-lg text-foreground leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 02 · Tus reglas */}
      <div>
        <SubHeader number="02" title="Tus reglas" description="Principios para moverte mejor" elementColor={elementColor} />
        <ol className="max-w-3xl">
          {principles.map((p) => (
            <li key={p.title} className="py-5 border-t border-ink/10 first:border-t-0">
              <div className="flex items-start gap-4 sm:gap-5">
                <div>
                  <p className="font-heading text-base sm:text-lg leading-[1.5] text-foreground">
                    {p.title}
                  </p>
                  <p className="text-sm sm:text-base text-muted leading-relaxed mt-2">{p.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 03 · Qué significa para ti ahora — síntesis editorial en el cuerpo
          tipográfico del perfil (sin tratamiento de cita). La narrativa de
          buildMomentState ya cruza ciclo + energía del día + elemento en una
          frase; acá la mostramos tal cual (determinístico, gratis) — la
          lectura interpretada por IA vive en 06, adentro del paywall. */}
      {momentState?.narrative && (
        <div>
          <SubHeader number="03" title="Qué significa para ti ahora" description="La síntesis de tu momento actual" elementColor={elementColor} />
          <p className="max-w-3xl text-base sm:text-lg text-foreground leading-relaxed">{momentState.narrative}</p>
        </div>
      )}

      {/* 04 · Tu timing + 05 · Tu evolución — lectura de instrumento: pareja
          compacta en mono, deliberadamente más terrenal que la interpretación
          que sigue después del paywall. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-8 max-w-4xl">
        <div>
          <SubHeader number="04" title="Tu timing" description="Momentos favorables según tu ciclo" elementColor={elementColor} />
          <p className="font-mono text-4xl sm:text-5xl" style={{ color: elementColor }}>
            {timing.timingScore}
            <span className="text-lg text-muted">/100</span>
          </p>
          <p className="text-sm text-foreground leading-relaxed mt-4">{timing.recommendedWindow}</p>
          <p className="text-sm text-muted leading-relaxed mt-2">{timing.explanation}</p>
          {timing.favorableDimensions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4" aria-hidden="true">
              {timing.favorableDimensions.map((d) => (
                <span key={d} className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1 border border-ink/10 text-foreground">
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <SubHeader number="05" title="Tu evolución" description="Cómo se conectan tus ciclos con tu camino" elementColor={elementColor} />
          <p className="font-mono text-4xl sm:text-5xl" style={{ color: elementColor }}>
            {dailyEnergy.personalYear}
          </p>
          <p className="text-sm text-muted mt-2">Año personal · {dailyEnergy.theme}</p>
          <div className="mt-6 space-y-3">
            {Object.entries(dailyEnergy.areas).map(([key, area]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted capitalize">{key === "relationships" ? "Relaciones" : key}</span>
                  <span className="font-mono text-xs text-foreground">{area.score}%</span>
                </div>
                <div className="h-px bg-ink/10 overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${area.score}%`,
                      backgroundColor: area.score >= 60 ? "var(--score-excellent)" : area.score >= 45 ? "var(--score-good)" : "var(--score-poor)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PREMIUM — la conversación entre las piezas. Un único hijo de PremiumGate
 * (no una lista de secciones sueltas) para que el clonado de `justUnlocked`
 * en PremiumGate llegue a MolinoInterpretation en vez de filtrarse a un
 * <div> del DOM.
 *
 * Deliberadamente NO se fragmenta la interpretación de personal_profile en
 * 5 mini-secciones "01 patrones interpretados / 02 reglas interpretadas /
 * ...": eso exigiría o (a) llamar a la IA una vez por sección — 5-6 llamadas
 * por carga, contra el rate-limit y el cost-tracking ya pensados para UNA
 * llamada — o (b) mostrar los mismos campos de una única respuesta dos
 * veces bajo títulos distintos. Ambas opciones violan "no duplicar" y "no
 * inventar" al mismo tiempo. En cambio: una sola lectura dominante (06) que
 * ya conecta patrón central, comportamiento, tensión real y timing en un
 * mismo párrafo — exactamente "la conversación entre las piezas", no una
 * descripción más de cada pieza por separado.
 */
function LecturaProfundaDesbloqueada({
  profile,
  pieces,
  justUnlocked = false,
}: {
  profile: UserProfile;
  pieces: { patterns: ReturnType<typeof buildPatterns>; rules: ReturnType<typeof buildRules>; tensions: ReturnType<typeof buildTensions>; dailyEnergy: ReturnType<typeof calculateDailyEnergy>; timing: ReturnType<typeof analyzeTiming> } | null;
  justUnlocked?: boolean;
}) {
  const [aiInterpretation, setAiInterpretation] = useState<MolinoInterpretationType | null>(null);

  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  const connections: ConnectionNode[] = pieces
    ? [
        ...pieces.patterns.map((p) => ({ kind: "Patrón", label: `${p.label}: ${p.keyword}` })),
        ...pieces.rules.slice(0, 1).map((r) => ({ kind: "Regla", label: r.rule })),
        ...pieces.tensions.map((t) => ({ kind: "Tensión", label: t.title })),
        { kind: "Ciclo", label: `Año personal ${pieces.dailyEnergy.personalYear} — ${pieces.dailyEnergy.theme}` },
      ]
    : [];

  return (
    <div className="pt-10 sm:pt-14 space-y-20 sm:space-y-28">
      {/* 06 · La conversación entre tus sistemas — la pieza dominante.
          Rompe el ritmo del resto de la lectura con una superficie tonal
          distinta (section-paper-alt, el mismo lenguaje que EditorialSection
          usa para marcar contraste) y un halo suave del color del elemento —
          el mismo motivo del hero de home, nunca decorativo puro: acá marca
          el punto donde termina la descripción y empieza la interpretación. */}
      <div className="relative -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 py-16 sm:py-20 section-paper-alt overflow-hidden">
        <div
          className="absolute -left-1/4 top-0 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-[0.08] -z-10 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${elementColor}, transparent 70%)` }}
          aria-hidden="true"
        />
        <SubHeader
          number="06"
          title="La conversación entre tus sistemas"
          description="Precisión sin falsa certeza — una interpretación, no un hecho"
          elementColor={elementColor}
        />
        <div className="max-w-2xl">
          <MolinoInterpretation
            profile={profile}
            type="personal_profile"
            dailyEnergy={pieces?.dailyEnergy}
            timing={pieces?.timing}
            label="Tu síntesis"
            description="La lectura que conecta tus números, tu cielo y tus ciclos en una sola conclusión"
            justUnlocked={justUnlocked}
            onInterpretationReady={setAiInterpretation}
          />
          {aiInterpretation && <Connections nodes={connections} />}
        </div>
      </div>

      {/* 07 · Preguntale a tu Molino */}
      <div>
        <SubHeader number="07" title="Preguntale a tu Molino" description="Una pregunta concreta sobre tu momento, tu perfil o una decisión" elementColor={elementColor} />
        <ChatWithMolino
          profile={profile}
          readingContext={
            aiInterpretation
              ? {
                  corePattern: aiInterpretation.corePattern
                    ? { what: aiInterpretation.corePattern.what, source: aiInterpretation.corePattern.source }
                    : undefined,
                  howYouOperate: aiInterpretation.howYouOperate,
                  closingSynthesis: aiInterpretation.closingSynthesis,
                  tensions: aiInterpretation.tensions?.length ? aiInterpretation.tensions : undefined,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}

export default function LecturaProfunda({ profile }: LecturaProfundaProps) {
  const lifePath = safeNumber(profile.lifePath, 1);
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const name = typeof profile.name === "string" ? profile.name : undefined;
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";

  const [pieces, setPieces] = useState<{
    patterns: ReturnType<typeof buildPatterns>;
    rules: ReturnType<typeof buildRules>;
    tensions: ReturnType<typeof buildTensions>;
    dailyEnergy: ReturnType<typeof calculateDailyEnergy>;
    timing: ReturnType<typeof analyzeTiming>;
  } | null>(null);

  // Preview gratuito: un único patrón ya calculado gratis (no un dato nuevo
  // inventado para el paywall) — mismo contrato que preview usa en
  // PremiumGate en el resto del sitio.
  const previewPattern = buildPatterns(profile)[0] ?? null;

  return (
    <EditorialSection
      as="h2"
      tone="paper"
      eyebrow="04 · La lectura profunda"
      title="La conversación entre tus sistemas"
      intro="Hasta ahora viste las piezas. Aquí aparece la conversación entre ellas — tu identidad, tus ciclos y tus patrones vistos como un solo sistema."
    >
      <div className="pt-10 sm:pt-14">
        {/* FREE — siempre visible, nunca detrás del paywall */}
        <PiezasLibres profile={profile} onData={setPieces} />

        {/* PREMIUM — la interpretación */}
        <div className="mt-20 sm:mt-28">
          <PremiumGate name={name} birthDate={birthDate} preview={{ lifePath, chineseZodiac, pattern: previewPattern }}>
            <LecturaProfundaDesbloqueada profile={profile} pieces={pieces} />
          </PremiumGate>
        </div>
      </div>
    </EditorialSection>
  );
}
