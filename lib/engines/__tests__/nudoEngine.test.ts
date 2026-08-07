import { describe, it, expect } from "vitest";
import { detectarNudo } from "../nudoEngine";
import { buildPatterns, buildTensions } from "../synthesisEngine";
import type { UserProfile } from "@/types/user";

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

describe("nudoEngine — detectarNudo", () => {
  it("free_text: el patrón estable NO alcanza solo — intelligenceEngine no expone un score, así que el contexto nunca puede confirmar fricción y el Nudo debe ser honesto: hasRealTension false", () => {
    // Life Path 1 (rápido) + elemento Tierra (lento) = contradicción de ritmo real en buildTensions,
    // pero free_text no tiene una señal escalar que la cruce con el contexto actual.
    const profile = profileWith({ lifePath: 1, element: "Tierra" });
    const result = detectarNudo({
      profile,
      context: "free_text",
      payload: {},
    });

    expect(result.trace.hasRealTension).toBe(false);
    expect(result.fuerzaA).toBe("");
    expect(result.fuerzaB).toBe("");
    expect(result.tension).toBe("");
    expect(result.preguntaLlave).toBe("");
    expect(result.trace.sources).toEqual([]);
  });

  it("devuelve hasRealTension: false cuando no hay contradicción real (Life Path 2 no tiene reclamo de ritmo)", () => {
    // Life Path 2 no tiene reclamo de ritmo → nunca declara tensión de ritmo
    const profile = profileWith({ lifePath: 2, element: "Fuego" });
    const result = detectarNudo({
      profile,
      context: "free_text",
      payload: {},
    });

    expect(result.trace.hasRealTension).toBe(false);
    expect(result.fuerzaA).toBe("");
    expect(result.fuerzaB).toBe("");
    expect(result.tension).toBe("");
    expect(result.preguntaLlave).toBe("");
    expect(result.trace.sources).toEqual([]);
  });

  it("devuelve hasRealTension: false cuando elemento es fluido (Aire/Agua)", () => {
    // Elemento fluido nunca contradice
    const profile = profileWith({ lifePath: 1, element: "Aire" });
    const result = detectarNudo({
      profile,
      context: "free_text",
      payload: {},
    });

    expect(result.trace.hasRealTension).toBe(false);
    expect(result.fuerzaA).toBe("");
    expect(result.fuerzaB).toBe("");
    expect(result.tension).toBe("");
    expect(result.preguntaLlave).toBe("");
  });

  it("NO detecta tensión cuando motor y tensión comparten el mismo tema (Life Path 4 + año 4)", () => {
    // Life Path 4 challenge "Rigidez" + motor "Práctico" → ambos mapean a "estructura"
    // Comparten tema → no es tensión real entre motor y tensión
    const profile = profileWith({
      lifePath: 4,
      chineseZodiac: "Buey", // Buey tiene "determinación" → estructura
      cycles: { personalYear: 4, personalMonth: 1, personalDay: 1 },
      archetypeInfo: { strengths: [], challenges: ["Rigidez"] },
    });

    const result = detectarNudo({
      profile,
      context: "free_text",
      payload: {},
    });

    // Motor y tensión comparten tema "estructura" → no hay tensión real entre ellos
    expect(result.trace.hasRealTension).toBe(false);
    expect(result.fuerzaA).toBe("");
    expect(result.fuerzaB).toBe("");
    expect(result.tension).toBe("");
    expect(result.preguntaLlave).toBe("");
  });

  it("trace siempre existe y tiene estructura correcta", () => {
    const profile = profileWith({ lifePath: 1, element: "Tierra" });
    const result = detectarNudo({
      profile,
      context: "free_text",
      payload: {},
    });

    expect(result.trace).toBeDefined();
    expect(typeof result.trace.hasRealTension).toBe("boolean");
    expect(Array.isArray(result.trace.sources)).toBe(true);
  });

  it("no fabrica tensión cuando motor y tensión comparten el mismo tema", () => {
    // Si motor y tensión tienen el mismo keyword, no hay tensión real entre ellos
    // Usamos elemento Aire (fluido) para que buildTensions no detecte contradicción de ritmo
    const profile = profileWith({
      lifePath: 3,
      element: "Aire", // fluido → no contradice
      chineseZodiac: "Mono", // Mono: ingenio, versatilidad, curiosidad → creatividad
      archetypeInfo: { strengths: [], challenges: ["Dispersión"] },
      cycles: { personalYear: 3, personalMonth: 1, personalDay: 1 },
    });

    const result = detectarNudo({
      profile,
      context: "free_text",
      payload: {},
    });

    // Dispersión y creatividad caen en el mismo tema → no es tensión real
    expect(result.trace.hasRealTension).toBe(false);
  });

  it("contexto decision con señal favorable: decisionsEngine no confirma fricción → el patrón estable solo no alcanza, hasRealTension false", () => {
    // Mismo perfil que antes producía siempre true sin importar el contexto.
    // Ahora decisionsEngine corre con una pregunta/categoría de rutina: su propio
    // score (>= 50, el punto neutro del engine) no confirma fricción, así que el
    // contexto no "modificó" la tensión y el resultado debe ser honesto: false.
    const profile = profileWith({ lifePath: 1, element: "Tierra" });
    const result = detectarNudo({
      profile,
      context: "decision",
      payload: { question: "¿Debo cambiar de trabajo?", category: "career" },
    });

    expect(result.trace.hasRealTension).toBe(false);
    expect(result.trace.sources).toEqual([]);
  });

  it("contexto timing con fricción real: timingEngine reporta un score bajo (< 50) para este perfil/fecha → el Nudo cruza patrón estable + contexto y es real", () => {
    // Life Path 1 (rápido) + Tierra (lento) = contradicción de ritmo real.
    // Con fecha fija 2023-01-07 + change_job → timingScore = 35 (< 50),
    // por debajo del umbral neutro del engine, así que el contexto sí
    // confirma la fricción y el Nudo debe ser real.
    const profile = profileWith({ lifePath: 1, element: "Tierra", birthDate: "1985-05-15" });
    const result = detectarNudo({
      profile,
      context: "timing",
      payload: { targetDate: new Date(2023, 0, 7, 12, 0, 0), intention: "change_job" },
    });

    expect(result.trace.hasRealTension).toBe(true);
    expect(result.fuerzaA).not.toBe("");
    expect(result.fuerzaB).not.toBe("");
    expect(result.preguntaLlave).not.toBe("");
    expect(result.trace.sources).toContain("Numerología");
    expect(result.trace.sources).toContain("Astrología");
    expect(result.trace.sources).toContain("timingEngine");
  });

  it("contexto daily_energy con fricción real: dailyEnergyEngine reporta un score bajo para este perfil/fecha → el Nudo cruza patrón estable + contexto y es real", () => {
    // Life Path 3 (rápido) + Tierra (lento) = contradicción de ritmo real.
    // Con fecha fija 2023-01-07, dailyEnergyEngine da overallScore 46/100,
    // por debajo del umbral neutro del engine.
    const profile = profileWith({ lifePath: 3, element: "Tierra", birthDate: "1992-06-22" });
    const result = detectarNudo({
      profile,
      context: "daily_energy",
      payload: { targetDate: new Date(2023, 0, 7, 12, 0, 0) },
    });

    expect(result.trace.hasRealTension).toBe(true);
    expect(result.trace.sources).toContain("dailyEnergyEngine");
  });

  it("contexto compatibility con señal favorable: compatibilityEngine no confirma fricción → hasRealTension false", () => {
    const profile = profileWith({ lifePath: 1, element: "Tierra" });
    const result = detectarNudo({
      profile,
      context: "compatibility",
      payload: { target: { lifePath: 4, sunSign: "Tauro", chineseZodiac: "Buey", archetype: "El Constructor", element: "Tierra" } },
    });

    expect(result.trace.hasRealTension).toBe(false);
    expect(result.trace.sources).toEqual([]);
  });

  it("determinismo: mismo input produce mismo output", () => {
    const profile = profileWith({ lifePath: 4, element: "Fuego" });
    const r1 = detectarNudo({ profile, context: "free_text", payload: {} });
    const r2 = detectarNudo({ profile, context: "free_text", payload: {} });

    expect(r1).toEqual(r2);
  });

  it("mismo patrón estable, distinto contexto: el resultado puede cambiar según si el contexto confirma fricción o no (prueba de que el cruce ocurre de verdad)", () => {
    const profile = profileWith({ lifePath: 1, element: "Tierra" });

    const favorable = detectarNudo({
      profile,
      context: "decision",
      payload: { question: "¿Debo cambiar de trabajo?", category: "career" },
    });
    const conFriccion = detectarNudo({
      profile: profileWith({ lifePath: 1, element: "Tierra", birthDate: "1985-05-15" }),
      context: "timing",
      payload: { targetDate: new Date(2023, 0, 7, 12, 0, 0), intention: "change_job" },
    });

    expect(favorable.trace.hasRealTension).toBe(false);
    expect(conFriccion.trace.hasRealTension).toBe(true);
  });
});
