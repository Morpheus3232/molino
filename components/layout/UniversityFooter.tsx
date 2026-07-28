import Link from "next/link";

export default function UniversityFooter() {
  return (
    <footer className="border-t border-white/15 bg-[#1a1a1a] text-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-y-0">
          <div className="md:col-span-5 md:pr-12">
            <span className="inline-flex h-11 w-11 items-center justify-center bg-white text-foreground border border-border">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
                <path d="M10 30 L8 14 L24 14 L22 30 Z" />
                <path d="M7 14 L16 7 L25 14 Z" />
                <path d="M14 30 L14 23 Q14 21 16 21 Q18 21 18 23 L18 30" />
                <circle cx="16" cy="17.5" r="1.1" />
                <line x1="0" y1="7" x2="32" y2="7" />
                <line x1="16" y1="-3" x2="16" y2="17" />
                <line x1="0" y1="4.5" x2="32" y2="4.5" strokeWidth="0.5" />
                <line x1="0" y1="9.5" x2="32" y2="9.5" strokeWidth="0.5" />
                <line x1="13" y1="-3" x2="13" y2="17" strokeWidth="0.5" />
                <line x1="19" y1="-3" x2="19" y2="17" strokeWidth="0.5" />
              </svg>
            </span>
            <p className="font-heading uppercase text-sm text-background mt-4 tracking-wide">
              Inteligencia Personal
            </p>
            <p className="text-sm text-background/80 mt-2 max-w-xs leading-relaxed">
              Conocéte. Entendéte. Orientáte.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-background/80 font-medium mb-5">
              Explorar
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-background/80 hover:text-background transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-background/80 hover:text-background transition-colors">Mi mapa</Link>
              </li>
              <li>
                <Link href="/explore" className="text-sm text-background/80 hover:text-background transition-colors">Explorar</Link>
              </li>
              <li>
                <Link href="/biblioteca" className="text-sm text-background/80 hover:text-background transition-colors">Biblioteca</Link>
              </li>
              <li>
                <Link href="/guia" className="text-sm text-background/80 hover:text-background transition-colors">Guía</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-background/80 font-medium mb-5">
              Principios
            </h4>
            <ul className="space-y-3 text-sm text-background/80">
              <li>Conocimiento libre</li>
              <li>Transparencia total</li>
              <li>Sin tracking ni cookies</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/80">
          <p>Molino — Inteligencia Personal</p>
          <p>Contenido educativo y simbólico. Compartilo libremente.</p>
        </div>
      </div>
    </footer>
  );
}
