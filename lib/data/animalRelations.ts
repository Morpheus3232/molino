/**
 * Animal Relations — Complete traditional Chinese Zodiac relationship system.
 *
 * Sources: Encyclopaedia Britannica, Chinese zodiac traditional texts.
 * Verified against multiple references. NOT derived from engine scores.
 *
 * This module is INDEPENDENT of affinityEngine.ts.
 * The existing engine may have different scores for backward compatibility.
 *
 * Vietnamese equivalents:
 *   Gato (Chinese) = Gato (Vietnamese) — same name in both traditions
 *   Buey (Chinese) = Búfalo de Agua (Vietnamese)
 */

export const ANIMALS = [
  "Rata", "Buey", "Tigre", "Gato", "Dragón",
  "Serpiente", "Caballo", "Cabra", "Mono", "Gallo",
  "Perro", "Cerdo",
] as const;

export type Animal = typeof ANIMALS[number];

// ════════════════════════════════════════════════════
// SAN HE (三合) — TRIADS — Same hidden element
// ════════════════════════════════════════════════════

export const SAN_HE_TRIADS: { animals: [Animal, Animal, Animal]; element: string }[] = [
  { animals: ["Rata", "Dragón", "Mono"], element: "Agua" },
  { animals: ["Buey", "Serpiente", "Gallo"], element: "Metal" },
  { animals: ["Tigre", "Caballo", "Perro"], element: "Fuego" },
  { animals: ["Gato", "Cabra", "Cerdo"], element: "Madera" },
];

// ════════════════════════════════════════════════════
// LIU HE (六合) — HARMONIOUS PAIRS
// ════════════════════════════════════════════════════

export const LIU_HE_PAIRS: [Animal, Animal][] = [
  ["Rata", "Buey"],
  ["Tigre", "Gato"],
  ["Dragón", "Serpiente"],
  ["Caballo", "Cabra"],
  ["Mono", "Gallo"],
  ["Perro", "Cerdo"],
];

// ════════════════════════════════════════════════════
// LIU CHONG (六冲) — SIX CLASHES — Direct opposition
// ════════════════════════════════════════════════════

export const LIU_CHONG_CLASHES: [Animal, Animal][] = [
  ["Rata", "Caballo"],
  ["Buey", "Cabra"],
  ["Tigre", "Mono"],
  ["Gato", "Gallo"],
  ["Dragón", "Perro"],
  ["Serpiente", "Cerdo"],
];

// ════════════════════════════════════════════════════
// LIU HAI (六害) — SIX HARMS
// ════════════════════════════════════════════════════

export const LIU_HAI_HARMS: [Animal, Animal][] = [
  ["Rata", "Cabra"],
  ["Buey", "Caballo"],
  ["Tigre", "Serpiente"],
  ["Gato", "Dragón"],
  ["Mono", "Cerdo"],
  ["Gallo", "Perro"],
];

// ════════════════════════════════════════════════════
// RELATIONSHIP TYPE
// ════════════════════════════════════════════════════

export type RelationType =
  | "same"
  | "triad"
  | "harmonious"
  | "neutral"
  | "clash"
  | "harm";

export interface AnimalRelation {
  animal: Animal;
  type: RelationType;
  label: string;
  description: string;
  score: number;
  tier: number;
}

// ════════════════════════════════════════════════════
// RELATIONSHIP SCORES
// ════════════════════════════════════════════════════

const RELATION_SCORES: Record<RelationType, { score: number; tier: number }> = {
  same:       { score: 95, tier: 5 },
  triad:      { score: 85, tier: 4 },
  harmonious: { score: 80, tier: 4 },
  neutral:    { score: 50, tier: 3 },
  clash:      { score: 30, tier: 2 },
  harm:       { score: 25, tier: 2 },
};

// ════════════════════════════════════════════════════
// LOOKUP MAPS
// ════════════════════════════════════════════════════

const PAIR_TYPE_MAP = new Map<string, RelationType>();

function pairKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

for (const triad of SAN_HE_TRIADS) {
  const [a, b, c] = triad.animals;
  PAIR_TYPE_MAP.set(pairKey(a, b), "triad");
  PAIR_TYPE_MAP.set(pairKey(a, c), "triad");
  PAIR_TYPE_MAP.set(pairKey(b, c), "triad");
}
for (const [a, b] of LIU_HE_PAIRS) {
  PAIR_TYPE_MAP.set(pairKey(a, b), "harmonious");
}
for (const [a, b] of LIU_CHONG_CLASHES) {
  PAIR_TYPE_MAP.set(pairKey(a, b), "clash");
}
for (const [a, b] of LIU_HAI_HARMS) {
  PAIR_TYPE_MAP.set(pairKey(a, b), "harm");
}

// ════════════════════════════════════════════════════
// PER-ANIMAL PROFILES
// ════════════════════════════════════════════════════

export interface AnimalProfile {
  animal: Animal;
  emoji: string;
  /** Same animal */
  sameAnimal: Animal;
  /** San He triad partners */
  harmonyPartners: Animal[];
  /** Liu He special partner */
  liuHePartner: Animal;
  /** Liu Chong + Liu Hai — relationships requiring attention */
  challengingRelations: Animal[];
  /** Neutral animals */
  neutralRelations: Animal[];
  /** Cultural traits */
  traits: string[];
}

export const ANIMAL_PROFILES: Record<Animal, AnimalProfile> = {
  Rata: {
    animal: "Rata", emoji: "🐀",
    sameAnimal: "Rata",
    harmonyPartners: ["Dragón", "Mono"],
    liuHePartner: "Buey",
    challengingRelations: ["Caballo"],
    neutralRelations: ["Tigre", "Gato", "Serpiente", "Gallo", "Perro", "Cerdo", "Cabra"],
    traits: ["Astucia", "Adaptabilidad", "Curiosidad"],
  },
  Buey: {
    animal: "Buey", emoji: "🐂",
    sameAnimal: "Buey",
    harmonyPartners: ["Serpiente", "Gallo"],
    liuHePartner: "Rata",
    challengingRelations: ["Cabra"],
    neutralRelations: ["Tigre", "Gato", "Dragón", "Mono", "Perro", "Cerdo", "Caballo"],
    traits: ["Fuerza", "Determinación", "Lealtad"],
  },
  Tigre: {
    animal: "Tigre", emoji: "🐅",
    sameAnimal: "Tigre",
    harmonyPartners: ["Caballo", "Perro"],
    liuHePartner: "Gato",
    challengingRelations: ["Mono"],
    neutralRelations: ["Rata", "Buey", "Dragón", "Cabra", "Gallo", "Cerdo", "Serpiente"],
    traits: ["Coraje", "Pasión", "Liderazgo"],
  },
  Gato: {
    animal: "Gato", emoji: "🐱",
    sameAnimal: "Gato",
    harmonyPartners: ["Cabra", "Cerdo"],
    liuHePartner: "Tigre",
    challengingRelations: ["Gallo"],
    neutralRelations: ["Rata", "Buey", "Serpiente", "Caballo", "Mono", "Perro", "Dragón"],
    traits: ["Elegancia", "Suavidad", "Intuición"],
  },
  Dragón: {
    animal: "Dragón", emoji: "🐉",
    sameAnimal: "Dragón",
    harmonyPartners: ["Rata", "Mono"],
    liuHePartner: "Serpiente",
    challengingRelations: ["Perro"],
    neutralRelations: ["Buey", "Tigre", "Caballo", "Cabra", "Gallo", "Cerdo", "Gato"],
    traits: ["Poder", "Visión", "Ambición"],
  },
  Serpiente: {
    animal: "Serpiente", emoji: "🐍",
    sameAnimal: "Serpiente",
    harmonyPartners: ["Buey", "Gallo"],
    liuHePartner: "Dragón",
    challengingRelations: ["Cerdo"],
    neutralRelations: ["Rata", "Gato", "Caballo", "Cabra", "Mono", "Perro", "Tigre"],
    traits: ["Sabiduría", "Profundidad", "Magnetismo"],
  },
  Caballo: {
    animal: "Caballo", emoji: "🐎",
    sameAnimal: "Caballo",
    harmonyPartners: ["Tigre", "Perro"],
    liuHePartner: "Cabra",
    challengingRelations: ["Rata"],
    neutralRelations: ["Gato", "Dragón", "Serpiente", "Mono", "Gallo", "Cerdo", "Buey"],
    traits: ["Movimiento", "Independencia", "Exploración"],
  },
  Cabra: {
    animal: "Cabra", emoji: "🐐",
    sameAnimal: "Cabra",
    harmonyPartners: ["Gato", "Cerdo"],
    liuHePartner: "Caballo",
    challengingRelations: ["Buey"],
    neutralRelations: ["Tigre", "Dragón", "Serpiente", "Mono", "Gallo", "Perro", "Rata"],
    traits: ["Creatividad", "Armonía", "Sensibilidad"],
  },
  Mono: {
    animal: "Mono", emoji: "🐒",
    sameAnimal: "Mono",
    harmonyPartners: ["Rata", "Dragón"],
    liuHePartner: "Gallo",
    challengingRelations: ["Tigre"],
    neutralRelations: ["Buey", "Gato", "Serpiente", "Caballo", "Cabra", "Perro", "Cerdo"],
    traits: ["Ingenio", "Versatilidad", "Chispa"],
  },
  Gallo: {
    animal: "Gallo", emoji: "🐓",
    sameAnimal: "Gallo",
    harmonyPartners: ["Buey", "Serpiente"],
    liuHePartner: "Mono",
    challengingRelations: ["Gato"],
    neutralRelations: ["Rata", "Tigre", "Dragón", "Caballo", "Cabra", "Cerdo", "Perro"],
    traits: ["Puntualidad", "Observación", "Coraje"],
  },
  Perro: {
    animal: "Perro", emoji: "🐕",
    sameAnimal: "Perro",
    harmonyPartners: ["Tigre", "Caballo"],
    liuHePartner: "Cerdo",
    challengingRelations: ["Dragón"],
    neutralRelations: ["Rata", "Buey", "Gato", "Serpiente", "Cabra", "Mono", "Gallo"],
    traits: ["Lealtad", "Honradez", "Protección"],
  },
  Cerdo: {
    animal: "Cerdo", emoji: "🐖",
    sameAnimal: "Cerdo",
    harmonyPartners: ["Gato", "Cabra"],
    liuHePartner: "Perro",
    challengingRelations: ["Serpiente"],
    neutralRelations: ["Rata", "Buey", "Tigre", "Dragón", "Caballo", "Gallo", "Mono"],
    traits: ["Generosidad", "Optimismo", "Calidez"],
  },
};

// ════════════════════════════════════════════════════
// LABELS
// ════════════════════════════════════════════════════

const RELATION_LABELS: Record<RelationType, string> = {
  same: "mismo animal",
  triad: "tríada",
  harmonious: "armonía natural",
  neutral: "energías independientes",
  clash: "energías opuestas",
  harm: "energías opuestas",
};

// ════════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════════

/**
 * Get the traditional relationship between two animals.
 */
export function getRelation(a: Animal, b: Animal): AnimalRelation {
  if (a === b) {
    return {
      animal: b,
      type: "same",
      label: "mismo animal",
      description: `${b} comparte tu misma energía base.`,
      ...RELATION_SCORES.same,
    };
  }

  const type = PAIR_TYPE_MAP.get(pairKey(a, b)) ?? "neutral";
  const meta = RELATION_SCORES[type];

  return {
    animal: b,
    type,
    label: RELATION_LABELS[type],
    description: getRelationDescription(type, a, b),
    ...meta,
  };
}

/**
 * Get the profile for an animal.
 */
export function getAnimalProfile(animal: Animal): AnimalProfile {
  return ANIMAL_PROFILES[animal];
}

/**
 * Get all friends of an animal (triad + harmonious).
 */
export function getFriends(animal: Animal): AnimalRelation[] {
  const profile = ANIMAL_PROFILES[animal];
  if (!profile) return [];
  const friends: AnimalRelation[] = [];
  for (const other of profile.harmonyPartners) {
    friends.push(getRelation(animal, other));
  }
  friends.push(getRelation(animal, profile.liuHePartner));
  return friends.sort((a, b) => b.score - a.score);
}

/**
 * Get all challenging relationships (clash + harm).
 */
export function getChallenging(animal: Animal): AnimalRelation[] {
  const profile = ANIMAL_PROFILES[animal];
  if (!profile) return [];
  return profile.challengingRelations.map(other => getRelation(animal, other))
    .sort((a, b) => a.score - b.score);
}

/**
 * Get the full relationship map for an animal.
 */
export function getRelationshipMap(animal: Animal): {
  same: AnimalRelation;
  friends: AnimalRelation[];
  neutral: AnimalRelation[];
  challenging: AnimalRelation[];
} {
  // Guard: return empty map for invalid animals (e.g., empty string during SSR)
  if (!animal || !ANIMAL_PROFILES[animal]) {
    const emptyRelation: AnimalRelation = {
      animal: (animal || "") as Animal,
      type: "neutral",
      label: "sin datos",
      description: "Sin datos disponibles.",
      score: 50,
      tier: 3,
    };
    return { same: emptyRelation, friends: [], neutral: [], challenging: [] };
  }

  const same = getRelation(animal, animal);
  const friends = getFriends(animal);
  const challenging = getChallenging(animal);

  const friendAnimals = new Set(friends.map(f => f.animal));
  const challengingAnimals = new Set(challenging.map(c => c.animal));
  const neutral: AnimalRelation[] = [];

  for (const other of ANIMALS) {
    if (other === animal) continue;
    if (friendAnimals.has(other) || challengingAnimals.has(other)) continue;
    neutral.push(getRelation(animal, other));
  }

  return {
    same,
    friends,
    neutral: neutral.sort((a, b) => b.score - a.score),
    challenging,
  };
}

// ════════════════════════════════════════════════════
// DESCRIPTIONS
// ════════════════════════════════════════════════════

function getRelationDescription(type: RelationType, a: string, b: string): string {
  switch (type) {
    case "triad": {
      const triad = SAN_HE_TRIADS.find(t => t.animals.includes(a as Animal) && t.animals.includes(b as Animal));
      return `${a} y ${b} comparten el elemento oculto ${triad?.element ?? ""}. Energías que se potencian mutuamente.`;
    }
    case "harmonious":
      return `${a} y ${b} forman una pareja armoniosa. Se complementan de forma natural según la tradición.`;
    case "clash":
      return `${a} y ${b} son energías opuestas en el ciclo. Requiere más consciencia y estrategia.`;
    case "harm":
      return `${a} y ${b} tienen una relación de mayor atención. La tradición sugiere actuar con cuidado.`;
    case "neutral":
      return `${a} y ${b} no tienen una relación especial. Energías independientes.`;
    default:
      return "";
  }
}
