/**
 * Locales Molino planea soportar. "es" es el idioma maestro y el único con
 * copy real hoy — en/pt-BR están registrados como ciudadanos de primera
 * clase en el tipo pero sus diccionarios todavía no existen (ver
 * dictionaries/en.ts y dictionaries/pt-BR.ts). Cuando se traduzcan, NO debe
 * ser palabra-por-palabra: ver ese TODO para la estrategia de transcreación
 * por concepto (Mi Mapa, Círculo, Inteligencia, Premium, etc).
 */
export const locales = ["es", "en", "pt-BR"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";
