"use client";
import { useL } from "@/lib/i18n/useL";

import { useEffect } from "react";
import { Link } from "@/lib/i18n/navigation";
import { RefreshCw, } from "lucide-react";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const L = useL();
  useEffect(() => {
    console.error("[Molino Profile] Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center p-8 rounded-xl bg-card border border-ink/10 shadow-lg">

        <h1 className="font-display text-2xl font-bold text-foreground mb-2">{L("No pudimos calcular tu mapa en el servidor", "We couldn't calculate your map on the server")}</h1>

        <p className="text-sm text-muted leading-relaxed mb-6">{L("Tu navegador puede calcularlo directamente sin pasar por servidores externos.", "Your browser can calculate it directly without going through external servers.")}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-gold-foreground text-sm font-bold hover:bg-gold-hover transition-colors label-caps"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {L("Reintentar", "Try again")}
          </button>
          <Link
            href="/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink/5 border border-ink/10 text-foreground text-sm font-semibold hover:bg-ink/10 transition-colors label-caps"
          >{L("Ingresar fecha de nuevo", "Enter the date again")}</Link>
        </div>
      </div>
    </div>
  );
}
