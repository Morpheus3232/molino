import { test, expect, type Page, type Locator } from "@playwright/test";

/**
 * La hoja del diario con formato a la vista (Tiptap). Diez cosas que tienen
 * que andar siempre, probadas en un navegador de verdad.
 */

const MOD = process.platform === "darwin" ? "Meta" : "Control";

async function openSheet(page: Page): Promise<Locator> {
  await page.goto("/journal");
  await page.evaluate(() => localStorage.removeItem("molino.journal-draft.v1"));
  await page.reload();
  const sheet = page.getByRole("textbox", { name: "Lo que querés escribir hoy" });
  await expect(sheet).toBeVisible();
  await sheet.click();
  return sheet;
}

/** Selecciona una palabra (como un doble clic) dentro de la hoja. */
async function selectWord(page: Page, sheet: Locator, word: string) {
  await sheet.evaluate((el, w) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = walker.nextNode())) {
      const i = (n.textContent ?? "").indexOf(w);
      if (i >= 0) {
        const r = document.createRange();
        r.setStart(n, i);
        r.setEnd(n, i + w.length);
        const s = window.getSelection()!;
        s.removeAllRanges();
        s.addRange(r);
        return;
      }
    }
    throw new Error(`no está "${w}"`);
  }, word);
  // ProseMirror toma la selección del DOM en el próximo ciclo.
  await page.waitForTimeout(150);
}

const bubble = (page: Page) => page.getByRole("toolbar", { name: "Formato de la selección" });

test.describe("Diario — la hoja con formato", () => {
  test("1. se escribe y cuenta palabras", async ({ page }) => {
    const sheet = await openSheet(page);
    await page.keyboard.type("Hoy salí a caminar temprano");
    await expect(sheet).toHaveText("Hoy salí a caminar temprano");
    await expect(page.getByText("5 palabras", { exact: false })).toBeVisible();
  });

  test("2. al seleccionar aparece la barra, arriba de la selección y sin taparse con el menú", async ({ page }) => {
    const sheet = await openSheet(page);
    await page.keyboard.type("Hoy salí a caminar temprano");
    await selectWord(page, sheet, "caminar");
    const bar = bubble(page);
    await expect(bar).toBeVisible();
    const barBox = (await bar.boundingBox())!;
    const header = await page.locator("header").first().boundingBox();
    expect(barBox.y).toBeGreaterThanOrEqual((header?.y ?? 0) + (header?.height ?? 0) - 1);
  });

  test("3. negrita se ve como negrita (sin asteriscos) y se puede sacar", async ({ page }) => {
    const sheet = await openSheet(page);
    await page.keyboard.type("Hoy salí a caminar temprano");
    await selectWord(page, sheet, "caminar");
    await bubble(page).getByRole("button", { name: "Negrita" }).click();
    await expect(sheet.locator("strong")).toHaveText("caminar");
    await expect(sheet).not.toContainText("*");
    await expect(bubble(page).getByRole("button", { name: "Negrita" })).toHaveAttribute("aria-pressed", "true");
    await bubble(page).getByRole("button", { name: "Negrita" }).click();
    await expect(sheet.locator("strong")).toHaveCount(0);
  });

  test("4. atajos: cursiva y resaltado", async ({ page }) => {
    const sheet = await openSheet(page);
    await page.keyboard.type("una frase importante de hoy");
    await selectWord(page, sheet, "frase");
    await page.keyboard.press(`${MOD}+i`);
    await expect(sheet.locator("em")).toHaveText("frase");
    await selectWord(page, sheet, "importante");
    await page.keyboard.press(`${MOD}+e`);
    await expect(sheet.locator("mark")).toHaveText("importante");
    await expect(sheet).not.toContainText("==");
  });

  test("5. escribir en markdown aplica el formato solo", async ({ page }) => {
    const sheet = await openSheet(page);
    await page.keyboard.type("algo **fuerte** y ==claro== ");
    await expect(sheet.locator("strong")).toHaveText("fuerte");
    await expect(sheet.locator("mark")).toHaveText("claro");
    await expect(sheet).not.toContainText("**");
  });

  test("6. cita y lista escribiendo > y -", async ({ page }) => {
    const sheet = await openSheet(page);
    await page.keyboard.type("> lo que me dijo");
    await expect(sheet.locator("blockquote")).toHaveText("lo que me dijo");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.keyboard.type("- pan");
    await page.keyboard.press("Enter");
    await page.keyboard.type("leche");
    await expect(sheet.locator("ul li")).toHaveCount(2);
  });

  test("7. cada botón se apaga tocándolo de nuevo, y ⌘Z deshace", async ({ page }) => {
    const sheet = await openSheet(page);
    await page.keyboard.type("palabra suelta");
    await selectWord(page, sheet, "palabra");
    await bubble(page).getByRole("button", { name: "Resaltar" }).click();
    await expect(sheet.locator("mark")).toHaveCount(1);
    await bubble(page).getByRole("button", { name: "Resaltar" }).click();
    await expect(sheet.locator("mark")).toHaveCount(0);
    await page.keyboard.press(`${MOD}+z`);
    await expect(sheet.locator("mark")).toHaveCount(1);
  });

  test("8. la hoja vacía muestra la pregunta del día, sin carteles de ayuda", async ({ page }) => {
    await openSheet(page);
    await expect(page.locator(".ProseMirror p.is-editor-empty").first()).toHaveAttribute("data-placeholder", /\?$/);
    await expect(page.getByText(/Seleccioná una parte del texto/)).toHaveCount(0);
    await expect(page.getByRole("toolbar", { name: "Formato", exact: true })).toHaveCount(0);
  });

  test("9. guarda con formato (⌘↵) y la página lo muestra; la hoja queda limpia", async ({ page }) => {
    const sheet = await openSheet(page);
    await page.keyboard.type("Hoy fue **un buen día** y ==lo quiero recordar== ");
    await page.keyboard.press(`${MOD}+Enter`);
    await expect(page.getByText("Guardado en tu navegador")).toBeVisible();
    await expect(sheet).toHaveText("");
    const saved = page.locator("article, li").filter({ hasText: "lo quiero recordar" }).first();
    await expect(saved.locator("strong")).toHaveText("un buen día");
    await expect(saved.locator("mark")).toHaveText("lo quiero recordar");
    await expect(saved).not.toContainText("**");
  });

  test("10. el borrador vuelve con su formato", async ({ page }) => {
    await openSheet(page);
    await page.keyboard.type("Borrador con **negrita** ");
    await page.waitForTimeout(1000);
    await page.reload();
    const again = page.getByRole("textbox", { name: "Lo que querés escribir hoy" });
    await expect(again.locator("strong")).toHaveText("negrita");
    await expect(page.getByText("Borrador recuperado")).toBeVisible();
  });

  test("11. corregir una página la abre con su formato", async ({ page }) => {
    await openSheet(page);
    await page.keyboard.type("Para corregir: **esto** y ==aquello== ");
    await page.keyboard.press(`${MOD}+Enter`);
    await expect(page.getByText("Guardado en tu navegador")).toBeVisible();
    await page.getByRole("button", { name: /Corregir/ }).first().click();
    const sheet = page.getByRole("textbox", { name: "Lo que querés escribir hoy" });
    await expect(sheet.locator("strong")).toHaveText("esto");
    await expect(sheet.locator("mark")).toHaveText("aquello");
  });
});
