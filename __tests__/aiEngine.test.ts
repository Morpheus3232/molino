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

/** Same as mockOpenRouterContent but returns the fetch mock so the caller
 * can inspect exactly what was sent as the request body. */
function mockOpenRouterContentCapturing(content: string) {
  const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => ({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{ message: { content } }],
      usage: { prompt_tokens: 10, completion_tokens: 20 },
    }),
  }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
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

const MOLINO_CONTRACT_FIELDS = [
  'opening', 'summary', 'corePattern', 'alignment', 'tensions', 'howYouOperate',
  'blindSpot', 'lifeAreas',
  'relationalNote', 'timing', 'suggestedNextStep', 'closingSynthesis',
  'strengths', 'whatToConsider', 'confidence', 'limitations',
];

describe('generateWithOpenRouter → structured output request', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('sends response_format: json_schema (strict) when a template is provided (premium contract)', async () => {
    const fetchMock = mockOpenRouterContentCapturing(JSON.stringify({ summary: 'x' }));
    await generateWithOpenRouter(USER, TARGET, RESULT, 'un template de buildIntelligencePrompt');

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);

    expect(body.response_format).toBeDefined();
    expect(body.response_format.type).toBe('json_schema');
    expect(body.response_format.json_schema.strict).toBe(true);
    expect(body.response_format.json_schema.name).toBe('molino_interpretation');
  });

  test('the JSON schema declares every field of the MolinoInterpretation contract', async () => {
    const fetchMock = mockOpenRouterContentCapturing(JSON.stringify({ summary: 'x' }));
    await generateWithOpenRouter(USER, TARGET, RESULT, 'un template de buildIntelligencePrompt');

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    const schema = body.response_format.json_schema.schema;

    expect(Object.keys(schema.properties).sort()).toEqual([...MOLINO_CONTRACT_FIELDS].sort());
    expect(schema.required.sort()).toEqual([...MOLINO_CONTRACT_FIELDS].sort());
    expect(schema.properties.corePattern.properties).toEqual({
      what: { type: 'string' },
      source: { type: 'string' },
      whyItMatters: { type: 'string' },
    });
  });

  test('does NOT send response_format for the legacy compatibility call (no template)', async () => {
    const fetchMock = mockOpenRouterContentCapturing(JSON.stringify(LEGACY_PAYLOAD));
    await generateWithOpenRouter(USER, TARGET, RESULT);

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.response_format).toBeUndefined();
  });

  test('sends reasoning: { exclude: true } for the premium contract call (template provided) — measured to perform better in production than omitting it', async () => {
    const fetchMock = mockOpenRouterContentCapturing(JSON.stringify({ summary: 'x' }));
    await generateWithOpenRouter(USER, TARGET, RESULT, 'un template de buildIntelligencePrompt');

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.reasoning).toEqual({ exclude: true });
  });

  test('does NOT send reasoning for the legacy compatibility call (no template)', async () => {
    const fetchMock = mockOpenRouterContentCapturing(JSON.stringify(LEGACY_PAYLOAD));
    await generateWithOpenRouter(USER, TARGET, RESULT);

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.reasoning).toBeUndefined();
  });
});
