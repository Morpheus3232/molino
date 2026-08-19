import { es } from "./dictionaries/es";
import { en } from "./dictionaries/en";
import { ptBR } from "./dictionaries/pt-BR";
import { defaultLocale, type Locale } from "./locales";

export type { Dictionary } from "./dictionaries/es";
export { locales, defaultLocale, type Locale } from "./locales";

const dictionaries = {
  es,
  en,
  "pt-BR": ptBR,
} as const;

export function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale] ?? es;
}

/**
 * No hay locale routing todavía (una sola URL, un solo idioma servido: es).
 * `t` es el acceso directo que usan hoy los componentes — el día que se
 * agregue detección/selección de locale, esto se reemplaza por un hook
 * (useLocale() → getDictionary(locale)) sin tocar los call sites, porque
 * ya consumen `t.seccion.clave` en vez de strings sueltos.
 */
export const t = getDictionary(defaultLocale);
