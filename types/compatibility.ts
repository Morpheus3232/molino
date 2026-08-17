/**
 * Shape of the `target` side of a compatibility calculation. Two real
 * shapes flow through this same parameter across the pipeline
 * (calculateCompatibility → aiEngine/providerRouter/omnirouteRouter):
 *
 * - Person-to-person: a partial UserProfile-like object (lifePath, sunSign,
 *   chineseZodiac, archetype, element, birthDate, name).
 * - Person-to-entity: an EntityProfile-like object (lib/data/entities.ts),
 *   which additionally carries `category` and `context.description`/
 *   `context.keyThemes` — used to build the AI prompt.
 *
 * All fields optional and flat (not `Partial<EntityProfile>`) because the
 * person-to-person call sites never have `category`/`context` at all, and
 * every accessor in aiEngine.ts/omnirouteRouter.ts/compatibilityEngine.ts
 * already guards with `?.`/`||` — the union has always been used as "best
 * effort, whatever fields exist."
 */
export interface CompatibilityTarget {
  name?: string;
  lifePath?: number;
  birthDate?: string;
  sunSign?: string;
  chineseZodiac?: string;
  archetype?: string;
  element?: string;
  /** Entity-only (lib/data/entities.ts EntityCategory), absent for person-to-person. */
  category?: string;
  /** Entity-only, absent for person-to-person. */
  context?: {
    description?: string;
    keyThemes?: string[];
  };
}
