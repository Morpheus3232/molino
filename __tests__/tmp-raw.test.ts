/* TEMPORAL — se borra. Perfil EXACTO de producción, camino exacto. */
import { describe, it, vi } from 'vitest';
import { generateWithOpenRouter } from '@/lib/engines/aiEngine';
import { buildIntelligencePrompt } from '@/lib/engines/intelligenceEngine';
import { buildMolinoContext } from '@/lib/engines/intelligence/contextBuilder';
import { calculateUserProfile } from '@/lib/engines/profileBuilder';
import { extractJSON } from '@/lib/engines/aiResponseParser';

describe('raw prod-profile', () => {
  it('María 1990-03-15', async () => {
    vi.stubEnv('OPENROUTER_MODEL', 'google/gemini-2.5-flash');
    vi.stubEnv('INTELLIGENCE_ENGINE_V2_ENABLED', 'true');

    const profile = calculateUserProfile('María', '1990-03-15');
    const context = buildMolinoContext(profile, {});
    const prompt = buildIntelligencePrompt({ type: 'personal_profile', context });
    console.log(`V2activo=${prompt.includes('REGISTRO: DIAGNÓSTICO')} pidebBlindSpot=${prompt.includes('"blindSpot"')} promptChars=${prompt.length}`);

    const compatResult: any = {
      user: profile, target: {},
      scores: { numerology:50, westernAstrology:50, chineseAstrology:50, archetype:50, element:50, overall:50 },
      strengths: [], challenges: [], narrative: '', insight: '',
    };
    const r: any = await generateWithOpenRouter(profile as any, { name: 'Análisis' } as any, compatResult, prompt, 70_000);
    const ex = extractJSON(r.rawResponse || '');
    console.log(`model=${r.model} extractOk=${ex.ok}`);
    if (ex.ok) {
      const d: any = ex.data;
      console.log(`blindSpot=${JSON.stringify(d.blindSpot)?.slice(0,150)}`);
      console.log(`lifeAreas=${JSON.stringify(d.lifeAreas)?.slice(0,150)}`);
    }
  }, 200_000);
});
