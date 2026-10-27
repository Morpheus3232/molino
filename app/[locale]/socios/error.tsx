"use client";
import { useL } from "@/lib/i18n/useL";

import { useEffect } from "react";
import { Link } from "@/lib/i18n/navigation";
import { RefreshCw, Handshake } from "lucide-react";

export default function SociosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const L = useL();
  useEffect(() => {
    console.error("[Molino Socios] Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center p-8 rounded-xl bg-card border border-ink/10 shadow-lg">
        <div className="w-14 h-14 rounded-lg bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center mb-5">
          <Handshake className="w-7 h-7" />
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground mb-2">{L("No pudimos procesar la comparativa", "We couldn't process the comparison")}</h1>

        <p className="text-sm text-muted leading-relaxed mb-6">{L("Verificá que ambas fechas de nacimiento sean válidas o intentá reiniciar la comparación.", "Check that both dates of birth are valid or try restarting the comparison.")}</p>

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
            href="/socios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink/5 border border-ink/10 text-foreground text-sm font-semibold hover:bg-ink/10 transition-colors label-caps"
          >{L("Nueva Comparativa", "New Comparison")}</Link>
        </div>
      </div>
    </div>
  );
}
