import Link from "next/link";

export default function UniversityFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background text-sm font-semibold tracking-tight">
                M
              </span>
              <span className="font-serif text-xl font-semibold tracking-tight text-foreground">Molino</span>
            </div>
            <p className="text-base text-muted mt-3">Inteligencia Personal</p>
            <p className="text-sm text-muted mt-2">Código abierto · Sin servidor · Privacidad radical</p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-5">Principios</h4>
            <ul className="space-y-3 text-base text-muted">
              <li>Conocimiento libre</li>
              <li>Privacidad radical</li>
              <li>Transparencia total</li>
              <li>Código abierto</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-5">Explorar</h4>
            <ul className="space-y-3 text-base text-muted">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-accent transition-colors">Mi mapa</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-accent transition-colors">Explorar</Link>
              </li>
              <li>
                <Link href="/biblioteca" className="hover:text-accent transition-colors">Biblioteca</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-border/60 text-center">
          <p className="text-sm text-muted">Molino — Inteligencia Personal. Todo el contenido es educativo y no constituye asesoramiento profesional.</p>
          <p className="text-sm text-muted mt-2">El conocimiento simbólico es patrimonio de la humanidad. Compartilo libremente.</p>
        </div>
      </div>
    </footer>
  );
}
