# MOLINO — PRODUCT BREAKTHROUGH ANALYSIS

> Fecha: 2026-07-30
> Insumo: `PRODUCT-AUDIT.md` + código del repo (`lib/engines/`, `app/`)
> Alcance: pensamiento estratégico de segundo nivel. No se modificó código.

---

## Tesis de producto (léase primero)

**Molino debería dejar de ser una enciclopedia simbólica de 18 motores y convertirse en una sola cosa: una herramienta que ayuda a pensar mejor una decisión real, usando 3 sistemas simbólicos como lente de análisis transparente.**

No "menos features porque sí" — menos *superficie de producto* para que una capacidad (decisión) sea diez veces más profunda, en vez de 18 capacidades siendo todas superficiales.

La auditoría anterior concluyó "informa pero no ayuda a actuar" y propuso agregar un asesor de decisiones *como una pieza más*. Ese diagnóstico es correcto pero la solución que sugiere es tibia: agregar el decision engine como una sección nueva entre otras 20. Este documento llega a una conclusión más incómoda: **si el decision engine no es el centro absoluto del producto, no va a cambiar nada** — se va a convertir en la sección #23 de una enciclopedia que ya tiene 22, y el usuario nunca la va a encontrar ni a priorizar.

La arquitectura actual (`Identidad / Mundo / Círculo / Profundidad`, propuesta en `STRATEGIC_DIAGNOSTIC.md`) organiza el producto alrededor de **quién sos**. La arquitectura que este documento propone organiza el producto alrededor de **qué estás por decidir**. Es un cambio de eje, no una reorganización de menú.

---

## 1. Deconstruí Molino

Inventario real de capacidades (no de módulos de UI):

| Capacidad | Qué produce hoy | Es un fin en sí mismo o un ingrediente |
|---|---|---|
| Numerología | Números derivados de nombre/fecha | Ingrediente |
| Astrología | Signo, elemento, modalidad | Ingrediente |
| Zodíaco chino | Animal, con CNY real | Ingrediente |
| Afinidad | Score usuario↔entidad | Ingrediente (hoy tratado como fin) |
| Entidades | Base verificada marcas/países | Ingrediente (dato, no experiencia) |
| Timing | Ventanas favorables/desfavorables | **Debería ser un fin** |
| Decisiones | Análisis de una decisión | **Debería ser EL fin** |
| Energía diaria | Score del día | Ingrediente de bajo valor aislado |
| Timeline | Proyección ±5 años | Ingrediente de contexto |
| Convergencia | Detecta cuando los 3 sistemas apuntan igual | **El mecanismo más valioso y menos usado** |
| Síntesis | Combina sistemas en una lectura | Ingrediente (debería ser la salida, no una sección más) |
| Recomendaciones | Ranking de entidades | Ingrediente (hoy tratado como fin) |
| Academy | Contenido educativo | Soporte, no núcleo |
| Biblioteca | Glosario/fuentes | Soporte, no núcleo |
| Perfil | Contenedor de todo lo anterior | Debería ser un *insumo silencioso*, no un destino |
| Compatibilidad | Score entre 2 perfiles | Ingrediente + mecanismo de crecimiento |

**El hallazgo central de esta deconstrucción:** de 17 capacidades, solo 2-3 son realmente *fines* (cosas que un usuario quiere lograr) — todo lo demás es *ingrediente* para producir esos fines. Molino hoy presenta cada ingrediente como si fuera un fin (una sección con su propio menú, su propia página, su propio CTA). Eso es lo que genera la sensación de enciclopedia.

**¿Qué producto aparece si conectamos todas las capacidades?** Uno donde el usuario nunca elige "quiero ver mi numerología" — elige "tengo que decidir X", y todo lo demás (numerología, astrología, zodíaco, timing, convergencia, entidades) actúa como motor interno invisible que alimenta esa respuesta. El perfil (`/profile`) deja de ser un destino y pasa a ser la memoria de contexto que el sistema usa cada vez que el usuario trae una pregunta nueva.

---

## 2. El "core loop"

**Loop actual (roto):** Usuario entra → da su fecha → ve su mapa → scrollea → se va. No hay ciclo, hay un evento único.

**Loop propuesto:**

```
TRIGGER
  El usuario tiene algo real que decidir, comparar o entender
  (mudarse, elegir un nombre, timing de un lanzamiento, entender una relación)
        ↓
ACCIÓN
  Lo escribe o lo selecciona de un set de plantillas de decisión
  (Molino ya tiene su perfil guardado — no vuelve a pedir la fecha)
        ↓
ANÁLISIS
  Molino cruza los engines relevantes para ESA pregunta específica
  (no todos los engines siempre — solo los que aportan a esa decisión)
        ↓
SÍNTESIS + EXPLICACIÓN
  Una conclusión legible, con nivel de certeza explícito,
  y un "¿por qué?" expandible con la data cruda
        ↓
RECOMENDACIÓN + ACCIÓN CONCRETA
  No "pensalo" — un paso siguiente tangible
  (una fecha, una comparación, un checklist, una alternativa)
        ↓
REGISTRO
  El usuario marca qué decidió (opcional) y Molino lo guarda como
  contexto — sin necesidad de cuenta obligatoria, puede ser local
        ↓
RECOMPENSA
  La próxima vez que vuelve, Molino ya sabe qué decisiones trae encima,
  puede preguntar "¿qué pasó con lo de España?" y usar ese historial
  para calibrar futuras respuestas
        ↓
RETORNO
  Vuelve porque tiene una decisión nueva, no porque "toca mirar el horóscopo"
```

- **Trigger:** un momento de vida real, no un hábito de calendario.
- **Acción:** formular la decisión en lenguaje natural o elegir plantilla.
- **Resultado:** síntesis explicada + recomendación accionable.
- **Recompensa:** sensación de haber pensado mejor algo que ya le importaba, no un dato curioso más.
- **Motivo de retorno:** decisiones son recurrentes por naturaleza — cualquier persona activa toma decisiones de este tipo varias veces al año, no una vez.
- **Monetización:** el historial de decisiones, la comparación multi-opción y la profundidad del análisis son exactamente lo premium (ver sección 13).

Esto reemplaza el loop de "horóscopo diario" (que Molino nunca va a ganar contra Co-Star) por un loop de "copiloto de decisiones" (categoría que hoy no tiene un jugador dominante).

---

## 3. El problema real que Molino podría resolver

### TOP 10 problemas concretos

1. **Elegir entre opciones similares sin un criterio objetivo claro** (dos ciudades, dos nombres, dos ofertas) — cuando los datos "duros" no alcanzan para decidir y la persona busca un criterio adicional, no reemplazante.
2. **Encontrar el momento adecuado para actuar** (lanzar, pedir, renunciar, empezar) cuando la urgencia emocional nubla el juicio.
3. **Entender una relación nueva o compleja** sin caer en el horóscopo genérico de compatibilidad de pareja.
4. **Prepararse para una conversación difícil** con más claridad sobre el propio patrón de comportamiento en momentos así.
5. **Decidir si mudarse/viajar/emigrar a un lugar**, cruzando afinidad simbólica con contexto real.
6. **Elegir un nombre** (para un hijo, una marca, un proyecto) con un criterio adicional al gusto estético.
7. **Revisar decisiones pasadas** para identificar patrones propios ("¿siempre dudo antes de actuar? ¿siempre acierto cuando actúo rápido?").
8. **Anticipar un ciclo personal** (año, proyecto, relación) para planificar con margen, no reaccionar tarde.
9. **Comparar compatibilidad** con una persona, socio o equipo antes de comprometerse.
10. **Reflexionar de forma estructurada** cuando algo no sale como se esperaba, sin terapia ni journaling genérico.

### EL PROBLEMA #1: elegir entre opciones cuando los datos objetivos no alcanzan

Por qué este y no otro:

- Es el más **frecuente** (todos los demás son casos particulares de "comparar opciones": mudarse es comparar lugares, elegir nombre es comparar nombres, timing es comparar "ahora" vs "después").
- Es el más **generalizable** técnicamente: un solo motor de comparación multi-opción (entidad A vs B vs C, usando los mismos engines) resuelve mudanza, nombres, marcas, timing binario y hasta relaciones ("¿avanzo con esta persona o no?").
- Es el que mejor **demuestra el diferencial de Molino** frente a la competencia: nadie en la categoría ofrece comparación estructurada, transparente y explicada — todos ofrecen lectura de un único perfil a la vez.
- Es el que tiene **mayor disposición a pagar**: las decisiones de comparación real (mudanza, nombre, timing de negocio) tienen peso emocional/económico suficiente como para justificar una suscripción, a diferencia de "ver mi horóscopo".
- **Ya existe la infraestructura**: `decisionsEngine`, `timingEngine`, `affinityEngine`, `compatibilityEngine` cubren, entre todos, el 90% de lo necesario para esto. No hay que construir motores nuevos, hay que construir la capa de orquestación y la experiencia de comparación.

---

## 4. ¿Y si Molino no fuera una app de astrología?

Mirando solo lo que el sistema puede hacer (input estructurado + reglas + explicación + recomendación), 10 categorías posibles:

1. Decision engine (motor de decisiones)
2. Personal intelligence tool (inteligencia personal)
3. Reflection tool (herramienta de reflexión)
4. Personal planning system (sistema de planificación personal)
5. Symbolic advisor (asesor simbólico)
6. Personal operating system (sistema operativo personal)
7. Recommendation engine (motor de recomendación)
8. Relationship intelligence (inteligencia de relaciones)
9. Timing assistant (asistente de timing)
10. **Personal decision-clarity copilot** (copiloto de claridad para decisiones, con memoria de historial de decisiones propias)

**Elegida: #10 — Personal decision-clarity copilot**, no #1 puro ni #6.

Por qué no las otras:
- "Decision engine" (#1) suena a herramienta fría, técnica, de una sola interacción — pierde el componente de acompañamiento y memoria.
- "Personal operating system" (#6) es demasiado ambicioso/vago — categoría que solo empresas con recursos masivos (Apple, Google) pueden reclamar de verdad.
- "Recommendation engine" (#7) suena a e-commerce, no a algo con peso emocional.

**Por qué #10 gana en los 5 criterios:**
- **Diferenciación:** nadie en la categoría simbólica se posiciona como "copiloto de decisiones con memoria" — todos se posicionan como lectura de personalidad o predicción.
- **Utilidad:** ataca el problema #1 directamente (elegir con más claridad), no la curiosidad pasajera.
- **Recurrencia:** las decisiones importantes son recurrentes por naturaleza de la vida adulta — no hace falta inventar un hábito artificial (como "mirá tu horóscopo todos los días").
- **Monetización:** "copiloto con memoria" justifica naturalmente un modelo de suscripción (memoria + profundidad + historial), no solo compras puntuales.
- **Dificultad de copiar:** requiere (a) rigor metodológico real, (b) motor combinatorio serio, y (c) acumulación de historial de decisiones del propio usuario — ninguna de las tres es trivial de clonar, y la tercera compone con el tiempo (moat).

---

## 5. El momento wow

Escenario: usuario nuevo, solo nombre + fecha de nacimiento, eventualmente una pregunta.

**Diseño exacto, 30-60 segundos:**

1. **Segundo 0-5:** en vez de pedir solo la fecha, Molino pregunta primero: *"¿Hay algo que estés por decidir?"* — con opción de responder en texto libre o saltear ("Todavía no, solo quiero conocer mi mapa"). Esto cambia el marco desde el primer segundo: no es "dame tu fecha para leer tu horóscopo", es "contame qué te trae acá".
2. **Segundo 5-15:** pide fecha de nacimiento (y nombre, opcional). Mientras el usuario escribe, Molino ya está calculando en el cliente (no hay espera después).
3. **Segundo 15-30:** en vez de mostrar tres lecturas separadas (numerología, astrología, zodíaco), Molino muestra **un solo hallazgo de convergencia**: el punto exacto donde los 3 sistemas, calculados independientemente, apuntan al mismo tema. Ejemplo: *"Tu Camino de Vida 5, tu Sol en Géminis y tu año Caballo coinciden en un mismo eje: movimiento y cambio. Es raro que los 3 sistemas converjan tan claramente — pasa en menos del 20% de las combinaciones posibles."* Esto es el corazón del wow: no es "sos Caballo, tenés estas características" (genérico), es "encontramos algo específico de TU combinación, y te decimos cuán infrecuente es" (prueba de personalización real, con un número que respalda que no es genérico).
4. **Segundo 30-45:** si el usuario dejó una pregunta al principio, Molino la retoma explícitamente: *"Dijiste que estás pensando en [mudarte / lanzar tu proyecto / etc.]. Con esta convergencia de movimiento y cambio, este es un momento que tiende a favorecer decisiones activas antes que esperar. ¿Querés que lo analicemos en detalle?"* — conecta el hallazgo simbólico con la pregunta real del usuario en la misma pantalla, sin que tenga que ir a buscarlo en otra sección.
5. **Segundo 45-60:** CTA único: *"Analizar mi decisión"* (lleva al decision engine con contexto precargado) o *"Ver mi mapa completo"* (para quien vino solo por curiosidad). Ambos caminos quedan abiertos, pero el primero es el que el diseño empuja.

Lo que hace esto distinto de un horóscopo: (a) el hallazgo es específico de la combinación exacta del usuario, no de un signo aislado; (b) viene acompañado de una medida de infrecuencia/certeza, algo que ningún competidor muestra; (c) se conecta inmediatamente con una necesidad real que el usuario mismo declaró, no con contenido genérico del día.

---

## 6. Los engines como sistema (capa que ve el usuario)

El usuario no debería ver nunca una lista de "Numerología / Astrología / Zodíaco chino / Timing / Decisiones" como menú principal. Esa es arquitectura interna, no producto.

**Arquitectura de experiencia propuesta:**

```
CONTEXTO (silencioso)
  Tu perfil ya calculado (fecha, nombre) vive en background,
  no es una sección que hay que "visitar"
        ↓
PREGUNTA
  "¿Qué estás pensando/decidiendo/queriendo entender?"
  (texto libre + plantillas: Decidir, Comparar, Timing, Relación, Explorar sin pregunta)
        ↓
ANÁLISIS MULTICAPA (invisible)
  El sistema elige qué engines son relevantes para ESA pregunta
  específica (no corre los 18 siempre)
        ↓
CONVERGENCIA / CONTRADICCIÓN
  Antes de dar una respuesta, el sistema señala si los sistemas
  coinciden (alta confianza) o difieren (confianza más baja,
  se explicita)
        ↓
SÍNTESIS
  Una conclusión en lenguaje humano, no una lista de datos
        ↓
"¿POR QUÉ?" (expandible, opcional)
  Acá SÍ aparecen los nombres técnicos: qué engine, qué fórmula,
  qué fuente — para quien lo quiere auditar
        ↓
RECOMENDACIÓN + ACCIÓN
  Paso siguiente concreto
        ↓
GUARDAR / COMPARAR / VOLVER
  Contexto para la próxima interacción
```

Diferencia clave con la propuesta de la auditoría anterior ("Input → Perfil → Pregunta → Análisis → Síntesis → Recomendación → Acción"): acá **la pregunta va antes que el perfil como punto de entrada recurrente** — el perfil se calcula una sola vez y después vive en segundo plano; lo que el usuario repite cada vez que vuelve es la pregunta, no el perfil.

---

## 7. El decision engine como producto

Estructura común para cualquier decisión, aplicada a 6 casos:

### Caso A — "¿Me conviene mudarme a España?"
1. **Input:** ciudad/país destino, fecha aproximada de mudanza (si la tiene), motivo breve (opcional).
2. **Datos:** perfil del usuario (numerología + astrología + zodíaco), entidad "España" (fecha histórica verificada), ciclo personal actual.
3. **Engines:** `affinityEngine`, `yearCycleEngine`, `timingEngine`.
4. **Combinación:** afinidad natal usuario↔entidad + resonancia del ciclo personal actual con el momento de la mudanza + comparación opcional con otro destino si lo da.
5. **Explicación del razonamiento:** "España tiene animal Tigre por su fecha fundacional; tu perfil tiene relación de [armonía/neutralidad/tensión] con Tigre; tu año personal actual favorece/no favorece cambios de lugar."
6. **Nivel de certeza:** explícito y bajo/medio por diseño — "esto es una lente simbólica adicional, no un pronóstico de si te va a ir bien".
7. **Recomendación:** score + lectura + sugerencia de timing si aplica ("si decidís avanzar, tu ventana más favorable este año es...").
8. **Qué NO debe afirmar:** que le va a ir bien o mal económica/laboralmente, que es "la decisión correcta objetivamente, resultado garantizado.
9. **Qué puede hacer después:** comparar con otro destino, guardar la decisión, volver más adelante y marcar qué pasó.

### Caso B — "¿Es buen momento para lanzar mi proyecto?"
1. **Input:** fecha tentativa de lanzamiento, tipo de proyecto (opcional, para tono del copy).
2. **Datos:** ciclo personal, elemento del año actual, fecha propuesta.
3. **Engines:** `timingEngine`, `yearCycleEngine`, `dailyEnergyEngine` (si la fecha es cercana).
4. **Combinación:** cruza ciclo anual personal + calidad simbólica de la fecha específica.
5. **Explicación:** ventanas favorables/neutras/desfavorables en el horizonte de tiempo relevante, con motivo.
6. **Certeza:** media — el timing simbólico es el terreno donde Molino tiene más data (`timingEngine` ya calcula esto), pero se comunica como "tendencia", nunca como garantía de éxito del proyecto.
7. **Recomendación:** fecha o rango de fechas sugerido, con alternativas si la fecha propuesta es desfavorable.
8. **Qué NO debe afirmar:** que el proyecto va a tener éxito comercial.
9. **Qué puede hacer después:** guardar la fecha elegida, pedir un recordatorio, comparar con otra fecha candidata.

### Caso C — "¿Cuál de estos tres nombres debería elegir?"
1. **Input:** lista de 2-4 nombres candidatos, contexto (bebé, marca, proyecto).
2. **Datos:** numerología de cada nombre, perfil del usuario/familia si aplica.
3. **Engines:** `numerologyEngine` aplicado a cada candidato.
4. **Combinación:** compara vibración numerológica de cada nombre entre sí y, si aplica, contra el perfil de quien lo va a llevar/usar.
5. **Explicación:** qué número resulta cada nombre y qué representa, en paralelo, lado a lado.
6. **Certeza:** explícitamente baja como criterio único — se presenta como "un criterio más a considerar", nunca como el criterio decisivo.
7. **Recomendación:** no elegir por el usuario — mostrar el contraste y dejar la decisión en sus manos con más información.
8. **Qué NO debe afirmar:** que un nombre "traerá" cierto destino a la persona.
9. **Qué puede hacer después:** compartir la comparación (alto potencial viral con otros padres/socios), guardar el resultado.

### Caso D — "¿Qué país tiene mayor afinidad conmigo?"
1. **Input:** ninguno adicional — usa el perfil ya calculado.
2. **Datos:** catálogo completo de países verificados.
3. **Engines:** `affinityEngine` + `personalRecommendationEngine`.
4. **Combinación:** ranking explicado, no solo una lista de scores.
5. **Explicación:** por qué el top 3 resuena, con la fecha/evento histórico de cada país.
6. **Certeza:** se comunica como afinidad simbólica, no como recomendación de vida real (evitar sonar a consejo migratorio).
7. **Recomendación:** top 3 con invitación a "comparar en detalle" (deriva al Caso A si el usuario quiere profundizar en uno).
8. **Qué NO debe afirmar:** proyecciones económicas, legales o de calidad de vida.
9. **Qué puede hacer después:** elegir uno y pasar al análisis de mudanza completo (Caso A) — este caso es la puerta de entrada al A, no un fin en sí mismo.

### Caso E — "¿Cómo debería abordar esta relación?"
1. **Input:** fecha de nacimiento de la otra persona (si la tiene) o solo signo/animal si no.
2. **Datos:** ambos perfiles (o perfil + dato parcial).
3. **Engines:** `compatibilityEngine`, `compatibilityScoreEngine`.
4. **Combinación:** puntos de armonía y de fricción entre ambos perfiles, no un score único simplificado.
5. **Explicación:** "en estos aspectos tienden a complementarse, en estos otros a chocar" — con matiz, no un veredicto binario.
6. **Certeza:** explícitamente la más baja de todos los casos — relación humana real depende de comunicación, contexto, historia, no de un cálculo.
7. **Recomendación:** sugerencias de qué observar o conversar, no un pronóstico de la relación.
8. **Qué NO debe afirmar:** que la relación va a funcionar o fracasar, compatibilidad como destino.
9. **Qué puede hacer después:** compartir el resultado con la otra persona (mecanismo viral), guardar para revisar más adelante.

### Caso F — "¿Conviene esperar o actuar?"
1. **Input:** la decisión binaria en sus propias palabras (opcional detalle).
2. **Datos:** ciclo personal actual, convergencia entre sistemas en el momento presente.
3. **Engines:** `convergentEngine`, `timingEngine`, `dailyEnergyEngine`.
4. **Combinación:** si los 3 sistemas convergen hacia "movimiento" o hacia "consolidación" en este momento del ciclo del usuario.
5. **Explicación:** el mecanismo de convergencia (igual que el momento wow de la sección 5), aplicado a esta pregunta puntual.
6. **Certeza:** media cuando hay convergencia clara, explícitamente baja cuando los sistemas no coinciden (esto en sí es información valiosa: "no hay una señal clara, es tu criterio el que debería pesar más acá").
7. **Recomendación:** una inclinación clara (esperar/actuar) solo cuando hay convergencia real; si no la hay, decirlo honestamente en vez de forzar una respuesta.
8. **Qué NO debe afirmar:** certeza donde no la hay — este es el caso más importante para proteger la credibilidad del producto.
9. **Qué puede hacer después:** guardar la decisión, volver después a marcar qué pasó (alimenta el historial personal).

---

## 8. Transparencia como feature (no como página)

Cada recomendación del decision engine debería tener un **"¿Por qué?"** expandible, siempre en el mismo lugar, con la misma estructura:

1. **Datos utilizados** — qué inputs concretos entraron (fecha, nombre, entidad, fecha propuesta).
2. **Sistema(s) utilizados** — qué engines corrieron para esta respuesta puntual (no todos los engines existen siempre, solo los relevantes a esta pregunta — esto en sí comunica precisión, no reciclaje de un template).
3. **Fórmula/mecanismo** — en lenguaje simple, cómo se llegó del dato al resultado (ej. "Camino de Vida se calcula sumando los dígitos de tu fecha de nacimiento hasta reducir a un solo número, salvo números maestros").
4. **Fuente** — de dónde sale el dato factual (fecha de fundación de un país, metodología numerológica, tabla de Año Nuevo Chino).
5. **Interpretación vs. dato** — separación explícita, igual que ya hace `MOLINO_CONTEXT.md` internamente: "esto es lo que dice el cálculo" vs. "esto es lo que dice la tradición simbólica sobre ese cálculo".
6. **Limitaciones** — qué no cubre este análisis, qué no debería hacer con este resultado.

**Por qué esto hace que Molino se sienta más inteligente y no más técnico:** la mayoría de productos "inteligentes" (con o sin IA) generan confianza ocultando el mecanismo ("el algoritmo lo sabe"). Molino puede invertir esa lógica: mostrar el mecanismo *aumenta* la confianza porque demuestra que no hay nada escondido — el usuario puede verificar cada paso. Esto solo funciona si el "¿Por qué?" está siempre disponible con un clic, nunca enterrado en una página aparte (`/filosofia` hoy), y si el lenguaje de la explicación es tan cuidado como el de la recomendación misma (no un volcado técnico de JSON).

---

## 9. Personalización real (no "IA genera un texto")

Sistema propuesto, en capas, sin depender de un LLM caro por default:

**Capa 1 — Combinatoria de reglas ponderadas.** En vez de un string fijo por animal/signo, cada rasgo se compone de la intersección de: animal chino + elemento + signo solar + modalidad + Camino de Vida + número de Expresión. Con solo 5-6 variables discretas, el número de combinaciones posibles ya supera varios miles — suficiente para que "genérico" deje de ser cierto, sin necesidad de generación de texto libre.

**Capa 2 — Detección de convergencia y contradicción.** El sistema no solo suma datos, los compara entre sí: cuando 2+ sistemas apuntan al mismo tema (ej. "movimiento" en zodíaco chino y en numerología), eso se resalta como señal fuerte; cuando se contradicen (ej. un sistema sugiere estabilidad y otro cambio), eso también se comunica explícitamente, en vez de promediarlo silenciosamente. Esta tensión/convergencia *es* la personalización — es matemáticamente distinta para cada combinación de perfil.

**Capa 3 — Pesos contextuales según la pregunta.** La misma combinación de perfil produce salidas distintas según qué se pregunta: para una decisión de timing, `timingEngine` pesa más; para una decisión de compatibilidad, `compatibilityEngine` pesa más. La personalización no es solo "quién sos" sino "qué me preguntaste, dado quién sos".

**Capa 4 — Historial propio como contexto.** Con el tiempo, las decisiones que el usuario fue tomando (y opcionalmente marcando como "acertadas" o no) se vuelven una capa adicional de peso: "las últimas veces que hubo convergencia hacia 'actuar', marcaste que te fue bien" — esto es personalización que ningún competidor puede tener porque depende del historial único de cada usuario, no de un modelo entrenado en datos ajenos.

**Capa 5 (opcional, más cara) — Texto generado, pero como última milla, no como motor.** Recién acá, si se quiere, un modelo de lenguaance puede convertir la salida estructurada (que ya es única por combinatoria) en prosa más fluida — pero la personalización *sustantiva* ya existe antes de que un LLM toque el resultado. Esto evita el riesgo de "personalización de fachada" (texto distinto, contenido igual de genérico).

**Respuesta a la pregunta central de esta sección:** dos personas "Caballo" reciben conclusiones distintas porque (a) casi nunca comparten el resto de su combinación completa, (b) su convergencia/contradicción entre sistemas es distinta, y (c) su historial de decisiones propio es, por definición, único. La personalización se vuelve real sin depender de generación de texto costosa ni de una promesa vacía.

---

## 10. Retención diseñada por momento de vida, no por calendario

| Cadencia | Qué cambia / qué descubre | Mecanismo |
|---|---|---|
| **Diario** | No "tu energía de hoy" genérica — sino: si el usuario tiene una decisión activa guardada, hoy le dice si hoy es un día relevante para ella específicamente ("hoy es una de tus fechas favorables para lo de España"). Si no tiene decisiones activas, no hay notificación — mejor ausencia que ruido genérico. | `dailyEnergyEngine` + decisiones guardadas del usuario |
| **Semanal** | Un resumen de convergencias/contradicciones de la semana relevantes a su perfil — no un horóscopo, un patrón. | `convergentEngine` aplicado a la ventana semanal |
| **Mensual** | Evolución de su ciclo personal + comparación con el mes anterior ("el mes pasado tu perfil favorecía consolidación; este mes favorece movimiento — esto es lo que cambió y por qué"). | `yearCycleEngine` + diffing simple |
| **Anual** | Experiencia tipo "Wrapped": resumen del año personal, decisiones que tomó (si las guardó), patrones detectados, proyección del año que viene. | `yearCycleEngine` + `personalTimelineEngine` + historial de decisiones |
| **Cuando tiene una decisión** | Entra directo al decision engine con su perfil precargado — cero fricción, sin tener que "encontrar" la sección entre 20 más. | Decision engine como entrada principal, no como sección escondida |
| **Cuando conoce a alguien** | Flujo de compatibilidad rápida, compartible con esa persona sin que ambos necesiten cuenta. | `compatibilityEngine` + link efímero |
| **Cuando está por viajar/mudarse/comprar/elegir** | El Caso A/D del decision engine (comparación de opciones) — el momento de mayor disposición a pagar por profundidad. | `affinityEngine` + `timingEngine` combinados en modo comparación |

El eje común: Molino no le pide al usuario que arme un hábito artificial (mirar la app todos los días); Molino se presenta cuando la vida real del usuario genera la necesidad. Eso es más difícil de diseñar que una notificación diaria, pero es lo único que genera retención genuina en esta categoría sin caer en el patrón resentido del horóscopo push.

---

## 11. El grafo de Molino

```
                         PERSONA (usuario)
                              │
        ┌──────────┬──────────┼──────────┬───────────┐
        │          │          │          │           │
     PERSONAS   LUGARES    ENTIDADES  DECISIONES    CICLOS
   (relaciones)  (países/  (marcas)   (guardadas)  (personal/
                  ciudades)                          anual)
        │          │          │          │           │
        └────┬─────┴────┬─────┴────┬─────┴─────┬─────┘
             │           │          │           │
        COMPATIBILIDAD  TIMING   COMPARACIÓN  PATRÓN
        (con otro nodo  (fecha   (entre 2+    (repetido en
         persona)       propuesta) nodos)      el tiempo)
```

**Ejemplo aplicado (el del prompt, extendido):**

```
PERSONA
  ↓ (afinidad)
España (país, animal Tigre por fecha fundacional)
  ↓ (afinidad de segundo nivel, si existe la entidad)
Barcelona (ciudad)
  ↓ (input del usuario)
Fecha de mudanza propuesta: marzo 2027
  ↓ (timingEngine + yearCycleEngine)
Análisis de timing: ventana favorable/neutra/desfavorable
  ↓ (usuario marca qué decidió y, más adelante, qué pasó)
Resultado guardado → alimenta el perfil histórico del usuario
  ↓
La próxima decisión de mudanza/cambio que traiga usa este
resultado como contexto adicional ("la última vez que te
moviste en una ventana similar, marcaste que salió bien")
```

**Qué habilita este grafo que un perfil plano no habilita:**
- Recomendaciones que combinan más de un nodo (no solo "afinidad con España" sino "afinidad con España + tu timing personal + tu historial de decisiones de cambio").
- Comparaciones cruzadas naturales (país vs país, nombre vs nombre) porque todos los nodos del mismo tipo comparten estructura.
- Un histórico propio que compone con el tiempo — la pieza de moat más fuerte de todo este documento (sección 14 la desarrolla).
- Sin necesitar exponer el grafo como feature visual complejo — puede vivir completamente debajo de la superficie, alimentando mejores respuestas del decision engine.

---

## 12. El feature viral

**No es "compartí tu perfil".** Es: **"decisión resuelta, compartible con quien esté en la misma decisión."**

Mecanismo completo:

1. Usuario A usa el decision engine para un caso de dos partes (compatibilidad, elegir nombre en pareja, decidir mudanza en pareja/familia, comparar afinidad de founders).
2. Al llegar al resultado, Molino ofrece: *"Compartí esto con [la otra persona] para que sume su parte."*
3. Se genera un link efímero (sin necesidad de cuenta de ninguno de los dos, coherente con la privacidad radical) que lleva a la Persona B a completar solo su fecha.
4. El resultado combinado se muestra a ambos, con un diseño pensado explícitamente para captura de pantalla/reenvío (igual lógica que Spotify Wrapped o los resultados de The Pattern) — visual, con un dato sorprendente arriba, sin necesidad de contexto previo para quien lo recibe por fuera del link.
5. Cierre con CTA suave para quien llega desde el link: *"¿Querés tu propio mapa?"* — adquisición sin fricción, quien llega ya vio valor concreto (el resultado combinado) antes de que se le pida nada.

**Por qué esto es distinto de "compartí tu perfil":** el perfil individual es interesante solo para quien lo generó; un resultado que involucra a una segunda persona real es intrínsecamente el tipo de contenido que la gente reenvía ("mirá esto que salió de nosotros dos"), y genera adquisición de dos usuarios por cada compartido, no uno.

---

## 13. El producto premium

**Pregunta primero, no "qué cobrar" sino qué problema sería lo suficientemente importante:** la comparación multi-opción con memoria persistente para una decisión real (mudanza, nombre, negocio) — porque ahí hay dinero, tiempo o peso emocional real en juego, y "un criterio más, bien explicado" vale pagar cuando la decisión misma vale mucho.

### FREE (siempre)
- Perfil completo (los 3 sistemas cruzados) y su explicación.
- Una pregunta/decisión analizada por sesión, con recomendación completa y "¿por qué?" completo (nunca ocultar el razonamiento — eso rompería la transparencia como diferencial).
- Academy y Biblioteca completas.
- Compatibilidad básica compartible.

### PREMIUM
- **Decisiones ilimitadas** + comparación multi-opción (3+ alternativas a la vez, no solo A vs B).
- **Memoria/historial**: guardar decisiones, marcar resultados, ver patrones propios a lo largo del tiempo.
- **Calendario de timing exportable/sincronizable** (ventanas favorables integradas a Google Calendar, por ejemplo).
- **Comparaciones avanzadas de relación/equipo** (más de 2 personas — útil para founders, familias).
- **Reportes anuales de alta calidad** (Wrapped sin marca de agua, exportable).
- **Notificaciones contextuales** ligadas a decisiones activas guardadas.

La regla del prompt se cumple de punta a punta: nunca se cobra por ver un dato ya calculado (el perfil, la explicación, el "por qué" son siempre gratis) — se cobra por **memoria, profundidad de comparación, automatización y volumen de uso**, que son costos reales de servir (cómputo, storage, notificaciones) y valor real diferenciado (no artificialmente retenido).

---

## 14. Idea 10x

### 10 ideas 10x (candidatas)

1. Decision engine como núcleo absoluto del producto (desarrollada en detalle abajo).
2. Grafo social de decisiones (ver qué decidió gente con perfil similar) — riesgoso en privacidad.
3. API/licenciamiento B2B del motor de afinidad a marcas.
4. Modo escéptico (tradición vs. evidencia) como eje de marca completo.
5. Journaling estructurado con IA como copiloto de reflexión diaria.
6. Marketplace de consultores humanos conectados al motor (híbrido IA + humano).
7. Wrapped anual como producto de marca standalone, separado del resto.
8. Historial de decisiones propio como "diario de vida" con analítica personal.
9. Integración con calendario/apps de productividad como capa de timing ambiental.
10. Convertir Molino en infraestructura (motor open source licenciado) en vez de producto de consumo.

### La elegida: #1 — Decision engine como núcleo absoluto, con el historial de decisiones propio (#8) como su motor de compuesto a largo plazo

**Por qué esta y no las otras:** las ideas #2, #6, #9, #10 cambian de negocio por completo (requieren capacidades, partners o modelos de datos que Molino no tiene hoy) — son apuestas de años, no de producto actual. Las ideas #3, #4, #5, #7 son buenas *extensiones*, pero ninguna por sí sola multiplica por 10 el valor central — son mejoras del 30-50%, no un cambio de categoría. La combinación #1 + #8 sí cambia de categoría: convierte a Molino de "calculadora simbólica" a "el lugar donde una persona lleva registro de las decisiones importantes de su vida, con una lente simbólica transparente como parte del análisis".

**Desarrollo profundo:**

El valor de esta idea no está en el cálculo del día 1 (eso ya existe, son los engines actuales). Está en lo que pasa al día 100 y al día 1000: un usuario que usó Molino para decidir 15 cosas reales en dos años tiene, dentro de Molino, algo que ningún competidor puede replicar ni él mismo puede recrear en otra app — un registro estructurado de sus propias decisiones, con el contexto simbólico de cada momento, y (si lo marcó) el resultado real de cada una. Eso convierte a Molino en:

- Un producto con **moat compuesto por el propio usuario**, no por Molino — cuanto más lo usa, más caro le resulta migrar a otra app (perdería su historial), sin que eso dependa de bloquear datos ni de tácticas oscuras (el usuario podría exportar su historial en cualquier momento, coherente con la filosofía de datos abiertos — el lock-in es de valor, no de fricción).
- Un producto donde **la personalización mejora con el uso real**, no con más inputs demográficos — exactamente la brecha que hoy tiene Molino (perfil estático) resuelta sin sacrificar privacidad (el historial puede vivir del lado del usuario/local-first, o en una cuenta opcional mínima).
- Una razón de **pago recurrente genuina**: no "productos premium nuevos cada mes" sino "cada vez que tenés una decisión real, volvés a la herramienta que ya conoce tu patrón" — el tipo de retención que sostiene un negocio de suscripción real, a diferencia de "mirar el horóscopo" (que compite directo contra apps con 100x el presupuesto de marketing).
- Una **historia de marca poderosa y honesta**: "Molino no te dice tu futuro. Te ayuda a llevar registro de cómo pensás tus decisiones, con una lente simbólica transparente" — un posicionamiento que ningún competidor de la categoría puede reclamar sin contradecir su propio modelo de negocio basado en ambigüedad.

Esto no requiere construir 10 features nuevas — requiere **recortar** el producto actual a esto, y construir bien la única pieza central (decision engine + historial) que hoy es apenas un boceto (`decisionsEngine`, sin experiencia de usuario propia, sin historial persistente).

---

## 15. Ataque crítico — "LO QUE NO DEBEMOS HACER"

1. **No construir el grafo social de decisiones (idea #2)** todavía — el riesgo de privacidad/percepción contradice el diferencial central de Molino (privacidad radical). Es un gimmick de crecimiento que cuesta más de lo que rinde en esta etapa.
2. **No perseguir "IA genera personalización" como atajo** antes de construir la capa combinatoria de reglas (sección 9) — generar texto con LLM sin sustancia debajo es personalización de fachada, exactamente lo que ya se le critica a la competencia.
3. **No lanzar el "Modo escéptico" como feature permanente todavía** — es una pieza de contenido/prensa fuerte, pero construirlo como feature de producto antes de validar que agrega valor (y no solo ruido filosófico) es esfuerzo mal timeado. Probarlo como contenido editorial primero.
4. **No construir notificaciones push genéricas ("tu energía de hoy")** — es exactamente el patrón que ya identificamos como débil (sección 10 de la auditoría anterior) y el que más fácil es de copiar/superar por competidores con más presupuesto de growth.
5. **No agregar más entidades al catálogo de afinidad (más marcas, más países) como prioridad** — el catálogo actual ya alcanza para validar el decision engine; expandirlo es trabajo de investigación costoso con retorno bajo hasta que el core loop esté probado.
6. **No construir cuenta de usuario obligatoria ni sistema de auth completo de entrada** — empezar con historial local-first/exportable; agregar cuenta opcional recién cuando el decision engine ya demuestre que la gente quiere volver a su historial.
7. **No lanzar B2B/API pública (idea #3) todavía** — es una apuesta de distribución real pero distrae recursos de construir el producto B2C que hoy no está probado; es una fase LATER, no NOW.
8. **No mantener las 22-25 secciones actuales del perfil "por las dudas"** — mantener todo por miedo a "eliminar features existentes" (regla actual del proyecto en `MOLINO_CONTEXT.md`) es exactamente lo que impide que la nueva arquitectura funcione. Hay que estar dispuestos a archivar/colapsar secciones, no solo reordenarlas.
9. **No prometer certeza en ningún caso del decision engine** — el caso F (sección 7) es el más peligroso: la tentación de "sonar más útil" dando una respuesta clara cuando no hay convergencia real destruiría la credibilidad que es la base del moat. Mejor decir "no hay señal clara" que inventar una.
10. **No construir el Wrapped anual (idea #7) como prioridad de estas 12 semanas** — es un buen mecanismo viral, pero depende de tener usuarios con historial acumulado; construirlo antes de tener ese historial es construir para un público que todavía no existe.
11. **No agregar journaling con IA (idea #5) en esta fase** — sería una capa más de complejidad y de costo (inferencia de LLM) antes de validar que el core loop de decisiones ya retiene. Es un candidato fuerte para después, no para ahora.
12. **No copiar el tono/personalidad de marca de Co-Star (sarcasmo, notificaciones agresivas)** ni la opacidad algorítmica de ningún competidor — contradice directamente el eje de transparencia que es el moat real de Molino.

---

## 16. Nueva arquitectura de producto

```
HOME
  ↓
¿Qué te trae hoy? (pregunta abierta + plantillas)
  ↓
  ├── DECIDIR (núcleo del producto)
  │     → Comparar opciones / Timing / Compatibilidad / Nombre
  │     → Resultado + "¿por qué?" + guardar + compartir
  │
  ├── MI MAPA (antes "perfil" — ahora contexto, no destino)
  │     → Identidad (resumen, no 20 secciones)
  │     → Historial de decisiones guardadas
  │     → Ciclo actual
  │
  ├── EXPLORAR (antes Academy + Biblioteca + Afinidad libre)
  │     → Para quien quiere navegar sin una pregunta puntual
  │     → Catálogo de entidades, glosario, contenido educativo
  │
  └── FILOSOFÍA / CÓMO FUNCIONA
        → Transparencia de marca (metodología, privacidad, fuentes)
```

Cambios respecto a la arquitectura propuesta en la auditoría anterior (`Identidad / Mundo / Círculo / Profundidad`):

- **"Decidir" reemplaza a "Mundo" y "Círculo" como pantalla central** — ambos se convierten en *modos* dentro de Decidir (comparar lugares/marcas = lo que era "Mundo"; compatibilidad = lo que era "Círculo"), no en pantallas propias con el mismo nivel jerárquico.
- **"Mi Mapa" pasa de ser el destino principal a ser contexto de soporte** — sigue existiendo, pero no es la primera pantalla después de onboarding.
- **"Profundidad" desaparece como categoría** — no hay "modo avanzado" separado; Academy/Biblioteca se renombran a "Explorar" y quedan como la opción para quien no tiene una pregunta puntual (curiosidad libre), en igualdad de jerarquía con Decidir, no debajo.

---

## 17. Nueva home

### HOME — usuario nuevo

1. **Lo que aparece primero:** una pregunta, no un dato. *"¿Qué te trae por acá hoy?"* con 2-3 chips de plantilla (Tengo una decisión / Quiero conocer mi mapa / Solo tengo curiosidad) + campo de texto libre.
2. **CTA principal:** avanzar según la elección — si es "tengo una decisión", pide la decisión primero y la fecha de nacimiento después (invertido respecto al onboarding actual); si es "curiosidad", va directo al flujo de mapa actual.
3. **Qué se muestra:** mínimo — sin número del día gigante compitiendo por atención, sin estadísticas de vanidad ("3 sistemas, 13 fuentes") como prueba social principal. La prueba social debería ser metodológica ("cada cálculo, explicado y con fuente"), no numérica.
4. **Qué cambia con perfil:** nada todavía — sigue siendo la puerta de entrada a la pregunta.

### HOME — usuario recurrente

1. **Lo que aparece primero:** si tiene decisiones guardadas activas, un resumen de estado ("Tenés 2 decisiones en seguimiento: España (mudanza), Lanzamiento de proyecto — ¿alguna novedad?"). Si no tiene ninguna, la misma pregunta de entrada que el usuario nuevo, pero con su nombre y contexto ya cargado.
2. **CTA principal:** continuar una decisión activa, o abrir una nueva.
3. **Qué se muestra:** cualquier convergencia/patrón nuevo detectado desde la última visita (algo cambió en su ciclo, no contenido genérico del día).
4. **Diferencia clave con la home actual (`PersonalizedHome`):** hoy la home recurrente muestra "energía del día" como pieza central — en la propuesta, el estado de las decisiones activas del usuario reemplaza a la energía diaria como pieza central, porque conecta directamente con algo que el usuario ya declaró que le importa, en vez de un dato ambiental genérico.

---

## 18. Nuevo posicionamiento

### 10 posicionamientos posibles

1. "No es un horóscopo." (genérico, defensivo, no diferenciado)
2. "El GPS simbólico para tus decisiones." (interesante, pero "GPS" sugiere certeza que Molino no debe prometer)
3. "Pensá mejor tus decisiones, con toda la data a la vista." — **elegido**
4. "La lente simbólica que podés auditar." (fuerte en transparencia, débil en utilidad percibida)
5. "Tu copiloto para decisiones que importan." (bueno, algo genérico de categoría SaaS)
6. "Autoconocimiento con recibo." (creativo, pero suena a joke, no a marca seria)
7. "El único horóscopo que te muestra la fórmula." (fuerte pero se sigue anclando en "horóscopo")
8. "Símbolos, con criterio." (corto, elegante, pero poco explicativo por sí solo)
9. "Decisiones con memoria." (bueno para etapa madura, débil para primera impresión sin contexto)
10. "La claridad simbólica que se explica sola." (correcto pero un poco frío)

### Elegido: #3 — "Pensá mejor tus decisiones, con toda la data a la vista."

- **Headline:** *"Pensá mejor tus decisiones, con toda la data a la vista."*
- **Subheadline:** *"Numerología, astrología y zodíaco chino, cruzados y explicados — para ayudarte a decidir con más claridad, no para decirte tu futuro."*
- **Promesa:** claridad para decidir, nunca certeza sobre el resultado.
- **Categoría:** copiloto de decisiones con lente simbólica transparente (no "app de astrología").
- **Diferencial:** cada recomendación viene con su "¿por qué?" auditable — dato, fórmula, fuente, límite — y con memoria de tus propias decisiones a lo largo del tiempo.
- **Tono:** racional-cálido; cercano en el "vos", riguroso en el fondo; nunca esotérico, nunca sarcástico (a diferencia de Co-Star), nunca vago (a diferencia del horóscopo genérico).
- **Audiencia:** personas que sienten curiosidad simbólica pero desconfían del horóscopo tradicional — y, más específicamente, personas frente a una decisión real (mudanza, timing, nombre, relación) que buscan un criterio adicional honesto, no una respuesta mágica.

---

## 19. Roadmap 90 días

### Semanas 1-2 — Qué cambiar (sin construir nada nuevo todavía)
- **UX:** invertir el orden del onboarding para poder capturar "¿qué te trae?" antes/junto con la fecha. Eliminar duplicación de CTAs en `/profile` (quick win ya identificado). Simplificar navegación del header.
- **Producto:** definir el contrato de datos del "decision engine" como orquestador sobre `decisionsEngine`/`timingEngine`/`affinityEngine`/`compatibilityEngine` existentes (diseño, no implementación aún si se respeta "no modifiques código" de este documento — pero si se pasa a ejecución, esta es la semana de diseño técnico).
- **Growth/SEO:** ningún cambio estructural todavía — auditar qué páginas de entidad ya son citables (AEO) para no perder ese activo en la reestructuración.
- **Monetización:** ninguna todavía — validar hipótesis de precio con encuestas/entrevistas antes de tocar el flujo de MercadoPago existente.
- **Retención:** apagar o reducir cualquier notificación genérica tipo "energía del día" si ya existe activa, para no seguir reforzando el hábito equivocado.

### Semanas 3-4 — Qué construir
- **Producto:** primera versión del decision engine con 2 casos (Comparar opciones — Caso A/D combinados, y Timing — Caso B/F combinados) usando los engines ya existentes, con el "¿por qué?" expandible como parte no-opcional de cada resultado.
- **UX:** nueva home con la pregunta de entrada ("¿Qué te trae por acá hoy?") en lugar del hero actual.
- **Growth:** preparar el mecanismo de link compartible efímero para el resultado de compatibilidad (reutilizando lo que ya existe en `compatibilityEngine`).

### Mes 2 — Qué lanzar
- **Producto:** lanzar el decision engine como entrada principal del producto (reemplazando al perfil como destino post-onboarding) para un porcentaje de usuarios (rollout gradual/A-B si la infraestructura lo permite).
- **Retención:** historial mínimo de decisiones (local-first, exportable) — sin cuenta obligatoria.
- **SEO/AEO:** implementar datos estructurados (FAQ schema) en páginas de entidad y glosario existentes — bajo esfuerzo, ya identificado como oportunidad.
- **Monetización:** definir el corte free/premium exacto (sección 13) y conectar el flujo de MercadoPago ya construido a la primera feature premium real (probablemente: comparación multi-opción + historial).

### Mes 3 — Qué experimentar
- **Producto:** probar el caso E (relación) y el caso C (nombres) como extensiones del decision engine, midiendo cuál genera más uso recurrente.
- **Growth:** experimento de "Modo escéptico" como contenido editorial (no feature de producto todavía) para medir tracción de prensa/redes.
- **Retención:** probar notificación contextual ligada a decisión activa (no genérica) con un grupo reducido opt-in.
- **Monetización:** medir conversión real del primer producto premium antes de agregar más tiers.
- **UX:** revisar métricas del nuevo core loop (¿cuántos usuarios completan una decisión? ¿cuántos vuelven con una segunda?) para decidir si la arquitectura de la sección 16 se consolida o se ajusta.

---

## 20. Decisión final

1. **¿Qué es Molino realmente?** Un motor de cálculo simbólico riguroso y transparente, hoy empaquetado como enciclopedia, con el potencial de ser un copiloto de decisiones personales.

2. **¿Qué debería dejar de ser?** Una colección de 18 motores presentados como secciones independientes de un perfil enciclopédico. Debería dejar de tratar cada engine como un destino y empezar a tratarlos como ingredientes invisibles de una sola experiencia.

3. **¿Cuál es su problema principal?** Ayudar a elegir entre opciones (mudanza, nombres, timing, compatibilidad) cuando los datos objetivos no alcanzan y la persona busca un criterio adicional honesto.

4. **¿Cuál debería ser su core loop?** Trigger real de vida → pregunta → análisis multicapa invisible → síntesis explicada con nivel de certeza → recomendación accionable → registro del resultado → ese historial mejora la siguiente respuesta y trae al usuario de vuelta.

5. **¿Cuál es su feature estrella?** El decision engine con comparación multi-opción y "¿por qué?" auditable, alimentado por convergencia/contradicción entre los 3 sistemas.

6. **¿Cuál es su AHA moment?** En menos de 60 segundos, mostrar un hallazgo de convergencia específico de la combinación exacta del usuario (no genérico por signo), con una medida de cuán infrecuente es, conectado directamente a la pregunta que el usuario trajo.

7. **¿Por qué volvería alguien?** Porque tiene una decisión real nueva — no porque "toca revisar el horóscopo". Las decisiones importantes son recurrentes por naturaleza de la vida adulta.

8. **¿Por qué pagaría?** Por comparación multi-opción ilimitada, memoria/historial de sus propias decisiones, y automatización de timing — nunca por ver un dato que ya se calculó gratis.

9. **¿Qué lo hace difícil de copiar?** La combinación de rigor metodológico auditable + motor combinatorio determinístico + historial de decisiones propio del usuario, que compone con el tiempo y no se puede clonar copiando el código (el historial es del usuario, no del producto).

10. **¿Qué construirías primero mañana?** El orquestador del decision engine sobre los engines ya existentes (`decisionsEngine`, `timingEngine`, `affinityEngine`, `compatibilityEngine`), empezando por un solo caso bien resuelto (comparación de opciones — el Problema #1 de la sección 3), con el "¿por qué?" expandible incluido desde el primer día, no agregado después.

---

## Cierre

La conclusión incómoda que este documento no evita: **la arquitectura actual está equivocada, no porque esté mal ejecutada, sino porque organiza el producto alrededor de la pregunta equivocada ("¿quién sos?") en vez de la que genera valor real ("¿qué estás por decidir?").** Molino no necesita 18 motores más ni 22 secciones mejor ordenadas — necesita que una sola capacidad, la de decisión, se vuelva diez veces más profunda, con todo lo demás sirviéndola desde abajo, invisible.

No proteger el roadmap anterior: la reorganización en 4 pantallas (Identidad/Mundo/Círculo/Profundidad) ya diseñada internamente es una mejora real sobre el estado actual, pero es la respuesta correcta a la pregunta equivocada. Ejecutarla generaría un producto mejor organizado que sigue sin resolver por qué alguien debería volver o pagar. Este documento propone resolver esa pregunta primero, y dejar que la arquitectura de navegación se derive de ahí — no al revés.

*Documento de estrategia. No se realizaron cambios de código como parte de este análisis.*
