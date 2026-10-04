import { NextRequest, NextResponse } from 'next/server';
import { getGiftCode } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, CHECK_RATE_LIMIT } from '@/lib/rate-limit';

/**
 * Estado de un código para el DESTINATARIO, antes de mostrarle el
 * formulario de canje — nunca expone paymentId ni el profileHash de quién
 * ya lo canjeó, solo si puede seguir adelante.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ codigo: string }> }) {
  // Sin límite, este GET serviría de oráculo para enumerar códigos y
  // esquivaría el rate limit de /redeem.
  const rl = checkRateLimit(rateLimitKey(getClientIp(req), 'gift/lookup'), CHECK_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const { codigo } = await params;
  const gift = await getGiftCode(codigo);

  if (!gift) {
    return NextResponse.json({ valid: false, reason: 'not_found' });
  }
  if (gift.redeemed) {
    return NextResponse.json({ valid: false, reason: 'already_redeemed' });
  }
  return NextResponse.json({ valid: true });
}
