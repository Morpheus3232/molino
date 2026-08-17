import Link from "next/link";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Compatibilidad Astrológica",
  description: "Cómo se relacionan los signos según sus elementos y modalidades. Fuego, Tierra, Aire y Agua en acción.",
  path: "/guia/compatibilidad-astrologica",
});

export default function CompatibilidadAstrologicaPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
        <div className="border-t border-ink/10 py-10 sm:py-16">
          <Link href="/guia" className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2">
            &larr; Volver a la guía
          </Link>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight mt-8">
            Compatibilidad Astrológica
          </h1>
          <p className="text-sm text-muted mt-4 max-w-xl">
            Elementos y modalidades — Cómo se relacionan los signos.
          </p>
        </div>

        <div className="prose prose-neutral max-w-2xl">
          <p className="text-muted leading-relaxed">
            Este artículo está en preparación. Volvé pronto para explorar la compatibilidad
            entre signos según sus elementos y modalidades.
          </p>
        </div>
      </main>
    </div>
  );
}
