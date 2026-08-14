import { NextResponse } from "next/server";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { calculateCoupleCompatibility } from "@/lib/engines/coupleEngine";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateA = searchParams.get("dateA") || searchParams.get("a");
  const dateB = searchParams.get("dateB") || searchParams.get("b");
  const nameA = searchParams.get("nameA") || searchParams.get("na") || "Persona A";
  const nameB = searchParams.get("nameB") || searchParams.get("nb") || "Persona B";

  if (!dateA || !dateB || !/^\d{4}-\d{2}-\d{2}$/.test(dateA) || !/^\d{4}-\d{2}-\d{2}$/.test(dateB)) {
    return NextResponse.json(
      {
        error: "Fechas inválidas",
        message: "Por favor proporciona 'dateA' y 'dateB' en formato YYYY-MM-DD.",
        example: "/api/v1/compatibility?dateA=1990-03-15&dateB=1988-07-22&nameA=Ana&nameB=Lucas",
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const profileA = calculateUserProfile(nameA, dateA);
    const profileB = calculateUserProfile(nameB, dateB);
    const compatibility = calculateCoupleCompatibility(profileA, profileB);

    return NextResponse.json(
      {
        status: "success",
        query: {
          personA: { name: nameA, birthDate: dateA },
          personB: { name: nameB, birthDate: dateB },
        },
        compatibility: {
          score: compatibility.score,
          level: compatibility.level,
          summary: compatibility.summary,
          dailyAdvice: compatibility.dailyAdvice,
          connections: compatibility.connections,
          challenges: compatibility.challenges,
          elements: {
            personA: profileA.element,
            personB: profileB.element,
          },
          lifePaths: {
            personA: profileA.lifePath,
            personB: profileB.lifePath,
          },
        },
        meta: {
          calculator: "Molino Couple Engine v2.0",
          privacy: "Zero server storage",
          website: "https://molino.app",
        },
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Error calculando compatibilidad",
        message: err?.message || "Ocurrió un error inesperado.",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
