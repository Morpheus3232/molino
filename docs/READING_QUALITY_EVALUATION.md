# Evaluación de calidad de la Lectura

Fecha: 2026-08-29. Continúa `PHASE2_SYNTHESIS_REFACTOR.md`.
Pregunta: la arquitectura ya está unificada — ¿el resultado es **técnicamente
correcto** o **genuinamente excelente**?

Método: se corrió `buildSynthesis` sobre una matriz de 12 perfiles reales
(Life Paths 1/4/5/7/8/11/33, los 4 elementos solares, 3 modalidades, 8
animales, casos borde: sin convergencia, convergencia de 3 sistemas, tensión
térmica, número maestro). La capa determinista se evaluó de forma empírica
sobre esas 12 salidas. La capa de IA se evaluó a nivel de diseño de prompt
(sin claves de API en local — ver `MODEL_QUALITY_BENCHMARK.md`).

---

## 1. Veredicto por criterio (capa determinista)

| Criterio | Antes de esta sesión | Después de los arreglos | Nota |
|---|---|---|---|
| Especificidad | Media | **Media-alta** | Convergencias con evidencia trazable; patrones aún dependen de listas de rasgos por arquetipo (12 valores). |
| Síntesis cross-sistema | Baja (astrología ausente) | **Media-alta** | Astrología ahora participa en los 12 perfiles (elemento / modo / temperatura). Ver `ASTROLOGY_METHODOLOGY.md`. |
| Novedad del insight | Baja | **Media** | Las convergencias numéricas son literales; las de modo/tema aportan un ángulo no obvio. La novedad real la agrega la IA encima. |
| Coherencia | Alta | **Alta** | Las 3 superficies componen las mismas primitivas; sin contradicción interna en los 12. |
| Español | Correcto pero con muletillas | **Bueno** | Se eliminaron las colas de horóscopo (ver §2). |
| Lenguaje no genérico | **Malo** | **Bueno** | Era el peor problema; ver §2. |
| Utilidad | Media | **Media-alta** | Reglas ahora accionables y variadas; tensiones con implicación concreta. |
| Calidad de las tensiones | 1 tipo, disparaba poco | **3 tipos** | ritmo (LP×elemento), modo (LP×modalidad), temperatura (elemento solar×chino). Cubre más perfiles; sigue devolviendo `[]` honesto cuando no hay. |
| Calidad de las reglas | **Mala** (3 plantillas, 8 reglas word-swap) | **Buena** | 10 marcos rotados por índice; al prompt solo van 3, como "material crudo". |
| Manejo de incertidumbre | Inexistente | **Fuerte** | 4 ítems siempre (luna aprox., sin nº de expresión, sin ascendente/casas, naturaleza simbólica), visibles al usuario en `/lectura`. |
| Consistencia con la síntesis canónica | N/A | **Garantizada por construcción** | `personal_profile` y `question` reciben el mismo `renderPersonalModel(buildSynthesis(...))`. |
| Tasa de contradicción (IA↔canónico) | No medible sin claves | **Estructuralmente contenida** | El prompt entrega el modelo y ordena "NUNCA contradecirlo"; falta medición empírica (pendiente, requiere claves). |

---

## 2. Problemas encontrados y arreglados esta sesión

Todos en `lib/engines/synthesisEngine.ts` + `promptBuilder.ts`.

### 2.1 `buildRules` — el peor ofensor (ARREGLADO)
**Antes:** todo perfil recibía 4× `"Cuando dudes, andá hacia tu {X} — es una
fortaleza real, no un accesorio."` + 3× `"Tu {X} es una señal, no un defecto
— escuchala antes de que se vuelva un costo."` + 1× `"Tu motor es {X}. No lo
apagues solo para encajar."`. 8 reglas, 3 plantillas, palabra cambiada. Un
lector ve el molde al instante. Y `renderPersonalModel` le pasaba 6 de estas
a la IA, enseñándole la voz de plantilla.

**Ahora:** `STRENGTH_RULE_FRAMES` / `CHALLENGE_RULE_FRAMES` — 5 marcos cada
uno, rotados por índice, concretos y accionables ("Ante una bifurcación,
elegí la opción que más use tu {x}", "Vigilá tu {x} en los picos de presión
— es ahí donde pasa de rasgo a costo"). La regla de tensión ahora se deriva
del título real de la tensión (antes había una sola frase hardcodeada de
"ritmo" que quedaba mal cuando la tensión era de modo o temperatura).
`renderPersonalModel` pasa solo 3, etiquetadas como
"SEÑALES DE COMPORTAMIENTO (crudas)".

### 2.2 Colas de relleno en `buildPatterns` (ARREGLADO)
- `"Esto te impulsa en cada área de tu vida."` → eliminada (2 ocurrencias).
- `"Observar este patrón es el primer paso para transformarlo."` → eliminada
  (2 ocurrencias). Reemplazada por mecánica concreta: "es un síntoma, no la
  causa. Aparece antes en situaciones de cansancio o presión."
- `"tu naturaleza no está peleando contra el momento, lo está empujando en la
  misma dirección."` → "Es de los pocos tramos donde no tenés que elegir
  entre tu forma de ser y el momento."
- `"Tu necesidad de {challenge}"` → semánticamente raro (nadie *necesita*
  rigidez) → `"Tu {challenge} se activa cuando…"`.
- `"Tu próximo movimiento"` fallback: era `YEAR_TYPES.description` cruda
  ("Poder, abundancia, logros.") → `"Año de Manifestación: poder, abundancia,
  logros. Es el eje del año, no una obligación — marca hacia dónde rinde más
  el esfuerzo."`

### 2.3 Sobreafirmación en las convergencias (ARREGLADO — cruza con §epistémica)
Las `statement` de `buildConvergences` presentaban interpretaciones de Molino
como hechos. Se pasaron a registro atribuido:
- 3-sistemas: `"suele ser el rasgo más difícil de disimular y el más caro de
  reprimir"` → `"estas tradiciones lo leen como un rasgo central, de los que
  cuesta mantener a raya."`
- modo: `"Es una de las pocas cosas de tu mapa donde no hay que negociar"` →
  `"En este punto el número y el temperamento no se contradicen — no todo el
  mapa funciona así."`
- elemento: `"La cualidad de {x} está en vos por partida doble."` →
  `"Dos lecturas independientes coinciden en {x}; qué tan literal tomarlo lo
  matiza el resto del mapa."`
- `evidence` ahora nombra explícitamente qué parte es agrupador de Molino.
- **Corregido tras QA visual:** `"ver THEME_BUCKETS"` filtraba un
  identificador de código al usuario → `"un agrupador temático propio de
  Molino, no de las tradiciones."`

### 2.4 `renderPersonalModel` — reducción del loro (ARREGLADO)
Encabezado nuevo: **"es MATERIAL EN BRUTO. Las frases de abajo están en tono
de plantilla a propósito — NO copies ninguna. Reescribí con voz de editor."**
Reglas al prompt: 6 → 3.

### 2.5 Bug latente encontrado en QA (ARREGLADO)
`PremiumChatSection.scrollToBottom` llamaba `scrollIntoView` sin guardar —
unhandled rejection en jsdom/SSR y si el timeout dispara tras desmontar.
Guardado con `typeof el.scrollIntoView === "function"`.

---

## 3. Qué sigue siendo "correcto" pero no "excelente" (deuda honesta)

1. **Los patrones dependen de un vocabulario de rasgos por arquetipo de 12
   valores.** Dos personas con el mismo Life Path y animal distinto pero
   rasgos-tema solapados verán "Tu motor" casi igual. La profundidad real la
   agrega la IA; el determinista es el andamiaje.
2. **La incertidumbre es idéntica para todo perfil** (porque `birthTime`
   nunca se recolecta). Es correcto, no un defecto — pero significa que ese
   bloque no distingue perfiles. Si alguna vez se pide la hora, el modelo ya
   lo contempla (`moonApproximate`).
3. **`buildTensions` sigue devolviendo `[]` para una parte de los perfiles**
   (los que no tienen ni choque de ritmo, ni de modo, ni Fuego/Agua). Es
   honesto, pero un perfil sin tensión determinista depende enteramente de
   que la IA encuentre una real. El prompt lo pide explícitamente y le
   prohíbe inventarla.
4. **Contradicción IA↔canónico: sin medición.** Requiere claves de API. El
   diseño la contiene (mismo modelo entregado + instrucción), pero hay que
   verificarlo con salidas reales antes de cantar victoria.

---

## 4. Validación

`tsc` limpio · `vitest run` 1688 pass / 7 fail (los mismos 5 archivos
pre-existentes; 0 regresiones; el snapshot legacy `QUESTION_PROMPT` se
regeneró por la mano) · `next build` compila 1731 páginas · QA visual en
`VISUAL_QA.md`.
