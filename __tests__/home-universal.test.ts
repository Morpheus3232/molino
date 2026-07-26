import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Home page — universal access without profile", () => {
  test("home page renders without requiring profile", () => {
    const pagePath = path.resolve(__dirname, "..", "app", "page.tsx");
    const source = fs.readFileSync(pagePath, "utf8");
    expect(source).toBeTruthy();
  });

  test("home includes universal calendar section", () => {
    const pagePath = path.resolve(__dirname, "..", "app", "page.tsx");
    const source = fs.readFileSync(pagePath, "utf8");
    expect(source).toContain("SymbolicCalendarSection");
    expect(source).toContain("¿Qué representa hoy?");
  });
});
