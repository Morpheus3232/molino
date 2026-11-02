/**
 * Embudo de ventas — contadores ANÓNIMOS y agregados por mes.
 *
 * Para saber qué palanca mueve las ventas hace falta contar cuántas veces se
 * ve el paywall, cuántas se empieza a pagar y cuántas se paga. Se guarda solo
 * un número por evento y por mes (funnel:<evento>:<YYYY-MM>): ni IP, ni
 * perfil, ni hash, ni cookie. No identifica a nadie, así que no rompe la
 * promesa de privacidad del sitio ni suma un proveedor de tracking.
 *
 * Server-only. El cliente cuenta con `countFunnel()` (lib/analytics/funnel.ts),
 * que llama a /api/metrics/event; se lee con /api/metrics/funnel?token=….
 */

import { getKvClient } from "@/lib/kv";

export const FUNNEL_EVENTS = [
  "paywall_viewed",
  "checkout_started_mp",
  "checkout_started_btc",
  "premium_unlocked",
  "gift_page_viewed",
  "gift_checkout_started",
  "gift_purchased",
  "travel_plan_built",
  "travel_click_hotel",
  "travel_click_flights",
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

export function isFunnelEvent(x: unknown): x is FunnelEvent {
  return typeof x === "string" && (FUNNEL_EVENTS as readonly string[]).includes(x);
}

const key = (event: FunnelEvent, month: string) => `funnel:${event}:${month}`;

/** Suma 1. Nunca tira: una métrica caída no puede romper un pago ni una página. */
export async function incrementFunnel(event: FunnelEvent, now = new Date()): Promise<void> {
  try {
    const kv = await getKvClient();
    if (!kv) return;
    const k = key(event, now.toISOString().slice(0, 7));
    const current = (await kv.get<number>(k)) || 0;
    await kv.set(k, current + 1, { ex: 400 * 86400 });
  } catch (error) {
    console.error("[Funnel] increment", error);
  }
}

/** Conteos de los últimos `months` meses (UTC), del más reciente al más viejo. */
export async function readFunnel(months = 6, now = new Date()): Promise<{ month: string; counts: Record<FunnelEvent, number> }[]> {
  const kv = await getKvClient();
  const out: { month: string; counts: Record<FunnelEvent, number> }[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const month = d.toISOString().slice(0, 7);
    const counts = {} as Record<FunnelEvent, number>;
    for (const e of FUNNEL_EVENTS) counts[e] = kv ? (await kv.get<number>(key(e, month))) || 0 : 0;
    out.push({ month, counts });
  }
  return out;
}
