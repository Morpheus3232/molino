import { NextRequest, NextResponse } from 'next/server';
import { hasPremiumAccess, savePremiumToken } from '@/lib/kv';
import { hashProfile } from '@/lib/mercadopago';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, CHECK_RATE_LIMIT } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'mp/check'), CHECK_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const { name, birthDate } = await req.json();

    if (!birthDate) {
      return NextResponse.json(
        { error: 'birthDate is required' },
        { status: 400 },
      );
    }

    const profileHash = hashProfile(name ?? '', birthDate);
    const premium = await hasPremiumAccess(profileHash);
    // A device that already knows it's premium (returning visit) but lost
    // its device-bound token (localStorage cleared, new browser, token TTL
    // expired independently of the permanent premium grant) would otherwise
    // pass this check yet 403 on every AI call — see /api/intelligence/interpret.
    // Re-issuing here self-heals that gap the same way verify/recover/coupon do.
    const premiumToken = premium ? await savePremiumToken(profileHash) : undefined;

    return NextResponse.json({ premium, ...(premiumToken && { premiumToken }) });
  } catch (error) {
    console.error('[MP Check] Error:', error);
    return NextResponse.json(
      { error: 'Check failed', premium: false },
      { status: 500 },
    );
  }
}
