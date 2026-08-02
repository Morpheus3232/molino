import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-lg">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent font-medium mb-6">
          Error 404
        </p>
        <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground leading-[1.0] mb-6">
          No encontramos esta página
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed mb-10 max-w-md mx-auto">
          Puede que el enlace esté roto o que la página se haya movido. Todo tu perfil sigue intacto.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-medium rounded-md hover:bg-accent/90 transition-colors text-sm"
        >
          Volver al inicio →
        </Link>
      </div>
    </div>
  );
}
