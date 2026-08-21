import { NextRequest, NextResponse } from 'next/server';
import { consumeRecoveryLinkToken, getOrCreatePremiumToken } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Exchanges a one-time recovery link token (from the confirmation email)
 * for the real device-bound premium_token. The real token never travels in
 * the email itself — only this short-lived, single-use token does.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const profileHash = await consumeRecoveryLinkToken(token);
  if (!profileHash) {
    return NextResponse.json({ error: 'Link inválido o expirado' }, { status: 410 });
  }

  const premiumToken = await getOrCreatePremiumToken(profileHash);
  if (!premiumToken) {
    return NextResponse.json({
      error: 'No pudimos confirmar tu acceso en este momento — probá de nuevo en unos minutos. Si el problema persiste, escribinos con tu payment ID a hola@molino.app.',
    }, { status: 503 });
  }

  return NextResponse.json({ profileHash, premiumToken });
}
