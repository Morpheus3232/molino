import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { grantPremiumAccess, savePremiumToken, saveProfileSalt } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, COUPON_RATE_LIMIT } from '@/lib/rate-limit';
import { isValidDate } from '@/lib/validation';

const COUPON_CODE = process.env.PREMIUM_COUPON;

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
    if (!COUPON_CODE || coupon.trim() !== COUPON_CODE) {
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
        error: 'No pudimos confirmar tu acceso en este momento — probá de nuevo en unos minutos. Si el problema persiste, escribinos con tu payment ID a hola@molino.app.',
      }, { status: 503 });
    }

    return NextResponse.json({ valid: true, premiumToken });
  } catch (error) {
    console.error('[Coupon] Error:', error);
    return NextResponse.json(
      { valid: false, reason: 'Error al procesar el cupón' },
      { status: 500 },
    );
  }
}