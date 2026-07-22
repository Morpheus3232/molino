import Link from "next/link";

export default function UniversityFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true">
                <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
                <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent)" textAnchor="middle">M</text>
              </svg>
              <span className="font-serif font-bold text-lg text-foreground tracking-tight">Molino</span>
            </div>
            <p className="text-sm text-muted mt-2">
              Universidad Pública de Libre Acceso
            </p>
            <p className="text-xs text-muted mt-1">
              Código Abierto · Sin Registro · Sin Rastreo
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Principios</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Conocimiento libre</li>
              <li>Privacidad radical</li>
              <li>Transparencia total</li>
              <li>Código abierto</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Enlaces</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="/biblioteca" className="hover:text-accent transition-colors">
                  Documentación
                </Link>
              </li>
              <li>
                <Link href="/biblioteca" className="hover:text-accent transition-colors">
                  Biblioteca Pública
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-border text-center text-xs text-muted">
          <p>
            Molino — Universidad Pública de Libre Acceso.{" "}
            Todo el contenido es educativo y no constituye asesoramiento profesional.
          </p>
          <p className="mt-1">
            El conocimiento simbólico es patrimonio de la humanidad. Compartilo libremente.
          </p>
        </div>
      </div>
    </footer>
  );
}
