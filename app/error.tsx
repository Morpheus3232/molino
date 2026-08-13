"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Molino] Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-background text-foreground">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-card border border-ink/10 shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-5">
          <AlertCircle className="w-7 h-7" />
        </div>

        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold">
          Error Temporal
        </span>

        <h1 className="font-display text-2xl sm:text-3xl text-foreground font-bold mt-2 mb-3">
          Algo no salió como esperábamos
        </h1>

        <p className="text-sm text-muted leading-relaxed mb-8">
          Tus datos locales y mapas guardados en tu navegador están seguros. Podés reintentar cargar la página o volver al inicio.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-gold-foreground font-heading text-xs uppercase tracking-wider font-bold hover:bg-gold-hover transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reintentar
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink/5 border border-ink/10 text-foreground font-heading text-xs uppercase tracking-wider font-semibold hover:bg-ink/10 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
