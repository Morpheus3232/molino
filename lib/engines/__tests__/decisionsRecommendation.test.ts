import { describe, it, expect } from "vitest";
import { analyzeDecision } from "../decisionsEngine";
import type { UserProfile } from "@/types/user";

// "Explora tus afinidades" (Intelligence) renderiza result.recommendation
// para las 6 categorías. Con timing/energía compartidos entre categorías
// (60% del score) y el texto por tier siendo puro category+score, la
// mayoría de los perfiles terminaban leyendo las mismas 6 frases sin
// importar quiénes fueran. El fix agrega la afinidad elemento↔categoría
// (ya real, ya usada en el score) como texto visible — esto verifica que
// realmente varía por elemento y por categoría, no cosméticamente.
function profileWith(fields: Partial<UserProfile>): UserProfile {
  return {
    name: "",
    birthDate: "1990-06-15",
    birthPlace: "",
    goal: "life",
    interests: [],
    onboardingStep: 1,
    completedSections: [],
    theme: "light",
    language: "es",
    notifications: true,
    lifePath: 4,
    sunSign: "Géminis",
    sunSignInfo: { sign: "Géminis", element: "Aire", modality: "Mutable" },
    chineseZodiac: "Caballo",
    chineseZodiacInfo: { animal: "Caballo", element: "Metal" },
    element: "Fuego",
    modality: "Mutable",
    luckyNumber: 1,
    archetype: "El Constructor",
    archetypeInfo: {},
    cycles: { personalYear: 4, personalMonth: 1, personalDay: 1 },
    recommendations: { strengths: [], challenges: [], practices: [] },
    ...fields,
  };
}

describe("analyzeDecision — recommendation refleja el elemento real del perfil", () => {
  it("categoría con afinidad de elemento (career+Fuego) menciona el elemento; sin afinidad (relationships+Fuego) no lo menciona", () => {
    const withAffinity = analyzeDecision(profileWith({ element: "Fuego" }), "¿Cambio de trabajo?", "career");
    const withoutAffinity = analyzeDecision(profileWith({ element: "Fuego" }), "¿Nueva relación?", "relationships");

    expect(withAffinity.recommendation).toContain("afinidad natural");
    expect(withoutAffinity.recommendation).not.toContain("afinidad natural");
  });

  it("misma categoría, elementos distintos → recommendation distinto (no todos los perfiles leen lo mismo)", () => {
    const fuego = analyzeDecision(profileWith({ element: "Fuego" }), "¿Cambio de trabajo?", "career");
    const agua = analyzeDecision(profileWith({ element: "Agua" }), "¿Cambio de trabajo?", "career");

    // Fuego tiene afinidad con "career" (CATEGORY_ELEMENT_AFFINITY.career = [Fuego, Tierra]), Agua no.
    expect(fuego.recommendation).not.toBe(agua.recommendation);
  });

  it("nunca inventa afinidad: la frase solo aparece si el elemento realmente está en CATEGORY_ELEMENT_AFFINITY de esa categoría", () => {
    const agua = analyzeDecision(profileWith({ element: "Agua" }), "¿Cambio de trabajo?", "career");
    expect(agua.recommendation).not.toContain("afinidad natural");
  });

  it("elementInfluence ya no ignora la categoría: mismo elemento, categorías distintas → texto distinto", () => {
    const career = analyzeDecision(profileWith({ element: "Aire" }), "¿?", "career").elementInfluence;
    const relationships = analyzeDecision(profileWith({ element: "Aire" }), "¿?", "relationships").elementInfluence;
    expect(career).not.toBe(relationships);
  });

  it("los 4 elementos reciben una señal propia en elementInfluence, no solo los 2 de CATEGORY_ELEMENT_AFFINITY", () => {
    const elements = ["Fuego", "Tierra", "Aire", "Agua"] as const;
    const texts = elements.map(
      (element) => analyzeDecision(profileWith({ element }), "¿?", "career").elementInfluence
    );
    // Antes Aire/Agua (sin afinidad con "career") devolvían el mismo texto genérico
    // sin importar el elemento; ahora cada uno es único.
    expect(new Set(texts).size).toBe(elements.length);
  });

  it("nextSteps ya no depende solo del score bucket: misma pregunta/score, categoría distinta → pasos distintos", () => {
    const career = analyzeDecision(profileWith({ element: "Fuego" }), "¿?", "career").nextSteps;
    const health = analyzeDecision(profileWith({ element: "Fuego" }), "¿?", "health").nextSteps;
    expect(career).not.toEqual(health);
  });
});

describe("analyzeDecision — considerations distingue Life Path 1 de Life Path 8", () => {
  it("LP1 y LP8 ya no comparten el mismo texto de consideración pese a agruparse antes como 'liderazgo'", () => {
    const lp1 = analyzeDecision(profileWith({ lifePath: 1 }), "¿?", "career").considerations;
    const lp8 = analyzeDecision(profileWith({ lifePath: 8 }), "¿?", "career").considerations;
    expect(lp1[0]).not.toBe(lp8[0]);
  });

  it("el texto de cada Life Path referencia su rasgo real (independencia para LP1, estrategia/ambición para LP8)", () => {
    const lp1 = analyzeDecision(profileWith({ lifePath: 1 }), "¿?", "career").considerations[0];
    const lp8 = analyzeDecision(profileWith({ lifePath: 8 }), "¿?", "career").considerations[0];
    expect(lp1).toContain("independiente");
    expect(lp8).toContain("estratégica");
  });
});
