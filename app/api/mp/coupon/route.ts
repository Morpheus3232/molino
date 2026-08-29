import { NextRequest, NextResponse } from 'next/server';
import { hashProfile } from '@/lib/mercadopago';
import { grantPremiumAccess, savePremiumToken, saveProfileSalt, countCouponRedemption, getCouponCounts, resetCouponCounts } from '@/lib/kv';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, COUPON_RATE_LIMIT } from '@/lib/rate-limit';
import { isValidDate } from '@/lib/validation';

/**
 * PREMIUM_COUPON acepta una lista separada por comas: un código por
 * influencer ("VALEN,CAFECONSOMBRA"). Cada canje se cuenta por código en KV,
 * así se sabe cuánta gente trajo cada uno. Un solo valor sigue funcionando
 * igual que antes.
 *
 * La comparación es case-insensitive a propósito: la audiencia lo tipea en
 * el teléfono y el autocorrector capitaliza.
 */
const COUPON_CODES = (process.env.PREMIUM_COUPON ?? '')
  .split(',')
  .map((c) => c.trim().toUpperCase())
  .filter(Boolean);

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'mp/coupon'), COUPON_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const { coupon, name, birthDate, salt } = await req.json();

    if (!coupon || !birthDate) {
      return NextResponse.json(
        { valid: false, reason: 'Faltan datos requeridos' },
        { status: 400 },
      );
    }

    if (!isValidDate(birthDate)) {
      return NextResponse.json(
        { valid: false, reason: 'birthDate must be a valid date in YYYY-MM-DD format (year >= 1900, not future)' },
        { status: 400 },
      );
    }

    // Sin PREMIUM_COUPON configurado, el canje queda deshabilitado — nunca
    // hay un código por defecto que otorgue acceso gratis.
    const code = String(coupon).trim().toUpperCase();
    if (!COUPON_CODES.includes(code)) {
      return NextResponse.json(
        { valid: false, reason: 'Código de cupón inválido' },
        { status: 400 },
      );
    }

    const profileHash = hashProfile(name ?? '', birthDate, salt);
    const paymentId = `coupon_${profileHash}_${Date.now()}`;

    await grantPremiumAccess(profileHash, paymentId);
    if (salt) await saveProfileSalt(profileHash, salt);
    const premiumToken = await savePremiumToken(profileHash);
    if (!premiumToken) {
      return NextResponse.json({
        error: 'No pudimos confirmar tu acceso en este momento — probá de nuevo en unos minutos. Si el problema persiste, escribinos con tu payment ID a versionlimitada@proton.me.',
      }, { status: 503 });
    }

    // Después del grant: si esto falla, la persona igual entra. El conteo es
    // métrica, no una condición de acceso.
    await countCouponRedemption(code, profileHash);

    return NextResponse.json({ valid: true, premiumToken });
  } catch (error) {
    console.error('[Coupon] Error:', error);
    return NextResponse.json(
      { valid: false, reason: 'Error al procesar el cupón' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/mp/coupon?secret=... → cuántas personas canjeó cada código.
 * Sin COUPON_STATS_SECRET configurado el endpoint no existe (404), para que
 * un deploy sin la variable no exponga las métricas a cualquiera.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.COUPON_STATS_SECRET;
  if (!secret || req.nextUrl.searchParams.get('secret') !== secret) {
    return new NextResponse('Not found', { status: 404 });
  }

  const codes = await getCouponCounts(COUPON_CODES);

  // Abierto desde el navegador (el caso normal: el celular) devuelve una
  // pantalla; desde curl o un script, JSON. Misma URL para las dos cosas.
  const wantsJson =
    req.nextUrl.searchParams.get('format') === 'json' ||
    !req.headers.get('accept')?.includes('text/html');
  if (wantsJson) return NextResponse.json({ codes });

  return new NextResponse(renderStatsPage(codes), {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

/**
 * DELETE /api/mp/coupon?secret=... → contadores a cero.
 * Borra sólo la métrica: quien ya canjeó conserva su acceso.
 */
export async function DELETE(req: NextRequest) {
  const secret = process.env.COUPON_STATS_SECRET;
  if (!secret || req.nextUrl.searchParams.get('secret') !== secret) {
    return new NextResponse('Not found', { status: 404 });
  }
  await resetCouponCounts(COUPON_CODES);
  return NextResponse.json({ reset: true, codes: await getCouponCounts(COUPON_CODES) });
}

/** Escapa el código antes de meterlo en el HTML: sale de una env var, pero
 * es texto arbitrario y esto se renderiza sin framework. */
function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
}

function renderStatsPage(codes: Record<string, number>): string {
  const rows = Object.entries(codes).sort((a, b) => b[1] - a[1]);
  const total = rows.reduce((sum, [, n]) => sum + n, 0);
  const top = rows[0]?.[1] || 1;

  const items = rows.length
    ? rows
        .map(
          ([code, n]) => `<li>
        <div class="row"><span class="code">${esc(code)}</span><span class="n">${n}</span></div>
        <div class="bar"><i style="width:${Math.round((n / top) * 100)}%"></i></div>
      </li>`,
        )
        .join('')
    : '<li class="empty">Todavía no hay canjes.</li>';

  return `<!doctype html><html lang="es-AR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Cupones · molino</title>
<style>
  :root{--bg:#faf8f5;--fg:#17150f;--muted:#7c766a;--line:#e2ddd3;--card:#fff;--accent:#b4531f}
  @media(prefers-color-scheme:dark){:root{--bg:#0f0e0c;--fg:#f2efe9;--muted:#8f887b;--line:#2a2724;--card:#17150f;--accent:#e0813f}}
  *{box-sizing:border-box}
  body{margin:0;padding:32px 20px 64px;background:var(--bg);color:var(--fg);
    font:16px/1.5 ui-sans-serif,system-ui,-apple-system,"Inter",sans-serif}
  main{max-width:560px;margin:0 auto}
  h1{margin:0;font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);font-weight:700}
  .total{margin:6px 0 4px;font-size:64px;line-height:1;font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
  .sub{margin:0 0 32px;color:var(--muted);font-size:14px}
  ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}
  li{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px 18px}
  .row{display:flex;justify-content:space-between;align-items:baseline;gap:16px}
  .code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;font-weight:700;
    letter-spacing:.06em;word-break:break-all}
  .n{font-size:30px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
  .bar{margin-top:12px;height:5px;background:var(--line);border-radius:99px;overflow:hidden}
  .bar i{display:block;height:100%;background:var(--accent);border-radius:99px}
  .empty{color:var(--muted);text-align:center;padding:32px}
  footer{margin-top:32px;color:var(--muted);font-size:12px;line-height:1.7}
</style></head><body><main>
  <h1>Canjes por cupón</h1>
  <p class="total">${total}</p>
  <p class="sub">${total === 1 ? 'persona entró' : 'personas entraron'} con un código. Actualizá para ver el número de ahora.</p>
  <ul>${items}</ul>
  <footer>Cuenta personas, no clicks: la misma persona canjeando dos veces suma una.<br>
  Página privada — no la compartas, el link lleva el secreto adentro.</footer>
</main></body></html>`;
}
