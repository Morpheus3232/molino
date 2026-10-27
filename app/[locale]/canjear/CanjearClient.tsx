"use client";
import { useL } from "@/lib/i18n/useL";

import { useState } from "react";
import { useRouter, Link } from "@/lib/i18n/navigation";
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
  const L = useL();
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
        toast.error(L.t(data.reason || data.error || "Ese código no es válido."));
        setRedeeming(false);
        return;
      }
      if (data.premiumToken) savePremiumTokenClient(data.premiumToken);
      saveProfileToStorage(calculateUserProfile(name || "", birthDate));
      toast.success(L("¡Listo! Abriendo tu lectura…", "Done! Opening your reading…"));
      router.push("/lectura");
    } catch {
      toast.error(L.t("No pudimos canjear el código. Intentá de nuevo."));
      setRedeeming(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-md px-4 sm:px-8 text-center">
        <span className="page-eyebrow mb-4">
          <Ticket className="w-3.5 h-3.5 text-accent" />
          <span className="text-sm text-accent font-bold label-caps">{L("Código de acceso", "Access code")}</span>
        </span>

        <h1 className="page-title text-foreground">{L("Canjeá tu código", "Redeem your code")}</h1>
        <p className="text-sm text-muted mt-3 leading-relaxed">{L("Te desbloquea la Lectura Pro completa: numerología, astrología y zodíaco chino cruzados en una sola lectura.", "It unlocks the complete Pro Reading: numerology, astrology and the Chinese zodiac crossed in a single reading.")}</p>

        <form
          onSubmit={handleRedeem}
          className="mt-8 rounded-lg border border-ink/10 bg-card p-6 sm:p-7 text-left space-y-4"
        >
          <div>
            <label
              htmlFor="canjear-codigo"
              className="block text-sm text-muted mb-1.5 font-semibold label-caps"
            >{L("Tu código", "Your code")}</label>
            <input
              id="canjear-codigo"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              placeholder={L("EJEMPLO", "EXAMPLE")}
              className="w-full rounded-md bg-background border border-ink/10 p-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent label-caps"
            />
          </div>
          <div>
            <label
              htmlFor="canjear-fecha"
              className="block text-sm text-muted mb-1.5 font-semibold label-caps"
            >{L("Tu fecha de nacimiento", "Your date of birth")}</label>
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
              className="block text-sm text-muted mb-1.5 font-semibold label-caps"
            >{L("Tu nombre (opcional)", "Your name (optional)")}</label>
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
            {L("Canjear", "Redeem")}
          </Button>
        </form>

        <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          {L("Tu fecha se usa solo para calcular tu mapa.", "Your date is only used to calculate your map.")}
        </p>

        <p className="mt-4 text-xs text-muted">{L(<>
          ¿No tenés código?{" "}
          <Link href="/" className="text-accent hover:underline">
            Tu mapa básico es gratis
          </Link>
          .
        </>, <>Don't have a code?{" "}<Link href="/" className="text-accent hover:underline">Your basic map is free</Link>.</>)}</p>
      </div>
    </main>
  );
}
