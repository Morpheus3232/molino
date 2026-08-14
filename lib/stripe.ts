/**
 * Stripe server helpers — webhook signature verification + idempotency.
 *
 * Uses the official `stripe` SDK for webhook HMAC verification (raw body is
 * required — Stripe signs the exact payload bytes). The business logic of a
 * Stripe event never touches PII: we only read the payment id / product /
 * amount from the event object, and grant premium access by profile hash.
 *
 * Server-only: never import from client components.
 */

import Stripe from 'stripe';

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('Missing required environment variable: STRIPE_WEBHOOK_SECRET');
  }
  return secret;
}

/**
 * Construct + verify a Stripe event from the raw body and the
 * `stripe-signature` header. Throws on invalid signature or malformed body —
 * callers turn that into a 400.
 */
export function constructStripeEvent(rawBody: string, signature: string | null): Stripe.Event {
  if (!signature) {
    throw new Error('Missing Stripe signature header');
  }
  const stripe = new Stripe(''); // never used for API calls here — only for webhook verification
  return stripe.webhooks.constructEvent(rawBody, signature, getWebhookSecret());
}

/**
 * Validate that a Stripe payment object represents a successful Molino premium
 * purchase at the expected amount. Stripe sends amounts in cents; `product`
 * lives in the metadata or as the line-item/product id.
 */
export function validateStripePayment(
  payment: Record<string, unknown>,
  expectedAmountUsd: number,
  expectedProduct: string,
): { valid: boolean; reason?: string } {
  const status = payment?.status;
  if (status !== 'succeeded' && status !== 'paid') {
    return { valid: false, reason: `Unexpected payment status: ${String(status)}` };
  }

  const amount = payment?.amount;
  const amountReceived = payment?.amount_received;
  const settledAmount = typeof amountReceived === 'number' ? amountReceived : amount;

  if (typeof settledAmount !== 'number' || settledAmount !== Math.round(expectedAmountUsd * 100)) {
    return {
      valid: false,
      reason: `Amount mismatch: got ${String(settledAmount)} cents, expected ${expectedAmountUsd * 100}`,
    };
  }

  const metadata = (payment?.metadata ?? {}) as Record<string, unknown>;
  const product = metadata?.product;
  if (typeof product === 'string' && product !== expectedProduct) {
    return { valid: false, reason: `Product mismatch: got '${product}'` };
  }

  return { valid: true };
}