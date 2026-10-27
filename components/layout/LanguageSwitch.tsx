"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/lib/i18n/navigation";

/**
 * Cambia entre español (raíz) e inglés (/en). Es un enlace común y no un
 * <Link>: el cambio de idioma recarga la página para que el <html lang>, la
 * metadata y el diccionario de contenido salgan del idioma nuevo. Conserva la
 * query y el hash (los mapas compartidos viajan en la URL).
 */
export default function LanguageSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname() || "/";
  const en = locale === "en";
  const target = en ? pathname : pathname === "/" ? "/en" : `/en${pathname}`;
  return (
    <a
      href={target}
      hrefLang={en ? "es" : "en"}
      lang={en ? "es" : "en"}
      onClick={(e) => {
        if (typeof window === "undefined") return;
        e.preventDefault();
        window.location.href = target + window.location.search + window.location.hash;
      }}
      className={className}
      aria-label={en ? "Ver esta página en español" : "View this page in English"}
    >
      {en ? "Español" : "English"}
    </a>
  );
}
