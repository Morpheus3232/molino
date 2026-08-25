import { NextResponse } from 'next/server';
import { getProviderStatus } from '@/lib/engines/providerRouter';

export async function GET() {
  const status = getProviderStatus();

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
  });
}
