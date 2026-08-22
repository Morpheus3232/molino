import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

function read(relPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, "..", relPath), "utf8");
}

// Regresión Fase 6A (P0, 2026-08-22): el hub de numerología y la propia
// página de detalle linkeaban a /conocimiento/numerologia/numero-N, pero la
// ruta real (confirmada por generateMetadata/canonical/sitemap.ts) es
// /conocimiento/numerologia/N — parseInt("numero-3") da NaN, 404 funcional
// en el clúster con más tracción real de Search Console.

const FILES_WITH_NUMERO_LINKS = [
  "app/conocimiento/numerologia/NumerologiaContent.tsx",
  "app/conocimiento/numerologia/[numero]/NumeroContent.tsx",
];

describe("Links internos de /conocimiento/numerologia/[numero]", () => {
  test.each(FILES_WITH_NUMERO_LINKS)("%s no linkea al patrón roto numero-${...}", (relPath) => {
    const src = read(relPath);
    expect(src).not.toMatch(/numerologia\/numero-\$\{/);
  });

  test("el canonical de la página de detalle usa el mismo formato sin prefijo", () => {
    const src = read("app/conocimiento/numerologia/[numero]/page.tsx");
    expect(src).toContain("`/conocimiento/numerologia/${num.number}`");
  });

  test("sitemap.ts usa el mismo formato", () => {
    const src = read("app/sitemap.ts");
    expect(src).toMatch(/conocimiento\/numerologia\/\$\{num\.number\}/);
  });
});
