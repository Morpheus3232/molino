"use client";

import { useEffect, useState } from "react";
import type { UserProfile } from "@/types/user";
import {
  buildPatterns,
  buildTensions,
  buildRules,
  buildPrinciples,
  generatePaywallHook,
} from "@/lib/engines/synthesisEngine";
import { calculateDailyEnergy, getYearTheme, type DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import { analyzeTiming } from "@/lib/engines/timingEngine";
import { loadTimingIntention } from "@/lib/session/timingIntention";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { safeNumber, getScoreLabel, getScoreColor } from "@/lib/utils/score";
import Link from "next/link";
import {
  getMasterNumbers,
  getMasterPositionMeaning,
  MASTER_POSITION_LABELS_ES,
  type MasterNumberHit,
} from "@/lib/engines/numerologyEngine";
import PremiumGate from "@/components/profile/PremiumGate";
import type { MolinoInterpretation as MolinoInterpretationType } from "@/lib/engines/intelligenceEngine";
import ChatWithMolino from "@/components/profile/ChatWithMolino";
import AnnualCyclesPreview from "@/components/profile/AnnualCyclesPreview";
import EditorialSection from "@/components/ui/EditorialSection";


/**
 * Número de capítulo + regla fina. Sin borde, sin glow: solo texto y
 * una línea de 32px que marca el nivel sin ocupar espacio.
 */
function ChapterNumber({ number, color }: { number: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-6" aria-hidden="true">
      <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color }}>
        {number}
      </span>
      <span className="h-px flex-1" style={{ backgroundColor: color, opacity: 0.15 }} />
    </div>
  );
}

/**
 * Patrón central — narrativa de una sola pieza.
 * Primer patrón como ancla, tensión como conflicto.
 */
/**
 * Números maestros — contenido 100% determinista (getMasterNumbers no
 * llama IA ni depende de premium), así que vive en la zona gratis, como
 * addendum del patrón central en vez de un capítulo nuevo — evita
 * renumerar los capítulos 02-06 por un agregado cosmético.
 */
function NumerosMaestros({ hits, elementColor }: { hits: MasterNumberHit[]; elementColor: string }) {
  if (hits.length === 0) return null;
  return (
    <div className="mt-10 pt-8 border-t border-ink/10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-5">
        ✦ Tus números maestros
      </p>
      <div className="space-y-6">
        {hits.map((hit) => (
          <div key={hit.position}>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-heading text-2xl sm:text-3xl" style={{ color: elementColor }}>
                {hit.number}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {MASTER_POSITION_LABELS_ES[hit.position]}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed max-w-2xl">
              {getMasterPositionMeaning(hit.number, hit.position)}
            </p>
          </div>
        ))}
      </div>
      <Link
        href="/guia/numeros-maestros"
        className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:underline underline-offset-4"
      >
        Profundizá en los números maestros →
      </Link>
    </div>
  );
}

function PatronCentral({
  pattern,
  tension,
  masterNumbers,
  elementColor,
}: {
  pattern: { label: string; keyword: string; description: string; sources?: string[] };
  tension: { title: string; evidence: string } | null;
  masterNumbers: MasterNumberHit[];
  elementColor: string;
}) {
  return (
    <div>
      <ChapterNumber number="01 · TU PATRÓN CENTRAL" color={elementColor} />
      <div className="max-w-3xl">
        {/* El motor — la pieza dominante */}
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">
          {pattern.label}
        </p>
        <p className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[0.88] tracking-tight text-foreground uppercase mb-4" style={{ color: elementColor }}>
          {pattern.keyword}
        </p>
        <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-2xl">
          {pattern.description}
        </p>

        {/* Tensión — el pliegue del patrón */}
        {tension && (
          <div className="mt-10 pt-8 border-t border-ink/10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">Tu tensión</p>
            <p className="font-heading text-xl sm:text-2xl tracking-tight text-foreground mb-2">
              {tension.title}
            </p>
            <p className="text-sm text-muted leading-relaxed">
              {tension.evidence}
            </p>
          </div>
        )}

        {/* Patrones secundarios — evidencia, no nuevas piezas */}
        <div className="mt-6 text-xs text-muted leading-relaxed">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Evidencias · </span>
          Este patrón se manifiesta desde tu carta natal y tu ciclo anual.
        </div>

        <NumerosMaestros hits={masterNumbers} elementColor={elementColor} />
      </div>
    </div>
  );
}

/**
 * Reglas personales — principios numerados, sin caja, sin borde por ítem.
 */
function Principios({
  principles,
  elementColor,
}: {
  principles: { title: string; body: string }[];
  elementColor: string;
}) {
  if (principles.length === 0) return null;
  return (
    <div>
      <ChapterNumber number="02 · TUS PRINCIPIOS" color={elementColor} />
      <div className="max-w-2xl space-y-8">
        {principles.map((p, i) => (
          <div key={p.title} className="flex items-start gap-5">
            <span className="font-mono text-xs text-muted leading-[1.7] shrink-0 w-5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-heading text-base sm:text-lg text-foreground leading-snug">
                {p.title}
              </p>
              <p className="text-sm text-muted leading-relaxed mt-1.5">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Evolución — tu momento ahora, conectado al patrón.
 */
function TuMomento({
  personalYear,
  yearTheme,
  dailyEnergy,
  elementColor,
}: {
  personalYear: number;
  yearTheme: string | null;
  dailyEnergy?: {
    areas: {
      work: { score: number; label: string };
      relationships: { score: number; label: string };
      creativity: { score: number; label: string };
      decisions: { score: number; label: string };
    };
  };
  elementColor: string;
}) {
  const areas: {
    work: { score: number; label: string };
    relationships: { score: number; label: string };
    creativity: { score: number; label: string };
    decisions: { score: number; label: string };
  } = dailyEnergy?.areas ?? {
    work: { score: 0, label: "" },
    relationships: { score: 0, label: "" },
    creativity: { score: 0, label: "" },
    decisions: { score: 0, label: "" },
  };

  return (
    <div>
      <ChapterNumber number="03 · TU MOMENTO" color={elementColor} />
      <div className="max-w-2xl">
        <p className="font-display text-[clamp(3rem,8vw,5rem)] leading-[0.85] tracking-tight" style={{ color: elementColor }}>
          {personalYear}
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mt-2">
          Año personal · {yearTheme ?? "—"}
        </p>

        {Object.keys(areas).length > 0 && (
          <div className="mt-8 space-y-4">
            {Object.entries(areas).map(([key, area]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-muted capitalize">
                    {key === "relationships" ? "Relaciones" : key === "work" ? "Trabajo" : key === "creativity" ? "Creatividad" : key === "decisions" ? "Decisiones" : key}
                  </span>
                  <span className="font-mono text-xs" style={{ color: getScoreColor(area.score) }}>
                    {getScoreLabel(area.score)}
                  </span>
                </div>
                <div className="h-px bg-ink/10 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${area.score}%`,
                      backgroundColor: getScoreColor(area.score),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * FREE — piezas de lectura gratuita. Todas las piezas se calculan
 * con engines determinísticos. Nunca se oculta contenido para forzar paywall.
 */
function PiezasLibres({
  profile,
  onData,
}: {
  profile: UserProfile;
  onData: (data: {
    patterns: ReturnType<typeof buildPatterns>;
    rules: ReturnType<typeof buildRules>;
    tensions: ReturnType<typeof buildTensions>;
    dailyEnergy: ReturnType<typeof calculateDailyEnergy>;
    timing: ReturnType<typeof analyzeTiming>;
  }) => void;
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
  const timing = analyzeTiming(profile, new Date(), savedIntention || "start_project");
  const masterNumbers = getMasterNumbers(profile);

  useEffect(() => {
    onData({ patterns, rules, tensions, dailyEnergy, timing });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, savedIntention]);

  const mainPattern = patterns[0] ?? null;
  const mainTension = tensions[0] ?? null;

  return (
    <div className="space-y-20 sm:space-y-24">
      {/* 01 · Patrón central + tensión */}
      {mainPattern && (
        <PatronCentral
          pattern={mainPattern}
          tension={mainTension}
          masterNumbers={masterNumbers}
          elementColor={elementColor}
        />
      )}

      {/* 02 · Principios */}
      {principles.length > 0 && (
        <Principios principles={principles} elementColor={elementColor} />
      )}

      {/* 03 · Momento — evolución integrada */}
      <TuMomento
        personalYear={dailyEnergy.personalYear}
        yearTheme={getYearTheme(dailyEnergy.personalYear)}
        dailyEnergy={dailyEnergy}
        elementColor={elementColor}
      />
      {/* Puente hacia el gate */}
      {mainTension && (
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="h-px flex-1 bg-ink/10" />
          <span>Más abajo: qué hacer cuando {mainTension.title.toLowerCase()}.</span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>
      )}
    </div>
  );
}

/**
 * Conexiones — trazabilidad de la lectura premium.
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
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent/80">{n.kind}</p>
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
 * PREMIUM — interpretación y chat.
 */
function LecturaProfundaDesbloqueada({
  profile,
  pieces,
  justUnlocked = false,
}: {
  profile: UserProfile;
  pieces: {
    patterns: ReturnType<typeof buildPatterns>;
    rules: ReturnType<typeof buildRules>;
    tensions: ReturnType<typeof buildTensions>;
    dailyEnergy: ReturnType<typeof calculateDailyEnergy>;
    timing: ReturnType<typeof analyzeTiming>;
  } | null;
  justUnlocked?: boolean;
}) {
  const [aiInterpretation, setAiInterpretation] = useState<MolinoInterpretationType | null>(null);

  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  // La Lectura en sí vive en su propia pestaña (app/lectura) — esta llamada
  // acá es silenciosa, solo para alimentar el trazado "Esta lectura conecta"
  // de abajo y el contexto del chat (ChatWithMolino), sin repetir la UI de
  // MolinoInterpretation. Pega contra el mismo cache server-side por
  // profileHash+type+prompt que /lectura, así que no duplica costo de IA.
  useEffect(() => {
    let cancelled = false;
    import("@/lib/profile-salt").then(({ getProfileSalt }) =>
      import("@/lib/premium").then(({ getPremiumTokenClient }) =>
        fetch("/api/intelligence/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            dob: profile.birthDate,
            salt: getProfileSalt(),
            type: "personal_profile",
            premiumToken: getPremiumTokenClient(),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (cancelled) return;
            const interpretation = (data.ai ?? data.fallback) as MolinoInterpretationType | undefined;
            if (interpretation) setAiInterpretation(interpretation);
          })
          .catch(() => {})
      )
    );
    return () => {
      cancelled = true;
    };
  }, [profile.birthDate, profile.name]);

  const connections: ConnectionNode[] = pieces
    ? [
        ...pieces.patterns.map((p) => ({ kind: "Patrón", label: `${p.label}: ${p.keyword}` })),
        ...pieces.rules.slice(0, 1).map((r) => ({ kind: "Regla", label: r.rule })),
        ...pieces.tensions.map((t) => ({ kind: "Tensión", label: t.title })),
        { kind: "Ciclo", label: `Año personal ${pieces.dailyEnergy.personalYear} — ${getYearTheme(pieces.dailyEnergy.personalYear)}` },
      ]
    : [];

  return (
    <div className="space-y-20 sm:space-y-24">
      {/* 04 · Ciclos anuales — deterministic, extiende "03 · TU MOMENTO" hacia adelante */}
      <div>
        <ChapterNumber number="04 · CICLOS ANUALES" color={elementColor} />
        <AnnualCyclesPreview profile={profile} />
      </div>

      {/* 05 · La Lectura — vive en su propia pestaña (app/lectura), no
          embebida acá. Si se acaba de desbloquear (pago/cupón), ya se abrió
          sola vía useCommitPremiumUnlock; este bloque es tanto el respaldo
          si el navegador bloqueó ese popup como el punto de reingreso para
          quien vuelve otro día y ya es premium (justUnlocked=false). */}
      <div className="relative -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 py-16 sm:py-20 section-paper-alt overflow-hidden">
        <h3 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground leading-snug mb-2">
          La Lectura
        </h3>
        <p className="text-sm text-muted mb-8 max-w-xl leading-relaxed">
          La conversación entre tus sistemas, en su propio espacio — con tus mayores afinidades de países, ciudades y marcas.
          {justUnlocked && " Se abrió en una pestaña nueva."}
        </p>
        <a
          href={`/lectura?dob=${encodeURIComponent(profile.birthDate)}${profile.name ? `&name=${encodeURIComponent(profile.name)}` : ""}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-heading text-xs uppercase tracking-wider font-bold hover:bg-accent-hover transition-colors"
        >
          Abrir mi lectura →
        </a>
        <div className="max-w-2xl">
          {aiInterpretation && <Connections nodes={connections} />}
        </div>
      </div>

      {/* 05 · Preguntale a tu Molino */}
      <div>
        <ChapterNumber number="06 · PREGUNTALE A TU MAPA" color={elementColor} />
        <h3 className="font-heading text-xl sm:text-2xl tracking-tight text-foreground leading-snug max-w-xl">
          Ya conocés tu mapa. Ahora podés preguntarle qué significa.
        </h3>
        <p className="text-sm text-muted mt-3 max-w-xl leading-relaxed">
          Una pregunta concreta sobre tu momento, tu dirección o lo que estás sintiendo.
        </p>
        <div className="mt-8">
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
        <div className="mt-8 pt-6 border-t border-ink/10 flex flex-col sm:flex-row gap-x-8 gap-y-3">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
          >
            ¿Querés registrar cómo te sentís con esta lectura? Anotar en mi Journal →
          </Link>
          <Link
            href="/hoy"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            Tu mapa también tiene ritmo diario — ver tu energía de hoy →
          </Link>
        </div>
      </div>
    </div>
  );
}

export interface LecturaPieces {
  patterns: ReturnType<typeof buildPatterns>;
  rules: ReturnType<typeof buildRules>;
  tensions: ReturnType<typeof buildTensions>;
  dailyEnergy: ReturnType<typeof calculateDailyEnergy>;
  timing: ReturnType<typeof analyzeTiming>;
}

/**
 * Movimientos 01→03, siempre gratis. Se renderiza cerca del hero para que
 * la lectura arranque sin interrupciones de paywall en el medio.
 */
export function LecturaLibre({
  profile,
  onData,
}: {
  profile: UserProfile;
  onData: (data: LecturaPieces) => void;
}) {
  return (
    <EditorialSection
      as="h2"
      tone="paperAlt"
      eyebrow="TU MAPA"
      title={<>LEER TU MAPA<br />EN TRES MOVIMIENTOS.</>}
      intro="Hasta ahora viste las piezas por separado. Esta es la conversación — tu identidad, tus patrones y tu momento vistos como un solo sistema."
    >
      <div className="pt-10 sm:pt-14">
        <PiezasLibres profile={profile} onData={onData} />
      </div>
    </EditorialSection>
  );
}

/**
 * Movimientos 04→06, premium. Se ubica después de las decisiones y la
 * sincronicidad, como cierre de la lectura — no interrumpiendo el flujo
 * gratuito de "tres movimientos".
 */
export function LecturaPremium({
  profile,
  pieces,
}: {
  profile: UserProfile;
  pieces: LecturaPieces | null;
}) {
  const lifePath = safeNumber(profile.lifePath, 1);
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const name = typeof profile.name === "string" ? profile.name : undefined;
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";

  const previewPattern = buildPatterns(profile)[0] ?? null;
  const previewTension = buildTensions(profile)[0] ?? null;
  const hook = generatePaywallHook(profile);

  return (
    <EditorialSection
      as="h2"
      tone="paper"
      eyebrow="TU MAPA"
      title={<>PROFUNDIZÁ<br />TU LECTURA.</>}
      intro="La síntesis entre tus sistemas y una conversación abierta con tu mapa."
    >
      <div className="pt-10 sm:pt-14">
        <PremiumGate name={name} birthDate={birthDate} preview={{ lifePath, chineseZodiac, pattern: previewPattern, tension: previewTension, hook }}>
          <LecturaProfundaDesbloqueada profile={profile} pieces={pieces} />
        </PremiumGate>
      </div>
    </EditorialSection>
  );
}

export default function LecturaProfunda({ profile }: { profile: UserProfile }) {
  const [pieces, setPieces] = useState<LecturaPieces | null>(null);

  return (
    <>
      <LecturaLibre profile={profile} onData={setPieces} />
      <LecturaPremium profile={profile} pieces={pieces} />
    </>
  );
}
