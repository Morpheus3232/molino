import Link from "next/link";
import type { Metadata } from "next";
import { Compass, Sparkles, Sun, Heart, BookOpen, ArrowRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Coordenada Fuera de Órbita | Molino",
  description: "Esta página no se encuentra en el mapa simbólico actual. Descubrí tu camino de vuelta.",
};

const SUGGESTED_ROUTES = [
  { href: "/", label: "Inicio", icon: Home, desc: "Instrumento principal" },
  { href: "/hoy", label: "Energía de Hoy", icon: Sun, desc: "Foco y ciclo diario" },
  { href: "/onboarding", label: "Calcular Mapa", icon: Sparkles, desc: "Tu mapa en 30 seg" },
  { href: "/pareja", label: "Modo Pareja", icon: Heart, desc: "Sinergia de dos mapas" },
  { href: "/journal", label: "Journal", icon: BookOpen, desc: "Registro reflexivo" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-24 text-foreground relative overflow-hidden">
      {/* Cosmic ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-xl relative z-10 w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mb-6">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
            Error 404 · Coordenada No Mapeada
          </span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.0] mb-4">
          Patrón fuera de órbita
        </h1>

        <p className="text-sm sm:text-base text-muted leading-relaxed mb-8 max-w-md mx-auto italic font-serif">
          &ldquo;A veces los desvíos revelan patrones que la ruta recta ocultaba. Tus datos locales siguen intactos.&rdquo;
        </p>

        {/* Quick Route Shortcuts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          {SUGGESTED_ROUTES.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                className="p-3.5 rounded-2xl bg-card border border-ink/10 hover:border-accent/40 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-ink/5 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-heading text-xs font-bold text-foreground block">
                      {route.label}
                    </span>
                    <span className="text-[11px] font-mono text-muted">
                      {route.desc}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gold text-gold-foreground font-heading text-xs uppercase tracking-wider font-bold rounded-xl hover:bg-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors shadow-md"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
