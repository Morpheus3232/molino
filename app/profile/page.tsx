import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { decodeProfileData, profileFromEncoded } from "@/lib/utils/profileShare";
import { verifyShareToken } from "@/lib/share";
import { resolveShareProfile } from "@/lib/kv";
import ProfileClient from "@/components/profile/ProfileClient";
import type { UserProfile } from "@/types/user";
import { formatDate } from "@/lib/i18n/format";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ dob?: string; data?: string; share?: string }>;
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
  const shareToken = params.share;
  let name = "";
  let birthDate = dob || "";

  // `?share=` (JWT, PII-free) es el flujo de compartir preferido — el token
  // no lleva nombre ni fecha, solo un id que resuelve contra KV server-side.
  // Antes de este cambio esta rama no generaba metadata dinámica y caía al
  // fallback genérico, mientras que el `?data=` legacy (que sí expone PII en
  // la URL) sí la tenía — priorizar el share seguro es la dirección correcta.
  if (shareToken) {
    const payload = verifyShareToken(shareToken);
    const stored = payload ? await resolveShareProfile(payload.tid) : null;
    if (stored) {
      name = stored.n || "";
      birthDate = stored.b;
    }
  } else if (dataParam) {
    try {
      const decoded = decodeProfileData(dataParam);
      if (decoded) {
        name = decoded.n;
        birthDate = decoded.b;
      }
    } catch {}
  }

  const hasData = Boolean(shareToken || dob || dataParam);
  const dateStr = birthDate
    ? formatDate(new Date(birthDate + "T00:00:00"), { day: "numeric", month: "long", year: "numeric" })
    : "";
  // El onboarding es birthDate-first: casi nunca hay un name real acá. Cuando
  // no hay nombre, "Tu Mapa" en vez de "Mapa de tu" (que no cierra en español).
  const titleBase = name ? `Mapa de ${name}` : "Tu Mapa";

  // lifePath y archetype ya se tratan como dato público compartible en
  // /circulo y /mundo (ver PublicShareData en lib/utils/profileShare.ts) —
  // usarlos en el title/OG de un mapa compartido no expone nada nuevo.
  let lifePath: number | null = null;
  let archetype = "";
  if (hasData && birthDate) {
    try {
      const calculated = calculateUserProfile(name, birthDate);
      lifePath = calculated.lifePath ?? null;
      archetype = calculated.archetype || calculated.archetypeInfo?.name || "";
    } catch {}
  }

  const socialTitle = lifePath
    ? `El Camino de Vida de ${name || "este mapa"} es ${lifePath} 🔮`
    : hasData
      ? `${titleBase}`
      : "Tu Mapa Personal";
  const socialDescription = hasData
    ? `Descubrí la síntesis de numerología, astrología y zodíaco chino${name ? ` de ${name}` : ""}. 100% privado y gratuito en Molino.app.`
    : "Tu perfil de autoconocimiento con numerología, astrología y zodíaco chino.";
  const ogImage = lifePath
    ? siteUrl(
        `/api/og?l=${lifePath}${name ? `&n=${encodeURIComponent(name)}` : ""}${
          archetype ? `&a=${encodeURIComponent(archetype)}` : ""
        }`,
      )
    : undefined;

  return {
    title: hasData ? (lifePath ? `Camino de Vida ${lifePath}${name ? ` de ${name}` : ""}` : titleBase) : "Tu Mapa Personal",
    description: hasData
      ? `Mapa personal de autoconocimiento${name ? ` de ${name}` : ""}, nacido el ${dateStr}. Numerología, astrología y zodíaco chino en un solo perfil.`
      : "Tu perfil de autoconocimiento: identidad simbólica, afinidades y conexiones profundas. Descubrí tu mapa en Molino.",
    // Un perfil con datos (?dob=, ?data= o ?share=) es contenido personal de
    // una sola persona -- no tiene sentido indexarlo ni canonicalizarlo entre
    // sí con los de otros usuarios. Solo la landing "vacía" es indexable.
    ...(hasData
      ? { robots: { index: false, follow: true } }
      : { alternates: { canonical: siteUrl("/profile") } }),
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      type: "profile",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function ProfilePage({ searchParams }: Props) {
  const params = await searchParams;
  const dob = params.dob;
  const dataParam = params.data;

  let profile: UserProfile | null = null;

  if (dataParam) {
    try {
      profile = profileFromEncoded(dataParam);
    } catch {}
  }

  if (!profile && dob && /^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birthDate = new Date(dob + "T00:00:00");
    if (birthDate > today) {
      return <ProfileClient serverProfile={null} futureDateError={true} />;
    }
    try {
      const calculated = calculateUserProfile("", dob);
      profile = buildProfile(calculated, "", dob);
    } catch {}
  }

  const catalog = SYMBOLIC_ENTITIES.map(toLightweightEntity);

  return <ProfileClient serverProfile={profile} catalog={catalog} />;
}
