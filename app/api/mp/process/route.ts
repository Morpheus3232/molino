import { NextRequest, NextResponse } from 'next/server';
import { processPayment, hashProfile } from '@/lib/mercadopago';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, PAYMENT_RATE_LIMIT } from '@/lib/rate-limit';
import { isValidDate } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'mp/process'), PAYMENT_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const { name, birthDate, paymentData, salt } = await req.json();

    if (!birthDate || !paymentData) {
      return NextResponse.json(
        { error: 'birthDate and paymentData are required' },
        { status: 400 },
      );
    }

    if (!isValidDate(birthDate)) {
      return NextResponse.json(
        { error: 'birthDate must be a valid date in YYYY-MM-DD format (year >= 1900, not future)' },
        { status: 400 },
      );
    }

    const profileHash = hashProfile(name ?? '', birthDate, salt);
    const result = await processPayment({ profileHash, paymentData });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[MP Process] Error:', error);
    return NextResponse.json(
      {
        error: 'Payment processing failed',
        status: 'rejected',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
