import { describe, it, expect } from "vitest";
import { generateFallbackInterpretation, buildIntelligencePrompt, type MolinoContext } from "../intelligenceEngine";

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

// El chat ("question") es la única superficie donde el usuario controla
// directamente el prompt (pregunta en lenguaje libre) — el fallback nunca
// debe fabricar una respuesta a esa pregunta sin IA, y el prompt real debe
// llevar las reglas de grounding explícitas (no inventar datos, distinguir
// dato/interpretación/recomendación, declinar lo fuera de alcance).
describe("generateFallbackInterpretation — 'question' nunca inventa una respuesta sin IA", () => {
  it("el summary reconoce que no pudo responder, no simula una respuesta a la pregunta", () => {
    const context = contextWith({ lifePath: 4, archetype: "El Cimiento", chineseZodiac: "Buey" });
    const result = generateFallbackInterpretation({
      type: "question",
      context,
      question: "¿Debería cambiar de trabajo este mes?",
    });
    expect(result.summary).toMatch(/no está disponible|no pudimos generar/i);
    expect(result.summary).not.toMatch(/deberías|te recomendamos cambiar/i);
  });

  it("igual expone los datos calculados reales del perfil (Life Path, archetype, animal) mientras espera la IA", () => {
    const context = contextWith({ lifePath: 7, archetype: "El Investigador", chineseZodiac: "Serpiente" });
    const result = generateFallbackInterpretation({ type: "question", context, question: "test" });
    expect(result.alignment).toMatch(/7/);
    expect(result.alignment).toMatch(/El Investigador/);
    expect(result.alignment).toMatch(/Serpiente/);
  });

  it("sin pregunta, el summary sigue siendo honesto (no genera un resumen genérico como si hubiera respondido algo)", () => {
    const context = contextWith({});
    const result = generateFallbackInterpretation({ type: "question", context });
    expect(result.summary).toMatch(/no pudimos generar/i);
  });
});

describe("buildIntelligencePrompt — 'question' lleva las reglas de grounding del chat", () => {
  const context = contextWith({ lifePath: 4, archetype: "El Cimiento", chineseZodiac: "Buey", element: "Tierra" });

  it("incluye la pregunta real del usuario en el prompt", () => {
    const prompt = buildIntelligencePrompt({ type: "question", context, question: "¿Es buen momento para mudarme?" });
    expect(prompt).toContain("¿Es buen momento para mudarme?");
  });

  it("instruye explícitamente distinguir dato calculado / interpretación simbólica / recomendación", () => {
    const prompt = buildIntelligencePrompt({ type: "question", context, question: "test" });
    expect(prompt).toMatch(/DATO CALCULADO/);
    expect(prompt).toMatch(/INTERPRETACIÓN SIMBÓLICA/);
    expect(prompt).toMatch(/RECOMENDACIÓN/);
  });

  it("instruye no inventar datos y declinar explícitamente lo que Molino no calcula", () => {
    const prompt = buildIntelligencePrompt({ type: "question", context, question: "test" });
    expect(prompt).toMatch(/nunca inventes|Nunca inventes/i);
    expect(prompt).toMatch(/médic|financier|legal/i);
  });

  it("incluye la conversación previa cuando existe, para preguntas de continuación", () => {
    const prompt = buildIntelligencePrompt({
      type: "question",
      context,
      question: "¿y si lo hago en marzo?",
      conversationHistory: [{ question: "¿Es buen momento para mudarme?", answer: "Tu ciclo actual favorece construir." }],
    });
    expect(prompt).toContain("¿Es buen momento para mudarme?");
    expect(prompt).toContain("Tu ciclo actual favorece construir.");
  });

  it("nunca declara un pattern/tension como convergencia de dos fuentes que resuelven a la misma señal", () => {
    // Barre lifePaths cuyo grupo SÍ tiene reclamo de ritmo (donde buildTensions
    // puede disparar) cruzado con elementos que lo contradicen — mismo chequeo
    // anti-circularidad que ya corre para buildPatterns, aplicado al prompt del chat.
    for (const lifePath of [1, 3, 4, 5, 7, 8]) {
      for (const element of ["Fuego", "Tierra", "Metal"]) {
        const prompt = buildIntelligencePrompt({
          type: "question",
          context: contextWith({ lifePath, element }),
          question: "test",
        });
        expect(prompt).not.toMatch(/Numerología \+ Numerología|Zodiaco Chino \+ Zodiaco Chino/);
      }
    }
  });
});
