import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { redeemGiftCode, grantPremiumAccess, savePremiumToken, saveProfileSalt } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, GIFT_REDEEM_RATE_LIMIT } from '@/lib/rate-limit';
import { paymentIdentitySchema } from '@/lib/validation/payments';

/**
 * El destinatario aporta su propia fecha de nacimiento acá — es el único
 * momento en todo el flujo de regalo donde se calcula su profileHash real
 * (ver createGiftPreference en lib/mercadopago.ts: el comprador nunca pudo
 * hacerlo). Rate limit propio, más estricto que /api/mp/preference: el
 * espacio de códigos son ~40 bits, no billones, así que hay que frenar
 * intentos de fuerza bruta sobre /api/gift/[codigo]/redeem específicamente.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ codigo: string }> }) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'gift/redeem'), GIFT_REDEEM_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const { codigo } = await params;

  try {
    const body = await req.json();
    const identity = paymentIdentitySchema.safeParse(body);
    if (!identity.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, birthDate, salt } = identity.data;
    const profileHash = hashProfile(name, birthDate, salt);

    const result = await redeemGiftCode(codigo, profileHash);
    if (!result.success) {
      const message =
        result.reason === 'already_redeemed'
          ? 'Este código ya fue canjeado.'
          : 'Este código no existe o ya expiró.';
      return NextResponse.json({ redeemed: false, reason: result.reason, error: message }, { status: 400 });
    }

    await grantPremiumAccess(profileHash, result.paymentId);
    if (salt) await saveProfileSalt(profileHash, salt);
    const premiumToken = await savePremiumToken(profileHash);
    if (!premiumToken) {
      return NextResponse.json({
        error: 'No pudimos activar tu acceso en este momento — probá de nuevo en unos minutos.',
      }, { status: 503 });
    }

    return NextResponse.json({ redeemed: true, premiumToken });
  } catch (error) {
    console.error('[Gift Redeem] Error:', error);
    return NextResponse.json({ error: 'Redemption failed' }, { status: 500 });
  }
}
