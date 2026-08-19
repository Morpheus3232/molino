import type { UserProfile } from '@/types/user';
import { buildPatterns, buildTensions, type PatternInsight, type TensionInsight, findSharedTheme, themeOfPhrase } from './synthesisEngine';
import { analyzeDecision, type DecisionResult } from './decisionsEngine';
import { analyzeTiming, type TimingResult } from './timingEngine';
import { calculateDailyEnergy, type DailyEnergyResult } from './dailyEnergyEngine';
import { calculateCompatibility, type CompatibilityResult } from './compatibilityEngine';
import { buildMolinoContext } from './intelligenceEngine';

export type NudoContext = 'decision' | 'timing' | 'daily_energy' | 'compatibility' | 'free_text';

export interface NudoInput {
  profile: UserProfile;
  context: NudoContext;
  payload: unknown;
}

export interface NudoResult {
  fuerzaA: string;
  fuerzaB: string;
  tension: string;
  preguntaLlave: string;
  trace: {
    sources: string[];
    hasRealTension: boolean;
  };
}

interface NudoSignals {
  stablePatterns: PatternInsight[];
  stableTensions: TensionInsight[];
  currentSignal: unknown;
}

function getStableSignals(profile: UserProfile): NudoSignals {
  const patterns = buildPatterns(profile);
  const tensions = buildTensions(profile);
  return {
    stablePatterns: patterns,
    stableTensions: tensions,
    currentSignal: null,
  };
}

/**
 * Umbral de fricción del contexto: 50 es el score neutro que cada engine
 * declara como propio punto de partida (`let score = 50` en decisionsEngine
 * y dailyEnergyEngine) — no es un número inventado para nudoEngine, es el
 * cero-relativo que los engines ya usan para distinguir "favorable" de
 * "desfavorable". Un contexto por debajo de eso es, según el propio engine,
 * una señal de fricción real.
 */
const CONTEXT_FRICTION_THRESHOLD = 50;

const CONTEXT_ENGINE_LABEL: Record<NudoContext, string> = {
  decision: 'decisionsEngine',
  timing: 'timingEngine',
  daily_energy: 'dailyEnergyEngine',
  compatibility: 'compatibilityEngine',
  free_text: 'intelligenceEngine',
};

/**
 * Extrae el score ya calculado por el engine del contexto actual, usando el
 * campo que cada engine expone para eso. `free_text` no tiene score escalar
 * (intelligenceEngine sólo arma contexto, no evalúa favorabilidad) — por eso
 * nunca puede confirmar fricción, y eso es correcto: no hay señal real que
 * cruzar.
 */
function getContextScore(context: NudoContext, currentSignal: unknown): number | null {
  if (!currentSignal || typeof currentSignal !== 'object') return null;
  const signal = currentSignal as Record<string, unknown>;
  switch (context) {
    case 'decision':
    case 'daily_energy':
      return typeof signal.overallScore === 'number' ? signal.overallScore : null;
    case 'timing':
      return typeof signal.timingScore === 'number' ? signal.timingScore : null;
    case 'compatibility': {
      const scores = signal.scores as { overall?: number } | undefined;
      return typeof scores?.overall === 'number' ? scores.overall : null;
    }
    case 'free_text':
    default:
      return null;
  }
}

function getCurrentSignal(profile: UserProfile, context: NudoContext, payload: unknown): unknown {
  switch (context) {
    case 'decision': {
      const { question, category } = payload as { question: string; category: string };
      return analyzeDecision(profile, question, category as any);
    }
    case 'timing': {
      const { targetDate, intention } = payload as { targetDate: Date; intention: string };
      return analyzeTiming(profile, targetDate, intention as any);
    }
    case 'daily_energy': {
      const { targetDate } = payload as { targetDate?: Date };
      return calculateDailyEnergy(profile, targetDate || new Date());
    }
    case 'compatibility': {
      const { target } = payload as { target: any };
      return calculateCompatibility(profile, target);
    }
    case 'free_text': {
      const context = buildMolinoContext(profile);
      return context;
    }
    default:
      return null;
  }
}

function detectRealTension(
  context: NudoContext,
  stablePatterns: PatternInsight[],
  stableTensions: TensionInsight[],
  currentSignal: unknown
): { hasRealTension: boolean; fuerzaA: string; fuerzaB: string; tension: string; preguntaLlave: string; sources: string[] } {
  const allSources = new Set<string>();

  for (const p of stablePatterns) {
    p.sources.forEach(s => allSources.add(s));
  }
  for (const t of stableTensions) {
    t.sources.forEach(s => allSources.add(s));
  }

  // El patrón estable por sí solo no alcanza: el Nudo tiene que surgir del
  // cruce entre ese patrón y el contexto actual. Si el engine del contexto
  // no reporta fricción real (score por debajo de su propio umbral neutro),
  // el contexto no modificó nada — no hay Nudo, aunque el patrón estable exista.
  const contextScore = getContextScore(context, currentSignal);
  const contextConfirmsFriction = contextScore !== null && contextScore < CONTEXT_FRICTION_THRESHOLD;
  const contextSource = CONTEXT_ENGINE_LABEL[context];

  if (stableTensions.length > 0 && contextConfirmsFriction) {
    const t = stableTensions[0];
    return {
      hasRealTension: true,
      fuerzaA: t.evidence.split('pero')[0]?.trim() || 'Impulso natural',
      fuerzaB: t.evidence.split('pero')[1]?.trim() || 'Fuerza contraria',
      tension: t.title,
      preguntaLlave: `¿Qué información te da ese desfasaje entre ${t.evidence.split('pero')[0]?.toLowerCase() || 'tu impulso'} y ${t.evidence.split('pero')[1]?.toLowerCase() || 'lo que pide tu elemento'}?`,
      sources: [...Array.from(allSources), contextSource],
    };
  }

  const motorPattern = stablePatterns.find(p => p.label === 'Tu motor');
  const tensionPattern = stablePatterns.find(p => p.label === 'Tu tensión');
  const movementPattern = stablePatterns.find(p => p.label === 'Tu próximo movimiento');

  // Check if motor and tension share the same underlying theme
  // If they do, it's not a real tension - it's the same energy expressed differently
  if (motorPattern && tensionPattern && motorPattern.sources.length > 1 && tensionPattern.sources.length > 1 && contextConfirmsFriction) {
    const motorTheme = motorPattern.keyword;
    const tensionTheme = tensionPattern.keyword;

    // Use the synthesisEngine's theme detection to see if they're actually the same theme
    const sharedTheme = findSharedTheme([motorTheme], [tensionTheme]);

    if (!sharedTheme && motorTheme !== tensionTheme) {
      return {
        hasRealTension: true,
        fuerzaA: `Tu motor: ${motorTheme}`,
        fuerzaB: `Tu tensión: ${tensionTheme}`,
        tension: `Tu energía natural te empuja hacia ${motorTheme.toLowerCase()}, pero tu desafío actual amplifica ${tensionTheme.toLowerCase()}. Dos sistemas independientes señalan direcciones distintas.`,
        preguntaLlave: `Cuando sentís ese tironeo entre ${motorTheme.toLowerCase()} y ${tensionTheme.toLowerCase()}, ¿qué elegís alimentar?`,
        sources: [...Array.from(allSources), contextSource],
      };
    }
  }

  if (motorPattern && movementPattern && motorPattern.sources.length > 1 && movementPattern.sources.length > 1 && contextConfirmsFriction) {
    const motorTheme = motorPattern.keyword;
    const movementTheme = movementPattern.keyword;

    // Check if they share the same underlying theme before declaring tension
    const sharedTheme = findSharedTheme([motorTheme], [movementTheme]);
    if (!sharedTheme && motorTheme !== movementTheme) {
      return {
        hasRealTension: true,
        fuerzaA: `Tu motor: ${motorTheme}`,
        fuerzaB: `Tu momento: ${movementTheme}`,
        tension: `Tu impulso natural (${motorTheme.toLowerCase()}) y tu ciclo actual (${movementTheme.toLowerCase()}) no están alineados. Tu naturaleza y tu momento tiran en direcciones distintas.`,
        preguntaLlave: `¿Este momento pide que sigas tu motor o que te adaptes al ciclo?`,
        sources: [...Array.from(allSources), contextSource],
      };
    }
  }

  if (contextConfirmsFriction) {
    return {
      hasRealTension: true,
      fuerzaA: 'Necesidad de actuar',
      fuerzaB: 'Condiciones desfavorables',
      tension: `Tu intención de avanzar choca con un momento que no la acompaña (score: ${contextScore}/100).`,
      preguntaLlave: '¿Es mejor esperar una ventana más favorable o avanzar con la fricción actual?',
      sources: [...Array.from(allSources), contextSource],
    };
  }

  return {
    hasRealTension: false,
    fuerzaA: '',
    fuerzaB: '',
    tension: '',
    preguntaLlave: '',
    sources: [],
  };
}

export function detectarNudo(input: NudoInput): NudoResult {
  const { profile, context, payload } = input;

  const { stablePatterns, stableTensions } = getStableSignals(profile);
  const currentSignal = getCurrentSignal(profile, context, payload);

  const { hasRealTension, fuerzaA, fuerzaB, tension, preguntaLlave, sources } = detectRealTension(
    context,
    stablePatterns,
    stableTensions,
    currentSignal
  );

  return {
    fuerzaA,
    fuerzaB,
    tension,
    preguntaLlave,
    trace: {
      sources,
      hasRealTension,
    },
  };
}