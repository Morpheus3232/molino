# Reading Quality Evaluation Protocol

Fecha: 2026-08-30.
Estado: protocolo listo, corpus generado, ejecución con IA pendiente (requiere claves).

## 1. Objetivo

Determinar si la Lectura Pro de Molino es **genuinamente excelente**, no merely técnicamente correcta. La pregunta no es "¿funciona?" sino "¿alguien que pagó $8 USD siente que esto fue escrito para él/ella?"

## 2. Metodología

### 2.1 Corpus de perfiles representativos

`scripts/evaluate-reading.ts` genera 15 perfiles que cubren:

| Dimensión | Cobertura |
|---|---|
| Life Paths | 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22 |
| Elementos solares | Fuego (4), Tierra (4), Agua (4), Aire (3) |
| Animales chinos | Caballo, Tigre, Rata, Perro, Búfalo, Dragón, Serpiente, Cabra, Cerdo, Mono, Gallo |
| Modalidades | Cardinal (5), Fixed (5), Mutable (5) |
| Números maestros | LP11 (Valentina), LP22 (Isabella) |
| Convergencia 3 sistemas | Lucía (3C), Roberto (1C con 3 sistemas), Isabella (2C) |
| Sin convergencia | Diego (0C), Valentina (0C) |
| Tensión térmica | Julia (Aries/Cerdo — fuego/agua) |
| Tensión estructural | Martín (LP4/Virgo vs Tigre), Ana (LP8/Capricornio vs Búfalo) |

### 2.2 Ejecución

**Dry run** (sin API): genera prompts + síntesis determinista para inspección manual.

```bash
npx tsx scripts/evaluate-reading.ts
```

**Con API**: genera las 15 Lecturas completas usando el modelo configurado.

```bash
# Requiere al menos una de:
export OPENROUTER_API_KEY=sk-or-...
# o
export OPENAI_API_KEY=sk-...
# o
export ANTHROPIC_API_KEY=sk-ant-...

# Opcional: forzar modelo específico
export AI_HEAVY_MODEL=anthropic/claude-3.7-sonnet

npx tsx scripts/evaluate-reading.ts --api
```

**Perfil individual** (para debug):

```bash
npx tsx scripts/evaluate-reading.ts --api --profile 0   # Lucía
npx tsx scripts/evaluate-reading.ts --api --profile 6   # Valentina (LP11)
```

### 2.3 Output

Cada ejecución crea `evaluation-results/reading-eval-<timestamp>/` con:

- `summary.json` — metadata + resultados de validación por perfil
- `synthesis-NN-<name>.json` — síntesis determinista completa
- `prompt-NN-<name>.txt` — prompt enviado al modelo
- `reading-NN-<name>.json` — respuesta cruda del modelo (solo con `--api`)

## 3. Rubrica de evaluacion (1-5)

Cada Lectura se evalua en 12 criterios. Escala:

| Score | Significado |
|---|---|
| 1 | No cumple. Ausente, incorrecto, o genérico sin valor. |
| 2 | Cumple parcialmente. Presente pero superficial, repetitivo, o con problemas. |
| 3 | Cumple. Correcto y funcional, pero no se destaca. "Está bien." |
| 4 | Excelente. Especifico, original, bien escrito. "Esto es bueno." |
| 5 | Excepcional. Genuinamente memorable. "Esto fue escrito para mí." |

### Criterios

#### 1. Personalizacion (1-5)

- **1**: El texto podría aplicarle a cualquier persona con el mismo Life Path.
- **3**: Menciona datos específicos del perfil (signo, animal, elemento) pero la prosa es intercambiable.
- **5**: Cada frase refleja la INTERSECCIÓN específica de ESTE perfil. Un LP5/Aries/Caballo suena distinto a un LP5/Libra/Perro.

#### 2. Sintesis genuina entre 3 sistemas (1-5)

- **1**: Tres párrafos separados (numerología, astrología, zodíaco) sin conexión.
- **3**: Menciona que los sistemas se cruzan pero no explica QUÉ ocurre cuando interactúan.
- **5**: Cada insight principal surge de la interacción de al menos 2 sistemas. El texto muestra la mecánica, no solo anuncia la convergencia.

#### 3. Profundidad (1-5)

- **1**: Superficial — repite significados de diccionario de cada signo/número.
- **3**: Profundiza un poco más allá de lo obvio pero no llega a insights no triviales.
- **5**: Produce inferencias que no están en los datos de entrada. El lector aprende algo que no sabía sobre sí mismo.

#### 4. Originalidad (1-5)

- **1**: Frases que podrían estar en cualquier horóscopo genérico.
- **3**: Algunas frases son específicas, pero hay relleno recognizable.
- **5**: Cada sección tiene al menos una frase que el lector no ha visto antes en ningún otro sitio de autoconocimiento.

#### 5. Coherencia (1-5)

- **1**: Contradicciones internas o secciones que no conectan entre sí.
- **3**: Sin contradicciones, pero las secciones se sienten como partes sueltas.
- **5**: La Lectura tiene un arco narrativo claro. El opening, summary, corePattern, alignment, tensions, blindSpot, lifeAreas y closingSynthesis forman un argumento coherente.

#### 6. Calidad del español rioplatense (1-5)

- **1**: Español neutro o tuteo inconsistente. Errores gramaticales.
- **3**: Vos correcto pero con muletillas ("esto te impulsa", "es una señal").
- **5**: Vos natural, registro diagnóstico (no sugerente), sin filler, sin hedging. Suena como una persona inteligente hablando con otra.

#### 7. Utilidad (1-5)

- **1**: Puro análisis abstracto sin implicación concreta.
- **3**: Algunas implicaciones pero vagas ("prestá atención a esto").
- **5**: Cada insight tiene una consecuencia observable y nombrable. El lector puede hacer algo con lo que leyó.

#### 8. Calidad de tensiones (1-5)

- **1**: Tensiones genéricas que aplicarían a cualquiera ("tu necesidad de control vs tu deseo de libertad").
- **3**: Tensiones específicas del perfil pero sin desarrollar el mecanismo.
- **5**: Cada tensión explica: Sistema A + Sistema B → fricción concreta → manifestación observable en la vida del usuario. El lector reconoce la fricción.

#### 9. Calidad de reglas (1-5)

- **1**: Reglas genéricas ("escuchá a tu intuición", "no tengas miedo al cambio").
- **3**: Reglas derivadas del perfil pero still suenan a consejo de autoayuda.
- **5**: Reglas accionables y específicas: "Ante una bifurcación, elegí la opción que más use tu X". El lector sabe QUÉ hacer y POR QUÉ.

#### 10. Honestidad epistemica (1-5)

- **1**: Presenta interpretaciones como hechos. No menciona limitaciones.
- **3**: Menciona que es interpretación simbólica pero en un disclaimer al final.
- **5**: La incertidumbre está integrada naturalmente en el texto (ej. "la Luna es aproximada porque no tenés la hora"). No fabrica precisión que el sistema no tiene.

#### 11. Redundancia/filler (1-5)

- **1**: Mucho relleno — paráfrasis de lo mismo en diferentes secciones.
- **3**: Alguna repetición pero cada sección aporta algo nuevo.
- **5**: Cero filler. Cada oración aporta información que no estaba en la anterior. El lector no siente que está perdiendo el tiempo.

#### 12. "Esto se siente escrito para mí" (1-5)

- **1**: El lector siente que podría ser para cualquiera.
- **3**: El lector reconoce algunos datos suyos pero no siente conexión emocional.
- **5**: El lector tiene la experiencia de "esta persona me conoce". La Lectura naming something que el lector sabe de sí mismo pero nunca había articulado.

## 4. Benchmark esperado (pre-ejecucion)

Basado en la arquitectura del prompt y la calidad del modelo:

| Criterio | Flash (deepseek-v4) | Frontier (claude-3.7-sonnet) |
|---|---|---|
| Personalizacion | 3 | 4-5 |
| Sintesis 3 sistemas | 2-3 | 4 |
| Profundidad | 2-3 | 4 |
| Originalidad | 2 | 3-4 |
| Coherencia | 3 | 4 |
| Español rioplatense | 2-3 | 4-5 |
| Utilidad | 3 | 4 |
| Tensiones | 2-3 | 4 |
| Reglas | 3 | 4 |
| Honestidad epistemica | 3 | 4 |
| Redundancia | 3 | 4 |
| "Escrito para mí" | 2-3 | 4 |

**Nota**: Estos son estimados de diseño, NO resultados medidos. Se documentan como hipótesis a verificar.

## 5. Criterios de decision

| Promedio | Veredicto | Accion |
|---|---|---|
| >= 4.0 | Excelente | Producto listo para production sin cambios mayores |
| 3.5-3.9 | Bueno | Identificar los 2-3 criterios mas bajos y mejorar el prompt |
| 3.0-3.4 | Aceptable | Requiere iteracion significativa en prompt o modelo |
| < 3.0 | Insuficiente | Cambio de modelo o rediseno del prompt |

## 6. Validacion determinista (ya ejecutada)

`scripts/evaluate-reading.ts` valida automaticamente la capa determinista:

- [x] 15/15 perfiles pasan validacion de sintesis
- [x] 0 fuentes circulares detectadas
- [x] 0 patterns incompletos
- [x] Todas las tensiones tienen implicacion
- [x] 3+ incertidumbres por perfil
- [x] 1-3 systemsEngaged por perfil (honesto — no inflado)

## 7. Que queda pendiente

1. **Ejecucion con API** — requiere claves en el entorno. El harness esta listo: `npx tsx scripts/evaluate-reading.ts --api`
2. **Evaluacion humana** — un humano puntua las 15 Lecturas en los 12 criterios. El harness genera los archivos para facilitar esto.
3. **Comparacion A/B** — correr el mismo corpus con 2 modelos y comparar scores. Util para validar la recomendacion de `MODEL_QUALITY_BENCHMARK.md`.
4. **Degradacion por fallback** — verificar que con el fix de fallback (no pasar modelOverride al fallback provider), la Lectura de fallback sigue siendo util.
