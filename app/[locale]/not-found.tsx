import { useL, type Pick2 } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import { Compass, Asterisk, Sun, Heart, BookOpen, ArrowRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Coordenada Fuera de Órbita",
  description: "Esta página no se encuentra en el mapa simbólico actual. Descubrí tu camino de vuelta.",
  // Sin esto el 404 salía con dos robots: el "index, follow" del layout y el
  // "noindex" que agrega Next. El estado 404 ya lo dice; esto evita la contradicción.
  robots: { index: false, follow: true },
};

const SUGGESTED_ROUTES = (L: Pick2) => ([
  { href: "/", label: L("Inicio", "Home"), icon: Home, desc: L("Instrumento principal", "Main instrument") },
  { href: "/hoy", label: L("Energía de Hoy", "Today's Energy"), icon: Sun, desc: L("Foco y ciclo diario", "Daily focus and cycle") },
  { href: "/onboarding", label: L("Calcular Mapa", "Calculate Map"), icon: Asterisk, desc: L("Tu mapa en 30 seg", "Your map in 30 sec") },
  { href: "/pareja", label: L("Modo Pareja", "Couple Mode"), icon: Heart, desc: L("Sinergia de dos mapas", "Synergy of two maps") },
  { href: "/journal", label: L("Diario", "Journal"), icon: BookOpen, desc: L("Tu cuaderno privado", "Your private notebook") },
]);

export default function NotFound() {
  const L = useL();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-24 text-foreground relative overflow-hidden">
      <div className="text-center max-w-xl relative z-10 w-full">
        <div className="page-eyebrow mb-6">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
          <span className="text-sm font-bold label-caps">{L("Error 404 · Coordenada No Mapeada", "Error 404 · Unmapped Coordinate")}</span>
        </div>

        <h1 className="page-title text-foreground mb-4">{L("Patrón fuera de órbita", "Pattern out of orbit")}</h1>

        <p className="text-sm sm:text-base text-muted leading-relaxed mb-8 max-w-md mx-auto italic font-serif">{L(<>
          &ldquo;A veces los desvíos revelan patrones que la ruta recta ocultaba. Tus datos locales siguen intactos.&rdquo;
        </>, <>&ldquo;Sometimes detours reveal patterns the straight road was hiding. Your local data is still intact.&rdquo;</>)}</p>

        {/* Quick Route Shortcuts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          {SUGGESTED_ROUTES(L).map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                className="p-3.5 rounded-lg bg-card border border-ink/10 hover:border-accent/40 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all group flex items-center justify-between"
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
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gold text-gold-foreground font-heading text-sm font-bold rounded-xl hover:bg-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors shadow-md label-caps"
        >{L("Volver al Inicio", "Back to Home")}</Link>
      </div>
    </div>
  );
}
