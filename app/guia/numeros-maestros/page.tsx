import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Números Maestros 11, 22, 33",
  description: "Las frecuencias elevadas de la numerología. Qué significan los números maestros y cómo identificarlos en tu mapa personal.",
};

export default function NumerosMaestrosPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
        <div className="border-t border-ink/10 py-10 sm:py-16">
          <Link href="/guia" className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2">
            &larr; Volver a la guía
          </Link>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight mt-8">
            Números Maestros
          </h1>
          <p className="text-sm text-muted mt-4 max-w-xl">
            11, 22, 33 — Las frecuencias elevadas de la numerología.
          </p>
        </div>

        <div className="prose prose-neutral max-w-2xl">
          <p className="text-muted leading-relaxed">
            Este artículo está en preparación. Volvé pronto para explorar el significado
            de los números maestros 11, 22 y 33 en la numerología.
          </p>
        </div>
      </main>
    </div>
  );
}
