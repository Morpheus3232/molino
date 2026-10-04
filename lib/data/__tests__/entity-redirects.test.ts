import { test, expect } from "vitest";
import fs from "fs";
import path from "path";
import { ENTITY_ID_ALIASES, SYMBOLIC_ENTITIES, getAvailableTypes, getEntityById, type EntityType } from "../symbolic-entities";
import { getAllCountryISOs } from "../atlas-queries";

/**
 * Candado: cada id que el dedup descarta redirige (308, next.config.js) a la
 * ficha que sobrevivió. Esos ids fueron URL pública en algún momento y Google
 * los sigue pidiendo — 46 de los 140 404 de Search Console (2026-10-04).
 * También /atlas/XX de países sin página de atlas → su ficha de país (26 más).
 *
 * Si cambian los datos o el criterio del dedup, regenerá con:
 *   UPDATE_ENTITY_REDIRECTS=1 npx vitest run lib/data/__tests__/entity-redirects.test.ts
 */
const FILE = path.resolve(__dirname, "../entity-redirects.json");

function expected() {
  const published = new Set<EntityType>(getAvailableTypes());
  return Object.entries(ENTITY_ID_ALIASES)
    .filter(([oldId]) => !getEntityById(oldId)) // un id vivo nunca se redirige
    .map(([oldId, newId]) => ({ oldId, entity: getEntityById(newId)! }))
    .filter(({ entity }) => entity && published.has(entity.type as EntityType))
    .map(({ oldId, entity }) => ({
      source: `/affinity/${entity.type}/${oldId}`,
      destination: `/affinity/${entity.type}/${encodeURIComponent(entity.id)}`,
    }))
    .concat(atlasSinPagina())
    .sort((a, b) => a.source.localeCompare(b.source));
}

/** /atlas/XX de un país sin página de atlas (solo tiene su propia ficha) → esa ficha. */
function atlasSinPagina() {
  const conPagina = new Set(getAllCountryISOs());
  return SYMBOLIC_ENTITIES.filter((e) => e.type === "country" && e.countryISO && !conPagina.has(e.countryISO)).map((e) => ({
    source: `/atlas/${e.countryISO}`,
    destination: `/affinity/country/${encodeURIComponent(e.id)}`,
  }));
}

test("entity-redirects.json está al día con los ids que descarta el dedup", () => {
  const want = expected();
  if (process.env.UPDATE_ENTITY_REDIRECTS) fs.writeFileSync(FILE, JSON.stringify(want, null, 2) + "\n");
  expect(JSON.parse(fs.readFileSync(FILE, "utf8"))).toEqual(want);
});

test("cubre los ids viejos que Search Console reportó como 404", () => {
  const sources = new Set(expected().map((r) => r.source));
  for (const s of ["/atlas/PW", "/atlas/DZ", "/affinity/brand/auto-infiniti", "/affinity/country/country-islandia", "/affinity/city/bogota", "/affinity/artist/frida", "/affinity/brand/harley-autos"]) {
    expect(sources.has(s), s).toBe(true);
  }
});
