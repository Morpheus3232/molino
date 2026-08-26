/**
 * Engine Registry — Strategy Pattern.
 *
 * A single `Map<EngineKind, Engine>` that dispatches deterministic profile
 * computations by kind, replacing ad-hoc `if/else` chains. Each engine is an
 * isolated strategy: same kind always maps to the same pure function, so
 * callers pick the engine they need with one lookup instead of branching.
 *
 * IMPORTANT (separación de responsabilidades): this module lives on the
 * server side. The engines it imports are deterministic, pure modules — they
 * must never be imported from client components directly. Only API routes and
 * Server Components should consume this registry (see RESTRICCIONES
 * INQUEBRANTABLES in the project philosophy).
 */

import type { UserProfile } from '@/types/user';
import { calculateUserProfile } from './profileBuilder';
import { calculateCompatibility, type CompatibilityResult } from './compatibilityEngine';
import { calculateDailyEnergy, type DailyEnergyResult } from './dailyEnergyEngine';
import { analyzeTiming, type TimingResult } from './timingEngine';
import { analyzeDecision, type DecisionResult, type DecisionCategory } from './decisionsEngine';
import { buildConvergence, type Convergence } from './convergentEngine';
import { buildPersonalCode, buildPatterns, buildTensions, buildRules, type PersonalCode, type PatternInsight, type TensionInsight, type RuleInsight } from './synthesisEngine';
import { calculateLifePath, calculateExpressionNumber } from './numerologyEngine';
import { getSunSign, getSunSignInfo, getMoonSign, getElement, getModality } from './astrologyEngine';
import { getChineseZodiac, getChineseZodiacInfo } from './chineseZodiacEngine';
import type { TimingIntention } from './timingEngine';

/**
 * Kinds of deterministic computation the registry can dispatch.
 */
export type EngineKind =
  | 'profile'
  | 'numerology'
  | 'astrology'
  | 'chinese_zodiac'
  | 'compatibility'
  | 'daily_energy'
  | 'timing'
  | 'decision'
  | 'convergence'
  | 'synthesis_code'
  | 'synthesis_patterns'
  | 'synthesis_tensions'
  | 'synthesis_rules'
  | 'synthesis_dimensions';

/**
 * A generic engine contract. `compute` is the pure strategy body; engines
 * with no meaningful computation (markers for enum completeness) use `null`.
 */
interface Engine {
  readonly kind: EngineKind;
  readonly label: string;
  readonly compute: ((input: unknown) => unknown) | null;
}

/** Deterministic profile builder — the root engine all others derive from. */
const profileEngine: Engine = {
  kind: 'profile',
  label: 'Perfil completo',
  compute: (input) => {
    const { name, birthDate } = input as { name: string; birthDate: string };
    return calculateUserProfile(name || '', birthDate || '');
  },
};

/** Numerology facts: life path, expression. */
const numerologyEngine: Engine = {
  kind: 'numerology',
  label: 'Numerología',
  compute: (input) => {
    const { birthDate, name } = input as { birthDate: string; name?: string };
    return {
      lifePath: calculateLifePath(birthDate),
      expressionNumber: name ? calculateExpressionNumber(name) : undefined,
    };
  },
};

/** Western astrology facts: sun/moon sign, element, modality. */
const astrologyEngine: Engine = {
  kind: 'astrology',
  label: 'Astrología occidental',
  compute: (input) => {
    const { birthDate, birthTime } = input as { birthDate: string; birthTime?: string };
    const sunSign = getSunSign(birthDate);
    return {
      sunSign,
      sunSignInfo: getSunSignInfo(birthDate),
      moonSign: getMoonSign(birthDate, birthTime),
      element: getElement(sunSign),
      modality: getModality(sunSign),
    };
  },
};

/** Chinese zodiac facts: animal + element. */
const chineseZodiacEngine: Engine = {
  kind: 'chinese_zodiac',
  label: 'Zodíaco chino',
  compute: (input) => {
    const { birthDate } = input as { birthDate: string };
    return {
      animal: getChineseZodiac(birthDate),
      info: getChineseZodiacInfo(birthDate),
    };
  },
};

/** Couple compatibility engine. */
const compatibilityEngine: Engine = {
  kind: 'compatibility',
  label: 'Compatibilidad',
  compute: (input) => {
    const { user, target } = input as {
      user: UserProfile;
      target: Parameters<typeof calculateCompatibility>[1];
    };
    return calculateCompatibility(user, target);
  },
};

/** Daily energy for a date. */
const dailyEnergyEngine: Engine = {
  kind: 'daily_energy',
  label: 'Energía del día',
  compute: (input) => {
    const { profile, date } = input as { profile: UserProfile; date?: Date };
    return calculateDailyEnergy(profile, date);
  },
};

/** Timing analysis for an intention/date. */
const timingEngine: Engine = {
  kind: 'timing',
  label: 'Timing',
  compute: (input) => {
    const { profile, date, intention } = input as {
      profile: UserProfile;
      date: Date;
      intention: TimingIntention;
    };
    return analyzeTiming(profile, date, intention);
  },
};

/** Decision analysis. */
const decisionEngine: Engine = {
  kind: 'decision',
  label: 'Decisiones',
  compute: (input) => {
    const { profile, question, category } = input as {
      profile: UserProfile;
      question: string;
      category: DecisionCategory;
    };
    return analyzeDecision(profile, question, category);
  },
};

/** Convergence (nudo) detection. */
const convergenceEngine: Engine = {
  kind: 'convergence',
  label: 'Convergencia',
  compute: (input) => {
    const { profile } = input as { profile: UserProfile };
    return buildConvergence(profile);
  },
};

const synthesisCodeEngine: Engine = {
  kind: 'synthesis_code',
  label: 'Código personal',
  compute: (input) => {
    const { profile } = input as { profile: UserProfile };
    return buildPersonalCode(profile);
  },
};

const synthesisPatternsEngine: Engine = {
  kind: 'synthesis_patterns',
  label: 'Patrones',
  compute: (input) => {
    const { profile } = input as { profile: UserProfile };
    return buildPatterns(profile);
  },
};

const synthesisTensionsEngine: Engine = {
  kind: 'synthesis_tensions',
  label: 'Tensiones',
  compute: (input) => {
    const { profile } = input as { profile: UserProfile };
    return buildTensions(profile);
  },
};

const synthesisRulesEngine: Engine = {
  kind: 'synthesis_rules',
  label: 'Reglas',
  compute: (input) => {
    const { profile } = input as { profile: UserProfile };
    return buildRules(profile);
  },
};

/**
 * The registry itself — a `map<kind, engine>`. Engines are keyed by kind and
 * looked up by `getEngine`. Never add a new engine here without also adding
 * its kind to `EngineKind` above.
 */
export const ENGINE_REGISTRY: ReadonlyMap<EngineKind, Engine> = new Map<EngineKind, Engine>([
  [profileEngine.kind, profileEngine],
  [numerologyEngine.kind, numerologyEngine],
  [astrologyEngine.kind, astrologyEngine],
  [chineseZodiacEngine.kind, chineseZodiacEngine],
  [compatibilityEngine.kind, compatibilityEngine],
  [dailyEnergyEngine.kind, dailyEnergyEngine],
  [timingEngine.kind, timingEngine],
  [decisionEngine.kind, decisionEngine],
  [convergenceEngine.kind, convergenceEngine],
  [synthesisCodeEngine.kind, synthesisCodeEngine],
  [synthesisPatternsEngine.kind, synthesisPatternsEngine],
  [synthesisTensionsEngine.kind, synthesisTensionsEngine],
  [synthesisRulesEngine.kind, synthesisRulesEngine],
]);

/**
 * Return the engine registered for a kind, or null if unknown.
 */
export function getEngine(kind: EngineKind): Engine | null {
  return ENGINE_REGISTRY.get(kind) ?? null;
}

/**
 * Dispatch a computation through the registry. Throws on unknown kinds so a
 * typo'd kind is a loud failure, not a silent null.
 */
export function runEngine<I, O>(kind: EngineKind, input: I): O {
  const engine = getEngine(kind);
  if (!engine || !engine.compute) {
    throw new Error(`Unknown or non-computable engine kind: ${kind}`);
  }
  return engine.compute(input) as O;
}

// Convenience typed wrappers — keeps call sites type-safe without re-deriving.
export function runProfile(input: { name: string; birthDate: string }): ReturnType<typeof calculateUserProfile> {
  return runEngine('profile', input);
}

export function runCompatibility(input: { user: UserProfile; target: Parameters<typeof calculateCompatibility>[1] }): CompatibilityResult {
  return runEngine('compatibility', input);
}

export function runDailyEnergy(input: { profile: UserProfile; date?: Date }): DailyEnergyResult {
  return runEngine('daily_energy', input);
}

export function runTiming(input: { profile: UserProfile; date: Date; intention: TimingIntention }): TimingResult {
  return runEngine('timing', input);
}

export function runConvergence(input: { profile: UserProfile }): Convergence {
  return runEngine('convergence', input);
}

export function runPatterns(input: { profile: UserProfile }): PatternInsight[] {
  return runEngine('synthesis_patterns', input);
}

export function runTensions(input: { profile: UserProfile }): TensionInsight[] {
  return runEngine('synthesis_tensions', input);
}

export function runRules(input: { profile: UserProfile }): RuleInsight[] {
  return runEngine('synthesis_rules', input);
}

export function runPersonalCode(input: { profile: UserProfile }): PersonalCode {
  return runEngine('synthesis_code', input);
}