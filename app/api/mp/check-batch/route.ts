import { NextRequest, NextResponse } from 'next/server';
import { hasPremiumAccess } from '@/lib/kv';
import { hashProfile } from '@/lib/mercadopago';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, CHECK_RATE_LIMIT } from '@/lib/rate-limit';

/**
 * Estado premium de varios mapas de la bóveda en una sola request — para que
 * "Mis Mapas" pueda marcar cuáles tienen La Lectura incluida y cuáles no.
 *
 * Deliberadamente separado de /api/mp/check en vez de agregarle un segundo
 * shape de respuesta: ese endpoint lo llaman PremiumGate, usePremiumAccess y
 * el polling de pago dentro del mismo page load, y mezclar dos contratos en
 * la ruta caliente del cobro es justo donde no conviene ahorrar un archivo.
 *
 * NO emite premiumToken. Un token es una credencial de dispositivo que
 * habilita las llamadas de IA pagas; esto es solo un indicador de UI, y
 * emitir tokens para N perfiles de una sería ampliar la superficie de la
 * credencial sin necesidad. Quien abre un mapa premium pasa igual por
 * /api/mp/check, que sí lo emite (y se auto-repara si se perdió).
 */

// Techo de perfiles por request: la bóveda es local y chica por naturaleza,
// pero el body lo controla el cliente — sin cap, una request podría pedir
// miles de lookups a KV.
const MAX_PROFILES = 25;

interface ProfileQuery {
  id?: string;
  name?: string;
  birthDate?: string;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'mp/check-batch'), CHECK_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const { profiles, salt } = await req.json().catch(() => ({}));

    if (!Array.isArray(profiles)) {
      return NextResponse.json({ error: 'profiles[] is required' }, { status: 400 });
    }

    const list = (profiles as ProfileQuery[]).slice(0, MAX_PROFILES);

    const entries = await Promise.all(
      list.map(async (p) => {
        const id = typeof p?.id === 'string' ? p.id : '';
        const birthDate = typeof p?.birthDate === 'string' ? p.birthDate : '';
        if (!id || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return null;
        try {
          const premium = await hasPremiumAccess(hashProfile(p.name ?? '', birthDate, salt));
          return [id, premium] as const;
        } catch {
          // Un fallo de KV en un mapa no debe tumbar el estado de los otros —
          // se reporta como "sin lectura" (fail-closed para un badge de UI,
          // que nunca es la frontera de seguridad: el gate real vive en
          // /api/intelligence/interpret).
          return [id, false] as const;
        }
      })
    );

    const status: Record<string, boolean> = {};
    for (const entry of entries) {
      if (entry) status[entry[0]] = entry[1];
    }

    return NextResponse.json(
      { status },
      { headers: { 'Cache-Control': 'private, no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('[MP CheckBatch] Error:', error);
    return NextResponse.json({ error: 'Check failed', status: {} }, { status: 500 });
  }
}
