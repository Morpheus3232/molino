# Metodología — cómo participa la astrología en la síntesis

Fecha: 2026-08-29. Auditoría epistémica de cada cruce cross-sistema que
involucra astrología, agregado en la Fase 2 (`lib/engines/synthesisEngine.ts`).

Para cada cruce se separa:
- **CÁLCULO** — lo determinista (qué produce un motor, sin ambigüedad).
- **FUENTE** — qué parte pertenece a la tradición simbólica (y cuál).
- **MARCO PROPIO DE MOLINO** — qué parte es una decisión interpretativa de
  Molino, no algo establecido afuera.
- **POR QUÉ existe la relación.**
- **¿Sobreafirmado?** — y qué se hizo al respecto.

Regla general aplicada tras esta auditoría: los `statement` de las
convergencias hablan en registro atribuido ("estas tradiciones lo leen
como…", "en la lectura numerológica…"), no en indicativo de hecho ("esto
es…"). Los `evidence` nombran explícitamente qué parte es agrupador de
Molino.

---

## 1. Astrología × Numerología — "ritmo" (tensión)

`buildTensions`, detector 1. Preexistía a la Fase 2.

- **Cálculo:** `getLifePathPace(lp)` agrupa Life Paths en rápido `[1,8,3,5]` /
  lento `[4,7]` / sin ritmo (resto). `ELEMENT_PACE` clasifica el elemento
  solar en rápido (Fuego), lento (Tierra) o fluido (Aire, Agua).
- **Fuente:** la cualidad "cardinal/de fuego = impulso", "tierra = cautela"
  es lectura elemental estándar de la astrología occidental. La velocidad de
  los números es lectura numerológica pitagórica común (1/8 acción, 4/7
  estructura).
- **Marco de Molino:** la **traducción de ambos a un eje común de
  "velocidad"** y la decisión de marcar tensión solo cuando discrepan y el
  elemento no es fluido. Molino no inventa las cualidades; inventa el puente.
- **Por qué:** número y elemento describen dominios distintos (qué trabajás /
  cómo procesás). Cuando su "velocidad" implícita no coincide, la persona
  siente un desfasaje real entre impulso y procesamiento.
- **¿Sobreafirmado?** No. La `implication` dice explícitamente "no significa
  que una señal esté equivocada". Devuelve `[]` si no hay choque.

## 2. Astrología × Numerología — "modo" (convergencia / diferencia / tensión)

`buildConvergences` C, `buildDifferences`, `buildTensions` detector 2. Nuevo.

- **Cálculo:** `getLifePathMode(lp)` → iniciar `[1,8]` / consolidar `[4,7,22]`
  / adaptar `[3,5,9]` / null (resto). `MODALITY_MODE` mapea Cardinal→iniciar,
  Fijo→consolidar, Mutable→adaptar.
- **Fuente:** las tres modalidades (Cardinal/Fijo/Mutable = iniciar/sostener/
  adaptar) son un pilar de la astrología occidental, no una invención. La
  agrupación de números por acción/estructura/expresión es numerología
  estándar — **es la misma que ya usa `getLifePathPace`**, solo re-expresada
  en el vocabulario de las modalidades para poder cruzarla.
- **Marco de Molino:** el mapeo número→"modo" en los mismos tres términos que
  la modalidad. NO es numerología nueva; es una re-etiqueta de una
  agrupación que el motor ya tenía. El `evidence` lo dice: `"agrupado como
  'consolidar', misma lógica acción/estructura/expresión que el resto del
  motor"`.
- **Por qué:** si el número y el temperamento "despliegan la energía" del
  mismo modo → refuerzo real (poco frecuente, vale nombrarlo). Si son el par
  opuesto (consolidar↔adaptar) → fricción real al cerrar cosas. Si son
  distintos sin ser opuestos → diferencia de dominio, no contradicción.
- **¿Sobreafirmado?** Se corrigió. "Es una de las pocas cosas de tu mapa
  donde no hay que negociar" → "En este punto el número y el temperamento no
  se contradicen — no todo el mapa funciona así." Solo marca tensión en los
  dos pares realmente opuestos, nunca cuando uno es "iniciar".

## 3. Astrología × Zodíaco Chino — "elemento" (convergencia)

`buildConvergences` D. Nuevo.

- **Cálculo:** elemento solar occidental `===` elemento del tronco del año
  chino, **restringido a `{Fuego, Tierra, Agua}`** (`SHARED_ELEMENTS`).
- **Fuente:** Fuego, Tierra y Agua existen con el mismo nombre y una cualidad
  compatible en los dos marcos (4 elementos griegos vs. 5 Wu Xing). Es una
  correspondencia que se usa habitualmente al comparar ambos sistemas.
- **Marco de Molino:** la **decisión de NO afirmar nada** para Aire
  (occidental) y Metal/Madera (chino), que no tienen equivalente limpio.
  Preferimos decir menos.
- **Por qué:** dos sistemas que cuentan los elementos distinto, calculados
  desde datos distintos (mes/día vs. año), coinciden en asignar el mismo →
  señal de que esa cualidad está doblemente presente en la lectura.
- **¿Sobreafirmado?** Se corrigió. "está en vos por partida doble" → "Dos
  lecturas independientes coinciden en {x}; qué tan literal tomarlo lo matiza
  el resto del mapa." El `evidence` acota: "solo se afirma en Fuego/Tierra/
  Agua, los nombres que ambos marcos comparten".

## 4. Astrología × Zodíaco Chino — "temperatura" (tensión)

`buildTensions` detector 3. Nuevo.

- **Cálculo:** `(elemento solar Fuego && elemento chino Agua)` o inverso.
  Único par tratado.
- **Fuente:** Fuego y Agua como fuerzas opuestas (una calienta/expande, la
  otra enfría/contrae) es lectura compartida por ambas tradiciones — no es un
  antagonismo inventado.
- **Marco de Molino:** limitar la tensión a ese único par inequívoco, y la
  lectura de "reacción inmediata (Fuego) vs. procesamiento de fondo (Agua)".
- **Por qué:** si tu elemento de reacción rápida y tu elemento de fondo
  tienen temperaturas opuestas, ni el primer impulso ni la primera cautela
  son la lectura completa.
- **¿Sobreafirmado?** No. La `implication` dice "No es un defecto" y
  encuadra el uso ("no confiar del todo en el primer impulso ni en la primera
  cautela").

## 5. Tres sistemas — "un tema" (convergencia)

`buildConvergences` E. Nuevo. El cruce más exigente.

- **Cálculo:** rasgos del arquetipo ∩ rasgos del animal ∩ rasgos del signo
  solar, los tres pasados por `findSharedTheme` y cayendo en el **mismo
  bucket** de `THEME_BUCKETS` (6 temas: liderazgo, vínculo, creatividad,
  introspección, estructura, libertad).
- **Fuente:** los rasgos por signo (`SUN_SIGN_TRAITS`), por animal
  (`getChineseTraits`) y por arquetipo (`ARCHETYPES.keywords`) son keywords
  de manual de cada tradición.
- **Marco de Molino:** **el diccionario de 6 buckets y el algoritmo de
  matching de primera palabra son 100% de Molino.** El `evidence` ahora lo
  dice literalmente: "un agrupador temático propio de Molino, no de las
  tradiciones."
- **Por qué:** que tres marcos independientes describan a alguien con
  palabras que caen en el mismo tema es infrecuente (por construcción del
  diccionario) y vale señalarlo.
- **¿Sobreafirmado?** Se corrigió dos veces. Primero la sobreafirmación
  behavioral ("el rasgo más difícil de disimular y el más caro de reprimir" →
  "estas tradiciones lo leen como un rasgo central, de los que cuesta
  mantener a raya"). Después el leak de código ("ver THEME_BUCKETS" →
  descripción en prosa).

---

## Resumen

| Cruce | Deterministic | Tradición | Marco de Molino |
|---|---|---|---|
| 1. Ritmo (tensión) | agrupación LP + clasificación elemento | cualidad elemental / velocidad de números | el puente "velocidad" común |
| 2. Modo (converg/dif/tensión) | agrupación LP + mapeo modalidad | modalidades occidentales / agrupación numerológica | re-etiqueta de una agrupación existente |
| 3. Elemento (converg) | igualdad de nombre en {Fuego,Tierra,Agua} | correspondencia clásica entre marcos | el recorte a 3 nombres, el silencio en Aire/Metal/Madera |
| 4. Temperatura (tensión) | Fuego solar vs Agua china | Fuego/Agua opuestos en ambas | el recorte a ese único par + la lectura "reacción/fondo" |
| 5. Tres temas (converg) | intersección de keywords vía buckets | keywords por signo/animal/arquetipo | **todo el diccionario de buckets y el matching** |

Ningún cruce presenta un marco propio de Molino como establecido afuera —
tras esta auditoría, cada uno lo declara en su `evidence` o `statement`.
Ninguno se quitó: todos apoyan síntesis real, no correlación de relleno.
