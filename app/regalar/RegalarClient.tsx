"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Gift, ShieldCheck, Sparkles, Check, MessageCircle, Heart } from "lucide-react";
import Button from "@/components/ui/Button";

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

  return (
    <main className="min-h-screen bg-background pt-20 sm:pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-8 text-center">
        <span className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full bg-accent/15 border border-accent/30 shadow-sm">
          <Gift className="w-4 h-4 text-accent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent font-bold">
            Regalo Especial · Molino Pro
          </span>
        </span>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-tight leading-[1.05]">
          Regalale su mapa <br className="hidden sm:inline" />
          <span className="text-gradient-warm">personal y completo</span>
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-lg mx-auto mt-4 leading-relaxed">
          Un regalo único, profundo y reflexivo. Cruzamos numerología, astrología y zodíaco chino en una sola lectura personalizada.
          <strong className="block mt-2 text-foreground font-semibold">
            No necesitás saber su fecha de nacimiento: la ingresa quien lo recibe, cuando canjea el link.
          </strong>
        </p>

        <div className="mt-10 rounded-3xl border border-accent/30 bg-card p-7 sm:p-9 text-left max-w-lg mx-auto shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Lectura Pro de Regalo
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
              Pago Único
            </span>
          </div>

          <div className="font-display text-4xl font-bold text-foreground mb-1">
            $8 <span className="text-xl font-medium text-muted">USD</span>
          </div>
          <p className="text-xs text-muted mb-6">
            Acceso permanente de por vida para quien lo reciba. Sin suscripciones recurrentes.
          </p>

          <div className="space-y-2.5 mb-8 border-t border-ink/10 pt-5">
            {[
              "Síntesis completa cruzando los 3 sistemas (numerología, astrología y zodíaco chino)",
              "Detección de puntos ciegos, fortalezas y tensiones internas",
              "Preguntale a Molino (IA interactiva para consultas personales)",
              "Mapa de evolución y ciclos 2026–2030",
              "Enlace instantáneo para compartir por el medio que prefieras",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2.5 text-xs text-foreground/90 leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <Button
            variant="accent"
            size="lg"
            fullWidth
            loading={loading}
            onClick={handleBuy}
            className="flex items-center justify-center gap-2 py-4 text-base font-bold shadow-lg"
          >
            <Gift className="w-4 h-4" />
            Comprar regalo con Mercado Pago ($8 USD)
          </Button>

          <p className="mt-4 text-center text-[11px] font-mono text-muted">
            Al terminar el pago, recibís tu código y un enlace listo para enviar en 1 clic.
          </p>
        </div>

        <div className="mt-10 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-card border border-ink/10 space-y-1.5">
            <span className="text-accent font-mono text-xs font-bold block flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Privado
            </span>
            <p className="text-xs text-muted leading-relaxed">
              Vos comprás el regalo y el agasajado ingresa sus datos al canjear. Cero fricción.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-ink/10 space-y-1.5">
            <span className="text-accent font-mono text-xs font-bold block flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Envío en un clic
            </span>
            <p className="text-xs text-muted leading-relaxed">
              Te damos un mensaje personalizado con el link para que se lo mandes por donde quieras.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
