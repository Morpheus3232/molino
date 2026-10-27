"use client";
import { useL } from "@/lib/i18n/useL";

import { useState, useEffect, useCallback } from "react";
import { useRouter, Link } from "@/lib/i18n/navigation";
import { toast } from "sonner";
import { Gift, Loader2, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { getOrCreateProfileSalt, savePremiumTokenClient } from "@/lib/premium";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { saveProfileToStorage } from "@/lib/session/localStorage";

type CheckState = "checking" | "valid" | "not_found" | "already_redeemed";

const RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

export default function CanjeClient({ codigo }: { codigo: string }) {
  const L = useL();
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
      const profile = calculateUserProfile(name || "", birthDate);
      saveProfileToStorage(profile);
      toast.success(L("¡Regalo canjeado! Redirigiendo a tu mapa...", "Gift redeemed! Taking you to your map..."));
      router.push("/profile");
    } catch {
      toast.error("No pudimos canjear tu regalo. Intentá de nuevo.");
      setRedeeming(false);
    }
  };

  if (checkState === "checking") {
    return (
      <main id="main-content" className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
        <p className="text-xs font-mono text-muted">{L("Verificando tu regalo…", "Checking your gift…")}</p>
      </main>
    );
  }

  if (checkState === "not_found" || checkState === "already_redeemed") {
    return (
      <main id="main-content" className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-sm text-foreground">
          {checkState === "already_redeemed" ? L("Este código ya fue usado.", "This code has already been used.") : L("Este código no existe o ya expiró.", "This code doesn't exist or has expired.")}
        </p>
        <Link href="/premium" className="text-xs font-mono text-accent hover:underline">{L("Ver planes en /premium →", "See plans at /premium →")}</Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-md px-4 sm:px-8 text-center">
        <span className="page-eyebrow mb-4">
          <Gift className="w-3.5 h-3.5 text-accent" />
          <span className="text-sm text-accent font-bold label-caps">{L("Regalo de Molino", "A gift from Molino")}</span>
        </span>

        <h1 className="page-title text-foreground">{L("¡Te regalaron un mapa!", "Someone gave you a map!")}</h1>
        <p className="text-sm text-muted mt-3 leading-relaxed">{L("Un mapa personal completo — numerología, astrología y zodíaco chino, en una sola lectura.", "A complete personal map — numerology, astrology and the Chinese zodiac, in a single reading.")}</p>

        <form onSubmit={handleRedeem} className="mt-8 rounded-lg border border-ink/10 bg-card p-6 sm:p-7 text-left space-y-4">
          <div>
            <label htmlFor="gift-birthdate" className="block text-sm text-muted mb-1.5 font-semibold label-caps">{L("Tu fecha de nacimiento", "Your date of birth")}</label>
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
            <label htmlFor="gift-name" className="block text-sm text-muted mb-1.5 font-semibold label-caps">{L("Tu nombre (opcional)", "Your name (optional)")}</label>
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
            {L("Canjear mi regalo", "Redeem my gift")}
          </Button>
        </form>

        <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          {L("Tu fecha se usa solo para calcular tu mapa — nunca se guarda ni se comparte.", "Your date is used only to calculate your map — it's never stored or shared.")}
        </p>
      </div>
    </main>
  );
}
