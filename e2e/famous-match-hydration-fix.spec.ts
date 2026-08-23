import { test, expect } from "@playwright/test";

// P0 (2026-08-23): useUserContext() (lib/hooks/useUserContext.ts) resolvía
// resolveUserContext() — que lee localStorage — directo en el inicializador
// de useState. El servidor nunca ve localStorage (siempre country
// undefined), pero el primer render del CLIENTE (el que React compara
// contra el HTML del servidor durante la hidratación) sí, si el visitante
// tenía un país guardado de una visita anterior. FamousMatch usa ese
// country para elegir entre dos algoritmos de selección distintos
// (findFamousMatches con/sin userCountry reparte 5 nacionales + 3
// internacionales vs. sin ese corte) — server y cliente podían armar un
// set de personas distinto, con "Hydration failed" real en consola y la
// animación de entrada del hero framer-motion (animate incondicional, sin
// whileInView) trabada en opacity:0 tras el remount forzado por React.
// Fix: useUserContext ahora parte siempre del mismo default neutro en el
// primer render (servidor y cliente) y resuelve el valor real recién en un
// useEffect post-mount — mismo patrón que ya usaba lib/context/useUserContext.ts.

test.describe("P0 — sin hydration mismatch en FamousMatch (useUserContext)", () => {
  test("/ejemplo no dispara errores de hydration y el hero se pinta", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/ejemplo");
    await page.waitForLoadState("networkidle");

    const hydrationErrors = consoleErrors.filter((e) => /hydration/i.test(e));
    expect(hydrationErrors, `Hydration errors found:\n${hydrationErrors.join("\n\n")}`).toEqual([]);

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("h1").first()).toHaveCSS("opacity", "1");
  });

  test("/profile?dob= (mismo perfil) no dispara errores de hydration", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/profile?dob=1990-03-15");
    await page.waitForLoadState("networkidle");

    const hydrationErrors = consoleErrors.filter((e) => /hydration/i.test(e));
    expect(hydrationErrors, `Hydration errors found:\n${hydrationErrors.join("\n\n")}`).toEqual([]);

    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("/ejemplo reproducido varias veces seguidas — cero hydration errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    for (let i = 0; i < 3; i++) {
      await page.goto("/ejemplo");
      await page.waitForLoadState("networkidle");
    }

    const hydrationErrors = consoleErrors.filter((e) => /hydration/i.test(e));
    expect(hydrationErrors, `Hydration errors found across reloads:\n${hydrationErrors.join("\n\n")}`).toEqual([]);
  });
});
