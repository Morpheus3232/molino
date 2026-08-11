import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/seo";
import CalendarioClient from "@/components/calendario/CalendarioClient";

export const metadata: Metadata = {
  title: "Calendario Numerológico",
  description:
    "Cada día del mes reducido a su número y su propósito: descubrí la energía numerológica de cualquier fecha del calendario.",
  alternates: {
    canonical: siteUrl("/calendario"),
  },
  openGraph: {
    title: "Calendario Numerológico — Molino",
    description: "Cada día del mes reducido a su número y su propósito.",
    type: "website",
    url: siteUrl("/calendario"),
  },
};

export default function CalendarioPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 sm:px-8 pt-16 sm:pt-20 pb-24" id="main-content">
        <div className="border-t border-ink/10 py-10 sm:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
            <span aria-hidden="true">›</span>
            <span className="text-foreground font-medium">Calendario</span>
          </nav>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.9] tracking-tight">
            Calendario Numerológico
          </h1>
          <p className="text-sm text-muted mt-4 max-w-xl">
            Cada día del mes se reduce a un número del 1 al 9, salvo los números maestros 11, 22, 28 y 33. Elegí un día para ver su propósito.
          </p>
        </div>

        <CalendarioClient />
      </main>
    </div>
  );
}
