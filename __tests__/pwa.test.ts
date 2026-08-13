import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("PWA Configuration", () => {
  const rootDir = process.cwd();

  it("has a valid public/manifest.json with all required PWA fields", () => {
    const manifestPath = path.join(rootDir, "public/manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifestContent.name).toBe("Molino");
    expect(manifestContent.short_name).toBe("Molino");
    expect(manifestContent.display).toBe("standalone");
    expect(manifestContent.start_url).toBe("/");
    expect(manifestContent.theme_color).toBe("#0A0A0C");
    expect(manifestContent.background_color).toBe("#0A0A0C");
    expect(Array.isArray(manifestContent.icons)).toBe(true);
    expect(manifestContent.icons.length).toBeGreaterThanOrEqual(2);
  });

  it("has a lightweight public/sw.js service worker under 100 lines", () => {
    const swPath = path.join(rootDir, "public/sw.js");
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, "utf-8");
    const lines = swContent.split("\n");
    expect(lines.length).toBeLessThan(100);
    expect(swContent).toContain("addEventListener('install'");
    expect(swContent).toContain("addEventListener('activate'");
    expect(swContent).toContain("addEventListener('fetch'");
    expect(swContent).toContain("/offline.html");
  });

  it("has an offline fallback page at public/offline.html", () => {
    const offlinePath = path.join(rootDir, "public/offline.html");
    expect(fs.existsSync(offlinePath)).toBe(true);

    const offlineContent = fs.readFileSync(offlinePath, "utf-8");
    expect(offlineContent).toContain("<!DOCTYPE html>");
    expect(offlineContent).toContain("sin conexión");
  });

  it("has high-res PWA icon assets in public/", () => {
    const icon192 = path.join(rootDir, "public/icon-192.svg");
    const icon512 = path.join(rootDir, "public/icon-512.svg");
    expect(fs.existsSync(icon192)).toBe(true);
    expect(fs.existsSync(icon512)).toBe(true);
  });
});
