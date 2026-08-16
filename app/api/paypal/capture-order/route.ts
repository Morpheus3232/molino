import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { captureOrder, validateOrder } from '@/lib/paypal';
import { grantPremiumAccess, hasPremiumAccess, isPaymentProcessed, markPaymentProcessed, savePremiumToken, saveProfileSalt } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, PAYMENT_RATE_LIMIT } from '@/lib/rate-limit';
import { isValidDate } from '@/lib/validation';
import { paymentIdentitySchema, paypalOrderIdSchema } from '@/lib/validation/payments';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'paypal/capture-order'), PAYMENT_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await req.json();

    const identity = paymentIdentitySchema.safeParse(body);
    if (!identity.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const orderId = typeof body?.orderId === 'string' ? body.orderId.trim() : '';
    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId and birthDate are required' },
        { status: 400 },
      );
    }

    if (!paypalOrderIdSchema.safeParse(orderId).success) {
      return NextResponse.json({ error: 'Invalid orderId format' }, { status: 400 });
    }

    const { name, birthDate, salt } = identity.data;

    if (!isValidDate(birthDate)) {
      return NextResponse.json(
        { error: 'birthDate must be a valid date in YYYY-MM-DD format (year >= 1900, not future)' },
        { status: 400 },
      );
    }

    const cleanOrderId = String(orderId).trim();
    const profileHash = hashProfile(name ?? '', birthDate, salt);

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
      const premiumToken = await savePremiumToken(profileHash);
      if (!premiumToken) {
        return NextResponse.json({
          error: 'No pudimos confirmar tu acceso en este momento — probá de nuevo en unos minutos. Si el problema persiste, escribinos con tu payment ID a versionlimitada@proton.me.',
        }, { status: 503 });
      }
      return NextResponse.json({
        verified: true,
        status: order.status,
        orderId: cleanOrderId,
        idempotent: true,
        premiumToken,
      });
    }

    await grantPremiumAccess(profileHash, cleanOrderId);
    if (salt) await saveProfileSalt(profileHash, salt);
    await markPaymentProcessed(cleanOrderId);
    const premiumToken = await savePremiumToken(profileHash);
    if (!premiumToken) {
      return NextResponse.json({
        error: 'No pudimos confirmar tu acceso en este momento — probá de nuevo en unos minutos. Si el problema persiste, escribinos con tu payment ID a versionlimitada@proton.me.',
      }, { status: 503 });
    }

    return NextResponse.json({
      verified: true,
      status: order.status,
      orderId: cleanOrderId,
      idempotent: false,
      premiumToken,
    });
  } catch (error) {
    console.error('[PayPal Capture Order] Error:', error);
    return NextResponse.json(
      { verified: false, error: 'Capture failed' },
      { status: 500 },
    );
  }
}
