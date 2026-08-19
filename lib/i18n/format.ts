import type { Locale } from "./locales";

/**
 * BCP-47 tags Intl actually needs, per Molino locale. "es" maps to es-419
 * (español latinoamericano neutro), not es-AR — no dialect is baked in.
 */
const INTL_TAGS: Record<Locale, string> = {
  es: "es-419",
  en: "en-US",
  "pt-BR": "pt-BR",
};

export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale: Locale = "es"
): string {
  return date.toLocaleDateString(INTL_TAGS[locale], options);
}
