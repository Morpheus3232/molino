import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { createOrder } from '@/lib/paypal';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, PAYMENT_RATE_LIMIT } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'paypal/create-order'), PAYMENT_RATE_LIMIT);
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
    const order = await createOrder(profileHash);

    return NextResponse.json(order);
  } catch (error) {
    console.error('[PayPal Create Order] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 },
    );
  }
}
