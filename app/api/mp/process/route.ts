import { NextRequest, NextResponse } from 'next/server';
import { processPayment, hashProfile } from '@/lib/mercadopago';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, PAYMENT_RATE_LIMIT } from '@/lib/rate-limit';
import { paymentIdentitySchema } from '@/lib/validation/payments';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'mp/process'), PAYMENT_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await req.json().catch(() => ({}));
    const identity = paymentIdentitySchema.safeParse(body);
    const paymentData = body?.paymentData;
    if (!identity.success || !paymentData || typeof paymentData !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, birthDate, salt } = identity.data;
    const profileHash = hashProfile(name, birthDate, salt);
    const result = await processPayment({ profileHash, paymentData });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[MP Process] Error:', error);
    return NextResponse.json(
      {
        error: 'Payment processing failed',
        status: 'rejected'
      },
      { status: 500 },
    );
  }
}
