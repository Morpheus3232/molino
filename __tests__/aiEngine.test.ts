import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';

vi.stubEnv('OPENROUTER_API_KEY', 'test-openrouter-key');

import { generateWithOpenRouter, OPENROUTER_MODEL_DEFAULT } from '@/lib/engines/aiEngine';
import type { UserProfile } from '@/lib/engines/compatibilityEngine';

const USER = { archetype: 'El Visionario' } as unknown as UserProfile;
const TARGET = { name: 'Otra persona' };
const RESULT = {
  scores: { overall: 70, element: 60 },
  strengths: ['claridad'],
  challenges: ['impaciencia'],
} as any;

function mockOpenRouterContent(content: string) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content } }],
        usage: { prompt_tokens: 10, completion_tokens: 20 },
      }),
    }))
  );
}

const LEGACY_PAYLOAD = {
  narrative: 'Una narrativa profunda sobre esta conexión.',
  detailedInsights: ['insight uno', 'insight dos'],
  recommendations: ['recomendación uno'],
  reflectionQuestions: ['¿pregunta uno?'],
  poeticSummary: 'Un resumen poético.',
};

describe('generateWithOpenRouter → parseAIResponse (never leaks raw JSON to the user)', () => {
  beforeEach(() => {
    vi.stubEnv('OPENROUTER_MODEL', 'deepseek/deepseek-v4-flash');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('plain JSON is parsed into structured fields', async () => {
    mockOpenRouterContent(JSON.stringify(LEGACY_PAYLOAD));
    const result = await generateWithOpenRouter(USER, TARGET, RESULT);
    expect(result.narrative).toBe(LEGACY_PAYLOAD.narrative);
    expect(result.detailedInsights).toEqual(LEGACY_PAYLOAD.detailedInsights);
  });

  test('```json fenced JSON is parsed into structured fields (not shown as raw text)', async () => {
    mockOpenRouterContent('```json\n' + JSON.stringify(LEGACY_PAYLOAD) + '\n```');
    const result = await generateWithOpenRouter(USER, TARGET, RESULT);
    expect(result.narrative).toBe(LEGACY_PAYLOAD.narrative);
    expect(result.narrative).not.toContain('```');
    expect(result.narrative).not.toContain('{');
  });

  test('double-encoded JSON is unwrapped correctly', async () => {
    mockOpenRouterContent(JSON.stringify(JSON.stringify(LEGACY_PAYLOAD)));
    const result = await generateWithOpenRouter(USER, TARGET, RESULT);
    expect(result.narrative).toBe(LEGACY_PAYLOAD.narrative);
  });

  test('malformed/truncated JSON never surfaces raw braces as narrative', async () => {
    mockOpenRouterContent('{"narrative": "esto se corta a la mitad, sin cerrar');
    const result = await generateWithOpenRouter(USER, TARGET, RESULT);
    expect(result.narrative).not.toContain('{');
    expect(result.narrative).not.toContain('"narrative"');
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  test('plain prose (model ignored the JSON contract) falls back to section-splitting, not raw passthrough', async () => {
    const prose = 'Esta es una interpretación en prosa.\n\nUn segundo párrafo con más de veinte caracteres.';
    mockOpenRouterContent(prose);
    const result = await generateWithOpenRouter(USER, TARGET, RESULT);
    expect(result.narrative).toBe('Esta es una interpretación en prosa.');
  });
});

describe('OPENROUTER_MODEL_DEFAULT fallback', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.OPENROUTER_MODEL;
  });

  test('falls back to the safe default when OPENROUTER_MODEL is unset', async () => {
    delete process.env.OPENROUTER_MODEL;
    mockOpenRouterContent(JSON.stringify(LEGACY_PAYLOAD));
    const result = await generateWithOpenRouter(USER, TARGET, RESULT);
    expect(result.model).toBe(OPENROUTER_MODEL_DEFAULT);
  });

  test('falls back to the safe default when OPENROUTER_MODEL is an empty string', async () => {
    vi.stubEnv('OPENROUTER_MODEL', '');
    mockOpenRouterContent(JSON.stringify(LEGACY_PAYLOAD));
    const result = await generateWithOpenRouter(USER, TARGET, RESULT);
    expect(result.model).toBe(OPENROUTER_MODEL_DEFAULT);
  });

  test('uses OPENROUTER_MODEL when explicitly set to a valid value', async () => {
    vi.stubEnv('OPENROUTER_MODEL', 'some/other-model');
    mockOpenRouterContent(JSON.stringify(LEGACY_PAYLOAD));
    const result = await generateWithOpenRouter(USER, TARGET, RESULT);
    expect(result.model).toBe('some/other-model');
  });
});
