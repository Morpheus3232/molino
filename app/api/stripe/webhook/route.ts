import { NextRequest, NextResponse } from 'next/server';
import { constructStripeEvent, validateStripePayment } from '@/lib/stripe';
import { grantPremiumAccess, markPaymentProcessed, isPaymentProcessed, hasPremiumAccess, savePremiumToken } from '@/lib/kv';
import { stripeEventSchema } from '@/lib/validation/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PRODUCT_ID = 'molino_premium';
const PRODUCT_PRICE_USD = 8;

/**
 * Stripe webhook — validated via HMAC (constructEvent), then idempotent grant.
 * Only event types that represent a successful payment trigger a grant; every
 * other event is acknowledged (200) without side effects so Stripe stops
 * retrying.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = constructStripeEvent(rawBody, signature);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Validate the event shape before trusting any field.
  const parsed = stripeEventSchema.safeParse(event);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Malformed event' }, { status: 400 });
  }

  // Idempotency: the event id IS the idempotency key.
  const eventId = parsed.data.id;
  const alreadyProcessed = await isPaymentProcessed(eventId);
  if (alreadyProcessed) {
    return NextResponse.json({ received: true, idempotent: true });
  }

  // Only these event types represent money received.
  if (event.type !== 'checkout.session.completed' && event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ received: true });
  }

  const object = (event.data.object ?? {}) as unknown as Record<string, unknown>;
  let profileHash: string | undefined;
  let paymentId: string | undefined;

  if (event.type === 'checkout.session.completed') {
    profileHash = object?.client_reference_id as string | undefined;
    paymentId = object?.id as string | undefined;
  } else {
    const metadata = (object?.metadata ?? {}) as Record<string, unknown>;
    profileHash = metadata?.profile_hash as string | undefined;
    paymentId = object?.id as string | undefined;
  }

  const paymentValid = validateStripePayment(object, PRODUCT_PRICE_USD, PRODUCT_ID);
  if (!paymentValid.valid) {
    console.warn(`[Stripe Webhook] Validation failed for ${paymentId}: ${paymentValid.reason}`);
    return NextResponse.json({ received: true, valid: false, reason: paymentValid.reason });
  }

  if (!profileHash) {
    console.warn(`[Stripe Webhook] No profile_hash for payment ${paymentId}`);
    return NextResponse.json({ received: true, valid: false, reason: 'Missing profile_hash' });
  }

  // Grant FIRST, then mark — so a retry after a grant failure re-grants.
  await grantPremiumAccess(profileHash, paymentId || eventId);

  const isFirstTime = await markPaymentProcessed(eventId);
  if (!isFirstTime) {
    const hasAccess = await hasPremiumAccess(profileHash);
    if (!hasAccess) await grantPremiumAccess(profileHash, paymentId || eventId);
  }

  // Device token for the new owner (returns raw token for client storage).
  await savePremiumToken(profileHash);

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Stripe webhook endpoint' });
}