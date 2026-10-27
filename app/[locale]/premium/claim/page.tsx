"use client";
import { useL } from "@/lib/i18n/useL";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import Logo from "@/components/ui/Logo";
import { savePremiumTokenClient } from "@/lib/premium";
import { invalidatePremiumAccessCache } from "@/lib/hooks/usePremiumAccess";

export default function PremiumClaimPage() {
  return (
    <Suspense fallback={null}>
      <PremiumClaimContent />
    </Suspense>
  );
}

function PremiumClaimContent() {
  const L = useL();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError(L("Falta el token del link.", "The link's token is missing."));
      return;
    }

    fetch(`/api/premium/claim?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.premiumToken) {
          setError(data.error || L("Este link ya expiró o ya fue usado.", "This link has expired or has already been used."));
          return;
        }
        savePremiumTokenClient(data.premiumToken);
        invalidatePremiumAccessCache(undefined, "");
        router.replace("/profile?claimed=1");
      })
      .catch(() => setError(L("No se pudo validar el link.", "The link couldn't be validated.")));
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      {error ? (
        <>
          <p className="text-sm text-red-400">{error}</p>
          <p className="text-xs text-muted">{L("Podés recuperar tu acceso desde la página Premium con tu ID de pago.", "You can recover your access from the Premium page with your payment ID.")}</p>
        </>
      ) : (
        <>
          <Logo className="w-8 h-8 text-accent animate-spin" />
          <p className="text-xs font-mono text-muted">{L("Activando tu acceso…", "Activating your access…")}</p>
        </>
      )}
    </div>
  );
}
