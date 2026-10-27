"use client";
import { useL } from "@/lib/i18n/useL";

import { useEffect, useState } from "react";
import type { UserProfile } from "@/types/user";
import {
  buildPatterns,
  buildTensions,
  buildRules,
  generatePaywallHook,
} from "@/lib/engines/synthesisEngine";
import { calculateDailyEnergy, getYearTheme, type DailyEnergyResult, type AreaScore } from "@/lib/engines/dailyEnergyEngine";
import { encodeProfileData } from "@/lib/utils/profileShare";
import { analyzeTiming } from "@/lib/engines/timingEngine";
import { loadTimingIntention } from "@/lib/session/timingIntention";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { safeNumber, getScoreLabel, getScoreColor } from "@/lib/utils/score";
import { Link } from "@/lib/i18n/navigation";
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
 *
 * Color fijo en accent — antes tomaba el color del elemento chino, que
 * DESIGN.md reserva para un punto de 8px junto al nombre del sistema, nunca
 * para un acento general. `elementDot` es ese punto: contexto de dónde sale
 * la lectura, sin pintar la sección entera con un color de sistema.
 */
function ChapterNumber({
  number,
  elementDot,
}: {
  number: string;
  elementDot?: { color: string; label: string };
}) {
  const L = useL();
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-sm text-accent label-caps" aria-hidden="true">
        {number}
      </span>
      <span className="h-px flex-1 bg-accent/15" aria-hidden="true" />
      {elementDot && (
        <span className="flex items-center gap-1.5 shrink-0">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: elementDot.color }}
            aria-hidden="true"
          />
          <span className="font-mono text-sm text-muted">{L.t(elementDot.label)}</span>
        </span>
      )}
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
 * addendum del patrón central en vez de un capítulo nuevo.
 */
function NumerosMaestros({ hits }: { hits: MasterNumberHit[] }) {
  const L = useL();
  if (hits.length === 0) return null;
  return (
    <div className="mt-10 pt-8 border-t border-ink/10">
      <p className="text-sm text-accent mb-1.5 label-caps">{L("✦ Tus números maestros", "✦ Your master numbers")}</p>
      <p className="text-sm text-muted mb-5 max-w-md">{L("11, 22 y 33 no se reducen como el resto de los números en numerología: se leen enteros, con un significado propio en cada posición de tu carta.", "11, 22 and 33 aren't reduced like the rest of the numbers in numerology: they're read whole, with a meaning of their own in each position of your chart.")}</p>
      <div className="space-y-6">
        {hits.map((hit) => (
          <div key={hit.position}>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display text-2xl sm:text-3xl text-accent">
                {hit.number}
              </span>
              <span className="text-sm text-muted label-caps">
                {L.t(MASTER_POSITION_LABELS_ES[hit.position])}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed max-w-2xl">
              {L.t(getMasterPositionMeaning(hit.number, hit.position))}
            </p>
          </div>
        ))}
      </div>
      <Link
        href="/guia/numeros-maestros"
        className="mt-6 inline-flex items-center gap-2 text-sm text-accent hover:underline underline-offset-4 label-caps"
      >{L("Profundizá en los números maestros →", "Go deeper into master numbers →")}</Link>
    </div>
  );
}

function PatronCentral({
  pattern,
  tension,
  masterNumbers,
  elementDot,
}: {
  pattern: { label: string; keyword: string; description: string; sources?: string[] };
  tension: { title: string; evidence: string } | null;
  masterNumbers: MasterNumberHit[];
  elementDot: { color: string; label: string };
}) {
  const L = useL();
  return (
    <div>
      <ChapterNumber number={L("01 · TU PATRÓN CENTRAL", "01 · YOUR CENTRAL PATTERN")} elementDot={elementDot} />
      <div className="max-w-3xl">
        {/* El motor — la pieza dominante */}
        <p className="text-sm text-muted mb-2 label-caps">
          {L.t(pattern.label)}
        </p>
        <p className="section-title text-accent mb-4">
          {L.t(pattern.keyword)}
        </p>
        <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-2xl">
          {L.t(pattern.description)}
        </p>

        {/* Tensión — el pliegue del patrón */}
        {tension && (
          <div className="mt-10 pt-8 border-t border-ink/10">
            <p className="text-sm text-muted mb-1 label-caps">{L("Tu tensión", "Your tension")}</p>
            <p className="text-sm text-muted mb-3 max-w-lg">{L("El patrón central no es parejo: acá está el punto donde tira para dos lados a la vez.", "The central pattern isn't even: here's the point where it pulls in two directions at once.")}</p>
            <p className="font-heading text-xl sm:text-2xl tracking-tight text-foreground mb-2">
              {L.t(tension.title)}
            </p>
            <p className="text-sm text-muted leading-relaxed">
              {L.t(tension.evidence)}
            </p>
          </div>
        )}

        {/* Patrones secundarios — evidencia, no nuevas piezas */}
        <div className="mt-6 text-sm text-muted leading-relaxed">{L(<>
          <span className="text-sm text-accent label-caps">Evidencias · </span>
          Este patrón se manifiesta desde tu carta natal y tu ciclo anual.
        </>, <><span className="text-sm text-accent label-caps">Evidence · </span>This pattern shows up in your birth chart and your yearly cycle.</>)}</div>

        <NumerosMaestros hits={masterNumbers} />
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
  elementDot,
}: {
  personalYear: number;
  yearTheme: string | null;
  dailyEnergy?: {
    areas: {
      work: AreaScore;
      relationships: AreaScore;
      creativity: AreaScore;
      decisions: AreaScore;
    };
  };
  elementDot: { color: string; label: string };
}) {
  const L = useL();
  const areas: {
    work: AreaScore;
    relationships: AreaScore;
    creativity: AreaScore;
    decisions: AreaScore;
  } = dailyEnergy?.areas ?? {
    work: { score: 0, label: "" },
    relationships: { score: 0, label: "" },
    creativity: { score: 0, label: "" },
    decisions: { score: 0, label: "" },
  };

  return (
    <div>
      <ChapterNumber number={L("02 · TU MOMENTO", "02 · YOUR MOMENT")} elementDot={elementDot} />
      <div className="max-w-2xl">
        <p className="font-display text-[clamp(3rem,8vw,5rem)] leading-[0.85] tracking-tight text-accent">
          {personalYear}
        </p>
        <p className="text-sm text-muted mt-2 label-caps">{L(<>
          Año personal · {L.t(yearTheme ?? "—")}
        </>, <>Personal year · {L.t(yearTheme ?? "—")}</>)}</p>
        <p className="mt-4 text-sm text-muted leading-relaxed max-w-md">{L("Tu año personal marca el clima de fondo de los próximos 12 meses. Sobre ese clima, cada día suma o resta energía en cuatro áreas — es lo que muestran las barras de abajo.", "Your personal year sets the background climate for the next 12 months. On top of that climate, each day adds or subtracts energy in four areas — that's what the bars below show.")}</p>

        {Object.keys(areas).length > 0 && (
          <div className="mt-8 border-t border-ink/10">
            {Object.entries(areas).map(([key, area]) => {
              const nombre =
                key === "relationships"
                  ? L("Relaciones", "Relationships")
                  : key === "work"
                    ? L("Trabajo", "Work")
                    : key === "creativity"
                      ? L("Creatividad", "Creativity")
                      : L("Decisiones", "Decisions");
              const barColor = getScoreColor(area.score);
              return (
                <div key={key} className="py-4 border-b border-ink/10">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <span className="text-sm text-muted label-caps">
                      {L.t(nombre)}
                    </span>
                    <span
                      className="font-heading text-sm font-bold shrink-0"
                      style={{ color: barColor }}
                    >
                      {L.t(getScoreLabel(area.score))}
                    </span>
                  </div>
                  {/* Barra: la misma cifra que separa "Favorable" de
                      "Neutro" en getScoreLabel, ahora visible en vez de
                      escondida detrás de la palabra. */}
                  <div
                    className="h-1.5 rounded-full bg-ink/8 overflow-hidden"
                    role="img"
                    aria-label={L(`${nombre}: ${getScoreLabel(area.score)}, ${area.score} de 100`, `${L.t(nombre)}: ${L.t(getScoreLabel(area.score))}, ${area.score} out of 100`)}
                  >
                    <div
                      className="h-full rounded-full transition-[width]"
                      style={{ width: `${Math.max(area.score, 4)}%`, backgroundColor: barColor }}
                    />
                  </div>
                  {/* Qué juega a favor — solo si hay algo verdadero que
                      decir. Antes un día sin factores mostraba "Sin
                      factores a favor hoy" al lado de la barra: leía como
                      una alarma que la barra ya no necesita. */}
                  {area.reasons && area.reasons.length > 0 && (
                    <p className="mt-1.5 font-mono text-sm text-accent">{L(<>
                      A favor: {L.t(area.reasons.map(L.t).join(" · "))}
                    </>, <>In favor: {L.t(area.reasons.map(L.t).join(" · "))}</>)}</p>
                  )}
                </div>
              );
            })}
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
  const L = useL();
  const [savedIntention, setSavedIntention] = useState<ReturnType<typeof loadTimingIntention>>(null);

  useEffect(() => {
    setSavedIntention(loadTimingIntention());
  }, []);

  const element = typeof profile.element === "string" ? profile.element : "";
  const elementDot = { color: ELEMENT_COLORS[element] || "var(--color-accent)", label: L(`Elemento ${element || "—"}`, `Element ${L.t(element || "—")}`) };

  const dailyEnergy = calculateDailyEnergy(profile);
  const patterns = buildPatterns(profile);
  const tensions = buildTensions(profile);
  const rules = buildRules(profile);
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
          elementDot={elementDot}
        />
      )}

      {/* 02 · Principios — movido a /lectura: es contenido de lectura, no
          de "cómo estoy configurado" (que es la pregunta de /profile). */}

      {/* 03 · Momento — evolución integrada */}
      <TuMomento
        personalYear={dailyEnergy.personalYear}
        yearTheme={getYearTheme(dailyEnergy.personalYear)}
        dailyEnergy={dailyEnergy}
        elementDot={elementDot}
      />
      {/* Puente hacia el gate */}
      {mainTension && (
        <div className="flex items-center gap-4 text-sm text-muted">{L(<>
          <span className="h-px flex-1 bg-ink/10" />
          <span>Más abajo: qué hacer cuando {L.t(mainTension.title.toLowerCase())}.</span>
          <span className="h-px flex-1 bg-ink/10" />
        </>, <><span className="h-px flex-1 bg-ink/10" /><span>Further down: what to do when {L.t(mainTension.title.toLowerCase())}.</span><span className="h-px flex-1 bg-ink/10" /></>)}</div>
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
  const L = useL();
  const [open, setOpen] = useState(false);
  if (nodes.length === 0) return null;
  return (
    <div className="mt-8 pt-6 border-t border-ink/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="text-sm text-accent hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent label-caps"
      >
        {L.t(open ? L("Ocultar conexiones", "Hide connections") : L("Ver conexiones", "Show connections"))}
      </button>
      {open && (
        <div className="mt-5">
          <p className="text-sm text-muted mb-4">{L("Esta lectura conecta:", "This reading connects:")}</p>
          <ol className="relative border-l border-ink/15 pl-6 space-y-5">
            {nodes.map((n) => (
              <li key={`${n.kind}-${n.label}`} className="relative">
                <span
                  className="absolute -left-[1.6rem] top-1 w-2 h-2 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <p className="text-sm text-accent/80 label-caps">{L.t(n.kind)}</p>
                <p className="text-sm text-foreground/90 leading-relaxed mt-1">{L.t(n.label)}</p>
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
  const L = useL();
  const [aiInterpretation, setAiInterpretation] = useState<MolinoInterpretationType | null>(null);

  const element = typeof profile.element === "string" ? profile.element : "";
  const elementDot = { color: ELEMENT_COLORS[element] || "var(--color-accent)", label: L(`Elemento ${element || "—"}`, `Element ${L.t(element || "—")}`) };

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
        { kind: "Ciclo", label: L(`Año personal ${pieces.dailyEnergy.personalYear} — ${getYearTheme(pieces.dailyEnergy.personalYear)}`, `Personal year ${pieces.dailyEnergy.personalYear} — ${L.t(getYearTheme(pieces.dailyEnergy.personalYear))}`) },
      ]
    : [];

  return (
    <div className="space-y-20 sm:space-y-24">
      {/* 03 · Ciclos anuales — deterministic, extiende "02 · TU MOMENTO" hacia adelante */}
      <div>
        <ChapterNumber number={L("03 · CICLOS ANUALES", "03 · ANNUAL CYCLES")} elementDot={elementDot} />
        <AnnualCyclesPreview profile={profile} />
      </div>

      {/* 05 · La Lectura — vive en su propia pestaña (app/lectura), no
          embebida acá. Si se acaba de desbloquear (pago/cupón), ya se abrió
          sola vía useCommitPremiumUnlock; este bloque es tanto el respaldo
          si el navegador bloqueó ese popup como el punto de reingreso para
          quien vuelve otro día y ya es premium (justUnlocked=false). */}
      <div className="relative -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 py-16 sm:py-20 section-paper-alt overflow-hidden">
        <h3 className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground leading-snug mb-2">{L("La Lectura", "The Reading")}</h3>
        <p className="text-sm text-muted mb-8 max-w-xl leading-relaxed">{L(<>
          La conversación entre tus sistemas, en su propio espacio — con tus mayores afinidades de países, ciudades y marcas.
          {L.t(justUnlocked && " Se abrió en una pestaña nueva.")}
        </>, <>The conversation between your systems, in its own space — with your strongest affinities among countries, cities and brands.{L.t(justUnlocked && " It opened in a new tab.")}</>)}</p>
        <a
          href={`/lectura#${encodeProfileData(profile)}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-heading text-sm font-bold hover:bg-accent-hover transition-colors label-caps"
        >{L("Abrir mi lectura →", "Open my reading →")}</a>
        <div className="max-w-2xl">
          {aiInterpretation && <Connections nodes={connections} />}
        </div>
      </div>

      {/* 05 · Preguntale a tu Molino */}
      <div>
        <ChapterNumber number={L("04 · PREGUNTALE A TU MAPA", "04 · ASK YOUR MAP")} elementDot={elementDot} />
        <h3 className="font-heading text-xl sm:text-2xl tracking-tight text-foreground leading-snug max-w-xl">{L("Ya conocés tu mapa. Ahora podés preguntarle qué significa.", "You already know your map. Now you can ask it what it means.")}</h3>
        <p className="text-sm text-muted mt-3 max-w-xl leading-relaxed">{L("Una pregunta concreta sobre tu momento, tu dirección o lo que estás sintiendo.", "A specific question about your moment, your direction or what you're feeling.")}</p>
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
        <div className="mt-8 pt-6 border-t border-ink/10 flex flex-col sm:flex-row gap-x-8 gap-y-3">{L(<>
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-accent hover:underline"
          >
            ¿Querés registrar cómo te sentís con esta lectura? Anotar en mi Journal →
          </Link>
          <Link
            href="/hoy"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-muted hover:text-accent transition-colors"
          >
            Tu mapa también tiene ritmo diario — ver tu energía de hoy →
          </Link>
        </>, <><Link href="/journal" className="inline-flex items-center gap-1.5 text-sm font-mono text-accent hover:underline">Want to note how you feel about this reading? Write in my Journal →</Link><Link href="/hoy" className="inline-flex items-center gap-1.5 text-sm font-mono text-muted hover:text-accent transition-colors">Your map also has a daily rhythm — see your energy today →</Link></>)}</div>
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
 * Movimientos 01→02, siempre gratis. Se renderiza cerca del hero para que
 * la lectura arranque sin interrupciones de paywall en el medio.
 */
export function LecturaLibre({
  profile,
  onData,
}: {
  profile: UserProfile;
  onData: (data: LecturaPieces) => void;
}) {
  const L = useL();
  return (
    <EditorialSection
      as="h2"
      tone="paper"
      eyebrow={L("Capítulo IV · Tu lectura", "Chapter IV · Your reading")}
      title={L("Leer tu mapa en dos movimientos", "Reading your map in two movements")}
      intro={L("Hasta ahora viste las piezas por separado. Esta es la conversación — tu identidad y tu momento vistos como un solo sistema. Los principios que las ordenan están en la lectura completa.", "So far you've seen the pieces separately. This is the conversation — your identity and your moment seen as a single system. The principles that order them are in the complete reading.")}
    >
      <div className="pt-10 sm:pt-14">
        <PiezasLibres profile={profile} onData={onData} />
      </div>
    </EditorialSection>
  );
}

/**
 * Movimientos 03→04, premium. Se ubica después de las decisiones y la
 * sincronicidad, como cierre de la lectura — no interrumpiendo el flujo
 * gratuito de "dos movimientos".
 */
export function LecturaPremium({
  profile,
  pieces,
}: {
  profile: UserProfile;
  pieces: LecturaPieces | null;
}) {
  const L = useL();
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
      eyebrow={L("TU MAPA", "YOUR MAP")}
      title={L("Profundizá tu lectura", "Go deeper into your reading")}
      intro={L("La síntesis entre tus sistemas y una conversación abierta con tu mapa.", "The synthesis between your systems and an open conversation with your map.")}
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
