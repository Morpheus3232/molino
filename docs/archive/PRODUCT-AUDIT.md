# PRODUCT AUDIT — Molino (www.molino.app)

> Fecha: 2026-07-30
> Metodología: revisión del código/repo (`molino`), navegación del sitio en producción, lectura de la documentación interna existente (STRATEGIC_DIAGNOSTIC.md, MOLINO_CONTEXT.md, AUDITORIA.md, EXPERIENCE_MAP.md) e investigación de competidores (Co-Star, The Pattern, CHANI, Genetic Matrix/MyBodyGraph, apps de numerología).
> Alcance: auditoría de producto integral — NO se modificó código.

---

## 1. Executive Summary

Molino es un motor de cálculo simbólico (numerología + astrología occidental + zodíaco chino) genuinamente sólido — probablemente el más completo y mejor verificado de su categoría en español (18 engines, fechas CNY reales, fuentes citadas) — envuelto en una **arquitectura de producto que todavía no decidió qué es**.

Hoy Molino se comporta como tres productos distintos apilados sin jerarquía: (1) una calculadora educativa transparente ("sabé cómo se calcula"), (2) un horóscopo diario recurrente ("tu energía de hoy"), y (3) un motor de afinidad simbólica con marcas/países/personas ("tu mundo"). Ninguno de los tres está completamente desarrollado como experiencia autónoma, y el `/profile` los mezcla en ~22-25 secciones en una sola página infinita, sin navegación, sin priorización y con CTAs duplicados — esto ya está diagnosticado internamente en `STRATEGIC_DIAGNOSTIC.md`, y coincide con lo que se observa en producción.

El diferencial real de Molino no es "más sistemas simbólicos" (eso lo tiene cualquier competidor con más presupuesto), sino su **honestidad metodológica radical**: separa dato factual de interpretación, cita fuentes, explica fórmulas, no hace predicciones, no persiste datos. Ningún competidor grande (Co-Star, CHANI, The Pattern, Genetic Matrix) compite en ese eje — todos monetizan opacidad y ambigüedad ("el algoritmo lo sabe"). Ese es el moat potencial. Hoy ese diferencial está *declarado* (en `/filosofia`) pero casi no está *demostrado* dentro de la experiencia principal.

El negocio está a medio construir: hay infraestructura de pago (MercadoPago: preference, coupon, webhook, verify, recover) completamente integrada mientras no existe ningún feature premium visible en el producto ni una razón de compra clara. Es decir: existe el "cómo cobrar" sin existir el "qué cobrar".

La oportunidad más grande no es agregar más sistemas simbólicos — es convertir un catálogo de datos en una **herramienta de decisión personal recurrente**, con memoria de usuario real (hoy Molino literalmente no recuerda nada entre sesiones más allá de localStorage del propio dispositivo), un motivo de retorno diario genuino, y un producto premium que valga pagar sin traicionar "sin registro, sin tracking, sin datos guardados".

---

## 2. Qué es realmente el producto

**Lo que dice ser:** "Numerología, astrología y zodíaco chino cruzados en un solo mapa personal. Gratis, sin registro, sin datos guardados."

**Lo que es en la práctica**, según la arquitectura real (`lib/engines/`, `app/`):

- Un **motor de cálculo** (18 engines: numerología, astrología, zodíaco chino, afinidad, timing, decisiones, timeline, convergencia, energía diaria, síntesis, recomendación) que traduce fecha de nacimiento (+ nombre opcional) en docenas de outputs simbólicos.
- Un **hub de perfil** (`/profile`) que apila esos outputs en 22-25 secciones sin jerarquía clara entre "identidad", "patrones", "recomendaciones" y "mapa".
- Un **catálogo de afinidad** (`/affinity`) que relaciona el perfil del usuario con ~31 entidades (marcas, países) via fecha de fundación → animal zodiacal → score de compatibilidad.
- Un **contenido educativo** (`/academy`, `/biblioteca`, `/conocimiento`) tipo enciclopedia con fuentes.
- Una **promesa filosófica** (`/filosofia`): conocimiento libre, privacidad radical, transparencia, sin tracking — el único diferencial de marca hoy visible.
- Un **backend de pagos ya construido** (MercadoPago: preference/checkout, coupon, webhook, verify, recover) sin ningún producto premium visible conectado en la UI.

**Para quién es:** en teoría, cualquier persona interesada en autoconocimiento; en la práctica, el copy y el tono ("vos", filosofía anti-esotérica, foco en transparencia metodológica) apuntan a un público más escéptico/racional que el usuario típico de horóscopo — alguien que quiere símbolos *y* que le muestren la fórmula. Ese público es más chico que el mercado masivo de Co-Star, pero es un público desatendido: el usuario que dejó de usar horóscopos porque "no le explican nada" no tiene a dónde ir hoy.

**Contradicción principal entre promesa y experiencia real:** la promesa es "mapa personal", singular, claro, orientador. La experiencia real es una enciclopedia con 22+ secciones sin narrativa ni progreso. "Orientate" (parte del claim de hero "Conocéte. Entendéte. Orientáte.") es la palabra más floja del producto hoy: nada en `/profile` ayuda activamente a decidir algo concreto — informa, no orienta. Esto ya lo identificó `STRATEGIC_DIAGNOSTIC.md` internamente, y es correcto.

**Modelo de negocio actual:** ninguno operativo de cara al usuario. Existe infraestructura de pago sin producto pago. Sin ads, sin señal de estrategia de monetización en el copy visible.

---

## 3. Fortalezas

1. **Rigor metodológico real, no cosmético.** `calculateAnimalFromDate()` corrige el Año Nuevo Chino real (no asume por año gregoriano) — un error que la mayoría de calculadoras de zodíaco chino online comete. Fechas canónicas verificadas para entidades (Nike, Apple, Coca-Cola, países) con fuente y distinción explícita entre dato factual e interpretación simbólica.
2. **Privacidad como producto, no como disclaimer.** Sin registro, sin cookies, sin persistencia server-side, todo en memoria de sesión/localStorage. En un mercado donde Co-Star fue noticia por sus prácticas de datos, esto es un ángulo de marketing real y verificable (código abierto en GitHub lo respalda).
3. **Amplitud de motores.** 18 engines cubriendo numerología, astrología, zodíaco chino, timing, decisiones, energía diaria, convergencia, timeline — hay más profundidad de cálculo acá que en la mayoría de apps freemium del rubro.
4. **Onboarding de entrada ultra bajo (solo fecha).** Coincide con mejores prácticas de la categoría (Co-Star también empieza mínimo). Reveal animado post-fecha es un buen "momento wow" potencial, aunque hoy diluido por jerga técnica sin contexto (Life Path, Birthday Number sin explicar).
5. **Código abierto + transparencia de fuentes.** Es un diferencial defendible frente a competidores cerrados: nadie puede auditar cómo Co-Star calcula un score de compatibilidad; en Molino, en teoría, sí.
6. **Ya existe auto-diagnóstico interno de calidad.** El equipo ya identificó (en `STRATEGIC_DIAGNOSTIC.md`, `AUDITORIA.md`) los mismos problemas estructurales que esta auditoría confirma — buena señal de criterio, mala señal de que todavía no se ejecutó.

---

## 4. Debilidades

1. **El perfil es una enciclopedia, no un producto.** 22-25 secciones en scroll infinito sin tabs, sin table of contents, sin indicador de progreso. Confirmado en código y en producción.
2. **Cero memoria real de usuario.** Sin cuenta, todo vive en localStorage del dispositivo — el usuario pierde su mapa si cambia de navegador/dispositivo, no hay forma de que Molino "aprenda" del usuario a través del tiempo salvo lo que ya calculó una vez. La privacidad radical, tal como está implementada, mata la posibilidad de personalización progresiva.
3. **Recomendaciones sin acción.** El motor de afinidad dice "Apple resuena con vos, 75/100" — y ahí termina. No hay siguiente paso, no hay "por qué me importa esto", no convierte el dato en decisión.
4. **Traits genéricas, no personalizadas.** Confirmado en `STRATEGIC_DIAGNOSTIC.md`: los rasgos de cada animal/signo son strings hardcodeados — dos usuarios "Caballo" ven exactamente el mismo texto. Contradice el branding "Inteligencia Personal".
5. **Monetización fantasma.** MercadoPago totalmente integrado (checkout, cupones, webhooks, recovery de pagos) sin ningún producto premium visible. Esto es riesgo de negocio, no solo de UX: no hay ingresos, y construir el backend antes que la propuesta de valor premium invierte el orden correcto.
6. **CTAs duplicados y navegación confusa**, ya diagnosticado internamente: "Marcas alineadas" / "Destinos compatibles" / "Todas las entidades" aparecen redundantemente en 4 secciones distintas del perfil.
7. **Ningún motivo fuerte de retorno diario más allá de "energía de hoy" genérica.** No hay push/email, no hay progreso acumulable, no hay historial ("¿cómo estuvo mi energía la semana pasada?" no se puede responder — no hay date navigation en Daily Energy, confirmado en `EXPERIENCE_MAP.md`).
8. **"Orientáte" no se cumple.** El producto no ayuda a decidir nada concreto (¿viajo a este destino? ¿esta persona es compatible? ¿es buen momento para X?) pese a tener engines de `decisionsEngine` y `timingEngine` ya construidos y subutilizados.

---

## 5. Problemas críticos

Priorizados por impacto en la percepción de valor y en el negocio:

1. **P0 — El hub `/profile` no comunica valor en los primeros 10 segundos.** Un usuario nuevo entra, ve jerga (Life Path, Birthday Number, Personal Year) sin traducción a "por qué me importa", y debe scrollear una enciclopedia para encontrar algo accionable.
2. **P0 — No hay razón de negocio.** Sin monetización activa y sin plan de retención medible (no hay analytics de producto operando de forma consistente — `posthog-js` está en dependencias pero el nivel de instrumentación real no se pudo verificar en esta auditoría), Molino no tiene forma de saber si mejora o no.
3. **P0 — Cero continuidad entre sesiones.** El usuario no puede "volver a donde estaba" en otro dispositivo, no hay forma de guardar progreso de exploración salvo el propio perfil base. Esto limita techo de retención estructuralmente.
4. **P1 — Motor de afinidad subutilizado.** Hay 18 engines y una base de entidades verificadas que hoy sólo producen listas rankeadas. Es la pieza con más potencial de diferenciación (nadie más tiene esta base de datos histórica verificada) y es la que menos se explota como herramienta.
5. **P1 — Falta de personalización real del contenido interpretativo** (traits hardcodeadas por animal/signo, no por combinación de perfil completo).

---

## 6. UX Audit

**Claridad:** la promesa de home es clara ("mapa personal, gratis, sin registro"); la promesa de `/profile` se pierde en volumen. El usuario entiende *qué es* Molino antes de entrar, pero no entiende *cómo usarlo* una vez dentro.

**Arquitectura de información:** plana en la mayoría de vistas internas (secciones apiladas), sin jerarquía de "primero esto, después esto". El propio equipo ya diseñó la solución (4 pantallas: Identidad / Mundo / Círculo / Profundidad) en `STRATEGIC_DIAGNOSTIC.md` — pendiente de ejecución, no de diseño.

**Navegación:** el header actual mezcla dropdowns ("Descubrir", "Relacionarte", "Orientarte") con ítems sueltos ("Herramientas", "Mi mapa") — categorías con nombres poéticos que no comunican contenido, obligando al usuario a explorar por ensayo y error.

**Onboarding:** el paso más fuerte del producto. Solo fecha, avance automático entre campos, preview de motores. Se pierde puntos por: sin indicador de progreso, sin manejo visible de error si falla la generación, reveal con términos técnicos sin explicar (Life Path, Birthday Number) que diluyen el momento wow.

**Descubrimiento / comprensión del producto:** razonable en la landing, débil dentro del perfil — el usuario no tiene forma de saber "qué me falta explorar" ni "qué debería mirar primero según mi perfil".

**Cantidad de pasos / fricción:** onboarding bajo (bien); pero una vez adentro, encontrar algo específico (compatibilidad con una marca, comparación con otra persona) requiere navegar múltiples niveles sin breadcrumbs en la mayoría de páginas (confirmado en `EXPERIENCE_MAP.md`).

**Estados vacíos:** débiles. La tarjeta de energía diaria falla en silencio si `energy` es null (sin mensaje). El `/profile` sin datos muestra solo "Cargando tu mapa..." sin explicar qué se necesita ni ofrecer atajo.

**Retorno del usuario / sensación de progreso:** casi nulo. No hay historial navegable, no hay indicador de "esto cambió desde tu última visita", no hay journaling ni acumulación de ningún tipo.

**Momentos de "aha":** el reveal post-fecha (animal + Life Path + elemento) es el único momento diseñado como sorpresa; se diluye por exceso de términos sin traducir.

**Puntos de abandono:** scroll infinito de `/profile` sin anclas es el punto de fuga más probable — no hay forma de "guardar el lugar" ni razón para volver a bajar hasta la sección 20.

---

## 7. UI Audit

- **Jerarquía visual:** confusa en `/profile` por diseño (3 secciones de "identidad", 3 de "patrones", 4 de "recomendaciones" — diagnosticado internamente). En Home, el número del día (hasta 22vw) compite visualmente con el CTA principal, restándole foco a la acción que más importa (crear el mapa).
- **Tipografía/composición:** consistente con un sistema de diseño documentado (`DESIGN_SYSTEM.md`, `LAYOUT_SYSTEM.md`) — señal de madurez de sistema, aunque la ejecución tiene fugas: mezcla de `btn-accent` global con Tailwind inline y componente `<Button>` en distintas páginas (inconsistencia de patrón, no de intención).
- **Spacing:** inconsistencias puntuales documentadas (ej. onboarding usa `px-4 sm:px-6` mientras el resto del sitio usa `px-4 sm:px-8 lg:px-12`).
- **Colores/dark mode:** hay riesgo real de accesibilidad — colores semánticos hardcodeados (`text-green-500`, `text-red-500`, etc.) que no se adaptan a dark mode, lo que puede romper contraste WCAG AA (regla propia del proyecto, según `MOLINO_CONTEXT.md` punto 10).
- **Responsive/mobile:** el proyecto declara mobile-first y tiene un `MOBILE.md` dedicado — buena señal de intención; el número del día en hero es desproporcionado en tablet según auditoría interna.
- **Percepción de calidad/premium:** el objetivo declarado ("moderno, minimalista, premium, no esotérico") se cumple parcialmente — hay piezas planas sin profundidad (bloques de color sólido sin textura/sombra) que bajan la percepción de "producto premium" vs. competidores como CHANI o The Pattern, que invierten fuerte en ilustración/motion de marca.

---

## 8. Copy Audit

**Titulares:** "CONOCÉTE. ENTENDÉTE. ORIENTÁTE." — fuerte, memorable, en 3 verbos claros. Problema: el producto solo cumple los primeros dos; "orientar" (implicar una decisión) no está soportado por la experiencia.

**CTAs:** "DESCUBRIR MI MAPA" es claro y único en home; dentro del perfil se diluye por duplicación ("Marcas alineadas", "Destinos compatibles", "Todas las entidades" repetidos en 4 lugares con distinta redacción para la misma acción). Recomendación: un solo verbo por acción, reutilizado siempre igual, para que el usuario aprenda el vocabulario del producto.

**Microcopy técnico sin traducir:** "Life Path", "Birthday Number", "Año Personal" aparecen en el reveal sin explicación inmediata — para un usuario nuevo esto es ruido, no información. Alternativa: mostrar primero la traducción emocional/práctica ("Tu energía este año favorece movimiento y cambio") y dejar el término técnico como detalle expandible, no como titular.

**Mensajes de resultado:** los scores de afinidad ("75/100") son numéricamente precisos pero no dicen nada accionable. "Apple — 75/100" es un dato; "Apple resuena con tu búsqueda de innovación — considéralo si estás eligiendo entre marcas afines a tu energía" sería valor.

**Tono general:** coherente, en español con "vos" (regla propia respetada), evita el lenguaje new-age genérico de la competencia — este es un acierto de marca que vale reforzar, no diluir.

**Dónde el copy es genérico:** los textos de traits por animal/signo (compartidos por todos los usuarios de ese signo) — se sienten a horóscopo de diario, exactamente lo que Molino dice no ser.

---

## 9. Product Value Audit

Separando **feature** de **valor real**:

| Feature | ¿Por qué le importaría al usuario? | ¿Manera más útil de convertirlo en herramienta? |
|---|---|---|
| Numerología / astrología / zodíaco chino cruzados | Curiosidad de autoconocimiento, ya cubierta por decenas de apps | Cruzar los 3 sistemas para generar una síntesis única e irrepetible por usuario (no 3 lecturas paralelas, sino 1 conclusión combinada) — hoy `synthesisEngine` existe pero no es el centro de la experiencia |
| Score de afinidad con marcas/países | Curiosidad puntual, sin continuidad | Convertirlo en herramienta de decisión real: "estoy eligiendo entre 3 países para mudarme / 3 marcas para invertir / 2 nombres para mi bebé — ¿cuál resuena más con mi perfil?" |
| `timingEngine` / `decisionsEngine` (ya construidos, poco visibles) | El usuario real sí quiere ayuda para decidir momentos (¿lanzo mi proyecto esta semana? ¿es buen momento para una conversación difícil?) | Convertir esto en el corazón del producto premium: un "asesor de timing" que combine astrología + numerología + zodíaco chino para responder preguntas concretas que el usuario formula, no solo mostrar semáforos genéricos |
| Energía diaria | Informa un número, no ayuda a actuar | Conectar el número a una sugerencia concreta del día ("hoy es buen día para X, evitá Y") y a un historial navegable, no solo el presente |
| Compatibilidad entre dos perfiles | Popular como feature viral, hoy poco explotada como tal | Convertir en herramienta compartible en tiempo real: A genera su perfil, comparte un link, B completa el suyo, ambos ven el resultado — mecanismo de crecimiento orgánico natural que hoy no existe explícitamente |
| Academy / Biblioteca | Contenido educativo de calidad, aislado del resto | Conectar cada término técnico del perfil directamente a su entrada de Academy (hoy son silos separados) |

**Patrón general:** el producto **informa pero no ayuda a actuar** en casi todos sus módulos. Tiene los engines para lo contrario (`decisionsEngine`, `timingEngine`) pero no los usa como eje central.

---

## 10. User Journey

| Etapa | Objetivo del usuario | Objetivo del producto | Fricciones | Oportunidad |
|---|---|---|---|---|
| Descubrimiento | Entender rápido qué es esto | Comunicar diferencial (privacidad + rigor) | Producto compite en SEO/redes contra apps con presupuestos de marketing 100x mayores | Posicionar el eje "sin tracking, con fuentes" como cuña de nicho — contenido tipo "por qué tu horóscopo miente" |
| Landing | Decidir si vale la pena dar la fecha | CTA claro | Buen puntaje acá | — |
| Primera interacción (onboarding) | Dar la fecha rápido y sin fricción | Generar el mapa | Bajo, bien resuelto | Agregar micro-progreso visual |
| Primer resultado (reveal) | Sentir "esto me describe" | Momento wow | Jerga sin traducir diluye el impacto | Traducir primero, tecnicismo después (expandible) |
| Exploración (`/profile`) | Encontrar algo relevante para mí | Mostrar profundidad del motor | Scroll infinito, sin jerarquía, CTAs duplicados | Reestructurar en pantallas con navegación (ya diseñado internamente, falta ejecutar) |
| Segundo uso | Ver algo nuevo o distinto a la primera vez | — (hoy no hay diseño para esto) | Nada cambia entre visita 1 y visita 10 salvo la energía diaria | Sistema de "lo que no viste todavía" + novedades desde última visita |
| Retorno | Motivo concreto para volver | Energía diaria | Sin historial, sin notificación, sin acumulación | Historial navegable + insight semanal/mensual + reminder opt-in |
| Conversión | — | No definido hoy | No hay producto premium visible pese a tener el backend | Definir y lanzar 1 producto premium claro (ver sección 19) |
| Retención | Sentir que el producto "lo conoce" | No hay mecanismo | Sin cuenta, sin memoria cross-device | Cuenta opcional (no obligatoria) que preserve la privacidad radical pero permita continuidad |

---

## 11. Competitor Analysis

| Competidor | Qué hace mejor | Qué hace peor | Oportunidad que deja abierta | Qué aprender | Qué NO copiar |
|---|---|---|---|---|---|
| **Co-Star** ([apps.apple.com](https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561)) | Notificaciones push hiperpersonalizadas ligadas a tránsitos reales; tono de voz distintivo (irónico, directo) que generó identidad de marca fuerte | Cálculos poco transparentes ("el algoritmo lo sabe"), historial de controversias de privacidad de datos, monetiza con paywalls agresivos de compatibilidad ([Adapty paywall library](https://adapty.io/paywall-library/co-star-personalized-astrology/)) | Un usuario que quiere entender el *por qué*, no solo el *qué* | La eficacia del push notification ligado a eventos reales (no genérico) como motor de retención diaria | Opacidad algorítmica ni tono sarcástico como identidad — no es la marca de Molino |
| **The Pattern** | Lectura de personalidad narrativa, poética, centrada en patrones emocionales y timing relacional; la feature de compatibilidad es su gancho viral más fuerte | Menos rigor técnico visible, jerga astrológica reducida pero también menos explicada | Cruzar narrativa emocional con rigor de fuente (nadie hace ambas cosas bien a la vez) | El poder de una narrativa "sobre mí" que se siente escrita a medida, no una tabla de datos | No copiar la falta de transparencia metodológica |
| **CHANI** ([chani.com/app](https://www.chani.com/app)) | Meditaciones guiadas, journal con prompts personalizados, tono inclusivo y cuidado editorial fuerte | Ecosistema cerrado, fuerte dependencia de contenido curado por una sola autora (no escalable ni auditable) | Combinar journaling/reflexión con cálculo verificable — otro cruce que nadie resuelve bien | El valor de journaling como mecanismo de retención y personalización progresiva | No depender de una sola voz de autor como fuente de autoridad — Molino gana citando fuentes públicas, no autoría personal |
| **Genetic Matrix / MyBodyGraph** (Human Design) | Monetización clara por capas: chart gratis, desbloqueos por profundidad (\$99 unlock), IA entrenada sobre el corpus original, herramientas de tránsito y relación en la suscripción | Pricing agresivo y poco transparente en capas, sistema (Human Design) con base científica cuestionable presentado como si la tuviera | Ofrecer un modelo freemium por *profundidad de herramienta* (no por cantidad de sistemas) manteniendo honestidad sobre qué es folclore y qué es cálculo | El modelo de "chart gratis + herramientas de aplicación práctica (timing, relaciones) como premium" es exactamente el patrón que `timingEngine`/`decisionsEngine` de Molino podrían monetizar | No vender "IA entrenada en un gurú" como autoridad — contradice la transparencia de fuentes de Molino |
| **Numerology.com / astro-seek / Numerologist.com** | Alto volumen de tráfico SEO/AEO en long-tail ("compatibilidad life path 5 y 7") | Contenido genérico, mismo texto para todos, sin cálculo interactivo real, diseño anticuado | Molino ya tiene mejor cálculo y mejor diseño — le falta el volumen de contenido long-tail que estos sitios capturan en Google/IA | La estrategia de contenido programático por combinación (número × número, signo × signo) como motor de SEO/AEO | No copiar el diseño ni la falta de interactividad — ahí Molino ya gana |

**Conclusión de competidores:** nadie en el espacio cruza (a) rigor metodológico transparente, (b) diseño premium moderno y (c) foco en decisión práctica (timing/decisiones) en vez de solo lectura de personalidad. Ese cruce es el espacio libre.

---

## 12. Market Opportunities

- **AEO (Answer Engine Optimization):** el contenido de `/biblioteca`, `/academy` y las páginas de entidades (`/affinity/[type]/[slug]`) tienen estructura ideal para ser citados por buscadores con IA (respuestas con fuente, metodología explícita, fecha verificada) — algo que Numerology.com y similares no ofrecen (contenido no verificable). Es una ventaja de posicionamiento subexplotada.
- **SEO long-tail programático:** miles de combinaciones posibles (signo × signo, número × número, animal × animal, marca × usuario) hoy cubiertas parcialmente. Cada combinación es una página potencial indexable con contenido único (no reciclado), algo que el motor de cálculo ya permite generar.
- **Nicho desatendido:** personas escépticas del horóscopo tradicional que igual sienten curiosidad simbólica — hoy sin producto dedicado.
- **Español como ventaja competitiva:** casi todos los competidores fuertes (Co-Star, CHANI, The Pattern) son productos en inglés, con localización débil a LatAm. Molino ya está en español nativo con "vos" — puede ser el "Co-Star de habla hispana con rigor" antes de que alguno de ellos localice bien.
- **B2B/API:** el motor de cálculo (engines + entidades verificadas) es un activo reutilizable — podría licenciarse a medios, apps de citas, marcas (activaciones de marketing "descubrí tu afinidad con [marca]") sin necesitar que el usuario final pague.

---

## 13. Nuevas funcionalidades

1. **Historial navegable de energía diaria** (no solo el presente) — base de retención mínima que hoy falta.
2. **Cuenta opcional (no obligatoria)** que permita sincronizar el perfil entre dispositivos sin romper "sin tracking" — auth mínima (email o passkey) desacoplada de analytics/tracking de comportamiento.
3. **Asesor de decisiones concretas**, usando `decisionsEngine` + `timingEngine`: el usuario escribe una decisión real ("¿lanzo el proyecto esta semana?") y el producto cruza los 3 sistemas para dar una respuesta estructurada, no un semáforo genérico.
4. **Comparación compartible en tiempo real** (link A → completa B → resultado para ambos) para compatibilidad — mecanismo de crecimiento con fricción cero.
5. **Buscador de decisión por comparación múltiple**: elegir entre 2-5 opciones (países, marcas, nombres) y ver cuál resuena más con el perfil — convierte el catálogo de afinidad en herramienta de uso real.
6. **Notificación opcional ligada a eventos reales** (cambio de año personal, tránsito relevante, cumpleaños de "Año X"), no genérica — inspirado en el mecanismo de retención más efectivo de Co-Star, sin su opacidad.
7. **Traducción progresiva de jerga**: cada término técnico (Life Path, Personal Year) con tooltip inline + link directo a su entrada en Academy.

---

## 14. Nuevas herramientas

Construibles directamente sobre datos/engines que **ya existen**:

- **"¿A cuál me mudo?"** — comparador de países/ciudades por afinidad simbólica + datos objetivos, usando `symbolic-entities.ts` + `affinityEngine`.
- **"Elegí el nombre"** — para padres eligiendo nombre de bebé, cruzando numerología del nombre con perfil familiar (usa `numerologyEngine` ya existente, aplicado a un caso de uso nuevo de alto valor emocional y muy compartible).
- **"Compatibilidad de equipo/founders"** — versión B2B de `compatibilityEngine`, pensada para socios de negocio, no solo pareja.
- **"Calendario de buenos momentos"** — vista de calendario (no solo texto) generada por `timingEngine` + `yearCycleEngine`, exportable/sincronizable.
- **API pública de afinidad** — exponer `personalRecommendationEngine` como endpoint documentado (abierto, dado el espíritu open-source) para desarrolladores/marcas.

---

## 15. Ideas no obvias

- **"Modo escéptico" explícito**: un toggle que muestra, lado a lado, "lo que dice la tradición simbólica" vs. "lo que dice la evidencia" — nadie en la categoría se anima a esto, y encaja perfecto con el posicionamiento de transparencia de Molino. Sería un imán de prensa/contenido viral ("la app de astrología que admite que no es ciencia").
- **Contenido dinámico generado por combinación de perfil**, no solo por signo — hoy el texto es igual para todo "Caballo"; con los datos ya calculados (numerología + astrología + zodíaco combinados) se puede generar una interpretación única por combinación sin necesidad de IA generativa cara, solo lógica combinatoria (barato de mantener, alto en percepción de personalización).
- **"Mapa del mundo" como producto de marca/turismo**: activaciones con países/marcas reales ("Descubrí tu afinidad con [país] antes de viajar") — vía de distribución fuera del propio sitio.
- **Modo "año personal" como ritual anual compartible** (tipo Spotify Wrapped, pero para el año numerológico/zodiacal de cada persona) — hay motion/diseño premium ya construido (`premiumMotion.ts`) que podría reutilizarse para esto.
- **AEO estructurado**: FAQ schema + datos estructurados en cada página de entidad/glosario para maximizar citación en respuestas de IA (ChatGPT, Perplexity, Google AI Overviews) — bajo esfuerzo, alto retorno dado que el contenido ya es factual y verificable (a diferencia de la competencia).
- **Distribución vía comparación social**: convertir "compatibilidad entre dos perfiles" en el principal canal de adquisición orgánica, no en una feature secundaria.

---

## 16. AHA Moments

### Los 5 mejores momentos actuales

1. Reveal post-onboarding (animal + Life Path + elemento aparecen animados) — el único diseñado deliberadamente como sorpresa.
2. Ver la metodología detrás de un cálculo (fecha CNY real, fuente citada) — sorprende a quien esperaba un horóscopo genérico.
3. Encontrar que una marca conocida (Apple, Nike) tiene una fecha de fundación con animal zodiacal calculado y justificado.
4. El disclaimer de privacidad explícito ("tu fecha nunca sale de tu navegador") — genera confianza inmediata en un público desconfiado de apps de este rubro.
5. La consistencia visual del sistema de diseño (percepción de producto cuidado, no amateur, algo raro en la categoría).

### 10 AHA moments que deberíamos crear

| # | Qué ve/hace el usuario | Por qué sorprende | Valor que genera | Capability que lo permite |
|---|---|---|---|---|
| 1 | Pide ayuda para decidir algo real ("¿es buen momento para renunciar?") y recibe una respuesta estructurada cruzando los 3 sistemas | No es un horóscopo, es una herramienta que responde su pregunta específica | Utilidad práctica inmediata | `decisionsEngine` + `timingEngine` (ya existen) |
| 2 | Comparte un link, un amigo completa su fecha, ambos ven compatibilidad al instante sin registrarse ninguno | Cero fricción, resultado inmediato compartido | Viralidad orgánica | `compatibilityEngine` + link efímero |
| 3 | Ve el "Modo escéptico": tradición vs. evidencia, lado a lado | Ninguna app de la categoría se anima a esto | Confianza/credibilidad | Filosofía ya declarada, falta implementación |
| 4 | Vuelve un mes después y ve "esto cambió desde tu última visita" | Sensación de que el producto lo sigue en el tiempo | Retención | Historial + diffing simple sobre datos ya calculados |
| 5 | Compara 3 países para mudarse y recibe un ranking justificado con historia real de cada uno | Convierte curiosidad en decisión de vida | Utilidad de alto valor emocional | `affinityEngine` + `symbolic-entities.ts` |
| 6 | Recibe una notificación en el momento exacto de un tránsito relevante para su perfil (no genérica) | Se siente "elegido", no en una lista masiva | Retención diaria | `dailyEnergyEngine` + `yearCycleEngine` + push opt-in |
| 7 | Genera su "año personal" como resumen visual compartible tipo Wrapped | Producto de marca, orgullo de compartir | Viralidad + marca | `premiumMotion.ts` + `yearCycleEngine` |
| 8 | Busca un nombre para su bebé y ve numerología del nombre en tiempo real mientras escribe | Herramienta inesperada de alto valor emocional | Nuevo caso de uso, nueva audiencia | `numerologyEngine` reaplicado |
| 9 | Pregunta algo en lenguaje natural y el sistema responde citando qué motor/fuente usó | Se siente como un asistente, no un formulario | Percepción de inteligencia real | Requiere capa de orquestación sobre engines existentes |
| 10 | Ve su compatibilidad con una marca/país justo antes de una decisión de compra/viaje real (vía integración externa) | El producto aparece en el momento de decisión real, no aislado | Distribución + utilidad | API pública + partnerships |

---

## 17. Retention Opportunities

- Historial navegable (energía diaria, decisiones pasadas, cómo evolucionó el "año personal").
- Cuenta opcional para continuidad cross-device sin romper la promesa de privacidad (auth mínima, sin tracking de comportamiento).
- Notificaciones ligadas a eventos reales del perfil, no genéricas, con opt-in explícito.
- Contenido que cambia con el tiempo (no solo con el input del usuario): tránsitos, ciclos anuales, novedades de Academy.
- Journaling ligero conectado a la energía diaria (inspirado en CHANI, pero manteniendo la no-persistencia server-side si se quiere sostener el diferencial de privacidad — ej. journaling local-first, exportable).

---

## 18. Viral Opportunities

- Comparación de compatibilidad compartible con fricción cero (link → completa fecha → resultado para ambos).
- Resumen anual estilo "Wrapped" con diseño premium ya semi-construido.
- "Modo escéptico" como contenido de prensa/redes (ángulo contraintuitivo: una app de astrología que admite lo que no es ciencia).
- Cards de afinidad con marcas/países conocidas — alto potencial de compartir en redes por el factor curiosidad/humor ("mi afinidad con Nike es 72/100").
- Tool de nombre de bebé — naturalmente compartible entre futuros padres.

---

## 19. Monetization Opportunities

Lo premium debería vivir en **profundidad de herramienta de decisión**, no en cantidad de datos (evitar el error de "poner el gráfico gratis y cobrar por verlo completo", que es el patrón más resentido de la categoría):

- **Gratis (siempre):** perfil base, los 3 sistemas cruzados, energía diaria del presente, catálogo de afinidad básico, Academy completa (coherente con "conocimiento libre" declarado en la filosofía).
- **Premium — Asesor de decisiones:** preguntas ilimitadas al motor de `decisionsEngine`/`timingEngine`, calendario de buenos momentos exportable, comparación multi-opción (mudanza, nombres, decisiones de negocio).
- **Premium — Historial y memoria:** acceso a energía diaria pasada, evolución del perfil en el tiempo, insights mensuales.
- **Premium — Reportes compartibles de marca** (Wrapped anual en alta calidad, sin marca de agua) — monetiza el impulso viral sin bloquear la versión gratuita compartible básica.
- **B2B/API:** licenciamiento del motor de afinidad a marcas/medios como activaciones de marketing, ingreso no dependiente del usuario final.

Esto es coherente con la infraestructura de pago ya construida (MercadoPago) — falta exclusivamente el producto que la justifique.

---

## 20. Moat / Competitive Advantage

Mecanismos concretos, no genéricos:

1. **Base de datos propietaria de entidades verificadas** (fecha exacta + fuente + animal calculado con CNY real): cada entidad nueva agregada aumenta el valor del catálogo y es cara de replicar honestamente (requiere investigación real, no scraping). Esto compone con el tiempo.
2. **Corpus de contenido AEO-óptimo**: páginas factuales, citables, estructuradas — a medida que motores de IA aprenden a citar fuentes verificables en vez de contenido genérico de SEO farms, Molino puede volverse la fuente de referencia citada para español, algo que compone (más citas → más autoridad → más tráfico).
3. **Motor combinatorio de personalización determinística** (no LLM): la lógica de cruce entre los 3 sistemas ya construida es un activo de ingeniería específico y no trivial de replicar sin el mismo nivel de rigor metodológico.
4. **Confianza de marca vía transparencia verificable**: al ser open source, cualquiera puede auditar el cálculo — un competidor no puede clonar la *confianza* generada, aunque clone el código.
5. **Network effect vía comparación social**: si la feature de compatibilidad compartible se vuelve el canal principal de adquisición, cada usuario nuevo llega con contexto de otro usuario, generando un grafo de relaciones simbólicas propietario (quién comparó con quién, qué combinaciones son populares) — dato que ningún competidor tiene sobre el público hispanohablante.
6. **Posición de nicho defendible**: "el único con rigor + transparencia + diseño premium en español" es una posición que, sostenida en el tiempo (con contenido y producto consistentes), es cara de igualar para un competidor grande que ya construyó su marca sobre ambigüedad.

---

## 21. TOP 10 oportunidades

1. Reestructurar `/profile` en pantallas navegables (ya diseñado internamente, ejecutar).
2. Lanzar el "Asesor de decisiones" usando `decisionsEngine`/`timingEngine` como producto premium ancla.
3. Comparación compartible de compatibilidad con link, sin registro (motor de crecimiento).
4. Historial navegable de energía diaria (base mínima de retención).
5. Cuenta opcional para continuidad cross-device, sin romper la promesa de privacidad.
6. AEO: schema estructurado + FAQ en páginas de entidad/glosario.
7. Personalización real de traits (combinatoria, no hardcodeada por signo).
8. "Modo escéptico" (tradición vs. evidencia) como diferenciador de marca y gancho de prensa.
9. Herramienta "Elegí el nombre" para nuevo público (padres) — bajo esfuerzo, alta viralidad.
10. Definir y lanzar el primer producto premium conectado al backend de MercadoPago ya existente.

## TOP 5 quick wins (alto impacto / bajo-medio esfuerzo)

1. **Eliminar duplicación de CTAs y unificar vocabulario de acciones** en `/profile` — esfuerzo bajo, ya diagnosticado con el fix propuesto internamente.
2. **Traducir jerga técnica en el reveal de onboarding** (mostrar significado antes que el término) — esfuerzo bajo, impacto directo en el momento wow.
3. **Arreglar estados vacíos silenciosos** (energía diaria null, loading sin explicación) — esfuerzo bajo, evita fugas invisibles de usuarios.
4. **Agregar historial navegable básico de energía diaria** (aunque sea solo los últimos 7-30 días vía localStorage) — esfuerzo medio, primer ladrillo de retención real.
5. **Reestructurar navegación del header** (nombres claros en vez de categorías poéticas ambiguas) — esfuerzo bajo, impacto alto en descubrimiento.

---

## 22. Qué eliminar

- Duplicación de secciones equivalentes en `/profile` (3 de "identidad", 3 de "patrones", 4 de "recomendaciones") — consolidar, no borrar el contenido, sino la repetición de acceso.
- Traits genéricas hardcodeadas como si fueran personalización — o se personalizan de verdad (combinatoria) o se etiquetan honestamente como "rasgos generales del signo" para no prometer algo que no se cumple.
- Cualquier CTA que lleve a la misma pantalla con texto distinto — unificar a una sola etiqueta por acción.

## 23. Qué simplificar

- Navegación del header (categorías por nombre de función, no por metáfora poética).
- El hero de home (bajar el protagonismo del número del día frente al CTA principal).
- El flujo de onboarding (agregar progreso visual, sin agregar pasos).

## 24. Qué potenciar

- `decisionsEngine` y `timingEngine` — hoy son los activos más subutilizados y los de mayor potencial de monetización.
- El catálogo de afinidad (`symbolic-entities.ts`) — convertirlo en herramienta comparativa, no solo lista.
- La filosofía de transparencia — llevarla de `/filosofia` (página aislada) al corazón de cada resultado (mostrar la fuente/fórmula en línea, no en un anexo).
- El potencial viral de compatibilidad compartida — hoy existe la capability (`compatibilityEngine`) pero no el mecanismo de distribución (link sin registro).

---

## 25. Producto ideal

**Propuesta de valor:** "El único mapa simbólico que te dice de dónde sale cada número — y te ayuda a decidir con eso."

**Experiencia principal:** onboarding de una fecha → reveal traducido a lenguaje humano → un hub con 4 pantallas claras (Identidad / Mundo / Círculo / Decidir) en vez de 22 secciones → un asesor de decisiones como corazón funcional del producto, no un anexo.

**Navegación:** 4-5 ítems claros por función (Inicio, Mi Mapa, Decidir, Explorar, Academy) — sin metáforas ambiguas.

**Funcionalidades centrales:** los 3 sistemas cruzados (ya existe), asesor de decisiones/timing (ya existe el motor, falta ser el centro), comparación de afinidad multi-opción (mudanza, marcas, nombres), compatibilidad compartible sin fricción.

**Herramientas:** comparador de decisiones, calendario de buenos momentos, "elegí el nombre", API pública del motor de afinidad.

**Recurrencia:** historial navegable + notificaciones ligadas a eventos reales + ritual anual tipo Wrapped.

**Personalización:** combinatoria real (no strings por signo aislado) + memoria opcional cross-device.

**Monetización:** gratis todo lo educativo/base (coherente con la filosofía), premium en profundidad de decisión y memoria — ya con el backend de pago listo.

**Diferenciación:** transparencia radical demostrada en cada resultado (no solo declarada en una página aparte), rigor metodológico verificable, tono racional-escéptico en español que hoy no tiene competidor directo.

---

## 26. Nueva propuesta de valor

### "Hoy este producto es..."
Una calculadora simbólica muy completa y honesta, presentada como enciclopedia, sin un motivo claro de uso recurrente ni de pago.

### "Podría convertirse en..."
La herramienta de referencia en español para tomar decisiones personales combinando rigor simbólico con transparencia total — el "asesor racional de lo simbólico" que hoy no existe en ningún mercado.

### "La razón por la que alguien volvería todos los días sería..."
Porque el producto lo ayuda a decidir algo concreto hoy (timing, comparación, energía del día) y recuerda lo que decidió ayer — no porque le repite un horóscopo genérico.

### "La razón por la que alguien pagaría sería..."
Porque el asesor de decisiones y la memoria histórica del perfil le ahorran tiempo/incertidumbre en decisiones reales (mudanza, timing, nombres, relaciones) — no porque le ocultan un dato gratis detrás de un paywall.

### "El diferencial difícil de copiar sería..."
La combinación acumulativa de: base de entidades verificadas propia + corpus AEO-citable + motor combinatorio determinístico + confianza de marca basada en transparencia auditable en código abierto.

### "El feature que podría convertirse en viral sería..."
La comparación de compatibilidad compartible sin registro (link → completa fecha → resultado para ambos), potenciada por el resumen anual tipo Wrapped.

---

## 27. Roadmap recomendado

### NOW (impacto enorme / esfuerzo bajo)
- Unificar CTAs duplicados y vocabulario de acciones en `/profile`.
- Traducir jerga técnica del reveal (significado antes que término).
- Arreglar estados vacíos silenciosos (energía diaria, loading del perfil).
- Rediseñar navegación del header con nombres claros por función.
- Bajar protagonismo del número del día en el hero frente al CTA.

### NEXT (impacto alto / esfuerzo medio)
- Reestructurar `/profile` en 4 pantallas navegables (Identidad / Mundo / Círculo / Decidir).
- Historial navegable de energía diaria (últimos 7-30 días).
- Comparación de compatibilidad compartible sin registro.
- Personalización combinatoria real de traits (reemplazar strings hardcodeados).
- Definir y lanzar el primer producto premium sobre el backend de MercadoPago ya existente.

### LATER (apuestas grandes)
- Asesor de decisiones como producto premium ancla (`decisionsEngine` + `timingEngine` como corazón del producto).
- Cuenta opcional con continuidad cross-device sin romper privacidad radical.
- Ritual anual compartible tipo "Wrapped".
- API pública / licenciamiento B2B del motor de afinidad.

### EXPERIMENTAL (probar antes de construir completo)
- "Modo escéptico" (tradición vs. evidencia lado a lado) como pieza de contenido/prensa antes de integrarlo como feature permanente.
- Herramienta "Elegí el nombre" como experimento de nueva audiencia (padres).
- Notificaciones ligadas a eventos reales (probar con un subconjunto de usuarios opt-in antes de escalar).
- AEO estructurado en un subconjunto de páginas de entidad, midiendo impacto en citación/tráfico antes de aplicar a todo el catálogo.

---

*Documento de investigación y estrategia. No se realizaron cambios de código, refactors ni PRs como parte de esta auditoría.*
