"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Gift, Loader2, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getOrCreateProfileSalt, savePremiumTokenClient } from "@/lib/premium";

type CheckState = "checking" | "valid" | "not_found" | "already_redeemed";

const RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

export default function CanjeClient({ codigo }: { codigo: string }) {
  const router = useRouter();
  const [checkState, setCheckState] = useState<CheckState>("checking");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  // El webhook que deja el código listo para canjear es asíncrono — puede
  // no haber llegado todavía en el instante en que el destinatario abre el
  // link (mismo tipo de eventual consistency ya aceptado en otras partes
  // del sistema). Reintenta unos segundos antes de mostrar error definitivo.
  const checkCode = useCallback(async () => {
    for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
      try {
        const res = await fetch(`/api/gift/${codigo}`);
        const data = await res.json();
        if (data.valid) {
          setCheckState("valid");
          return;
        }
        if (data.reason === "already_redeemed") {
          setCheckState("already_redeemed");
          return;
        }
      } catch {
        // sigue reintentando
      }
      if (attempt < RETRY_ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
    setCheckState("not_found");
  }, [codigo]);

  useEffect(() => {
    checkCode();
  }, [checkCode]);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (redeeming || !birthDate) return;
    setRedeeming(true);
    try {
      const res = await fetch(`/api/gift/${codigo}/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birthDate, salt: getOrCreateProfileSalt() }),
      });
      const data = await res.json();
      if (!res.ok || !data.redeemed) {
        toast.error(data.error || "No pudimos canjear tu regalo.");
        setRedeeming(false);
        return;
      }
      savePremiumTokenClient(data.premiumToken);
      toast.success("¡Regalo canjeado! Redirigiendo a tu mapa...");
      router.push("/profile");
    } catch {
      toast.error("No pudimos canjear tu regalo. Intentá de nuevo.");
      setRedeeming(false);
    }
  };

  if (checkState === "checking") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
        <p className="text-xs font-mono text-muted">Verificando tu regalo…</p>
      </main>
    );
  }

  if (checkState === "not_found" || checkState === "already_redeemed") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-sm text-foreground">
          {checkState === "already_redeemed" ? "Este código ya fue usado." : "Este código no existe o ya expiró."}
        </p>
        <Link href="/premium" className="text-xs font-mono text-accent hover:underline">
          Ver planes en /premium →
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-md px-4 sm:px-8 text-center">
        <span className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/25">
          <Gift className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">Regalo de Molino</span>
        </span>

        <h1 className="font-display text-2xl sm:text-3xl text-foreground uppercase tracking-tight">
          ¡Te regalaron un mapa!
        </h1>
        <p className="text-sm text-muted mt-3 leading-relaxed">
          Un mapa personal completo — numerología, astrología y zodíaco chino, en una sola lectura.
        </p>

        <form onSubmit={handleRedeem} className="mt-8 rounded-2xl border border-ink/10 bg-card p-6 sm:p-7 text-left space-y-4">
          <div>
            <label htmlFor="gift-birthdate" className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5 font-semibold">
              Tu fecha de nacimiento
            </label>
            <input
              id="gift-birthdate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full rounded-xl bg-background border border-ink/10 p-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="gift-name" className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5 font-semibold">
              Tu nombre (opcional)
            </label>
            <input
              id="gift-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-background border border-ink/10 p-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <Button type="submit" variant="accent" size="lg" fullWidth loading={redeeming}>
            <Gift className="w-4 h-4" />
            Canjear mi regalo
          </Button>
        </form>

        <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          Tu fecha se usa solo para calcular tu mapa — nunca se guarda ni se comparte.
        </p>
      </div>
    </main>
  );
}
