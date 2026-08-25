import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

function read(relPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, "..", relPath), "utf8");
}

// Regresión para la Fase 1 de la auditoría (2026-08-22): varios componentes de
// marketing afirmaban "0% almacenamiento" / "no se guardan datos" de forma
// absoluta, pero app/privacidad/PrivacidadContent.tsx documenta que Premium
// guarda un hash HMAC-SHA256 + estado de suscripción en base de datos, y que
// las interpretaciones de IA envían el perfil simbólico a un proveedor externo.
// Estos tests protegen contra que un claim absoluto vuelva a filtrarse.

describe("Claims de privacidad — consistencia con la arquitectura real", () => {
  test("PrivacidadContent sigue documentando la excepción Premium (fuente de verdad)", () => {
    const src = read("app/privacidad/PrivacidadContent.tsx");
    expect(src).toContain("hash HMAC-SHA256");
    expect(src).toContain("base de datos");
  });

  test("ClaritySection no promete '0% almacenamiento externo' sin calificar", () => {
    const src = read("components/sections/ClaritySection.tsx");
    expect(src).not.toContain("0% Almacenamiento externo");
    expect(src).not.toMatch(/sin bases de datos ni registro/i);
  });

  test("TrustMetrics no afirma '0 datos en el servidor' de forma absoluta", () => {
    const src = read("components/social/TrustMetrics.tsx");
    expect(src).not.toContain("No guardamos tus datos personales");
  });

  test("FAQ no afirma que nada se almacena en ninguna base de datos externa", () => {
    const src = read("components/sections/FAQ.tsx");
    expect(src).not.toMatch(
      /no se transmite ni se almacena en ninguna base de datos externa/i
    );
    // debe mencionar la excepción real (hash) en vez del absoluto
    expect(src.toLowerCase()).toContain("hash");
  });

  test("ProofSection no promete '0% almacenamiento en nube'", () => {
    const src = read("components/sections/ProofSection.tsx");
    expect(src).not.toContain("0% almacenamiento en nube");
  });

  test("Metadata de la homepage no promete 'sin datos guardados' de forma absoluta", () => {
    const src = read("app/page.tsx");
    expect(src).not.toContain("sin datos guardados");
  });

  test("El FAQPage JSON-LD embebido en la home no repite el claim absoluto (amplificado por Google)", () => {
    const src = read("app/page.tsx");
    expect(src).not.toMatch(
      /no se transmite ni se almacena en ninguna base de datos externa/i
    );
  });

  test("ClaritySection califica el claim '100% Local' con la excepción de Premium/IA", () => {
    const src = read("components/sections/ClaritySection.tsx");
    expect(src.toLowerCase()).toMatch(/hash|premium/);
  });

  test("TrustSignals no usa una promesa legal absoluta ('garantizada') sin matiz", () => {
    const src = read("components/social/TrustSignals.tsx");
    expect(src).not.toContain("Privacidad garantizada");
    // no debe afirmar 'sin telemetría de terceros' mientras se usa Vercel Web Analytics
    expect(src).not.toMatch(/sin telemetría de terceros/i);
  });
});
