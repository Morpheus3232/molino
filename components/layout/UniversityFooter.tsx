import Link from "next/link";

export default function UniversityFooter() {
  return (
    <footer className="border-t border-white/5 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-background text-foreground text-base font-semibold tracking-tight">
                M
              </span>
              <span className="font-serif text-2xl font-semibold tracking-tight text-background">Molino</span>
            </div>
            <p className="font-serif text-xl text-background/70 mt-2 leading-relaxed">
              Inteligencia Personal
            </p>
            <p className="text-sm text-background/50 mt-1 max-w-xs leading-relaxed">
              Conocéte. Entendéte. Orientáte.
            </p>
            <p className="text-xs text-background/40 mt-8 max-w-xs leading-relaxed">Código abierto · Sin servidor · Privacidad radical</p>
          </div>

          <div className="md:col-span-3 md:col-start-8">
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-background/40 font-medium mb-6">Explorar</h4>
            <ul className="space-y-4">
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
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-background/40 font-medium mb-6">Principios</h4>
            <ul className="space-y-4 text-sm text-background/50">
              <li>Conocimiento libre</li>
              <li>Privacidad radical</li>
              <li>Transparencia total</li>
              <li>Código abierto</li>
              <li>Sin tracking ni cookies</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-white/10 text-center">
          <p className="text-xs text-background/40 leading-relaxed">Molino — Inteligencia Personal. Todo el contenido es educativo y no constituye asesoramiento profesional.</p>
          <p className="text-xs text-background/40 mt-2 leading-relaxed">El conocimiento simbolico es patrimonio de la humanidad. Compartilo libremente.</p>
        </div>
      </div>
    </footer>
  );
}
