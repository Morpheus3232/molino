import { NextResponse } from "next/server";
import { getEntitiesByAnimalWithCountries } from "@/lib/data/atlas-queries";
import { ANIMALS, getRelation, getFriends, getClashPartner, type Animal } from "@/lib/data/animalRelations";
import type { LightweightEntity } from "@/types/atlas";

/**
 * Afinidad del día para el Consejo del Momento de /hoy.
 *
 * Existe solo para mantener SYMBOLIC_ENTITIES (la capa rica, server-only)
 * fuera del bundle de /hoy — no es un motor nuevo: reusa getRelation()/
 * getFriends()/getClashPartner() de animalRelations.ts (misma fuente que
 * /affinity/[type]) y getEntitiesByAnimalWithCountries() de atlas-queries.ts.
 */

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Candidatas: mismo animal + ambos socios de triada + el opuesto — las
 * mismas 3 relaciones que ya agrupa AffinityTypeContent (Mismo animal /
 * Triada / Opuesto). Ordenadas por id para que el índice determinístico
 * sea estable sin depender del orden de inserción del catálogo.
 */
function collectCandidates(animal: Animal): LightweightEntity[] {
  const triadAnimals = getFriends(animal).map((r) => r.animal);
  const clashAnimal = getClashPartner(animal);
  const sourceAnimals = [animal, ...triadAnimals, ...(clashAnimal ? [clashAnimal] : [])];

  const seen = new Set<string>();
  const candidates: LightweightEntity[] = [];
  for (const sourceAnimal of sourceAnimals) {
    for (const entity of getEntitiesByAnimalWithCountries(sourceAnimal)) {
      if (seen.has(entity.id)) continue;
      seen.add(entity.id);
      candidates.push(entity);
    }
  }
  return candidates.sort((a, b) => a.id.localeCompare(b.id));
}

/** Índice determinístico — sin Math.random(), depende solo de fecha + animal. */
function pickIndex(date: string, animal: Animal, length: number): number {
  const dateSeed = Number(date.replace(/-/g, "")) || 0;
  const animalSeed = ANIMALS.indexOf(animal);
  return ((dateSeed + animalSeed) % length + length) % length;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const animalParam = searchParams.get("animal");
  const dateParam = searchParams.get("date");

  if (!animalParam || !ANIMALS.includes(animalParam as Animal)) {
    return NextResponse.json(
      { error: "Parámetro 'animal' inválido o ausente.", example: "/api/hoy/afinidad-del-dia?animal=Caballo&date=2026-08-23" },
      { status: 400 }
    );
  }
  if (!dateParam || !DATE_RE.test(dateParam)) {
    return NextResponse.json(
      { error: "Parámetro 'date' inválido o ausente (formato YYYY-MM-DD).", example: "/api/hoy/afinidad-del-dia?animal=Caballo&date=2026-08-23" },
      { status: 400 }
    );
  }

  const animal = animalParam as Animal;
  const candidates = collectCandidates(animal);
  if (candidates.length === 0) {
    return NextResponse.json({ entity: null, relation: null }, { status: 200 });
  }

  const index = pickIndex(dateParam, animal, candidates.length);
  const entity = candidates[index];
  const relation = getRelation(animal, entity.animal as Animal);

  // Verificación de coherencia: collectCandidates solo trae entidades de
  // los 3 animales-fuente (mismo/triada/opuesto), así que esto nunca
  // debería fallar — es la garantía pedida, no una segunda regla.
  if (relation.type !== "same" && relation.type !== "triad" && relation.type !== "clash") {
    return NextResponse.json({ entity: null, relation: null }, { status: 200 });
  }

  return NextResponse.json(
    {
      entity: { id: entity.id, name: entity.name, type: entity.type },
      relation: relation.type,
      relationLabel: relation.label,
    },
    {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    }
  );
}
