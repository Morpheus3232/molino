/**
 * Adapter: converts a curated subset of famousPeople.ts into SymbolicEntity
 * records the Affinity system can score.
 *
 * famousPeople.ts is never mutated — it's used by the Circle screen for a
 * different purpose (year-exact "people like you" matching) and must keep
 * working exactly as before. This module only *reads* it and re-shapes a
 * hand-picked subset.
 *
 * Selection is intentionally small and targeted: each pick was chosen because
 * it closes a specific HIGH/MEDIUM/LOW resonance gap for its Chinese zodiac
 * animal in the "artist" category (verified against affinityEngine, see
 * __tests__/affinity-coverage.test.ts). This is not a bulk import of the
 * ~117 people in famousPeople.ts — the field restriction (Música, Cine,
 * Arte, Literatura, Animación) also keeps non-artist figures (politicians,
 * scientists, athletes) out of a category literally named "Artista".
 *
 * The entity's zodiac animal is always recalculated from `year` via
 * calculateAnimalFromDate — never trusted from famousPeople.ts's `animal`
 * field directly — because only the year (not an exact birth date) is
 * available, and that's the same rule every other year-only entity in
 * symbolic-entities.ts follows.
 *
 * To extend: add a {name, animal} pair to SELECTED_PEOPLE. findPerson()
 * throws if the pair doesn't exist in famousPeople.ts, so a typo or a future
 * edit to famousPeople.ts can never silently produce a wrong entity.
 */

import { FAMOUS_BY_ANIMAL, type FamousPerson } from "./famousPeople";
import type { SymbolicEntity } from "./symbolic-entities";

const ARTIST_FIELDS = new Set(["Música", "Cine", "Arte", "Literatura", "Animación"]);

interface Selection {
  name: string;
  animal: string;
}

/** Curated picks — chosen to close "artist" category resonance gaps per animal. */
const SELECTED_PEOPLE: Selection[] = [
  { name: "William Shakespeare", animal: "Rata" },
  { name: "Wolfgang Amadeus Mozart", animal: "Rata" },
  { name: "Marlon Brando", animal: "Rata" },
  { name: "Pablo Picasso", animal: "Serpiente" },
  { name: "Taylor Swift", animal: "Serpiente" },
  { name: "Bob Dylan", animal: "Serpiente" },
  { name: "Frank Sinatra", animal: "Gato" },
  { name: "Angelina Jolie", animal: "Gato" },
  { name: "John Lennon", animal: "Dragón" },
];

function findPerson(sel: Selection): FamousPerson {
  const person = (FAMOUS_BY_ANIMAL[sel.animal] ?? []).find((p) => p.name === sel.name);
  if (!person) {
    throw new Error(`famousPeopleToEntities: "${sel.name}" not found in FAMOUS_BY_ANIMAL.${sel.animal}`);
  }
  if (!ARTIST_FIELDS.has(person.field)) {
    throw new Error(`famousPeopleToEntities: "${sel.name}" field "${person.field}" is not an artist field`);
  }
  return person;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function personToEntity(person: FamousPerson): SymbolicEntity {
  const id = `person-${slugify(person.name)}`;
  return {
    id,
    name: person.name,
    type: "artist",
    foundingYear: person.year,
    country: person.country,
    emoji: person.emoji,
    description: `${person.name} es una figura de referencia en ${person.field.toLowerCase()}, nacida en ${person.year}.`,
    keyThemes: [person.field, person.westernSign],
    category: person.field,
    sourceNote: `Nacido en ${person.year}. Fuente: famousPeople.ts. Fecha exacta de nacimiento no incluida en esa fuente; se usa el año (cálculo aproximado).`,
    events: [
      {
        id: `${id}-nacimiento`,
        type: "creacion",
        label: "Nacimiento",
        year: person.year,
        description: `${person.name} nace en ${person.year}.`,
        source: "Molino — famousPeople.ts (selección curada)",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  };
}

/** SymbolicEntity records derived from the curated famousPeople.ts selection. */
export const FAMOUS_PEOPLE_ENTITIES: SymbolicEntity[] = SELECTED_PEOPLE.map((sel) =>
  personToEntity(findPerson(sel)),
);
