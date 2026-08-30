# FASE 2 — Refactor del motor de síntesis

Fecha: 2026-08-29
Continúa `docs/AUDIT_LECTURA_SYNTHESIS.md`. Objetivo: un único modelo
personal autoritativo (`buildSynthesis`) que alimente MAPA, LECTURA e IA sin
que ninguna superficie vuelva a re-derivar la síntesis.

---

## 1. Arquitectura

```
                 buildSynthesis(profile)  ·  lib/engines/synthesisEngine.ts
                 ─────────────────────────────────────────────────────────
                 función pura, sin I/O, sin IA. Compone:
                   coordinates      (CÁLCULO — hechos deterministas)
                   patterns         (buildPatterns, ya existía, con guardrail)
                   convergences     (CrossSystemLink[] — 2+ sistemas → lo mismo)
                   differences      (CrossSystemLink[] — dominios distintos, sin choque)
                   tensions         (TensionInsight[] — contradicciones estructurales)
                   rules            (buildRules, ya existía)
                   uncertainties    (Uncertainty[] — lo que NO se puede afirmar)
                   systemsEngaged   (cuáles de los 3 sistemas aportaron un cruce real)
                          │
        ┌─────────────────┼──────────────────────────┐
        ▼                 ▼                          ▼
      MAPA / LECTURA (gratis)   LECTURA (paga)         IA
      ConvergenceSection        promptBuilder V2       promptBuilder V2
      (buildSynthesis directo)  personal_profile       question
                                renderPersonalModel()  renderPersonalModel()
                                   ↑ vía la ruta          ↑ misma función
                                app/api/intelligence/interpret
                                buildSynthesis(profile) → request.synthesis
```

`renderPersonalModel(synthesis)` es **una sola función** que emite el bloque
`MODELO PERSONAL DE MOLINO` para el prompt. `personal_profile` y `question`
la comparten — ninguno arma su propio grounding.

### Distinción epistémica preservada

Cada `CrossSystemLink` lleva `layer: EpistemicLayer`
(`"calculo" | "fuente" | "interpretacion" | "inferencia" | "incertidumbre"`)
y separa `evidence` (la derivación verificable: cálculo + fuente) de
`statement` (la lectura simbólica). Las convergencias numéricas son
`layer: "calculo"`; los cruces de modo/elemento/tema son `layer: "inferencia"`.
La incertidumbre vive en su propia lista y el prompt la marca explícitamente
como "NO presentes esto como certeza".

---

## 2. Archivos cambiados

| Archivo | Cambio |
|---|---|
| `lib/engines/synthesisEngine.ts` | **+ `buildSynthesis`, `buildConvergences`, `buildDifferences`, `buildUncertainties`** y tipos (`PersonalSynthesis`, `CrossSystemLink`, `Uncertainty`, `EpistemicLayer`, `SynthesisCoordinates`). `buildTensions` pasó de 1 a 3 detectores (ritmo, modo, temperatura). Helpers nuevos: `getLifePathMode`, `MODALITY_MODE`, `SHARED_ELEMENTS`, `SUN_SIGN_TRAITS`/`getSunSignTraits`. |
| `lib/engines/intelligence/types.ts` | `InterpretationRequest.synthesis?: PersonalSynthesis`. |
| `lib/engines/intelligence/promptBuilder.ts` | `renderPersonalModel()` + `synthesisFromContext()` fallback. `personal_profile` y `question` consumen el modelo canónico (se borró el grounding ad-hoc de cada caso). Línea de Luna marcada como aproximada. Regla nueva: si la pregunta toca un punto de INCERTIDUMBRE, decirlo, no completarlo. |
| `app/api/intelligence/interpret/route.ts` | Computa `buildSynthesis(profile)` (del `UserProfile` completo que ya tenía) y lo pasa a `buildIntelligencePrompt`. Wiring de `AI_HEAVY_MODEL` para tipos premium. |
| `lib/engines/aiEngine.ts` | `generateWithOpenAI/Claude/OpenRouter` aceptan `modelOverride?`. |
| `lib/engines/providerRouter.ts` | `generateWithRouting` / `tryLegacyProvider` propagan `modelOverride`. |
| `components/profile/ConvergenceSection.tsx` | Reescrito sobre `buildSynthesis`: muestra convergencias (con evidencia en mono), diferencias e **incertidumbre** ("Lo que Molino no puede afirmar de vos"). Ya no depende de `convergentEngine`. |
| `lib/engines/convergentEngine.ts` | (Fase previa) se quitó la "convergencia" Yin/Yang ↔ par/impar (coin flip). |
| `app/ai/page.tsx` | Era un `redirect("/explore")`. Ahora es una superficie real: "Preguntale a tu Molino" — chat anclado para premium, valor + ejemplos + CTA para el resto. |
| `app/ai/layout.tsx` | Metadata title `AI` → `Preguntale a tu Molino`. |
| `lib/engines/__tests__/synthesisEngine.test.ts` | +14 tests para el modelo unificado. |

---

## 3. Esquema del modelo (`PersonalSynthesis`)

```ts
interface PersonalSynthesis {
  coordinates: {
    lifePath; lifePathIsMaster;
    personalityNumber; expressionNumber?;          // expression casi siempre ausente (ver §7)
    sunSign; sunElement; sunModality;
    moonSign?; moonApproximate;                    // moonApproximate = !birthTime (hoy siempre true)
    chineseAnimal; chineseElement;
    archetype;
    personalYear; personalMonth; personalDay;
  };
  patterns: PatternInsight[];                       // motor / tensión / próximo movimiento
  convergences: CrossSystemLink[];                  // kind "convergencia"
  differences: CrossSystemLink[];                   // kind "diferencia"
  tensions: TensionInsight[];                       // contradicciones estructurales
  rules: RuleInsight[];
  uncertainties: { field; note }[];
  systemsEngaged: string[];                         // subset de {Numerología, Astrología, Zodiaco Chino}
}

interface CrossSystemLink {
  systems: string[];                                // p.ej. ["Astrología","Zodiaco Chino"]
  kind: "convergencia" | "diferencia";
  layer: "calculo" | "fuente" | "interpretacion" | "inferencia" | "incertidumbre";
  statement: string;                                // lectura simbólica
  evidence: string;                                 // derivación verificable
}
```

---

## 4. Cómo participa la astrología (era "un pasajero")

Detectores deterministas nuevos, todos explicables y ninguno inventado:

| Cruce | Regla | Tipo |
|---|---|---|
| **Astrología × Numerología — modo** | Modalidad solar (Cardinal/Fijo/Mutable → iniciar/consolidar/adaptar) vs. "modo" del Life Path (misma agrupación acción/estructura/expresión que ya usaba `getLifePathPace`, en el vocabulario de las modalidades). Igual → convergencia; par opuesto (consolidar↔adaptar) → tensión; distinto no opuesto → diferencia. | inferencia |
| **Astrología × Numerología — ritmo** | (Ya existía) pace del Life Path vs. pace del elemento solar. | inferencia |
| **Astrología × Zodíaco Chino — elemento** | Elemento solar occidental == elemento del tronco chino, **solo** en {Fuego, Tierra, Agua} (los tres nombres que las dos tradiciones comparten literalmente). Aire y Metal/Madera no tienen equivalente → no se afirma nada. | inferencia |
| **Astrología × Zodíaco Chino — temperatura** | Fuego solar + Agua chino (o inverso) → tensión ("tu reacción inmediata y tu procesamiento de fondo no tienen la misma temperatura"). Único par inequívocamente antagónico. | inferencia |
| **3 sistemas — un tema** | Arquetipo (numerología) ∩ rasgos del animal (chino) ∩ rasgos del signo solar (astrología), todos por el **mismo bucket** de `findSharedTheme`/`THEME_BUCKETS`. El cruce más exigente; raro por diseño. | inferencia |

`SUN_SIGN_TRAITS` son keywords de manual por signo (análogo a
`getChineseTraits`), y si una palabra no cae en ningún bucket no fuerza
match. Verificado en 4 fechas reales: la astrología aparece en las 4
(elemento, modo o temperatura); las convergencias fabricadas quedan en 0
cuando no hay nada real (perfil 2001-01-30: 0 convergencias, 1 diferencia).

---

## 5. Precisión de la Luna (§3)

**Decisión: etiquetar la aproximación explícitamente y no usarla nunca como
señal de alta confianza.** No se agrega la hora de nacimiento al onboarding
(contradice el posicionamiento "solo tu fecha, sin datos personales extra" y
el propio comentario de `types/user.ts`).

Implementación:
- `coordinates.moonApproximate = !birthTime` (hoy siempre `true`).
- `coordinates.moonSign` se computa igual (aproximación de mediodía) pero es
  **descriptivo únicamente**: ningún detector de convergencia/tensión lo lee
  — todos usan el Sol (elemento/modalidad).
- `buildUncertainties` emite siempre, sin hora: `Signo lunar` (aprox. de
  mediodía, puede ser el contiguo cerca de un borde), `Ascendente y casas`
  (fuera de alcance).
- El prompt marca `Luna en X (aproximada — sin hora de nacimiento; ver
  INCERTIDUMBRE)` y ordena a la IA que, si la pregunta toca la Luna, diga que
  no puede afirmarla con precisión en vez de completarla.
- `ConvergenceSection` muestra la incertidumbre al usuario ("Lo que Molino no
  puede afirmar de vos").

Si más adelante se decide pedir la hora, `moonApproximate` ya distingue el
caso y basta con quitar la entrada de incertidumbre cuando `birthTime` está.

---

## 6. Decisión de modelo (§7)

**Mecanismo entregado, sin subir el gasto de forma autónoma.**
- `AI_HEAVY_MODEL` (env, **sin default en código**) fuerza un modelo
  específico para `personal_profile` y `question` (el centro intelectual de
  la Lectura y el chat anclado). Los tipos gratuitos (`daily_energy`,
  `timing`, `compatibility`, `pattern`) siguen en el modelo barato
  (`OPENROUTER_MODEL` / default `deepseek/deepseek-v4-flash`).
- Sin la variable, el comportamiento no cambia.

**Recomendación para producción:** setear
`AI_HEAVY_MODEL=anthropic/claude-3.7-sonnet` (o el modelo frontera que
prefieras en OpenRouter). El modelo actual por defecto (`deepseek-v4-flash` /
`gpt-4o-mini`) es adecuado para respuestas cortas y estructuradas, pero corto
para síntesis multi-sistema con prosa cuidada en rioplatense. No se hardcodeó
un modelo pago como default porque es una decisión con impacto económico en
un sistema externo — la deja tomada quien opera el deploy.

Nota menor: en el path de error, `recordGeneration` loguea el modelo del env
por proveedor, no el override — telemetría, sin efecto en el contenido.

---

## 7. Decisión del Número de Expresión (§8)

**Decisión: A — no está en el flujo activo, y ahora es coherente (no un
half-state).**

Razón de producto: el número de expresión necesita el nombre completo, que
el onboarding no pide a propósito (privacidad, cero fricción — el propio
`types/user.ts` dice "name no se colecta y no debería exigirse río abajo").
Además es el valor numerológico más sensible a transliteración/ortografía en
español (acentos, apellidos compuestos).

Estado coherente:
- El cálculo (`calculateExpressionNumber`) se conserva: si algún flujo pasa
  un nombre (p. ej. compatibilidad con datos completos), sigue funcionando.
- En el flujo principal, `expressionNumber` es `undefined` y **nada lo
  presenta**: el prompt ya lo emite condicionalmente, `PersonalCode.expression`
  se guarda en `''`/0, y `buildUncertainties` lo dice explícitamente
  ("No se calcula: Molino no pide tu nombre").
- No se muestra en `FeatureComparison` ni en la Lectura.

O sea: feature condicional, limpia y documentada — no un dato roto colgando.

---

## 8. Validación

- `tsc --noEmit` — limpio.
- `vitest run` — **1688 pass**, 7 fail (los mismos 5 archivos que ya fallaban
  antes de esta sesión, verificado con `git stash`; cero regresiones). Los 14
  tests nuevos de `buildSynthesis` cubren: composición, `moonApproximate` y su
  incertidumbre con/sin `birthTime`, incertidumbre de expresión y de
  naturaleza de los sistemas siempre presente, no-fabricación (toda
  convergencia con ≥2 sistemas y evidencia no vacía), convergencia numérica /
  de modo, tensión de modo / térmica, diferencia vs. tensión, Aire nunca
  cruza elemento con el chino, `systemsEngaged` solo lista los 3 reales,
  determinismo.
- `next build` — compila, `/ai` se genera.
- Comportamiento inspeccionado sobre 4 fechas reales (script efímero): la
  astrología participa en las 4; convergencias fabricadas = 0 cuando no hay
  señal; las 4 incertidumbres presentes siempre; misma síntesis del lado
  servidor (ruta) y cliente (`ConvergenceSection`).
- **Sin verificación visual interactiva** (sin extensión de Chrome). Pendiente
  para antes de Fase 3: ver `/lectura` (ConvergenceSection nueva), `/ai`
  (premium y no premium), `/profile`, y una lectura Pro real end-to-end para
  confirmar que la IA referencia el MODELO y no lo contradice.

## 9. Sin contradicción gratis ↔ pago

`personal_profile` y `question` reciben el **mismo** `renderPersonalModel`
que se computa de la **misma** `buildSynthesis` que alimenta
`ConvergenceSection`. El prompt ordena "PROFUNDIZARLO... NUNCA repetirlo
textual y NUNCA contradecirlo". Antes, `personal_profile` re-derivaba desde
~6 coordenadas crudas y podía chocar con lo que el lector acababa de ver
gratis; eso ya no puede pasar por construcción.

## 10. Pendiente (no bloquea Fase 3, pero anotado)

- El flujo real de `/lectura` sigue sin mandar `dailyEnergy`/`timing` al
  `personal_profile` (el MODELO ya trae las convergencias de ciclos, así que
  el hueco es menor que antes).
- `LecturaProfunda.tsx` exporta `LecturaPremium`/default posiblemente muertos
  (solo `LecturaLibre` se consume). Revisar en limpieza.
- `ChatWithMolino` sigue siendo un wrapper de 14 líneas sobre
  `PremiumChatSection`.
- Descubribilidad de `/ai`: falta un link desde la nav / `/profile` /
  `/lectura` (se resuelve naturalmente en Fase 3, consolidación de rutas).
