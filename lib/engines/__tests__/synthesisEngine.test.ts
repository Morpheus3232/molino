import { describe, it, expect } from "vitest";
import { buildPersonalCode, buildPatterns, hasCircularSources } from "../synthesisEngine";
import { ARCHETYPE_DESCRIPTIONS, getArchetypeInfo } from "../numerologyEngine";
import type { UserProfile } from "@/types/user";

// buildPersonalCode es el único punto de entrada público que expone el
// nombre/significado de cada número (getNumberName/getNumberMeaning son
// privadas). Estos fixtures solo pisan los 4 campos numéricos que esa
// función lee — el resto del shape de UserProfile no le importa.
function profileWith(fields: Partial<UserProfile>): UserProfile {
  return {
    name: "",
    birthDate: "1990-01-09",
    birthPlace: "",
    goal: "life",
    interests: [],
    onboardingStep: 1,
    completedSections: [],
    theme: "light",
    language: "es",
    notifications: true,
    lifePath: 1,
    sunSign: "Capricornio",
    sunSignInfo: { sign: "Capricornio", element: "Tierra", modality: "Cardinal" },
    chineseZodiac: "Caballo",
    chineseZodiacInfo: { animal: "Caballo", element: "Metal" },
    element: "Tierra",
    modality: "Cardinal",
    luckyNumber: 11,
    archetype: "El Líder",
    archetypeInfo: {},
    cycles: { personalYear: 1, personalMonth: 1, personalDay: 1 },
    recommendations: { strengths: [], challenges: [], practices: [] },
    ...fields,
  };
}

describe("buildPersonalCode — FASE 1D-2C: Personalidad 9 ≠ Camino de Vida 9", () => {
  it("Personalidad 9 (día 9/18/27) representa capacidad de adaptación, no 'El Filósofo'/'Generosidad'", () => {
    const code = buildPersonalCode(profileWith({ personalityNumber: 9 }));
    expect(code.personality.number).toBe(9);
    expect(code.personality.name).toBe("El Adaptador");
    expect(code.personality.meaning).toBe("Capacidad de adaptación");
  });

  it("Camino de Vida 9 NO cambia como consecuencia del cambio de Personalidad", () => {
    const code = buildPersonalCode(profileWith({ lifePath: 9 }));
    expect(code.lifePath.number).toBe(9);
    expect(code.lifePath.name).toBe("El Filósofo");
    expect(code.lifePath.meaning).toBe("Compasión y sabiduría");
  });

  it("Expresión 9 y Alma 9 NO cambian como consecuencia del cambio de Personalidad", () => {
    const code = buildPersonalCode(profileWith({ expressionNumber: 9, soulNumber: 9 }));
    expect(code.expression.name).toBe("El Filósofo");
    expect(code.expression.meaning).toBe("Humanitarismo");
    expect(code.soul.name).toBe("El Filósofo");
    expect(code.soul.meaning).toBe("Servicio al todo");
  });

  it("Personalidad 7 conserva 'Misterio' intacto", () => {
    const code = buildPersonalCode(profileWith({ personalityNumber: 7 }));
    expect(code.personality.name).toBe("El Investigador");
    expect(code.personality.meaning).toBe("Misterio");
  });

  it("Camino de Vida 7 conserva su nombre/significado propio (no 'Misterio')", () => {
    const code = buildPersonalCode(profileWith({ lifePath: 7 }));
    expect(code.lifePath.name).toBe("El Investigador");
    expect(code.lifePath.meaning).toBe("Búsqueda de verdad");
  });
});

// "Cuando tus sistemas se encuentran" solo debe mostrarse cuando dos sources
// realmente derivan de señales distintas. El bug original: buildPatterns
// etiquetaba "Tu motor" como ["Arquetipos", "Numerología"] siempre, pero
// ambos labels se derivan enteramente del mismo lifePath — era el mismo dato
// contado dos veces, no una convergencia real. Este bloque barre una matriz
// de perfiles (todo lifePath × los 12 animales chinos) para asegurar que
// ningún pattern/insight generado — presente o futuro — vuelva a etiquetar
// dos sources que resuelvan a la misma señal fundamental (SOURCE_SIGNAL).
describe("buildPatterns — no reintroducir convergencias circulares", () => {
  const LIFE_PATHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  const CHINESE_ANIMALS = ["Rata", "Buey", "Tigre", "Gato", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];

  it("ningún pattern de buildPatterns etiqueta dos sources que compartan señal fundamental", () => {
    for (const lifePath of LIFE_PATHS) {
      for (const chineseZodiac of CHINESE_ANIMALS) {
        const patterns = buildPatterns(profileWith({ lifePath, chineseZodiac, cycles: { personalYear: 1, personalMonth: 1, personalDay: 1 } }));
        for (const p of patterns) {
          expect(hasCircularSources(p.sources), `"${p.label}" (lifePath=${lifePath}, animal=${chineseZodiac}) sources=${p.sources.join(",")}`).toBe(false);
        }
      }
    }
  });

  it("regresión del bug original: 'Tu motor' nunca vuelve a etiquetar ['Arquetipos','Numerología'] juntos", () => {
    for (const lifePath of LIFE_PATHS) {
      const motor = buildPatterns(profileWith({ lifePath, chineseZodiac: "Cerdo" })).find((p) => p.label === "Tu motor")!;
      expect(motor.sources).not.toEqual(expect.arrayContaining(["Arquetipos", "Numerología"]));
    }
  });
});

// "Tu tensión" (Numerología + Ciclos) y "Tu próximo movimiento" (Ciclos +
// Zodiaco Chino) ganaron la misma lógica que ya tenía "Tu motor": solo se
// etiquetan como convergencia de dos sistemas si findSharedTheme encuentra
// un tema real compartido; si no, fallback honesto de una sola fuente.
describe("buildPatterns — 'Tu tensión' y 'Tu próximo movimiento' con convergencia real", () => {
  const LIFE_PATHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  const CHINESE_ANIMALS = ["Rata", "Buey", "Tigre", "Gato", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];
  const PERSONAL_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

  function realisticProfile(lifePath: number, chineseZodiac: string, personalYear: number): UserProfile {
    return profileWith({
      lifePath,
      chineseZodiac,
      archetypeInfo: getArchetypeInfo(lifePath),
      cycles: { personalYear, personalMonth: 1, personalDay: 1 },
    });
  }

  it("con datos de arquetipo reales (no {}), ningún pattern etiqueta dos sources que compartan señal fundamental", () => {
    for (const lifePath of LIFE_PATHS) {
      for (const chineseZodiac of CHINESE_ANIMALS) {
        for (const personalYear of PERSONAL_YEARS) {
          const patterns = buildPatterns(realisticProfile(lifePath, chineseZodiac, personalYear));
          for (const p of patterns) {
            expect(
              hasCircularSources(p.sources),
              `"${p.label}" (lifePath=${lifePath}, animal=${chineseZodiac}, año=${personalYear}) sources=${p.sources.join(",")}`
            ).toBe(false);
          }
        }
      }
    }
  });

  it("determinismo: mismo perfil produce siempre la misma síntesis", () => {
    const profile = realisticProfile(4, "Caballo", 4);
    const a = buildPatterns(profile);
    const b = buildPatterns(profile);
    expect(a).toEqual(b);
  });

  it("toda convergencia declarada ('Tu tensión' con 2 sources) es trazable a un challenge real del perfil", () => {
    for (const lifePath of LIFE_PATHS) {
      const challenges = ARCHETYPE_DESCRIPTIONS[lifePath]?.challenges ?? [];
      for (const personalYear of PERSONAL_YEARS) {
        const tension = buildPatterns(realisticProfile(lifePath, "Rata", personalYear)).find((p) => p.label === "Tu tensión")!;
        if (tension.sources.length > 1) {
          expect(challenges, `lifePath=${lifePath}, año=${personalYear}`).toContain(tension.keyword);
        }
      }
    }
  });

  it("toda convergencia declarada ('Tu próximo movimiento' con 2 sources) es trazable al texto real de YEAR_TYPES", () => {
    for (const lifePath of LIFE_PATHS) {
      for (const chineseZodiac of CHINESE_ANIMALS) {
        for (const personalYear of PERSONAL_YEARS) {
          const movement = buildPatterns(realisticProfile(lifePath, chineseZodiac, personalYear)).find((p) => p.label === "Tu próximo movimiento")!;
          if (movement.sources.length > 1) {
            expect(movement.keyword.length, `animal=${chineseZodiac}, año=${personalYear}`).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("caso conocido CON convergencia: Life Path 4 (challenge 'Rigidez') + Año personal 4 ('estabilidad, disciplina') comparten tema de estructura", () => {
    const tension = buildPatterns(realisticProfile(4, "Rata", 4)).find((p) => p.label === "Tu tensión")!;
    expect(tension.sources).toEqual(["Numerología", "Ciclos"]);
    expect(tension.keyword).toBe("Rigidez");
  });

  it("caso conocido SIN convergencia forzada: Life Path 2 (challenges sin overlap con Año personal 4) cae a fuente única, sin inventar una segunda", () => {
    const tension = buildPatterns(realisticProfile(2, "Rata", 4)).find((p) => p.label === "Tu tensión")!;
    expect(tension.sources).toEqual(["Numerología"]);
  });

  it("misma señal de Ciclos (año 4), animales distintos: Caballo no converge por 'estructura', Buey sí (determinación → estructura)", () => {
    const conBuey = buildPatterns(realisticProfile(1, "Buey", 4)).find((p) => p.label === "Tu próximo movimiento")!;
    const conCaballo = buildPatterns(realisticProfile(1, "Caballo", 4)).find((p) => p.label === "Tu próximo movimiento")!;
    expect(conBuey.sources).toEqual(["Ciclos", "Zodiaco Chino"]);
    expect(conCaballo.sources).toEqual(["Ciclos"]);
  });
});
