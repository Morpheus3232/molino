import { NextRequest, NextResponse } from "next/server";
import { incrementFunnel, isFunnelEvent } from "@/lib/funnel";
import { checkRateLimit, rateLimitKey, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cuenta un paso del embudo. Solo eventos de la lista blanca; no se guarda
 * nada de quien llama (la IP se usa en memoria para el límite y se descarta).
 * Las compras NO se cuentan acá: las cuenta el servidor al validar el pago.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, "metrics/event"), { maxRequests: 30, windowMs: 60_000 });
  if (!rl.allowed) return new NextResponse(null, { status: 204 });
  let event: unknown;
  try {
    event = (await req.json())?.event;
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!isFunnelEvent(event) || event === "premium_unlocked" || event === "gift_purchased") {
    return new NextResponse(null, { status: 400 });
  }
  await incrementFunnel(event);
  return new NextResponse(null, { status: 204 });
}
