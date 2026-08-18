"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertCircle } from "lucide-react";

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

  return (
    <html lang="es">
      <body className="bg-paper text-ink antialiased min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-paper-alt border border-ink/10 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-5">
            <AlertCircle className="w-7 h-7" />
          </div>

          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-700 font-semibold">
            Error Crítico
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold mt-2 mb-3">
            Ocurrió un error inesperado
          </h1>

          <p className="text-sm text-[#7A7870] leading-relaxed mb-8">
            El sistema se ha protegido. Ningún dato privado se ha compartido. Podés recargar la aplicación para continuar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4A843] text-ink text-xs uppercase tracking-wider font-bold hover:bg-[#E5B954] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Recargar Aplicación
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink/5 border border-ink/10 text-ink text-xs uppercase tracking-wider font-semibold hover:bg-ink/10 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Inicio
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
