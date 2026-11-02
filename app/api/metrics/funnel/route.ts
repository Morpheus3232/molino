import { NextRequest, NextResponse } from "next/server";
import { readFunnel, FUNNEL_EVENTS } from "@/lib/funnel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lectura del embudo, solo para el dueño: /api/metrics/funnel?token=<METRICS_TOKEN>.
 * Sin la variable de entorno configurada, la ruta no existe (404).
 * Agrega las tasas de conversión de cada mes para leerlas de un vistazo.
 */
export async function GET(req: NextRequest) {
  const expected = process.env.METRICS_TOKEN;
  const token = req.nextUrl.searchParams.get("token");
  if (!expected || token !== expected) return new NextResponse(null, { status: 404 });
  const months = await readFunnel(6);
  const rate = (a: number, b: number) => (b > 0 ? `${((a / b) * 100).toFixed(1)}%` : "—");
  return NextResponse.json({
    events: FUNNEL_EVENTS,
    months: months.map(({ month, counts }) => ({
      month,
      counts,
      conversion: {
        checkout_de_paywall: rate(counts.checkout_started_mp + counts.checkout_started_btc, counts.paywall_viewed),
        compra_de_checkout: rate(counts.premium_unlocked, counts.checkout_started_mp + counts.checkout_started_btc),
        regalo_de_visita: rate(counts.gift_purchased, counts.gift_page_viewed),
        clic_afiliado_de_viaje: rate(counts.travel_click_hotel + counts.travel_click_flights, counts.travel_plan_built),
      },
    })),
  });
}
