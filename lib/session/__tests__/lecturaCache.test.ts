import { describe, it, expect, beforeEach } from "vitest";
import { getCachedLectura, setCachedLectura } from "../lecturaCache";
import type { MolinoInterpretation } from "@/lib/engines/intelligence/types";

const sample: MolinoInterpretation = {
  summary: "Sos un canal entre lo que pensás y lo que hacés.",
  alignment: "",
  timing: "",
  strengths: ["Foco"],
  tensions: ["Impaciencia"],
  whatToConsider: [],
  suggestedNextStep: "Elegí una cosa.",
  confidence: "Alta",
  limitations: [],
  rawContext: {} as never,
};

describe("lecturaCache", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing was cached for this profile", () => {
    expect(getCachedLectura("1990-05-20", "Franco")).toBeNull();
  });

  it("returns the same interpretation after setCachedLectura", () => {
    setCachedLectura("1990-05-20", "Franco", sample);
    expect(getCachedLectura("1990-05-20", "Franco")).toEqual(sample);
  });

  it("is scoped per birthDate + name — a different profile misses", () => {
    setCachedLectura("1990-05-20", "Franco", sample);
    expect(getCachedLectura("1990-05-20", "Otra Persona")).toBeNull();
    expect(getCachedLectura("1991-01-01", "Franco")).toBeNull();
  });

  it("is case-insensitive on name", () => {
    setCachedLectura("1990-05-20", "Franco", sample);
    expect(getCachedLectura("1990-05-20", "FRANCO")).toEqual(sample);
  });
});
