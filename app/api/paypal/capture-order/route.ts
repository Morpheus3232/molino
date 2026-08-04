import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { captureOrder, validateOrder } from '@/lib/paypal';
import { grantPremiumAccess, hasPremiumAccess, isPaymentProcessed, markPaymentProcessed } from '@/lib/kv';

export async function POST(req: NextRequest) {
  try {
    const { orderId, name, birthDate } = await req.json();

    if (!orderId || !birthDate) {
      return NextResponse.json(
        { error: 'orderId and birthDate are required' },
        { status: 400 },
      );
    }

    const cleanOrderId = String(orderId).trim();
    const profileHash = hashProfile(name ?? '', birthDate);

    const alreadyProcessed = await isPaymentProcessed(cleanOrderId);
    const order = await captureOrder(cleanOrderId);

    const validation = validateOrder(order, profileHash);
    if (!validation.valid) {
      return NextResponse.json(
        {
          verified: false,
          reason: validation.reason,
          status: order.status,
        },
        { status: 400 },
      );
    }

    if (alreadyProcessed) {
      const hasAccess = await hasPremiumAccess(profileHash);
      if (!hasAccess) {
        await grantPremiumAccess(profileHash, cleanOrderId);
      }
      return NextResponse.json({
        verified: true,
        status: order.status,
        orderId: cleanOrderId,
        idempotent: true,
      });
    }

    await grantPremiumAccess(profileHash, cleanOrderId);
    await markPaymentProcessed(cleanOrderId);

    return NextResponse.json({
      verified: true,
      status: order.status,
      orderId: cleanOrderId,
      idempotent: false,
    });
  } catch (error) {
    console.error('[PayPal Capture Order] Error:', error);
    return NextResponse.json(
      { verified: false, error: 'Capture failed' },
      { status: 500 },
    );
  }
}
