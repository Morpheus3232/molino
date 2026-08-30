# Benchmark del modelo del centro intelectual de la Lectura

Fecha: 2026-08-29.

## Limitación declarada

**No se pudo correr un A/B empírico.** El entorno local no tiene claves de
API (`OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `OPENROUTER_API_KEY` ausentes) y
gastar contra las de producción sin autorización explícita queda fuera de lo
que corresponde hacer de forma autónoma. Lo que sigue es una **evaluación de
diseño + recomendación de routing razonada**, no una comparación de salidas
reales. La verificación empírica (correr un set de perfiles anónimos por cada
modelo y puntuar profundidad/especificidad/coherencia/español/filler/
alucinación/contradicción con el canónico) queda **pendiente y depende de
claves**.

## Estado actual (medido en el código)

| Tipo de interpretación | Modelo | Fuente |
|---|---|---|
| `personal_profile` (la Lectura paga) | **`deepseek/deepseek-v4-flash`** por defecto | `AI_PRIMARY_PROVIDER` = `openrouter`, `OPENROUTER_MODEL` sin setear → `OPENROUTER_MODEL_DEFAULT` |
| `question` (chat anclado) | idem | idem |
| `daily_energy` / `timing` / `compatibility` / `pattern` | idem | idem |
| Fallbacks (si el primario falla) | `gpt-4o-mini`, luego `claude-3-5-sonnet-20241022` | `providerRouter` |

O sea: **hoy el mismo modelo barato (gama flash) genera tanto la síntesis de
8 dólares como la energía diaria gratuita.**

## Qué pide el centro intelectual de la Lectura

El prompt `personal_profile` (V2, `promptBuilder.ts`) exige, en simultáneo:
- síntesis conectiva entre 3–4 sistemas sin repetir el mapa,
- una inferencia nueva por insight (consecuencia que no está en los datos),
- registro diagnóstico sin hedging, en español **rioplatense** (vos),
- `blindSpot` que "incomode y sea reconocible", `lifeAreas` que sean el mismo
  patrón en 3 dominios,
- respetar el bloque INCERTIDUMBRE (no completar el signo lunar, etc.),
- ~13 campos con largos-objetivo, sin filler.

Esto es escritura de ensayo corta con razonamiento multi-eje y control de
tono fino en un dialecto específico. Un modelo de gama flash tiende a:
- aplanar el rioplatense a español neutro,
- producir convergencias nominales ("los tres apuntan a lo mismo") sin la
  inferencia,
- rellenar los campos largos con paráfrasis,
- ignorar restricciones negativas ("no menciones el signo lunar").

## Decisión

**Separar el routing por valor, con el modelo del tramo caro configurable por
env (sin default de gasto en el código).**

Implementado en Fase 2:
- `AI_HEAVY_MODEL` (env) fuerza un modelo para `personal_profile` y `question`
  únicamente. Cableado por `generateWithRouting` → `tryLegacyProvider` →
  `generateWithOpenAI/Claude/OpenRouter` (param `modelOverride`).
- Los tipos gratuitos siguen en `OPENROUTER_MODEL` (barato). Ahí el flash
  rinde: son respuestas cortas, estructuradas, de bajo valor unitario.
- **Sin default en código** para `AI_HEAVY_MODEL`: setearlo es una decisión
  con impacto de costo en un sistema externo; la toma quien opera el deploy.

### Recomendación concreta para producción

```
AI_HEAVY_MODEL=anthropic/claude-3.7-sonnet
```

(o el modelo frontera equivalente disponible en el OpenRouter de la cuenta).
Racional: la Lectura paga es un one-shot de alto valor y baja frecuencia —
el costo incremental por lectura es chico frente a los 8 USD, y el salto de
calidad en español rioplatense + razonamiento cross-sistema + adherencia a
restricciones es exactamente donde un modelo frontera se separa del flash.

Para `question` (chat, 50 por usuario, sensible a latencia) el mismo
`AI_HEAVY_MODEL` es aceptable; si el costo agregado molesta, un segundo env
`AI_CHAT_MODEL` de gama media (p. ej. `anthropic/claude-3.5-haiku` o
`openai/gpt-4o`) sería el próximo paso — **no se implementó** porque un solo
override cubre el caso y agregar un segundo canal sin datos de uso sería
especular.

### Salvaguardas que ya están (no tocar)
- Validación semántica del output (`aiResponseParser`) rechaza chain-of-thought
  filtrado y JSON estructuralmente válido pero vacío.
- Fallback determinista si el proveedor falla o devuelve basura.
- `AI_DAILY_BUDGET_USD` corta a fallback local si se supera el techo.
- Cache por `profileHash + type + promptHash` — un modelo más caro no
  multiplica el costo por revisita.

## Pendiente (requiere claves)

1. Set de 15–20 perfiles anónimos → correr por `deepseek-v4-flash`,
   `gpt-4o-mini`, `claude-3.7-sonnet`.
2. Puntuar ciego (1–5) en: profundidad, especificidad, coherencia, español
   rioplatense, calidad de síntesis, filler, alucinación, adherencia a
   INCERTIDUMBRE, contradicción con el `MODELO PERSONAL` entregado.
3. Confirmar (o ajustar) la recomendación con números.
