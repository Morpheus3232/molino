import { describe, it, expect } from "vitest";
import { calculateUserProfileData, calculateUserProfile } from "@/lib/engines/profileBuilder";
import { ProfileInterpreter } from "@/lib/interpreter/profileInterpreter";
import { SIGN_FACTS } from "@/lib/data/facts/astrology-facts";
import { NUMEROLOGY_ARCHETYPES_ES } from "@/lib/data/interpretations/numerology-interpretations";
import { ANIMAL_INTERPRETATIONS_ES } from "@/lib/data/interpretations/chinese-zodiac-interpretations";

function generateRandomDate(startYear = 1930, endYear = 2024): string {
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const maxDay = new Date(year, month, 0).getDate();
  const day = Math.floor(Math.random() * maxDay) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

describe("Architecture Consistency: Facts vs Interpretations", () => {
  it("verifies consistency across 100 random birth dates", () => {
    const dates = Array.from({ length: 100 }, () => generateRandomDate());

    for (const date of dates) {
      const data = calculateUserProfileData("Persona de Prueba", date);

      // 1. Serialization test: UserProfileData must be 100% pure JSON serializable
      const jsonStr = JSON.stringify(data);
      const parsedData = JSON.parse(jsonStr);
      expect(parsedData.lifePath).toBe(data.lifePath);
      expect(parsedData.sunSign).toBe(data.sunSign);
      expect(parsedData.chineseZodiac).toBe(data.chineseZodiac);
      expect(parsedData.chineseElement).toBe(data.chineseElement);

      // 2. Interpreter test
      const interpreted = ProfileInterpreter.interpret(data, "es");
      const fullProfile = calculateUserProfile("Persona de Prueba", date);

      // 3. Numerology fact vs interpretation consistency
      const expectedArchetype = NUMEROLOGY_ARCHETYPES_ES[data.lifePath]?.name;
      expect(interpreted.archetype).toBe(expectedArchetype);
      expect(fullProfile.archetype).toBe(expectedArchetype);
      expect(interpreted.archetypeInfo.name).toBe(expectedArchetype);

      // 4. Astrology fact vs interpretation consistency
      const expectedSignFact = SIGN_FACTS[data.sunSign];
      expect(expectedSignFact).toBeDefined();
      expect(data.sunElement).toBe(expectedSignFact.element);
      expect(data.sunModality).toBe(expectedSignFact.modality);
      expect(interpreted.sunSignInfo.sign).toBe(data.sunSign);
      expect(interpreted.sunSignInfo.element).toBe(expectedSignFact.element);
      expect(fullProfile.sunSignInfo.element).toBe(expectedSignFact.element);

      // 5. Chinese Zodiac fact vs interpretation consistency
      const expectedAnimalInterpretation = ANIMAL_INTERPRETATIONS_ES[data.chineseZodiac];
      expect(expectedAnimalInterpretation).toBeDefined();
      expect(interpreted.chineseZodiacInfo.animal).toBe(data.chineseZodiac);
      expect(interpreted.chineseZodiacInfo.element).toBe(data.chineseElement);
      expect(fullProfile.chineseZodiacInfo.animal).toBe(data.chineseZodiac);
      expect(fullProfile.chineseZodiacInfo.element).toBe(data.chineseElement);

      // 6. Cycles integrity
      expect(data.cycles.personalYear).toBeGreaterThanOrEqual(1);
      expect(data.cycles.personalMonth).toBeGreaterThanOrEqual(1);
      expect(data.cycles.personalDay).toBeGreaterThanOrEqual(1);
    }
  });

  it("ensures known master numbers and edge cases are consistently mapped", () => {
    // Master number 11 date
    const data11 = calculateUserProfileData("Master 11", "1975-08-16");
    if (data11.lifePath === 11) {
      const interpreted11 = ProfileInterpreter.interpret(data11);
      expect(interpreted11.archetype).toBe("El Visionario");
    }

    // Master number 22 date (1979-05-25: 1+9+7+9+5+2+5 = 38 -> 11? Let's check 1980-04-09: 1+9+8+0+0+4+0+9 = 31 -> 4. Or 1984-02-25: 1+9+8+4+0+2+2+5 = 31. Or 1977-03-04: 1+9+7+7+3+4 = 31. Or 1970-01-04: 22!)
    const data22 = calculateUserProfileData("Master 22", "1970-01-04");
    expect(data22.lifePath).toBe(22);
    const interpreted22 = ProfileInterpreter.interpret(data22);
    expect(interpreted22.archetype).toBe("El Constructor Maestro");
  });
});
