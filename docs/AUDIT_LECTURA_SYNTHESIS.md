# AUDITORÍA — La Lectura y su pipeline de síntesis

Fecha: 2026-08-29
Alcance: `/lectura` (gratis + Pro), el motor de síntesis, el prompt de IA, el
fallback determinista, el chat contextual y sus límites public/premium.

Método: lectura del código end-to-end. No hubo verificación visual interactiva
(sin extensión de Chrome conectada). Las afirmaciones sobre "qué ve el
usuario" salen del código de render, no de una sesión real.

---

## 1. Arquitectura actual

### 1.1 Datos de entrada

**Onboarding** (`app/onboarding/page.tsx`) recolecta **solo la fecha de
nacimiento** (+ país opcional para afinidades). No pide nombre ni hora de
nacimiento. Termina en `/profile?dob=YYYY-MM-DD`.

**Cálculo del perfil** (`lib/engines/profileBuilder.ts` →
`calculateUserProfileData`):

| Sistema | Qué se calcula | Nota |
|---|---|---|
| Numerología | Life Path (dígitos de la fecha, maestros 11/22/33 preservados), reducción del día, **número de personalidad** (del día de nacimiento), **número de expresión** (del nombre), número de la suerte, ciclos (año/mes/día personal) | El **número de expresión queda `undefined` en el flujo principal**: el onboarding no pide nombre, y `calculateUserProfile('', dob)` lo omite. El código, el prompt y `PersonalCode` lo siguen referenciando. |
| Astrología | Signo solar + elemento + modalidad (rangos de fecha); **signo lunar** + elemento lunar (aprox. Meeus) | El signo lunar se calcula con **`birthTime` fijado en `"12:00"`** porque no se recolecta la hora. Cerca de un borde de signo (la Luna cambia de signo cada ~2,5 días) el resultado puede ser el signo anterior o el siguiente. Se presenta como dato ("Luna en X"), no como aproximación. **No hay ascendente, casas ni aspectos.** |
| Zodíaco chino | Animal + elemento + año lunar | Regla animal-vs-animal, según la filosofía del sitio. |

### 1.2 Página `/lectura`

`app/lectura/page.tsx` (estática, `robots: index:false` — correcto, es
contenido de una sola persona) → `LecturaClient` (perfil desde el hash `#` o
localStorage) → renderiza **dos bloques**:

```
LecturaGratis  → BirthGridSection
               → ConvergenceSection      (convergentEngine)
               → LecturaLibre            (LecturaProfunda.tsx → PiezasLibres → synthesisEngine)
               → FamousMatch
               → CalculationDetails
LaLecturaExperience → 1 llamada de IA (type=personal_profile) tras PremiumGate
                    → PremiumChatSection  (type=question, premium)
                    → LecturaAfinidadesFull
```

### 1.3 Flujo GRATIS — pieza por pieza

1. **`BirthGridSection`** — cuadrícula numerológica de nacimiento. **Un solo
   sistema.**

2. **`ConvergenceSection`** → `lib/engines/convergentEngine.ts`
   `buildConvergence()`. **Es la pieza cross-sistema gratuita.** Toma 5
   "capas" — Life Path, número de personalidad (día), animal natal, animal
   del año en curso, año personal — y detecta hasta **4 coincidencias
   hard-codeadas**, cada una con su regla visible:
   - `Life Path === año personal`
   - `animal natal === animal del año`
   - `número de personalidad === año personal`
   - `paridad Yin/Yang del animal === paridad par/impar del Life Path`

   Fortaleza: el hallazgo es **verificable a ojo** (muestra la aritmética).
   Problemas: (a) es detección de **igualdad numérica**, no interpretación;
   (b) la regla #4 (polaridad) es un ~50/50 — "coincide" en la mitad de los
   perfiles por azar y **infla el nivel de resonancia**; (c) de las 5 capas,
   2 son numerología y 2 son zodíaco chino, así que el titular "N sistemas se
   repiten" sobrevende (son capas, no sistemas independientes).

3. **`LecturaLibre`** (`components/profile/LecturaProfunda.tsx` →
   `PiezasLibres`), alimentada por `lib/engines/synthesisEngine.ts`:
   - **`buildPatterns()`** — 3 patrones:
     - *Tu motor*: keywords del arquetipo ∩ rasgos del animal chino, vía
       `findSharedTheme` (buckets temáticos).
     - *Tu tensión*: challenges de numerología ∩ palabras del tema del año
       personal.
     - *Tu próximo movimiento*: tema del año personal ∩ rasgos del animal.
     Cada patrón tiene **guardrail anti-fabricación real**
     (`assertNotCircular`, `findSharedTheme`, `SOURCE_SIGNAL`) y **degrada a
     una sola fuente honesta** cuando no hay tema compartido. El matching de
     temas es **grueso** (primera palabra de contenido que caiga en un
     diccionario de ~30 términos) → hay falsos negativos (pierde
     convergencias reales) y positivos poco profundos (matchea en una palabra
     genérica como "libertad").
   - **`buildTensions()`** — **un solo** detector de contradicción
     estructural: ritmo del Life Path (`[1,8,3,5]`=rápido, `[4,7]`=lento,
     resto=`null`) vs ritmo del elemento (`Fuego`=rápido, `Tierra/Metal`=
     lento, `Aire/Agua`=fluido). Solo dispara si el LP está en un grupo con
     ritmo **y** el elemento no es fluido **y** discrepan. **Para la mayoría
     de los perfiles devuelve `[]`** → la lectura no tiene tensión.
   - **`buildRules()`** — deriva de fortalezas/desafíos del arquetipo + los
     patterns/tensions ya computados. Tope 10, sin relleno. **No usa
     astrología, elemento chino, números maestros ni ciclos** más allá de lo
     que ya traen los patterns → "derivadas del perfil completo" es
     optimista: es "arquetipo + patterns".
   - **`calculateDailyEnergy()`** — ciclos numerológicos + fase lunar +
     elemento del signo solar vs elemento del día. **Mezcla numerología +
     algo de astrología (elemento, luna); cero zodíaco chino.**
   - `analyzeTiming()`, `getMasterNumbers()`.

4. **`FamousMatch`** — famoso del mismo animal chino. **Un solo sistema.**

5. **`CalculationDetails`** — transparencia: reducción de dígitos del Life
   Path, rango del signo solar, año del zodíaco chino, link a la fórmula en
   GitHub. **Muy bueno.** No cubre signo lunar, número de personalidad, año
   personal ni el motor de patterns.

### 1.4 Flujo PRO (`app/lectura/LaLecturaExperience.tsx`)

- **Una** llamada: `POST /api/intelligence/interpret` con
  `{ name, dob, salt, type: "personal_profile", premiumToken }`.
  **No envía `dailyEnergy` ni `timing`.** → en el prompt, los bloques
  `MOMENTO ACTUAL` y `TIMING` **siempre están ausentes** en el flujo real de
  `/lectura`. El año/mes/día personal sí están en el contexto base; el
  *score* de energía y la ventana de timing por intención, no.
- **Ruta** (`app/api/intelligence/interpret/route.ts`): rate-limit → gate de
  entitlement + token ligado al dispositivo → `calculateUserProfile` →
  `buildMolinoContext` → `generateFallbackInterpretation` (siempre, como red)
  + `buildIntelligencePrompt` → `generateWithRouting`.
  - **Proveedor por defecto: `openrouter` → `deepseek/deepseek-v4-flash`**
    (`AI_PRIMARY_PROVIDER`, `OPENROUTER_MODEL`). Fallbacks: `gpt-4o-mini`,
    `claude-3-5-sonnet-20241022`. `max_tokens` 6000, timeout 55s, techo duro
    65s.
  - Validación estructural + **semántica** (rechaza chain-of-thought
    filtrado en los valores). Cualquier fallo → fallback determinista.
    Cachea solo resultados reales, por `profileHash + type + promptHash`.
- **Prompt V2** (`lib/engines/intelligence/promptBuilder.ts`, activo en prod
  vía `INTELLIGENCE_ENGINE_V2_ENABLED`): **la parte más fuerte del sistema.**
  Tiene un "CONTRATO INTELECTUAL — CONVERGENCIA ENTRE SISTEMAS" con 7 reglas
  numeradas: cada insight principal debe salir de ≥2 señales de sistemas
  distintos; prohibido reformular el mapa; obligatorio una inferencia nueva;
  convertir a comportamiento observable; tensión estructural
  `A + B → fricción → manifestación`. Registro **diagnóstico** (sin hedging)
  exclusivo de la lectura paga. Guía por campo específica y anti-genérica.
  Campos: `opening`, `summary`, `corePattern {what/source/whyItMatters}`,
  `alignment`, `tensions[]`, `howYouOperate`, `blindSpot`,
  `lifeAreas {work/relationships/decisions}`, `relationalNote`, `timing`,
  `suggestedNextStep`, `closingSynthesis`, `strengths[]`, `whatToConsider[]`.
- **Grounding que recibe el modelo para `personal_profile`**: Life Path
  nombre/significado, expresión (**normalmente ausente**), bloque de números
  maestros, **animales afines/desafiantes reales** del zodíaco chino
  (`animalRelations`), año/mes/día personal. **No recibe**: detalle del signo
  lunar, ni los `patterns`/`tensions`/`convergence` deterministas que el
  usuario acaba de ver gratis (esos **sí** se pasan a `type=question`, no a
  `personal_profile`). → **La lectura paga re-deriva la síntesis desde ~6
  coordenadas crudas** en vez de construir sobre lo que el motor determinista
  ya encontró.

### 1.5 IA / chat

- **`PremiumChatSection`** (premium) → `type=question`, misma ruta. **Este
  sí** recibe grounding completo: `personalCode`, `buildPatterns` real,
  `buildTensions`, `buildRules`, relaciones chinas, + `readingContext`
  opcional (campos estructurales de la lectura que el usuario acaba de leer).
  Historial ≤8 turnos. Tope **50 preguntas de por vida**. Distingue en la
  respuesta DATO CALCULADO / INTERPRETACIÓN / RECOMENDACIÓN.
- **`components/profile/ChatWithMolino.tsx`** = wrapper de 14 líneas sobre
  `PremiumChatSection` (duplicación inocua).
- **No existe una superficie de IA propia.** `app/ai/page.tsx` hace
  `router.replace("/explore")`, y `/explore` es un índice de conocimiento
  (sistemas, conceptos, fuentes) — no una entrada de IA/chat. El tercer nivel
  del modelo MAPA/LECTURA/IA hoy es un sub-componente premium de la Lectura,
  sin casa propia.

---

## 2. Respuestas concretas a las 7 preguntas

**1. ¿Qué se sintetiza de verdad?**
Gratis: `ConvergenceSection` (coincidencias numéricas entre sistemas, con
regla visible), `buildPatterns` motor/movimiento (arquetipo↔chino por tema),
`buildTensions` (ritmo LP vs ritmo elemento). Todo con guardas
anti-fabricación. Pago: la lectura de IA **cuando el modelo respeta el
contrato** — `corePattern`, `blindSpot`, `lifeAreas`, `closingSynthesis`
están diseñados para ser emergentes, no per-sistema.

**2. ¿Qué es mera concatenación?**
`BirthGridSection` y `FamousMatch` son mono-sistema. En la lectura paga,
`strengths[]`, `tensions[]`, `timing` y `suggestedNextStep` **tienden a
colapsar a afirmaciones de un solo sistema** porque los insumos deterministas
que recibe el modelo son pobres (sin detalle lunar, sin expresión, sin
patterns/tensions computados, sin energía diaria): el contrato pide una
convergencia que los datos de entrada casi no sostienen.

**3. ¿Dónde interactúan realmente los tres sistemas?**
Solo en dos lugares: `convergentEngine` (numerología × chino, por igualdad
numérica) y `synthesisEngine.buildPatterns` (numerología/arquetipo × chino ×
ciclos, por bucket temático). **La astrología casi no participa** en ninguna
lógica cross-sistema determinista: el elemento solar alimenta `buildTensions`
(vs ritmo del LP) y `dailyEnergy`; el signo lunar no alimenta nada
estructural. No hay síntesis determinista numerología×astrología ni
astrología×chino.

**4. ¿Las tensiones salen de interacciones o son genéricas?**
Gratis: **una** interacción real (ritmo LP vs ritmo elemento), si no, vacío —
honesto pero angosto. Pago: el prompt exige `A+B→fricción→manifestación`,
pero como a `personal_profile` **no se le entrega ninguna lista de tensiones
deterministas**, el modelo las inventa desde coordenadas. La calidad depende
por completo del modelo (que por defecto es de gama barata).

**5. ¿Las reglas salen del perfil completo?**
`buildRules` traza cada regla a una fortaleza/desafío real del arquetipo o a
un pattern/tension ya computado. **No usa** astrología, elemento chino,
números maestros ni ciclos. "Perfil completo" es una exageración: es
"arquetipo + patterns".

**6. ¿La IA está anclada en la Lectura?**
Chat: sí — `readingContext` se pasa y el prompt indica usarlo como grounding
sin repetirlo. Buen diseño. Pero `readingContext` es best-effort (solo si el
fetch silencioso resolvió) y está capado a 500 chars por campo. **La lectura
en sí no está anclada en la síntesis determinista gratuita** (patterns /
tensions / convergencias) — nada de eso está en su prompt.

**7. ¿Qué haría falta para que sea de clase mundial?** → sección 5.

---

## 3. Fortalezas (no romper)

- **Disciplina anti-fabricación real y poco común**: `assertNotCircular`,
  `findSharedTheme`, `SOURCE_SIGNAL`, validación semántica del output de IA,
  fallbacks honestos de una sola fuente.
- **El contrato del prompt pago está genuinamente bien diseñado.**
- **Honestidad epistémica**: `CalculationDetails`, "esto es una lente, no un
  diagnóstico", campos `confidence`/`limitations`, cero predicción.
- **Fallback determinista** que degrada con gracia y nunca se hace pasar por
  IA.
- **Privacidad**: perfil en hash/localStorage, token premium ligado al
  dispositivo, sin base de datos.

---

## 4. Debilidades (orden de impacto)

1. **La astrología es un pasajero.** No hay síntesis determinista
   astrología×(numerología|chino). El signo lunar es una aproximación de
   mediodía (no se pide la hora) presentada como dato. → la promesa de "3
   sistemas" es en realidad "2 sistemas + un signo solar".
   *Archivos:* `astrologyEngine.ts`, `convergentEngine.ts`, `synthesisEngine.ts`,
   `contextBuilder.ts`, `app/onboarding/page.tsx`.

2. **La lectura paga está sub-alimentada.** Ni la ruta ni la UI pasan los
   `patterns`/`tensions`/`convergence`/`dailyEnergy` deterministas a
   `type=personal_profile`. El modelo re-deriva la síntesis desde ~6
   coordenadas crudas → riesgo de output genérico, y la lectura puede
   **contradecir** los patrones gratuitos que el usuario acaba de leer.
   *Archivos:* `app/lectura/LaLecturaExperience.tsx` (`fetchLectura`),
   `app/api/intelligence/interpret/route.ts`,
   `lib/engines/intelligence/promptBuilder.ts` (caso `personal_profile`).

3. **Modelo barato para el "centro intelectual".** `deepseek-v4-flash` /
   `gpt-4o-mini` generan lo que se vende como la síntesis más profunda.
   *Archivos:* `lib/engines/providerRouter.ts`, `lib/engines/aiEngine.ts`.

4. **`buildTensions` dispara para una minoría de perfiles.** Un solo tipo de
   contradicción implementado. La mayoría de los usuarios recibe cero tensión
   determinista.
   *Archivo:* `lib/engines/synthesisEngine.ts`.

5. **Regla #4 de `convergentEngine` (Yin/Yang ↔ par/impar) es ~50/50** —
   infla la "resonancia" con una coincidencia que no lo es.
   *Archivo:* `lib/engines/convergentEngine.ts`.

6. **El número de expresión está muerto en el flujo principal** (no se pide
   nombre) pero el código, el prompt y `PersonalCode` lo siguen citando.
   *Archivos:* `profileBuilder.ts`, `synthesisEngine.ts` (`buildPersonalCode`),
   `promptBuilder.ts`, `app/onboarding/page.tsx`.

7. **La IA no tiene casa.** `/ai` → `/explore`; el chat anclado está
   enterrado dentro de la Lectura premium. El tercer nivel del modelo del
   producto no tiene superficie.
   *Archivos:* `app/ai/page.tsx`, `app/explore/page.tsx`.

8. **El borde gratis/pago se contamina en el copy.**
   `components/premium/FeatureComparison.tsx` usa **price-anchoring**
   ("Ancla de Valor"), precios de competidores tachados ($50–$120, $10–$15/mes)
   y un bloque "¿Por qué $8 USD?" — exactamente la manipulación que la
   directiva §09 prohíbe.
   *Archivo:* `components/premium/FeatureComparison.tsx`.

9. **Dos puntos de entrada a la Lectura.** `/profile` (`LecturaProfunda`
   `LecturaPremium`) y `/lectura` renderizan piezas deterministas
   solapadas; `/profile` además dispara **la misma llamada de IA premium en
   silencio** solo para alimentar un widget de "conexiones".
   *Archivos:* `components/profile/LecturaProfunda.tsx`,
   `app/lectura/LaLecturaExperience.tsx`.

10. **`whatToConsider` / `limitations` son strings fijos**, no derivados de
    lo que realmente es incierto para ese perfil (p. ej. "signo lunar
    aproximado — hora de nacimiento desconocida" nunca se dice).
    *Archivos:* `lib/engines/intelligence/fallbackInterpretation.ts`,
    `promptBuilder.ts`.

---

## 5. Mejoras de mayor impacto (para Fase 2+)

### P0 — síntesis genuina de tres sistemas

**5.1 Un motor de síntesis, tres consumidores.**
Promover `buildSynthesis(profile)` en `lib/engines/synthesisEngine.ts` que
devuelva, de forma determinista y trazable:
- coordenadas de los 3 sistemas,
- **convergencias entre todos los pares de sistemas** (no solo igualdad
  numérica numerología×chino): agregar numerología×astrología
  (p. ej. ritmo del Life Path ↔ modalidad solar; número ↔ elemento solar) y
  astrología×chino (elemento solar ↔ elemento chino),
- **tensiones** (ampliar más allá de ritmo LP vs elemento: al menos
  modalidad fija vs Life Path 5, elemento Agua vs Life Path 8, animal
  "enemigo" del año en curso vs animal natal),
- temas recurrentes,
- **lista de incertidumbre** ("signo lunar aproximado", "sin número de
  expresión", etc.).

Consumidores:
- **MAPA** (`/profile`): vista de estructura — coordenadas + convergencias
  como hecho verificable, sin prosa interpretada.
- **LECTURA gratis**: la síntesis determinista, tal cual (lo que hoy hace
  `PiezasLibres`, ampliado).
- **LECTURA paga**: IA, **recibiendo la síntesis determinista como
  grounding**. El trabajo del modelo pasa a ser "narrar y profundizar las
  convergencias/tensiones que Molino ya encontró, y sumar UNA que el motor no
  puede ver" — no "inventar la síntesis desde coordenadas".
- **IA** (chat): ya está cerca; mismo grounding.

**5.2 Pasar la síntesis determinista al prompt pago.**
`fetchLectura` (`LaLecturaExperience.tsx`) debe enviar el resultado de
`buildSynthesis` (o al menos `patterns` + `tensions` + `convergence` +
`dailyEnergy`), y `promptBuilder.ts` (caso `personal_profile`) debe incluir
un bloque "SÍNTESIS DETERMINISTA YA CALCULADA" como el que ya usa
`type=question`. Cambio quirúrgico, no destructivo.

**5.3 Que la astrología se gane el asiento.**
- Sumar los checks deterministas de 5.1.
- Recolectar **hora de nacimiento opcional** en el onboarding; cuando falte,
  **decirlo** en la lista de incertidumbre en vez de afirmar el signo lunar.

**5.4 Subir el modelo de la lectura.**
Rutear `personal_profile` (y quizá `question`) a un modelo de gama alta;
dejar los tipos gratuitos (daily/timing/compatibility) en el modelo barato.

### P1 — claridad Mapa / Lectura / IA

**5.5 Darle casa a la IA.** Una ruta `/ia` (o pestaña dentro de la lectura)
con el chat anclado. Permitir a usuarios no premium **una cantidad limitada**
de preguntas ancladas (§08: el conocimiento no es un paywall).

**5.6 Colapsar los dos puntos de entrada a la Lectura** en `/lectura`.
`/profile` linkea, no re-fetchea en silencio.

**5.7 Reescribir `FeatureComparison`** a una lista llana gratis/pago; borrar
el bloque "Ancla de Valor" y los precios de competidores tachados.

### P2 — limpieza

- Quitar `convergentEngine` regla #4 o reemplazarla por una convergencia real.
- Decidir el destino del número de expresión: o se pide el nombre, o se saca
  de `PersonalCode`/prompt.
- Unificar `ChatWithMolino` (borrar el wrapper, o dejarlo si aporta el
  nombre semántico).
- `whatToConsider`/`limitations` derivados de la lista de incertidumbre real.

---

## 6. Arquitectura objetivo (resumen)

```
                         buildSynthesis(profile)   ← único motor determinista
                         · coordenadas 3 sistemas
                         · convergencias (todos los pares)
                         · tensiones (varias reglas)
                         · temas
                         · incertidumbre
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
      MAPA                     LECTURA                      IA
   /profile                   /lectura                    /ia
   estructura            gratis: síntesis            chat anclado
   verificable           determinista               en buildSynthesis
                         paga: IA con la            + lectura
                         síntesis como grounding    (límite libre + premium)
```

Nada de esto exige base de datos ni backend nuevo. `buildSynthesis` es una
función pura más en `lib/engines/`.
