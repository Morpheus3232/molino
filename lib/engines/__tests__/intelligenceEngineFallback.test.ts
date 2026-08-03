import { describe, it, expect } from "vitest";
import { generateFallbackInterpretation, type MolinoContext } from "../intelligenceEngine";

// Minimal MolinoContext fixture — only the fields generateFallbackInterpretation
// actually reads for the "personal_profile" branch.
function contextWith(fields: {
  name?: string;
  lifePath?: number;
  archetype?: string;
  sunSign?: string;
  element?: string;
  chineseZodiac?: string;
  personalYear?: number;
  personalDay?: number;
  archetypeChallenges?: string[];
  archetypeStrengths?: string[];
}): MolinoContext {
  const {
    name = "",
    lifePath = 1,
    archetype = "El Líder",
    sunSign = "Capricornio",
    element = "Tierra",
    chineseZodiac = "Caballo",
    personalYear = 1,
    personalDay = 1,
    archetypeChallenges = [],
    archetypeStrengths = [],
  } = fields;

  return {
    userProfile: {
      name,
      lifePath,
      archetype,
      sunSign,
      element,
      modality: "Cardinal",
      chineseZodiac,
      chineseElement: "Metal",
      personalYear,
      personalMonth: 1,
      personalDay,
    },
    numerology: {
      lifePath,
      archetype,
      archetypeDescription: `Descripción de ${archetype}`,
      archetypeChallenges,
      archetypeStrengths,
    },
    astrology: { sunSign, element, modality: "Cardinal", symbol: "" },
    chineseZodiac: { animal: chineseZodiac, element: "Metal" },
    cycles: { personalYear, personalMonth: 1, personalDay },
  };
}

const OLD_GENERIC_TENSION = "Las diferencias son oportunidades de crecimiento.";

describe("generateFallbackInterpretation — personal_profile no debe ser genérico", () => {
  it("nunca devuelve la tensión fija anterior, sin importar el perfil", () => {
    const profiles = [
      contextWith({ lifePath: 1, element: "Fuego", chineseZodiac: "Rata" }),
      contextWith({ lifePath: 8, element: "Metal", chineseZodiac: "Dragón" }),
      contextWith({ lifePath: 4, element: "Tierra", chineseZodiac: "Buey" }),
      contextWith({ lifePath: 9, element: "Agua", chineseZodiac: "Serpiente" }),
    ];

    for (const context of profiles) {
      const result = generateFallbackInterpretation({ type: "personal_profile", context });
      expect(result.tensions).not.toContain(OLD_GENERIC_TENSION);
    }
  });

  it("usa el challenge real del arquetipo cuando está disponible, no un fallback genérico", () => {
    const context = contextWith({ archetypeChallenges: ["Impaciencia"] });
    const result = generateFallbackInterpretation({ type: "personal_profile", context });
    expect(result.tensions.join(" ")).toMatch(/impaciencia/i);
  });

  it("perfiles con lifePath/elemento/animal distintos producen howYouOperate distinto", () => {
    const a = generateFallbackInterpretation({
      type: "personal_profile",
      context: contextWith({ lifePath: 1, element: "Fuego" }),
    });
    const b = generateFallbackInterpretation({
      type: "personal_profile",
      context: contextWith({ lifePath: 7, element: "Agua" }),
    });
    expect(a.howYouOperate).toBeDefined();
    expect(b.howYouOperate).toBeDefined();
    expect(a.howYouOperate).not.toBe(b.howYouOperate);
  });

  it("relationalNote usa datos reales de animalRelations, no texto inventado por usuario", () => {
    const context = contextWith({ chineseZodiac: "Rata" });
    const result = generateFallbackInterpretation({ type: "personal_profile", context });
    expect(result.relationalNote).toBeDefined();
    // Rata's real Liu He partner / triad friends per lib/data/animalRelations.ts
    expect(result.relationalNote).toMatch(/Dragón|Mono|Buey/);
  });

  it("closingSynthesis y opening varían por perfil (no son plantillas fijas repetidas)", () => {
    const a = generateFallbackInterpretation({
      type: "personal_profile",
      context: contextWith({ lifePath: 1, archetype: "El Líder", personalYear: 3 }),
    });
    const b = generateFallbackInterpretation({
      type: "personal_profile",
      context: contextWith({ lifePath: 2, archetype: "El Diplomático", personalYear: 7 }),
    });
    expect(a.closingSynthesis).not.toBe(b.closingSynthesis);
    expect(a.opening).not.toBe(b.opening);
  });

  it("closingSynthesis es un contraste corto y compartible, no un resumen de otras secciones", () => {
    const context = contextWith({ lifePath: 8, chineseZodiac: "Dragón", archetypeChallenges: ["Materialismo"] });
    const result = generateFallbackInterpretation({ type: "personal_profile", context });
    expect(result.closingSynthesis).toMatch(/^Dragón × Life Path 8:/);
    expect(result.closingSynthesis).toMatch(/cuando podés elegir.*cuando no\.?$/);
    expect(result.closingSynthesis).toMatch(/materialismo/i);
    expect(result.closingSynthesis!.length).toBeLessThan(140);
    // No debe ser literalmente la misma oración que suggestedNextStep u opening
    expect(result.closingSynthesis).not.toBe(result.suggestedNextStep);
    expect(result.closingSynthesis).not.toBe(result.opening);
  });

  it("es determinista: mismo contexto produce el mismo resultado", () => {
    const context = contextWith({ lifePath: 5, element: "Aire", chineseZodiac: "Mono" });
    const r1 = generateFallbackInterpretation({ type: "personal_profile", context });
    const r2 = generateFallbackInterpretation({ type: "personal_profile", context });
    expect(r1).toEqual(r2);
  });

  it("corePattern, cuando presente, nunca declara las mismas dos fuentes como convergencia (anti-fabricación)", () => {
    const context = contextWith({ lifePath: 3, chineseZodiac: "Cabra" });
    const result = generateFallbackInterpretation({ type: "personal_profile", context });
    if (result.corePattern) {
      const sources = result.corePattern.source.split(" + ");
      expect(new Set(sources).size).toBe(sources.length);
    }
  });

  it("'Qué significa' (alignment) nunca repite literalmente 'Tu patrón central' (corePattern.whyItMatters)", () => {
    const profiles = [
      contextWith({ lifePath: 1, element: "Fuego", chineseZodiac: "Rata" }),
      contextWith({ lifePath: 4, element: "Tierra", chineseZodiac: "Buey" }),
      contextWith({ lifePath: 9, element: "Agua", chineseZodiac: "Serpiente" }),
    ];
    for (const context of profiles) {
      const result = generateFallbackInterpretation({ type: "personal_profile", context });
      if (result.corePattern) {
        expect(result.alignment).not.toBe(result.corePattern.whyItMatters);
      }
    }
  });

  it("'Fortalezas' explica (qué es, cómo aparece, cuándo es costo), no relabela archetype/elemento/signo", () => {
    const context = contextWith({ lifePath: 1, archetype: "El Líder", element: "Fuego", archetypeChallenges: ["Impaciencia"] });
    const result = generateFallbackInterpretation({ type: "personal_profile", context });
    expect(result.strengths).toHaveLength(3);
    // No debe ser la relabel plana ["El Líder", "Elemento Fuego", sunSign]
    expect(result.strengths).not.toEqual(["El Líder", "Elemento Fuego", "Capricornio"]);
    expect(result.strengths.join(" ")).toMatch(/impaciencia/i);
  });

  it("LP1 y LP8 (mismo grupo numerológico) producen howYouOperate y suggestedNextStep distintos, no solo cosméticamente", () => {
    const lp1 = generateFallbackInterpretation({
      type: "personal_profile",
      context: contextWith({ lifePath: 1, archetypeChallenges: ["Impaciencia"], archetypeStrengths: ["Iniciativa"] }),
    });
    const lp8 = generateFallbackInterpretation({
      type: "personal_profile",
      context: contextWith({ lifePath: 8, archetypeChallenges: ["Materialismo"], archetypeStrengths: ["Ambición"] }),
    });
    expect(lp1.howYouOperate).not.toBe(lp8.howYouOperate);
    expect(lp1.suggestedNextStep).not.toBe(lp8.suggestedNextStep);
    // El diferenciador real (challenge/strength propio) debe aparecer nombrado
    expect(lp1.howYouOperate).toMatch(/impaciencia/i);
    expect(lp8.howYouOperate).toMatch(/materialismo/i);
    // Regresión: "materialismo" es masculino — nunca debe ir precedido de
    // artículo/demostrativo femenino ("la materialismo", "esa materialismo").
    expect(lp8.howYouOperate).not.toMatch(/\b(la|esa)\s+materialismo\b/i);
  });

  it("LP9, LP11, LP22 y LP33 (mismo grupo) también se diferencian entre sí", () => {
    const variants = [9, 11, 22, 33].map(lifePath =>
      generateFallbackInterpretation({
        type: "personal_profile",
        context: contextWith({
          lifePath,
          archetypeChallenges: [`Challenge${lifePath}`],
          archetypeStrengths: [`Strength${lifePath}`],
        }),
      })
    );
    const howYouOperateTexts = new Set(variants.map(v => v.howYouOperate));
    const nextStepTexts = new Set(variants.map(v => v.suggestedNextStep));
    expect(howYouOperateTexts.size).toBe(4);
    expect(nextStepTexts.size).toBe(4);
  });

  it("otros tipos (daily_energy) no reciben los campos narrativos nuevos", () => {
    const context = contextWith({});
    const result = generateFallbackInterpretation({ type: "daily_energy", context });
    expect(result.opening).toBeUndefined();
    expect(result.corePattern).toBeUndefined();
    expect(result.howYouOperate).toBeUndefined();
    expect(result.relationalNote).toBeUndefined();
    expect(result.closingSynthesis).toBeUndefined();
  });
});
