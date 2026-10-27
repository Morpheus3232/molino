import { useLocale } from "next-intl";
import type { SiteLocale } from "./routing";

/**
 * Selector bilingüe: `L("Mi Mapa", "My Map")`. El español va primero porque
 * es el idioma maestro; el inglés es una transcreación, no una traducción
 * literal. Sirve para cualquier valor, no solo strings (arrays, objetos,
 * JSX).
 */
export type Pick2 = <T>(es: T, en: T) => T;

export function pickFor(locale: string): Pick2 {
  return (es, en) => (locale === "en" ? en : es);
}

/** Componentes de cliente y de servidor no-async. */
export function useL(): Pick2 {
  return pickFor(useLocale());
}

/** El locale actual, en componentes de cliente y de servidor no-async. */
export function useSiteLocale(): SiteLocale {
  return useLocale() === "en" ? "en" : "es";
}
