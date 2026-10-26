"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Gift, Check } from "lucide-react";
import { PageHero, Columns, CONTAINER } from "@/components/knowledge/Kit";

export default function RegalarClient() {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/gift/create", { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "No pudimos iniciar la compra.");
      }
      const data = await res.json();
      window.location.href = data.checkoutUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No pudimos iniciar la compra.");
      setLoading(false);
    }
  };

  const features = [
    "Síntesis completa que cruza numerología, astrología y zodíaco chino",
    "Puntos ciegos, fortalezas y tensiones internas",
    "Preguntale a Molino: consultas personales con IA",
    "Mapa de evolución y ciclos 2026–2030",
    "Un enlace para mandar por donde quieras",
  ];

  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Regalar un mapa" }]}
        eyebrow="Regalo · lectura Pro"
        title="Regalale su mapa completo"
        lead="Numerología, astrología y zodíaco chino en una sola lectura personal. No necesitás saber su fecha: la escribe quien lo recibe, cuando canjea el link."
        imageKey="paginas/regalar"
      />

      <section className="bg-background">
        <div className={`${CONTAINER} py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12 items-start`}>
          <div className="lg:col-span-7">
            <p className="text-sm text-muted mb-3 label-caps">Qué recibe</p>
            <h2 className="section-title text-foreground">La lectura Pro, para siempre</h2>
            <ul className="mt-8 border-t-2 border-ink divide-y divide-ink/15">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-4 py-4 text-lg sm:text-xl text-foreground/90 leading-snug">
                  <Check className="w-5 h-5 mt-1 shrink-0 text-foreground" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-12">
              <Columns
                cols={[
                  { title: "Privado", body: "Vos comprás; quien lo recibe escribe sus datos al canjear. Nadie más los ve." },
                  { title: "Se manda en un clic", body: "Te damos un mensaje con el link listo para enviar por donde quieras." },
                ]}
              />
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 border-2 border-ink p-7 sm:p-9">
            <p className="text-sm text-muted label-caps">Lectura Pro de regalo · pago único</p>
            <p className="mt-4 font-display text-7xl leading-none text-foreground">
              $8 <span className="text-2xl text-muted">USD</span>
            </p>
            <p className="mt-3 text-base text-muted">Acceso permanente para quien lo reciba. Sin suscripción.</p>
            <button
              type="button"
              onClick={handleBuy}
              disabled={loading}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps min-h-[52px] disabled:opacity-60"
            >
              <Gift className="w-4 h-4" aria-hidden="true" />
              {loading ? "Abriendo Mercado Pago…" : "Comprar con Mercado Pago"}
            </button>
            <p className="mt-4 text-sm text-muted">Al terminar el pago recibís el código y el link para enviar.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
