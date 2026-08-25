import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";

function read(relPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, "..", relPath), "utf8");
}

// Regresión (2026-08-22): email público de contacto/soporte actualizado de
// hola@molino.app a versionlimitada@proton.me en todos los puntos donde
// aparece como texto de contacto (nunca como remitente de Resend, así que
// no afecta el envío de emails transaccionales).
const FILES_WITH_CONTACT_EMAIL = [
  "components/layout/UniversityFooter.tsx",
  "app/nosotros/page.tsx",
  "app/nosotros/NosotrosContent.tsx",
  "app/transparencia/page.tsx",
  "app/api/mp/verify/route.ts",
  "app/api/mp/coupon/route.ts",
  "app/api/mp/recover/route.ts",
  "app/api/premium/claim/route.ts",
];

describe("Email de contacto público", () => {
  test.each(FILES_WITH_CONTACT_EMAIL)("%s usa versionlimitada@proton.me, no hola@molino.app", (relPath) => {
    const src = read(relPath);
    expect(src).toContain("versionlimitada@proton.me");
    expect(src).not.toContain("hola@molino.app");
  });
});
