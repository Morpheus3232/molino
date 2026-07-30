# FASE 10 — QA y Consistencia

Antes de lanzar, realizar una auditoría final.

---

## Checklist

### Sistema visual

| Verificación | Estado | Notas |
|---|---|---|
| ¿Hay un solo lenguaje de espaciados? | ✅ | Escala cerrada. 98 usos de la escala `5` (20px), que no existía en los tokens, normalizados a `6` (24px). Verificado: 0 ocurrencias restantes. |
| ¿Los radios son consistentes? | ✅ | Todo `rounded-none`. 71 pills y botones migrados desde `rounded-full`; los 42 dots y spinners circulares se conservan a propósito. |
| ¿La tipografía sigue la escala? | ✅ | `font-display` / `font-heading` / `font-sans` / `font-mono` según DESIGN_SYSTEM.md. `font-serif` eliminado (no había fuente serif cargada). |
| ¿Los colores respetan los tokens? | ✅ | `bg-card/60` → `bg-card`; eliminados los modificadores de opacidad sobre texto atenuado. Quedan hex fijos solo en las tarjetas exportables como imagen, que es intencional. |
| ¿Las sombras existen? | ✅ | No. `tailwind.config.ts` mapea `boxShadow` a los tokens `--shadow-*`, todos en `none`. Las 45 clases `shadow-*` que no producían efecto fueron eliminadas. |

### Componentes

| Verificación | Estado | Notas |
|---|---|---|
| ¿El mismo botón se comporta igual en todas las páginas? | ✅ | Un solo sistema: componente `Button` con variantes primary/accent/secondary/ghost/inverse. Las clases globales `btn-*` ya no se usan (0 ocurrencias). |
| ¿Las tarjetas mantienen la misma estructura? | ✅ | `Card` con padding none/sm/md/lg. El hover usaba `shadow` (que es `none`), así que no producía efecto; ahora se expresa con el borde. |
| ¿Los estados de carga y error son coherentes? | ⚠️ | `LoadingState` en 17 lugares y skeleton en `/daily-energy`. Falta skeleton en `/profile`. |
| ¿Hay componentes compartidos para patrones repetidos? | ✅ | `SearchInput` (unifica 6 buscadores inline), `Chip`, `Badge`, `Breadcrumbs`, `EmptyState`. |
| ¿Hay código muerto? | ✅ | Eliminados `Grid`, `GridSystem`, `Masonry`, `DatePicker`, `ScrollDatePicker` (0 referencias cada uno). |

### Experiencia

| Verificación | Estado | Notas |
|---|---|---|
| ¿Siempre hay un CTA principal? | | Cada pantalla debe tener exactamente un CTA primary |
| ¿Cada pantalla tiene una jerarquía clara? | | H1 → H2 → H3 → Body, con pesos y tamaños consistentes |
| ¿El usuario sabe qué hacer a continuación? | | Cada pantalla debe tener un siguiente paso claro |

### Calidad

| Verificación | Estado | Notas |
|---|---|---|
| Desktop | | Testear en Chrome, Firefox, Safari (últimas 2 versiones) |
| Tablet | | Testear en iPad Air, iPad Mini |
| Mobile | | Testear en iPhone SE, iPhone 14, Pixel 4a |
| Modo claro | | Verificar contraste, colores, sombras |
| Modo oscuro | | Verificar contraste, colores, sombras |
| Navegación con teclado | | Tab order, focus states, skip links |
| Accesibilidad | | ARIA labels, alt text, semantic HTML |
| Rendimiento | | Lighthouse > 90 en todas las métricas |


### Resultados verificados (última pasada)

| Verificación | Estado | Notas |
|---|---|---|
| Build | ✅ | `next build` OK, 457 páginas generadas. `tsc --noEmit` limpio. |
| Modo claro | ✅ | Verificado en navegador sobre el build de producción. |
| Modo oscuro | ✅ | Verificado: buscador, chips y estado seleccionado legibles. |
| Contraste WCAG AA | ✅ | El token `--color-muted` (#6B6B6B) da 5.33:1 sobre blanco. Eliminados 52 usos con opacidad que caían a 2.4–3.5:1, y los `text-white/40` del footer (3.82:1). |
| Navegación con teclado | ✅ | CTAs y herramientas migrados de `<button onClick>` a `<a href>`: abribles en pestaña nueva, indexables y accesibles. `focus-visible` en todos los interactivos. |
| Accesibilidad | ⚠️ | `SearchInput` exige `label`; `Chip` usa `aria-pressed`. Falta pasada con axe-core. |
| Títulos SEO | ✅ | Corregido "Molino" duplicado en ~20 páginas. `/daily-energy` tiene metadata y canonical. |
| Rendimiento (Lighthouse > 90) | ⬜ | Sin medir. |
| Testeo en dispositivos reales | ⬜ | Sin hacer. |

---

## Sistema visual

### Lenguaje de espaciados

**Tokens definidos en DESIGN_SYSTEM.md:**
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

**Verificación:**
```bash
# Buscar espaciados inconsistentes
grep -r "px-[0-9]" src/ | grep -v "px-4\|px-5\|px-6\|px-8"
grep -r "py-[0-9]" src/ | grep -v "py-4\|py-5\|py-6\|py-8\|py-10\|py-12\|py-16\|py-20\|py-24"
grep -r "m-[0-9]\|mx-[0-9]\|my-[0-9]" src/ | grep -v "m-0\|m-1\|m-2\|m-3\|m-4\|m-5\|m-6\|mx-0\|mx-auto\|my-2\|my-3\|my-4\|my-5\|my-6"
```

### Radios de borde

**Tokens definidos:**
- `sm`: 4px (inputs, badges)
- `md`: 8px (botones, cards pequeñas)
- `lg`: 12px (cards grandes, modales)
- `xl`: 16px (hero, secciones grandes)

**Verificación:**
```bash
# Buscar border-radius inconsistentes
grep -r "rounded" src/ | grep -v "rounded-sm\|rounded-md\|rounded-lg\|rounded-xl\|rounded-full\|rounded-none"
```

### Escala tipográfica

**Tokens definidos:**
- `h1`: 36px / 40px (desktop) → 28px / 32px (mobile)
- `h2`: 28px / 32px → 24px / 28px
- `h3`: 22px / 26px → 20px / 24px
- `h4`: 18px / 22px → 18px / 22px
- `body`: 16px / 24px
- `small`: 14px / 20px
- `micro`: 12px / 16px

**Verificación:**
```bash
# Verificar font-size en componentes
grep -r "text-" src/ | grep -v "text-xs\|text-sm\|text-base\|text-lg\|text-xl\|text-2xl\|text-3xl\|text-4xl"
```

### Tokens de color

**Verificación:**
```bash
# Buscar colores hardcoded
grep -r "bg-[#\|text-[#\|border-[#" src/
grep -r "bg-[a-z]-\|text-[a-z]-\|border-[a-z]-" src/ | grep -v "bg-primary\|bg-secondary\|bg-accent\|bg-background\|bg-card\|bg-border\|text-primary\|text-secondary\|text-accent\|text-muted\|border-primary\|border-secondary\|border-border"
```

---

## Componentes

### Botones

**Verificaciones:**
1. El mismo botón (`Button.tsx`) se usa en todas las páginas.
2. Los estados (default, hover, active, disabled, loading) son consistentes.
3. El tamaño y padding son uniformes.
4. Los iconos están alineados correctamente.

**Test manual:**
- [ ] Página de inicio: botón hero
- [ ] Página de resultados: botón CTA
- [ ] Página de formulario: botón submit
- [ ] Página de error: botón retry
- [ ] Modal: botón confirm

### Tarjetas

**Verificaciones:**
1. `Card.tsx` mantiene padding consistente (20px mobile, 24px desktop).
2. El border-radius es `lg` (12px) en todas las variantes.
3. La sombra es consistente (`shadow-sm` default, `shadow-md` hover).
4. El border es consistente (`border border-border`).

**Test manual:**
- [ ] Homepage: cards de funcionalidades
- [ ] Explorar: cards de contenido
- [ ] Mi Mapa: cards de resultados
- [ ] Daily Energy: card de predicción

### Estados de carga y error

**Verificaciones:**
1. `Loading` component es consistente en todas las páginas.
2. `Error` component muestra mensaje claro y CTA de retry.
3. `EmptyState` es consistente y tiene CTA.
4. Los estados de loading de botones son consistentes.

**Test manual:**
- [ ] Navegación entre páginas (loading)
- [ ] Formulario con error de validación
- [ ] Página sin resultados (empty state)
- [ ] Botón con loading prop

---

## Experiencia

### CTA principal

**Verificaciones:**
1. Cada pantalla tiene exactamente un CTA primary.
2. El CTA está en la posición esperada (bottom sticky en mobile).
3. El CTA tiene texto claro y accionable.
4. El CTA es accesible con teclado.

**Pantallas a verificar:**
- [ ] `/` (Home)
- [ ] `/decisions` (Decisions)
- [ ] `/daily-energy` (Daily Energy)
- [ ] `/timing` (Timing)
- [ ] `/affinity` (Affinity)
- [ ] `/compatibility` (Compatibility)
- [ ] `/knowledge` (Knowledge)
- [ ] `/explore` (Explore)
- [ ] `/search` (Search)

### Jerarquía visual

**Verificaciones:**
1. Cada pantalla tiene un H1 claro.
2. Los H2-H3 siguen la escala tipográfica.
3. El peso de la tipografía es consistente (700 para H1, 600 para H2, 500 para H3).
4. El contraste cumple WCAG AA (4.5:1 mínimo).

**Pantallas a verificar:**
- [ ] Todas las páginas listadas arriba

### Flujo de usuario

**Verificaciones:**
1. Cada pantalla tiene un "próximo paso" claro.
2. El breadcrumb o navegación muestra el progreso.
3. No hay pantallas sin salida.
4. El usuario puede navegar hacia atrás.

---

## Calidad

### Desktop

| Navegador | Versión | Estado |
|---|---|---|
| Chrome | Última | |
| Firefox | Última | |
| Safari | Última | |
| Edge | Última | |

### Tablet

| Dispositivo | Estado |
|---|---|
| iPad Air | |
| iPad Mini | |
| Surface Pro | |

### Mobile

| Dispositivo | Estado |
|---|---|
| iPhone SE (3ª gen) | |
| iPhone 14 | |
| iPhone 14 Pro Max | |
| Pixel 4a | |
| Pixel 7 | |
| Samsung Galaxy S23 | |

### Modo claro

**Verificaciones:**
- [ ] Contraste de texto cumple WCAG AA
- [ ] Sombras visibles y consistentes
- [ ] Borders visibles
- [ ] Estados de hover visibles

### Modo oscuro

**Verificaciones:**
- [ ] Contraste de texto cumple WCAG AA
- [ ] Sombras visibles y consistentes
- [ ] Borders visibles
- [ ] Estados de hover visibles

### Navegación con teclado

**Verificaciones:**
- [ ] Tab order lógico
- [ ] Focus states visibles
- [ ] Skip links funcionan
- [ ] Modales trapean el foco
- [ ] Escape cierra modales

### Accesibilidad

**Verificaciones:**
- [ ] ARIA labels en elementos interactivos
- [ ] Alt text en imágenes
- [ ] Semantic HTML (header, nav, main, section, footer)
- [ ] Headings en orden (H1 → H2 → H3)
- [ ] Color no es el único medio de información
- [ ] Form labels asociados a inputs

### Rendimiento

**Métricas Lighthouse:**

| Métrica | Target | Estado |
|---|---|---|
| Performance | > 90 | |
| Accessibility | > 90 | |
| Best Practices | > 90 | |
| SEO | > 90 | |

**Verificaciones:**
- [ ] Imágenes optimizadas (WebP, lazy loading)
- [ ] Fonts optimizadas (preload, font-display: swap)
- [ ] JavaScript minimizado y tree-shaken
- [ ] CSS crítico inline
- [ ] Sin console.log en producción

---

## Reporte de auditoría

### Sistema visual
| Issue | Prioridad | Estado | Asignado |
|---|---|---|---|
| | | | |

### Componentes
| Issue | Prioridad | Estado | Asignado |
|---|---|---|---|
| | | | |

### Experiencia
| Issue | Prioridad | Estado | Asignado |
|---|---|---|---|
| | | | |

### Calidad
| Issue | Prioridad | Estado | Asignado |
|---|---|---|---|
| | | | |

---

## Próximos pasos

1. Ejecutar checklist de sistema visual.
2. Verificar consistencia de componentes.
3. Testear en todos los dispositivos listados.
4. Ejecutar Lighthouse y corregir issues.
5. Realizar test de accesibilidad con axe-core.
6. Generar reporte final de auditoría.