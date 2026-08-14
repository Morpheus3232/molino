import type { Metadata } from "next";

export const SITE_URL = "https://www.molino.app";
export const SITE_NAME = "Molino";
export const SITE_DESCRIPTION =
  "Tu mapa personal de autoconocimiento. Pitagórica, astrología y zodiaco chino — gratis, sin registro, 100% local.";
export const OG_IMAGE = "/og-image.png";

export function siteUrl(path: string = ""): string {
  if (path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatTitle(title: string): string {
  if (!title) return "Molino — Mapa Personal de Autoconocimiento";
  if (title.endsWith(" | Molino") || title.endsWith(" — Molino")) return title;
  return `${title} | Molino`;
}

export function createRouteMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  noIndex = false,
  image = OG_IMAGE,
}: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  image?: string;
}): Metadata {
  const fullTitle = formatTitle(title);
  const canonicalUrl = siteUrl(path);

  return {
    title: fullTitle,
    description,
    alternates: noIndex ? undefined : { canonical: canonicalUrl },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: image }],
      locale: "es_419",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
