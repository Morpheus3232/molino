export type EntityGender = "masculine" | "feminine";

const GENDER_BY_TYPE: Record<string, EntityGender> = {
  country: "masculine",
  city: "feminine",
  brand: "feminine",
  team: "masculine",
  university: "feminine",
  artist: "masculine",
  movie: "feminine",
  football_player: "masculine",
};

const GENDER_BY_LABEL: Record<string, EntityGender> = {
  país: "masculine",
  países: "masculine",
  ciudad: "feminine",
  ciudades: "feminine",
  marca: "feminine",
  marcas: "feminine",
  equipo: "masculine",
  equipos: "masculine",
  club: "masculine",
  clubes: "masculine",
  universidad: "feminine",
  universidades: "feminine",
  artista: "masculine",
  artistas: "masculine",
  famoso: "masculine",
  famosos: "masculine",
  película: "feminine",
  películas: "feminine",
  jugador: "masculine",
  jugadores: "masculine",
};

export function getEntityGender(keyOrType: string): EntityGender {
  const normalized = keyOrType.toLowerCase().trim();
  return GENDER_BY_TYPE[normalized] ?? GENDER_BY_LABEL[normalized] ?? "masculine";
}

/**
 * Devuelve "todos los [plural]" o "todas las [plural]" con concordancia de género correcta.
 * Ejemplos:
 * - formatAllEntities("country", "Países") -> "todos los países"
 * - formatAllEntities("city", "Ciudades") -> "todas las ciudades"
 */
export function formatAllEntities(typeOrLabel: string, pluralName: string): string {
  const gender = getEntityGender(typeOrLabel || pluralName);
  const article = gender === "feminine" ? "todas las" : "todos los";
  return `${article} ${pluralName.toLowerCase()}`;
}

/**
 * Devuelve "Ver todos los [plural]" o "Ver todas las [plural]".
 */
export function formatViewAll(typeOrLabel: string, pluralName: string): string {
  return `Ver ${formatAllEntities(typeOrLabel, pluralName)}`;
}

/**
 * Devuelve "Otros [plural]" u "Otras [plural]".
 */
export function formatOtherEntities(typeOrLabel: string, pluralName: string): string {
  const gender = getEntityGender(typeOrLabel || pluralName);
  const prefix = gender === "feminine" ? "Otras" : "Otros";
  return `${prefix} ${pluralName.toLowerCase()}`;
}
