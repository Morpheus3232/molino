import { test, expect } from "@playwright/test";

// P0 (2026-08-23): useRevealFallback forzaba `animate` tras 1.5s del montaje
// del componente Reveal/Section/EditorialSection, sin importar la posición
// del elemento — en páginas largas con varios <Reveal> apilados (ej.
// NumerologiaContent, 14 bloques), TODOS montan casi al mismo tiempo al
// cargar la página, así que cualquier usuario que tardara >1.5s en
// scrollear ya encontraba el contenido below-the-fold pre-revelado,
// reproduciendo el mismo efecto que Tramo B (animate incondicional) que
// esta iniciativa buscaba evitar. Fix: el hook ahora mide la posición real
// del elemento (getBoundingClientRect via ref) antes de forzar animate, y
// solo lo hace si está cerca del viewport — below-the-fold sigue
// dependiendo de whileInView como siempre.

test.describe("Reveal fallback — solo actúa cerca del viewport", () => {
  test("hero above-the-fold se revela normalmente sin esperar scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/conocimiento/numerologia");
    await expect(page.getByRole("heading", { name: "Numerología", level: 1 })).toHaveCSS("opacity", "1");
  });

  test("bloque muy below-the-fold NO se revela anticipadamente a los 1.5s+", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/conocimiento/numerologia");

    const farBlock = page.locator("#fuentes");
    const box = await farBlock.boundingBox();
    // Guard: confirma que el bloque efectivamente arranca fuera de viewport.
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThan(900);

    // Esperá más que el timeout del failsafe (1.5s) sin scrollear.
    await page.waitForTimeout(2200);
    await expect(farBlock).toHaveCSS("opacity", "0");
  });

  test("ese mismo bloque SÍ se revela por whileInView al scrollearlo a la vista", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/conocimiento/numerologia");

    const farBlock = page.locator("#fuentes");
    await farBlock.scrollIntoViewIfNeeded();
    await expect(farBlock).toHaveCSS("opacity", "1");
  });
});
