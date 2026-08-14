import { NextResponse } from "next/server";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const birthDate = searchParams.get("birthDate") || searchParams.get("date") || searchParams.get("dob");
  const targetDateParam = searchParams.get("targetDate") || searchParams.get("target");

  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return NextResponse.json(
      {
        error: "Formato de fecha de nacimiento inválido",
        message: "Por favor proporciona 'birthDate' o 'date' en formato YYYY-MM-DD.",
        example: "/api/v1/daily?birthDate=1990-03-15",
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  let targetDate = new Date();
  if (targetDateParam && /^\d{4}-\d{2}-\d{2}$/.test(targetDateParam)) {
    targetDate = new Date(`${targetDateParam}T12:00:00Z`);
  }

  try {
    const profile = calculateUserProfile("", birthDate);
    const daily = calculateDailyEnergy(profile, targetDate);

    return NextResponse.json(
      {
        status: "success",
        query: {
          birthDate,
          targetDate: targetDate.toISOString().split("T")[0],
        },
        dailyEnergy: {
          personalDay: daily.personalDay,
          personalYear: daily.personalYear,
          personalMonth: daily.personalMonth,
          theme: daily.theme,
          description: daily.description,
          overallScore: daily.overallScore,
          strengths: daily.strengths,
          cautions: daily.cautions,
          moonPhase: daily.moonPhase,
          areas: daily.areas,
          elementInfluence: daily.elementInfluence,
        },
        meta: {
          calculator: "Molino Daily Engine v2.0",
          privacy: "Zero data saved on servers",
          website: "https://molino.app",
        },
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Error calculando energía diaria",
        message: err?.message || "Ocurrió un error inesperado.",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
