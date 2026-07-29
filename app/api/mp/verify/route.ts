import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus, validatePayment, hashProfile } from '@/lib/mercadopago';
import { hasPremiumAccess, grantPremiumAccess } from '@/lib/kv';

export async function POST(req: NextRequest) {
  try {
    const { paymentId, name, birthDate } = await req.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId is required' },
        { status: 400 },
      );
    }

    if (name && birthDate) {
      const profileHash = hashProfile(name, birthDate);
      const inKv = await hasPremiumAccess(profileHash);
      if (inKv) {
        return NextResponse.json({
          verified: true,
          source: 'kv',
          status: 'approved',
        });
      }
    }

    const payment = await getPaymentStatus(paymentId);

    const validation = validatePayment(payment);

    if (!validation.valid) {
      return NextResponse.json({
        verified: false,
        reason: validation.reason,
        status: payment.status,
        source: 'mp-api',
      });
    }

    const targetHash =
      (payment.metadata?.profile_hash as string | undefined) ||
      (name && birthDate ? hashProfile(name, birthDate) : undefined);

    if (targetHash) {
      await grantPremiumAccess(targetHash, String(paymentId));
    }

    return NextResponse.json({
      verified: true,
      source: 'mp-api',
      status: payment.status,
      status_detail: payment.status_detail,
      transaction_amount: payment.transaction_amount,
    });
  } catch (error) {
    console.error('[MP Verify] Error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 },
    );
  }
}
