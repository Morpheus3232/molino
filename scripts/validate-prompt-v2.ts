/**
 * Validate that buildIntelligencePromptV2 (lib/engines/intelligence/promptBuilder.ts)
 * produces byte-identical output to the legacy switch in intelligenceEngine.ts,
 * across a realistic spread of inputs — the pre-flight check before flipping
 * INTELLIGENCE_ENGINE_V2_ENABLED in any real environment.
 *
 * IMPORTANT — data source: Molino has no server-side database for user
 * profiles (see ARCHITECTURE.md — the profile lives in localStorage/URL,
 * never persisted server-side), so there is no store of "real user cases"
 * to pull from, anonymized or otherwise. This script instead uses 12
 * SYNTHETIC profiles (+3 explicit missing-data edge cases, 15 requests
 * total) spanning the real input domain: all 12 lifePath
 * numerology groups, all 5 elements, entities with/without traditional
 * Chinese-zodiac relations, and every optional MolinoContext module
 * (dailyEnergy/timing/compatibility/entity/decision/conversationHistory/
 * readingContext) present and absent — the actual axes buildIntelligencePrompt
 * branches on. This is a stronger check than a handful of real production
 * requests would be, precisely because it deliberately covers the edge
 * cases (missing optional fields, empty name, long history) real traffic
 * might not hit on any given day.
 *
 * Run: this repo has no standalone TS runner (no tsx/ts-node). Execute via
 * vitest, e.g. a throwaway wrapper that imports and calls runValidation()
 * (see the Paso 7 follow-up report for the exact invocation used to
 * generate the results in .claude/execution-logs/v2-staging-validation.md).
 */

import { buildIntelligencePrompt } from '@/lib/engines/intelligenceEngine';
import type { MolinoContext, InterpretationRequest, InterpretationType } from '@/lib/engines/intelligenceEngine';

interface SyntheticProfile {
  label: string;
  userProfile: MolinoContext['userProfile'];
  numerology: MolinoContext['numerology'];
  astrology: MolinoContext['astrology'];
  chineseZodiac: MolinoContext['chineseZodiac'];
  cycles: MolinoContext['cycles'];
}

// 12 lifePath groups × varied element/archetype/animal/optional-field
// combinations. Names are synthetic (never sent to the model as-is — the
// prompt builder pseudonymizes every name via sanitizeNameForPrompt).
const PROFILES: SyntheticProfile[] = [
  mk('lifePath 1, Fuego, con desafíos/fortalezas', 1, 'Fuego', 'Aries', 'Rata', 'El Pionero', ['Impaciencia'], ['Iniciativa', 'Coraje']),
  mk('lifePath 8, Metal, sin nombre', 8, 'Metal', 'Capricornio', 'Buey', 'El Ejecutivo', ['Rigidez'], ['Disciplina'], { noName: true }),
  mk('lifePath 2, Agua, sin desafíos/fortalezas declaradas', 2, 'Agua', 'Cáncer', 'Conejo', 'El Mediador', [], []),
  mk('lifePath 6, Tierra', 6, 'Tierra', 'Tauro', 'Cabra', 'El Cuidador', ['Sobreexigencia'], ['Empatía', 'Responsabilidad']),
  mk('lifePath 3, Aire, sin archetypeDescription', 3, 'Aire', 'Géminis', 'Caballo', 'El Comunicador', ['Dispersión'], ['Creatividad'], { noArchetypeDescription: true }),
  mk('lifePath 5, Fuego', 5, 'Fuego', 'Sagitario', 'Mono', 'El Aventurero', ['Inconstancia'], ['Adaptabilidad', 'Curiosidad']),
  mk('lifePath 4, Tierra, animal sin relaciones conocidas', 4, 'Tierra', 'Virgo', 'Dragón', 'El Constructor', ['Rigidez'], ['Disciplina', 'Paciencia']),
  mk('lifePath 7, Agua', 7, 'Agua', 'Piscis', 'Serpiente', 'El Buscador', ['Aislamiento'], ['Intuición', 'Profundidad']),
  mk('lifePath 9, Fuego, sin números secundarios', 9, 'Fuego', 'Leo', 'Gallo', 'El Sabio', ['Idealismo'], ['Compasión'], { noSecondaryNumbers: true }),
  mk('lifePath 11, Aire', 11, 'Aire', 'Libra', 'Perro', 'El Iluminador', ['Sensibilidad excesiva'], ['Intuición elevada']),
  mk('lifePath 22, Tierra', 22, 'Tierra', 'Capricornio', 'Cerdo', 'El Constructor Maestro', ['Perfeccionismo'], ['Visión', 'Pragmatismo']),
  mk('lifePath 33, Agua', 33, 'Agua', 'Piscis', 'Tigre', 'El Maestro', ['Autoexigencia'], ['Servicio', 'Compasión']),
];

function mk(
  label: string,
  lifePath: number,
  element: string,
  sunSign: string,
  animal: string,
  archetype: string,
  challenges: string[],
  strengths: string[],
  opts: { noName?: boolean; noArchetypeDescription?: boolean; noSecondaryNumbers?: boolean } = {},
): SyntheticProfile {
  const name = opts.noName ? '' : `Perfil Sintético ${lifePath}`;
  return {
    label,
    userProfile: {
      name,
      lifePath,
      archetype,
      sunSign,
      element,
      modality: 'Mutable',
      chineseZodiac: animal,
      chineseElement: element,
      expressionNumber: opts.noSecondaryNumbers ? undefined : (lifePath % 9) + 1,
      soulNumber: opts.noSecondaryNumbers ? undefined : ((lifePath * 2) % 9) + 1,
      personalityNumber: opts.noSecondaryNumbers ? undefined : ((lifePath * 3) % 9) + 1,
      personalYear: (lifePath % 9) + 1,
      personalMonth: (lifePath % 12) + 1,
      personalDay: (lifePath % 9) + 1,
    },
    numerology: {
      lifePath,
      expressionNumber: opts.noSecondaryNumbers ? undefined : (lifePath % 9) + 1,
      soulNumber: opts.noSecondaryNumbers ? undefined : ((lifePath * 2) % 9) + 1,
      personalityNumber: opts.noSecondaryNumbers ? undefined : ((lifePath * 3) % 9) + 1,
      archetype,
      archetypeDescription: opts.noArchetypeDescription ? '' : `Tu arquetipo se define por ${strengths.join(', ').toLowerCase() || 'introspección'}.`,
      archetypeChallenges: challenges,
      archetypeStrengths: strengths,
    },
    astrology: { sunSign, element, modality: 'Mutable', symbol: '*' },
    chineseZodiac: { animal, element },
    cycles: { personalYear: (lifePath % 9) + 1, personalMonth: (lifePath % 12) + 1, personalDay: (lifePath % 9) + 1 },
  };
}

function contextFor(profile: SyntheticProfile, extras: Partial<MolinoContext> = {}): MolinoContext {
  return {
    userProfile: profile.userProfile,
    numerology: profile.numerology,
    astrology: profile.astrology,
    chineseZodiac: profile.chineseZodiac,
    cycles: profile.cycles,
    ...extras,
  };
}

const DAILY_ENERGY = {
  date: '2026-08-17', overallScore: 68, theme: 'Introspección', description: '',
  strengths: ['Claridad'], cautions: ['Aislamiento'],
  areas: {
    work: { score: 60, label: 'Moderada' }, relationships: { score: 55, label: 'Reservada' },
    creativity: { score: 75, label: 'Alta' }, decisions: { score: 65, label: 'Buena' },
  },
  moonPhase: { phase: 'Luna llena', emoji: '🌕', description: '' },
  personalDay: 7, personalYear: 3, personalMonth: 7, elementInfluence: 'Agua', explanation: '',
} as unknown as MolinoContext['dailyEnergy'];

const TIMING = {
  date: '2026-08-17', intention: 'start_project', timingScore: 74, theme: 'Iniciación',
  favorableDimensions: ['Claridad'], challengingDimensions: ['Impaciencia'],
  explanation: 'Momento favorable con matices.', recommendedWindow: 'Próximas 2 semanas',
  caveats: [], personalDay: 7, personalYear: 3, moonPhase: 'Luna llena', elementInfluence: 'Agua',
} as unknown as MolinoContext['timing'];

const COMPATIBILITY = {
  user: {}, target: {},
  scores: { numerology: 55, westernAstrology: 60, chineseAstrology: 50, archetype: 65, element: 58, overall: 58 },
  strengths: ['Ritmo compartido'], challenges: ['Comunicación indirecta'],
  narrative: '', insight: '',
} as unknown as MolinoContext['compatibility'];

const ENTITY = {
  id: 'synthetic-entity', name: 'Ciudad Sintética', category: 'city', emoji: '🏙️',
  symbolism: {}, context: { description: 'Entidad de prueba, no real.', keyThemes: ['Prueba'] },
} as unknown as MolinoContext['entity'];

const DECISION = {
  question: '¿Conviene mudarme este año?', category: 'career', overallScore: 62, alignmentScore: 60,
  timingScore: 65, energyScore: 61, recommendation: 'Favorable con preparación',
  reasoning: 'El ciclo actual favorece el movimiento con planificación previa.',
  considerations: ['Costo de vida', 'Red de contactos'], nextSteps: ['Investigar el destino'],
  personalDay: 7, personalYear: 3, moonPhase: 'Luna llena', elementInfluence: 'Agua',
} as unknown as MolinoContext['decision'];

/** Every request this script exercises — 18 profiles × the type each is meant to stress. */
function buildRequests(): { label: string; request: InterpretationRequest }[] {
  const out: { label: string; request: InterpretationRequest }[] = [];
  const types: InterpretationType[] = ['personal_profile', 'daily_energy', 'timing', 'compatibility', 'decision', 'question', 'pattern'];

  PROFILES.forEach((profile, i) => {
    const type = types[i % types.length];
    let context: MolinoContext;
    let request: InterpretationRequest;

    switch (type) {
      case 'personal_profile':
        context = contextFor(profile, { dailyEnergy: DAILY_ENERGY, timing: TIMING });
        request = { type, context };
        break;
      case 'daily_energy':
        context = contextFor(profile, { dailyEnergy: DAILY_ENERGY });
        request = { type, context };
        break;
      case 'timing':
        context = contextFor(profile, { timing: TIMING });
        request = { type, context };
        break;
      case 'compatibility':
        context = contextFor(profile, { compatibility: COMPATIBILITY, entity: ENTITY });
        request = { type, context };
        break;
      case 'decision':
        context = contextFor(profile, { decision: DECISION });
        request = {
          type, context,
          conversationHistory: i % 2 === 0 ? [{ question: '¿Y si espero un año?', answer: 'Podría diluir la ventana favorable.' }] : undefined,
        };
        break;
      case 'question':
        context = contextFor(profile, { dailyEnergy: i % 2 === 0 ? DAILY_ENERGY : undefined });
        request = {
          type, context,
          question: i % 3 === 0 ? '' : '¿Qué significa mi Life Path para este año?',
          readingContext: i % 4 === 0 ? { summary: 'Resumen previo de prueba.', corePattern: { what: 'patrón de prueba' } } : undefined,
        };
        break;
      default:
        context = contextFor(profile);
        request = { type, context };
    }

    out.push({ label: `${profile.label} → ${type}`, request });
  });

  // A couple of type/data-missing edge cases: type expects a module that
  // isn't in the context (exercises the "No hay datos de ... disponibles" branch).
  out.push({ label: 'daily_energy sin dailyEnergy en el contexto', request: { type: 'daily_energy', context: contextFor(PROFILES[0]) } });
  out.push({ label: 'compatibility sin compatibility/entity en el contexto', request: { type: 'compatibility', context: contextFor(PROFILES[1]) } });
  out.push({ label: 'unknown type → rama default', request: { type: 'unknown' as InterpretationType, context: contextFor(PROFILES[2]) } });

  return out;
}

interface DiffReport {
  label: string;
  identical: boolean;
  firstDiffIndex?: number;
  firstDiffLine?: number;
  firstDiffChar?: number;
  legacySnippet?: string;
  v2Snippet?: string;
}

function firstDifference(a: string, b: string): { index: number; line: number; char: number } | null {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      const upToHere = a.slice(0, i);
      const line = (upToHere.match(/\n/g) || []).length + 1;
      const lastNewline = upToHere.lastIndexOf('\n');
      const char = i - lastNewline;
      return { index: i, line, char };
    }
  }
  if (a.length !== b.length) {
    const upToHere = a.slice(0, len);
    const line = (upToHere.match(/\n/g) || []).length + 1;
    const lastNewline = upToHere.lastIndexOf('\n');
    return { index: len, line, char: len - lastNewline };
  }
  return null;
}

export function runValidation(): DiffReport[] {
  const requests = buildRequests();
  const originalFlag = process.env.INTELLIGENCE_ENGINE_V2_ENABLED;
  const results: DiffReport[] = [];

  try {
    for (const { label, request } of requests) {
      process.env.INTELLIGENCE_ENGINE_V2_ENABLED = 'false';
      const legacy = buildIntelligencePrompt(request);
      process.env.INTELLIGENCE_ENGINE_V2_ENABLED = 'true';
      const v2 = buildIntelligencePrompt(request);

      const diff = firstDifference(legacy, v2);
      if (!diff) {
        results.push({ label, identical: true });
      } else {
        results.push({
          label,
          identical: false,
          firstDiffIndex: diff.index,
          firstDiffLine: diff.line,
          firstDiffChar: diff.char,
          legacySnippet: legacy.slice(Math.max(0, diff.index - 40), diff.index + 40),
          v2Snippet: v2.slice(Math.max(0, diff.index - 40), diff.index + 40),
        });
      }
    }
  } finally {
    if (originalFlag === undefined) delete process.env.INTELLIGENCE_ENGINE_V2_ENABLED;
    else process.env.INTELLIGENCE_ENGINE_V2_ENABLED = originalFlag;
  }

  return results;
}

export function printReport(results: DiffReport[]): void {
  const failures = results.filter(r => !r.identical);
  console.log(`\nvalidate-prompt-v2: ${results.length} casos, ${results.length - failures.length} idénticos, ${failures.length} con diferencias.\n`);
  for (const r of results) {
    if (r.identical) {
      console.log(`  OK   ${r.label}`);
    } else {
      console.log(`  DIFF ${r.label}`);
      console.log(`       primera diferencia: índice ${r.firstDiffIndex}, línea ${r.firstDiffLine}, carácter ${r.firstDiffChar}`);
      console.log(`       legacy: ...${JSON.stringify(r.legacySnippet)}...`);
      console.log(`       v2:     ...${JSON.stringify(r.v2Snippet)}...`);
    }
  }
  console.log('');
}
