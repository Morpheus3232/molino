import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { grantPremiumAccess, savePremiumToken, saveProfileSalt, countCouponRedemption, getCouponCounts } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, COUPON_RATE_LIMIT } from '@/lib/rate-limit';
import { isValidDate } from '@/lib/validation';

/**
 * PREMIUM_COUPON acepta una lista separada por comas: un código por
 * influencer ("VALEN,CAFECONSOMBRA"). Cada canje se cuenta por código en KV,
 * así se sabe cuánta gente trajo cada uno. Un solo valor sigue funcionando
 * igual que antes.
 *
 * La comparación es case-insensitive a propósito: la audiencia lo tipea en
 * el teléfono y el autocorrector capitaliza.
 */
const COUPON_CODES = (process.env.PREMIUM_COUPON ?? '')
  .split(',')
  .map((c) => c.trim().toUpperCase())
  .filter(Boolean);

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'mp/coupon'), COUPON_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const { coupon, name, birthDate, salt } = await req.json();

    if (!coupon || !birthDate) {
      return NextResponse.json(
        { valid: false, reason: 'Faltan datos requeridos' },
        { status: 400 },
      );
    }

    if (!isValidDate(birthDate)) {
      return NextResponse.json(
        { valid: false, reason: 'birthDate must be a valid date in YYYY-MM-DD format (year >= 1900, not future)' },
        { status: 400 },
      );
    }

    // Sin PREMIUM_COUPON configurado, el canje queda deshabilitado — nunca
    // hay un código por defecto que otorgue acceso gratis.
    const code = String(coupon).trim().toUpperCase();
    if (!COUPON_CODES.includes(code)) {
      return NextResponse.json(
        { valid: false, reason: 'Código de cupón inválido' },
        { status: 400 },
      );
    }

    const profileHash = hashProfile(name ?? '', birthDate, salt);
    const paymentId = `coupon_${profileHash}_${Date.now()}`;

    await grantPremiumAccess(profileHash, paymentId);
    if (salt) await saveProfileSalt(profileHash, salt);
    const premiumToken = await savePremiumToken(profileHash);
    if (!premiumToken) {
      return NextResponse.json({
        error: 'No pudimos confirmar tu acceso en este momento — probá de nuevo en unos minutos. Si el problema persiste, escribinos con tu payment ID a versionlimitada@proton.me.',
      }, { status: 503 });
    }

    // Después del grant: si esto falla, la persona igual entra. El conteo es
    // métrica, no una condición de acceso.
    await countCouponRedemption(code, profileHash);

    return NextResponse.json({ valid: true, premiumToken });
  } catch (error) {
    console.error('[Coupon] Error:', error);
    return NextResponse.json(
      { valid: false, reason: 'Error al procesar el cupón' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/mp/coupon?secret=... → cuántas personas canjeó cada código.
 * Sin COUPON_STATS_SECRET configurado el endpoint no existe (404), para que
 * un deploy sin la variable no exponga las métricas a cualquiera.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.COUPON_STATS_SECRET;
  if (!secret || req.nextUrl.searchParams.get('secret') !== secret) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.json({ codes: await getCouponCounts(COUPON_CODES) });
}
