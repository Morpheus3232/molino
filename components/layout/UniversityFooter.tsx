import Link from "next/link";

export default function UniversityFooter() {
  return (
    <footer className="border-t border-accent/10 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-background text-foreground">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                <polygon points="9,22 15,22 13,11 11,11" />
                <polygon points="12,4 9,11 15,11" />
                <line x1="12" y1="4" x2="12" y2="1" />
                <line x1="17" y1="8" x2="20" y2="6" />
                <line x1="7" y1="8" x2="4" y2="6" />
              </svg>
            </span>
            <p className="font-serif text-lg text-background/70 mt-3 leading-relaxed">
              Inteligencia Personal
            </p>
            <p className="text-sm text-background/50 mt-1 max-w-xs leading-relaxed">
              Conocéte. Entendéte. Orientáte.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-8">
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-background/55 font-medium mb-4">Explorar</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-background/60 hover:text-background transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-background/60 hover:text-background transition-colors">Mi mapa</Link>
              </li>
              <li>
                <Link href="/explore" className="text-sm text-background/60 hover:text-background transition-colors">Explorar</Link>
              </li>
              <li>
                <Link href="/biblioteca" className="text-sm text-background/60 hover:text-background transition-colors">Biblioteca</Link>
              </li>
              <li>
                <Link href="/guia" className="text-sm text-background/60 hover:text-background transition-colors">Guía</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-background/55 font-medium mb-4">Principios</h4>
            <ul className="space-y-3 text-sm text-background/50">
              <li>Conocimiento libre</li>
              <li>Transparencia total</li>
              <li>Sin tracking ni cookies</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-background/55 leading-relaxed">Molino — Inteligencia Personal. Contenido educativo y simbólico. Compartilo libremente.</p>
        </div>
      </div>
    </footer>
  );
}
