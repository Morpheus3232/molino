# QA visual — Fase 2 + arquitectura de síntesis

Fecha: 2026-08-29.
Método: `next dev` local + Playwright (la extensión de Chrome no estaba
conectada). Capturas full-page desktop (1440×900) y mobile (390×844) de:
homepage, `/explore`, `/premium`, `/conocimiento/numerologia`, `/profile`,
`/lectura`, `/ai`. Perfil sembrado: `?dob=1988-11-24` (LP7, Sagitario,
Dragón/Tierra).

---

## Veredicto general

**El estándar "nítido" se sostiene.** Sistema visual consistente en las 7
rutas y en los dos breakpoints: fondo hueso cálido, display serif
(Newsreader) a gran escala, eyebrows en mono con tracking amplio, reglas de
hairline, un solo rojo de acento usado con moderación. Sin card-grid
overload, sin gradientes gratuitos, sin neón, sin sombras de más. Ninguna
ruta rompe layout ni produce scroll horizontal en mobile. Tipografía,
alineación y jerarquía correctas en todo.

## MAPA / LECTURA / IA — ¿se comunica la distinción?

| Superficie | Lee como | Nota |
|---|---|---|
| `/profile` | **estructura** | Hero de identidad + "LOS CUATRO PILARES DE TU MAPA" + coordenadas + Atlas. Claramente "qué está presente". |
| `/lectura` | **síntesis** | La nueva `ConvergenceSection` ("DONDE COINCIDEN TUS SISTEMAS" → convergencias con evidencia en mono → "LO QUE MOLINO NO PUEDE AFIRMAR DE VOS") se lee inequívocamente como "qué significa cruzar los elementos". Después: patrones, tensión, reglas, y el cierre pago "LA CONVERSACIÓN ENTRE TUS SISTEMAS". |
| `/ai` | **diálogo** | "PREGUNTALE A TU MOLINO", explica que ya tiene el mapa, ejemplos de preguntas, CTA a Pro (vista no-premium). El "← MI MAPA" lo ata al flujo. |

La distinción **está comunicada por contenido y composición**, aunque no
etiquetada como un modelo de 3 niveles explícito. Aceptable para esta fase.

**Hallazgo para Fase 3:** la homepage no menciona la IA en absoluto (habla de
"tres sistemas" simbólicos y de "el mapa cambia con la fecha"). El tercer
nivel del producto no aparece en la portada. A resolver junto con la
arquitectura de rutas.

---

## Issues encontrados

### Arreglados esta sesión
| # | Issue | Fix |
|---|---|---|
| 1 | `ConvergenceSection` mostraba `"ver THEME_BUCKETS"` — un identificador de código — al usuario final. | `buildConvergences` E: `evidence` → "un agrupador temático propio de Molino, no de las tradiciones." |
| 2 | `PremiumChatSection.scrollToBottom` lanzaba unhandled error (`scrollIntoView is not a function`) en jsdom / entornos sin la API / tras desmontar. | Guard `typeof el.scrollIntoView === "function"`. |

### Anotados, no arreglados (fuera de P0 o intencionales)
- **`/profile?dob=` deep-link muestra ~8–10 s el loader de "reducción del
  método" antes del mapa.** Es una animación teatral por diseño
  (`MethodReductionLoader`), pero es larga para un enlace directo. Candidato a
  acortar o a saltear cuando el perfil viene por `?dob=` en vez de por
  onboarding.
- **Email de contacto del footer `versionlimitada@proton.me`** parece un
  placeholder. Revisar en la limpieza de contenido de Fase 3.
- El indicador circular "N" abajo a la izquierda en las capturas es el
  **overlay de `next dev`** — no existe en producción, no es un bug.
- Las páginas de contenido usan una medida de ~600–660 px con bastante aire a
  la derecha en 1440. Es una decisión editorial deliberada (largo de línea
  legible); no se toca.

---

## Rutas verificadas OK (desktop + mobile, sin romper)

`/` · `/explore` · `/premium` · `/conocimiento/numerologia` · `/profile` ·
`/lectura` · `/ai`
