# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: premium-funnel.spec.ts >> Premium Funnel E2E >> Recovery form visible and functional
- Location: e2e/premium-funnel.spec.ts:39:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[placeholder*="pago" i], input[placeholder*="ID" i]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('input[placeholder*="pago" i], input[placeholder*="ID" i]').first()

```

```yaml
- link "Saltar al contenido principal":
  - /url: "#main-content"
- banner:
  - link "Molino — Ir al inicio":
    - /url: /
  - navigation "Navegación principal":
    - link "Hoy":
      - /url: /hoy
    - link "Afinidad":
      - /url: /affinity
  - link "DESCUBRIR MI MAPA":
    - /url: /onboarding
  - button "Abrir menú":
    - img
  - navigation "Menú":
    - paragraph: Explorar
    - link "Hoy":
      - /url: /hoy
    - link "Afinidad":
      - /url: /affinity
    - link "Timing":
      - /url: /timing
    - link "Decisiones":
      - /url: /decisions
    - link "Evolución":
      - /url: /evolution
    - paragraph: Conocimiento
    - link "Biblioteca":
      - /url: /biblioteca
    - link "Filosofía":
      - /url: /filosofia
    - paragraph: Mi mapa
    - link "DESCUBRIR MI MAPA":
      - /url: /onboarding
- main:
  - button "Volver a mi mapa": Mi mapa
  - tablist "Secciones del perfil":
    - tab "Tu Identidad"
    - tab "Tu Mundo"
    - tab "Tu Círculo"
    - tab "Tu Lectura Premium" [selected]
  - tabpanel "Tu Lectura Premium":
    - paragraph: Tu lectura
    - heading "La conversación entre tus sistemas" [level=1]
    - paragraph: Hasta ahora viste las piezas. Aquí aparece la conversación entre ellas.
    - heading "Capítulo 01. Tu lectura" [level=2]
    - heading "TU MOTOR" [level=3]
    - paragraph: Ambicioso. Tu energía natural es la de manifestación. Esto te impulsa en cada área de tu vida.
    - text: Numerología
    - heading "TU TENSIÓN" [level=3]
    - paragraph: Materialismo. Tu necesidad de materialismo puede aparecer cuando tu energía está desbalanceada. Observar este patrón es el primer paso para transformarlo.
    - text: Numerología
    - heading "TU PRÓXIMO MOVIMIENTO" [level=3]
    - paragraph: manifestación. Poder, abundancia, logros.
    - text: Ciclos
    - heading "Capítulo 03. Tus tensiones" [level=2]
    - heading "Tu ritmo interno no es parejo" [level=3]
    - paragraph: Tu Life Path 8 tiende a moverte primero y ajustar en el camino, pero tu elemento Tierra pide más tiempo de verificación antes de avanzar. Son dos señales independientes — una del número, otra del elemento — tirando en direcciones distintas.
    - paragraph: "Esto no significa que una de las dos señales esté \"equivocada\": significa que tu impulso y tu forma de procesar operan a velocidades distintas entre sí. Cuando sentís ese desfasaje, es información — no un error a corregir."
    - text: Numerología Astrología
    - heading "Capítulo 04. Tus reglas" [level=2]
    - list:
      - listitem:
        - paragraph: Cuando dudes, andá hacia tu ambición — es una fortaleza real, no un accesorio.
        - text: Arquetipo · Ambición
      - listitem:
        - paragraph: Cuando dudes, andá hacia tu estrategia — es una fortaleza real, no un accesorio.
        - text: Arquetipo · Estrategia
      - listitem:
        - paragraph: Cuando dudes, andá hacia tu liderazgo — es una fortaleza real, no un accesorio.
        - text: Arquetipo · Liderazgo
      - listitem:
        - paragraph: Cuando dudes, andá hacia tu visión — es una fortaleza real, no un accesorio.
        - text: Arquetipo · Visión
      - listitem:
        - paragraph: Tu materialismo es una señal, no un defecto — escuchala antes de que se vuelva un costo.
        - text: Arquetipo · Materialismo
      - listitem:
        - paragraph: Tu control es una señal, no un defecto — escuchala antes de que se vuelva un costo.
        - text: Arquetipo · Control
      - listitem:
        - paragraph: Tu intimidación es una señal, no un defecto — escuchala antes de que se vuelva un costo.
        - text: Arquetipo · Intimidación
      - listitem:
        - paragraph: Tu motor es ambicioso. No lo apagues solo para encajar.
        - text: Numerología
      - listitem:
        - paragraph: Este ciclo te empuja hacia manifestación — dejalo, no lo frenes por costumbre.
        - text: Ciclos
      - listitem:
        - paragraph: Cuando tu ritmo no sea parejo, es información — no fuerces una sola velocidad para las dos señales.
        - text: Numerología + Astrología
    - heading "Capítulo 05. Qué significa para vos" [level=2]
    - paragraph: Estás en un Año de Manifestación (nivel 8). Tu energía del día (Construcción) favorece construcción. Tu tierra natural potencia este momento. Para tu Life Path 8, esto significa que el crecimiento viene de soltar lo que ya cumplió su ciclo.
    - paragraph:
      - link "Ver tu día de hoy en detalle":
        - /url: /hoy
    - heading "Capítulo 06. De la lectura a la acción" [level=2]
    - heading "Explora tus afinidades" [level=2]
    - paragraph: Cada categoría muestra las entidades que más resuenan simbólicamente con tu perfil.
    - button "Viajes Explorá destinos compatibles con tu energía Marcada":
      - paragraph: Viajes
      - paragraph: Explorá destinos compatibles con tu energía
      - text: Marcada
    - button "Entorno profesional Marcas y empresas que resuenan con tu perfil Marcada":
      - paragraph: Entorno profesional
      - paragraph: Marcas y empresas que resuenan con tu perfil
      - text: Marcada
    - button "Lugares Ciudades y espacios con resonancia Marcada":
      - paragraph: Lugares
      - paragraph: Ciudades y espacios con resonancia
      - text: Marcada
    - button "Creatividad Entidades que potencian tu expresión Marcada":
      - paragraph: Creatividad
      - paragraph: Entidades que potencian tu expresión
      - text: Marcada
    - button "Bienestar Símbolos de equilibrio y cuidado Marcada":
      - paragraph: Bienestar
      - paragraph: Símbolos de equilibrio y cuidado
      - text: Marcada
    - button "Aprendizaje Rutas de conocimiento para tu perfil Marcada":
      - paragraph: Aprendizaje
      - paragraph: Rutas de conocimiento para tu perfil
      - text: Marcada
    - paragraph: Herramienta de reflexión personal basada en tradiciones culturales. No constituye predicción científica.
    - heading "Capítulo 07. Síntesis profunda" [level=2]
    - paragraph: Hasta ahora viste las piezas. Aquí aparece la conversación entre ellas — tu identidad, tus ciclos y tus patrones vistos como un solo sistema.
    - paragraph: No se pudo iniciar el pago
    - paragraph: Failed to create PayPal order
    - paragraph: Puede ser un problema temporal. Intentá de nuevo.
    - button "Reintentar"
    - button "Volver"
    - heading "Capítulo 08. Preguntale a tu mapa" [level=2]
    - paragraph: Una pregunta concreta sobre tu momento, tu perfil o una decisión — respondida solo con lo que tu mapa ya calculó sobre vos.
    - paragraph: Tu mapa
    - paragraph: Preguntale a tu mapa forma parte de tu síntesis completa — desbloqueala arriba para acceder.
    - heading "Para profundizar" [level=2]
    - paragraph: Tus dimensiones — la misma lectura de tu Adelanto, ahora con tu perfil completo.
    - img: Propósito Impulso Estructura Ciclo Momento Intuición
    - button "Propósito Camino de Vida + 8 Alta":
      - paragraph: Propósito
      - paragraph: Camino de Vida + 8
      - paragraph: Alta
    - button "Impulso Elemento + Tierra Moderada":
      - paragraph: Impulso
      - paragraph: Elemento + Tierra
      - paragraph: Moderada
    - button "Estructura Modalidad + Cardinal Sutil":
      - paragraph: Estructura
      - paragraph: Modalidad + Cardinal
      - paragraph: Sutil
    - button "Ciclo Año personal + 8 Alta":
      - paragraph: Ciclo
      - paragraph: Año personal + 8
      - paragraph: Alta
    - button "Momento Día personal + 4 Moderada":
      - paragraph: Momento
      - paragraph: Día personal + 4
      - paragraph: Moderada
    - button "Intuición Camino de Vida + Serpiente Alta":
      - paragraph: Intuición
      - paragraph: Camino de Vida + Serpiente
      - paragraph: Alta
    - paragraph: "Tus sistemas por separado:"
    - paragraph:
      - link "Numerología":
        - /url: /conocimiento/numerologia
      - text: ·
      - link "Astrología":
        - /url: /conocimiento/astrologia
      - text: ·
      - link "Zodiaco Chino":
        - /url: /conocimiento/zodiaco-chino
      - text: ·
      - link "Arquetipos":
        - /url: /conocimiento/numerologia
    - heading "Compartir" [level=2]
    - text: Molino Mi perfil
    - paragraph: Serpiente de Metal
    - heading "EL" [level=2]
    - paragraph: Camino de vida
    - paragraph: "8"
    - paragraph: EL PODEROSO
    - paragraph: Serpiente · Metal
    - paragraph: “El verdadero poder es el que compartís.”
    - paragraph: Descubrí tu perfil
    - paragraph: molino.app
    - button "Compartir":
      - img
      - text: Compartir
    - button "Descargar imagen":
      - img
      - text: Descargar imagen
  - button "Tu síntesis completa te espera (Premium) →"
- contentinfo:
  - paragraph: MOLINO
  - paragraph: Mapa personal de autoconocimiento. Tres sistemas, una lectura.
  - heading "EXPLORAR" [level=4]
  - list:
    - listitem:
      - link "INICIO":
        - /url: /
    - listitem:
      - link "MI MAPA":
        - /url: /profile
    - listitem:
      - link "ENERGÍA DE HOY":
        - /url: /hoy
    - listitem:
      - link "TIMING":
        - /url: /timing
    - listitem:
      - link "AFINIDAD":
        - /url: /affinity
    - listitem:
      - link "MI EVOLUCIÓN":
        - /url: /evolution
    - listitem:
      - link "EXPLORAR":
        - /url: /explore
    - listitem:
      - link "BIBLIOTECA":
        - /url: /biblioteca
  - heading "PRINCIPIOS" [level=4]
  - list:
    - listitem:
      - link "CONOCIMIENTO LIBRE":
        - /url: /filosofia#conocimiento-libre
    - listitem:
      - link "PRIVACIDAD RADICAL":
        - /url: /filosofia#privacidad-radical
    - listitem:
      - link "TRANSPARENCIA TOTAL":
        - /url: /filosofia#transparencia-total
    - listitem:
      - link "CÓDIGO ABIERTO":
        - /url: /filosofia#codigo-abierto
    - listitem:
      - link "SIN TRACKING":
        - /url: /filosofia#sin-tracking
  - paragraph: MOLINO — MAPA PERSONAL DE AUTOCONOCIMIENTO
  - paragraph: CONTENIDO EDUCATIVO Y SIMBÓLICO. COMPARTILO LIBREMENTE.
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Premium Funnel E2E', () => {
  4  |   test('Premium Gate visible on Intelligence chapter (ProfileHub)', async ({ page }) => {
  5  |     // Use URL params to go directly to intelligence tab (server-side)
  6  |     await page.goto('/profile?dob=1990-01-15&tab=intelligence');
  7  |     await page.waitForLoadState('networkidle');
  8  |     
  9  |     // Check page loads - ProfileHub is visible
  10 |     await expect(page.locator('button:has-text("Volver a mi mapa")').first()).toBeVisible({ timeout: 15000 });
  11 |     
  12 |     // Check PremiumGate paywall is visible - use actual headline text
  13 |     await expect(page.locator('h3:has-text("Ya conocés tus piezas")').first()).toBeVisible({ timeout: 15000 });
  14 |   });
  15 | 
  16 |   test('PremiumGate shows price and payment methods', async ({ page }) => {
  17 |     // Go directly to intelligence tab
  18 |     await page.goto('/profile?dob=1990-01-15&tab=intelligence');
  19 |     await page.waitForLoadState('networkidle');
  20 |     
  21 |     // Check price displayed - actual format is "$8 USD"
  22 |     await expect(page.locator('text=/\\$8/').first()).toBeVisible({ timeout: 15000 });
  23 |     
  24 |     // Check Mercado Pago button - actual text is "Pagar con Mercado Pago"
  25 |     await expect(page.locator('button:has-text("Pagar con Mercado Pago")').first()).toBeVisible({ timeout: 15000 });
  26 |   });
  27 | 
  28 |   test('PremiumGate blocks double click', async ({ page }) => {
  29 |     await page.goto('/profile?dob=1990-01-15&tab=intelligence');
  30 |     await page.waitForLoadState('networkidle');
  31 |     
  32 |     const mpButton = page.locator('button:has-text("Pagar con Mercado Pago")').first();
  33 |     
  34 |     // Force click to avoid navigation blocking the second click
  35 |     await mpButton.click({ trial: true });
  36 |     await expect(mpButton).toBeVisible();
  37 |   });
  38 | 
  39 |   test('Recovery form visible and functional', async ({ page }) => {
  40 |     await page.goto('/profile?dob=1990-01-15&tab=intelligence');
  41 |     await page.waitForLoadState('networkidle');
  42 |     
  43 |     // The recovery button is blocked by a fixed bottom bar - use force click
  44 |     await page.locator('button:has-text("Recuperar acceso")').first().click({ force: true });
  45 |     
  46 |     // Check recovery form
> 47 |     await expect(page.locator('input[placeholder*="pago" i], input[placeholder*="ID" i]').first()).toBeVisible({ timeout: 10000 });
     |                                                                                                    ^ Error: expect(locator).toBeVisible() failed
  48 |   });
  49 | });
```