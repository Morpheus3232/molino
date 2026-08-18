import Link from "next/link";
import { Github, ShieldCheck, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { getMemberCount } from "@/lib/metrics";

const FOOTER_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/hoy", label: "Hoy" },
  { href: "/pareja", label: "Modo Pareja" },
  { href: "/journal", label: "Journal" },
  { href: "/premium", label: "Premium" },
  { href: "/profesionales", label: "Profesionales" },
  { href: "/embed", label: "Widget" },
  { href: "/docs", label: "API / Docs" },
  { href: "/metodos-y-fuentes", label: "Métodos y Fuentes" },
  { href: "/transparencia", label: "Transparencia" },
  { href: "/changelog", label: "Changelog" },
  { href: "/privacidad", label: "Privacidad" },
];

const CONTACT_EMAIL = "versionlimitada@proton.me";

export default async function UniversityFooter() {
  const memberCount = await getMemberCount();

  return (
    <footer className="bg-ink border-t border-ink/10 text-paper">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="Molino — Ir al inicio">
              <span className="inline-flex h-9 w-9 items-center justify-center bg-background text-foreground border border-ink/10 rounded-xl">
                <Logo className="w-6 h-6" />
              </span>
              <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-paper group-hover:text-accent-light transition-colors">
                Molino
              </span>
            </Link>
            <p className="text-sm text-paper/70 mt-3 leading-relaxed">
              Autoconocimiento sin ruido.
            </p>
            {/* Contador ético: solo se muestra tras superar 500 miembros reales
                (payments validados). Mientras tanto, la transparencia se
                comunica de forma sobria sin números inflados. */}
            {memberCount > 500 && (
              <p className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-paper/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {memberCount.toLocaleString("es-AR")} miembros · pagos validados
              </p>
            )}
          </div>

          <nav aria-label="Navegación del pie de página" className="flex flex-col items-center md:items-end gap-6">
            <ul className="flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-center md:items-center gap-x-8 gap-y-4 list-none">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/80 hover:text-accent-light transition-colors font-medium"
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
              className="inline-flex items-center gap-2 text-sm text-paper/70 hover:text-accent-light transition-colors"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              GitHub
            </Link>
          </nav>
        </div>

        {/* Contacto — transparencia y privacidad explícita */}
        <section className="mt-12 pt-8 border-t border-paper/20 text-center" aria-label="Contacto">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-paper">
            ¿Hablamos?
          </h4>
          <p className="mt-2 text-sm text-paper/70">
            Escribinos a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1 text-accent-light hover:underline"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-paper/70 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            🛡️ No vendemos tus datos. Tu privacidad importa.
          </p>
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
