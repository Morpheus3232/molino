import { describe, it, expect } from 'vitest';
import { normalizeQuestion, detectDecisionIntent } from '../decisionIntent';

describe('normalizeQuestion', () => {
  it('lowercases, trims, removes accents and collapses spaces', () => {
    expect(normalizeQuestion('  ¿Debéría   ACEPTAR esta oferta?  ')).toBe('¿deberia aceptar esta oferta?');
    expect(normalizeQuestion('')).toBe('');
  });
});

describe('detectDecisionIntent', () => {
  it('detects ACCION with domain', () => {
    const intent = detectDecisionIntent('¿debería aceptar esta oferta de trabajo?', 'career');
    expect(intent).not.toBeNull();
    expect(intent!.kind).toBe('accion');
    expect(intent!.domain).toContain('trabajo');
  });

  it('detects ESPERA', () => {
    const intent = detectDecisionIntent('¿conviene esperar antes de comprar un auto?', 'finances');
    expect(intent).not.toBeNull();
    expect(intent!.kind).toBe('espera');
  });

  it('detects REVISAR', () => {
    const intent = detectDecisionIntent('¿debería dejar mi trabajo actual?', 'career');
    expect(intent).not.toBeNull();
    expect(intent!.kind).toBe('revisar');
  });

  it('returns null for ambiguous or empty text', () => {
    expect(detectDecisionIntent('¿qué conviene hacer con X?', 'career')).toBeNull();
    expect(detectDecisionIntent('¿hola?', 'career')).toBeNull();
    expect(detectDecisionIntent('', 'career')).toBeNull();
  });

  it('returns null for a bare noun without a signal verb', () => {
    expect(detectDecisionIntent('¿casa o trabajo?', 'personal')).toBeNull();
  });

  it('is deterministic across repeated calls', () => {
    const input = '¿debería aceptar esta oferta de trabajo?';
    const a = detectDecisionIntent(input, 'career');
    const b = detectDecisionIntent(input, 'career');
    const c = detectDecisionIntent(input, 'career');
    expect(a).toEqual(b);
    expect(b).toEqual(c);
  });

  it('avoids substring false positives for derived/noun forms', () => {
    // "esperanza" contains "espera", but word boundaries must reject it
    expect(detectDecisionIntent('¿hay esperanza en este proyecto?', 'personal')).toBeNull();
    // "comprando" (gerund) should not trigger "comprar"
    expect(detectDecisionIntent('¿estoy comprando el auto?', 'finances')).toBeNull();
  });

  it('does not classify dating/social "salir" as revisar', () => {
    expect(detectDecisionIntent('¿debería salir con mi novio?', 'relationships')).toBeNull();
    expect(detectDecisionIntent('¿salimos a cenar esta noche?', 'personal')).toBeNull();
  });
});
