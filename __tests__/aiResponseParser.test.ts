import { describe, test, expect } from 'vitest';
import { extractJSON, looksLikeJSON, isValidMolinoInterpretation, validateMolinoInterpretationSemantics } from '@/lib/engines/aiResponseParser';

const CONTRACT = {
  summary: 'Una síntesis conectiva real.',
  alignment: 'Alineación con tu vida actual.',
  timing: 'Este es un buen momento.',
  strengths: ['claridad', 'foco'],
  tensions: ['impaciencia'],
  whatToConsider: ['ir más despacio'],
  suggestedNextStep: 'Escribí lo que sentís.',
  confidence: 'Alta',
  limitations: ['Interpretación generada con IA.'],
  opening: 'Hay un patrón en vos.',
  corePattern: {
    what: 'Buscás sentido antes que aprobación.',
    source: 'Life Path 7 + elemento Fuego',
    whyItMatters: 'Te aleja de decisiones que no son tuyas.',
  },
  howYouOperate: 'Actuás distinto cuando podés elegir vs. cuando no.',
  relationalNote: 'En pareja, esto se ve en cómo pedís espacio.',
  closingSynthesis: 'Buscás sentido, no aprobación.',
};

describe('extractJSON', () => {
  test('parses plain JSON', () => {
    const result = extractJSON(JSON.stringify(CONTRACT));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.summary).toBe(CONTRACT.summary);
  });

  test('parses JSON wrapped in ```json fences', () => {
    const fenced = '```json\n' + JSON.stringify(CONTRACT) + '\n```';
    const result = extractJSON(fenced);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.summary).toBe(CONTRACT.summary);
  });

  test('parses JSON wrapped in bare ``` fences (no "json" tag)', () => {
    const fenced = '```\n' + JSON.stringify(CONTRACT) + '\n```';
    const result = extractJSON(fenced);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.summary).toBe(CONTRACT.summary);
  });

  test('parses double-encoded JSON (a JSON string containing the object)', () => {
    const doubleEncoded = JSON.stringify(JSON.stringify(CONTRACT));
    const result = extractJSON(doubleEncoded);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.summary).toBe(CONTRACT.summary);
  });

  test('parses production wrapper: whole payload nested inside "summary"', () => {
    const wrapper = JSON.stringify({ summary: JSON.stringify(CONTRACT), alignment: '', timing: '' });
    const result = extractJSON(wrapper);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.summary).toBe(CONTRACT.summary);
  });

  test('does not unwrap a legitimate Spanish summary that happens to start with text', () => {
    const legit = { ...CONTRACT, summary: 'Una síntesis real, no un objeto.' };
    const result = extractJSON(JSON.stringify(legit));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.summary).toBe('Una síntesis real, no un objeto.');
  });

  test('rejects malformed / truncated JSON', () => {
    const truncated = '{"summary": "esto se corta a la mitad';
    const result = extractJSON(truncated);
    expect(result.ok).toBe(false);
  });

  test('rejects plain prose', () => {
    const result = extractJSON('Esto es solo texto, no JSON en absoluto.');
    expect(result.ok).toBe(false);
  });

  test('rejects empty / null / undefined input', () => {
    expect(extractJSON('').ok).toBe(false);
    expect(extractJSON('   ').ok).toBe(false);
    expect(extractJSON(null).ok).toBe(false);
    expect(extractJSON(undefined).ok).toBe(false);
  });

  test('rejects JSON arrays and primitives (not the expected object shape)', () => {
    expect(extractJSON('[1,2,3]').ok).toBe(false);
    expect(extractJSON('42').ok).toBe(false);
  });
});

describe('looksLikeJSON', () => {
  test('detects fenced, braced, and quoted content as JSON-shaped', () => {
    expect(looksLikeJSON('```json\n{}\n```')).toBe(true);
    expect(looksLikeJSON('{"a":1}')).toBe(true);
    expect(looksLikeJSON('[1,2]')).toBe(true);
    expect(looksLikeJSON('"a string"')).toBe(true);
  });

  test('plain prose does not look like JSON', () => {
    expect(looksLikeJSON('Una conexión profunda y significativa.')).toBe(false);
  });
});

describe('isValidMolinoInterpretation', () => {
  test('accepts the full contract with corePattern as an object', () => {
    expect(isValidMolinoInterpretation(CONTRACT)).toBe(true);
  });

  test('rejects corePattern as a string (wrong shape)', () => {
    const bad = { ...CONTRACT, corePattern: 'Life Path 7 + elemento Fuego' };
    expect(isValidMolinoInterpretation(bad)).toBe(false);
  });

  test('rejects corePattern missing required sub-fields', () => {
    const bad = { ...CONTRACT, corePattern: { what: 'algo' } };
    expect(isValidMolinoInterpretation(bad)).toBe(false);
  });

  test('accepts corePattern absent entirely (optional field)', () => {
    const { corePattern, ...rest } = CONTRACT;
    expect(isValidMolinoInterpretation(rest)).toBe(true);
  });

  test('rejects missing or empty summary', () => {
    expect(isValidMolinoInterpretation({ ...CONTRACT, summary: '' })).toBe(false);
    const { summary, ...rest } = CONTRACT;
    expect(isValidMolinoInterpretation(rest)).toBe(false);
  });

  test('rejects array fields that contain non-strings', () => {
    expect(isValidMolinoInterpretation({ ...CONTRACT, strengths: [1, 2] })).toBe(false);
  });

  test('rejects non-object input', () => {
    expect(isValidMolinoInterpretation('not an object')).toBe(false);
    expect(isValidMolinoInterpretation(null)).toBe(false);
    expect(isValidMolinoInterpretation([1, 2])).toBe(false);
  });
});

describe('validateMolinoInterpretationSemantics', () => {
  test('accepts a real, well-formed interpretation', () => {
    expect(validateMolinoInterpretationSemantics(CONTRACT).valid).toBe(true);
  });

  test('rejects chain-of-thought leak in summary', () => {
    const result = validateMolinoInterpretationSemantics({
      ...CONTRACT,
      summary: 'We need to produce JSON with fields as specified. Use data from user context...',
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('meta_language_leak:summary');
  });

  test('rejects the model echoing its own field names as prose', () => {
    const result = validateMolinoInterpretationSemantics({
      ...CONTRACT,
      summary: 'summary: connective synthesis: pattern emergent when systems read together.',
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('meta_language_leak:summary');
  });

  test('rejects chain-of-thought leak nested inside corePattern', () => {
    const result = validateMolinoInterpretationSemantics({
      ...CONTRACT,
      corePattern: { what: 'corePattern: object with what, source, whyItMatters', source: 'x', whyItMatters: 'y' },
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('meta_language_leak:corePattern.what');
  });

  test('rejects meta-language leak inside an array field (tensions)', () => {
    const result = validateMolinoInterpretationSemantics({
      ...CONTRACT,
      tensions: ['tensions: list of real tensions, different from free section.'],
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('meta_language_leak:tensions');
  });

  test('rejects a summary too short to be real prose', () => {
    const result = validateMolinoInterpretationSemantics({ ...CONTRACT, summary: 'ok' });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('summary_too_short');
  });

  test('rejects a summary far longer than any real interpretation would be', () => {
    const result = validateMolinoInterpretationSemantics({ ...CONTRACT, summary: 'x'.repeat(3001) });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('summary_too_long');
  });

  test('does not flag legitimate Spanish prose mentioning ordinary words like "instrucciones" in context', () => {
    // Sanity check: the patterns target English meta-language, not any
    // mention of related Spanish concepts in real interpretive text.
    const result = validateMolinoInterpretationSemantics({
      ...CONTRACT,
      whatToConsider: ['Seguí tus propias instrucciones internas antes que las ajenas.'],
    });
    expect(result.valid).toBe(true);
  });
});
