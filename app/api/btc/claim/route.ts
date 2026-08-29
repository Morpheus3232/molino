import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { grantPremiumAccess, savePremiumToken, saveProfileSalt, claimBtcTxid } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, COUPON_RATE_LIMIT } from '@/lib/rate-limit';
import { isValidDate } from '@/lib/validation';
import {
  getBtcAddress,
  isBtcEnabled,
  isValidTxid,
  fetchBtcUsdRate,
  fetchTransaction,
  verifyPayment,
} from '@/lib/bitcoin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Canje de un pago en BTC.
 *
 * La persona paga desde su wallet y pega el txid. Acá NO se le cree nada: se
 * lee la transacción de la blockchain y se verifica que pague a nuestra
 * dirección por el monto correcto. El txid es además el identificador único
 * del pago, así que sirve de candado de idempotencia igual que el paymentId
 * de MercadoPago — el mismo comprobante no se puede canjear dos veces, ni por
 * el mismo perfil ni por otro.
 *
 * Mismo desenlace que el webhook de MP y que el canje de cupón:
 * grantPremiumAccess + savePremiumToken.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'btc/claim'), COUPON_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  if (!isBtcEnabled()) {
    return NextResponse.json({ valid: false, reason: 'El pago en BTC no está disponible.' }, { status: 503 });
  }

  try {
    const { txid, name, birthDate, salt } = await req.json();

    if (!isValidTxid(txid)) {
      return NextResponse.json(
        { valid: false, reason: 'El ID de transacción no tiene el formato correcto (64 caracteres hexadecimales).' },
        { status: 400 },
      );
    }

    if (!birthDate || !isValidDate(birthDate)) {
      return NextResponse.json(
        { valid: false, reason: 'Falta tu fecha de nacimiento o no es válida.' },
        { status: 400 },
      );
    }

    const address = getBtcAddress();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    let rate: number;
    let tx: Awaited<ReturnType<typeof fetchTransaction>>;
    try {
      [rate, tx] = await Promise.all([
        fetchBtcUsdRate(controller.signal),
        fetchTransaction(txid, controller.signal),
      ]);
    } finally {
      clearTimeout(timeout);
    }

    const check = verifyPayment(tx, address, rate);
    if (!check.ok) {
      return NextResponse.json({ valid: false, reason: check.reason }, { status: 400 });
    }

    const profileHash = hashProfile(name ?? '', birthDate, salt);
    const paymentId = `btc_${txid}`;

    // Un comprobante, un mapa. El txid queda reclamado para este perfil de
    // forma permanente (ver claimBtcTxid: sin TTL, a diferencia del candado
    // de MercadoPago). Se reclama ANTES de otorgar el acceso.
    const claim = await claimBtcTxid(txid, profileHash);

    if (claim === 'taken') {
      return NextResponse.json(
        { valid: false, reason: 'Esa transacción ya fue usada para activar otro mapa.' },
        { status: 409 },
      );
    }

    // KV caído: NO se rechaza a alguien que pagó de verdad —el pago ya quedó
    // verificado contra la cadena— pero tampoco se puede otorgar acceso sin
    // poder registrarlo. Se pide reintentar, que es honesto y reversible.
    if (claim === 'unavailable') {
      return NextResponse.json(
        {
          valid: false,
          reason: 'Verificamos tu pago, pero no pudimos registrarlo en este momento. Volvé a pegar el mismo ID en unos minutos: no vas a pagar de nuevo.',
        },
        { status: 503 },
      );
    }

    // 'claimed' o 'already-yours' (el mismo perfil reintentando) siguen.
    await grantPremiumAccess(profileHash, paymentId);
    if (salt) await saveProfileSalt(profileHash, salt);

    const premiumToken = await savePremiumToken(profileHash);
    if (!premiumToken) {
      return NextResponse.json({
        valid: false,
        reason: 'Tu pago se verificó, pero no pudimos activar el acceso en este momento. Escribinos con tu ID de transacción a versionlimitada@proton.me y lo resolvemos.',
      }, { status: 503 });
    }

    return NextResponse.json({
      valid: true,
      premiumToken,
      confirmed: check.confirmed,
      paidSats: check.paidSats,
    });
  } catch (error) {
    console.error('[BTC claim]', error);
    return NextResponse.json(
      { valid: false, reason: 'No pudimos verificar el pago en este momento. Probá de nuevo en un minuto.' },
      { status: 503 },
    );
  }
}
