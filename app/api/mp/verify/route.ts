import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/mercadopago';
import { hasPremiumAccess, grantPremiumAccess } from '@/lib/kv';

export async function POST(req: NextRequest) {
  try {
    const { paymentId, profileHash } = await req.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'paymentId is required' },
        { status: 400 }
      );
    }

    // First check KV (source of truth)
    if (profileHash) {
      const inKv = await hasPremiumAccess(profileHash);
      if (inKv) {
        return NextResponse.json({
          verified: true,
          source: 'kv',
          status: 'approved',
        });
      }
    }

    // Fallback: verify against MP API directly
    const payment = await getPaymentStatus(paymentId);

    const verified = payment.status === 'approved';

    // Persist to KV if approved (catches edge cases webhook missed)
    if (verified && profileHash) {
      await grantPremiumAccess(profileHash, paymentId);
    }

    return NextResponse.json({
      verified,
      source: verified ? 'mp-api' : 'none',
      status: payment.status,
      status_detail: payment.status_detail,
      payment_method_id: payment.payment_method_id,
      transaction_amount: payment.transaction_amount,
      metadata: payment.metadata,
    });
  } catch (error) {
    console.error('[MP Verify] Error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
