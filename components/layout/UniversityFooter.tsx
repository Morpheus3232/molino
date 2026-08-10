import Link from "next/link";
import { Github } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { footerColumns } from "@/lib/data/navigation";

export default function UniversityFooter() {
  return (
    <footer className="bg-[#0F0F10] text-white">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-y-0">
          <div className="md:col-span-5 md:pr-12">
            <span className="inline-flex h-11 w-11 items-center justify-center bg-white/10 border border-white/20">
              <Logo className="w-6 h-6" />
            </span>
            <p className="font-heading text-lg text-white mt-6 uppercase tracking-wide">
              MOLINO
            </p>
            <p className="text-sm text-white/60 mt-2 max-w-xs leading-relaxed">
              Mapa personal de autoconocimiento. Tres sistemas, una lectura.
            </p>
            <Link
              href="https://github.com/molino-app/molino"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-white/60 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              GitHub
            </Link>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className={col.title === "EXPLORAR" ? "md:col-span-3 md:col-start-7" : "md:col-span-2"}>
              <p className="font-mono text-xs font-semibold tracking-[0.2em] text-white/50 mb-6 uppercase">
                {col.title}
              </p>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-white/80 hover:text-white transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/70 font-mono tracking-wider">
            © 2026 Molino. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/70 font-mono tracking-wider">Hecho con intención.</p>
        </div>
      </div>
    </footer>
  );
}
