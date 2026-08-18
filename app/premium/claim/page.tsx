"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Falta el token del link.");
      return;
    }

    fetch(`/api/premium/claim?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.premiumToken) {
          setError(data.error || "Este link ya expiró o ya fue usado.");
          return;
        }
        savePremiumTokenClient(data.premiumToken);
        invalidatePremiumAccessCache(undefined, "");
        router.replace("/profile?claimed=1");
      })
      .catch(() => setError("No se pudo validar el link."));
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      {error ? (
        <>
          <p className="text-sm text-red-400">{error}</p>
          <p className="text-xs text-muted">
            Podés recuperar tu acceso desde la página Premium con tu ID de pago.
          </p>
        </>
      ) : (
        <>
          <Logo className="w-8 h-8 text-accent animate-spin" />
          <p className="text-xs font-mono text-muted">Activando tu acceso…</p>
        </>
      )}
    </div>
  );
}
