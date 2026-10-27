import "server-only";
import { getLocale, setRequestLocale } from "next-intl/server";
import { pickFor, serverContentDict, type Pick2 } from "./useL";
import "./content/server-dict";
import { isSiteLocale, routing, type SiteLocale } from "./routing";

/** Componentes de servidor async, generateMetadata, route handlers con locale. */
export async function getL(): Promise<Pick2> {
  return pickFor(await getLocale(), serverContentDict());
}

export async function getSiteLocale(): Promise<SiteLocale> {
  return (await getLocale()) === "en" ? "en" : "es";
}

/**
 * Llamar al principio de cada page/layout bajo app/[locale] que se renderiza
 * estático: le dice a next-intl el locale sin leer headers (que volvería
 * dinámica la ruta). Devuelve el locale ya validado.
 */
export async function initLocale(params: Promise<object>): Promise<SiteLocale> {
  const { locale } = (await params) as { locale?: string };
  const safe = isSiteLocale(locale) ? locale : routing.defaultLocale;
  setRequestLocale(safe);
  return safe;
}

/**
 * Para generateMetadata: el locale sale de los params (no de headers) y el
 * traductor trae el diccionario de contenido del servidor.
 */
export async function metaL(params: Promise<object>): Promise<Pick2> {
  return pickFor(await initLocale(params), serverContentDict());
}
