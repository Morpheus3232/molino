import { NextRequest, NextResponse } from 'next/server';
import { createGiftPreference, generateGiftCode } from '@/lib/mercadopago';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, PAYMENT_RATE_LIMIT } from '@/lib/rate-limit';

/**
 * Crea la preferencia de pago de un regalo. A diferencia de
 * /api/mp/preference, no requiere birthDate/salt — el comprador no conoce
 * la fecha de nacimiento del destinatario. El gift_code se genera acá,
 * antes del pago, y viaja en la metadata de MercadoPago para que el
 * webhook lo deje listo para canjear una vez confirmado el pago.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'gift/create'), PAYMENT_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const giftCode = generateGiftCode();
    const result = await createGiftPreference(giftCode);

    if (!result.preferenceId || !result.checkoutUrl) {
      return NextResponse.json({ error: 'Failed to create gift preference' }, { status: 500 });
    }

    return NextResponse.json({ ...result, giftCode });
  } catch (error) {
    console.error('[Gift Create] Error:', error);
    return NextResponse.json({ error: 'Failed to create gift preference' }, { status: 500 });
  }
}
