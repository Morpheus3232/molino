import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus, validatePayment, verifyWebhookSignature } from '@/lib/mercadopago';
import { grantPremiumAccess, isPaymentProcessed, markPaymentProcessed } from '@/lib/kv';
import { hashProfile } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-signature');
    const requestId = req.headers.get('x-request-id');
    const body = await req.text();

    let data: { type?: string; data?: { id?: string | number }; action?: string };
    try {
      data = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!data.data || !data.data.id) {
      return NextResponse.json({ received: true });
    }

    const paymentId = String(data.data.id);

    if (!verifyWebhookSignature(signature, requestId, paymentId, body)) {
      console.warn(`[MP Webhook] Invalid signature for payment ${paymentId}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const alreadyProcessed = await isPaymentProcessed(paymentId);
    if (alreadyProcessed) {
      return NextResponse.json({ received: true, idempotent: true });
    }

    const payment = await getPaymentStatus(paymentId);

    const validation = validatePayment(payment);
    if (!validation.valid) {
      console.warn(`[MP Webhook] Payment validation failed for ${paymentId}: ${validation.reason}`);
      await markPaymentProcessed(paymentId);
      return NextResponse.json({ received: true, valid: false, reason: validation.reason });
    }

    const profileHash = payment.metadata?.profile_hash as string | undefined;
    if (!profileHash) {
      console.warn(`[MP Webhook] No profile_hash in metadata for payment ${paymentId}`);
      await markPaymentProcessed(paymentId);
      return NextResponse.json({ received: true, valid: false, reason: 'Missing profile_hash in metadata' });
    }

    await grantPremiumAccess(profileHash, paymentId);
    await markPaymentProcessed(paymentId);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[MP Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'MP webhook endpoint' });
}
