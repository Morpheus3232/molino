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

    const metadataHash = payment.metadata?.profile_hash as string | undefined;
    const calculatedHash = name && birthDate ? hashProfile(name, birthDate) : undefined;

    // If both metadata hash and calculated hash exist, they must match.
    // This prevents a user from claiming another person's payment by
    // providing their own PII when metadata contains a different hash.
    if (metadataHash && calculatedHash && metadataHash !== calculatedHash) {
      return NextResponse.json({
        verified: false,
        reason: 'El ID de pago no corresponde a este perfil.',
      }, { status: 400 });
    }

    const targetHash = metadataHash || calculatedHash;

    if (!targetHash) {
      return NextResponse.json({
        verified: false,
        reason: 'No se pudo vincular el pago a un mapa. Proporcioná tu nombre y fecha de nacimiento registrados.',
      }, { status: 400 });
    }

    await grantPremiumAccess(targetHash, String(paymentId));

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
