"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Ticket, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { getOrCreateProfileSalt, savePremiumTokenClient } from "@/lib/premium";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { saveProfileToStorage } from "@/lib/session/localStorage";

/**
 * Canje de un código de cupón para quien llega SIN perfil — el caso de la
 * audiencia de un influencer, que entra por primera vez con el código en la
 * mano. El input de cupón que vive dentro de PremiumGate/PremiumCheckout
 * asume un perfil ya cargado y manda birthDate vacío si no lo hay, así que
 * no sirve como destino para esa gente: acá la fecha se pide en el mismo
 * formulario. Mismo endpoint, misma dedup, mismo conteo por código.
 *
 * Con ?codigo=XXX el campo viene lleno y la persona sólo pone su fecha —
 * es el link que le pasamos al influencer para compartir.
 */
export default function CanjearClient({ initialCode }: { initialCode: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (redeeming || !code.trim() || !birthDate) return;
    setRedeeming(true);
    try {
      const res = await fetch("/api/mp/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupon: code.trim(),
          name,
          birthDate,
          salt: getOrCreateProfileSalt(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        toast.error(data.reason || data.error || "Ese código no es válido.");
        setRedeeming(false);
        return;
      }
      if (data.premiumToken) savePremiumTokenClient(data.premiumToken);
      saveProfileToStorage(calculateUserProfile(name || "", birthDate));
      toast.success("¡Listo! Abriendo tu lectura…");
      router.push("/lectura");
    } catch {
      toast.error("No pudimos canjear el código. Intentá de nuevo.");
      setRedeeming(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-md px-4 sm:px-8 text-center">
        <span className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-md bg-accent/10 border border-accent/25">
          <Ticket className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
            Código de acceso
          </span>
        </span>

        <h1 className="font-display text-2xl sm:text-3xl text-foreground uppercase tracking-tight">
          Canjeá tu código
        </h1>
        <p className="text-sm text-muted mt-3 leading-relaxed">
          Te desbloquea la Lectura Pro completa: numerología, astrología y zodíaco
          chino cruzados en una sola lectura.
        </p>

        <form
          onSubmit={handleRedeem}
          className="mt-8 rounded-lg border border-ink/10 bg-card p-6 sm:p-7 text-left space-y-4"
        >
          <div>
            <label
              htmlFor="canjear-codigo"
              className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5 font-semibold"
            >
              Tu código
            </label>
            <input
              id="canjear-codigo"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              placeholder="EJEMPLO"
              className="w-full rounded-md bg-background border border-ink/10 p-3 font-mono text-sm uppercase tracking-[0.12em] text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label
              htmlFor="canjear-fecha"
              className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5 font-semibold"
            >
              Tu fecha de nacimiento
            </label>
            <input
              id="canjear-fecha"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full rounded-md bg-background border border-ink/10 p-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label
              htmlFor="canjear-nombre"
              className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5 font-semibold"
            >
              Tu nombre (opcional)
            </label>
            <input
              id="canjear-nombre"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md bg-background border border-ink/10 p-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <Button type="submit" variant="accent" size="lg" fullWidth loading={redeeming}>
            <Ticket className="w-4 h-4" />
            Canjear
          </Button>
        </form>

        <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          Tu fecha se usa solo para calcular tu mapa.
        </p>

        <p className="mt-4 text-xs text-muted">
          ¿No tenés código?{" "}
          <Link href="/" className="text-accent hover:underline">
            Tu mapa básico es gratis
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
