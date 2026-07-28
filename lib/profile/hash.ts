import type { UserProfile } from "@/types/user";

async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b: number) => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
}

export async function generateProfileHash(profile: UserProfile): Promise<string> {
  const data = JSON.stringify({
    birthDate: profile.birthDate,
    name: profile.name,
    chineseZodiac: profile.chineseZodiac,
  });
  return sha256Hex(data);
}

export function storeSharedProfile(profile: UserProfile, hash: string): void {
  try {
    const stored = localStorage.getItem("molino-shared-profiles");
    const profiles: Record<string, UserProfile> = stored ? JSON.parse(stored) : {};
    profiles[hash] = profile;
    localStorage.setItem("molino-shared-profiles", JSON.stringify(profiles));
  } catch {}
}

export function decodeProfileHash(hash: string): UserProfile | null {
  try {
    const stored = localStorage.getItem("molino-shared-profiles");
    if (!stored) return null;
    const profiles: Record<string, UserProfile> = JSON.parse(stored);
    return profiles[hash] || null;
  } catch {
    return null;
  }
}