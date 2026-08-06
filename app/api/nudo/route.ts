import { NextRequest, NextResponse } from "next/server";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { detectarNudo, type NudoInput, type NudoResult } from "@/lib/engines/nudoEngine";

interface RequestBody {
  dob: string;
  name?: string;
  context: NudoInput["context"];
  payload: unknown;
}

function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dob, name, context, payload } = body as RequestBody;

    if (!dob || !isValidDate(dob)) {
      return NextResponse.json({ error: "Invalid or missing birth date" }, { status: 400 });
    }

    if (!context) {
      return NextResponse.json({ error: "Missing context" }, { status: 400 });
    }

    const profile = calculateUserProfile(name || "", dob);

    const input: NudoInput = { profile, context, payload };
    const nudo: NudoResult = detectarNudo(input);

    return NextResponse.json({ nudo, trace: nudo.trace });
  } catch (error) {
    console.error("[/api/nudo] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}