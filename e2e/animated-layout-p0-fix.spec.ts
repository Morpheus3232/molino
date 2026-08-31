import { test, expect } from "@playwright/test";

// P0 (2026-08-22): AnimatedLayout envolvía cada ruta en <AnimatePresence
// initial={false}><motion.div key={pathname}>. En navegación client-side,
// usePathname() podía actualizarse un render después que React ya pintara
// los children de la ruta nueva; cuando el key finalmente cambiaba,
// AnimatePresence le aplicaba la exit animation (opacity → 0) al nodo que
// ya tenía el contenido nuevo pintado, y nunca volvía a entrar — página en
// blanco permanente hasta refrescar. Fix: motion.div plano sin
// AnimatePresence (remount limpio garantizado en cada cambio de key, sin
// ventana de carrera). Se pierde el crossfade de salida; el fade-in de
// entrada se mantiene.
//
// Fase 5 (2026-08-23): el header pasó a ser contextual — Academia y Mi Mapa
// ya no son links planos sin perfil — estos targets se adaptaron a la
// nueva jerarquía sin cambiar lo que el test verifica: que la navegación
// client-side, sea por link directo o por un link dentro de un dropdown,
// nunca deja la página en blanco.

test.describe("P0 — navegación client-side no deja la página en blanco", () => {
  test("click en un link dentro de un dropdown (Conocimiento → Academia) renderiza contenido visible", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await nav.getByRole("button", { name: "Conocimiento" }).click();
    await page.locator("#knowledge-menu").getByRole("link", { name: "Academia", exact: true }).click();
    await page.waitForURL("**/academy");
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("opacity", "1");
  });

  test("navegación client-side repetida (home → hoy → atlas) no deja blanco", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await nav.getByRole("button", { name: "Tiempo" }).click();
    await page.locator("#time-menu").getByRole("link", { name: "Hoy", exact: true }).click();
    await page.waitForURL("**/hoy");
    await expect(page.locator("body")).toHaveCSS("opacity", "1");

    await nav.getByRole("link", { name: "Atlas", exact: true }).click();
    await page.waitForURL("**/atlas");
    await expect(page.locator("body")).toHaveCSS("opacity", "1");
  });

  test("back/forward tras navegación client-side no deja blanco", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await nav.getByRole("link", { name: "Atlas", exact: true }).click();
    await page.waitForURL("**/atlas");
    await page.goBack();
    await expect(page.locator("body")).toHaveCSS("opacity", "1");
    await page.goForward();
    await expect(page.locator("body")).toHaveCSS("opacity", "1");
  });
});