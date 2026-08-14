import Link from "next/link";
import { Github } from "lucide-react";
import Logo from "@/components/ui/Logo";

const FOOTER_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/hoy", label: "Hoy" },
  { href: "/pareja", label: "Modo Pareja" },
  { href: "/journal", label: "Journal" },
  { href: "/premium", label: "Premium" },
  { href: "/profesionales", label: "Profesionales" },
  { href: "/embed", label: "Widget" },
  { href: "/changelog", label: "Changelog" },
  { href: "/privacidad", label: "Privacidad" },
];

export default function UniversityFooter() {
  return (
    <footer className="bg-[#0F0F10] border-t border-ink/10 text-foreground">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="Molino — Ir al inicio">
              <span className="inline-flex h-9 w-9 items-center justify-center bg-white/10 border border-white/20">
                <Logo className="w-6 h-6" />
              </span>
              <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-foreground group-hover:text-accent transition-colors">
                Molino
              </span>
            </Link>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              Autoconocimiento sin ruido.
            </p>
          </div>

          <nav aria-label="Navegación del pie de página" className="flex flex-col items-center md:items-end gap-6">
            <ul className="flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-center md:items-center gap-x-8 gap-y-4 list-none">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 hover:text-accent transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="https://github.com/Morpheus3232/molino"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              GitHub
            </Link>
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20">
          <p className="text-center text-xs text-white/70 font-mono tracking-wider">
            © 2026 Molino. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
