import { NextResponse } from 'next/server';
import { getProviderStatus } from '@/lib/engines/providerRouter';
import { buildIntelligencePrompt } from '@/lib/engines/intelligenceEngine';
import { buildMolinoContext } from '@/lib/engines/intelligence/contextBuilder';
import { calculateUserProfile } from '@/lib/engines/profileBuilder';

/** DIAGNÓSTICO TEMPORAL — perfil fijo dummy, ningún dato de usuario. */
function promptProbe() {
  try {
    const profile = calculateUserProfile('', '1990-01-01');
    const context = buildMolinoContext(profile, {});
    const prompt = buildIntelligencePrompt({ type: 'personal_profile', context });
    return {
      chars: prompt.length,
      tieneRegistroDiagnostico: prompt.includes('REGISTRO: DIAGNÓSTICO'),
      pideBlindSpot: prompt.includes('"blindSpot"'),
      pideLifeAreas: prompt.includes('"lifeAreas"'),
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

/** DIAGNÓSTICO TEMPORAL — una llamada real, perfil dummy, devuelve solo la
 * forma de la respuesta (claves), nunca contenido de usuario. */
async function liveProbe() {
  const { generateWithOpenRouter } = await import('@/lib/engines/aiEngine');
  const { extractJSON } = await import('@/lib/engines/aiResponseParser');
  const profile = calculateUserProfile('', '1990-01-01');
  const context = buildMolinoContext(profile, {});
  const prompt = buildIntelligencePrompt({ type: 'personal_profile', context });
  const compatResult: any = {
    user: profile, target: {},
    scores: { numerology: 50, westernAstrology: 50, chineseAstrology: 50, archetype: 50, element: 50, overall: 50 },
    strengths: [], challenges: [], narrative: '', insight: '',
  };
  const started = Date.now();
  try {
    const r: any = await generateWithOpenRouter(profile as any, { name: 'Análisis' } as any, compatResult, prompt, 60_000);
    const ex = extractJSON(r?.rawResponse || '');
    return {
      ms: Date.now() - started,
      model: r?.model,
      rawLen: (r?.rawResponse || '').length,
      extractOk: ex.ok,
      keys: ex.ok ? Object.keys(ex.data as object) : null,
      blindSpotType: ex.ok ? typeof (ex.data as any).blindSpot : null,
      lifeAreasType: ex.ok ? typeof (ex.data as any).lifeAreas : null,
    };
  } catch (e) {
    return { ms: Date.now() - started, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET(req: Request) {
  const status = getProviderStatus();
  if (new URL(req.url).searchParams.get('live') === '1') {
    return NextResponse.json({ live: await liveProbe() });
  }

  /**
   * Estado del prompt builder, como booleano — nunca el valor crudo del env
   * var. `intelligenceEngineV2` refleja la MISMA comparación estricta que hace
   * buildIntelligencePrompt (=== 'true'), así que un valor tipeado distinto
   * ("TRUE", "1", "true " con espacio) se ve acá como `false`, que es lo que
   * realmente pasa en runtime.
   *
   * Existe porque esa divergencia ya costó caro: la documentación daba V2 por
   * activo en producción, el prompt legacy era el que corría, y no había forma
   * de notarlo desde afuera — solo se manifestaba como campos que faltaban en
   * la lectura paga.
   */
  return NextResponse.json({
    ...status,
    intelligenceEngineV2: process.env.INTELLIGENCE_ENGINE_V2_ENABLED === 'true',
    // El identificador del modelo no es una credencial (es equivalente a
    // decir "usamos gpt-4"), y saber cuál corre realmente es lo que separa
    // "la lectura sale mal" de "está corriendo el modelo equivocado".
    openrouterModel: process.env.OPENROUTER_MODEL || '(sin setear → default)',
    promptProbe: promptProbe(),
  });
}
