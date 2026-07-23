/**
 * Ciclo sexagenario del zodiaco chino.
 * 60 combinaciones de animal × elemento, cada una con polaridad Yin/Yang.
 * 
 * El ciclo se construye combinando:
 * - 12 animales del zodíaco
 * - 5 elementos (Madera, Fuego, Tierra, Metal, Agua)
 * - 2 polaridades (Yin, Yang)
 * 
 * Cada elemento tiene 2 años: uno Yin y uno Yang.
 * Total: 5 elementos × 2 polaridades × 12 animales = 120 combinaciones
 * Pero en la práctica se usan 60 combinaciones (cada elemento se asocia con 2 animales por ciclo).
 */

export interface SexagenaryYear {
  year: number;
  animal: string;
  element: string;
  polarity: "Yin" | "Yang";
  animalIndex: number;
  elementIndex: number;
  stemIndex: number;
  branchIndex: number;
  stemName: string;
  branchName: string;
}

const ANIMALS = ["Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];
const ELEMENTS = ["Madera", "Fuego", "Tierra", "Metal", "Agua"];
const POLARITIES: ("Yin" | "Yang")[] = ["Yang", "Yin"];

// Heavenly Stems (天干)
const STEMS = [
  { name: "Jiǎ (甲)", element: "Madera", polarity: "Yang" },
  { name: "Yǐ (乙)", element: "Madera", polarity: "Yin" },
  { name: "Bǐng (丙)", element: "Fuego", polarity: "Yang" },
  { name: "Dīng (丁)", element: "Fuego", polarity: "Yin" },
  { name: "Wù (戊)", element: "Tierra", polarity: "Yang" },
  { name: "Jǐ (己)", element: "Tierra", polarity: "Yin" },
  { name: "Gēng (庚)", element: "Metal", polarity: "Yang" },
  { name: "Xīn (辛)", element: "Metal", polarity: "Yin" },
  { name: "Rén (壬)", element: "Agua", polarity: "Yang" },
  { name: "Guǐ (癸)", element: "Agua", polarity: "Yin" },
];

// Earthly Branches (地支)
const BRANCHES = [
  { name: "Zǐ (子)", animal: "Rata", polarity: "Yang" },
  { name: "Chǒu (丑)", animal: "Buey", polarity: "Yin" },
  { name: "Yín (寅)", animal: "Tigre", polarity: "Yang" },
  { name: "Mǎo (卯)", animal: "Conejo", polarity: "Yin" },
  { name: "Chén (辰)", animal: "Dragón", polarity: "Yang" },
  { name: "Sì (巳)", animal: "Serpiente", polarity: "Yin" },
  { name: "Wǔ (午)", animal: "Caballo", polarity: "Yang" },
  { name: "Wèi (未)", animal: "Cabra", polarity: "Yin" },
  { name: "Shēn (申)", animal: "Mono", polarity: "Yang" },
  { name: "Yǒu (酉)", animal: "Gallo", polarity: "Yin" },
  { name: "Xū (戌)", animal: "Perro", polarity: "Yang" },
  { name: "Hài (亥)", animal: "Cerdo", polarity: "Yin" },
];

/**
 * Genera los 60 años del ciclo sexagenario a partir de un año base.
 * El ciclo real se repite cada 60 años.
 */
export function generateSexagenaryCycle(baseYear: number = 1924): SexagenaryYear[] {
  const years: SexagenaryYear[] = [];
  for (let i = 0; i < 60; i++) {
    const year = baseYear + i;
    const branchIndex = i % 12;
    const stemIndex = i % 10;
    const animal = ANIMALS[branchIndex];
    const stem = STEMS[stemIndex];
    const branch = BRANCHES[branchIndex];

    years.push({
      year,
      animal,
      element: stem.element,
      polarity: stem.polarity as "Yin" | "Yang",
      animalIndex: branchIndex,
      elementIndex: ELEMENTS.indexOf(stem.element),
      stemIndex,
      branchIndex,
      stemName: stem.name,
      branchName: branch.name,
    });
  }
  return years;
}

/**
 * Obtiene el ciclo completo de 60 años para un año dado.
 */
export function getCycleForYear(targetYear: number): SexagenaryYear[] {
  const cycleStart = targetYear - (targetYear % 60);
  return generateSexagenaryCycle(cycleStart || 1924);
}

/**
 * Obtiene el año sexagenario específico.
 */
export function getSexagenaryYear(targetYear: number): SexagenaryYear {
  const cycleStart = targetYear - ((targetYear - 1924) % 60 + 60) % 60;
  const cycle = generateSexagenaryCycle(cycleStart);
  return cycle.find(y => y.year === targetYear) || cycle[0];
}

export { ANIMALS, ELEMENTS, STEMS, BRANCHES };
