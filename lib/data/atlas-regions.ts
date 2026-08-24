/**
 * Editorial region groupings for the Atlas Personal fallback engine
 * (getPersonalAtlas in atlas-queries.ts). NOT a geodata source — a small
 * hand-maintained map from ISO country code to the region(s) it belongs to,
 * used only to widen search when a country has insufficient local coverage.
 * A country may belong to more than one region (e.g. México); the fallback
 * engine uses the UNION of all of a country's regions, never a single pick.
 */

export type AtlasRegion = "LATAM" | "EUROPA" | "NORTEAMERICA";

const REGION_COUNTRIES: Record<AtlasRegion, string[]> = {
  LATAM: ["AR", "UY", "CL", "PE", "BO", "PY", "BR", "MX", "CO", "EC", "VE"],
  EUROPA: ["ES", "PT", "FR", "IT", "DE", "GB"],
  NORTEAMERICA: ["US", "CA", "MX"],
};

/** Regions a given ISO country code belongs to (can be more than one). */
export function getRegionsForCountry(countryISO: string): AtlasRegion[] {
  return (Object.keys(REGION_COUNTRIES) as AtlasRegion[]).filter((region) =>
    REGION_COUNTRIES[region].includes(countryISO)
  );
}

/**
 * Union of ISO codes for every region a country belongs to, excluding the
 * country itself. Empty array if the country isn't in any region.
 */
export function getRegionCountryISOs(countryISO: string): string[] {
  const isos = new Set<string>();
  for (const region of getRegionsForCountry(countryISO)) {
    for (const iso of REGION_COUNTRIES[region]) {
      if (iso !== countryISO) isos.add(iso);
    }
  }
  return Array.from(isos);
}
