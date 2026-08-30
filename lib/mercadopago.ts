import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { createHmac, timingSafeEqual, randomBytes } from 'crypto';
import { SITE_URL } from '@/lib/seo';
import { resolvePlanUsdPrice, type BillingCycle } from '@/components/pricing/pricing-data';

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
export const CREDITS_RELOAD_PRODUCT_ID = 'molino_credits_28';
export const CREDITS_RELOAD_PRICE_USD = 1.70;

/** Product id para un plan pagado (ej. "molino_pro_monthly"). */
export function planProductId(planId: string, cycle: BillingCycle): string {
  return `molino_${planId}_${cycle}`;
}

const PLAN_PRODUCT_RE = /^molino_([a-z]+)_(monthly|yearly)$/;

/**
 * Precio esperado (en la moneda dada) para un product id. Los planes pagos
 * se cotizan en USD desde pricing-data; el producto legacy (molino_premium)
 * conserva su precio fijo histórico en USD y ARS. Devuelve 0 si el product
 * no es reconocido.
 */
export function expectedAmountFor(product: string | undefined, currencyId: string): number {
  if (product === PRODUCT_ID) {
    return currencyId === PRODUCT_CURRENCY_ARS ? PRODUCT_PRICE_ARS : PRODUCT_PRICE_USD;
  }
  if (product === CREDITS_RELOAD_PRODUCT_ID) {
    return CREDITS_RELOAD_PRICE_USD;
  }
  const match = product ? PLAN_PRODUCT_RE.exec(product) : null;
  if (match && currencyId === PRODUCT_CURRENCY_USD) {
    return resolvePlanUsdPrice(match[1], match[2] as BillingCycle);
  }
  return 0;
}

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

/**
 * Valida la firma de los webhooks entrantes de Mercado Pago (`x-signature`).
 *
 * Históricamente esta misma variable también servía de pepper para
 * hashProfile() más abajo — un solo secreto cumpliendo dos funciones. Eso
 * era un riesgo operativo (P1): rotar MP_WEBHOOK_SECRET en el dashboard de
 * Mercado Pago invalidaba silenciosamente todos los hashes de perfil ya
 * emitidos, rompiendo la recuperación de compras de usuarios ya pagos.
 * getProfileHashSecret() ahora usa PROFILE_HASH_SECRET como pepper dedicado
 * (con fallback a este secreto si no está seteada), así que MP_WEBHOOK_SECRET
 * puede rotarse libremente sin afectar hashes existentes. Ver CHANGELOG.md.
 */
export function getWebhookSecret(): string {
  return getRequiredEnv('MP_WEBHOOK_SECRET');
}

/**
 * Pepper dedicado para hashProfile(). Separado de MP_WEBHOOK_SECRET para que
 * rotar el secreto del webhook (ej. tras reconfigurar en el dashboard de MP)
 * no invalide silenciosamente los hashes de perfil ya emitidos. Si
 * PROFILE_HASH_SECRET no está seteada, cae a MP_WEBHOOK_SECRET — mismo
 * comportamiento que hoy, sin migración necesaria.
 */
function getProfileHashSecret(): string {
  return process.env.PROFILE_HASH_SECRET || getWebhookSecret();
}

/**
 * Base URL for the webhook `notification_url` MP calls back on and the
 * `back_urls`/`return_url`/`cancel_url` the user is redirected to after
 * paying. Previously read
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
// routes (mp/coupon, mp/preference, mp/process, mp/recover) — only
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
  const secret = getProfileHashSecret();
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
  plan?: { id: string; cycle: BillingCycle } | null,
  returnPath?: string,
) {
  const preference = new Preference(getMpClient());

  const isPlan = !!plan && plan.id !== 'gratis';
  const productId = isPlan ? planProductId(plan!.id, plan!.cycle) : PRODUCT_ID;
  // Los planes se cobran en USD; el producto legacy respeta la moneda pasada.
  const currency = isPlan ? PRODUCT_CURRENCY_USD : currencyId;
  const price = expectedAmountFor(productId, currency);

  const item = {
    id: `${productId}_${profileHash}`,
    title: isPlan ? `Plan ${plan!.id}` : 'Mapa Personal Completo',
    quantity: 1,
    unit_price: price,
    currency_id: currency,
    description: isPlan
      ? `Plan ${plan!.id} (${plan!.cycle}) — acceso completo: numerología profunda, afinidad geográfica, compatibilidad y timing.`
      : 'Acceso completo: numerología profunda, afinidad geográfica, compatibilidad y timing.',
  };

  const baseUrl = getBaseUrl();
  const safeReturn = returnPath && returnPath.startsWith('/') && !returnPath.startsWith('//') ? returnPath : '/profile';

  const response = await preference.create({
    body: {
      items: [item],
      external_reference: externalReference || profileHash,
      back_urls: {
        success: `${baseUrl}${safeReturn}?payment_status=approved`,
        failure: `${baseUrl}${safeReturn}?payment_status=failed`,
        pending: `${baseUrl}${safeReturn}?payment_status=pending`,
      },
      // auto_return: 'approved', // Temporarily disabled for localhost testing
      notification_url: `${baseUrl}/api/mp/webhook`,
      metadata: {
        profile_hash: profileHash,
        product: productId,
        ...(isPlan ? { plan_id: plan!.id, plan_cycle: plan!.cycle } : {}),
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

/** Alfabeto sin ambigüedad visual: sin 0/O, 1/I/L. */
const GIFT_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** MOLINO-XXXX-XXXX — 8 caracteres aleatorios (~40 bits), agrupados para
 * que sea fácil de leer/tipear cuando se comparte por mensaje o email. */
export function generateGiftCode(): string {
  const bytes = randomBytes(8);
  let chars = '';
  for (let i = 0; i < 8; i++) {
    chars += GIFT_CODE_ALPHABET[bytes[i] % GIFT_CODE_ALPHABET.length];
  }
  return `MOLINO-${chars.slice(0, 4)}-${chars.slice(4, 8)}`;
}

/**
 * Preferencia de pago para un regalo: mismo producto/precio ($8, PRODUCT_ID)
 * que createPreference(), pero sin profile_hash — el comprador no conoce la
 * fecha de nacimiento del destinatario, así que no hay profileHash que
 * calcular todavía. metadata.gift_code es lo único que el webhook necesita
 * para dejar el código listo para canjear (ver app/api/mp/webhook/route.ts).
 * No reemplaza ni modifica createPreference() — función hermana separada
 * a propósito, para no tocar el flujo de pago normal.
 */
export async function createGiftPreference(giftCode: string) {
  const preference = new Preference(getMpClient());
  const price = expectedAmountFor(PRODUCT_ID, PRODUCT_CURRENCY_USD);

  const item = {
    id: `gift_${giftCode}`,
    title: 'Regalo: Mapa Personal Completo',
    quantity: 1,
    unit_price: price,
    currency_id: PRODUCT_CURRENCY_USD,
    description: 'Regalo canjeable: mapa personal completo — numerología, astrología y zodíaco chino.',
  };

  const baseUrl = getBaseUrl();

  const response = await preference.create({
    body: {
      items: [item],
      external_reference: giftCode,
      back_urls: {
        success: `${baseUrl}/regalar/comprado?code=${giftCode}`,
        failure: `${baseUrl}/regalar?status=failed`,
        pending: `${baseUrl}/regalar?status=pending`,
      },
      notification_url: `${baseUrl}/api/mp/webhook`,
      metadata: {
        gift_code: giftCode,
        product: PRODUCT_ID,
        version: 'bricks_v1',
      },
      statement_descriptor: 'MOLINO',
    },
  });

  return {
    preferenceId: response.id,
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
    payerEmail: response.payer?.email,
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

  const product = payment.metadata?.product as string | undefined;

  // Los planes se cotizan en USD; el producto legacy en USD o ARS.
  const isPlan = !!product && product !== PRODUCT_ID;
  if (isPlan && payment.currency_id !== PRODUCT_CURRENCY_USD) {
    return { valid: false, reason: `Unexpected currency: ${payment.currency_id}` };
  }
  if (!isPlan && payment.currency_id !== PRODUCT_CURRENCY_USD && payment.currency_id !== PRODUCT_CURRENCY_ARS) {
    return { valid: false, reason: `Unexpected currency: ${payment.currency_id}` };
  }

  const expectedAmount = expectedAmountFor(product, payment.currency_id);
  if (expectedAmount === 0) {
    return { valid: false, reason: `Product mismatch: got '${product ?? 'undefined'}'` };
  }
  if (payment.transaction_amount !== expectedAmount) {
    return {
      valid: false,
      reason: `Amount mismatch: got ${payment.transaction_amount} ${payment.currency_id}, expected ${expectedAmount}`,
    };
  }

  if (product !== PRODUCT_ID && (!product || !PLAN_PRODUCT_RE.test(product))) {
    return { valid: false, reason: `Product mismatch: got '${product ?? 'undefined'}'` };
  }

  return { valid: true };
}

export async function processPayment({
  profileHash,
  paymentData,
}: {
  profileHash: string;
  paymentData: {
    transaction_amount?: number;
    payment_method_id: string;
    token: string;
    installments?: number;
    issuer_id?: number;
    payer: { email: string };
  };
}) {
  const payment = new Payment(getMpClient());

  // Server is the sole authority on the price
  const expectedAmount = expectedAmountFor(PRODUCT_ID, PRODUCT_CURRENCY_ARS);

  const response = await payment.create({
    body: {
      ...paymentData,
      transaction_amount: expectedAmount,
      description: 'Mapa Personal Completo',
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
