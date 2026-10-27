import { type Pick2 } from "@/lib/i18n/useL";
import { getL } from "@/lib/i18n/server";
import { Link } from "@/lib/i18n/navigation";
import { Github, ShieldCheck, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { getMemberCount } from "@/lib/metrics";

// El header solo lleva lo que es del usuario; el contenido del sitio vive
// acá. Cuando "Explorar" salió del header, esta columna pasó a ser su único
// hogar en desktop — cualquier ruta que se saque del header tiene que
// aparecer en alguna de estas cuatro columnas o queda sin puerta de entrada.
const FOOTER_COLUMNS = (L: Pick2) => ([
  {
    title: L("Mi Molino", "My Molino"),
    links: [
      { href: "/profile", label: L("Mi Mapa", "My Map") },
      { href: "/lectura", label: L("Mi Lectura", "My Reading") },
      { href: "/pareja", label: L("Modo Pareja", "Couple Mode") },
      { href: "/premium", label: "Premium" },
      { href: "/onboarding", label: L("Crear mi mapa", "Create my map") },
    ],
  },
  {
    title: L("Conocer y explorar", "Learn and explore"),
    links: [
      { href: "/conocimiento/numerologia", label: "Numerología" },
      { href: "/conocimiento/astrologia", label: "Astrología" },
      { href: "/conocimiento/zodiaco-chino", label: L("Zodíaco chino", "Chinese zodiac") },
      { href: "/blog", label: "Blog" },
      { href: "/biblioteca", label: L("Biblioteca", "Library") },
      { href: "/academy", label: L("Academia", "Academy") },
      { href: "/affinity", label: L("Afinidades", "Affinities") },
      { href: "/atlas", label: "Atlas" },
      { href: "/calendario", label: L("Calendario", "Calendar") },
      { href: "/journal", label: L("Diario", "Journal") },
    ],
  },
  {
    title: L("Proyecto", "Project"),
    links: [
      { href: "/filosofia", label: L("Filosofía", "Philosophy") },
      { href: "/metodos-y-fuentes", label: L("Métodos y fuentes", "Methods and sources") },
      { href: "/changelog", label: "Changelog" },
      { href: "/docs", label: "API / Docs" },
      { href: "/nosotros", label: L("Nosotros", "About us") },
    ],
  },
  {
    title: L("Más", "More"),
    links: [
      { href: "/regalar", label: L("Regalar un mapa", "Gift a map") },
      { href: "/socios", label: L("Modo Socios", "Partners Mode") },
      { href: "/profesionales", label: L("Para profesionales", "For professionals") },
      { href: "/privacidad", label: L("Privacidad", "Privacy") },
      { href: "/terminos", label: L("Términos", "Terms") },
    ],
  },
]);

const CONTACT_EMAIL = "versionlimitada@proton.me";

export default async function UniversityFooter() {
  const L = await getL();
  const memberCount = await getMemberCount();

  // Una grilla de 12: marca (4) + cuatro columnas de links (2 c/u), todas
  // alineadas arriba. En el celular, la marca arriba y los links de a dos
  // columnas — antes era una sola tira de 26 links de 44px (≈1.400px).
  return (
    <footer className="bg-ink border-t border-ink/10 text-paper">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-12 pb-8 sm:pt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="col-span-2 lg:col-span-4 lg:pr-8">
            <Link href="/" className="inline-flex items-center gap-2.5 min-h-[44px] group" aria-label={L("Ir al inicio", "Go to home")}>
              <span className="inline-flex h-9 w-9 items-center justify-center bg-background text-foreground border border-ink/10 rounded-md">
                <Logo className="w-6 h-6" />
              </span>
              <span className="font-heading text-sm font-semibold text-paper group-hover:text-accent-light transition-colors label-caps">
                Molino
              </span>
            </Link>
            <p className="mt-3 text-sm text-paper/70 leading-relaxed max-w-xs">{L("Autoconocimiento sin ruido. Numerología, astrología y zodíaco chino calculados en tu navegador.", "Self-knowledge without the noise. Numerology, astrology and the Chinese zodiac calculated in your browser.")}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-paper/70">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {L("No vendemos tus datos.", "We don't sell your data.")}
            </p>
            {memberCount > 500 && (
              <p className="mt-2 text-sm text-paper/70">{L(<>
                {memberCount.toLocaleString("es-AR")} miembros · pagos validados
              </>, <>{memberCount.toLocaleString("en-US")} members · verified payments</>)}</p>
            )}
          </div>

          {FOOTER_COLUMNS(L).map((col) => (
            <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
              <h2 className="text-sm text-paper/60 mb-2 label-caps">{col.title}</h2>
              <ul className="list-none">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center min-h-[40px] lg:min-h-[34px] text-sm text-paper/85 hover:text-accent-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Barra inferior: una línea en desktop, apilada y alineada a la izquierda en el celular. */}
        <div className="mt-12 pt-6 border-t border-paper/20 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6 text-sm text-paper/70">
          <p className="text-paper/70">© 2026 Molino</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 min-h-[40px] text-paper/70 hover:text-accent-light transition-colors"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <a
              href="https://github.com/Morpheus3232/molino"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[40px] text-paper/70 hover:text-accent-light transition-colors"
            >
              <Github className="w-3.5 h-3.5" aria-hidden="true" />
              {L("Código abierto en GitHub", "Open source on GitHub")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}