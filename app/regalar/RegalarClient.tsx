"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Gift, ShieldCheck, Sparkles } from "lucide-react";
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
    <main className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-8 text-center">
        <span className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/25">
          <Gift className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">Regalar Molino</span>
        </span>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase tracking-tight leading-[1.05]">
          Regalale su mapa
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-lg mx-auto mt-4 leading-relaxed">
          Un mapa personal completo — numerología, astrología y zodíaco chino, en una sola lectura.
          No necesitás su fecha de nacimiento para comprarlo: la ingresa quien lo recibe, al canjear.
        </p>

        <div className="mt-10 rounded-3xl border border-accent/25 bg-card p-7 sm:p-8 text-left max-w-md mx-auto">
          <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            Mapa Personal
          </div>
          <div className="font-display text-3xl font-bold text-foreground mb-3">
            $8 USD <span className="text-base font-medium text-muted">· pago único</span>
          </div>
          <p className="text-sm text-muted leading-relaxed mb-6">
            Síntesis completa de numerología, astrología y zodíaco chino, con acceso permanente
            para quien lo reciba.
          </p>
          <Button variant="accent" size="lg" fullWidth loading={loading} onClick={handleBuy}>
            <Gift className="w-4 h-4" />
            Comprar regalo
          </Button>
        </div>

        <p className="mt-8 inline-flex items-center gap-1.5 text-xs text-muted font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          El destinatario ingresa su fecha de nacimiento al canjear. Vos no necesitás conocerla.
        </p>
      </div>
    </main>
  );
}
