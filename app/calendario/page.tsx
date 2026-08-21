import Link from "next/link";
import { motion } from "framer-motion";
import CalendarioClient from "@/components/calendario/CalendarioClient";
import { createRouteMetadata } from "@/lib/seo";
import { Calendar, Zap, Lightbulb } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";

export const metadata = createRouteMetadata({
  title: "Calendario Numerológico",
  description:
    "Cada día del mes reducido a su número y su propósito: descubrí la energía numerológica de cualquier fecha del calendario.",
  path: "/calendario",
  ogDescription: "Cada día del mes reducido a su número y su propósito.",
});

export default function CalendarioPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 sm:px-8 pt-16 sm:pt-20 pb-24" id="main-content">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-10 sm:mb-14" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground font-medium">Calendario</span>
        </nav>

        {/* Hero mejorado */}
        <div className="mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">Herramienta interactiva</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.9] tracking-tight mb-5">
            Calendario Numerológico
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-3xl leading-relaxed mb-6">
            Cada día del mes se reduce a un número del 1 al 9, y cada número tiene su propia energía, propósito y significado. 
            Los números maestros (11, 22, 28, 33) revelan días con potencial amplificado.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-accent" />
                <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted">Números 1-9</p>
              </div>
              <p className="font-heading text-lg font-bold text-foreground">9 arquetipos</p>
              <p className="text-xs text-muted mt-1">Cada uno con su propósito</p>
            </div>

            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted">Maestros</p>
              </div>
              <p className="font-heading text-lg font-bold text-foreground">11, 22, 28, 33</p>
              <p className="text-xs text-muted mt-1">Energía amplificada</p>
            </div>

            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-accent" />
                <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted">Desde hoy</p>
              </div>
              <p className="font-heading text-lg font-bold text-foreground">30-31 días</p>
              <p className="text-xs text-muted mt-1">De descubrimiento</p>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mb-12 p-6 sm:p-8 rounded-lg bg-ink/[0.015] border border-ink/10">
          <p className="text-sm text-foreground mb-3">
            <span className="font-semibold">¿Cómo usarlo?</span> Seleccioná cualquier día del mes para ver su número numerológico y su significado. 
            Navegá entre meses con las flechas.
          </p>
          <p className="text-xs text-muted">
            💡 <span className="text-accent">Tip:</span> Los números maestros tienen bordes dorados. Hoy está marcado con un punto debajo del número.
          </p>
        </div>

        <CalendarioClient />
      </main>
    </div>
  );
}
