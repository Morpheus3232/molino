"use client";

export interface VaultProfileItem {
  id: string;
  label: string; // ej: "Mi Mapa", "Lucas (Pareja)", "Mamá", "Socio"
  name?: string;
  birthDate: string; // YYYY-MM-DD
  lifePath: number;
  sunSign: string;
  chineseZodiac: string;
  savedAt: string;
}

const VAULT_STORAGE_KEY = "molino.profiles-vault.v1";
const ACTIVE_VAULT_ID_KEY = "molino.active-vault-id.v1";

function emitVaultChange() {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new Event("molino-vault-updated"));
    } catch {}
  }
}

export function getSavedProfilesVault(): VaultProfileItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProfileToVault(
  profile: Omit<VaultProfileItem, "id" | "savedAt"> & { id?: string }
): VaultProfileItem {
  if (typeof window === "undefined") {
    return {
      ...profile,
      id: profile.id || `profile-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
  }

  const existing = getSavedProfilesVault();
  const id = profile.id || `vault-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const item: VaultProfileItem = {
    ...profile,
    id,
    savedAt: new Date().toISOString(),
  };

  const filtered = existing.filter((p) => p.id !== id && p.birthDate !== profile.birthDate);
  const updated = [item, ...filtered].slice(0, 30); // max 30 perfiles locales

  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_VAULT_ID_KEY, id);
    emitVaultChange();
  } catch (err) {
    console.error("[Vault] Error guardando perfil en bóveda local:", err);
  }

  return item;
}

export function deleteProfileFromVault(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedProfilesVault();
    const updated = existing.filter((p) => p.id !== id);
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));

    if (getActiveVaultProfileId() === id) {
      if (updated.length > 0) {
        localStorage.setItem(ACTIVE_VAULT_ID_KEY, updated[0].id);
      } else {
        localStorage.removeItem(ACTIVE_VAULT_ID_KEY);
      }
    }
    emitVaultChange();
  } catch {}
}

export function getActiveVaultProfileId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_VAULT_ID_KEY);
  } catch {
    return null;
  }
}

export function setActiveVaultProfileId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_VAULT_ID_KEY, id);
    emitVaultChange();
  } catch {}
}

export function clearProfilesVault(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(VAULT_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_VAULT_ID_KEY);
    emitVaultChange();
  } catch {}
}
