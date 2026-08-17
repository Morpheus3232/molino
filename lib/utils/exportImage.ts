/**
 * Shared high-quality PNG export for shareable profile/map assets.
 *
 * Centralizes the html-to-image call so every export surface (profile map,
 * couple card, affinity card) renders at the same high pixel density. The
 * heavy `html-to-image` module is imported lazily inside the function — it is
 * never in the initial client bundle, only pulled in when an export actually
 * runs (onClick).
 */

export type ExportSize = "og" | "square";

export interface ExportDimensions {
  width: number;
  height: number;
  pixelRatio: number;
}

export function exportDimensions(format: ExportSize = "og"): ExportDimensions {
  return format === "square"
    ? { width: 1080, height: 1080, pixelRatio: 2 }
    : { width: 1200, height: 630, pixelRatio: 2 };
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