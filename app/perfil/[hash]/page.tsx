import type { Metadata } from "next";
import type { UserProfile } from "@/types/user";
import { verifyShareToken } from "@/lib/share";
import { resolveShareProfile } from "@/lib/kv";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import ProfileHub from "@/components/profile/ProfileHub";
import { siteUrl } from "@/lib/seo";

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
  const { hash } = await params;
  const payload = verifyShareToken(hash);
  if (!payload) {
    return { title: "Perfil compartido", robots: { index: false, follow: true } };
  }
  return {
    title: "Mapa personal compartido — Molino",
    description: "Mapa personal de autoconocimiento compartido: numerología, astrología y zodíaco chino.",
    robots: { index: false, follow: true },
    alternates: { canonical: siteUrl(`/perfil/${hash}`) },
  };
}

export default async function SharedProfilePage({ params }: Props) {
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
        <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
          Este perfil compartido no existe
        </h1>
        <p className="text-muted mb-8 max-w-md mx-auto">
          El enlace que seguiste podría estar vencido (expira a las 24 horas) o mal formado.
        </p>
      </div>
    );
  }

  return <ProfileHub profile={profile} />;
}
