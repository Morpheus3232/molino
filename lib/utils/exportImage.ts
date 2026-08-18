/**
 * Shared high-quality PNG export for shareable profile/map assets.
 *
 * Centralizes the html-to-image call so every export surface (profile map,
 * couple card, affinity card) renders at the same high pixel density. The
 * heavy `html-to-image` module is imported lazily inside the function — it is
 * never in the initial client bundle, only pulled in when an export actually
 * runs (onClick).
 */

export type ExportSize = "og" | "square" | "story";

export interface ExportDimensions {
  width: number;
  height: number;
  pixelRatio: number;
}

export function exportDimensions(format: ExportSize = "og"): ExportDimensions {
  if (format === "square") return { width: 1080, height: 1080, pixelRatio: 2 };
  if (format === "story") return { width: 1080, height: 1920, pixelRatio: 2 };
  return { width: 1200, height: 630, pixelRatio: 2 };
}

/**
 * Render an HTML node to a PNG data URL at the given quality/size.
 * `pixelRatio` > 1 produces crisp output on high-DPI screens and social
 * feeds (the browser downscales for display, so the shareable asset stays
 * sharp).
 */
export async function nodeToPng(
  node: HTMLElement,
  format: ExportSize = "og",
): Promise<string> {
  const { toPng } = await import("html-to-image");
  const { width, height, pixelRatio } = exportDimensions(format);
  return toPng(node, {
    quality: 1,
    pixelRatio,
    cacheBust: true,
    backgroundColor: "#09090D",
    width,
    height,
  });
}

/**
 * Convert a data URL to a Blob without `fetch()` — the CSP `connect-src`
 * directive (next.config.js) doesn't allow the `data:` scheme, so
 * `fetch(dataUrl)` throws "Failed to fetch" in Chrome even though the
 * conversion never leaves the browser. Decoding the base64 payload directly
 * has no network dependency and works regardless of CSP.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Sanitize a profile name into a safe filename fragment (used for the
 * File name attached to a native share, not for a local download). */
export function sanitizeFilenamePart(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}