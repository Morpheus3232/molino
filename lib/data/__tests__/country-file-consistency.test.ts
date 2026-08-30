import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Candado: una entidad archivada en el dataset de un país tiene que declarar
 * ese país.
 *
 * Existe porque Joan Manuel Serrat estaba en `artists-argentina.ts` con
 * `country: "Argentina"` y el nombre literal "Joan Manuel Serrat (argentino)".
 * Es catalán, nacido en Barcelona — la propia descripción lo admitía ("nace en
 * Barcelona pero es adoptado por Argentina").
 *
 * No es cosmético. Según CLAUDE.md el país del usuario ORDENA el mapa: van
 * primero hasta 3 entidades del país declarado en el onboarding. Un español
 * archivado en Argentina se le adelanta a los argentinos reales y desaparece
 * de la lista de quien declaró España. Corrompe la priorización local, que es
 * justamente lo que el país existe para hacer.
 *
 * El nombre del archivo es la intención declarada; el campo `country` es lo
 * que el motor usa. Cuando no coinciden, uno de los dos está mal.
 */

const DATA_DIR = path.resolve(__dirname, "..");

/** Sufijo de archivo → país que sus entidades deben declarar. */
const PAIS_POR_ARCHIVO: Record<string, string> = {
  argentina: "Argentina",
  espana: "España",
  chile: "Chile",
  peru: "Perú",
  mexico: "México",
  colombia: "Colombia",
  uruguay: "Uruguay",
  brasil: "Brasil",
};

/** Archivos con mezcla deliberada de países. Con motivo, o no es excepción. */
const EXCEPCIONES: Record<string, string> = {};

function paisDelArchivo(nombre: string): string | null {
  const base = nombre.replace(/\.ts$/, "").toLowerCase();
  for (const [clave, pais] of Object.entries(PAIS_POR_ARCHIVO)) {
    // "artists-argentina", "cities-argentina-completo", "atlas/espana"
    if (new RegExp(`(^|[-/])${clave}($|[-.])`).test(base)) return pais;
  }
  return null;
}

function archivosDePais(): Array<{ rel: string; pais: string }> {
  const out: Array<{ rel: string; pais: string }> = [];
  const dirs = ["", "atlas"];
  for (const d of dirs) {
    const abs = path.join(DATA_DIR, d);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (!f.endsWith(".ts")) continue;
      const rel = d ? `${d}/${f}` : f;
      const pais = paisDelArchivo(rel);
      if (pais) out.push({ rel, pais });
    }
  }
  return out;
}

describe("país declarado vs. dataset donde vive la entidad", () => {
  const archivos = archivosDePais();

  test("se encontraron datasets por país para revisar", () => {
    expect(archivos.length).toBeGreaterThan(15);
  });

  const desviados = archivos.flatMap(({ rel, pais }) => {
    if (EXCEPCIONES[rel]) return [];
    const src = fs.readFileSync(path.join(DATA_DIR, rel), "utf8");
    const entidades = [...src.matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)"[\s\S]{0,220}?country:\s*"([^"]+)"/g)];
    return entidades
      .filter(([, , , declarado]) => declarado !== pais)
      .map(([, id, name, declarado]) => ({ rel, id, name, pais, declarado }));
  });

  test("ninguna entidad declara un país distinto al de su dataset", () => {
    const detalle = desviados
      .map((d) => `  ${d.rel}: "${d.name}" declara ${d.declarado}, pero el archivo es de ${d.pais}`)
      .join("\n");
    expect(
      desviados,
      `Estas entidades están archivadas en el dataset de un país pero declaran ` +
        `otro:\n${detalle}\n\nEl país ordena el Mapa Personal (hasta 3 entidades ` +
        `locales primero), así que una entidad en el país equivocado se le ` +
        `adelanta a las correctas y se le esconde a quien sí es de su país. ` +
        `Movela al dataset que corresponde o corregí su campo country.`
    ).toEqual([]);
  });

  test("ninguna entidad lleva la nacionalidad pegada al nombre", () => {
    // "Joan Manuel Serrat (argentino)" era el síntoma visible de la entidad
    // archivada en el país equivocado: si hace falta aclarar la nacionalidad
    // en el nombre, el campo country probablemente esté mal.
    const conNacionalidad = archivos.flatMap(({ rel }) => {
      const src = fs.readFileSync(path.join(DATA_DIR, rel), "utf8");
      return [...src.matchAll(/name:\s*"([^"]*\((?:argentin|español|espanol|chilen|mexican|uruguay|colombian|peruan|brasile)[^)]*\))"/gi)]
        .map((m) => `${rel}: ${m[1]}`);
    });
    expect(conNacionalidad).toEqual([]);
  });
});
