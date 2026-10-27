import { defineRouting } from "next-intl/routing";

/**
 * Ruteo bilingüe. El español es el idioma maestro y vive en la raíz
 * (molino.app/profile); el inglés lleva prefijo (molino.app/en/profile).
 *
 * - `localePrefix: "as-needed"`: sin /es en las URLs — ninguna URL existente
 *   cambia, nada que redirigir, nada que Google tenga que reindexar.
 * - `localeDetection: false`: no se redirige según Accept-Language. El idioma
 *   lo elige la URL (o el selector ES/EN), nunca una suposición.
 * - `localeCookie: false`: el sitio promete "sin cookies"; el idioma no las
 *   necesita porque viaja en la URL.
 */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});

export type SiteLocale = (typeof routing.locales)[number];

export function isSiteLocale(value: unknown): value is SiteLocale {
  return typeof value === "string" && (routing.locales as readonly string[]).includes(value);
}
