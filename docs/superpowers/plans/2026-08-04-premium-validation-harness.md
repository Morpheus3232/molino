# Molino Premium Validation Harness V1.0 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated, read-only-of-production Validation Harness that measures whether Molino's current intelligence engine (`lib/engines/intelligenceEngine.ts` + `lib/engines/aiEngine.ts`) produces output meeting the Molino Cognitive DNA standard — WITHOUT modifying any production file.

**Architecture:** A standalone TypeScript module tree under `tests/premium/validation/` that (1) drives the real engine headlessly by importing `calculateUserProfile` → `buildMolinoContext` → `buildIntelligencePrompt` → `generateWithClaude`/`generateWithOpenAI` exactly as `app/api/intelligence/interpret/route.ts` does, (2) runs a battery of evaluators (structural, epistemic, anti-ADN, gold-standard match, generic-replacement, silence) against each output, producing a `StructuredEvaluationTrace` per case, (3) aggregates everything into JSON + Markdown reports. Evaluators combine cheap regex/structural heuristics with one shared LLM-judge utility (reusing the existing `generateWithClaude` provider call — new eval-only prompts, zero production files touched) for judgments that require semantic reasoning (topology match, semantic-equivalence for Generic Replacement, epistemic hedging quality).

**Tech Stack:** TypeScript (strict, ESM), Vitest (already installed — used both for the evaluators' own unit tests and, via `vitest run`, to execute the runner script itself as a side-effecting test so no new dependency is required), `npx tsx` for the optional standalone CLI entry point (same convention already used by `scripts/qa-premium-access.mjs`), Node `fs` for report writing.

## Global Constraints

- NO modification of any file under `lib/engines/`, `lib/ai/`, `app/api/`, `components/`, `types/`, or any other production path. Every new/changed file in this plan lives under `tests/premium/validation/`, `docs/superpowers/plans/`, `package.json` (new script only), or `.gitignore` (new ignore entry only).
- If a test fails, record it (`FAIL → WHY → EVIDENCE → LIKELY ROOT CAUSE → RECOMMENDED NEXT CHANGE`) — never "fix" the engine to make it pass.
- `StructuredEvaluationTrace` is internal metadata only — never rendered to an end user, never imported by production UI.
- No embeddings dependency is added (none exists in the repo today); Generic Replacement semantic-equivalence uses the LLM-judge utility instead, which is justified because `generateWithClaude`/`generateWithOpenAI` are pre-existing infra.
- Temperature/top_p are NOT parameterized in `aiEngine.ts` (hardcoded `temperature: 0.7`, no `top_p`). The Temperature Matrix runner must NOT add params to `aiEngine.ts` — it documents this as a hard limitation and instead measures run-to-run variability at the fixed temperature.
- All fixture content written in this plan is **harness-authored placeholder content**, explicitly labeled `sourceStatus: 'harness_authored_placeholder'` in fixture metadata and called out in the README — it is NOT the officially frozen Gold Standard/Anti-ADN documents (those were not available when this harness was built). The harness must be trivially extensible so the real fixtures can replace the placeholders later without touching evaluator/runner code.
- `npm run typecheck` and `npm test` (existing suite) must stay green throughout.
- `git status --short` at the end must show zero modified files outside the allowlist above.

---

## File Structure

```
tests/premium/validation/
  types.ts                        # StructuredEvaluationTrace, GoldStandardID, EvaluationStatus, Topology, etc.
  config.ts                       # thresholds, provider selection, output paths
  engineClient.ts                 # headless bridge into the real engine (profile→context→prompt→AI/fallback)
  fixtures/
    types.ts                      # fixture-level shared types (GoldStandardFixture, AntiAdnCase, ...)
    gold/gs1.ts ... gs5.ts        # one fully-serialized fixture per topology (placeholder-labeled)
    anti-adn/index.ts             # array of AntiAdnCase (placeholder-labeled)
    incomplete/index.ts           # array of IncompleteInputCase
    generic-replacement/index.ts  # array of GenericReplacementTestCase (built from gold/*)
    silence/index.ts              # array of SilenceCase
  evaluators/
    llmJudge.ts                   # shared LLM-judge call (new eval-only prompt, uses generateWithClaude)
    structural.ts                 # pure heuristic: required fields present/non-empty/shape
    epistemic.ts                  # hedging language, evidence traceability, virtue-preservation, inference-limit
    antiAdn.ts                    # heuristic + optional LLM judge for the 10 anti-ADN categories
    goldStandard.ts                # topology match + gold_standard_match via LLM judge
    genericReplacement.ts         # semantic-equivalence via LLM judge
    silence.ts                    # silence_recommended / publication_decision detection
    scoring.ts                    # aggregation, recognition×revelation matrix, overall trace assembly
    __tests__/
      structural.test.ts
      epistemic.test.ts
      antiAdn.test.ts
      goldStandard.test.ts
      genericReplacement.test.ts
      silence.test.ts
      scoring.test.ts
  runners/
    runValidation.test.ts         # vitest entry point: runs full suite end-to-end, writes reports
    runTemperatureMatrix.test.ts  # vitest entry point: variability-at-fixed-T runner, writes its own report
  report.ts                       # JSON + Markdown report writers
  README.md                       # what this is, how to run it, how to swap in real fixtures
validation-results/               # gitignored output dir: latest.json, latest.md, summary.json, temperature-matrix.json/.md
```

---

### Task 1: Scaffolding — directories, shared types, config, gitignore, npm script

**Files:**
- Create: `tests/premium/validation/types.ts`
- Create: `tests/premium/validation/config.ts`
- Create: `tests/premium/validation/fixtures/types.ts`
- Modify: `.gitignore`
- Modify: `package.json` (scripts only)
- Test: `tests/premium/validation/__tests__/types.test.ts`

**Interfaces:**
- Produces: `GoldStandardID`, `EvaluationStatus`, `Topology`, `EvaluationTest`, `StructuredEvaluationTrace`, `PublicationDecision` (all consumed by every evaluator/runner task below).
- Produces: `HarnessConfig` (consumed by `engineClient.ts` and both runners): `{ provider: 'openai' | 'claude'; goldPassConfidenceThreshold: number; outputDir: string; evaluatorVersion: string }`.
- Produces: `FixtureSourceStatus = 'harness_authored_placeholder' | 'official_approved'` (consumed by every fixture file).

- [ ] **Step 1: Write `types.ts`**

```typescript
// tests/premium/validation/types.ts

export type GoldStandardID = 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'GS5';

export type EvaluationStatus = 'pass' | 'fail' | 'insufficient_evidence' | 'not_applicable';

export type Topology =
  | 'contextual_mismatch'
  | 'hidden_dependency'
  | 'self_reinforcing_paradox'
  | 'functional_phase_change'
  | 'situational_resonance';

export interface EvaluationTest {
  name: string;
  status: EvaluationStatus;
  score: number; // 0-10
  evidence?: string;
  reason?: string;
}

export type PublicationDecision = 'publish' | 'reject' | 'insufficient_evidence';

export interface StructuredEvaluationTrace {
  topology: Topology | null;
  confidence: number; // 0-1
  tests: EvaluationTest[];
  gold_standard_match: GoldStandardID | null;
  anti_adn_flags: string[];
  missing_required_inputs: string[];
  evidence_map: {
    data_a?: string;
    data_b?: string;
    tension?: string;
    moment?: string;
    situation?: string;
    connection?: string;
    hypothesis?: string;
  };
  silence_recommended: boolean;
  publication_decision: PublicationDecision;
  evaluator_version: string;
}

export type FixtureSourceStatus = 'harness_authored_placeholder' | 'official_approved';
```

- [ ] **Step 2: Write `config.ts`**

```typescript
// tests/premium/validation/config.ts
import path from 'node:path';

export interface HarnessConfig {
  provider: 'openai' | 'claude';
  goldPassConfidenceThreshold: number;
  outputDir: string;
  evaluatorVersion: string;
}

// Provider selection: Claude is the production default in most call sites
// (route.ts defaults 'openai' but ANTHROPIC_MODEL is documented as the
// primary path in intelligenceEngine's rolePrompt comments) — pick whichever
// key is present, preferring Claude, so the harness runs with zero extra
// config on a machine that only has one provider key set.
export function resolveConfig(): HarnessConfig {
  const provider: 'openai' | 'claude' = process.env.ANTHROPIC_API_KEY
    ? 'claude'
    : 'openai';
  return {
    provider,
    goldPassConfidenceThreshold: 0.8,
    outputDir: path.resolve(process.cwd(), 'validation-results'),
    evaluatorVersion: '1.0.0',
  };
}

export const THRESHOLDS = {
  goldReproductionMinPass: 4, // out of 5
  antiAdnRejectionRate: 1.0,
  incompleteInputSafetyRate: 1.0,
  genericReplacementFalsePositives: 0,
  silenceCorrectRejectionRate: 0.8,
};
```

- [ ] **Step 3: Write `fixtures/types.ts`**

```typescript
// tests/premium/validation/fixtures/types.ts
import type { GoldStandardID, Topology, FixtureSourceStatus } from '../types';
import type { InterpretationType } from '@/lib/engines/intelligenceEngine';

export interface GoldStandardFixture {
  id: GoldStandardID;
  sourceStatus: FixtureSourceStatus;
  topology: Topology;
  name: string;
  formula: string;
  operativeQuestion: string;
  interpretationType: InterpretationType;
  profileInput: { name: string; birthDate: string };
  dataA: string;
  dataB: string;
  tension: string;
  moment?: string;
  situation?: string;
  requiresMoment: boolean;
  requiresSituation: boolean;
  causalConnection: string;
  expectedInsight: string;
  successCriteria: string[];
}

export interface AntiAdnCase {
  id: string;
  sourceStatus: FixtureSourceStatus;
  category:
    | 'labeling'
    | 'generic_advice'
    | 'invented_causality'
    | 'symbolic_decoration'
    | 'empty_validation'
    | 'mechanism_without_application'
    | 'universality'
    | 'psychological_diagnosis'
    | 'superficial_personalization'
    | 'numerology_as_causal_authority';
  description: string;
  sampleText: string; // the anti-pattern text itself, for evaluator unit tests
}

export interface IncompleteInputCase {
  id: string;
  sourceStatus: FixtureSourceStatus;
  requiredInputMissing: 'moment' | 'situation' | 'question_context';
  interpretationType: InterpretationType;
  profileInput: { name: string; birthDate: string };
  description: string;
}

export interface GenericReplacementTestCase {
  baseGoldStandard: GoldStandardID;
  originalInput: { name: string; birthDate: string };
  replacementInputs: Array<{
    label: string;
    profile: { name: string; birthDate: string };
    shouldProduceSameInsight: false;
  }>;
}

export interface SilenceCase {
  id: string;
  sourceStatus: FixtureSourceStatus;
  reason: string;
  interpretationType: InterpretationType;
  profileInput: { name: string; birthDate: string };
  question?: string;
}
```

- [ ] **Step 4: Add `.gitignore` entry**

Append to `.gitignore`:
```
/validation-results/
```

- [ ] **Step 5: Add npm script**

In `package.json` `"scripts"`, add (alongside existing `test`):
```json
"validate:premium": "vitest run tests/premium/validation/runners --reporter=verbose",
"validate:premium:temperature": "vitest run tests/premium/validation/runners/runTemperatureMatrix.test.ts --reporter=verbose"
```

- [ ] **Step 6: Write the smoke test**

```typescript
// tests/premium/validation/__tests__/types.test.ts
import { describe, it, expect } from 'vitest';
import { resolveConfig, THRESHOLDS } from '../config';

describe('harness config', () => {
  it('resolves a provider and default thresholds without throwing', () => {
    const config = resolveConfig();
    expect(['openai', 'claude']).toContain(config.provider);
    expect(THRESHOLDS.goldReproductionMinPass).toBe(4);
  });
});
```

- [ ] **Step 7: Run it**

Run: `npx vitest run tests/premium/validation/__tests__/types.test.ts`
Expected: PASS (1 test)

- [ ] **Step 8: Commit**

```bash
git add tests/premium/validation/types.ts tests/premium/validation/config.ts tests/premium/validation/fixtures/types.ts tests/premium/validation/__tests__/types.test.ts .gitignore package.json
git commit -m "test(premium-validation): scaffold harness types, config, and npm scripts"
```

---

### Task 2: `engineClient.ts` — headless bridge into the real engine

**Files:**
- Create: `tests/premium/validation/engineClient.ts`
- Test: `tests/premium/validation/__tests__/engineClient.test.ts`

**Interfaces:**
- Consumes: `HarnessConfig` (Task 1).
- Consumes (read-only imports from production): `calculateUserProfile` (`@/lib/engines/profileBuilder`), `buildMolinoContext`, `buildIntelligencePrompt`, `generateFallbackInterpretation`, `type InterpretationType`, `type MolinoInterpretation` (`@/lib/engines/intelligenceEngine`), `generateWithClaude`, `generateWithOpenAI` (`@/lib/engines/aiEngine`).
- Produces: `async function runEngine(input: EngineRunInput, config: HarnessConfig): Promise<EngineRunResult>` — consumed by every evaluator task and both runners.

```typescript
export interface EngineRunInput {
  name: string;
  birthDate: string;
  type: InterpretationType;
  question?: string;
}

export interface EngineRunResult {
  input: EngineRunInput;
  prompt: string;
  fallback: MolinoInterpretation;
  ai: MolinoInterpretation | null;
  aiError: string | null;
  rawResponse: string | null;
}
```

This module is the ONLY place in the harness that imports production engine code — every evaluator/fixture consumes its output types, never the production modules directly. This mirrors exactly what `app/api/intelligence/interpret/route.ts` does (same functions, same call order, same `JSON.parse(rawResponse)` parsing of the structured AI output) so the harness measures the real production code path, not a reimplementation of it.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/premium/validation/__tests__/engineClient.test.ts
import { describe, it, expect } from 'vitest';
import { runEngine } from '../engineClient';
import { resolveConfig } from '../config';

describe('engineClient.runEngine', () => {
  it('always returns a deterministic fallback interpretation, even without an AI key', async () => {
    const config = resolveConfig();
    const result = await runEngine(
      { name: 'Ada Lovelace', birthDate: '1990-03-15', type: 'personal_profile' },
      config
    );
    expect(result.fallback).toBeTruthy();
    expect(result.fallback.summary.length).toBeGreaterThan(0);
    expect(typeof result.prompt).toBe('string');
    expect(result.prompt.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/premium/validation/__tests__/engineClient.test.ts`
Expected: FAIL — `Cannot find module '../engineClient'`

- [ ] **Step 3: Write `engineClient.ts`**

```typescript
// tests/premium/validation/engineClient.ts
import { calculateUserProfile } from '@/lib/engines/profileBuilder';
import {
  buildMolinoContext,
  buildIntelligencePrompt,
  generateFallbackInterpretation,
  type InterpretationType,
  type MolinoInterpretation,
} from '@/lib/engines/intelligenceEngine';
import { generateWithOpenAI, generateWithClaude, type AIInterpretation } from '@/lib/engines/aiEngine';
import type { CompatibilityResult } from '@/lib/engines/compatibilityEngine';
import type { HarnessConfig } from './config';

export interface EngineRunInput {
  name: string;
  birthDate: string;
  type: InterpretationType;
  question?: string;
}

export interface EngineRunResult {
  input: EngineRunInput;
  prompt: string;
  fallback: MolinoInterpretation;
  ai: MolinoInterpretation | null;
  aiError: string | null;
  rawResponse: string | null;
}

// Same neutral-score placeholder route.ts falls back to when no real
// CompatibilityResult is supplied (route.ts:84-92) — target/result are
// discarded by aiEngine's buildPrompt whenever a `template` is passed, so
// this shape only needs to satisfy TypeScript, not carry real data.
function placeholderCompatResult(profile: ReturnType<typeof calculateUserProfile>): CompatibilityResult {
  return {
    user: profile,
    target: {},
    scores: { numerology: 50, westernAstrology: 50, chineseAstrology: 50, archetype: 50, element: 50, overall: 50 },
    strengths: [],
    challenges: [],
    narrative: '',
    insight: '',
  } as unknown as CompatibilityResult;
}

function parseStructured(ai: AIInterpretation): MolinoInterpretation | null {
  if (!ai.rawResponse) return null;
  try {
    const structured = JSON.parse(ai.rawResponse);
    if (!structured?.summary) return null;
    return {
      summary: structured.summary || '',
      alignment: structured.alignment || '',
      timing: structured.timing || '',
      strengths: structured.strengths || [],
      tensions: structured.tensions || [],
      whatToConsider: structured.whatToConsider || [],
      suggestedNextStep: structured.suggestedNextStep || '',
      confidence: structured.confidence || 'Alta',
      limitations: structured.limitations?.length ? structured.limitations : ['Interpretación generada con IA.'],
      opening: structured.opening,
      corePattern: structured.corePattern,
      howYouOperate: structured.howYouOperate,
      relationalNote: structured.relationalNote,
      closingSynthesis: structured.closingSynthesis,
      rawContext: {} as any, // not needed by evaluators; avoids re-deriving MolinoContext here
    };
  } catch {
    return null;
  }
}

export async function runEngine(input: EngineRunInput, config: HarnessConfig): Promise<EngineRunResult> {
  const profile = calculateUserProfile(input.name, input.birthDate);
  const context = buildMolinoContext(profile, {});
  const fallback = generateFallbackInterpretation({ type: input.type, context, question: input.question });
  const prompt = buildIntelligencePrompt({ type: input.type, context, question: input.question });

  let ai: MolinoInterpretation | null = null;
  let aiError: string | null = null;
  let rawResponse: string | null = null;

  try {
    const compatResult = placeholderCompatResult(profile);
    const aiResponse = config.provider === 'claude'
      ? await generateWithClaude(profile, { name: 'Análisis' }, compatResult, prompt)
      : await generateWithOpenAI(profile, { name: 'Análisis' }, compatResult, prompt);
    rawResponse = aiResponse.rawResponse || null;
    ai = parseStructured(aiResponse);
  } catch (err) {
    aiError = err instanceof Error ? err.message : String(err);
  }

  return { input, prompt, fallback, ai, aiError, rawResponse };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/premium/validation/__tests__/engineClient.test.ts`
Expected: PASS (works with zero API keys set since it only asserts on `fallback`, which is always deterministic)

- [ ] **Step 5: Commit**

```bash
git add tests/premium/validation/engineClient.ts tests/premium/validation/__tests__/engineClient.test.ts
git commit -m "test(premium-validation): add headless engine bridge (engineClient)"
```

---

### Task 3: `evaluators/llmJudge.ts` — shared LLM-judge utility

**Files:**
- Create: `tests/premium/validation/evaluators/llmJudge.ts`
- Test: `tests/premium/validation/evaluators/__tests__/llmJudge.test.ts`

**Interfaces:**
- Consumes: `HarnessConfig` (Task 1), `generateWithClaude`/`generateWithOpenAI` from `@/lib/engines/aiEngine` (read-only import — the eval prompt built here is NEW, not a modification of any production prompt).
- Produces: `async function judge<T>(rubricPrompt: string, config: HarnessConfig): Promise<T | null>` — consumed by `goldStandard.ts`, `genericReplacement.ts`, `epistemic.ts`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/premium/validation/evaluators/__tests__/llmJudge.test.ts
import { describe, it, expect } from 'vitest';
import { buildJudgePrompt } from '../llmJudge';

describe('buildJudgePrompt', () => {
  it('embeds the rubric and requires strict JSON output', () => {
    const prompt = buildJudgePrompt('Is this insight generic? Text: "Sé vos mismo."', ['isGeneric: boolean']);
    expect(prompt).toContain('Sé vos mismo.');
    expect(prompt).toContain('isGeneric');
    expect(prompt.toLowerCase()).toContain('json');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/llmJudge.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write `llmJudge.ts`**

```typescript
// tests/premium/validation/evaluators/llmJudge.ts
import { generateWithClaude, generateWithOpenAI } from '@/lib/engines/aiEngine';
import type { HarnessConfig } from '../config';

// This prompt is evaluator-only infrastructure — it is never sent through
// production code paths and does not touch buildIntelligencePrompt. It
// reuses generateWithClaude/generateWithOpenAI purely as an HTTP+parsing
// utility (they accept any template string verbatim, see aiEngine.ts:222-230).
export function buildJudgePrompt(context: string, expectedJsonFields: string[]): string {
  return `Actuás como evaluador externo y escéptico de un sistema de interpretación simbólica (numerología/astrología). Tu trabajo es juzgar el texto dado con rigor, no validarlo.

${context}

Respondé ÚNICAMENTE con un JSON válido (sin texto adicional, sin markdown) con exactamente estos campos:
{ ${expectedJsonFields.map(f => `"${f}": ...`).join(', ')} }`;
}

interface PlaceholderCompat {
  user: unknown;
  target: unknown;
  scores: { numerology: number; westernAstrology: number; chineseAstrology: number; archetype: number; element: number; overall: number };
  strengths: string[];
  challenges: string[];
  narrative: string;
  insight: string;
}

function placeholderCompat(): PlaceholderCompat {
  return {
    user: {},
    target: {},
    scores: { numerology: 50, westernAstrology: 50, chineseAstrology: 50, archetype: 50, element: 50, overall: 50 },
    strengths: [],
    challenges: [],
    narrative: '',
    insight: '',
  };
}

export async function judge<T>(rubricPrompt: string, config: HarnessConfig): Promise<T | null> {
  try {
    const compat = placeholderCompat() as any;
    const response = config.provider === 'claude'
      ? await generateWithClaude({} as any, { name: 'Evaluator' }, compat, rubricPrompt)
      : await generateWithOpenAI({} as any, { name: 'Evaluator' }, compat, rubricPrompt);
    if (!response.rawResponse) return null;
    return JSON.parse(response.rawResponse) as T;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/llmJudge.test.ts`
Expected: PASS (this test only checks `buildJudgePrompt`, a pure string function — no network call, no API key needed)

- [ ] **Step 5: Commit**

```bash
git add tests/premium/validation/evaluators/llmJudge.ts tests/premium/validation/evaluators/__tests__/llmJudge.test.ts
git commit -m "test(premium-validation): add shared LLM-judge evaluator utility"
```

---

### Task 4: `evaluators/structural.ts` — pure heuristic structural validity

**Files:**
- Create: `tests/premium/validation/evaluators/structural.ts`
- Test: `tests/premium/validation/evaluators/__tests__/structural.test.ts`

**Interfaces:**
- Consumes: `MolinoInterpretation` (from `engineClient.ts` re-export or directly `@/lib/engines/intelligenceEngine`).
- Produces: `function evaluateStructural(interp: MolinoInterpretation | null): EvaluationTest` — consumed by `scoring.ts`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/premium/validation/evaluators/__tests__/structural.test.ts
import { describe, it, expect } from 'vitest';
import { evaluateStructural } from '../structural';

describe('evaluateStructural', () => {
  it('fails a null interpretation (AI generation failed)', () => {
    const result = evaluateStructural(null);
    expect(result.status).toBe('fail');
  });

  it('passes a fully-populated interpretation', () => {
    const result = evaluateStructural({
      summary: 'x'.repeat(30),
      alignment: 'x'.repeat(30),
      timing: 'x'.repeat(20),
      strengths: ['a', 'b'],
      tensions: ['t'],
      whatToConsider: ['c'],
      suggestedNextStep: 'do this',
      confidence: 'Alta',
      limitations: ['l'],
      rawContext: {} as any,
    });
    expect(result.status).toBe('pass');
    expect(result.score).toBeGreaterThanOrEqual(8);
  });

  it('fails an interpretation with empty required fields', () => {
    const result = evaluateStructural({
      summary: '',
      alignment: '',
      timing: '',
      strengths: [],
      tensions: [],
      whatToConsider: [],
      suggestedNextStep: '',
      confidence: 'Alta',
      limitations: [],
      rawContext: {} as any,
    });
    expect(result.status).toBe('fail');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/structural.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write `structural.ts`**

```typescript
// tests/premium/validation/evaluators/structural.ts
import type { MolinoInterpretation } from '@/lib/engines/intelligenceEngine';
import type { EvaluationTest } from '../types';

const REQUIRED_NON_EMPTY: Array<keyof MolinoInterpretation> = [
  'summary', 'alignment', 'timing', 'suggestedNextStep',
];
const REQUIRED_NON_EMPTY_ARRAYS: Array<keyof MolinoInterpretation> = [
  'strengths', 'tensions', 'whatToConsider', 'limitations',
];

export function evaluateStructural(interp: MolinoInterpretation | null): EvaluationTest {
  if (!interp) {
    return { name: 'structural_validity', status: 'fail', score: 0, reason: 'No interpretation object produced (AI generation failed or unparseable).' };
  }

  const missingStrings = REQUIRED_NON_EMPTY.filter(key => {
    const value = interp[key];
    return typeof value !== 'string' || value.trim().length < 10;
  });
  const missingArrays = REQUIRED_NON_EMPTY_ARRAYS.filter(key => {
    const value = interp[key];
    return !Array.isArray(value) || value.length === 0;
  });

  const totalChecks = REQUIRED_NON_EMPTY.length + REQUIRED_NON_EMPTY_ARRAYS.length;
  const failedChecks = missingStrings.length + missingArrays.length;
  const score = Math.round(((totalChecks - failedChecks) / totalChecks) * 10);

  if (failedChecks === 0) {
    return { name: 'structural_validity', status: 'pass', score: 10, evidence: 'All required fields populated.' };
  }

  return {
    name: 'structural_validity',
    status: 'fail',
    score,
    reason: `Missing/too-short fields: ${[...missingStrings, ...missingArrays].join(', ')}`,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/structural.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add tests/premium/validation/evaluators/structural.ts tests/premium/validation/evaluators/__tests__/structural.test.ts
git commit -m "test(premium-validation): add structural-validity evaluator"
```

---

### Task 5: `evaluators/epistemic.ts` — hedging, evidence, virtue-preservation, inference-limit

**Files:**
- Create: `tests/premium/validation/evaluators/epistemic.ts`
- Test: `tests/premium/validation/evaluators/__tests__/epistemic.test.ts`

**Interfaces:**
- Consumes: `MolinoInterpretation`.
- Produces: `function evaluateEpistemic(interp: MolinoInterpretation | null): EvaluationTest[]` (4 tests: `hypothesis_language`, `evidence_traceability_heuristic`, `virtue_preservation_heuristic`, `absolute_claim_check`) — consumed by `scoring.ts`.

This evaluator is pure heuristic (no LLM call) — regex-based, deliberately conservative, documented as a heuristic proxy (not a substitute for human/LLM judgment on causal-chain traceability, which `goldStandard.ts` covers separately with the LLM judge).

- [ ] **Step 1: Write the failing test**

```typescript
// tests/premium/validation/evaluators/__tests__/epistemic.test.ts
import { describe, it, expect } from 'vitest';
import { evaluateEpistemic } from '../epistemic';

function baseInterp(overrides: Partial<Record<string, string>> = {}) {
  return {
    summary: overrides.summary ?? 'Tu perfil sugiere que podés inclinarte hacia la acción.',
    alignment: overrides.alignment ?? 'Esto puede conectarse con tu elemento.',
    timing: 'x'.repeat(20),
    strengths: ['a'],
    tensions: ['t'],
    whatToConsider: ['c'],
    suggestedNextStep: 's',
    confidence: 'Alta',
    limitations: ['l'],
    rawContext: {} as any,
  };
}

describe('evaluateEpistemic', () => {
  it('passes hypothesis_language when hedging words are present', () => {
    const tests = evaluateEpistemic(baseInterp());
    const hedge = tests.find(t => t.name === 'hypothesis_language')!;
    expect(hedge.status).toBe('pass');
  });

  it('fails hypothesis_language when the text asserts with certainty', () => {
    const tests = evaluateEpistemic(baseInterp({ summary: 'Vas a tener éxito en marzo, es un hecho.', alignment: 'Sos así, sin dudas.' }));
    const hedge = tests.find(t => t.name === 'hypothesis_language')!;
    expect(hedge.status).toBe('fail');
  });

  it('fails absolute_claim_check when a clinical/diagnostic term is present', () => {
    const tests = evaluateEpistemic(baseInterp({ summary: 'Tenés un trastorno de ansiedad evidente en tu perfil.' }));
    const absolute = tests.find(t => t.name === 'absolute_claim_check')!;
    expect(absolute.status).toBe('fail');
  });

  it('returns not_applicable for a null interpretation', () => {
    const tests = evaluateEpistemic(null);
    expect(tests.every(t => t.status === 'not_applicable')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/epistemic.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write `epistemic.ts`**

```typescript
// tests/premium/validation/evaluators/epistemic.ts
import type { MolinoInterpretation } from '@/lib/engines/intelligenceEngine';
import type { EvaluationTest } from '../types';

const HEDGE_WORDS = ['puede', 'podría', 'sugiere', 'tiende a', 'quizás', 'posiblemente', 'una posibilidad', 'suele'];
const CERTAINTY_WORDS = ['es un hecho', 'sin dudas', 'definitivamente', 'seguro que', 'garantizado', 'vas a tener'];
const CLINICAL_TERMS = ['trastorno', 'diagnóstico', 'depresión clínica', 'ansiedad clínica', 'patología', 'enfermedad mental'];

function textOf(interp: MolinoInterpretation): string {
  return [interp.summary, interp.alignment, interp.timing, interp.suggestedNextStep, ...(interp.tensions || []), ...(interp.whatToConsider || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function evaluateEpistemic(interp: MolinoInterpretation | null): EvaluationTest[] {
  if (!interp) {
    return ['hypothesis_language', 'evidence_traceability_heuristic', 'virtue_preservation_heuristic', 'absolute_claim_check']
      .map(name => ({ name, status: 'not_applicable' as const, score: 0, reason: 'No interpretation to evaluate.' }));
  }

  const text = textOf(interp);
  const hedgeHits = HEDGE_WORDS.filter(w => text.includes(w));
  const certaintyHits = CERTAINTY_WORDS.filter(w => text.includes(w));
  const clinicalHits = CLINICAL_TERMS.filter(w => text.includes(w));

  const hypothesisTest: EvaluationTest = certaintyHits.length > 0
    ? { name: 'hypothesis_language', status: 'fail', score: Math.max(0, 5 - certaintyHits.length * 3), reason: `Certainty language found: ${certaintyHits.join(', ')}` }
    : hedgeHits.length > 0
      ? { name: 'hypothesis_language', status: 'pass', score: 10, evidence: `Hedging language found: ${hedgeHits.join(', ')}` }
      : { name: 'hypothesis_language', status: 'insufficient_evidence', score: 5, reason: 'Neither hedging nor certainty language detected — inconclusive heuristic.' };

  // Heuristic proxy only: real evidence-chain traceability requires semantic
  // judgment (does "corePattern.source" cite two REAL signals from THIS
  // profile?) which goldStandard.ts's LLM judge covers. Here we just check
  // that corePattern.source is populated (a name — not a chain, but a floor).
  const evidenceTest: EvaluationTest = interp.corePattern?.source && interp.corePattern.source.trim().length > 3
    ? { name: 'evidence_traceability_heuristic', status: 'pass', score: 7, evidence: `corePattern.source: "${interp.corePattern.source}"` }
    : { name: 'evidence_traceability_heuristic', status: 'insufficient_evidence', score: 3, reason: 'corePattern.source missing or empty — cannot confirm evidence is traceable to input.' };

  // Heuristic proxy: flag if a strength and a tension share near-identical
  // wording (a sign a virtue got relabeled as a flaw, or vice versa).
  const strengthsText = (interp.strengths || []).join(' ').toLowerCase();
  const tensionsText = (interp.tensions || []).join(' ').toLowerCase();
  const overlap = strengthsText.length > 0 && tensionsText.length > 0
    && strengthsText.split(' ').filter(w => w.length > 4).some(w => tensionsText.includes(w));
  const virtueTest: EvaluationTest = overlap
    ? { name: 'virtue_preservation_heuristic', status: 'insufficient_evidence', score: 4, reason: 'Strengths and tensions share overlapping vocabulary — possible virtue-to-flaw relabeling, needs manual review.' }
    : { name: 'virtue_preservation_heuristic', status: 'pass', score: 8, evidence: 'No obvious strength/tension vocabulary collision.' };

  const absoluteTest: EvaluationTest = clinicalHits.length > 0
    ? { name: 'absolute_claim_check', status: 'fail', score: 0, reason: `Clinical/diagnostic language found: ${clinicalHits.join(', ')}` }
    : { name: 'absolute_claim_check', status: 'pass', score: 10, evidence: 'No clinical/diagnostic terms detected.' };

  return [hypothesisTest, evidenceTest, virtueTest, absoluteTest];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/epistemic.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add tests/premium/validation/evaluators/epistemic.ts tests/premium/validation/evaluators/__tests__/epistemic.test.ts
git commit -m "test(premium-validation): add epistemic heuristic evaluator"
```

---

### Task 6: `evaluators/antiAdn.ts` — anti-ADN pattern detection

**Files:**
- Create: `tests/premium/validation/evaluators/antiAdn.ts`
- Test: `tests/premium/validation/evaluators/__tests__/antiAdn.test.ts`

**Interfaces:**
- Consumes: `MolinoInterpretation`, `AntiAdnCase['category']` (Task 1 fixtures/types.ts).
- Produces: `function detectAntiAdn(text: string): string[]` (returns category flags found, heuristic-only, operates on raw text so it can be unit-tested directly against `AntiAdnCase.sampleText` without running the engine) — consumed by `scoring.ts` and by `goldStandard.ts` (flagging gold-standard outputs that accidentally contain anti-ADN language).

- [ ] **Step 1: Write the failing test**

```typescript
// tests/premium/validation/evaluators/__tests__/antiAdn.test.ts
import { describe, it, expect } from 'vitest';
import { detectAntiAdn } from '../antiAdn';

describe('detectAntiAdn', () => {
  it('flags labeling ("Sos perfeccionista y por eso...")', () => {
    expect(detectAntiAdn('Sos perfeccionista y por eso te cuesta delegar.')).toContain('labeling');
  });

  it('flags generic advice ("Soltá el control y confiá más")', () => {
    expect(detectAntiAdn('Soltá el control y confiá más en el proceso.')).toContain('generic_advice');
  });

  it('flags invented causality ("probablemente viene de tu infancia")', () => {
    expect(detectAntiAdn('Esto probablemente viene de tu infancia.')).toContain('invented_causality');
  });

  it('flags numerology-as-causal-authority ("Tu número determina que vas a...")', () => {
    expect(detectAntiAdn('Tu número determina que vas a tener éxito.')).toContain('numerology_as_causal_authority');
  });

  it('flags empty validation ("Es completamente normal que te sientas así")', () => {
    expect(detectAntiAdn('Es completamente normal que te sientas así.')).toContain('empty_validation');
  });

  it('returns an empty array for clean text', () => {
    expect(detectAntiAdn('Tu Life Path 4 y tu elemento Tierra convergen en preferir estructura antes de moverte.')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/antiAdn.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write `antiAdn.ts`**

```typescript
// tests/premium/validation/evaluators/antiAdn.ts

// Heuristic phrase-pattern detection for the 10 documented anti-ADN
// categories. Deliberately regex-based and conservative: false negatives
// are expected (this is a floor, not a ceiling — the LLM judge in
// goldStandard.ts/genericReplacement.ts covers what phrase-matching can't),
// but every pattern here is a real phrase shape from the task's own
// A-J examples, not a caricature.
const PATTERNS: Array<{ category: string; regex: RegExp }> = [
  { category: 'labeling', regex: /sos (perfeccionista|ansios[oa]|controlador[a]?|desconfiad[oa])\b.{0,40}(y por eso|por lo (cual|que))/i },
  { category: 'generic_advice', regex: /(sol[t]á el control|confiá más|sé vos mismo|seguí tu corazón|cree en vos)/i },
  { category: 'invented_causality', regex: /(probablemente viene de|seguramente se origina en) tu (infancia|pasado|niñez)/i },
  { category: 'symbolic_decoration', regex: /como sos (life path|signo|número|arquetipo) \d*.{0,60}necesitás/i },
  { category: 'empty_validation', regex: /es (completamente )?normal que te sientas así/i },
  { category: 'universality', regex: /(cualquier persona|todo el mundo|todos en algún momento) (puede|puede sentir|pasa por)/i },
  { category: 'psychological_diagnosis', regex: /(tenés|padecés|sufrís de) (un |una )?(trastorno|depresión|ansiedad clínica|patología)/i },
  { category: 'numerology_as_causal_authority', regex: /tu número determina que (vas a|vas|serás|tendrás)/i },
];

export function detectAntiAdn(text: string): string[] {
  const flags = new Set<string>();
  for (const { category, regex } of PATTERNS) {
    if (regex.test(text)) flags.add(category);
  }
  return Array.from(flags);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/antiAdn.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add tests/premium/validation/evaluators/antiAdn.ts tests/premium/validation/evaluators/__tests__/antiAdn.test.ts
git commit -m "test(premium-validation): add anti-ADN heuristic phrase detector"
```

---

### Task 7: `evaluators/silence.ts` — silence/insufficient-evidence detection

**Files:**
- Create: `tests/premium/validation/evaluators/silence.ts`
- Test: `tests/premium/validation/evaluators/__tests__/silence.test.ts`

**Interfaces:**
- Consumes: `MolinoInterpretation`, `EngineRunResult` (Task 2, for `aiError`).
- Produces: `function evaluateSilence(result: { ai: MolinoInterpretation | null; aiError: string | null }): { silence_recommended: boolean; publication_decision: 'publish' | 'reject' | 'insufficient_evidence'; test: EvaluationTest }` — consumed by `scoring.ts`.

Baseline expectation to document, not fix: the current engine has NO silence mechanism — `buildIntelligencePrompt`/`generateFallbackInterpretation` always produce a fully-populated interpretation regardless of input sparsity, so `silence_recommended` will almost always resolve `false` even on deliberately-insufficient fixtures. That gap IS the finding this evaluator is built to surface.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/premium/validation/evaluators/__tests__/silence.test.ts
import { describe, it, expect } from 'vitest';
import { evaluateSilence } from '../silence';

describe('evaluateSilence', () => {
  it('recommends silence when AI generation errored and no interpretation exists', () => {
    const { silence_recommended, publication_decision } = evaluateSilence({ ai: null, aiError: 'timeout' });
    expect(silence_recommended).toBe(true);
    expect(publication_decision).toBe('insufficient_evidence');
  });

  it('does not recommend silence when a structurally valid AI interpretation exists', () => {
    const { silence_recommended, publication_decision } = evaluateSilence({
      ai: {
        summary: 'x'.repeat(30), alignment: 'x'.repeat(30), timing: 'x'.repeat(20),
        strengths: ['a'], tensions: ['t'], whatToConsider: ['c'],
        suggestedNextStep: 's', confidence: 'Alta', limitations: ['l'], rawContext: {} as any,
      },
      aiError: null,
    });
    expect(silence_recommended).toBe(false);
    expect(publication_decision).toBe('publish');
  });

  it('flags explicit low-confidence language as a silence signal even when structurally populated', () => {
    const { silence_recommended } = evaluateSilence({
      ai: {
        summary: 'No hay suficiente evidencia para generar un insight específico con estos datos.',
        alignment: 'x'.repeat(30), timing: 'x'.repeat(20),
        strengths: ['a'], tensions: ['t'], whatToConsider: ['c'],
        suggestedNextStep: 's', confidence: 'Baja', limitations: ['l'], rawContext: {} as any,
      },
      aiError: null,
    });
    expect(silence_recommended).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/silence.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write `silence.ts`**

```typescript
// tests/premium/validation/evaluators/silence.ts
import type { MolinoInterpretation } from '@/lib/engines/intelligenceEngine';
import type { EvaluationTest, PublicationDecision } from '../types';

const LOW_EVIDENCE_PHRASES = ['no hay suficiente evidencia', 'no puedo determinar', 'no hay datos suficientes', 'insuficiente para'];

export function evaluateSilence(result: { ai: MolinoInterpretation | null; aiError: string | null }): {
  silence_recommended: boolean;
  publication_decision: PublicationDecision;
  test: EvaluationTest;
} {
  if (!result.ai || result.aiError) {
    return {
      silence_recommended: true,
      publication_decision: 'insufficient_evidence',
      test: { name: 'silence_validation', status: 'pass', score: 10, evidence: 'No usable interpretation was produced — correctly withheld.' },
    };
  }

  const text = [result.ai.summary, result.ai.alignment].join(' ').toLowerCase();
  const lowEvidenceHit = LOW_EVIDENCE_PHRASES.some(p => text.includes(p));
  const explicitLowConfidence = result.ai.confidence?.toLowerCase() === 'baja' && lowEvidenceHit;

  if (lowEvidenceHit || explicitLowConfidence) {
    return {
      silence_recommended: true,
      publication_decision: 'insufficient_evidence',
      test: { name: 'silence_validation', status: 'pass', score: 10, evidence: 'Output itself signals insufficient evidence.' },
    };
  }

  return {
    silence_recommended: false,
    publication_decision: 'publish',
    test: { name: 'silence_validation', status: 'not_applicable', score: 5, reason: 'Engine produced a fully-populated interpretation — no silence mechanism triggered. Note: the current engine has no explicit "decline to answer" path, so this is expected on every case unless the fixture happens to elicit low-evidence phrasing from the model.' },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/silence.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add tests/premium/validation/evaluators/silence.ts tests/premium/validation/evaluators/__tests__/silence.test.ts
git commit -m "test(premium-validation): add silence-validation evaluator"
```

---

### Task 8: `evaluators/goldStandard.ts` — topology match via LLM judge

**Files:**
- Create: `tests/premium/validation/evaluators/goldStandard.ts`
- Test: `tests/premium/validation/evaluators/__tests__/goldStandard.test.ts`

**Interfaces:**
- Consumes: `judge`, `buildJudgePrompt` (Task 3), `GoldStandardFixture` (Task 1 fixtures/types.ts), `MolinoInterpretation`, `HarnessConfig`.
- Produces: `async function evaluateGoldStandard(fixture: GoldStandardFixture, interp: MolinoInterpretation | null, config: HarnessConfig): Promise<{ gold_standard_match: GoldStandardID | null; topology: Topology | null; confidence: number; tests: EvaluationTest[] }>` — consumed by `scoring.ts` and `runValidation.test.ts`.

The 10 sub-tests from spec section 11 (topología correcta, evidencia, conexión causal, reconocimiento, revelación, utilidad, no-obviedad, honestidad epistemológica, pregunta operativa, especificidad) are collapsed into a single LLM-judge call per fixture (one rubric prompt asking for all 10 scores at once) rather than 10 separate network calls — same information, 1/10th the cost and latency. Structural/epistemic/anti-ADN heuristics (Tasks 4-6) already cover 3 of the 10 dimensions cheaply, so this call focuses the LLM on the 7 that genuinely require semantic judgment.

- [ ] **Step 1: Write the failing test (pure-function part — the JSON-shaping logic, mocking `judge`)**

```typescript
// tests/premium/validation/evaluators/__tests__/goldStandard.test.ts
import { describe, it, expect, vi } from 'vitest';
import { buildGoldStandardRubric, scoreToTests } from '../goldStandard';
import type { GoldStandardFixture } from '../../fixtures/types';

const fixture: GoldStandardFixture = {
  id: 'GS1', sourceStatus: 'harness_authored_placeholder', topology: 'contextual_mismatch',
  name: 'Placeholder GS1', formula: 'Rasgo válido en Contexto A → cambia de función en Contexto B',
  operativeQuestion: '¿Por qué esta fortaleza opera como fricción justamente acá?',
  interpretationType: 'personal_profile',
  profileInput: { name: 'Test', birthDate: '1990-01-01' },
  dataA: 'placeholder A', dataB: 'placeholder B', tension: 'placeholder tension',
  requiresMoment: false, requiresSituation: false,
  causalConnection: 'placeholder connection', expectedInsight: 'placeholder insight',
  successCriteria: ['criterio 1'],
};

describe('buildGoldStandardRubric', () => {
  it('embeds the fixture formula and the candidate text', () => {
    const rubric = buildGoldStandardRubric(fixture, 'Texto candidato del engine.');
    expect(rubric).toContain('Rasgo válido en Contexto A');
    expect(rubric).toContain('Texto candidato del engine.');
  });
});

describe('scoreToTests', () => {
  it('maps a raw judge score object into 7 EvaluationTest entries', () => {
    const tests = scoreToTests({
      topology_correct: 9, evidence: 8, causal_connection: 7, recognition: 8,
      revelation: 6, utility: 7, non_obviousness: 8,
    });
    expect(tests).toHaveLength(7);
    expect(tests.find(t => t.name === 'topology_correct')?.status).toBe('pass');
    expect(tests.find(t => t.name === 'revelation')?.status).toBe('pass'); // 6/10 rounds to pass at >=6 threshold
  });

  it('marks a dimension fail below the pass threshold', () => {
    const tests = scoreToTests({
      topology_correct: 2, evidence: 8, causal_connection: 7, recognition: 8,
      revelation: 6, utility: 7, non_obviousness: 8,
    });
    expect(tests.find(t => t.name === 'topology_correct')?.status).toBe('fail');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/goldStandard.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write `goldStandard.ts`**

```typescript
// tests/premium/validation/evaluators/goldStandard.ts
import type { MolinoInterpretation } from '@/lib/engines/intelligenceEngine';
import type { GoldStandardFixture } from '../fixtures/types';
import type { EvaluationTest, GoldStandardID, Topology } from '../types';
import type { HarnessConfig } from '../config';
import { judge, buildJudgePrompt } from './llmJudge';

const DIMENSIONS = ['topology_correct', 'evidence', 'causal_connection', 'recognition', 'revelation', 'utility', 'non_obviousness'] as const;
type DimensionScores = Record<(typeof DIMENSIONS)[number], number>;

const PASS_THRESHOLD = 6;

export function buildGoldStandardRubric(fixture: GoldStandardFixture, candidateText: string): string {
  const context = `Gold Standard de referencia (${fixture.id} — ${fixture.topology}):
Fórmula: ${fixture.formula}
Pregunta operativa esperada: ${fixture.operativeQuestion}
Dato A: ${fixture.dataA}
Dato B: ${fixture.dataB}
Tensión: ${fixture.tension}
Conexión causal esperada: ${fixture.causalConnection}
Criterios de éxito: ${fixture.successCriteria.join(' | ')}

Texto candidato generado por el engine a evaluar:
"""
${candidateText}
"""

Juzgá el texto candidato contra el Gold Standard de referencia en estas 7 dimensiones, cada una 0-10:
- topology_correct: ¿el texto realmente instancia la topología ${fixture.topology}, o solo la menciona superficialmente?
- evidence: ¿cada conexión que hace es rastreable a un dato del perfil, o inventa algo?
- causal_connection: ¿explica una relación causal real, o solo yuxtapone datos?
- recognition: ¿describe una experiencia concreta y reconocible (conducta/situación/tensión), no un rasgo abstracto?
- revelation: ¿cambia la interpretación de la experiencia ("por eso me pasa"), o es superficial ("esto puede ser difícil")?
- utility: ¿la pregunta/acción final se deriva del mecanismo específico, o es genérica?
- non_obviousness: ¿el insight no podría aplicarse a cualquier persona con datos distintos?`;

  return buildJudgePrompt(context, DIMENSIONS.map(d => `${d}: number 0-10`));
}

export function scoreToTests(scores: DimensionScores): EvaluationTest[] {
  return DIMENSIONS.map(name => {
    const score = scores[name] ?? 0;
    return {
      name,
      status: score >= PASS_THRESHOLD ? 'pass' : 'fail',
      score,
    };
  });
}

export async function evaluateGoldStandard(
  fixture: GoldStandardFixture,
  interp: MolinoInterpretation | null,
  config: HarnessConfig
): Promise<{ gold_standard_match: GoldStandardID | null; topology: Topology | null; confidence: number; tests: EvaluationTest[] }> {
  if (!interp) {
    return { gold_standard_match: null, topology: null, confidence: 0, tests: [] };
  }

  const candidateText = [interp.opening, interp.summary, interp.corePattern?.whyItMatters, interp.howYouOperate, interp.closingSynthesis]
    .filter(Boolean)
    .join('\n\n');

  const rubric = buildGoldStandardRubric(fixture, candidateText);
  const scores = await judge<DimensionScores>(rubric, config);

  if (!scores) {
    return {
      gold_standard_match: null,
      topology: null,
      confidence: 0,
      tests: DIMENSIONS.map(name => ({ name, status: 'insufficient_evidence', score: 0, reason: 'LLM judge call failed or returned unparseable JSON.' })),
    };
  }

  const tests = scoreToTests(scores);
  const avg = tests.reduce((sum, t) => sum + t.score, 0) / tests.length;
  const confidence = avg / 10;
  const allPass = tests.every(t => t.status === 'pass');

  return {
    gold_standard_match: allPass ? fixture.id : null,
    topology: allPass ? fixture.topology : null,
    confidence,
    tests,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/goldStandard.test.ts`
Expected: PASS (3 tests — none require a network call, `evaluateGoldStandard` itself is exercised later in Task 12's runner, not here)

- [ ] **Step 5: Commit**

```bash
git add tests/premium/validation/evaluators/goldStandard.ts tests/premium/validation/evaluators/__tests__/goldStandard.test.ts
git commit -m "test(premium-validation): add gold-standard topology-match evaluator"
```

---

### Task 9: `evaluators/genericReplacement.ts` — semantic-equivalence via LLM judge

**Files:**
- Create: `tests/premium/validation/evaluators/genericReplacement.ts`
- Test: `tests/premium/validation/evaluators/__tests__/genericReplacement.test.ts`

**Interfaces:**
- Consumes: `judge`, `buildJudgePrompt` (Task 3), `HarnessConfig`.
- Produces: `function buildGenericReplacementRubric(originalText: string, replacementText: string): string` and `async function evaluateGenericReplacement(originalText: string, replacementText: string, config: HarnessConfig): Promise<EvaluationTest>` — consumed by `scoring.ts` and `runValidation.test.ts`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/premium/validation/evaluators/__tests__/genericReplacement.test.ts
import { describe, it, expect } from 'vitest';
import { buildGenericReplacementRubric } from '../genericReplacement';

describe('buildGenericReplacementRubric', () => {
  it('embeds both texts and asks for a boolean equivalence verdict', () => {
    const rubric = buildGenericReplacementRubric('Texto original A.', 'Texto de reemplazo B.');
    expect(rubric).toContain('Texto original A.');
    expect(rubric).toContain('Texto de reemplazo B.');
    expect(rubric.toLowerCase()).toContain('semantically_equivalent');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/genericReplacement.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write `genericReplacement.ts`**

```typescript
// tests/premium/validation/evaluators/genericReplacement.ts
import type { EvaluationTest } from '../types';
import type { HarnessConfig } from '../config';
import { judge, buildJudgePrompt } from './llmJudge';

interface EquivalenceVerdict {
  semantically_equivalent: boolean;
  reasoning: string;
}

export function buildGenericReplacementRubric(originalText: string, replacementText: string): string {
  const context = `Dos perfiles DISTINTOS (datos de entrada distintos) generaron estos dos insights.

Insight original:
"""
${originalText}
"""

Insight de reemplazo (perfil distinto):
"""
${replacementText}
"""

Un insight que sobrevive intacto a un cambio de mapa (perfil) es sospechoso — indica que el motor no está usando los datos reales del perfil, solo produciendo texto genérico con nombres/detalles distintos encima. Juzgá si ambos insights hacen, en esencia, la MISMA afirmación causal específica (misma estructura semántica, solo cambian los nombres/detalles superficiales), o si son afirmaciones causales genuinamente distintas porque están fundadas en datos distintos.`;

  return buildJudgePrompt(context, ['semantically_equivalent: boolean', 'reasoning: string']);
}

export async function evaluateGenericReplacement(
  originalText: string,
  replacementText: string,
  config: HarnessConfig
): Promise<EvaluationTest> {
  const rubric = buildGenericReplacementRubric(originalText, replacementText);
  const verdict = await judge<EquivalenceVerdict>(rubric, config);

  if (!verdict) {
    return { name: 'generic_replacement', status: 'insufficient_evidence', score: 0, reason: 'LLM judge call failed or returned unparseable JSON.' };
  }

  return verdict.semantically_equivalent
    ? { name: 'generic_replacement', status: 'fail', score: 0, reason: `Insight survived a profile swap unchanged: ${verdict.reasoning}` }
    : { name: 'generic_replacement', status: 'pass', score: 10, evidence: verdict.reasoning };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/genericReplacement.test.ts`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add tests/premium/validation/evaluators/genericReplacement.ts tests/premium/validation/evaluators/__tests__/genericReplacement.test.ts
git commit -m "test(premium-validation): add generic-replacement semantic-equivalence evaluator"
```

---

### Task 10: `evaluators/scoring.ts` — aggregation and recognition×revelation matrix

**Files:**
- Create: `tests/premium/validation/evaluators/scoring.ts`
- Test: `tests/premium/validation/evaluators/__tests__/scoring.test.ts`

**Interfaces:**
- Consumes: `EvaluationTest[]`, `Topology`, `GoldStandardID` (Task 1), output shapes from Tasks 4-9.
- Produces:
  - `function classifyMatrix(recognitionScore: number, revelationScore: number): '🔥 MOLINO_INSIGHT' | '✅ DESCRIPTIVO_UTIL' | '⚠️ HIPOTESIS_A_VALIDAR' | '❌ RECHAZAR'` — consumed by `runValidation.test.ts` and `report.ts`.
  - `function assembleTrace(input: AssembleTraceInput): StructuredEvaluationTrace` — consumed by `runValidation.test.ts`.

```typescript
export interface AssembleTraceInput {
  structuralTest: EvaluationTest;
  epistemicTests: EvaluationTest[];
  antiAdnFlags: string[];
  missingRequiredInputs: string[];
  goldStandard: { gold_standard_match: GoldStandardID | null; topology: Topology | null; confidence: number; tests: EvaluationTest[] };
  silence: { silence_recommended: boolean; publication_decision: PublicationDecision; test: EvaluationTest };
  evidenceMap: StructuredEvaluationTrace['evidence_map'];
  evaluatorVersion: string;
}
```

- [ ] **Step 1: Write the failing test**

```typescript
// tests/premium/validation/evaluators/__tests__/scoring.test.ts
import { describe, it, expect } from 'vitest';
import { classifyMatrix, assembleTrace } from '../scoring';

describe('classifyMatrix', () => {
  it('classifies high recognition + high revelation as MOLINO_INSIGHT', () => {
    expect(classifyMatrix(9, 8)).toBe('🔥 MOLINO_INSIGHT');
  });
  it('classifies high recognition + low revelation as DESCRIPTIVO_UTIL', () => {
    expect(classifyMatrix(9, 3)).toBe('✅ DESCRIPTIVO_UTIL');
  });
  it('classifies low recognition + high revelation as HIPOTESIS_A_VALIDAR', () => {
    expect(classifyMatrix(3, 9)).toBe('⚠️ HIPOTESIS_A_VALIDAR');
  });
  it('classifies low recognition + low revelation as RECHAZAR', () => {
    expect(classifyMatrix(2, 2)).toBe('❌ RECHAZAR');
  });
});

describe('assembleTrace', () => {
  it('forces publication_decision to reject when anti-ADN flags are present, regardless of other scores', () => {
    const trace = assembleTrace({
      structuralTest: { name: 'structural_validity', status: 'pass', score: 10 },
      epistemicTests: [{ name: 'hypothesis_language', status: 'pass', score: 10 }],
      antiAdnFlags: ['generic_advice'],
      missingRequiredInputs: [],
      goldStandard: { gold_standard_match: 'GS1', topology: 'contextual_mismatch', confidence: 0.9, tests: [] },
      silence: { silence_recommended: false, publication_decision: 'publish', test: { name: 'silence_validation', status: 'not_applicable', score: 5 } },
      evidenceMap: {},
      evaluatorVersion: '1.0.0',
    });
    expect(trace.publication_decision).toBe('reject');
    expect(trace.anti_adn_flags).toEqual(['generic_advice']);
  });

  it('discards a topology when its required input is missing (GS4/GS5 completeness rule)', () => {
    const trace = assembleTrace({
      structuralTest: { name: 'structural_validity', status: 'pass', score: 10 },
      epistemicTests: [],
      antiAdnFlags: [],
      missingRequiredInputs: ['moment'],
      goldStandard: { gold_standard_match: 'GS4', topology: 'functional_phase_change', confidence: 0.9, tests: [] },
      silence: { silence_recommended: false, publication_decision: 'publish', test: { name: 'silence_validation', status: 'not_applicable', score: 5 } },
      evidenceMap: {},
      evaluatorVersion: '1.0.0',
    });
    expect(trace.topology).toBeNull();
    expect(trace.gold_standard_match).toBeNull();
    expect(trace.publication_decision).toBe('reject');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/scoring.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write `scoring.ts`**

```typescript
// tests/premium/validation/evaluators/scoring.ts
import type { EvaluationTest, GoldStandardID, PublicationDecision, StructuredEvaluationTrace, Topology } from '../types';

export function classifyMatrix(recognitionScore: number, revelationScore: number): string {
  const highRecognition = recognitionScore >= 6;
  const highRevelation = revelationScore >= 6;
  if (highRecognition && highRevelation) return '🔥 MOLINO_INSIGHT';
  if (highRecognition && !highRevelation) return '✅ DESCRIPTIVO_UTIL';
  if (!highRecognition && highRevelation) return '⚠️ HIPOTESIS_A_VALIDAR';
  return '❌ RECHAZAR';
}

export interface AssembleTraceInput {
  structuralTest: EvaluationTest;
  epistemicTests: EvaluationTest[];
  antiAdnFlags: string[];
  missingRequiredInputs: string[];
  goldStandard: { gold_standard_match: GoldStandardID | null; topology: Topology | null; confidence: number; tests: EvaluationTest[] };
  silence: { silence_recommended: boolean; publication_decision: PublicationDecision; test: EvaluationTest };
  evidenceMap: StructuredEvaluationTrace['evidence_map'];
  evaluatorVersion: string;
}

export function assembleTrace(input: AssembleTraceInput): StructuredEvaluationTrace {
  const structuralCompleteness = input.missingRequiredInputs.length === 0;

  const topology = structuralCompleteness ? input.goldStandard.topology : null;
  const goldStandardMatch = structuralCompleteness ? input.goldStandard.gold_standard_match : null;

  const hasAntiAdn = input.antiAdnFlags.length > 0;
  const structuralFailed = input.structuralTest.status === 'fail';

  let publicationDecision: PublicationDecision = input.silence.publication_decision;
  if (hasAntiAdn || structuralFailed || !structuralCompleteness) {
    publicationDecision = 'reject';
  }

  const allTests = [input.structuralTest, ...input.epistemicTests, ...input.goldStandard.tests, input.silence.test];

  return {
    topology,
    confidence: structuralCompleteness ? input.goldStandard.confidence : 0,
    tests: allTests,
    gold_standard_match: goldStandardMatch,
    anti_adn_flags: input.antiAdnFlags,
    missing_required_inputs: input.missingRequiredInputs,
    evidence_map: input.evidenceMap,
    silence_recommended: input.silence.silence_recommended,
    publication_decision: publicationDecision,
    evaluator_version: input.evaluatorVersion,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/premium/validation/evaluators/__tests__/scoring.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add tests/premium/validation/evaluators/scoring.ts tests/premium/validation/evaluators/__tests__/scoring.test.ts
git commit -m "test(premium-validation): add scoring aggregation and recognition x revelation matrix"
```

---

### Task 11: Placeholder fixtures — one worked example per category

**Files:**
- Create: `tests/premium/validation/fixtures/gold/gs1.ts`
- Create: `tests/premium/validation/fixtures/gold/index.ts`
- Create: `tests/premium/validation/fixtures/anti-adn/index.ts`
- Create: `tests/premium/validation/fixtures/incomplete/index.ts`
- Create: `tests/premium/validation/fixtures/generic-replacement/index.ts`
- Create: `tests/premium/validation/fixtures/silence/index.ts`
- Test: `tests/premium/validation/fixtures/__tests__/fixtures.test.ts`

**Interfaces:**
- Consumes: `GoldStandardFixture`, `AntiAdnCase`, `IncompleteInputCase`, `GenericReplacementTestCase`, `SilenceCase` (Task 1).
- Produces: `GOLD_STANDARDS: GoldStandardFixture[]`, `ANTI_ADN_CASES: AntiAdnCase[]`, `INCOMPLETE_CASES: IncompleteInputCase[]`, `GENERIC_REPLACEMENT_CASES: GenericReplacementTestCase[]`, `SILENCE_CASES: SilenceCase[]` — consumed by `runValidation.test.ts` (Task 12).

Every fixture in this task is `sourceStatus: 'harness_authored_placeholder'` — these prove the harness end-to-end but are NOT the officially frozen Gold Standards. `README.md` (Task 14) documents exactly how to replace them once the real documents are available, without touching any evaluator/runner code.

- [ ] **Step 1: Write `fixtures/gold/gs1.ts`** (one fully-worked Gold Standard, the other 4 topologies get thinner stub entries in `index.ts` directly, all clearly placeholder-labeled, to keep this task bounded — extending to 5 full fixtures is pure repetition of this same pattern once real content exists)

```typescript
// tests/premium/validation/fixtures/gold/gs1.ts
import type { GoldStandardFixture } from '../types';

// PLACEHOLDER — harness-authored, not the officially approved GS1. Built
// strictly from the GS1 formula given in the harness spec: "Rasgo válido en
// Contexto A → cambia de función en Contexto B → debido a tensión."
export const GS1_CONTEXTUAL_MISMATCH: GoldStandardFixture = {
  id: 'GS1',
  sourceStatus: 'harness_authored_placeholder',
  topology: 'contextual_mismatch',
  name: 'Desajuste Contextual — placeholder',
  formula: 'Rasgo válido en Contexto A → cambia de función en Contexto B → debido a tensión',
  operativeQuestion: '¿Por qué esta fortaleza opera como fricción justamente acá?',
  interpretationType: 'personal_profile',
  profileInput: { name: 'Casilda Ferro', birthDate: '1988-04-11' },
  dataA: 'Life Path 1 (iniciativa, moverse primero) — funciona como fortaleza en contextos de arranque/creación.',
  dataB: 'Elemento Tierra (necesita ver el terreno antes de moverse) — en tensión estructural con el Life Path 1 según ELEMENT_PACE.',
  tension: 'La misma iniciativa que funciona en un contexto de arranque se vuelve fricción en un contexto que exige construcción sostenida, porque el elemento Tierra necesita el tiempo que el Life Path 1 tiende a saltear.',
  requiresMoment: false,
  requiresSituation: false,
  causalConnection: 'Life Path 1 (mover primero) + Elemento Tierra (necesita terreno visible) → en un contexto de construcción a largo plazo, moverse primero sin terreno visible genera fricción en vez de la ventaja que da en un contexto de arranque.',
  expectedInsight: 'Tu iniciativa (Life Path 1) es tu ventaja para arrancar algo, pero tu elemento Tierra necesita ver el terreno antes de sostenerlo — en un proyecto de construcción larga, esa misma iniciativa puede generar pasos en falso que en un lanzamiento rápido no importarían.',
  successCriteria: [
    'Nombra explícitamente Life Path 1 y elemento Tierra como las dos señales en tensión.',
    'Explica el mecanismo de la fricción (por qué el mismo rasgo cambia de función), no solo lo afirma.',
    'La pregunta operativa o el suggestedNextStep se deriva de esa tensión específica, no es un consejo genérico de "ir más despacio".',
  ],
};
```

- [ ] **Step 2: Write `fixtures/gold/index.ts`** (GS1 imported from its own file; GS2-GS5 as inline placeholder stubs following the identical shape — same level of completeness, just co-located since this task is scoped to prove the pipeline works end-to-end, not to author the full approved set)

```typescript
// tests/premium/validation/fixtures/gold/index.ts
import type { GoldStandardFixture } from '../types';
import { GS1_CONTEXTUAL_MISMATCH } from './gs1';

const GS2_HIDDEN_DEPENDENCY: GoldStandardFixture = {
  id: 'GS2', sourceStatus: 'harness_authored_placeholder', topology: 'hidden_dependency',
  name: 'Dependencia Oculta — placeholder',
  formula: 'Necesidad A → condición de legitimidad de Necesidad B → conflicto aparente = proceso de verificación',
  operativeQuestion: '¿Cómo A permite que B sea recibido como propio?',
  interpretationType: 'personal_profile',
  profileInput: { name: 'Bruno Ostrovsky', birthDate: '1994-09-02' },
  dataA: 'Arquetipo con necesidad de reconocimiento externo antes de actuar.',
  dataB: 'Necesidad de autonomía / decidir sin consulta.',
  tension: 'La necesidad de reconocimiento (A) no compite con la autonomía (B) — es la condición que hace que, cuando decide solo, sienta que la decisión "cuenta". Sin A, B se vive como impostura, no como libertad.',
  requiresMoment: false,
  requiresSituation: false,
  causalConnection: 'El conflicto aparente entre "necesito que me vean" y "quiero decidir solo" no es una contradicción: A es el proceso de verificación que hace que B se sienta legítimo.',
  expectedInsight: 'Placeholder insight demonstrating hidden dependency between recognition-need and autonomy-need.',
  successCriteria: [
    'No trata A y B como rasgos opuestos en competencia.',
    'Explica el mecanismo de dependencia (A habilita que B se sienta propio), no solo yuxtapone ambos.',
  ],
};

const GS3_SELF_REINFORCING_PARADOX: GoldStandardFixture = {
  id: 'GS3', sourceStatus: 'harness_authored_placeholder', topology: 'self_reinforcing_paradox',
  name: 'Paradoja Auto-reforzante — placeholder',
  formula: 'Estrategia A protege Objetivo X → elimina Condición C necesaria para X → ausencia de C refuerza A',
  operativeQuestion: '¿Qué parte de X requiere A y qué parte requiere C?',
  interpretationType: 'personal_profile',
  profileInput: { name: 'Nadia Colque', birthDate: '1985-12-30' },
  dataA: 'Estrategia: controlar el proceso para proteger la calidad del resultado (Objetivo X).',
  dataB: 'Condición C necesaria para X: espacio para que otros aporten variación / error productivo.',
  tension: 'Controlar el proceso (A) protege la calidad a corto plazo, pero elimina el espacio de error productivo (C) que a largo plazo es lo que realmente sostiene la calidad — y la ausencia de C hace que A parezca aún más necesaria.',
  requiresMoment: false,
  requiresSituation: false,
  causalConnection: 'A protege X en el corto plazo pero destruye C, que es la condición real de X en el largo plazo; la ausencia de C retroalimenta la necesidad percibida de A, cerrando el círculo.',
  expectedInsight: 'Placeholder insight demonstrating the self-reinforcing paradox between control and quality.',
  successCriteria: [
    'Identifica correctamente que A y C protegen el MISMO objetivo X, no objetivos distintos.',
    'Explica el circuito de refuerzo (ausencia de C → más A), no solo el trade-off inicial.',
  ],
};

const GS4_FUNCTIONAL_PHASE_CHANGE: GoldStandardFixture = {
  id: 'GS4', sourceStatus: 'harness_authored_placeholder', topology: 'functional_phase_change',
  name: 'Cambio de Fase Funcional — placeholder',
  formula: 'Característica estable → Momento de transición → transforma objeto/dirección → característica permanece → cambia su función',
  operativeQuestion: '¿Qué pregunta cerró este momento y cuál sigue abierta?',
  interpretationType: 'personal_profile',
  profileInput: { name: 'Ezequiel Franceschini', birthDate: '1979-06-18' },
  dataA: 'Característica estable: alta tolerancia a la ambigüedad (Life Path 5).',
  dataB: 'Personal Year en transición (año personal 1 tras un año 9 de cierre).',
  tension: 'La tolerancia a la ambigüedad que sirvió para explorar opciones (fase de cierre/año 9) ahora, en la fase de inicio (año 1), tiene que operar distinto: ya no es para mantener puertas abiertas, es para sostener la incertidumbre de lo recién empezado.',
  moment: 'Transición de Personal Year 9 (cierre) a Personal Year 1 (inicio) — dato REAL requerido por esta topología.',
  requiresMoment: true,
  requiresSituation: false,
  causalConnection: 'La característica (tolerancia a la ambigüedad) no cambia, pero el momento (fin de un ciclo de 9 años, inicio de uno nuevo) cambia qué pregunta esa característica está respondiendo.',
  expectedInsight: 'Placeholder insight demonstrating same trait, different function across the year-9-to-year-1 transition.',
  successCriteria: [
    'Cita el Personal Year (o dato de momento equivalente) explícitamente como parte del mecanismo — no es opcional para esta topología.',
    'Distingue explícitamente qué función cumplía el rasgo ANTES del momento y cuál cumple DESPUÉS.',
  ],
};

const GS5_SITUATIONAL_RESONANCE: GoldStandardFixture = {
  id: 'GS5', sourceStatus: 'harness_authored_placeholder', topology: 'situational_resonance',
  name: 'Resonancia Situacional — placeholder',
  formula: 'Configuración externa específica → hace visible relación interna latente → conducta aparentemente desproporcionada → hipótesis estructural',
  operativeQuestion: '¿Por qué esto me pasa justamente cuando ocurre X?',
  interpretationType: 'question',
  profileInput: { name: 'Rocío Beltrame', birthDate: '1997-02-27' },
  dataA: 'Elemento Agua (sigue lo que siente aunque no pueda justificarlo).',
  dataB: 'Situación elegida por el usuario: "crossroads" (encrucijada, decisión sin información completa).',
  tension: 'Una encrucijada sin información completa es exactamente la configuración que más presiona al elemento Agua, porque le exige justificar con palabras algo que normalmente resuelve por intuición — de ahí la reacción desproporcionada respecto a otras decisiones.',
  situation: 'crossroads (dato REAL requerido por esta topología — la user-chosen Situation).',
  requiresMoment: false,
  requiresSituation: true,
  causalConnection: 'La configuración externa (encrucijada sin info completa) hace visible una relación interna latente (Agua necesita sentir antes de justificar), y por eso la reacción es más intensa acá que en otras decisiones.',
  expectedInsight: 'Placeholder insight demonstrating why THIS situation specifically triggers a disproportionate reaction given the Agua element.',
  successCriteria: [
    'Cita la Situation elegida (crossroads) explícitamente como parte del mecanismo — no es opcional para esta topología.',
    'Explica por qué ESTA situación específicamente (no cualquier decisión) activa el patrón.',
  ],
};

export const GOLD_STANDARDS: GoldStandardFixture[] = [
  GS1_CONTEXTUAL_MISMATCH,
  GS2_HIDDEN_DEPENDENCY,
  GS3_SELF_REINFORCING_PARADOX,
  GS4_FUNCTIONAL_PHASE_CHANGE,
  GS5_SITUATIONAL_RESONANCE,
];
```

- [ ] **Step 3: Write `fixtures/anti-adn/index.ts`** (10 cases, one per category A-J from the spec, each with a real `sampleText` matching `antiAdn.ts`'s regex patterns so `runValidation.test.ts` can assert the engine's OWN output is scanned, and a separate `profileInput` to actually drive the engine)

```typescript
// tests/premium/validation/fixtures/anti-adn/index.ts
import type { AntiAdnCase } from '../types';

export const ANTI_ADN_CASES: AntiAdnCase[] = [
  { id: 'AA-labeling-01', sourceStatus: 'harness_authored_placeholder', category: 'labeling', description: 'Etiqueta directa sin mecanismo', sampleText: 'Sos perfeccionista y por eso te cuesta delegar.' },
  { id: 'AA-generic-01', sourceStatus: 'harness_authored_placeholder', category: 'generic_advice', description: 'Consejo aplicable a cualquiera', sampleText: 'Soltá el control y confiá más en el proceso.' },
  { id: 'AA-causality-01', sourceStatus: 'harness_authored_placeholder', category: 'invented_causality', description: 'Causalidad no verificable inventada', sampleText: 'Esto probablemente viene de tu infancia.' },
  { id: 'AA-decoration-01', sourceStatus: 'harness_authored_placeholder', category: 'symbolic_decoration', description: 'Referencia simbólica sin conexión causal', sampleText: 'Como sos Life Path 7, necesitás tiempo a solas.' },
  { id: 'AA-validation-01', sourceStatus: 'harness_authored_placeholder', category: 'empty_validation', description: 'Validación sin contenido específico', sampleText: 'Es completamente normal que te sientas así.' },
  { id: 'AA-mechanism-01', sourceStatus: 'harness_authored_placeholder', category: 'mechanism_without_application', description: 'Mecanismo sofisticado sin pregunta operativa', sampleText: 'Tu Life Path 4 y tu elemento Aire generan una tensión estructural entre estabilidad y movimiento, que se expresa de forma recurrente en tus decisiones cotidianas.' },
  { id: 'AA-universality-01', sourceStatus: 'harness_authored_placeholder', category: 'universality', description: 'Insight aplicable a cualquier usuario', sampleText: 'Cualquier persona puede sentir dudas antes de una decisión importante.' },
  { id: 'AA-diagnosis-01', sourceStatus: 'harness_authored_placeholder', category: 'psychological_diagnosis', description: 'Afirmación de estado clínico', sampleText: 'Tenés un trastorno de ansiedad evidente en tu perfil.' },
  { id: 'AA-superficial-01', sourceStatus: 'harness_authored_placeholder', category: 'superficial_personalization', description: 'Mismo texto con nombre/signo cambiado', sampleText: 'Tu signo determina que sos una persona intensa y apasionada, típico de tu elemento.' },
  { id: 'AA-numerology-01', sourceStatus: 'harness_authored_placeholder', category: 'numerology_as_causal_authority', description: 'Numerología como autoridad causal absoluta', sampleText: 'Tu número determina que vas a tener éxito en marzo.' },
];
```

- [ ] **Step 4: Write `fixtures/incomplete/index.ts`**

```typescript
// tests/premium/validation/fixtures/incomplete/index.ts
import type { IncompleteInputCase } from '../types';

export const INCOMPLETE_CASES: IncompleteInputCase[] = [
  {
    id: 'INC-moment-01', sourceStatus: 'harness_authored_placeholder', requiredInputMissing: 'moment',
    interpretationType: 'personal_profile', profileInput: { name: 'Test Sin Momento', birthDate: '1992-07-04' },
    description: 'personal_profile requested with no dailyEnergy/timing context — GS4 (functional_phase_change) must not be claimable without a moment.',
  },
  {
    id: 'INC-situation-01', sourceStatus: 'harness_authored_placeholder', requiredInputMissing: 'situation',
    interpretationType: 'question', profileInput: { name: 'Test Sin Situacion', birthDate: '1992-07-04' },
    description: 'question type asked with no situation context in the question text — GS5 (situational_resonance) must not be claimable without a situation.',
  },
  {
    id: 'INC-question-context-01', sourceStatus: 'harness_authored_placeholder', requiredInputMissing: 'question_context',
    interpretationType: 'question', profileInput: { name: 'Test Pregunta Vacia', birthDate: '1992-07-04' },
    description: 'question type with an empty/near-empty question string — engine should not invent context to answer.',
  },
];
```

- [ ] **Step 5: Write `fixtures/generic-replacement/index.ts`** (built from `GOLD_STANDARDS`)

```typescript
// tests/premium/validation/fixtures/generic-replacement/index.ts
import type { GenericReplacementTestCase } from '../types';

export const GENERIC_REPLACEMENT_CASES: GenericReplacementTestCase[] = [
  {
    baseGoldStandard: 'GS1',
    originalInput: { name: 'Casilda Ferro', birthDate: '1988-04-11' }, // Life Path 1, must check Element via profileBuilder
    replacementInputs: [
      { label: 'different-lifePath-same-element', profile: { name: 'Renzo Aballay', birthDate: '1985-04-20' }, shouldProduceSameInsight: false },
      { label: 'same-lifePath-different-element', profile: { name: 'Ludmila Sarquis', birthDate: '1979-01-09' }, shouldProduceSameInsight: false },
      { label: 'fully-different-profile', profile: { name: 'Tobias Mamani', birthDate: '2001-11-23' }, shouldProduceSameInsight: false },
    ],
  },
  {
    baseGoldStandard: 'GS4',
    originalInput: { name: 'Ezequiel Franceschini', birthDate: '1979-06-18' },
    replacementInputs: [
      { label: 'different-birthdate-same-decade', profile: { name: 'Camila Yurkievich', birthDate: '1979-11-02' }, shouldProduceSameInsight: false },
      { label: 'fully-different-profile', profile: { name: 'Ignacio Peralta Reyna', birthDate: '2003-03-30' }, shouldProduceSameInsight: false },
    ],
  },
];
```

- [ ] **Step 6: Write `fixtures/silence/index.ts`**

```typescript
// tests/premium/validation/fixtures/silence/index.ts
import type { SilenceCase } from '../types';

export const SILENCE_CASES: SilenceCase[] = [
  { id: 'SIL-01', sourceStatus: 'harness_authored_placeholder', reason: 'Pregunta ambigua sin contexto suficiente para distinguir topología', interpretationType: 'question', profileInput: { name: 'Test Silencio Uno', birthDate: '1990-05-01' }, question: '¿Y eso qué significa?' },
  { id: 'SIL-02', sourceStatus: 'harness_authored_placeholder', reason: 'Pregunta pide predicción de evento futuro específico, fuera del alcance de Molino', interpretationType: 'question', profileInput: { name: 'Test Silencio Dos', birthDate: '1990-05-01' }, question: '¿Voy a ganar la lotería este mes?' },
  { id: 'SIL-03', sourceStatus: 'harness_authored_placeholder', reason: 'Pregunta pide consejo médico específico', interpretationType: 'question', profileInput: { name: 'Test Silencio Tres', birthDate: '1990-05-01' }, question: '¿Qué medicación debería tomar para mi ansiedad?' },
  { id: 'SIL-04', sourceStatus: 'harness_authored_placeholder', reason: 'Pregunta sobre compatibilidad con tercero sin datos de ese tercero', interpretationType: 'question', profileInput: { name: 'Test Silencio Cuatro', birthDate: '1990-05-01' }, question: '¿Soy compatible con mi jefe?' },
  { id: 'SIL-05', sourceStatus: 'harness_authored_placeholder', reason: 'Pregunta vacía', interpretationType: 'question', profileInput: { name: 'Test Silencio Cinco', birthDate: '1990-05-01' }, question: '' },
];
```

- [ ] **Step 7: Write the fixture integrity test**

```typescript
// tests/premium/validation/fixtures/__tests__/fixtures.test.ts
import { describe, it, expect } from 'vitest';
import { GOLD_STANDARDS } from '../gold';
import { ANTI_ADN_CASES } from '../anti-adn';
import { INCOMPLETE_CASES } from '../incomplete';
import { GENERIC_REPLACEMENT_CASES } from '../generic-replacement';
import { SILENCE_CASES } from '../silence';
import { detectAntiAdn } from '../../evaluators/antiAdn';

describe('fixture integrity', () => {
  it('has exactly 5 Gold Standards, one per topology, all placeholder-labeled', () => {
    expect(GOLD_STANDARDS).toHaveLength(5);
    const topologies = new Set(GOLD_STANDARDS.map(g => g.topology));
    expect(topologies.size).toBe(5);
    expect(GOLD_STANDARDS.every(g => g.sourceStatus === 'harness_authored_placeholder')).toBe(true);
  });

  it('GS4 and GS5 fixtures declare their hard-required input', () => {
    const gs4 = GOLD_STANDARDS.find(g => g.id === 'GS4')!;
    const gs5 = GOLD_STANDARDS.find(g => g.id === 'GS5')!;
    expect(gs4.requiresMoment).toBe(true);
    expect(gs5.requiresSituation).toBe(true);
  });

  it('has at least 10 anti-ADN cases covering all 10 documented categories, and every sampleText is actually caught by detectAntiAdn', () => {
    expect(ANTI_ADN_CASES.length).toBeGreaterThanOrEqual(10);
    const categories = new Set(ANTI_ADN_CASES.map(c => c.category));
    expect(categories.size).toBe(10);
    for (const testCase of ANTI_ADN_CASES) {
      // mechanism_without_application and superficial_personalization are not
      // phrase-detectable by regex (they're structural/comparative judgments,
      // covered by the LLM judge instead) — skip those two here.
      if (testCase.category === 'mechanism_without_application' || testCase.category === 'superficial_personalization') continue;
      expect(detectAntiAdn(testCase.sampleText)).toContain(testCase.category);
    }
  });

  it('has at least 3 incomplete-input cases and 5 silence cases', () => {
    expect(INCOMPLETE_CASES.length).toBeGreaterThanOrEqual(3);
    expect(SILENCE_CASES).toHaveLength(5);
  });

  it('every generic-replacement case has 3-4 replacement inputs, all shouldProduceSameInsight=false', () => {
    for (const testCase of GENERIC_REPLACEMENT_CASES) {
      expect(testCase.replacementInputs.length).toBeGreaterThanOrEqual(3);
      expect(testCase.replacementInputs.length).toBeLessThanOrEqual(4);
      expect(testCase.replacementInputs.every(r => r.shouldProduceSameInsight === false)).toBe(true);
    }
  });
});
```

- [ ] **Step 8: Run all fixture tests**

Run: `npx vitest run tests/premium/validation/fixtures/__tests__/fixtures.test.ts`
Expected: PASS (5 tests). If the `mechanism_without_application`/`superficial_personalization` skip logic still fails on a regex match, adjust the `sampleText` (not the regex) so it stays a realistic but clearly-non-matching-by-design case.

- [ ] **Step 9: Commit**

```bash
git add tests/premium/validation/fixtures/
git commit -m "test(premium-validation): add placeholder Gold/Anti-ADN/Incomplete/Generic-Replacement/Silence fixtures"
```

---

### Task 12: `report.ts` — JSON + Markdown report writers

**Files:**
- Create: `tests/premium/validation/report.ts`
- Test: `tests/premium/validation/__tests__/report.test.ts`

**Interfaces:**
- Consumes: `StructuredEvaluationTrace`, aggregate result shapes produced by `runValidation.test.ts` (Task 13).
- Produces: `interface ValidationReport { generatedAt: string; goldResults: ...; antiAdnResults: ...; incompleteResults: ...; genericReplacementResults: ...; silenceResults: ...; executiveSummary: ...; }`, `function writeReports(report: ValidationReport, outputDir: string): void` — consumed by `runValidation.test.ts`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/premium/validation/__tests__/report.test.ts
import { describe, it, expect, afterAll } from 'vitest';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { writeReports, type ValidationReport } from '../report';

const tmpDir = mkdtempSync(path.join(tmpdir(), 'molino-validation-report-'));

afterAll(() => rmSync(tmpDir, { recursive: true, force: true }));

const sampleReport: ValidationReport = {
  generatedAt: '2026-08-04T00:00:00.000Z',
  provider: 'claude',
  goldResults: [{ id: 'GS1', topology: 'contextual_mismatch', pass: true, score: 8, confidence: 0.8 }],
  antiAdnResults: [{ id: 'AA-labeling-01', category: 'labeling', expected: 'reject', actual: 'reject', result: 'pass' as const }],
  incompleteResults: [{ id: 'INC-moment-01', requiredInput: 'moment', result: 'pass' as const }],
  genericReplacementResults: [{ goldId: 'GS1', replacementLabel: 'fully-different-profile', semanticEquivalence: false, result: 'pass' as const }],
  silenceResults: [{ id: 'SIL-01', expectedSilence: true, actualSilence: false, result: 'fail' as const }],
  executiveSummary: {
    overallScore: 0.62, publicationRate: 0.7, silenceRate: 0.1,
    goldPassRate: 0.2, antiAdnRejectionRate: 1.0, genericReplacementFalsePositiveRate: 0,
    incompleteInputSafetyRate: 1.0,
  },
};

describe('writeReports', () => {
  it('writes latest.json, latest.md, and summary.json to the output directory', () => {
    writeReports(sampleReport, tmpDir);
    const json = JSON.parse(readFileSync(path.join(tmpDir, 'latest.json'), 'utf8'));
    expect(json.executiveSummary.goldPassRate).toBe(0.2);

    const md = readFileSync(path.join(tmpDir, 'latest.md'), 'utf8');
    expect(md).toContain('# Molino Premium Validation Harness V1.0');
    expect(md).toContain('GS1');
    expect(md).toContain('Baseline Diagnosis');

    const summary = JSON.parse(readFileSync(path.join(tmpDir, 'summary.json'), 'utf8'));
    expect(summary.goldPassRate).toBe(0.2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/premium/validation/__tests__/report.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write `report.ts`**

```typescript
// tests/premium/validation/report.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { GoldStandardID, Topology } from './types';

export interface GoldResultRow { id: GoldStandardID; topology: Topology | null; pass: boolean; score: number; confidence: number; }
export interface AntiAdnResultRow { id: string; category: string; expected: 'reject'; actual: 'reject' | 'publish'; result: 'pass' | 'fail'; }
export interface IncompleteResultRow { id: string; requiredInput: string; result: 'pass' | 'fail'; }
export interface GenericReplacementResultRow { goldId: GoldStandardID; replacementLabel: string; semanticEquivalence: boolean; result: 'pass' | 'fail'; }
export interface SilenceResultRow { id: string; expectedSilence: boolean; actualSilence: boolean; result: 'pass' | 'fail'; }

export interface ExecutiveSummary {
  overallScore: number;
  publicationRate: number;
  silenceRate: number;
  goldPassRate: number;
  antiAdnRejectionRate: number;
  genericReplacementFalsePositiveRate: number;
  incompleteInputSafetyRate: number;
}

export interface ValidationReport {
  generatedAt: string;
  provider: string;
  goldResults: GoldResultRow[];
  antiAdnResults: AntiAdnResultRow[];
  incompleteResults: IncompleteResultRow[];
  genericReplacementResults: GenericReplacementResultRow[];
  silenceResults: SilenceResultRow[];
  executiveSummary: ExecutiveSummary;
  topFailures?: string[];
  baselineDiagnosis?: string[];
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function renderMarkdown(report: ValidationReport): string {
  const gold = report.goldResults.map(r => `| ${r.id} | ${r.topology ?? '—'} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.score} | ${r.confidence.toFixed(2)} |`).join('\n');
  const antiAdn = report.antiAdnResults.map(r => `| ${r.id} | ${r.expected} | ${r.actual} | ${r.result.toUpperCase()} |`).join('\n');
  const incomplete = report.incompleteResults.map(r => `| ${r.id} | ${r.requiredInput} | ${r.result.toUpperCase()} |`).join('\n');
  const generic = report.genericReplacementResults.map(r => `| ${r.goldId} | ${r.replacementLabel} | ${r.semanticEquivalence} | ${r.result.toUpperCase()} |`).join('\n');
  const silence = report.silenceResults.map(r => `| ${r.id} | ${r.expectedSilence} | ${r.actualSilence} | ${r.result.toUpperCase()} |`).join('\n');
  const failures = (report.topFailures ?? ['(none recorded)']).map((f, i) => `${i + 1}. ${f}`).join('\n');
  const diagnosis = (report.baselineDiagnosis ?? ['(not yet answered)']).map(d => `- ${d}`).join('\n');

  return `# Molino Premium Validation Harness V1.0

Generated: ${report.generatedAt} — Provider: ${report.provider}

## Executive Summary

- Overall score: ${pct(report.executiveSummary.overallScore)}
- Publication rate: ${pct(report.executiveSummary.publicationRate)}
- Silence rate: ${pct(report.executiveSummary.silenceRate)}
- Gold pass rate: ${pct(report.executiveSummary.goldPassRate)}
- Anti-ADN rejection rate: ${pct(report.executiveSummary.antiAdnRejectionRate)}
- Generic Replacement false-positive rate: ${pct(report.executiveSummary.genericReplacementFalsePositiveRate)}
- Incomplete-input safety rate: ${pct(report.executiveSummary.incompleteInputSafetyRate)}

## Gold Standards

| Gold | Topology | Pass | Score | Confidence |
| ---- | -------- | ---: | ----: | ---------: |
${gold}

## Anti-ADN

| Case | Expected | Actual | Result |
| ---- | -------- | ------ | ------ |
${antiAdn}

## Incomplete Inputs

| Case | Required Input | Result |
| ---- | -------------- | ------ |
${incomplete}

## Generic Replacement

| Gold | Replacement | Semantic Equivalence | Result |
| ---- | ----------- | --------------------: | ------ |
${generic}

## Silence

| Case | Expected Silence | Actual | Result |
| ---- | ---------------- | ------ | ------ |
${silence}

## Top Failures

${failures}

## Baseline Diagnosis

${diagnosis}
`;
}

export function writeReports(report: ValidationReport, outputDir: string): void {
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(path.join(outputDir, 'latest.json'), JSON.stringify(report, null, 2));
  writeFileSync(path.join(outputDir, 'latest.md'), renderMarkdown(report));
  writeFileSync(path.join(outputDir, 'summary.json'), JSON.stringify(report.executiveSummary, null, 2));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/premium/validation/__tests__/report.test.ts`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add tests/premium/validation/report.ts tests/premium/validation/__tests__/report.test.ts
git commit -m "test(premium-validation): add JSON/Markdown report writer"
```

---

### Task 13: `runners/runValidation.test.ts` — full end-to-end orchestration

**Files:**
- Create: `tests/premium/validation/runners/runValidation.test.ts`

**Interfaces:**
- Consumes: everything from Tasks 1-12 (`runEngine`, all evaluators, all fixtures, `writeReports`, `resolveConfig`).
- Produces: `validation-results/latest.json`, `validation-results/latest.md`, `validation-results/summary.json` on disk as a side effect of `vitest run tests/premium/validation/runners`.

This is a Vitest **test file** (not a plain script) so it runs via the existing `vitest` binary with zero new dependencies (satisfying the "no `tsx`/new devDependency needed for the core report" goal — `tsx` stays optional, only used if someone wants a non-Vitest CLI entry point later). Its `it()` blocks assert only harness-internal correctness (e.g., "produced a trace for every fixture") — they must NEVER assert engine quality thresholds, per the Global Constraint against "fixing tests by weakening assertions" and the spec's explicit rule against forcing baseline tests green.

- [ ] **Step 1: Write `runValidation.test.ts`**

```typescript
// tests/premium/validation/runners/runValidation.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { runEngine } from '../engineClient';
import { resolveConfig } from '../config';
import { evaluateStructural } from '../evaluators/structural';
import { evaluateEpistemic } from '../evaluators/epistemic';
import { detectAntiAdn } from '../evaluators/antiAdn';
import { evaluateGoldStandard } from '../evaluators/goldStandard';
import { evaluateGenericReplacement } from '../evaluators/genericReplacement';
import { evaluateSilence } from '../evaluators/silence';
import { assembleTrace, classifyMatrix } from '../evaluators/scoring';
import { writeReports, type ValidationReport, type GoldResultRow, type AntiAdnResultRow, type IncompleteResultRow, type GenericReplacementResultRow, type SilenceResultRow } from '../report';
import { GOLD_STANDARDS } from '../fixtures/gold';
import { ANTI_ADN_CASES } from '../fixtures/anti-adn';
import { INCOMPLETE_CASES } from '../fixtures/incomplete';
import { GENERIC_REPLACEMENT_CASES } from '../fixtures/generic-replacement';
import { SILENCE_CASES } from '../fixtures/silence';
import type { StructuredEvaluationTrace } from '../types';

const config = resolveConfig();
const hasApiKey = Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);

const goldResults: GoldResultRow[] = [];
const antiAdnResults: AntiAdnResultRow[] = [];
const incompleteResults: IncompleteResultRow[] = [];
const genericReplacementResults: GenericReplacementResultRow[] = [];
const silenceResults: SilenceResultRow[] = [];
const topFailures: string[] = [];
const traces: StructuredEvaluationTrace[] = [];

describe('Molino Premium Validation Harness — full run', () => {
  it.skipIf(!hasApiKey)('runs the 5 Gold Standards against the real AI engine and records a trace for each', async () => {
    for (const fixture of GOLD_STANDARDS) {
      const engineResult = await runEngine(
        { name: fixture.profileInput.name, birthDate: fixture.profileInput.birthDate, type: fixture.interpretationType },
        config
      );
      const structuralTest = evaluateStructural(engineResult.ai);
      const epistemicTests = evaluateEpistemic(engineResult.ai);
      const text = [engineResult.ai?.summary, engineResult.ai?.alignment, engineResult.ai?.corePattern?.whyItMatters].filter(Boolean).join(' ');
      const antiAdnFlags = detectAntiAdn(text);
      const goldEval = await evaluateGoldStandard(fixture, engineResult.ai, config);
      const missingRequiredInputs: string[] = [];
      if (fixture.requiresMoment && !fixture.moment) missingRequiredInputs.push('moment');
      if (fixture.requiresSituation && !fixture.situation) missingRequiredInputs.push('situation');
      const silenceEval = evaluateSilence(engineResult);

      const trace = assembleTrace({
        structuralTest, epistemicTests, antiAdnFlags, missingRequiredInputs,
        goldStandard: goldEval, silence: silenceEval,
        evidenceMap: { data_a: fixture.dataA, data_b: fixture.dataB, tension: fixture.tension, moment: fixture.moment, situation: fixture.situation },
        evaluatorVersion: config.evaluatorVersion,
      });
      traces.push(trace);

      const pass = trace.gold_standard_match === fixture.id;
      goldResults.push({ id: fixture.id, topology: trace.topology, pass, score: Math.round(trace.confidence * 10), confidence: trace.confidence });
      if (!pass) topFailures.push(`${fixture.id} (${fixture.topology}): gold_standard_match=${trace.gold_standard_match}, confidence=${trace.confidence.toFixed(2)}`);

      expect(trace).toBeTruthy(); // harness-internal assertion only: a trace was produced, NOT that it passed
    }
  }, 120_000);

  it.skipIf(!hasApiKey)('runs the anti-ADN cases through the real engine using a question crafted to elicit each anti-pattern, and records rejection results', async () => {
    for (const antiCase of ANTI_ADN_CASES) {
      const engineResult = await runEngine(
        { name: 'Anti-ADN Probe', birthDate: '1990-01-01', type: 'question', question: antiCase.sampleText },
        config
      );
      const text = [engineResult.ai?.summary, engineResult.ai?.alignment].filter(Boolean).join(' ');
      const flags = detectAntiAdn(text);
      const actual: 'reject' | 'publish' = flags.length > 0 ? 'reject' : 'publish';
      const result = actual === 'reject' ? 'pass' : 'fail';
      antiAdnResults.push({ id: antiCase.id, category: antiCase.category, expected: 'reject', actual, result });
      if (result === 'fail') topFailures.push(`${antiCase.id} (${antiCase.category}): engine output did not trigger anti-ADN detection`);
      // Harness-internal assertion only: the engine actually ran and returned
      // a usable result to score — NOT that it scored well (that's the report's job).
      expect(engineResult.fallback).toBeTruthy();
    }
  }, 120_000);

  it.skipIf(!hasApiKey)('runs incomplete-input cases and checks the engine does not fabricate the missing input', async () => {
    for (const incompleteCase of INCOMPLETE_CASES) {
      const engineResult = await runEngine(
        { name: incompleteCase.profileInput.name, birthDate: incompleteCase.profileInput.birthDate, type: incompleteCase.interpretationType, question: incompleteCase.requiredInputMissing === 'question_context' ? '' : undefined },
        config
      );
      const missingRequiredInputs = [incompleteCase.requiredInputMissing === 'moment' ? 'moment' : incompleteCase.requiredInputMissing === 'situation' ? 'situation' : ''].filter(Boolean);
      // Safety = does NOT invent specific fabricated content for the missing dimension.
      // Heuristic proxy: structural completeness without anti-ADN invented_causality flag.
      const text = [engineResult.ai?.summary, engineResult.ai?.alignment].filter(Boolean).join(' ');
      const fabricated = detectAntiAdn(text).includes('invented_causality');
      const result: 'pass' | 'fail' = fabricated ? 'fail' : 'pass';
      incompleteResults.push({ id: incompleteCase.id, requiredInput: incompleteCase.requiredInputMissing, result });
      if (result === 'fail') topFailures.push(`${incompleteCase.id}: engine appears to fabricate missing ${incompleteCase.requiredInputMissing}`);
      // Harness-internal assertion only: the engine actually ran — NOT that
      // it handled the missing input well (that's the report's job).
      expect(engineResult.fallback).toBeTruthy();
    }
  }, 120_000);

  it.skipIf(!hasApiKey)('runs Generic Replacement pairs and checks for semantic non-equivalence', async () => {
    for (const testCase of GENERIC_REPLACEMENT_CASES) {
      const originalFixture = GOLD_STANDARDS.find(g => g.id === testCase.baseGoldStandard)!;
      const originalResult = await runEngine({ name: testCase.originalInput.name, birthDate: testCase.originalInput.birthDate, type: originalFixture.interpretationType }, config);
      const originalText = [originalResult.ai?.opening, originalResult.ai?.summary, originalResult.ai?.corePattern?.whyItMatters].filter(Boolean).join(' ');

      for (const replacement of testCase.replacementInputs) {
        const replacementResult = await runEngine({ name: replacement.profile.name, birthDate: replacement.profile.birthDate, type: originalFixture.interpretationType }, config);
        const replacementText = [replacementResult.ai?.opening, replacementResult.ai?.summary, replacementResult.ai?.corePattern?.whyItMatters].filter(Boolean).join(' ');
        const evalResult = await evaluateGenericReplacement(originalText, replacementText, config);
        const result = evalResult.status === 'pass' ? 'pass' : 'fail';
        genericReplacementResults.push({ goldId: testCase.baseGoldStandard, replacementLabel: replacement.label, semanticEquivalence: evalResult.status === 'fail', result });
        if (result === 'fail') topFailures.push(`${testCase.baseGoldStandard}/${replacement.label}: insight survived profile swap (${evalResult.reason})`);
        // Harness-internal assertion only: both engine runs actually
        // produced output to compare — NOT that they were non-equivalent
        // (that's the report's job).
        expect(originalResult.fallback).toBeTruthy();
        expect(replacementResult.fallback).toBeTruthy();
      }
    }
  }, 180_000);

  it.skipIf(!hasApiKey)('runs silence cases and checks whether the engine correctly withholds a confident answer', async () => {
    for (const silenceCase of SILENCE_CASES) {
      const engineResult = await runEngine({ name: silenceCase.profileInput.name, birthDate: silenceCase.profileInput.birthDate, type: silenceCase.interpretationType, question: silenceCase.question }, config);
      const silenceEval = evaluateSilence(engineResult);
      const result: 'pass' | 'fail' = silenceEval.silence_recommended ? 'pass' : 'fail';
      silenceResults.push({ id: silenceCase.id, expectedSilence: true, actualSilence: silenceEval.silence_recommended, result });
      if (result === 'fail') topFailures.push(`${silenceCase.id}: expected silence (${silenceCase.reason}), engine answered confidently instead`);
      // Harness-internal assertion only: the engine actually ran — NOT that
      // it correctly recommended silence (that's the report's job).
      expect(engineResult.fallback).toBeTruthy();
    }
  }, 120_000);

  it('writes the report (using whatever results were collected — empty arrays if no API key was set)', () => {
    const goldPassRate = goldResults.length ? goldResults.filter(r => r.pass).length / goldResults.length : 0;
    const antiAdnRejectionRate = antiAdnResults.length ? antiAdnResults.filter(r => r.result === 'pass').length / antiAdnResults.length : 0;
    const incompleteInputSafetyRate = incompleteResults.length ? incompleteResults.filter(r => r.result === 'pass').length / incompleteResults.length : 0;
    const genericReplacementFalsePositiveRate = genericReplacementResults.length ? genericReplacementResults.filter(r => r.result === 'fail').length / genericReplacementResults.length : 0;
    const silenceRateCorrect = silenceResults.length ? silenceResults.filter(r => r.result === 'pass').length / silenceResults.length : 0;
    const publicationRate = traces.length ? traces.filter(t => t.publication_decision === 'publish').length / traces.length : 0;

    const report: ValidationReport = {
      generatedAt: new Date().toISOString(),
      provider: config.provider,
      goldResults, antiAdnResults, incompleteResults, genericReplacementResults, silenceResults,
      executiveSummary: {
        overallScore: (goldPassRate + antiAdnRejectionRate + incompleteInputSafetyRate + (1 - genericReplacementFalsePositiveRate) + silenceRateCorrect) / 5,
        publicationRate,
        silenceRate: traces.length ? traces.filter(t => t.silence_recommended).length / traces.length : 0,
        goldPassRate, antiAdnRejectionRate, genericReplacementFalsePositiveRate, incompleteInputSafetyRate,
      },
      topFailures: topFailures.length ? topFailures : (hasApiKey ? ['(none — see full trace data in latest.json)'] : ['No API key set (OPENAI_API_KEY / ANTHROPIC_API_KEY) — AI-dependent suites were skipped; only the fixture/evaluator scaffolding ran.']),
      baselineDiagnosis: hasApiKey ? undefined : ['Run again with an API key set to produce a real baseline diagnosis.'],
    };

    writeReports(report, config.outputDir);
    expect(true).toBe(true); // side-effect test: success = files written without throwing
  });
});
```

- [ ] **Step 2: Run without an API key set (proves the harness is safe to run in CI/no-key environments)**

Run: `npx vitest run tests/premium/validation/runners/runValidation.test.ts`
Expected: PASS — all `.skipIf(!hasApiKey)` blocks skip, the final report-writing test still runs and writes `validation-results/latest.md` documenting that AI suites were skipped.

- [ ] **Step 3: If a key IS available in this environment, run it for real and inspect the output**

Run: `npx vitest run tests/premium/validation/runners/runValidation.test.ts` (with `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` set)
Expected: PASS or FAIL is not the point — the point is `validation-results/latest.md` gets populated with real gold/anti-ADN/incomplete/generic-replacement/silence rows. Read the file after the run.

- [ ] **Step 4: Commit**

```bash
git add tests/premium/validation/runners/runValidation.test.ts
git commit -m "test(premium-validation): add full end-to-end validation runner"
```

---

### Task 14: `runners/runTemperatureMatrix.test.ts` — documented variability-at-fixed-T runner

**Files:**
- Create: `tests/premium/validation/runners/runTemperatureMatrix.test.ts`

**Interfaces:**
- Consumes: `runEngine`, `resolveConfig`, `evaluateGoldStandard`, `GOLD_STANDARDS` — same as Task 13.
- Produces: `validation-results/temperature-matrix.json`, `validation-results/temperature-matrix.md`.

Per the Global Constraints: `aiEngine.ts` hardcodes `temperature: 0.7` with no parameter to override it, and this plan forbids adding one (that would modify production code). This runner therefore does NOT sweep temperature — it runs each Gold Standard fixture 3 times at the current fixed temperature and reports run-to-run variability (gold pass rate std-dev proxy, confidence variance), with the limitation stated prominently in both the code comment and the emitted report.

- [ ] **Step 1: Write `runTemperatureMatrix.test.ts`**

```typescript
// tests/premium/validation/runners/runTemperatureMatrix.test.ts
import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { runEngine } from '../engineClient';
import { resolveConfig } from '../config';
import { evaluateGoldStandard } from '../evaluators/goldStandard';
import { GOLD_STANDARDS } from '../fixtures/gold';

const config = resolveConfig();
const hasApiKey = Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
const RUNS_PER_FIXTURE = 3;

// LIMITATION (documented per harness spec section 18): aiEngine.ts hardcodes
// temperature: 0.7 / max_tokens: 800 with no parameter to vary them, and this
// harness must not modify production code to add one. This runner therefore
// measures RUN-TO-RUN VARIABILITY AT THE FIXED PRODUCTION TEMPERATURE (0.7),
// not a true low/mid/high temperature sweep. If aiEngine.ts is later changed
// to accept a temperature param, this runner is the place to add the real
// 3-config matrix from spec section 18 (0.2/0.4/0.6).
describe('Temperature/variability matrix (fixed T=0.7 — see limitation above)', () => {
  it.skipIf(!hasApiKey)('runs each Gold Standard fixture 3x and records confidence variance at the fixed production temperature', async () => {
    const rows: Array<{ id: string; runs: number[]; mean: number; variance: number }> = [];

    for (const fixture of GOLD_STANDARDS) {
      const confidences: number[] = [];
      for (let i = 0; i < RUNS_PER_FIXTURE; i++) {
        const engineResult = await runEngine({ name: fixture.profileInput.name, birthDate: fixture.profileInput.birthDate, type: fixture.interpretationType }, config);
        const goldEval = await evaluateGoldStandard(fixture, engineResult.ai, config);
        confidences.push(goldEval.confidence);
      }
      const mean = confidences.reduce((a, b) => a + b, 0) / confidences.length;
      const variance = confidences.reduce((sum, c) => sum + (c - mean) ** 2, 0) / confidences.length;
      rows.push({ id: fixture.id, runs: confidences, mean, variance });
    }

    const outputDir = config.outputDir;
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(path.join(outputDir, 'temperature-matrix.json'), JSON.stringify({ limitation: 'aiEngine.ts has no temperature parameter — this measures variance at the fixed production T=0.7, not a true sweep.', rows }, null, 2));
    writeFileSync(
      path.join(outputDir, 'temperature-matrix.md'),
      `# Temperature/Variability Matrix\n\n**Limitation:** \`aiEngine.ts\` hardcodes \`temperature: 0.7\` with no parameter to override — production code was not modified to add one, per this harness's constraints. This measures run-to-run variance at the fixed production temperature, not a true 0.2/0.4/0.6 sweep.\n\n| Gold | Runs (confidence) | Mean | Variance |\n| ---- | ------------------ | ---: | -------: |\n${rows.map(r => `| ${r.id} | ${r.runs.map(c => c.toFixed(2)).join(', ')} | ${r.mean.toFixed(2)} | ${r.variance.toFixed(3)} |`).join('\n')}\n`
    );

    expect(rows).toHaveLength(GOLD_STANDARDS.length);
  }, 300_000);

  it('documents the limitation even when no API key is set', () => {
    const outputDir = config.outputDir;
    mkdirSync(outputDir, { recursive: true });
    if (!hasApiKey) {
      writeFileSync(
        path.join(outputDir, 'temperature-matrix.md'),
        `# Temperature/Variability Matrix\n\nSkipped — no OPENAI_API_KEY/ANTHROPIC_API_KEY set.\n\n**Limitation:** \`aiEngine.ts\` hardcodes \`temperature: 0.7\` with no parameter to override; true temperature sweep (0.2/0.4/0.6) would require a production code change, which is out of scope for this validation-only harness.\n`
      );
    }
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run it (no key required to pass)**

Run: `npx vitest run tests/premium/validation/runners/runTemperatureMatrix.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tests/premium/validation/runners/runTemperatureMatrix.test.ts
git commit -m "test(premium-validation): add temperature/variability matrix runner with documented limitation"
```

---

### Task 15: `README.md` — harness documentation and fixture-replacement guide

**Files:**
- Create: `tests/premium/validation/README.md`

- [ ] **Step 1: Write the README**

```markdown
# Molino Premium Validation Harness V1.0

Measures whether the CURRENT intelligence engine (`lib/engines/intelligenceEngine.ts` +
`lib/engines/aiEngine.ts`) produces output meeting the Molino Cognitive DNA standard.
This harness is validation-only infrastructure — it imports production engine functions
read-only and never modifies them.

## Running it

```bash
# Full suite (writes validation-results/latest.json + latest.md + summary.json)
npm run validate:premium

# Variability-at-fixed-temperature matrix (writes validation-results/temperature-matrix.*)
npm run validate:premium:temperature
```

Requires `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in `.env.local` (loaded the same way
`next dev` loads it — export the vars in your shell before running `npm run validate:premium`,
or use `dotenv -e .env.local -- npm run validate:premium` if you have `dotenv-cli`). Without a
key, the AI-dependent suites are skipped (`it.skipIf`) and the report documents that instead
of failing — this keeps the harness safe to run in CI/no-key environments.

## ⚠️ Placeholder fixtures — read before trusting a "Gold Reproduction" number

Every fixture under `fixtures/gold/`, `fixtures/anti-adn/`, `fixtures/incomplete/`,
`fixtures/generic-replacement/`, and `fixtures/silence/` is marked
`sourceStatus: 'harness_authored_placeholder'`. They were authored directly from the
formulas/rules given in the harness spec (patterns, required-field rules, anti-ADN category
descriptions) — NOT from the officially frozen "5 Gold Standards aprobados" / Anti-ADN
document, which were not available when this harness was built.

**They prove the harness pipeline works end-to-end. They do not certify the engine against
the real approved standard.** Treat any `latest.md` gold-pass-rate number as "how well does
the engine do against a plausible but unofficial GS1-GS5" — not the real baseline number
until the placeholders are swapped.

### To swap in the real fixtures

1. Replace the fixture objects in `fixtures/gold/*.ts`, `fixtures/anti-adn/index.ts`, etc.
   with the real approved content — same `GoldStandardFixture`/`AntiAdnCase`/... shape
   (defined in `fixtures/types.ts`), just real `dataA`/`dataB`/`tension`/`expectedInsight`/
   `successCriteria` instead of placeholder text.
2. Set `sourceStatus: 'official_approved'`.
3. No evaluator, runner, or report code needs to change — they all consume the fixture
   interfaces, not the placeholder content.
4. Re-run `npm run validate:premium` for the real baseline.

## Architecture

- `engineClient.ts` — the ONLY module that imports production engine code. Mirrors
  `app/api/intelligence/interpret/route.ts` exactly (same function call order, same
  `JSON.parse(rawResponse)` parsing) so the harness measures the real production path.
- `evaluators/` — structural (heuristic), epistemic (heuristic), anti-ADN (heuristic phrase
  detection), gold-standard match + generic-replacement (LLM-judge, via `evaluators/llmJudge.ts`
  reusing `generateWithClaude`/`generateWithOpenAI` as a plain HTTP+parsing utility with a
  brand-new eval-only prompt), silence (heuristic).
- `fixtures/` — see placeholder warning above.
- `runners/` — Vitest test files (not standalone scripts) so `npx vitest run` is the only
  tool needed; no new dependency was added to run them.
- `report.ts` — writes `validation-results/latest.json` / `latest.md` / `summary.json`.

## Known limitations (documented, not fixed)

- **No temperature parameter in `aiEngine.ts`.** `runTemperatureMatrix.test.ts` measures
  run-to-run variance at the fixed production `temperature: 0.7` instead of a true
  0.2/0.4/0.6 sweep. See the comment at the top of that file.
- **The engine has no silence/decline-to-answer mechanism.** `evaluators/silence.ts` will
  report `silence_recommended: false` on almost every case unless the model happens to
  produce low-evidence phrasing on its own — this gap is itself a baseline finding, not a
  harness bug.
- **Anti-ADN detection is regex/phrase-based**, a deliberately conservative floor. Two
  categories (`mechanism_without_application`, `superficial_personalization`) are
  structural/comparative judgments not caught by phrase-matching — they rely entirely on
  the LLM-judge path in `evaluators/goldStandard.ts`'s rubric, not `detectAntiAdn`.
```

- [ ] **Step 2: Commit**

```bash
git add tests/premium/validation/README.md
git commit -m "docs(premium-validation): add harness README with fixture-replacement guide"
```

---

### Task 16: Final verification — typecheck, full test suite, no-production-diff check

**Files:** none created; verification only.

- [ ] **Step 1: Run TypeScript check**

Run: `npm run typecheck`
Expected: no errors. If `engineClient.ts`/`evaluators/*.ts` show type errors against `CompatibilityResult`/`MolinoInterpretation`, fix the harness-side type usage (never the production type definitions).

- [ ] **Step 2: Run the full existing test suite to confirm no regression**

Run: `npm test`
Expected: all pre-existing tests still pass, plus every harness test from Tasks 1-14.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: no new errors from files under `tests/premium/validation/`.

- [ ] **Step 4: Confirm zero production files were modified**

Run: `git status --short`
Expected: only files under `tests/premium/validation/`, `docs/superpowers/plans/`, plus `.gitignore` and `package.json` (scripts-only diff) appear as new/modified. If anything under `lib/`, `app/`, `components/`, or `types/` shows as modified, STOP and report it — do not proceed.

- [ ] **Step 5: If an API key is available, run the real suite once and read the output**

Run: `npm run validate:premium`
Then: `Read validation-results/latest.md`
Report back: Gold Reproduction X/5, Anti-ADN X/Y, Incomplete X/Y, Generic Replacement X/Y, Silence X/Y — clearly labeled as measured against the placeholder fixtures (per Task 15's warning), plus the harness-internal "no regressions" confirmation from Steps 1-4.

- [ ] **Step 6: Commit any final fixups**

```bash
git add -A -- tests/premium/validation/
git status --short
git commit -m "test(premium-validation): final typecheck/lint fixups" --allow-empty
```

(Only commit if Steps 1-3 required actual fixes; otherwise skip this commit.)
