/**
 * Las marcas se leen en tres listas: autos, ropa y el resto. La categoría la
 * trae cada registro; los datasets usan dos rótulos para cada familia.
 * Client-safe: solo strings, sin tocar el dataset.
 */

export type BrandListing = "autos" | "ropa" | "brand";

const AUTO_CATEGORIES = new Set(["autos", "Autos y Movilidad"]);
const ROPA_CATEGORIES = new Set(["ropa", "Ropa y Moda"]);

export function brandListingOf(category?: string): BrandListing {
  if (category && AUTO_CATEGORIES.has(category)) return "autos";
  if (category && ROPA_CATEGORIES.has(category)) return "ropa";
  return "brand";
}

/** Listado de /affinity al que pertenece una entidad (las marcas, según su familia). */
export function affinityListingOf(entity: { type: string; category?: string }): string {
  return entity.type === "brand" ? brandListingOf(entity.category) : entity.type;
}

export const BRAND_LISTINGS: Record<BrandListing, { label: string; plural: string; icon: string; description: string }> = {
  autos: { label: "Marca de autos", plural: "Marcas de autos", icon: "🚗", description: "Marcas automotrices, fechadas por su fundación" },
  ropa: { label: "Marca de ropa", plural: "Marcas de ropa", icon: "👕", description: "Marcas de indumentaria y calzado, fechadas por su fundación" },
  brand: { label: "Marca", plural: "Otras marcas", icon: "✦", description: "Tecnología, bebidas, bancos, aerolíneas y más" },
};
