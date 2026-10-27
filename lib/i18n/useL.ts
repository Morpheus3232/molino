import * as React from "react";
import { useLocale } from "next-intl";
import type { SiteLocale } from "./routing";
import { makeTranslator, type ContentDict, type Translator } from "./translate";
import { useContentDict } from "./ContentDictProvider";

/**
 * Selector bilingüe: `L("Mi Mapa", "My Map")`. El español va primero porque
 * es el idioma maestro; el inglés es una transcreación, no una traducción
 * literal. Sirve para cualquier valor, no solo strings (arrays, objetos,
 * JSX).
 *
 * `L.t(valor)` traduce al mostrarlo un texto que viene de datos o de un
 * motor (ver lib/i18n/translate.ts); en español devuelve el valor tal cual.
 */
export type Pick2 = (<T>(es: T, en: T) => T) & Translator & { locale: SiteLocale };

export function pickFor(locale: string, dict?: ContentDict | null): Pick2 {
  const en = locale === "en";
  const tr = makeTranslator(en ? dict : null);
  const fn = (<T,>(es: T, enV: T) => (en ? enV : es)) as Pick2;
  fn.t = tr.t;
  fn.tx = tr.tx;
  fn.locale = en ? "en" : "es";
  return fn;
}

const R = React as unknown as { useContext?: unknown };

/** Diccionario en Server Components (lo registra lib/i18n/content/server-dict.ts). */
export function serverContentDict(): ContentDict | null {
  return (globalThis as { __MOLINO_CONTENT_DICT__?: ContentDict }).__MOLINO_CONTENT_DICT__ ?? null;
}

/** Componentes de cliente y de servidor no-async. */
export function useL(): Pick2 {
  const locale = useLocale();
  // En Server Components no hay contexto de React: el diccionario sale del
  // registro global del servidor. En el cliente (y su SSR), del provider.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dict = R.useContext ? useContentDict() : serverContentDict();
  return pickFor(locale, dict);
}

/** El locale actual, en componentes de cliente y de servidor no-async. */
export function useSiteLocale(): SiteLocale {
  return useLocale() === "en" ? "en" : "es";
}
