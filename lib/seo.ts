export const SITE_URL = "https://www.molino.app";
export const SITE_NAME = "Molino";
export const SITE_DESCRIPTION =
  "Tu mapa personal de autoconocimiento. Pitagórica, astrología y zodiaco chino — gratis, sin registro, 100% local.";
export const OG_IMAGE = "/og-image.png";

export function siteUrl(path: string = ""): string {
  if (path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
