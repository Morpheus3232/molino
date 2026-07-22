import type { UserProfile } from "@/lib/engines/compatibilityEngine";

export function buildIdentitySentence(profile: UserProfile): string {
  const parts: string[] = [];

  if (profile.lifePath) {
    const archetype = profile.archetypeInfo?.name || profile.archetype;
    parts.push(`Life Path ${profile.lifePath}`);
  }

  if (profile.element && profile.modality) {
    parts.push(`${profile.element} ${profile.modality}`);
  }

  if (profile.sunSign) {
    parts.push(profile.sunSign);
  }

  if (profile.chineseZodiac) {
    parts.push(profile.chineseZodiac);
  }

  if (parts.length === 0) return "Tu perfil simbólico está en construcción.";

  const middle = parts.slice(1, -1).join(" · ");
  const last = parts[parts.length - 1];

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} · ${last}`;

  return `${parts[0]} · ${middle} · ${last}`;
}
