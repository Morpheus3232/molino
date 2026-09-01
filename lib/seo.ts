import type { Metadata } from "next";

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
}): Metadata {
  const fullTitle = formatTitle(title);
  const canonicalUrl = siteUrl(path);
  const socialTitle = ogTitle ?? fullTitle;
  const socialDescription = ogDescription ?? description;

  return {
    // { absolute } (no un string plano) le dice a Next.js que NO aplique
    // el title.template de ningún layout ancestro sobre este título — sin
    // esto, fullTitle quedaría envuelto una segunda vez por el template
    // del layout padre, duplicando el sufijo de marca.
    title: { absolute: fullTitle },
    description,
    alternates: noIndex ? undefined : { canonical: canonicalUrl },
    robots: noIndex
      ? { index: false, follow: !noFollow }
      : { index: true, follow: true },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: image }],
      locale: "es_419",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
    },
  };
}
