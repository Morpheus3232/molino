"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertCircle } from "lucide-react";
import { pageLocale } from "@/lib/i18n/pageLocale";

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Molino] Fatal Error:", error);
  }, [error]);

  // Fuera del layout por idioma no hay contexto de next-intl: el idioma sale de la URL.
  const en = pageLocale() === "en";
  const L = <T,>(es: T, enText: T) => (en ? enText : es);

  return (
    <html lang={en ? "en" : "es"}>
      <body className="bg-paper text-ink antialiased min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-xl bg-paper-alt border border-ink/10 shadow-2xl">
          <div className="w-14 h-14 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-5">
            <AlertCircle className="w-7 h-7" />
          </div>

          <span className="text-sm text-amber-700 font-semibold label-caps">
            {L("Error Crítico", "Critical error")}
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold mt-2 mb-3">
            {L("Ocurrió un error inesperado", "An unexpected error occurred")}
          </h1>

          <p className="text-sm text-[#787878] leading-relaxed mb-8">
            {L(
              "El sistema se ha protegido. Ningún dato privado se ha compartido. Podés recargar la aplicación para continuar.",
              "The system has protected itself. No private data has been shared. You can reload the app to continue.",
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0A0A] text-ink text-sm font-bold hover:bg-[#333333] transition-colors label-caps"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {L("Recargar Aplicación", "Reload app")}
            </button>

            <Link
              href={en ? "/en" : "/"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink/5 border border-ink/10 text-ink text-sm font-semibold hover:bg-ink/10 transition-colors label-caps"
            >
              <Home className="w-3.5 h-3.5" />
              {L("Inicio", "Home")}
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
