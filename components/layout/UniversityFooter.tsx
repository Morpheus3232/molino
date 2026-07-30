import Link from "next/link";
import { footerColumns } from "@/lib/data/navigation";

export default function UniversityFooter() {
  return (
    <footer className="bg-[#0F0F10] text-white">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-y-0">
          <div className="md:col-span-5 md:pr-12">
            <span className="inline-flex h-11 w-11 items-center justify-center bg-white/10 border border-white/20">
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
            <p className="font-display text-lg text-white mt-6 uppercase tracking-wide">
              MOLINO
            </p>
            <p className="text-sm text-white/60 mt-2 max-w-xs leading-relaxed">
              Mapa Personal de Autoconocimiento. Conocéte. Entendéte. Orientáte.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className={col.title === "EXPLORAR" ? "md:col-span-3 md:col-start-7" : "md:col-span-2"}>
              <h4 className="font-mono text-xs font-semibold tracking-[0.2em] text-white/50 mb-6 uppercase">
                {col.title}
              </h4>
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
          <p className="text-xs text-white/70 font-mono tracking-wider">MOLINO — MAPA PERSONAL DE AUTOCONOCIMIENTO</p>
          <p className="text-xs text-white/70 font-mono tracking-wider">
            CONTENIDO EDUCATIVO Y SIMBÓLICO. COMPARTILO LIBREMENTE.
          </p>
        </div>
      </div>
    </footer>
  );
}
