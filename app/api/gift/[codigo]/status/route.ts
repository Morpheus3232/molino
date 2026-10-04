import { NextRequest, NextResponse } from 'next/server';
import { getGiftCode } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, CHECK_RATE_LIMIT } from '@/lib/rate-limit';

/**
 * Estado de un código para el COMPRADOR — puede consultar si ya fue
 * canjeado, pero nunca quién lo canjeó (no se expone redeemedProfileHash,
 * el comprador no tiene por qué saber la identidad hasheada de a quién
 * regaló, mucho menos indirectamente derivar su fecha de nacimiento).
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ codigo: string }> }) {
  // Sin límite, este GET serviría de oráculo para enumerar códigos y
  // esquivaría el rate limit de /redeem.
  const rl = checkRateLimit(rateLimitKey(getClientIp(req), 'gift/lookup'), CHECK_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const { codigo } = await params;
  const gift = await getGiftCode(codigo);

  if (!gift) {
    return NextResponse.json({ found: false });
  }
  return NextResponse.json({ found: true, redeemed: gift.redeemed });
}
