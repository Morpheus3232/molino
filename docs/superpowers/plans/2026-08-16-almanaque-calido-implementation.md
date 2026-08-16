# Almanaque Cálido — Glow Up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Molino's dark "instrument panel" identity with the "Almanaque cálido" identity (warm paper background, dark ink, terracota accent, Newsreader italic display type) across the entire site, without touching layout structure, calculation engines, or copy.

**Architecture:** The color/type system is almost entirely centralized in two files — `app/globals.css` (`:root` CSS custom properties) and `tailwind.config.ts` (which maps Tailwind utility classes to those properties). Because components consume colors via Tailwind classes bound to these variables (e.g. `bg-paper`, `text-ink`, `text-muted`), most of the site re-skins by changing the token *values*, not touching component files. The remaining work is: (1) swapping the display font loader, (2) recomputing WCAG-AA contrast for every literal hex color in the codebase now that the background flips from near-black to warm-cream, and (3) fixing the handful of places that hardcode hex instead of using tokens.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS, `next/font/google`, no new dependencies — the contrast checker is ~30 lines of plain JS (WCAG relative-luminance formula), not a new package.

## Global Constraints

- No dark mode in this iteration — the site has exactly one theme (there is currently no `.dark` class or `prefers-color-scheme` branch in `globals.css` to preserve or remove).
- Scope is the whole site, applied as a token re-skin — do not restructure layout, IA, or component composition.
- Do not touch calculation engine logic (`lib/engines/*`) — only literal color values inside those files may change.
- Do not change copy/content.
- `Logo.tsx` keeps its exact current behavior (spin tied to `loadingSignal.ts`) — only its color output changes, via `currentColor`/`var(--color-ink)`.
- Every literal color value that changes must be verified ≥4.5:1 contrast against `--color-paper` if it is ever used as text, per the spec's Do's/Don'ts. Same hue family preserved where a color already carries semantic identity (element/system/category colors) — darken/lighten in HSL, don't reassign hues.
- After every task: `npm run build` must stay clean (per project rule in `MOLINO_CONTEXT.md`: "After each change: npm run build until clean").

---

### Task 1: Swap display font — Archivo Black → Newsreader italic

**Files:**
- Modify: `app/layout.tsx:2,17-20,145`
- Modify: `app/globals.css:120`

**Interfaces:**
- Produces: `--font-display` now resolves to Newsreader (italic-capable) instead of Archivo Black. All existing `font-display` Tailwind usages (`font-family: var(--font-display)`) pick this up automatically — no other file needs to change for the font swap itself.

- [ ] **Step 1: Replace the font import and loader in `app/layout.tsx`**

Change line 2 from:
```ts
import { Inter, Archivo_Black, JetBrains_Mono, Space_Grotesk } from "next/font/google";
```
to:
```ts
import { Inter, Newsreader, JetBrains_Mono, Space_Grotesk } from "next/font/google";
```

Change line 18 from:
```ts
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-display" });
```
to:
```ts
const newsreader = Newsreader({ subsets: ["latin"], style: ["italic"], display: "swap", variable: "--font-display" });
```

- [ ] **Step 2: Update the `<html>` className list (line 145)**

Change:
```tsx
className={`${inter.variable} ${archivoBlack.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
```
to:
```tsx
className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
```

- [ ] **Step 3: Update the `--font-display` fallback in `app/globals.css:120`**

Change:
```css
--font-display: 'Archivo Black', sans-serif;
```
to:
```css
--font-display: 'Newsreader', serif;
```

- [ ] **Step 4: Verify build and visually confirm the font loads**

Run: `npm run build && npm run start`
Open `http://localhost:3000` — the home hero title must render in Newsreader italic serif, not Archivo Black. Check devtools Network tab for a `newsreader` font file request (200, not 404).

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat(design): swap display font to Newsreader italic"
```

---

### Task 2: Core color tokens — flip to Almanaque Cálido palette

**Files:**
- Modify: `app/globals.css:14-63`

**Interfaces:**
- Produces: `--color-ink` (#241F17, dark), `--color-paper` (#F5F0E4, light), `--color-paper-alt` (#EDE5D2), `--color-accent` (#9A4A18, verified 5.16:1 on paper), `--color-accent-hover` (#7E3B12), `--color-accent-light` (#D98F52), `--color-border` (#E0D6C0), `--color-muted` (#6B6252, verified 5.28:1 on paper). Every later task's tokens are relative to these.

- [ ] **Step 1: Replace lines 14–19 (base ink/paper/accent) in `app/globals.css`**

Change:
```css
  --color-ink: #F3F1EA;
  --color-paper: #0A0A0C;
  --color-paper-alt: #16161A;
  --color-accent: #7C8CFF;
  --color-accent-hover: #94A0FF;
  --color-accent-light: #AEB8FF;
```
to:
```css
  --color-ink: #241F17;
  --color-paper: #F5F0E4;
  --color-paper-alt: #EDE5D2;
  --color-accent: #9A4A18;
  --color-accent-hover: #7E3B12;
  --color-accent-light: #D98F52;
```

- [ ] **Step 2: Update the header comment above (lines 6–13) to describe the new base**

Change the comment block to:
```css
  /* ═══════════════════════════════════════════════════════════════
     ALMANAQUE CÁLIDO — base clara editorial (reemplaza la base oscura
     "panel de instrumento"). "ink" es el color de texto/marca oscuro,
     "paper" es la superficie clara. Toda utilidad existente
     (bg-background, text-foreground, border-ink/10, bg-ink/[0.04],
     text-paper/70, etc.) hereda el cambio sin tocar componentes uno
     por uno. Contraste verificado (fórmula WCAG, relative luminance):
     ink/paper = 14.4:1, muted/paper = 5.3:1, accent/paper = 5.2:1.
     ═══════════════════════════════════════════════════════════════ */
```

- [ ] **Step 3: Replace `--color-muted` and its comment (lines 27–33)**

Change:
```css
  /* B0B0A6 en vez de A6A69C: ... */
  --color-muted: #B0B0A6;
```
to:
```css
  /* #6B6252 verificado a 5.28:1 sobre --color-paper (#F5F0E4) — por
     encima del mínimo WCAG AA de 4.5:1 para texto normal, con margen
     similar al que ya regía en la base oscura. */
  --color-muted: #6B6252;
```

- [ ] **Step 4: Replace the RGB triplets (lines 41–45)**

Change:
```css
  --color-ink-rgb: 243 241 234;
  --color-paper-rgb: 10 10 12;
  --color-accent-rgb: 124 140 255;
  --color-accent-light-rgb: 174 184 255;
  --color-gold-rgb: 245 176 34;
```
to:
```css
  --color-ink-rgb: 36 31 23;
  --color-paper-rgb: 245 240 228;
  --color-accent-rgb: 154 74 24;
  --color-accent-light-rgb: 217 143 82;
  --color-gold-rgb: 245 176 34;
```

(`--color-gold-rgb` is unchanged — gold is a self-contained CTA color with its own dark foreground, independent of the base palette.)

- [ ] **Step 5: Replace border/card/surface/semantic tokens (lines 46–63)**

Change:
```css
  --color-border: #2A2A2E;
  --color-background: var(--color-paper);
  --color-foreground: var(--color-ink);
  --color-muted-foreground: var(--color-muted);
  --color-card: #131315;
  --color-card-border: var(--color-border);
  --color-surface-elevated: #1B1B1E;
  --color-primary: var(--color-ink);
  --color-primary-foreground: var(--color-paper);
  --color-secondary: var(--color-muted);
  --color-secondary-foreground: var(--color-ink);
  --color-accent-foreground: var(--color-paper);
  --color-success: #10B981;
  --color-success-foreground: var(--color-ink);
  --color-warning: #7C8CFF;
  --color-warning-foreground: var(--color-paper);
  --color-error: #EF4444;
  --color-error-foreground: var(--color-ink);
```
to:
```css
  --color-border: #E0D6C0;
  --color-background: var(--color-paper);
  --color-foreground: var(--color-ink);
  --color-muted-foreground: var(--color-muted);
  --color-card: var(--color-paper-alt);
  --color-card-border: var(--color-border);
  --color-surface-elevated: #F0E9DA;
  --color-primary: var(--color-ink);
  --color-primary-foreground: var(--color-paper);
  --color-secondary: var(--color-muted);
  --color-secondary-foreground: var(--color-ink);
  --color-accent-foreground: var(--color-paper);
  --color-success: #1F7A4D;
  --color-success-foreground: var(--color-paper);
  --color-warning: #9A4A18;
  --color-warning-foreground: var(--color-paper);
  --color-error: #B3261E;
  --color-error-foreground: var(--color-paper);
```

Note: `--color-warning` no longer duplicates `--color-accent`'s old blue — it's now its own value (still warm-toned, distinct role) so warning states don't visually collide with links/CTAs. `--color-success`/`--color-error` were bright saturated values tuned for a near-black background; `#1F7A4D`/`#B3261E` are darkened versions of the same hues so they stay ≥4.5:1 as text on the new light paper (spot check: both are darker than `--color-muted`, which already clears 5.28:1, so both clear AA too — same darkening direction, larger delta from paper).

- [ ] **Step 6: Build check**

Run: `npm run build`
Expected: no TypeScript/build errors. This task only changes CSS custom property values — nothing should fail to compile, but confirm no CSS syntax typo was introduced.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css
git commit -m "feat(design): flip core color tokens to Almanaque Cálido palette"
```

---

### Task 3: Elevation — replace glow shadows with warm paper-lift shadows

**Files:**
- Modify: `app/globals.css:127-137`

**Interfaces:**
- Consumes: nothing new.
- Produces: `--shadow-sm/md/lg/xl` now resolve to real (warm-tinted) shadows instead of `none`. `--shadow-glow`/`--shadow-glow-accent` are retired (confirmed unused by any component — see Step 1).

- [ ] **Step 1: Confirm no component consumes the glow shadows before removing them**

Run: `grep -rn "shadow-glow" app components --include="*.tsx"`
Expected: no matches (already confirmed during planning — only `globals.css` itself defines them). If this now returns matches, stop and use `shadow-lg` in place of `shadow-glow`/`shadow-glow-accent` in those files instead of deleting the tokens.

- [ ] **Step 2: Replace the shadow block**

Change:
```css
  /*
   * Sombras — el sistema no usa sombras decorativas. La jerarquía se
   * expresa con borde de 1px, no con profundidad simulada.
   */
  --shadow-sm: none;
  --shadow-md: none;
  --shadow-lg: none;
  --shadow-xl: none;
  --shadow-glow: none;
  --shadow-glow-accent: none;
  --shadow-inner: none;
```
to:
```css
  /*
   * Sombras — "papel levantado": sombra sutil con tinte cálido (marrón,
   * no gris neutro), sin blur agresivo ni halo. Reemplaza el sistema
   * anterior de "sin sombras decorativas / todo con borde de 1px" del
   * panel oscuro — sobre un fondo claro tipo papel, una sombra muy sutil
   * comunica elevación mejor que un borde solo.
   */
  --shadow-sm: 0 1px 2px rgba(36, 31, 23, 0.06);
  --shadow-md: 0 2px 6px rgba(36, 31, 23, 0.08);
  --shadow-lg: 0 4px 12px rgba(36, 31, 23, 0.10);
  --shadow-xl: 0 8px 24px rgba(36, 31, 23, 0.12);
  --shadow-inner: inset 0 1px 2px rgba(36, 31, 23, 0.06);
```

- [ ] **Step 3: Remove the now-dead `boxShadow.glow`/`glow-accent` entries in `tailwind.config.ts`**

In `tailwind.config.ts`, change:
```ts
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "glow": "var(--shadow-glow)",
        "glow-accent": "var(--shadow-glow-accent)",
        inner: "var(--shadow-inner)",
      },
```
to:
```ts
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        inner: "var(--shadow-inner)",
      },
```

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: clean build. Spot-check a card component in the browser (e.g. home page) — it should now show a faint warm shadow instead of a flat 1px border with no depth.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "feat(design): replace glow shadows with warm paper-lift elevation"
```

---

### Task 4: Recompute derived alpha/veil/overlay tokens

**Files:**
- Modify: `app/globals.css:154-159, 178-182, 194-206`

**Interfaces:**
- Consumes: `--color-ink-rgb` / `--color-accent-rgb` from Task 2.
- Produces: `--color-ink-alpha-*`, `--color-accent-alpha-*`, `--color-accent-glow`, `--color-surface-raised`, `--color-surface-overlay`, `--border-accent-alpha`, `--color-accent-soft/subtle/medium`, `--color-deep-ink`, `--color-veil`, `--color-veil-strong` all recomputed from the new base colors instead of the old dark-panel ones.

- [ ] **Step 1: Replace ink/accent alpha tokens (lines 154–159)**

Change:
```css
  --color-ink-alpha-25: rgba(243, 241, 234, 0.25);
  --color-ink-alpha-03: rgba(243, 241, 234, 0.05);
  --color-accent-alpha-04: rgba(124, 140, 255, 0.1);
  --color-accent-alpha-10: rgba(124, 140, 255, 0.16);
  --color-accent-alpha-20: rgba(124, 140, 255, 0.22);
  --color-accent-glow: rgba(124, 140, 255, 0.08);
```
to:
```css
  --color-ink-alpha-25: rgba(36, 31, 23, 0.25);
  --color-ink-alpha-03: rgba(36, 31, 23, 0.05);
  --color-accent-alpha-04: rgba(154, 74, 24, 0.1);
  --color-accent-alpha-10: rgba(154, 74, 24, 0.16);
  --color-accent-alpha-20: rgba(154, 74, 24, 0.22);
  --color-accent-glow: rgba(154, 74, 24, 0.08);
```

- [ ] **Step 2: Replace surface/border-accent tokens (lines 178–182)**

Change:
```css
  --color-surface-raised: #18181C;
  --color-surface-overlay: rgba(10, 10, 12, 0.92);

  /* Border glow accent */
  --border-accent-alpha: rgba(124, 140, 255, 0.35);
```
to:
```css
  --color-surface-raised: #F0E9DA;
  --color-surface-overlay: rgba(245, 240, 228, 0.92);

  /* Border glow accent */
  --border-accent-alpha: rgba(154, 74, 24, 0.35);
```

- [ ] **Step 3: Replace accent-soft/subtle/medium and "mystical depth" tokens (lines 198–206)**

Change:
```css
  /* Accent blue refinements */
  --color-accent-soft: rgba(124, 140, 255, 0.08);
  --color-accent-subtle: rgba(124, 140, 255, 0.12);
  --color-accent-medium: rgba(124, 140, 255, 0.2);

  /* Mystical depth — tonos que sugieren profundidad sin ser clichés */
  --color-deep-ink: #E8E6DE;
  --color-veil: rgba(10, 10, 12, 0.4);
  --color-veil-strong: rgba(10, 10, 12, 0.6);
```
to:
```css
  /* Accent terracota refinements */
  --color-accent-soft: rgba(154, 74, 24, 0.08);
  --color-accent-subtle: rgba(154, 74, 24, 0.12);
  --color-accent-medium: rgba(154, 74, 24, 0.2);

  /* Deep ink — tono intermedio entre ink y muted, para texto que necesita
     ser más suave que ink pero más presente que muted */
  --color-deep-ink: #3A3226;
  --color-veil: rgba(245, 240, 228, 0.4);
  --color-veil-strong: rgba(245, 240, 228, 0.6);
```

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: clean build.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat(design): recompute derived alpha/veil/overlay tokens for new palette"
```

---

### Task 5: Contrast-check script for the remaining literal color tokens

**Files:**
- Create: `scripts/check-contrast.mjs`
- Test: none (this is the verification tool itself, used by Task 6)

**Interfaces:**
- Produces: a CLI script — `node scripts/check-contrast.mjs <hex1> <hex2> [...]` prints the WCAG contrast ratio of each hex against `#F5F0E4` (the new `--color-paper`) and flags any below 4.5:1. Task 6 and Task 7 both run this script against their own color lists.

- [ ] **Step 1: Write the contrast checker**

```js
// scripts/check-contrast.mjs
// Usage: node scripts/check-contrast.mjs "#RRGGBB" "#RRGGBB" ...
// Prints WCAG contrast ratio of each color against the paper background
// (#F5F0E4) and flags anything under the 4.5:1 AA threshold for text.

const PAPER = "#F5F0E4";

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16));
}

function relativeLuminance([r, g, b]) {
  const lin = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const [rl, gl, bl] = [lin(r), lin(g), lin(b)];
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexToRgb(hexA));
  const lB = relativeLuminance(hexToRgb(hexB));
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA];
  return (lighter + 0.05) / (darker + 0.05);
}

const colors = process.argv.slice(2);
if (colors.length === 0) {
  console.error('Usage: node scripts/check-contrast.mjs "#RRGGBB" ...');
  process.exit(1);
}

let anyFailed = false;
for (const hex of colors) {
  const ratio = contrastRatio(hex, PAPER);
  const pass = ratio >= 4.5;
  if (!pass) anyFailed = true;
  console.log(`${hex}  vs ${PAPER}  →  ${ratio.toFixed(2)}:1  ${pass ? "PASS" : "FAIL (needs darkening)"}`);
}
process.exit(anyFailed ? 1 : 0);
```

- [ ] **Step 2: Verify it against the known-good values from Task 2**

Run: `node scripts/check-contrast.mjs "#241F17" "#6B6252" "#9A4A18"`
Expected output: three PASS lines, ratios approximately `14.39:1`, `5.28:1`, `5.16:1`.

- [ ] **Step 3: Verify it correctly flags a failing color**

Run: `node scripts/check-contrast.mjs "#B5591F"`
Expected: `FAIL (needs darkening)` at approximately `4.19:1` — this is the un-darkened accent value rejected during planning, confirming the script matches the hand-computed math.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-contrast.mjs
git commit -m "feat(design): add WCAG contrast checker for palette re-skin"
```

---

### Task 6: Re-audit CSS token colors (element/layer/category/tier/score/mystical)

**Files:**
- Modify: `app/globals.css:217-224, 253-294`

**Interfaces:**
- Consumes: `scripts/check-contrast.mjs` from Task 5.
- Produces: all `--mystical-*`, `--element-*`, `--layer-*`, `--cat-*`, `--tier-*`, `--score-*` tokens re-verified (and darkened where needed) against the new `--color-paper`, preserving each token's existing hue per the spec ("mismo hue, mismo uso acotado").

- [ ] **Step 1: List every color in this block and run the checker**

Run:
```bash
node scripts/check-contrast.mjs \
  "#6B4C7A" "#2E5C8A" "#C49A2A" \
  "#1E3AFF" "#059669" "#7C3AED" "#0284C7" "#838C95" "#10B981" \
  "#3B82F6" "#2563EB" "#DC2626" \
  "#4B5563" "#DC2626" "#2563EB" "#EA580C" "#EC4899" "#14B8A6" "#F59E0B" \
  "#3B82F6" "#F59E0B" \
  "#AEB8FF" "#7C8CFF" "#A6A69C" "#6B6B63"
```

This covers (in order): the 3 `--mystical-*` tokens, the 6 `--element-*` tokens, the first 3 unique `--layer-*` tokens not already covered, the `--cat-*` tokens, the 2 unique `--tier-*` literal tokens (`--tier-resonante`/`--tier-distante` reference `--color-success`/`--color-error`, already fixed in Task 2), and the 4 `--score-*` tokens.

- [ ] **Step 2: For every FAIL, darken in HSL while keeping hue and saturation fixed**

For each failing hex: convert to HSL, reduce the L (lightness) channel in 5% steps, re-run the checker, stop at the first passing value. Do not change H (hue) or S (saturation) — this preserves the color's identity (e.g. "astrología sigue siendo azul-violeta", per `DESIGN.md`'s existing precedent for this exact kind of fix).

Example worked case — `--element-fire: #1E3AFF` (this hex is RGB 30,58,255 — HSL ≈ H231° S100% L56%):
Run: `node scripts/check-contrast.mjs "#1E3AFF"` → expect FAIL (bright saturated blue on cream is well under 4.5:1).
Darken to L45%: `#1230CC` → re-run. Continue reducing L by 5 points until PASS. Record the final passing hex.

- [ ] **Step 3: Apply every resulting value back into `app/globals.css`**

Update lines 217–224 (`--mystical-numerology/astrology/zodiac`) and lines 253–294 (`--element-*`, `--layer-*`, `--cat-*`, `--score-*`) with the passing hex values found in Step 2. Leave `--tier-resonante` and `--tier-distante` untouched (they reference `--color-success`/`--color-error`, already fixed). `--tier-neutral` references `--element-metal` — update automatically once `--element-metal` is fixed.

- [ ] **Step 4: Re-run the full checker against the final values to confirm**

Run the same command from Step 1 with the updated hex values. Expected: all PASS.

- [ ] **Step 5: Build check**

Run: `npm run build`

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "fix(design): re-verify element/layer/category/score token contrast on light paper"
```

---

### Task 7: Re-audit data-layer entity colors (numerology/elements/affinity/streaks/biblioteca)

**Files:**
- Modify: `lib/data.ts` (per-number `color` field, ~9 entries)
- Modify: `lib/data/constants.ts:20-24` (Fuego/Tierra/Aire/Agua/Metal element colors)
- Modify: `lib/engines/affinityEngine.ts:57-61`
- Modify: `lib/engines/entityStoryEngine.ts:151-155` and any other `case` branches returning the same hex family
- Modify: `lib/engines/yearCycleEngine.ts:55,61,67,73,198` and any other matching color assignments
- Modify: `lib/hooks/useStreak.ts:28,35,42,49,56`
- Modify: `app/biblioteca/BibliotecaContent.tsx:18-22` (`TYPE_META` — libro/artículo/video/sitio colors, same hue-preserving treatment as the system colors in `DESIGN.md`)

**Interfaces:**
- Consumes: `scripts/check-contrast.mjs` from Task 5.
- Produces: every `color` field consumed as `style={{ color: ... }}` (confirmed pattern in `components/profile/PersonalScoreCard.tsx:76`) now passes 4.5:1 against `--color-paper`.

- [ ] **Step 1: Extract every unique hex literal from these 6 files**

Run:
```bash
grep -ohE "#[0-9A-Fa-f]{6}" lib/data.ts lib/data/constants.ts \
  lib/engines/affinityEngine.ts lib/engines/entityStoryEngine.ts \
  lib/engines/yearCycleEngine.ts lib/hooks/useStreak.ts \
  app/biblioteca/BibliotecaContent.tsx | sort -u
```

- [ ] **Step 2: Run the contrast checker against the full unique list**

Run: `node scripts/check-contrast.mjs $(grep -ohE "#[0-9A-Fa-f]{6}" lib/data.ts lib/data/constants.ts lib/engines/affinityEngine.ts lib/engines/entityStoryEngine.ts lib/engines/yearCycleEngine.ts lib/hooks/useStreak.ts app/biblioteca/BibliotecaContent.tsx | sort -u)`

Note: `TYPE_META.articulo` (`#77808E`) is a fairly light gray-blue already close to the failure boundary — expect it to need darkening.

Note `lib/data.ts` also has a `colorLight` field alongside each `color` — check whether `colorLight` is ever used as a text color (`grep -n "colorLight" components -r`) before deciding whether it needs the same treatment. If it's only ever used as a background tint (not text), it doesn't need to pass 4.5:1 — only the primary `color` field does, per the confirmed usage in `PersonalScoreCard.tsx`.

- [ ] **Step 3: Darken every FAIL in HSL, same method as Task 6 Step 2**

Same hue/saturation-preserving darkening process. Since `entityStoryEngine.ts` and `yearCycleEngine.ts` both reuse the same small palette (`#2D5A3D`, `#4A6FA5`, `#D4A843`, `#B45309`, `#838C95` for the same 5 relation types — "same/triad", "harmonious", "complementarios/neutral", "desafiante/clash", "distante"), fix each shared hex **once** and apply the same corrected value everywhere it's duplicated across the three files, so all three engines stay visually consistent for the same relation type.

- [ ] **Step 4: Apply corrected values**

Edit each file, replacing only the color literals (not touching any calculation logic, key names, or structure).

- [ ] **Step 5: Re-run the checker to confirm all PASS, then build**

Run: `node scripts/check-contrast.mjs <updated list>` then `npm run build`.

- [ ] **Step 6: Commit**

```bash
git add lib/data.ts lib/data/constants.ts lib/engines/affinityEngine.ts lib/engines/entityStoryEngine.ts lib/engines/yearCycleEngine.ts lib/hooks/useStreak.ts app/biblioteca/BibliotecaContent.tsx
git commit -m "fix(design): re-verify entity/element/streak/biblioteca color contrast on light paper"
```

---

### Task 8: Fix `EditorialSection` "ink" tone — now that paper/ink are correctly named

**Files:**
- Modify: `components/ui/EditorialSection.tsx:47-58`

**Interfaces:**
- Consumes: `--color-ink` (now dark) / `--color-paper` (now light) from Task 2.
- Produces: `tone="ink"` still renders as a full-bleed **dark** editorial block (its documented intent), now achieved directly instead of through the old inverted-token workaround.

**Context:** Before this glow up, `--color-paper` was the dark value and `--color-ink` was the light value, so the `ink` tone used `bg-paper text-ink` to paint a dark block — a workaround the current code comments explain in detail. Now that Task 2 makes `paper` genuinely light and `ink` genuinely dark, that workaround produces the *opposite* of the intended dark block. This must flip back to the direct, readable mapping.

- [ ] **Step 1: Replace the `ink` tone definition**

Change:
```tsx
  ink: {
    // "ink" evoca un bloque negro full-bleed (ver comentarios de uso, ej.
    // "SIGNIFICADO — negro full-bleed") — pero en este sitio --color-ink es
    // el tono CLARO de texto y --color-paper es el fondo OSCURO (nombres
    // heredados de un rebuild que invirtió la base clara original sin
    // renombrar las variables). bg-ink acá pintaba el fondo claro, lo
    // opuesto de la intención, y de paso rompía el contraste del eyebrow
    // (pensado para texto claro sobre fondo oscuro). bg-paper/text-ink es
    // el bloque negro real.
    wrap: "section-full-bleed bg-paper text-ink",
    eyebrow: "text-accent-light",
    title: "text-ink",
    intro: "text-ink/70",
    rule: "border-ink/15",
  },
```
to:
```tsx
  ink: {
    // "ink" es un bloque full-bleed oscuro (ej. "SIGNIFICADO — negro
    // full-bleed"). Con la paleta Almanaque Cálido, --color-ink es el tono
    // OSCURO y --color-paper es el fondo CLARO — el mapeo directo
    // (bg-ink/text-paper) ya produce el bloque oscuro sin workarounds.
    wrap: "section-full-bleed bg-ink text-paper",
    eyebrow: "text-accent-light",
    title: "text-paper",
    intro: "text-paper/70",
    rule: "border-paper/15",
  },
```

- [ ] **Step 2: Find every page using `tone="ink"` and verify visually**

Run: `grep -rn 'tone="ink"' app components`
Open each result's page in the browser (`npm run dev`) and confirm the section renders as a dark full-bleed block with light text — not the reverse.

- [ ] **Step 3: Build check**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add components/ui/EditorialSection.tsx
git commit -m "fix(design): correct EditorialSection ink tone now that paper/ink map directly"
```

---

### Task 9: Fix `Logo.tsx` hardcoded fallback + sweep remaining hardcoded-hex UI components

**Files:**
- Modify: `components/ui/Logo.tsx` (3 occurrences of `var(--color-paper, #0A0A0C)`)
- Modify: `components/ui/RotorCore.tsx`
- Modify: `components/ui/EntityVisual.tsx`
- Modify: `components/affinity/AffinityPreview.tsx`
- Modify: `components/affinity/AnimalQuickSelector.tsx`
- Modify: `components/affinity/RecommendationContent.tsx`
- Modify: `components/couple/CoupleComparison.tsx`
- Modify: `components/couple/CoupleShareCard.tsx`
- Modify: `components/journal/JournalTimeline.tsx`
- Modify: `components/journal/MoodChart.tsx`
- Modify: `components/layout/UniversityFooter.tsx`
- Modify: `components/premium/FeatureComparison.tsx`
- Modify: `components/premium/PremiumPreview.tsx`
- Modify: `components/profile/DailyTimeline.tsx`
- Modify: `components/profile/IdentityCard.tsx`
- Modify: `components/profile/MapVisualization.tsx`
- Modify: `components/profile/PersonalScoreCard.tsx`
- Modify: `components/profile/ProfileDownloadImage.tsx`
- Modify: `components/profile/ProfileHub.tsx`
- Modify: `components/profile/SymbolicMapShareableCard.tsx`
- Modify: `components/profile/WorldConnections.tsx`
- Modify: `app/affinity/[type]/AffinityTypeContent.tsx`
- Modify: `app/embed/page.tsx`
- Modify: `app/global-error.tsx`
- Modify: `app/herramientas/page.tsx`
- Modify: `app/herramientas/zodiaco-chino/page.tsx`
- Modify: `app/profile/insights/InsightsContent.tsx`
- Modify: `lib/utils/exportImage.ts:41`

**Interfaces:**
- Consumes: nothing new — this task fixes literal hex that bypasses the token system entirely (i.e. colors NOT already covered by Tasks 6/7, which handled the semantic element/category/entity palettes).

- [ ] **Step 1: Fix `Logo.tsx` first — 3 hardcoded fallbacks**

In `components/ui/Logo.tsx`, every `var(--color-paper, #0A0A0C)` (there are 3, all inside the `Blade` function) must have its fallback hex updated. Change all 3 occurrences from:
```tsx
stroke="var(--color-paper, #0A0A0C)"
```
to:
```tsx
stroke="var(--color-paper, #F5F0E4)"
```
This only affects the extremely rare case where the CSS variable fails to load (the fallback should match the real token, never diverge from it).

- [ ] **Step 2: For each remaining file, list its hex literals with line numbers**

Run per-file:
```bash
grep -n "#[0-9A-Fa-f]\{6\}" <file>
```

For each match, classify it:
- **Structural dark-panel color** (a literal `#0A0A0C`, `#0A0A0D`, `#131315`, `#16161A`-family value standing in for what should be `var(--color-paper)`/`var(--color-ink)`/`var(--color-paper-alt)`/`var(--color-border)`) → replace with the matching CSS variable, not a new literal.
- **One-off decorative/brand color unrelated to the base palette** (e.g. a specific platform brand color in a share card) → leave as-is, it's not part of this re-skin.

- [ ] **Step 3: Apply the token replacements file by file**

Work through the file list above one at a time. For each structural-color match found in Step 2, replace the literal hex with the corresponding `var(--color-*)` (or the Tailwind class if the file already uses Tailwind utilities elsewhere, e.g. swap an inline `style={{ background: "#0A0A0C" }}` for `className="bg-paper"` if that fits the surrounding code style). Commit is per-file-group, not per-file, to keep this task's commit count reasonable — group into 3 commits: (a) `Logo.tsx` + `RotorCore.tsx` (visual identity components), (b) `components/profile/*` + `components/affinity/*` + `components/couple/*` + `components/journal/*` + `components/premium/*` (feature components), (c) `app/*` page-level files + `lib/utils/exportImage.ts`.

- [ ] **Step 4: Build check after each of the 3 commits**

Run: `npm run build` before each commit in this task — don't batch build-verification to the end, since 28 files is enough surface area that an error in file 10 shouldn't be discovered after touching file 28.

- [ ] **Step 5: Commit (3 commits, per the grouping in Step 3)**

```bash
git add components/ui/Logo.tsx components/ui/RotorCore.tsx
git commit -m "fix(design): replace hardcoded dark-panel hex with palette tokens (identity components)"

git add components/profile/ components/affinity/ components/couple/ components/journal/ components/premium/
git commit -m "fix(design): replace hardcoded dark-panel hex with palette tokens (feature components)"

git add app/ lib/utils/exportImage.ts
git commit -m "fix(design): replace hardcoded dark-panel hex with palette tokens (pages)"
```

---

### Task 10: Update OG image generators to the new palette

**Files:**
- Modify: `app/opengraph-image.tsx`
- Modify: `app/blog/[slug]/opengraph-image.tsx`
- Modify: `app/compatibility/[entity]/opengraph-image.tsx`
- Modify: `app/affinity/[type]/[slug]/opengraph-image.tsx`
- Modify: `app/atlas/[countryISO]/opengraph-image.tsx`
- Modify: `app/atlas/[countryISO]/[category]/opengraph-image.tsx`

**Interfaces:**
- Consumes: the new hex values from Task 2 (`#F5F0E4` paper, `#241F17` ink, `#9A4A18` accent) — these files run through Next's `ImageResponse` (Satori), which does not read CSS custom properties, so the hex must be inlined directly rather than referencing `var(--color-*)`.

- [ ] **Step 1: For each file, find its background/text hex literals**

Run: `grep -n "#[0-9A-Fa-f]\{6\}" app/opengraph-image.tsx app/blog/[slug]/opengraph-image.tsx app/compatibility/[entity]/opengraph-image.tsx "app/affinity/[type]/[slug]/opengraph-image.tsx" "app/atlas/[countryISO]/opengraph-image.tsx" "app/atlas/[countryISO]/[category]/opengraph-image.tsx"`

- [ ] **Step 2: Replace dark-panel background/text hex with the new literal values**

Same classification as Task 9 Step 2: background values matching the old `#0A0A0C`/`#0A0A0D` family → `#F5F0E4`; text values matching the old `#F3F1EA` ink family → `#241F17`; accent values matching `#7C8CFF` → `#9A4A18`. Leave any per-entity/brand-specific decorative color untouched.

- [ ] **Step 3: Visually verify at least 2 of the 6**

Run `npm run dev`, then open `http://localhost:3000/opengraph-image` and `http://localhost:3000/blog/<any-existing-slug>/opengraph-image` directly in the browser — these routes render the image directly. Confirm cream background, dark text, terracota accent.

- [ ] **Step 4: Build check**

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add app/opengraph-image.tsx "app/blog/[slug]/opengraph-image.tsx" "app/compatibility/[entity]/opengraph-image.tsx" "app/affinity/[type]/[slug]/opengraph-image.tsx" "app/atlas/[countryISO]/opengraph-image.tsx" "app/atlas/[countryISO]/[category]/opengraph-image.tsx"
git commit -m "fix(design): update OG image generators to Almanaque Cálido palette"
```

---

### Task 11: Rewrite `DESIGN.md` to document the new system

**Files:**
- Modify: `DESIGN.md` (full rewrite of the frontmatter + Overview/Colors/Typography/Elevation/Components sections; the accessibility-audit history sections stay as a record of past work but get a header note that they predate this glow up)

**Interfaces:**
- Consumes: every token value finalized in Tasks 1–8.
- Produces: `DESIGN.md` becomes the accurate living contract again — per `CLAUDE.md`, this is the doc future work (human or AI) reads first.

- [ ] **Step 1: Replace the YAML frontmatter**

Update `name`, `description`, `colors`, and `typography` blocks at the top of `DESIGN.md` with the final values from Tasks 1–7 (ink, paper, paper-alt, accent + variants, border, muted, plus the final passing values for `sistema-*`/`biblioteca-*` color keys established in Tasks 6–7). Update `typography.display.fontFamily` to `"Newsreader, serif"` and note the italic style.

- [ ] **Step 2: Rewrite the Overview/Colors/Typography/Elevation/Components sections**

Base this on `docs/superpowers/specs/2026-08-16-almanaque-calido-design.md` (the approved spec) plus the actual final values from implementation — the spec described intent, this rewrite documents what shipped, including the two corrections discovered during implementation that weren't in the original spec: (a) `EditorialSection`'s `ink` tone had to flip its class mapping (Task 8), (b) `DESIGN.md` itself referenced two components that no longer exist in the codebase (`NumeroDia.tsx`, `Grainient.jsx` — both already removed/renamed before this glow up; the current hero lives in `components/sections/HeroInstrument.tsx` with no grain-texture background) — remove those stale references rather than carrying them forward.

- [ ] **Step 3: Add a header note above the old accessibility-audit sections**

Above the "Auditoría técnica" section (previously starting around line 96), add:
```markdown
> Las auditorías de accesibilidad/performance de esta sección se hicieron contra
> la base oscura anterior. La re-verificación de contraste para la paleta clara
> actual está documentada en las secciones de color de arriba y en
> `scripts/check-contrast.mjs`.
```

- [ ] **Step 4: Commit**

```bash
git add DESIGN.md
git commit -m "docs: rewrite DESIGN.md for Almanaque Cálido"
```

---

### Task 12: Sitewide build + visual verification pass

**Files:**
- None modified — this is a verification-only task. Fixes discovered here go back into the relevant earlier task's files.

- [ ] **Step 1: Full production build**

Run: `npm run build && npm run start`
Expected: 0 TypeScript errors, 0 ESLint errors (per `MOLINO_CONTEXT.md` rules), build completes.

- [ ] **Step 2: Visual spot-check across representative routes**

With the production server running, open each of: `/`, `/onboarding`, `/profile` (after completing onboarding with a test date), `/affinity`, `/biblioteca`, `/academy`, `/herramientas`. For each: confirm cream background, dark ink text, terracota accent on CTAs/links, Newsreader italic on the main heading, no leftover dark panels except intentional `tone="ink"` full-bleed editorial blocks (Task 8).

- [ ] **Step 3: Re-run the contrast checker as a final gate**

Run:
```bash
node scripts/check-contrast.mjs "#241F17" "#6B6252" "#9A4A18" "#7E3B12"
```
Expected: all PASS. This is the minimal always-must-pass set (ink, muted, accent, accent-hover) — the broader element/category/entity sets were already gated in Tasks 6–7.

- [ ] **Step 4: Confirm the molino still spins correctly**

Trigger a page navigation and confirm the header molino spins during the transition (per `lib/utils/loadingSignal.ts` behavior) — this task changed zero motion logic, but it's the cheapest possible regression check for "did a token change accidentally break the SVG."

- [ ] **Step 5: Final commit (only if Step 2 surfaced fixes not yet committed)**

If Step 2 found any remaining dark-panel leftovers, fix them in the relevant component and commit:
```bash
git add <fixed files>
git commit -m "fix(design): remaining Almanaque Cálido spot-check fixes"
```
