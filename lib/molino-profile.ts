import { OnboardingData } from "./types/molino-types";
import { ANIMALS } from "./data/animalRelations";

export interface MolinoProfile {
  name: string;
  lifePathNumber: number;
  archetype: string;
  zodiacSign: string;
  zodiacEmoji: string;
  chineseZodiac: string;
  chineseElement: string;
  element: string;
  elementDescription: string;
  goal: string | null;
  interests: string[];
  generatedAt: string;
}

const zodiacRanges: { sign: string; emoji: string; start: [number, number]; end: [number, number] }[] = [
  { sign: "Aries", emoji: "♈", start: [3, 21], end: [4, 19] },
  { sign: "Tauro", emoji: "♉", start: [4, 20], end: [5, 20] },
  { sign: "Géminis", emoji: "♊", start: [5, 21], end: [6, 20] },
  { sign: "Cáncer", emoji: "♋", start: [6, 21], end: [7, 22] },
  { sign: "Leo", emoji: "♌", start: [7, 23], end: [8, 22] },
  { sign: "Virgo", emoji: "♍", start: [8, 23], end: [9, 22] },
  { sign: "Libra", emoji: "♎", start: [9, 23], end: [10, 22] },
  { sign: "Escorpio", emoji: "♏", start: [10, 23], end: [11, 21] },
  { sign: "Sagitario", emoji: "♐", start: [11, 22], end: [12, 21] },
  { sign: "Capricornio", emoji: "♑", start: [12, 22], end: [1, 19] },
  { sign: "Acuario", emoji: "♒", start: [1, 20], end: [2, 18] },
  { sign: "Piscis", emoji: "♓", start: [2, 19], end: [3, 20] },
];

const chineseElements = ["Madera", "Fuego", "Tierra", "Metal", "Agua"];

const archetypesByLifePath: Record<number, string> = {
  1: "El Pionero", 2: "El Diplomático", 3: "El Comunicador", 4: "El Constructor",
  5: "El Explorador", 6: "El Guardián", 7: "El Buscador", 8: "El Estratega",
  9: "El Sanador", 11: "El Visionario", 22: "El Maestro Constructor", 33: "El Maestro Guía",
};

const elements: { name: string; description: string }[] = [
  { name: "Fuego", description: "Impulso, pasión y acción decidida." },
  { name: "Tierra", description: "Estabilidad, method y sentido práctico." },
  { name: "Aire", description: "Ideas, comunicación y movimiento mental." },
  { name: "Agua", description: "Intuición, emoción y profundidad interior." },
];

function reduceToLifePath(dateStr: string): number {
  const digits = dateStr.replace(/\D/g, "").split("").map(Number);
  let sum = digits.reduce((acc, d) => acc + d, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum)
      .split("")
      .reduce((acc, d) => acc + Number(d), 0);
  }
  return sum || 1;
}

function getZodiacSign(dateStr: string): { sign: string; emoji: string } {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const z of zodiacRanges) {
    const [startMonth, startDay] = z.start;
    const [endMonth, endDay] = z.end;
    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) return { sign: z.sign, emoji: z.emoji };
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return { sign: z.sign, emoji: z.emoji };
      }
    }
  }
  return { sign: "Capricornio", emoji: "♑" };
}

function getChineseZodiac(dateStr: string): { animal: string; element: string } {
  const year = new Date(dateStr).getFullYear();
  const animal = ANIMALS[(year - 4) % 12];
  const element = chineseElements[Math.floor(((year - 4) % 10) / 2)];
  return { animal, element };
}

export function buildProfile(data: OnboardingData): MolinoProfile {
  const lifePathNumber = data.birthDate ? reduceToLifePath(data.birthDate) : 1;
  const zodiac = data.birthDate ? getZodiacSign(data.birthDate) : { sign: "—", emoji: "✨" };
  const chinese = data.birthDate ? getChineseZodiac(data.birthDate) : { animal: "—", element: "—" };
  const element = elements[lifePathNumber % elements.length];

  return {
    name: data.name || "Sin nombre",
    lifePathNumber,
    archetype: archetypesByLifePath[lifePathNumber] ?? "El Buscador",
    zodiacSign: zodiac.sign,
    zodiacEmoji: zodiac.emoji,
    chineseZodiac: chinese.animal,
    chineseElement: chinese.element,
    element: element.name,
    elementDescription: element.description,
    goal: data.goal,
    interests: data.interests,
    generatedAt: new Date().toISOString(),
  };
}
