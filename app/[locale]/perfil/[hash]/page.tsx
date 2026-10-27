import { getL, initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import type { UserProfile } from "@/types/user";
import { verifyShareToken } from "@/lib/share";
import { resolveShareProfile } from "@/lib/kv";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import ProfileHub from "@/components/profile/ProfileHub";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import { siteUrl, localeAlternates } from "@/lib/seo";

/**
 * /perfil/[hash] — resolves a shared profile.
 *
 * [hash] is now an ephemeral JWT share token (see lib/share.ts). The profile
 * is resolved server-side from KV (24h TTL) — no PII in the URL, no
 * LocalStorage round trip. The legacy `decodeProfileHash` (LocalStorage) path
 * in lib/profile/hash.ts is @deprecated and no longer used here.
 */

interface Props {
  params: Promise<{ hash: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const L = await metaL(params);
  const { hash } = await params;
  const payload = verifyShareToken(hash);
  if (!payload) {
    return { title: L("Perfil compartido", "Shared profile"), robots: { index: false, follow: true } };
  }
  return {
    title: L("Mapa personal compartido", "Shared personal map"),
    description: L(
      "Mapa personal de autoconocimiento compartido: numerología, astrología y zodíaco chino.",
      "A shared personal self-knowledge map: numerology, astrology and the Chinese zodiac.",
    ),
    robots: { index: false, follow: true },
    alternates: localeAlternates(`/perfil/${hash}`, L.locale),
  };
}

export default async function SharedProfilePage({ params }: Props) {
  await initLocale(params);
  const L = await getL();
  const { hash } = await params;

  let profile: UserProfile | null = null;

  const payload = verifyShareToken(hash);
  if (payload) {
    const shared = await resolveShareProfile(payload.tid);
    if (shared) {
      const calculated = calculateUserProfile(shared.n || "", shared.b);
      profile = {
        ...calculated,
        name: shared.n || "",
        birthDate: shared.b,
        birthPlace: "",
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
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center min-h-screen">
        <h1 className="page-title text-foreground mb-4">{L("Este perfil compartido no existe", "This shared profile doesn't exist")}</h1>
        <p className="text-muted mb-8 max-w-md mx-auto">{L("El enlace que seguiste podría estar vencido (expira a las 24 horas) o mal formado.", "The link you followed may have expired (it expires after 24 hours) or be malformed.")}</p>
      </div>
    );
  }

  const catalog = SYMBOLIC_ENTITIES.map(toLightweightEntity);

  return <ProfileHub profile={profile} catalog={catalog} />;
}
