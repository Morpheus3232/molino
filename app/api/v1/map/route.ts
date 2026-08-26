import { NextResponse } from "next/server";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";

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
  const date = searchParams.get("date") || searchParams.get("dob");
  const name = searchParams.get("name") || "";

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      {
        error: "Formato de fecha inválido",
        message: "Por favor proporciona el parámetro 'date' en formato YYYY-MM-DD (ej: 1990-03-15).",
        docs: "https://molino.app/docs",
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const profile = calculateUserProfile(name.trim(), date);
    const daily = calculateDailyEnergy(profile, new Date());

    const responseData = {
      status: "success",
      query: {
        date,
        name: name || undefined,
      },
      map: {
        numerology: {
          lifePath: profile.lifePath,
          luckyNumber: profile.luckyNumber,
          expressionNumber: profile.expressionNumber,
          personalityNumber: profile.personalityNumber,
          archetype: profile.archetype,
        },
        astrology: {
          sunSign: profile.sunSign,
          element: profile.element,
          modality: profile.modality,
          symbol: profile.sunSignInfo?.symbol,
        },
        chineseZodiac: {
          animal: profile.chineseZodiac,
          element: profile.chineseZodiacInfo?.element,
          emoji: profile.chineseZodiacInfo?.emoji,
        },
        cycles: {
          personalYear: daily.personalYear,
          personalMonth: daily.personalMonth,
          personalDay: daily.personalDay,
          theme: daily.theme,
          moonPhase: daily.moonPhase?.phase,
        },
      },
      meta: {
        calculator: "Molino Engine v2.0",
        license: "Open Source / MIT",
        website: "https://molino.app",
      },
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Error en el cálculo",
        message: err?.message || "No se pudo procesar la fecha proporcionada.",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
