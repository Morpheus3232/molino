import { describe, it, expect, beforeEach } from "vitest";
import {
  getSavedProfilesVault,
  saveProfileToVault,
  deleteProfileFromVault,
  getActiveVaultProfileId,
  setActiveVaultProfileId,
  clearProfilesVault,
} from "@/lib/session/multiProfiles";

describe("Local Profiles Vault (Multi-Profile Session)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty vault", () => {
    const vault = getSavedProfilesVault();
    expect(vault).toEqual([]);
    expect(getActiveVaultProfileId()).toBeNull();
  });

  it("saves a profile to vault and sets it as active", () => {
    const item1 = saveProfileToVault({
      label: "Mi Mapa",
      name: "Ana",
      birthDate: "1990-03-15",
      lifePath: 1,
      sunSign: "Piscis",
      chineseZodiac: "Caballo",
    });

    expect(item1.id).toBeDefined();
    expect(getActiveVaultProfileId()).toBe(item1.id);

    let vault = getSavedProfilesVault();
    expect(vault.length).toBe(1);
    expect(vault[0].label).toBe("Mi Mapa");

    // Save with same birthDate but new label -> updates label without duplicate
    saveProfileToVault({
      label: "Ana (Principal)",
      name: "Ana",
      birthDate: "1990-03-15",
      lifePath: 1,
      sunSign: "Piscis",
      chineseZodiac: "Caballo",
    });

    vault = getSavedProfilesVault();
    expect(vault.length).toBe(1);
    expect(vault[0].label).toBe("Ana (Principal)");

    // Save second profile
    const item2 = saveProfileToVault({
      label: "Lucas (Pareja)",
      name: "Lucas",
      birthDate: "1988-07-22",
      lifePath: 7,
      sunSign: "Cáncer",
      chineseZodiac: "Dragón",
    });

    vault = getSavedProfilesVault();
    expect(vault.length).toBe(2);
    expect(getActiveVaultProfileId()).toBe(item2.id);
  });

  it("allows setting and getting active vault profile ID", () => {
    const p1 = saveProfileToVault({
      label: "Perfil 1",
      birthDate: "1990-01-01",
      lifePath: 2,
      sunSign: "Capricornio",
      chineseZodiac: "Caballo",
    });

    const p2 = saveProfileToVault({
      label: "Perfil 2",
      birthDate: "1995-05-05",
      lifePath: 6,
      sunSign: "Tauro",
      chineseZodiac: "Cerdo",
    });

    expect(getActiveVaultProfileId()).toBe(p2.id);

    setActiveVaultProfileId(p1.id);
    expect(getActiveVaultProfileId()).toBe(p1.id);
  });

  it("deletes a profile from vault and updates active ID if needed", () => {
    const p1 = saveProfileToVault({
      label: "Perfil 1",
      birthDate: "1990-01-01",
      lifePath: 2,
      sunSign: "Capricornio",
      chineseZodiac: "Caballo",
    });

    const p2 = saveProfileToVault({
      label: "Perfil 2",
      birthDate: "1995-05-05",
      lifePath: 6,
      sunSign: "Tauro",
      chineseZodiac: "Cerdo",
    });

    expect(getSavedProfilesVault().length).toBe(2);

    deleteProfileFromVault(p2.id);
    const updated = getSavedProfilesVault();
    expect(updated.length).toBe(1);
    expect(updated[0].id).toBe(p1.id);
    expect(getActiveVaultProfileId()).toBe(p1.id);

    deleteProfileFromVault(p1.id);
    expect(getSavedProfilesVault().length).toBe(0);
    expect(getActiveVaultProfileId()).toBeNull();
  });

  it("clears all profiles from vault", () => {
    saveProfileToVault({
      label: "Perfil 1",
      birthDate: "1990-01-01",
      lifePath: 2,
      sunSign: "Capricornio",
      chineseZodiac: "Caballo",
    });
    saveProfileToVault({
      label: "Perfil 2",
      birthDate: "1995-05-05",
      lifePath: 6,
      sunSign: "Tauro",
      chineseZodiac: "Cerdo",
    });

    expect(getSavedProfilesVault().length).toBe(2);
    clearProfilesVault();
    expect(getSavedProfilesVault()).toEqual([]);
    expect(getActiveVaultProfileId()).toBeNull();
  });
});
