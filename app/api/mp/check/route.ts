import { NextRequest, NextResponse } from 'next/server';
import { hasPremiumAccess, getOrCreatePremiumToken } from '@/lib/kv';
import { hashProfile } from '@/lib/mercadopago';
import { paymentIdentitySchema } from '@/lib/validation/payments';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, CHECK_RATE_LIMIT } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'mp/check'), CHECK_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const identity = paymentIdentitySchema.safeParse(await req.json().catch(() => ({})));
    if (!identity.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, birthDate, salt } = identity.data;
    const profileHash = hashProfile(name, birthDate, salt);
    const premium = await hasPremiumAccess(profileHash);
    // A device that already knows it's premium (returning visit) but lost
    // its device-bound token (localStorage cleared, new browser, token TTL
    // expired independently of the permanent premium grant) would otherwise
    // pass this check yet 403 on every AI call — see /api/intelligence/interpret.
    // getOrCreatePremiumToken self-heals that gap the same way verify/recover/
    // coupon do, WITHOUT rotating a token that's already valid — this endpoint
    // is called from multiple independent places in the same page load
    // (PremiumGate + usePremiumAccess + polling), so rotating here would
    // invalidate a token another call just issued moments earlier.
    const premiumToken = premium ? await getOrCreatePremiumToken(profileHash) : undefined;

    return NextResponse.json({ premium, ...(premiumToken && { premiumToken }) });
  } catch (error) {
    console.error('[MP Check] Error:', error);
    return NextResponse.json(
      { error: 'Check failed', premium: false },
      { status: 500 },
    );
  }
}
