import Link from "next/link";

export default function UniversityFooter() {
  return (
    <footer className="border-t border-border/30 bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background text-base font-semibold tracking-tight">
                M
              </span>
              <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">Molino</span>
            </div>
            <p className="font-serif text-lg text-muted mt-2 leading-relaxed">
              Inteligencia Personal
            </p>
            <p className="text-sm text-muted/60 mt-1 max-w-xs leading-relaxed">
              Conocete. Entendete. Orientate.
            </p>
            <p className="text-xs text-muted/40 mt-6">Código abierto · Sin registro · Sin rastreo</p>
          </div>

          <div className="md:col-span-3 md:col-start-8">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-muted/50 font-medium mb-6">Explorar</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted/70 hover:text-foreground transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-muted/70 hover:text-foreground transition-colors">Mi mapa</Link>
              </li>
              <li>
                <Link href="/explore" className="text-sm text-muted/70 hover:text-foreground transition-colors">Explorar</Link>
              </li>
              <li>
                <Link href="/biblioteca" className="text-sm text-muted/70 hover:text-foreground transition-colors">Biblioteca</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-muted/50 font-medium mb-6">Principios</h4>
            <ul className="space-y-3 text-sm text-muted/60">
              <li>Conocimiento libre</li>
              <li>Privacidad radical</li>
              <li>Transparencia total</li>
              <li>Código abierto</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border/20 text-center">
          <p className="text-xs text-muted/40">Molino — Inteligencia Personal. Todo el contenido es educativo y no constituye asesoramiento profesional.</p>
          <p className="text-xs text-muted/40 mt-1">El conocimiento simbólico es patrimonio de la humanidad. Compartilo libremente.</p>
        </div>
      </div>
    </footer>
  );
}
