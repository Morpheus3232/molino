import { es, type Dictionary } from "./es";

/**
 * TODO(i18n-en): no traducido todavía — a propósito. Cuando se traduzca,
 * debe sentirse como un producto pensado en inglés desde cero, no como
 * "Molino en español pasado por Google Translate". Especialmente:
 *   - concepts.* (Mi Mapa, Círculo, Inteligencia, Síntesis Integral, "¿Qué
 *     te trae hoy?") necesitan una decisión de nombre en inglés, no una
 *     traducción literal.
 *   - premium.* es la propuesta de valor de USD 8 — el tono comercial debe
 *     sonar nativo, no traducido.
 * Hasta entonces, cae en es como fallback explícito (ver lib/i18n/index.ts)
 * para que nunca se sirva un string a medio traducir.
 */
export const en: Dictionary = es;
