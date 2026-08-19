import type { Locale } from "@/lib/i18n/locales";

/**
 * Contexto geográfico/lingüístico del usuario — separado por completo del
 * UserProfile (identidad/nacimiento). No toca Affinity/Compatibility: esos
 * engines siguen calculando SOLO por animal del zodíaco chino. Este
 * contexto es para RECOMENDACIONES y presentación (idioma, moneda,
 * ejemplos culturales), nunca para el score.
 *
 * Jerarquía de resolución (ver resolveUserContext):
 *   1. explicit    — el usuario lo eligió a mano (settings/onboarding override)
 *   2. onboarding  — país elegido durante el ritual de onboarding
 *   3. detected    — señal de browser (idioma del navegador), sin IP
 *   4. default     — fallback neutro, nunca asume Argentina
 */
export type LocationSource = "explicit" | "onboarding" | "detected" | "default";

export interface UserContext {
  language: Locale;
  /** Nombre de país (mismo dataset que lib/data/countries.ts) — "dónde estoy ahora", no birthPlace. */
  country?: string;
  region?: string;
  /** ISO 4217. Precio de Premium es único global (USD 8) — esto es para mostrar el precio con contexto, no para cobrar distinto. */
  currency: string;
  /** IANA tz, ej. "America/Sao_Paulo". */
  timezone: string;
  locationSource: LocationSource;
}

const STORAGE_KEY = "molino.context.v1";

const FALLBACK_CONTEXT: UserContext = {
  language: "es",
  currency: "USD",
  timezone: "UTC",
  locationSource: "default",
};

interface StoredContext {
  language?: Locale;
  country?: string;
  region?: string;
  locationSource?: Extract<LocationSource, "explicit" | "onboarding">;
}

function readStored(): StoredContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredContext) : null;
  } catch {
    return null;
  }
}

/**
 * Persiste una elección del usuario. `source` distingue una elección
 * explícita (ej. cambiar el país después, en settings) de la hecha durante
 * onboarding — ambas pisan cualquier detección automática.
 */
export function saveUserContext(
  partial: Pick<StoredContext, "language" | "country" | "region">,
  source: Extract<LocationSource, "explicit" | "onboarding">
): void {
  if (typeof window === "undefined") return;
  try {
    const current = readStored() ?? {};
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...current, ...partial, locationSource: source })
    );
  } catch {
    // localStorage puede fallar en modo privado — no es crítico, se pierde el override.
  }
}

export function clearUserContext(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/**
 * Idioma vía navigator.language — NO IP, NO geolocalización. Un usuario con
 * el navegador en portugués casi siempre está en un mercado pt-BR; es una
 * señal débil pero honesta y 100% client-side, sin llamada de red.
 */
export function detectBrowserLanguage(): Locale {
  if (typeof navigator === "undefined") return "es";
  const lang = (navigator.language || "").toLowerCase();
  if (lang.startsWith("pt")) return "pt-BR";
  if (lang.startsWith("en")) return "en";
  return "es";
}

export function detectBrowserTimezone(): string {
  if (typeof Intl === "undefined") return "UTC";
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Resuelve el contexto siguiendo la jerarquía. País NUNCA se adivina
 * automáticamente (a diferencia del idioma): una detección de país
 * equivocada por VPN/viaje es peor que no mostrar país — por eso "detected"
 * solo aporta idioma/timezone, y country solo llega vía explicit/onboarding.
 */
export function resolveUserContext(): UserContext {
  const stored = readStored();

  if (stored?.locationSource === "explicit") {
    return {
      ...FALLBACK_CONTEXT,
      language: stored.language ?? FALLBACK_CONTEXT.language,
      country: stored.country,
      region: stored.region,
      locationSource: "explicit",
    };
  }

  if (stored?.locationSource === "onboarding" && stored.country) {
    return {
      ...FALLBACK_CONTEXT,
      language: stored.language ?? detectBrowserLanguage(),
      country: stored.country,
      region: stored.region,
      timezone: detectBrowserTimezone(),
      locationSource: "onboarding",
    };
  }

  const language = detectBrowserLanguage();
  const timezone = detectBrowserTimezone();
  if (language !== "es" || timezone !== "UTC") {
    return { ...FALLBACK_CONTEXT, language, timezone, locationSource: "detected" };
  }

  return FALLBACK_CONTEXT;
}
