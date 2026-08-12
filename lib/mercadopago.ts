import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { createHmac, timingSafeEqual } from 'crypto';
import { SITE_URL } from '@/lib/seo';

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const PRODUCT_PRICE_USD = 8;
const PRODUCT_PRICE_ARS = 11880;
const PRODUCT_CURRENCY_USD = 'USD';
const PRODUCT_CURRENCY_ARS = 'ARS';
const PRODUCT_ID = 'molino_premium';

export function getMpClient(): MercadoPagoConfig {
  const accessToken = getRequiredEnv('MP_ACCESS_TOKEN');
  return new MercadoPagoConfig({ accessToken });
}

/**
 * MP siempre devuelve sandbox_init_point en la respuesta de Preference,
 * sin importar si el access_token es de test o de producción — confirmado
 * en vivo: con un APP_USR- (producción) real, el campo igual vino poblado.
 * Elegir la URL en base a "¿vino el campo?" mandaba usuarios reales a
 * sandbox. El modo real solo lo dice el prefijo del propio token.
 */
export function isTestCredentials(): boolean {
  const accessToken = process.env.MP_ACCESS_TOKEN || '';
  return accessToken.startsWith('TEST-');
}

export function getWebhookSecret(): string {
  return getRequiredEnv('MP_WEBHOOK_SECRET');
}

/**
 * Base URL for the webhook `notification_url` MP calls back on and the
 * `back_urls`/`return_url`/`cancel_url` the user is redirected to after
 * paying (PayPal's lib/paypal.ts reuses this same function). Previously read
 * from NEXT_PUBLIC_BASE_URL — an env var that turned out unreliable to keep
 * correctly set in Vercel, and didn't need the NEXT_PUBLIC_ prefix in the
 * first place (both call sites are server-only, never bundled to the
 * client). SITE_URL is the same canonical production URL app/sitemap.ts
 * already uses — one hardcoded source of truth, no env var to drift.
 */
export function getBaseUrl(): string {
  return SITE_URL;
}

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// TODO(security, medium): birthDate reaches here unvalidated from the payment
// routes (mp/coupon, mp/preference, mp/process, mp/recover, paypal/*) — only
// the /api/{synthesis,compatibility,convergence}/calculate routes check
// isValidDate() before use. Not exploitable today (birthDate is just opaque
// HMAC input, never parsed as a Date here), but a malformed value silently
// produces a hash the user can't reproduce on recovery. Add the same
// isValidDate() check to the payment routes before this call.
// `salt` es un UUID aleatorio generado en el cliente (guardado en localStorage
// bajo "molino-profile-salt") que se envía junto a birthDate en el body de cada
// request de pago. Al concatenarlo antes del HMAC, el hash deja de ser una
// función pura de los datos personales: dos personas con la misma fecha de
// nacimiento (e incluso el mismo nombre normalizado) producen hashes distintos.
// Es opcional para no romper tests y call-sites que no tienen acceso al salt.
export function hashProfile(name: string, birthDate: string, salt?: string): string {
  const secret = getWebhookSecret();
  const normalizedName = normalizeName(name);
  const saltedBirthDate = salt ? `${salt}|${birthDate}` : birthDate;
  return createHmac('sha256', secret)
    .update(`${normalizedName}|${saltedBirthDate}`)
    .digest('hex')
    .slice(0, 16);
}

export function requireSecrets(): void {
  getRequiredEnv('MP_ACCESS_TOKEN');
  getRequiredEnv('MP_WEBHOOK_SECRET');
}

export async function createPreference(
  profileHash: string,
  name: string,
  currencyId = 'USD',
  externalReference?: string,
) {
  const preference = new Preference(getMpClient());

  const price = currencyId === PRODUCT_CURRENCY_USD ? PRODUCT_PRICE_USD : PRODUCT_PRICE_ARS;

  const item = {
    id: `${PRODUCT_ID}_${profileHash}`,
    title: 'Molino — Mapa Personal Completo',
    quantity: 1,
    unit_price: price,
    currency_id: currencyId,
    description: 'Acceso completo: numerología profunda, afinidad geográfica, compatibilidad y timing.',
  };

  const baseUrl = getBaseUrl();

  const response = await preference.create({
    body: {
      items: [item],
      external_reference: externalReference || profileHash,
      back_urls: {
        success: `${baseUrl}/profile?payment_status=approved`,
        failure: `${baseUrl}/profile?payment_status=failed`,
        pending: `${baseUrl}/profile?payment_status=pending`,
      },
      // auto_return: 'approved', // Temporarily disabled for localhost testing
      notification_url: `${baseUrl}/api/mp/webhook`,
      metadata: {
        profile_hash: profileHash,
        product: PRODUCT_ID,
        version: 'bricks_v1',
        customer_name: name,
      },
      statement_descriptor: 'MOLINO',
    },
  });

  return {
    preferenceId: response.id,
    // Un único campo `checkoutUrl`, ya resuelto server-side según el modo
    // real del token (ver isTestCredentials) — el cliente no vuelve a tener
    // que elegir entre init_point/sandbox_init_point.
    checkoutUrl: isTestCredentials() ? response.sandbox_init_point : response.init_point,
  };
}

export async function getPaymentStatus(paymentId: string) {
  const payment = new Payment(getMpClient());
  const response = await payment.get({ id: Number(paymentId) });

  return {
    status: (response.status ?? 'unknown') as string,
    status_detail: response.status_detail,
    payment_method_id: response.payment_method_id,
    transaction_amount: response.transaction_amount as number,
    currency_id: (response.currency_id ?? 'USD') as string,
    date_approved: response.date_approved,
    metadata: response.metadata as Record<string, unknown> | undefined,
    external_reference: response.external_reference as string | undefined,
  };
}

export interface PaymentValidation {
  valid: boolean;
  reason?: string;
}

export function validatePayment(payment: {
  status: string;
  transaction_amount: number;
  currency_id: string;
  metadata?: Record<string, unknown> | null;
}): PaymentValidation {
  if (payment.status !== 'approved') {
    return { valid: false, reason: `Payment status is '${payment.status}', expected 'approved'` };
  }

  if (payment.currency_id !== PRODUCT_CURRENCY_USD && payment.currency_id !== PRODUCT_CURRENCY_ARS) {
    return { valid: false, reason: `Unexpected currency: ${payment.currency_id}` };
  }

  const expectedAmount = payment.currency_id === PRODUCT_CURRENCY_USD ? PRODUCT_PRICE_USD : PRODUCT_PRICE_ARS;
  if (payment.transaction_amount !== expectedAmount) {
    return {
      valid: false,
      reason: `Amount mismatch: got ${payment.transaction_amount} ${payment.currency_id}, expected ${expectedAmount}`,
    };
  }

  const product = payment.metadata?.product as string | undefined;
  if (product !== PRODUCT_ID) {
    return { valid: false, reason: `Product mismatch: got '${product ?? 'undefined'}', expected '${PRODUCT_ID}'` };
  }

  return { valid: true };
}

export async function processPayment({
  profileHash,
  paymentData,
}: {
  profileHash: string;
  paymentData: {
    transaction_amount: number;
    payment_method_id: string;
    token: string;
    installments?: number;
    issuer_id?: number;
    payer: { email: string };
  };
}) {
  const payment = new Payment(getMpClient());

  const response = await payment.create({
    body: {
      ...paymentData,
      description: 'Molino — Mapa Personal Completo',
      metadata: {
        profile_hash: profileHash,
        product: PRODUCT_ID,
      },
    },
  });

  return {
    id: String(response.id),
    status: response.status,
    status_detail: response.status_detail,
  };
}

export function verifyWebhookSignature(
  signature: string | null,
  requestId: string | null,
  dataId: string | null,
  body: string,
): boolean {
  if (!signature || !requestId || !dataId) return false;

  let secret: string;
  try {
    secret = getWebhookSecret();
  } catch {
    return false;
  }

  try {
    const parts = signature.split(',');
    const ts = parts.find(p => p.trim().startsWith('ts='))?.split('=')[1]?.trim();
    const hash = parts.find(p => p.trim().startsWith('v1='))?.split('=')[1]?.trim();

    if (!ts || !hash) return false;

    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
    const expected = createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    if (expected.length !== hash.length) return false;

    return timingSafeEqual(Buffer.from(expected), Buffer.from(hash));
  } catch {
    return false;
  }
}
