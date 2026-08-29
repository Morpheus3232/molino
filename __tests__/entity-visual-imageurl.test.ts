import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Candado: todo `<EntityVisual>` tiene que pasar `imageUrl`.
 *
 * Existe porque el bug apareció nueve veces seguidas. EntityVisual recibe
 * ocho props sueltas que salen todas del MISMO objeto entidad
 * (`name`, `emoji`, `type`, `category`, `visualType`, `countryISO`...), así
 * que olvidarse justo de `imageUrl` no rompe nada, no da error de tipos —es
 * opcional— y la entidad simplemente cae al ícono genérico. El resultado fue
 * que las imágenes se veían en Mi Mapa y en Lectura pero no en Afinidades, ni
 * en el Atlas, ni en Conexiones del mundo, y solo se detectaba mirando.
 *
 * Si agregás un `<EntityVisual>` nuevo: pasale `imageUrl={x.imageUrl}`. Si
 * de verdad no corresponde, sumalo a EXCEPCIONES con el motivo.
 */

const ROOT = path.resolve(__dirname, "..");

/** Motivo por archivo. Sin motivo escrito, no es una excepción: es un olvido. */
const EXCEPCIONES: Record<string, string> = {
  "components/ui/__tests__/EntityVisual.test.tsx":
    "es el test del propio componente: prueba a propósito los casos sin imagen",
  "components/atlas/CountryHubClient.tsx":
    'usa visualType="flag" para ciudades, y las banderas son emoji nativo (rama 1 de EntityVisual), no imagen remota',
  "components/compatibility/CompatibilityContent.tsx":
    "usa el dataset legacy ENTITIES (lib/data/entities.ts), cuyo EntityProfile no tiene imageUrl — distinto del Atlas",
  "components/affinity/AffinityPreview.tsx":
    "componente muerto: ningún archivo lo importa. Candidato a borrar, no a arreglar",
};

function tsxFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) tsxFiles(rel, acc);
    else if (entry.name.endsWith(".tsx")) acc.push(rel);
  }
  return acc;
}

describe("EntityVisual — nadie se olvida de imageUrl", () => {
  const archivos = [...tsxFiles("app"), ...tsxFiles("components")];

  const sinImageUrl = archivos.flatMap((rel) => {
    const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
    const usos = src.match(/<EntityVisual\b[\s\S]*?\/>/g) ?? [];
    const faltan = usos.filter((u) => !u.includes("imageUrl")).length;
    return faltan ? [{ rel, faltan }] : [];
  });

  test("hay usos de EntityVisual para revisar", () => {
    const total = archivos.filter((rel) =>
      fs.readFileSync(path.join(ROOT, rel), "utf8").includes("<EntityVisual")
    ).length;
    expect(total).toBeGreaterThan(10);
  });

  test("todo <EntityVisual> pasa imageUrl, salvo excepciones documentadas", () => {
    const inesperados = sinImageUrl.filter((f) => !EXCEPCIONES[f.rel]);
    const detalle = inesperados
      .map((f) => `  ${f.rel}: ${f.faltan} uso(s) sin imageUrl`)
      .join("\n");
    expect(
      inesperados,
      `Estos <EntityVisual> no pasan imageUrl, así que muestran el ícono ` +
        `genérico en vez del logo/foto real:\n${detalle}\n\n` +
        `Pasá imageUrl={x.imageUrl}. Si no corresponde, agregá el archivo a ` +
        `EXCEPCIONES con el motivo.`
    ).toEqual([]);
  });

  test("las excepciones siguen existiendo (si no, sacalas de la lista)", () => {
    const fantasmas = Object.keys(EXCEPCIONES).filter(
      (rel) => !fs.existsSync(path.join(ROOT, rel))
    );
    expect(fantasmas).toEqual([]);
  });
});
