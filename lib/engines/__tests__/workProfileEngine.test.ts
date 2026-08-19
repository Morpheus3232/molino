import { describe, it, expect } from "vitest";
import { getWorkProfile } from "../workProfileEngine";
import { calculateUserProfile } from "../profileBuilder";

describe("Work Profile Engine", () => {
  it("returns the life path title and work manifestation text for that number", () => {
    const profile = calculateUserProfile("Ana", "1990-03-15"); // lifePath 1
    const result = getWorkProfile(profile);
    expect(result.lifePath).toBe(1);
    expect(result.lifePathTitle).toBe("El Líder");
    expect(result.workStyle.length).toBeGreaterThan(0);
  });

  it("returns the Chinese zodiac animal traits", () => {
    const profile = calculateUserProfile("Franco", "1990-05-20"); // Caballo
    const result = getWorkProfile(profile);
    expect(result.animal).toBe("Caballo");
    expect(result.animalTraits.length).toBeGreaterThan(0);
  });
});
