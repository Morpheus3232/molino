/**
 * Hardened Zod validation for payment payloads.
 *
 * Server-only. MP/PayPal webhooks and capture endpoints must validate every
 * field with these schemas before trusting any value (amount, currency,
 * product id, profile hash, status). This is the single source of truth for
 * "what a legitimate payment looks like" so the payment routes stop trusting
 * shape inferred from arbitrary JSON.
 */

import { z } from 'zod';

/** YYYY-MM-DD, year >= 1900, not in the future. */
export const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid birthDate format')
  .refine((v) => {
    const year = Number(v.slice(0, 4));
    const month = Number(v.slice(5, 7));
    const day = Number(v.slice(8, 10));
    if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    return true;
  }, 'birthDate out of range')
  .refine((v) => {
    const d = new Date(`${v}T00:00:00`);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return d <= now;
  }, 'birthDate cannot be in the future');

/** Product ids we actually sell. */
export const productIdSchema = z.string().min(1).max(64);

/** MP payment amount: legacy $8 USD / $11880 ARS, or plan prices. Positive finite. */
export const paymentAmountSchema = z.number().finite().positive();

/** MP status enum — anything else is rejected before it reaches the business logic. */
export const mpPaymentStatusSchema = z.enum(['approved', 'rejected', 'pending', 'in_process', 'refunded', 'charged_back', 'cancelled']);

export const mpCurrencySchema = z.enum(['USD', 'ARS']);

/** PayPal order id — alphanumeric with hyphens, bounded length. */
export const paypalOrderIdSchema = z.string().trim().min(6).max(64).regex(/^[A-Za-z0-9-]+$/);

/** Device-bound premium token (64 hex chars, as minted in lib/kv.ts). */
export const premiumTokenSchema = z.string().regex(/^[0-9a-f]{64}$/);

/** Optional device salt (UUID v4). */
export const saltSchema = z.string().regex(/^[0-9a-f-]{0,64}$/).optional();

/**
 * Shared body for the /api/mp/verify, /api/mp/recover, /api/paypal/capture-order
 * style endpoints: whatever identifies the profile + the idempotency key.
 */
export const paymentIdentitySchema = z.object({
  name: z.string().max(120).optional().default(''),
  birthDate: birthDateSchema,
  salt: saltSchema,
});

/** Stripe webhook event — minimal fields we trust. */
export const stripeEventSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  data: z.object({
    object: z.record(z.string(), z.unknown()).optional(),
  }),
});

export type PaymentIdentityInput = z.input<typeof paymentIdentitySchema>;
export type PaymentIdentity = z.output<typeof paymentIdentitySchema>;