import Link from "next/link";
import { Github, ShieldCheck, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { getMemberCount } from "@/lib/metrics";

// El header solo lleva lo que es del usuario; el contenido del sitio vive
// acá. Cuando "Explorar" salió del header, esta columna pasó a ser su único
// hogar en desktop — cualquier ruta que se saque del header tiene que
// aparecer en alguna de estas cuatro columnas o queda sin puerta de entrada.
const FOOTER_COLUMNS = [
  {
    title: "Tu mapa",
    links: [
      { href: "/mundo", label: "Afinidades" },
      { href: "/pareja", label: "Modo Pareja" },
      { href: "/premium", label: "Premium" },
      { href: "/onboarding", label: "Crear mi mapa" },
    ],
  },
  {
    title: "Explorar",
    links: [
      { href: "/atlas", label: "Atlas" },
      { href: "/academy", label: "Academia" },
      { href: "/biblioteca", label: "Biblioteca" },
      { href: "/blog", label: "Blog" },
      { href: "/journal", label: "Journal" },
      { href: "/calendario", label: "Calendario" },
    ],
  },
  {
    title: "Molino",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/profesionales", label: "Profesionales" },
      { href: "/socios", label: "Socios" },
      { href: "/embed", label: "Widget" },
      { href: "/docs", label: "API / Docs" },
    ],
  },
  {
    title: "Transparencia",
    links: [
      { href: "/metodos-y-fuentes", label: "Métodos y Fuentes" },
      { href: "/transparencia", label: "Transparencia" },
      { href: "/privacidad", label: "Privacidad" },
      { href: "/terminos", label: "Términos" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
];

const CONTACT_EMAIL = "versionlimitada@proton.me";

export default async function UniversityFooter() {
  const memberCount = await getMemberCount();

  return (
    <footer className="bg-ink border-t border-ink/10 text-paper">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5 py-2.5 min-h-[44px] group" aria-label="Ir al inicio">
              <span className="inline-flex h-9 w-9 items-center justify-center bg-background text-foreground border border-ink/10 rounded-md">
                <Logo className="w-6 h-6" />
              </span>
              <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-paper group-hover:text-accent-light transition-colors">
                Molino
              </span>
            </Link>
            <p className="text-sm text-paper/70 mt-3 leading-relaxed">
              Autoconocimiento sin ruido.
            </p>
            {memberCount > 500 && (
              <p className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-paper/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {memberCount.toLocaleString("es-AR")} miembros · pagos validados
              </p>
            )}
          </div>

          {/* Columnas de navegación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start md:items-end">
            {FOOTER_COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-1">
                <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60 mb-2">
                  {col.title}
                </h4>
                <ul className="list-none">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block py-2.5 min-h-[44px] flex items-center text-sm text-paper/80 hover:text-accent-light transition-colors font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Contacto — transparencia y privacidad explícita */}
        <section className="mt-12 pt-8 border-t border-paper/20 text-center" aria-label="Contacto">
          <div className="flex flex-col items-center gap-3 text-sm text-paper/70">
            <p className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-paper/80">¿Hablamos?</span>
            </p>
            <p>
              Escribinos a{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-1 py-2.5 min-h-[44px] text-accent-light hover:underline"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="inline-flex items-center gap-1.5 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              No vendemos tus datos. Tu privacidad importa.
            </p>
          </div>

          <a
            href="https://github.com/Morpheus3232/molino"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 py-2.5 min-h-[44px] text-sm text-paper/70 hover:text-accent-light transition-colors"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
            GitHub
          </a>
        </section>

        <div className="mt-10 pt-6 border-t border-paper/20">
          <p className="text-center text-xs text-paper/70 font-mono tracking-wider">
            © 2026 Molino. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}