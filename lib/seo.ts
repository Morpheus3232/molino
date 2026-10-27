import type { Metadata } from "next";
import type { SiteLocale } from "@/lib/i18n/routing";

export const SITE_URL = "https://www.molino.app";
// Nombre de marca eliminado de la superficie visible del sitio por decisión
// de producto. El dominio queda como identificador técnico (JSON-LD, OG).
export const SITE_NAME = "molino.app";
export const SITE_DESCRIPTION =
  "Tu mapa personal de autoconocimiento. Pitagórica, astrología y zodiaco chino — gratis, sin registro, 100% local.";
export const OG_IMAGE = "/og-image.svg";

export function siteUrl(path: string = ""): string {
  if (path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Ruta con prefijo de idioma: "/hoy" → "/en/hoy" en inglés, "/hoy" en español. */
export function localePath(path: string, locale: SiteLocale = "es"): string {
  const clean = path === "" || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return `/en${clean}`;
  return clean || "/";
}

/** URL absoluta en el idioma pedido. */
export function localeUrl(path: string, locale: SiteLocale = "es"): string {
  const p = localePath(path, locale);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

/** hreflang es/en/x-default para una ruta que existe en los dos idiomas. */
export function languageAlternates(path: string): Record<string, string> {
  return {
    "es": localeUrl(path, "es"),
    "en": localeUrl(path, "en"),
    "x-default": localeUrl(path, "es"),
  };
}

/** canonical del idioma actual + hreflang de los dos, para metadata ya traducida. */
export function localeAlternates(path: string, locale: SiteLocale = "es") {
  return { canonical: localeUrl(path, locale), languages: languageAlternates(path) };
}

export const OG_LOCALE: Record<SiteLocale, string> = { es: "es_419", en: "en_US" };

/** Texto bilingüe: [español, inglés]. */
export type Bi = readonly [es: string, en: string];
type MaybeBi = string | Bi;
const pickBi = (v: MaybeBi | undefined, locale: SiteLocale): string | undefined =>
  v === undefined ? undefined : typeof v === "string" ? v : locale === "en" ? v[1] : v[0];
const hasEnglish = (v: MaybeBi | undefined) => v !== undefined && typeof v !== "string";

type RouteMetaInput = Omit<Parameters<typeof createRouteMetadata>[0], "title" | "description" | "ogTitle" | "ogDescription" | "locale" | "translated"> & {
  title: MaybeBi;
  description?: MaybeBi;
  ogTitle?: MaybeBi;
  ogDescription?: MaybeBi;
};

/**
 * `export const generateMetadata = metadataFor({ title: ["Hoy", "Today"], ... })`.
 * Reemplaza a `export const metadata = createRouteMetadata(...)` en páginas
 * bajo app/[locale]. Si el título no trae versión en inglés, la página en
 * /en se marca noindex: mejor no indexar que indexar una página en español
 * bajo una URL en inglés.
 */
export function metadataFor(input: RouteMetaInput) {
  return async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
    const { locale: raw } = await params;
    const locale: SiteLocale = raw === "en" ? "en" : "es";
    return createRouteMetadata({
      ...input,
      locale,
      translated: hasEnglish(input.title),
      title: pickBi(input.title, locale)!,
      description: pickBi(input.description, locale),
      ogTitle: pickBi(input.ogTitle, locale),
      ogDescription: pickBi(input.ogDescription, locale),
    });
  };
}

export function formatTitle(title: string): string {
  if (!title) return "Mapa Personal de Autoconocimiento";
  return title;
}

export function createRouteMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  noIndex = false,
  noFollow = false,
  image = OG_IMAGE,
  ogTitle,
  ogDescription,
  locale = "es",
  translated = false,
}: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  /** Solo tiene efecto junto a noIndex: true — rutas indexables siempre son follow. */
  noFollow?: boolean;
  image?: string;
  /** Copy de OG/Twitter cuando difiere del title/description de la página (p.ej. variantes con "—" en vez de "|"). */
  ogTitle?: string;
  ogDescription?: string;
  /** Idioma de la página. En inglés la canónica lleva /en. */
  locale?: SiteLocale;
  /** false → la versión /en todavía está en español: noindex y sin hreflang. */
  translated?: boolean;
}): Metadata {
  const fullTitle = formatTitle(title);
  const canonicalUrl = localeUrl(path, locale);
  if (locale === "en" && !translated) noIndex = true;
  const socialTitle = ogTitle ?? fullTitle;
  const socialDescription = ogDescription ?? description;

  return {
    // { absolute } (no un string plano) le dice a Next.js que NO aplique
    // el title.template de ningún layout ancestro sobre este título — sin
    // esto, fullTitle quedaría envuelto una segunda vez por el template
    // del layout padre, duplicando el sufijo de marca.
    title: { absolute: fullTitle },
    description,
    alternates: noIndex
      ? undefined
      : translated
        ? { canonical: canonicalUrl, languages: languageAlternates(path) }
        : { canonical: canonicalUrl },
    robots: noIndex
      ? { index: false, follow: !noFollow }
      : { index: true, follow: true },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: image }],
      locale: OG_LOCALE[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
    },
  };
}
