"use client";
import { useL } from "@/lib/i18n/useL";

import { useEffect, useState } from "react";
import { countFunnel } from "@/lib/analytics/funnel";
import { toast } from "sonner";
import { Gift, Check } from "lucide-react";
import { PageHero, Columns, CONTAINER } from "@/components/knowledge/Kit";

export default function RegalarClient() {
  const L = useL();
  const [loading, setLoading] = useState(false);
  // Noviembre y diciembre: la nota de fiestas. Se decide en el cliente para no
  // congelar el mes en el HTML cacheado.
  const [holidays, setHolidays] = useState(false);
  useEffect(() => {
    countFunnel("gift_page_viewed", { oncePerSession: true });
    setHolidays(new Date().getMonth() >= 10);
  }, []);

  const handleBuy = async () => {
    if (loading) return;
    setLoading(true);
    countFunnel("gift_checkout_started");
    try {
      const res = await fetch("/api/gift/create", { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || L("No pudimos iniciar la compra.", "We couldn't start the purchase."));
      }
      const data = await res.json();
      window.location.href = data.checkoutUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No pudimos iniciar la compra.");
      setLoading(false);
    }
  };

  const features = [
    L("Síntesis completa que cruza numerología, astrología y zodíaco chino", "A complete synthesis that crosses numerology, astrology and the Chinese zodiac"),
    L("Puntos ciegos, fortalezas y tensiones internas", "Blind spots, strengths and inner tensions"),
    L("Preguntale a Molino: consultas personales con IA", "Ask Molino: personal questions with AI"),
    L("Mapa de evolución y ciclos 2026–2030", "Evolution map and cycles 2026–2030"),
    L("Un enlace para mandar por donde quieras", "A link to send however you like"),
    L("Una tarjeta para imprimir, con su código y un QR", "A printable card with the code and a QR"),
  ];

  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Regalar un mapa", "Gift a map") }]}
        eyebrow={L("Regalo · lectura Pro", "Gift · Pro reading")}
        title={L("Regalale su mapa completo", "Give them their complete map")}
        lead={L("Numerología, astrología y zodíaco chino en una sola lectura personal. No necesitás saber su fecha: la escribe quien lo recibe, cuando canjea el link.", "Numerology, astrology and the Chinese zodiac in a single personal reading. You don't need to know their date: the person who receives it types it in when they redeem the link.")}
        imageKey="paginas/regalar"
      />

      <section className="bg-background">
        <div className={`${CONTAINER} py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12 items-start`}>
          <div className="lg:col-span-7">
            <p className="text-sm text-muted mb-3 label-caps">{L("Qué recibe", "What they get")}</p>
            <h2 className="section-title text-foreground">{L("La lectura Pro, para siempre", "The Pro reading, forever")}</h2>
            <ul className="mt-8 border-t-2 border-ink divide-y divide-ink/15">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-4 py-4 text-lg sm:text-xl text-foreground/90 leading-snug">
                  <Check className="w-5 h-5 mt-1 shrink-0 text-foreground" aria-hidden="true" />
                  {L.t(f)}
                </li>
              ))}
            </ul>
            <div className="mt-12">
              <Columns
                cols={[
                  { title: L("Privado", "Private"), body: L("Vos comprás; quien lo recibe escribe sus datos al canjear. Nadie más los ve.", "You buy; the person who receives it enters their details when redeeming. Nobody else sees them.") },
                  { title: L("Se manda en un clic", "Sent in one click"), body: L("Te damos un mensaje con el link listo para enviar por donde quieras.", "We give you a message with the link ready to send however you like.") },
                ]}
              />
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 border-2 border-ink p-7 sm:p-9">
            <p className="text-sm text-muted label-caps">{L("Lectura Pro de regalo · pago único", "Pro reading as a gift · one-time payment")}</p>
            <p className="mt-4 font-display text-7xl leading-none text-foreground">
              $8 <span className="text-2xl text-muted">USD</span>
            </p>
            <p className="mt-3 text-base text-muted">{L("Acceso permanente para quien lo reciba. Sin suscripción.", "Permanent access for the person who receives it. No subscription.")}</p>
            <button
              type="button"
              onClick={handleBuy}
              disabled={loading}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps min-h-[52px] disabled:opacity-60"
            >
              <Gift className="w-4 h-4" aria-hidden="true" />
              {L.t(loading ? L("Abriendo Mercado Pago…", "Opening Mercado Pago…") : L("Comprar con Mercado Pago", "Buy with Mercado Pago"))}
            </button>
            <p className="mt-4 text-sm text-muted">{L("Al terminar el pago recibís el código y el link para enviar.", "Once the payment is done you get the code and the link to send.")}</p>
            {holidays && (
              <p className="mt-6 border-t border-ink/15 pt-5 text-base text-foreground/85">
                {L(
                  "¿Es para las fiestas? El link llega al instante y la tarjeta se imprime en casa: sirve aunque lo decidas el 24 a la noche.",
                  "Is it for the holidays? The link arrives instantly and the card prints at home: it works even if you decide on Christmas Eve.",
                )}
              </p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
