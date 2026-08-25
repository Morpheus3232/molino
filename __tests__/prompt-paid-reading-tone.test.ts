/**
 * El registro diagnóstico de la lectura paga está deliberadamente acotado a
 * `personal_profile`. Estas dos invariantes son fáciles de romper sin darse
 * cuenta al editar el prompt:
 *
 * 1. Que el tono tajante se filtre al contenido gratuito y conversacional
 *    (daily_energy, timing, question, compatibility), cambiándole la voz a
 *    todo el producto.
 * 2. Que al aflojar el hedging se caiga también el límite médico/financiero/
 *    legal, que NO es una decisión de estilo sino de exposición real.
 */
import { describe, it, expect } from 'vitest';
import { buildIntelligencePromptV2 } from '@/lib/engines/intelligence/promptBuilder';
import { FIXTURE_REQUESTS } from '@/__tests__/fixtures/promptBuilderFixtures';

describe('V2 personal_profile', () => {
  it('lleva registro diagnóstico + campos nuevos, y conserva el límite legal', () => {
    const p = buildIntelligencePromptV2(FIXTURE_REQUESTS.personal_profile);
    expect(p).toContain('REGISTRO: DIAGNÓSTICO, NO SUGERENCIA');
    expect(p).toContain('"blindSpot"');
    expect(p).toContain('"lifeAreas"');
    expect(p).toContain('LÍMITE QUE NO SE NEGOCIA');
    expect(p).toContain('NO das consejo médico');
    expect(p).not.toContain('Usás lenguaje de autoconocimiento, no de certeza');
  });

  it('los tipos gratuitos NO reciben el registro diagnóstico', () => {
    for (const key of ['daily_energy', 'timing', 'question', 'compatibility'] as const) {
      const p = buildIntelligencePromptV2(FIXTURE_REQUESTS[key]);
      expect(p, key).not.toContain('REGISTRO: DIAGNÓSTICO');
      expect(p, key).toContain('Usás lenguaje de autoconocimiento, no de certeza');
      expect(p, key).toContain('LÍMITE QUE NO SE NEGOCIA');
    }
  });
});
