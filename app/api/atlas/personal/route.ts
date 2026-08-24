import { NextResponse } from "next/server";
import { getPersonalAtlas } from "@/lib/data/atlas-queries";
import { ANIMALS, type Animal } from "@/lib/data/animalRelations";

/**
 * Atlas Personal — piloto (university/team/artist). Existe para mantener
 * SYMBOLIC_ENTITIES/getPersonalAtlas (server-only) fuera del bundle de
 * cliente: AtlasHub llama a esta ruta con el animal y el país (ISO,
 * opcional) ya resueltos en el navegador y recibe solo LightweightEntity[]
 * + el nivel de fallback alcanzado por cada grupo — mismo patrón que
 * /api/hoy/afinidad-del-dia.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const animalParam = searchParams.get("animal");
  const countryISO = searchParams.get("countryISO") || undefined;

  if (!animalParam || !ANIMALS.includes(animalParam as Animal)) {
    return NextResponse.json(
      {
        error: "Parámetro 'animal' inválido o ausente.",
        example: "/api/atlas/personal?animal=Caballo&countryISO=AR",
      },
      { status: 400 }
    );
  }

  const result = getPersonalAtlas({ animal: animalParam as Animal, countryISO });

  return NextResponse.json(result, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
