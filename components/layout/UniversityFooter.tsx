import Link from "next/link";

export default function UniversityFooter() {
  return (
    <footer className="border-t border-accent/10 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-y-0">
          <div className="md:col-span-5 md:pr-12">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-foreground border border-border">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                <line x1="12" y1="3" x2="12" y2="12" />
                <line x1="4" y1="7" x2="20" y2="7" />
                <path d="M9 12v10h6V12" />
                <path d="M7 22h10" />
                <path d="M9 12l3-4 3 4" />
              </svg>
            </span>
            <p className="font-heading uppercase text-sm text-background mt-4 tracking-wide">
              Inteligencia Personal
            </p>
            <p className="text-sm text-background/50 mt-2 max-w-xs leading-relaxed">
              Conocéte. Entendéte. Orientáte.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-background/55 font-medium mb-5">
              Explorar
            </h4>
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

          <div className="md:col-span-2">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-background/55 font-medium mb-5">
              Principios
            </h4>
            <ul className="space-y-3 text-sm text-background/50">
              <li>Conocimiento libre</li>
              <li>Transparencia total</li>
              <li>Sin tracking ni cookies</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/55">
          <p>Molino — Inteligencia Personal</p>
          <p>Contenido educativo y simbólico. Compartilo libremente.</p>
        </div>
      </div>
    </footer>
  );
}
