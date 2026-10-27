"use client";
import { useL } from "@/lib/i18n/useL";

import { useEffect } from "react";
import { Link } from "@/lib/i18n/navigation";
import { RefreshCw, Home, AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const L = useL();
  useEffect(() => {
    console.error("[Molino] Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-background text-foreground">
      <div className="max-w-md w-full text-center p-8 rounded-xl bg-card border border-ink/10 shadow-lg">
        <div className="w-14 h-14 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-5">
          <AlertCircle className="w-7 h-7" />
        </div>

        <span className="text-sm text-amber-700 font-semibold label-caps">{L("Error Temporal", "Temporary Error")}</span>

        <h1 className="font-display text-2xl sm:text-3xl text-foreground font-bold mt-2 mb-3">{L("Algo no salió como esperábamos", "Something didn't go as expected")}</h1>

        <p className="text-sm text-muted leading-relaxed mb-8">{L("Tus datos locales y mapas guardados en tu navegador están seguros. Podés reintentar cargar la página o volver al inicio.", "Your local data and the maps saved in your browser are safe. You can try loading the page again or go back home.")}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-gold-foreground font-heading text-sm font-bold hover:bg-gold-hover transition-colors shadow-sm label-caps"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {L("Reintentar", "Try again")}
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink/5 border border-ink/10 text-foreground font-heading text-sm font-semibold hover:bg-ink/10 transition-colors label-caps"
          >
            <Home className="w-3.5 h-3.5" />
            {L("Ir al Inicio", "Go Home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
