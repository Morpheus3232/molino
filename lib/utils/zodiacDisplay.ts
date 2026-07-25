/**
 * Zodiac Display Utilities
 *
 * Format zodiac animal names for user-facing display.
 * Handles cultural equivalents (e.g., Rabbit = Cat in Vietnamese zodiac).
 *
 * DOES NOT modify any calculations, scores, or engine logic.
 * Presentation layer only.
 */

// ════════════════════════════════════════════════════
// ANIMAL METADATA
// ════════════════════════════════════════════════════

interface AnimalDisplay {
  chinese: string;
  emoji: string;
  vietnamese?: string;
  vietnameseEmoji?: string;
}

const ANIMAL_DISPLAY: Record<string, AnimalDisplay> = {
  Rata:     { chinese: "Rata",     emoji: "🐀", vietnamese: "Rata",     vietnameseEmoji: "🐀" },
  Buey:     { chinese: "Buey",     emoji: "🐂", vietnamese: "Búfalo Agua", vietnameseEmoji: "🐃" },
  Tigre:    { chinese: "Tigre",    emoji: "🐅", vietnamese: "Gato",     vietnameseEmoji: "🐱" },
  Conejo:   { chinese: "Conejo",   emoji: "🐇", vietnamese: "Gato",     vietnameseEmoji: "🐱" },
  Dragón:   { chinese: "Dragón",   emoji: "🐉", vietnamese: "Dragón",   vietnameseEmoji: "🐉" },
  Serpiente:{ chinese: "Serpiente",emoji: "🐍", vietnamese: "Serpiente",vietnameseEmoji: "🐍" },
  Caballo:  { chinese: "Caballo",  emoji: "🐎", vietnamese: "Caballo",  vietnameseEmoji: "🐎" },
  Cabra:    { chinese: "Cabra",    emoji: "🐐", vietnamese: "Cabra",    vietnameseEmoji: "🐐" },
  Mono:     { chinese: "Mono",     emoji: "🐒", vietnamese: "Mono",     vietnameseEmoji: "🐒" },
  Gallo:    { chinese: "Gallo",    emoji: "🐓", vietnamese: "Gallo",    vietnameseEmoji: "🐓" },
  Perro:    { chinese: "Perro",    emoji: "🐕", vietnamese: "Perro",    vietnameseEmoji: "🐕" },
  Cerdo:    { chinese: "Cerdo",    emoji: "🐖", vietnamese: "Cerdo",    vietnameseEmoji: "🐖" },
};

// ════════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════════

export interface ZodiacDisplayResult {
  /** Chinese name: "Conejo" */
  name: string;
  /** Emoji: "🐇" */
  emoji: string;
  /** Full display: "🐇 Conejo" */
  display: string;
  /** Vietnamese equivalent name (if different): "Gato" */
  vietnameseName?: string;
  /** Vietnamese emoji (if different): "🐱" */
  vietnameseEmoji?: string;
  /** Full Vietnamese display: "🐱 Gato" */
  vietnameseDisplay?: string;
  /** Has cultural equivalent */
  hasEquivalent: boolean;
}

/**
 * Get full display info for a zodiac animal.
 */
export function getZodiacDisplay(animal: string): ZodiacDisplayResult {
  const data = ANIMAL_DISPLAY[animal];
  if (!data) {
    return {
      name: animal,
      emoji: "🪞",
      display: `🪞 ${animal}`,
      hasEquivalent: false,
    };
  }

  const hasEquivalent = data.vietnamese !== undefined && data.vietnamese !== data.chinese;

  return {
    name: data.chinese,
    emoji: data.emoji,
    display: `${data.emoji} ${data.chinese}`,
    vietnameseName: hasEquivalent ? data.vietnamese : undefined,
    vietnameseEmoji: hasEquivalent ? data.vietnameseEmoji : undefined,
    vietnameseDisplay: hasEquivalent ? `${data.vietnameseEmoji} ${data.vietnamese}` : undefined,
    hasEquivalent,
  };
}

/**
 * Format animal for simple display (no equivalent shown).
 * "🐇 Conejo"
 */
export function formatAnimalSimple(animal: string): string {
  return getZodiacDisplay(animal).display;
}

/**
 * Format animal with cultural equivalent (when space allows).
 * "🐇 Conejo · 🐱 Gato en Vietnam"
 */
export function formatAnimalWithEquivalent(animal: string): string {
  const d = getZodiacDisplay(animal);
  if (!d.hasEquivalent) return d.display;
  return `${d.display} · ${d.vietnameseEmoji} ${d.vietnameseName} en Vietnam`;
}

/**
 * Format animal for dense contexts (score cards, etc.).
 * Just the emoji: "🐇"
 */
export function formatAnimalEmoji(animal: string): string {
  return getZodiacDisplay(animal).emoji;
}


