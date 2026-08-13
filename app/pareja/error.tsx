"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Heart } from "lucide-react";

export default function ParejaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Molino Pareja] Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-card border border-ink/10 shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center mb-5">
          <Heart className="w-7 h-7" />
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          No pudimos procesar la comparativa
        </h1>

        <p className="text-sm text-muted leading-relaxed mb-6">
          Verificá que ambas fechas de nacimiento sean válidas o intentá reiniciar la comparación.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-gold-foreground text-xs uppercase tracking-wider font-bold hover:bg-gold-hover transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reintentar
          </button>
          <Link
            href="/pareja"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink/5 border border-ink/10 text-foreground text-xs uppercase tracking-wider font-semibold hover:bg-ink/10 transition-colors"
          >
            Nueva Comparativa
          </Link>
        </div>
      </div>
    </div>
  );
}
