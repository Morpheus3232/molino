# Auditoría de handoff — 2026-08-30

Toma de la sesión de Claude Code (branch `feat/molino-four-phase-product-and-ia`).
Documento vínculo entre el estado heredado y el backlog priorizado con evidencia.

## Estado del repo (verificado)

- Branch: `feat/molino-four-phase-product-and-ia` (5 commits sobre `origin/main`).
  `origin/main` quedó en `4d5e2b0`.
- `git status`: limpio (solo `molino_brand_audit.xlsx` sin trackear, no es código).
- `tsc --noEmit`: **PASS** (EXIT 0).
- `vitest run`: **1693 pass / 4 fail** — idéntico al handoff y a `docs/PHASE4_EXPERIENCE_PASS.md`.
- `next build`: 1649 páginas (documentado; no se re-corrió por tiempo).

## Qué está fuerte (preservar)

- `buildSynthesis()` = modelo personal canónico; lo consumen Mapa, Lectura e IA sin re-derivarlo.
- Cadena MAPA→LECTURA→IA completa y nombrada (home la anuncia, el producto la ejecuta).
- Home de tres niveles, threshold entre Mapa y Lectura, puente Lectura→IA.
- Honestidad epistémica: astrología con capas (cálculo/fuente/interpretación/inferencia), Luna aproximada,
  copy de privacidad calificado, sin anclaje de precio.
- WhatsApp eliminado; share neutral (navigator.share / portapapeles).
- Navegación consolidada (11 rutas + 144 páginas `/sinastria/*`).

## Issues conocidos verificados

1. **4 tests en rojo** — todos de UI retirada o datos derivados, no defectos de producto:
   - `daily-focus.test.tsx` (1): espera el bloque "Conexión del día", que `DailyFocus` ya no renderiza.
   - `lectura-afinidades-full.test.tsx` (3): listan ciudades/entidades que el componente ahora solo
     muestra con el filtro de categoría activo (default = "country").
   → **Corregibles y seguros**; verifica el comportamiento actual real, no inventa.
2. **AI_HEAVY_MODEL no llega a la ruta omniroute** — `providerRouter.ts:175` llama a
   `generateWithOmniRoute(user, target, result, template)` sin pasar `preferredModel`.
   `generateWithOmniRoute` acepta `preferredModel` (omnirouteRouter.ts:281), así que es un cableado
   incompleto: con `AI_PRIMARY_PROVIDER=omniroute` (el valor de `.env.local`) el routing premium
   no fuerza el modelo pesado. En producción (Vercel, sin omniroute) el primary efectivo es `openai`,
   donde `modelOverride` sí funciona.
3. **`/profile?dob=` lentitud** — ya resuelto en Fase 4 (2636ms→1601ms medido; el "8–10s" era un
   error de estimación de Fase 2). No requiere acción nueva.
4. **Hydration warning #418** — preexistente, documentado, no causado por esta rama.
5. **Entity redirects con meta-refresh** — revertido a propósito por costo de invocación
   (`force-dynamic`); P2.
6. **`/explore` vs `/conocimiento`** — dos nombres para el hub; diferido a datos de rank.

## Backlog priorizado (por impacto, basado en evidencia)

### P1 — Ahora
- [x] Llevar la suite a verde (los 4 tests viejos). Cero cambio de producto.
- [ ] Cerrar el cableado de `AI_HEAVY_MODEL` en la ruta omniroute (coherencia del routing premium).
- [ ] (Requiere claves) Medir empíricamente la Lectura paga; es el hueco más grande declarado en
      `MODEL_QUALITY_BENCHMARK.md`. Decisión de gasto del dueño.

### P2 — Más adelante
- [ ] Decidir `AI_HEAVY_MODEL` y `AI_CHAT_MODEL` en producción (decisión de costo del dueño).
- [ ] Entity redirects → 308 real cuando el costo se justifique.
- [ ] Unificar `/explore` y `/conocimiento`.

### P3 — Futuro (no empezar)
PWA, B2B, affiliates, coaches, HR, notificaciones, red social.
