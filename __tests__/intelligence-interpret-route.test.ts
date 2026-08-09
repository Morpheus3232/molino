import { vi, describe, test, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.stubEnv('MP_WEBHOOK_SECRET', 'test-webhook-secret');

// hashProfile is pure — real implementation is fine. Premium gating and the
// AI call are mocked so each test controls exactly what the "model" returned.
vi.mock('@/lib/kv', () => ({
  hasPremiumAccess: vi.fn(async () => true),
  verifyPremiumToken: vi.fn(async () => true),
  incrementDailyCost: vi.fn(async () => {}),
}));

const mockGenerateWithRouting = vi.fn();
vi.mock('@/lib/engines/providerRouter', () => ({
  generateWithRouting: (...args: unknown[]) => mockGenerateWithRouting(...args),
  getProviderStatus: vi.fn(),
}));

import { POST } from '@/app/api/intelligence/interpret/route';

let ipCounter = 0;

function req(body: Record<string, unknown>) {
  ipCounter += 1;
  return new NextRequest('http://localhost/api/intelligence/interpret', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.0.0.${ipCounter}` },
    body: JSON.stringify(body),
  });
}

const BASE_BODY = { type: 'personal_profile', dob: '1990-04-15', name: 'Test User', premiumToken: 'token' };

const VALID_CONTRACT = {
  summary: 'Cuando tu Life Path y tu elemento se leen juntos, aparece un patrón de acción intuitiva.',
  alignment: 'Esto se traduce en decisiones más rápidas cuando confiás en tu primera lectura de una situación.',
  timing: 'Tu año personal favorece cerrar ciclos antes de abrir otros nuevos.',
  strengths: ['Claridad bajo presión', 'Capacidad de síntesis rápida'],
  tensions: ['Podés anticipar conclusiones antes de tener todos los datos.'],
  whatToConsider: ['Esto no reemplaza un diagnóstico profesional.'],
  suggestedNextStep: 'Anotá una decisión reciente y revisá qué información usaste realmente.',
  confidence: 'Alta',
  limitations: ['Interpretación generada con IA.'],
  opening: 'Ves patrones antes de que otros los nombren.',
  corePattern: { what: 'Intuición operativa', source: 'Life Path 11 + Fuego', whyItMatters: 'Te adelanta al grupo, a veces demasiado.' },
  howYouOperate: 'Cuando el grupo todavía está evaluando opciones, vos ya elegiste una dirección.',
  relationalNote: 'Con Tigre y Perro compartís ritmo; con Rata, fricción productiva.',
  closingSynthesis: 'Ves antes de entender — y eso también hay que entrenarlo.',
};

const COT_LEAK_CONTRACT = {
  ...VALID_CONTRACT,
  summary: 'We need to produce JSON with fields as specified. Use data from user context: Life Path 11...',
};

function mockAiResponse(content: string) {
  mockGenerateWithRouting.mockResolvedValue({
    interpretation: { rawResponse: content, model: 'test-model', narrative: '', detailedInsights: [], recommendations: [], reflectionQuestions: [], poeticSummary: '' },
    providerUsed: 'openrouter',
    fallbackUsed: false,
  });
}

describe('POST /api/intelligence/interpret — AI validity contract', () => {
  beforeEach(() => {
    mockGenerateWithRouting.mockReset();
  });

  test('valid, semantically sound JSON → ai is populated, aiStatus "valid"', async () => {
    mockAiResponse(JSON.stringify(VALID_CONTRACT));
    const res = await POST(req(BASE_BODY));
    const data = await res.json();
    expect(data.aiStatus).toBe('valid');
    expect(data.ai).not.toBeNull();
    expect(data.ai.summary).toBe(VALID_CONTRACT.summary);
  });

  test('chain-of-thought leak in summary → ai is null, aiStatus "invalid", fallback used instead', async () => {
    mockAiResponse(JSON.stringify(COT_LEAK_CONTRACT));
    const res = await POST(req(BASE_BODY));
    const data = await res.json();
    expect(data.ai).toBeNull();
    expect(data.aiStatus).toBe('invalid');
    expect(data.fallback).not.toBeNull();
  });

  test('chain-of-thought leak in corePattern → ai is null, never served as valid', async () => {
    mockAiResponse(JSON.stringify({
      ...VALID_CONTRACT,
      corePattern: { what: 'corePattern: object with what, source, whyItMatters', source: 'x', whyItMatters: 'y' },
    }));
    const res = await POST(req(BASE_BODY));
    const data = await res.json();
    expect(data.ai).toBeNull();
    expect(data.aiStatus).toBe('invalid');
  });

  test('formally valid JSON that is too short to be real prose → ai is null', async () => {
    mockAiResponse(JSON.stringify({ ...VALID_CONTRACT, summary: 'ok' }));
    const res = await POST(req(BASE_BODY));
    const data = await res.json();
    expect(data.ai).toBeNull();
    expect(data.aiStatus).toBe('invalid');
  });

  test('broken/malformed JSON → ai is null, honest fallback served, never raw text', async () => {
    mockAiResponse('{"summary": "esto se corta a la mitad, sin cerrar');
    const res = await POST(req(BASE_BODY));
    const data = await res.json();
    expect(data.ai).toBeNull();
    expect(data.aiStatus).toBe('invalid');
    expect(JSON.stringify(data.fallback)).not.toContain('esto se corta a la mitad');
  });

  test('the old parser placeholder narrative never resurfaces as a valid ai result', async () => {
    // Same shape aiEngine.parseAIResponse falls back to when content looks
    // like JSON but cannot be recovered — must not be laundered into `ai`.
    mockAiResponse('```json\nnot actually valid json{{{\n```');
    const res = await POST(req(BASE_BODY));
    const data = await res.json();
    expect(data.ai).toBeNull();
    expect(JSON.stringify(data)).not.toContain('Una conexión profunda y significativa');
  });

  test('question type: invalid AI still returns ai: null and an honest fallback (never mislabeled as Molino AI)', async () => {
    mockAiResponse('We need to produce JSON with fields as specified.');
    const res = await POST(req({ ...BASE_BODY, type: 'question', question: '¿Qué patrón estoy repitiendo?' }));
    const data = await res.json();
    expect(data.ai).toBeNull();
    expect(data.aiStatus).toBe('invalid');
    expect(data.fallback).not.toBeNull();
  });

  test('json_schema strict-mode nulls on optional fields are normalized to absent, not rejected', async () => {
    // strict:true requires every property present, so the model returns
    // explicit null for fields it has nothing to say about instead of
    // omitting them — must still validate as a real interpretation.
    mockAiResponse(JSON.stringify({
      ...VALID_CONTRACT,
      opening: null,
      relationalNote: null,
      corePattern: null,
    }));
    const res = await POST(req(BASE_BODY));
    const data = await res.json();
    expect(data.aiStatus).toBe('valid');
    expect(data.ai).not.toBeNull();
    expect(data.ai.opening).toBeFalsy();
    expect(data.ai.corePattern).toBeFalsy();
  });
});
