import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus, validatePayment, verifyWebhookSignature } from '@/lib/mercadopago';
import { grantPremiumAccess, hasPremiumAccess, markPaymentProcessed, revokeAccess } from '@/lib/kv';
import { incrementMemberCount } from '@/lib/metrics';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-signature');
    const requestId = req.headers.get('x-request-id');
    const body = await req.text();

    let data: { type?: string; data?: { id?: string | number }; action?: string } = {};
    try {
      if (body) {
        data = JSON.parse(body);
      }
    } catch (parseErr) {
      console.error('[MP Webhook] JSON parse failed', {
        contentType: req.headers.get('content-type'),
        bodyLength: body.length,
        bodyPreview: body.slice(0, 300),
        parseError: parseErr instanceof Error ? parseErr.message : String(parseErr),
      });
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const searchParamsDataId = req.nextUrl.searchParams.get('data.id') || req.nextUrl.searchParams.get('id');
    const rawPaymentId = data.data?.id ?? searchParamsDataId;

    if (!rawPaymentId) {
      return NextResponse.json({ received: true });
    }

    const paymentId = String(rawPaymentId);

    if (!verifyWebhookSignature(signature, requestId, paymentId, body)) {
      console.warn(`[MP Webhook] Invalid signature for payment ${paymentId}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payment = await getPaymentStatus(paymentId);
    const profileHash = payment.metadata?.profile_hash as string | undefined;

    if (payment.status === 'refunded' || payment.status === 'charged_back' || payment.status === 'cancelled') {
      if (profileHash) {
        await revokeAccess(profileHash, paymentId);
      }
      return NextResponse.json({ received: true, status: payment.status, revoked: true });
    }

    // Validate BEFORE consuming idempotency — invalid payments must never
    // consume the processed flag, otherwise a transient validation failure
    // causes all subsequent retries to silently skip granting.
    const validation = validatePayment(payment);
    if (!validation.valid) {
      console.warn(`[MP Webhook] Payment validation failed for ${paymentId}: ${validation.reason}`);
      return NextResponse.json({ received: true, valid: false, reason: validation.reason });
    }

    if (!profileHash) {
      console.warn(`[MP Webhook] No profile_hash in metadata for payment ${paymentId}`);
      return NextResponse.json({ received: true, valid: false, reason: 'Missing profile_hash in metadata' });
    }

    // Grant FIRST, then mark. If grant fails after mark, retry would
    // silently skip granting (the old bug). This ordering guarantees
    // premium access is always in place before we consume idempotency.
    await grantPremiumAccess(profileHash, paymentId);

    const isFirstTime = await markPaymentProcessed(paymentId);
    if (!isFirstTime) {
      // Already processed — verify access exists, retry grant if missing.
      const hasAccess = await hasPremiumAccess(profileHash);
      if (!hasAccess) {
        await grantPremiumAccess(profileHash, paymentId);
      }
    } else {
      // Only count on the FIRST successful grant of this payment, so the
      // transparent member counter reflects real, validated purchases.
      await incrementMemberCount(profileHash);
    }

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
