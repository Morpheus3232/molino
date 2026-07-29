import type { Metadata } from "next";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import { decodeProfileData } from "@/lib/utils/profileShare";
import ProfileClient from "@/components/profile/ProfileClient";
import type { UserProfile } from "@/types/user";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ dob?: string; data?: string; tab?: string }>;
}

function buildProfile(calculated: UserProfile, name: string, birthDate: string): UserProfile {
  return {
    ...calculated,
    name,
    birthDate,
    birthPlace: "",
    birthTime: undefined,
    goal: "life" as const,
    interests: [],
    onboardingStep: 4,
    completedSections: ["identity"],
    theme: "light" as const,
    language: "es" as const,
    notifications: true,
    cycles: calculated.cycles || { personalYear: 0, personalMonth: 0, personalDay: 0 },
    recommendations: calculated.recommendations || { strengths: [], challenges: [], practices: [] },
  };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const dob = params.dob;
  const dataParam = params.data;
  let name = "Visitante";
  let birthDate = dob || "";

  if (dataParam) {
    try {
      const decoded = decodeProfileData(dataParam);
      if (decoded) {
        name = decoded.n;
        birthDate = decoded.b;
      }
    } catch {}
  }

  const hasData = Boolean(dob || dataParam);
  const dateStr = birthDate
    ? new Date(birthDate + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return {
    title: hasData ? `Mapa de ${name} | Molino` : "Tu Mapa Personal | Molino",
    description: hasData
      ? `Mapa personal de autoconocimiento de ${name}, nacido el ${dateStr}. Numerología, astrología y zodíaco chino en un solo perfil.`
      : "Tu perfil de autoconocimiento: identidad simbólica, afinidades y conexiones profundas. Descubrí tu mapa en Molino.",
    openGraph: {
      title: hasData ? `Mapa de ${name} — Molino` : "Tu Mapa Personal — Molino",
      description: hasData
        ? `Perfil completo de ${name}: Camino de Vida, signo solar y animal del zodíaco chino.`
        : "Tu perfil de autoconocimiento con numerología, astrología y zodíaco chino.",
      type: "profile",
    },
  };
}

export default async function ProfilePage({ searchParams }: Props) {
  const params = await searchParams;
  const dob = params.dob;
  const dataParam = params.data;
  const tab = params.tab || null;

  let profile: UserProfile | null = null;

  if (dataParam) {
    try {
      const decoded = decodeProfileData(dataParam);
      if (decoded?.n && decoded?.b) {
        const calculated = calculateUserProfile(decoded.n, decoded.b);
        profile = buildProfile(calculated, decoded.n, decoded.b);
      }
    } catch {}
  }

  if (!profile && dob && /^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    try {
      const calculated = calculateUserProfile("Visitante", dob);
      profile = buildProfile(calculated, "Visitante", dob);
    } catch {}
  }

  return <ProfileClient serverProfile={profile} initialTab={tab} />;
}
