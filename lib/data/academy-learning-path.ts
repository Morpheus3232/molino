/**
 * Academy Learning Path — contenido educativo de /academy.
 *
 * Historias, datos, tradiciones y lecturas de Molino organizadas
 * en un camino de aprendizaje (Level 00 → Level 05).
 *
 * No se generan con IA ni dependen del perfil.
 * Cada sección tiene un nivel pedagógico, un título, datos del sistema
 * y una lectura de Molino.
 */

export type Level = 0 | 1 | 2 | 3 | 4 | 5;

export const LEVEL_LABELS: Record<Level, string> = {
  0: "Antes de empezar",
  1: "Los tres sistemas",
  2: "Aprender los fundamentos",
  3: "Cuando los sistemas se encuentran",
  4: "Cómo trabaja Molino",
  5: "Aplicalo en tu mapa",
};

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  0: "Qué son los sistemas simbólicos, qué pueden hacer y qué no pueden establecer.",
  1: "Numerología, astrología occidental y zodíaco chino: tres lenguajes para leer el mismo momento.",
  2: "Conceptos clave de cada sistema, con ejemplos concretos que se pueden verificar.",
  3: "Convergencia, diferencia y tensión: cómo se relacionan los sistemas entre sí.",
  4: "Cálculo, fuente, interpretación, inferencia e incertidumbre: cómo separar cada capa.",
  5: "Crear tu mapa y empezar a leerlo.",
};

export interface LearningPathSection {
  slug: string;
  level: Level;
  order: number;
  title: string;
  subtitle: string;
  /** Resumen que aparece en la tarjeta del nivel. */
  summary: string;
  /** Contenido de la sección (párrafos). */
  content: string[];
  /** Si la sección enlaza a /conocimiento/* en vez de tener cuerpo propio. */
  linkTo?: string;
  /** Si la sección enlaza a una guía de academy-guides.ts. */
  linkGuide?: string;
  /** Si la sección enlaza a /profile o /hoy etc. */
  linkProduct?: string;
  linkProductLabel?: string;
}

/**
 * "Tres sistemas, tres lenguajes, una lectura."
 * Sección central del aprendizaje: qué aporta cada sistema,
 * por qué no se concatenan, y qué es convergencia, diferencia y tensión.
 */
export const THREE_SYSTEMS_SECTIONS: LearningPathSection[] = [
  {
    slug: "tres-sistemas-un-lectura",
    level: 1,
    order: 1,
    title: "Tres sistemas, tres lenguajes, una lectura",
    subtitle: "Qué aporta cada tradición y por qué Molino no las suma sin más.",
    summary:
      "La numerología lee el número, la astrología lee el cielo, el zodíaco chino lee el año. Juntos, describen la misma persona desde ángulos que no se pueden reducir a una sola fórmula.",
    content: [
      "Cada uno de los tres sistemas que usa Molino viene de una tradición con su propia lógica, su propio vocabulario y su propia idea de qué significa \"lecturar\" a alguien. No son tres versiones de la misma respuesta: son tres formas distintas de preguntar lo mismo.",
      "La numerología parte de un número. Tu fecha de nacimiento se reduce a dígitos y, a partir de ahí, obtienes tu Camino de Vida, tu número de expresión, tu número de personalidad y el número de tu día. Ese número no describe tu horóscopo: describe un patrón que la tradición asoció a una energía particular. Cuando Molino te muestra tu Camino de Vida, está mostrando el resultado de ese cálculo, no un veredicto.",
      "La astrología occidental parte de la posición del cielo en el momento exacto de tu nacimiento. De ahí saca tu signo solar, tu elemento (Fuego, Tierra, Aire o Agua) y tu modalidad (Cardinal, Fijo o Mutable). Cada uno de esos rasgos viene de un marco que lleva siglos de desarrollo: los cuatro elementos, las tres modalidades y los doce signos forman un sistema coherente que la astrología tradicional usa para describir temperamentos y ritmos.",
      "El zodíaco chino parte de tu año de nacimiento, no de tu fecha exacta. Tu animal se determina por el año, y con él llega un elemento del tronco celeste (Madera, Fuego, Tierra, Metal o Agua) y una posición en el ciclo sexagenario. La tradición china lee al animal como un patrón de carácter y el elemento como una cualidad de fondo.",
      "¿Por qué Molino no las mezcla en un solo número? Porque cada sistema cuenta una parte distinta. Un número de vida, un elemento solar y un animal chino pueden coincidir en un tema, pero también pueden tirar para lados diferentes. Ese desacuerdo no es un error del mapa: es información.",
      "Una convergencia ocurre cuando dos o tres sistemas señalan el mismo punto —el mismo tema, el mismo modo, la misma temperatura— desde cálculos independientes. Una diferencia ocurre cuando dos sistemas describen dominios distintos con lógicas distintas, sin contradecirse. Una tensión ocurre cuando dos señales independientes tiran en direcciones opuestas.",
      "Lo que Molino no hace es declarar ganador. No dice \"tu numerología dice X y la astrología dice Y, así que X gana\". Presenta los tres ángulos y deja que los leas juntos.",
    ],
  },
  {
    slug: "numerologia-ensena",
    level: 2,
    order: 2,
    title: "Numerología: el lenguaje de los números",
    subtitle: "Qué calcula, qué significa y cómo se lee.",
    summary:
      "Desde Pitágoras hasta tu Camino de Vida: la tradición que asigna significado simbólico a los números y cómo Molino la usa.",
    content: [
      "La numerología pitagórica asocia cada letra del alfabeto a un número del 1 al 9. Tu nombre se reduce a dígitos y de ahí salen tus números principales. El Camino de Vida, el más conocido, se calcula sumando todos los dígitos de tu fecha de nacimiento hasta obtener un solo dígito (o un número maestro: 11, 22 o 33).",
      "Ejemplo: si naciste el 15 de agosto de 1990, el cálculo es 1+5+0+8+1+9+9+0 = 33. Como 33 es un número maestro, no se reduce a 6. Ese es tu Camino de Vida.",
      "El número de expresión sale de las letras de tu nombre completo. El número de personalidad es el número del día de nacimiento (el número que cae en tu cumpleaños). Cada uno tiene un significado tradicional: el Camino de Vida describe el camino, la expresión describe cómo te expresás, la personalidad describe cómo te perciben.",
      "La numerología no predice: describe un patrón. Molino la usa como una lente de autoconocimiento, no como una métrica objetiva. Los números que aparecen en tu mapa son el resultado de cálculos deterministas y reproducibles, pero su interpretación pertenece al campo simbólico.",
    ],
    linkGuide: "como-funciona-tu-mapa",
  },
  {
    slug: "astrologia-ensena",
    level: 2,
    order: 3,
    title: "Astrología occidental: el cielo de tu nacimiento",
    subtitle: "Signo, elemento y modalidad: qué significan.",
    summary:
      "De los signos zodiacales a los cuatro elementos: la lectura tradicional que Molino integra en tu perfil.",
    content: [
      "La astrología occidental divide el cielo en doce sectores de 30 grados cada uno, llamados signos zodiacales. Tu signo solar es el que el Sol ocupaba en el momento exacto de tu nacimiento. Cada signo pertenece a un elemento —Fuego, Tierra, Aire o Agua— y a una modalidad —Cardinal, Fijo o Mutable—.",
      "Los cuatro elementos describen una cualidad básica de la energía: Fuego impulsa y calienta, Tierra estabiliza y materializa, Aire conecta e intelectualiza, Agua siente y procesa. Las tres modalidades describen cómo se manifiesta esa energía: Cardinal inicia, Fijo sostiene, Mutable adapta.",
      "Cuando Molino muestra tu signo solar, tu elemento y tu modalidad, está presentando tres capas de la misma lectura astrológica. No son tres datos sueltos: describen qué empuja, cómo sostiene y cómo cambia tu energía.",
      "Es importante recordar que la astrología no es astronomía. La astronomía estudia los cuerpos celestes con el método científico; la astrología usa las mismas posiciones como símbolos. Molino la trata como lo que es: un sistema interpretativo, no una ciencia.",
    ],
    linkTo: "/conocimiento/astrologia",
  },
  {
    slug: "zodiaco-chino-ensena",
    level: 2,
    order: 4,
    title: "Zodíaco chino: animales, elementos y ciclos",
    subtitle: "El animal, el elemento del tronco y el ciclo de 60 años.",
    summary:
      "Cómo se determina tu animal, qué significan los elementos y por qué el Año Nuevo chino no cae el 1 de enero.",
    content: [
      "El zodíaco chino organiza los años en un ciclo de doce animales: Rata, Buey, Tigre, Gato (o Conejo), Dragón, Serpiente, Caballo, Cabra, Mono, Gallo, Perro y Cerdo. Tu animal se determina por tu año de nacimiento, según el calendario lunar chino.",
      "Cada animal se asocia a un elemento del tronco celeste: Madera, Fuego, Tierra, Metal o Agua, en una combinación Yin o Yang. Eso crea un ciclo de 60 combinaciones únicas (12 animales × 5 elementos × 2 polaridades). No hay dos años iguales en ese ciclo.",
      "A diferencia del signo solar occidental, que depende de la fecha exacta, el animal chino depende del año. Y como el Año Nuevo chino cambia cada año —entre finales de enero y mediados de febrero— alguien nacido el 20 de enero puede pertenecer al animal del año anterior, aunque el calendario gregoriano ya haya cambiado de año.",
      "Cuando Molino solo tiene el año de una entidad (sin fecha exacta), no puede aplicar el límite del Año Nuevo chino con precisión. En ese caso usa una fecha de referencia dentro del año, después del Año Nuevo chino, y lo marca como aproximado. Nunca presenta una fecha estimada como si fuera exacta.",
    ],
    linkTo: "/conocimiento/zodiaco-chino",
  },
  {
    slug: "convergencia-diferencia-tension",
    level: 3,
    order: 5,
    title: "Convergencia, diferencia y tensión",
    subtitle: "Qué pasa cuando los tres sistemas se cruzan.",
    summary:
      "Cómo Molino detecta cuando los sistemas coinciden, discrepan o tiran en direcciones opuestas.",
    content: [
      "Cuando dos o más sistemas independientes señalan el mismo punto —el mismo tema, el mismo modo de desplegar la energía, la misma temperatura— eso es una convergencia. No es casualidad: los sistemas se calculan por caminos distintos (un número de fecha de nacimiento, un elemento del cielo, un animal del año), así que cuando coinciden, la tradición lo lee como un rasgo marcado.",
      "Ejemplo: si tu Life Path y tu Año Personal caen en el mismo número, numerología y ciclos convergen. Si tu elemento solar occidental y el elemento de tu año chino son el mismo —y el nombre coincide literalmente— astrología y zodíaco chino convergen. Si tu arquetipo y los rasgos de tu animal chino comparten un tema, las tradiciones coinciden en algo.",
      "Una diferencia es cuando dos sistemas describen dominios distintos con lógicas distintas, sin contradecirse. Tu Life Path puede pedir consolidar y tu modalidad solar pedir adaptar: no son lo mismo, pero tampoco chocan. Son formas distintas de leer lo mismo.",
      "Una tensión es cuando dos señales independientes tiran en direcciones opuestas. El ritmo de tu Life Path puede ser distinto al ritmo de tu elemento solar; tu modo puede ser opuesto al de tu modalidad; tu elemento solar puede ser Fuego mientras que el chino es Agua. La tensión no es un error: es un desfasaje que da información.",
      "Molino no fuerza convergencias. Si dos sistemas no coinciden en un tema real, no se etiquetan como convergencia. Si un Life Path no tiene un modo propio, no se le inventa uno para cruzarlo con la astrología. Preferimos decir menos que inventar un mapa entre sistemas que cuentan las cosas distinto.",
    ],
  },
  {
    slug: "elementos-entre-sistemas",
    level: 3,
    order: 6,
    title: "Elementos: por qué no todo se conecta",
    subtitle: "El ejemplo de por qué Molino solo cruza donde la correspondencia es limpia.",
    summary:
      "Fuego, Tierra, Agua: los nombres que ambos sistemas comparten. Aire y Metal: los que no.",
    content: [
      "La astrología occidental tiene cuatro elementos: Fuego, Tierra, Aire y Agua. El zodíaco chino tiene cinco: Madera, Fuego, Tierra, Metal y Agua. A primera vista, parece que hay un elemento en común entre cada par. Pero no todos los elementos se pueden cruzar con el mismo criterio.",
      "Fuego es Fuego en ambos sistemas: calienta, impulsa, sale hacia afuera. Tierra es Tierra en ambos: estabiliza, contiene, sostiene. Agua es Agua en ambos: fluye, se retrae, procesa por dentro. Esos tres nombres existen literalmente en las dos tradiciones con la misma cualidad. Aire no existe en el chino, y Metal y Madera no existen en el occidental como equivalentes limpios.",
      "Por eso Molino solo afirma correspondencias elementales donde el nombre coincide literalmente y el sentido tradicional es el mismo: Fuego, Tierra y Agua. Donde no hay un equivalente limpio —como Aire, que en occidental es intelecto y movimiento, sin contrapartida directa en el marco chino— no se fuerza una conexión. Y donde hay una tensión clara entre sistemas —como Fuego chino versus Agua occidental, que en ambas tradiciones son fuerzas opuestas— se puede señalar una tensión.",
      "Este es un ejemplo de la disciplina metodológica de Molino: preferimos decir menos que inventar un mapa entre sistemas que cuentan las cosas distinto. Si no hay una correspondencia limpia, no la creamos.",
    ],
  },
  {
    slug: "como-cuestionar-el-sistema",
    level: 4,
    order: 7,
    title: "Cómo cuestionar el sistema",
    subtitle: "Cálculo, fuente, interpretación, inferencia e incertidumbre: cómo separar cada capa.",
    summary:
      "Aprendé a distinguir lo que el sistema calcula de lo que interpreta, y qué no puede establecer.",
    content: [
      "Cada vez que ves algo en tu mapa, podés preguntarte: ¿esto es un cálculo, una fuente, una interpretación, una inferencia o una incertidumbre? La respuesta importa porque cada capa tiene un tipo de certeza distinto.",
      "Un cálculo es algo que el motor produce de manera determinista a partir de tus datos. Tu Camino de Vida, tu elemento solar, tu animal chino, tu año personal: todos salen de un cálculo matemático. Si ponés tu fecha de nacimiento dos veces, vas a obtener el mismo resultado. Esa es la capa más firme.",
      "Una fuente es de dónde viene el concepto en la tradición. Los cuatro elementos vienen de la astrología griega; los doce animales vienen del calendario chino; los nueve niveles numerológicos vienen de la tradición pitagórica. La fuente no dice que sea cierta —dice que existe una tradición que lo usó.",
      "Una interpretación es qué propone el marco simbólico. \"El fuego calienta e impulsa\" es una interpretación tradicional; \"tu número 5 es versatilidad\" es una interpretación. Pertenecen al campo simbólico, no a la ciencia.",
      "Una inferencia es lo que surge de combinar varios elementos. Cuando tu Life Path y tu Año Personal coinciden, la inferencia es que tu recorrido y el clima del año caen en el mismo número. Es un cruce derivado, no un cálculo crudo.",
      "Una incertidumbre es lo que no se puede establecer con precisión. Si no diste tu hora de nacimiento, el signo lunar es una estimación. Si no diste tu nombre, el número de expresión no se calcula. Si no hay fecha exacta de fundación de una entidad, su animal es aproximado. Molino te dice qué es incierto en vez de presentar una aproximación como dato duro.",
      "Un ejemplo concreto: tu mapa puede decir \"tu elemento es Fuego\" (cálculo) y \"el Fuego impulsa y calienta\" (fuente e interpretación). Si además tu año chino es Agua, puede señalar una tensión: \"tu elemento solar es Fuego y el chino es Agua: dos fuerzas que en ambas tradiciones se leen como opuestas\" (inferencia). Y si no tenés hora de nacimiento, puede decir \"tu signo lunar es aproximado\" (incertidumbre). Cada capa tiene su propio nivel de certeza, y Molino las separa para que no las confundas.",
    ],
  },
  {
    slug: "que-molino-no-afirma",
    level: 4,
    order: 8,
    title: "Qué no afirma Molino",
    subtitle: "Los límites claros del sistema.",
    summary:
      "Qué no es la numerología, la astrología ni el zodíaco chino según Molino.",
    content: [
      "Ningún sistema que usa Molino establece hechos científicos. La numerología no demuestra que los números determinen tu personalidad. La astrología no predice lo que va a pasar. El zodíaco chino no diagnostica tu carácter.",
      "Todos son marcos simbólicos con tradiciones de miles de años. Molino los usa como herramientas de reflexión y autoconocimiento, no como verdades absolutas.",
      "Una afinidad no significa que una marca o un país sean \"buenos\" o \"malos\" para vos. Es una lectura simbólica entre tu animal y el de la entidad, basada en una relación documentada de la tradición.",
      "Una convergencia no prueba nada: señala que dos o más sistemas independientes están hablando del mismo punto. Una tensión no es un problema: describe un desfasaje entre señales que, juntas, dan una lectura más completa.",
      "Molino no reemplaza el consejo profesional. Si estás pasando por un momento difícil, buscá a un profesional calificado. El mapa es un punto de partida para decidir, no un mandato para cumplir.",
    ],
    linkProduct: "/profile",
    linkProductLabel: "Ver mi mapa",
  },
  {
    slug: "historia-del-camino",
    level: 0,
    order: 9,
    title: "Una historia larga, contada con cuidado",
    subtitle: "Del tiempo mesopotámico al mapa moderno, sin inventar precisiones.",
    summary:
      "Las tradiciones que cruzan Molino tienen miles de años. Acá están, con sus períodos, escuelas y fuentes.",
    content: [
      "Las raíces de lo que hoy llama \"astrología\" y \"numerología\" se pierden en la antigüedad. Los sacerdotes de Babilonia —en la actual Irak— registraron durante siglos el movimiento del Sol, la Luna y los planetas visibles. Esa observación sistemática no era solo astronomía: cada ciclo celeste se leía como un ritmo repetible con sentido para la vida en la Tierra.",
      "De esa herencia babilónica pasó a la astrología helenística, que fusionó la observación con la filosofía griega. Los signos, las casas y los aspectos se codificaron en ese cruce, que es la base del zodiaco occidental que Molino usa hoy.",
      "En la tradición china, el calendario sexagenario ya organizaba el tiempo en ciclos de animales y elementos con más de dos mil años de antigüedad. La data más antigua que se conoce proviene de tablillas de huesos oraculares de la dinastía Shang, donde ya aparecían los doce animales asociados a meses.",
      "La numerología occidental tiene su raíz en Pitágoras (c. 570–495 a.C.), aunque los historiadores modernos distinguen entre el pitagorismo histórico —una escuela filosófico-matemática— y la numerología esotérica moderna, que se desarrolló siglos después. La tabla de correspondencia entre letras y números que se usa hoy fue codificada en el siglo XIX.",
      "La tradición no es una línea recta: es un río con aportes de muchas orillas. Babilonia, Grecia, Israel, China, Europa medieval, el Renacimiento, el siglo XX —cada época le agregó algo. Molino bebe de todas esas orillas y las presenta sin pretender que alguna sea la única verdad.",
      "Cuando una fecha es aproximada, Molino lo dice. Cuando un reclamo histórico es debatido, lo señala. Nunca inventa una precisión que no tiene fuente.",
    ],
  },
];

/**
 * Niveles 0 y 5 que son páginas de navegación, no contenido propio.
 */
export const LEVEL_NAVIGATION_SECTIONS: LearningPathSection[] = [
  {
    slug: "academia-nivel-0",
    level: 0,
    order: 0,
    title: "Antes de empezar",
    subtitle: "Qué son los sistemas simbólicos y qué pueden (y no pueden) establecer.",
    summary: "Una introducción al pensamiento que hay detrás de cada sistema que usa Molino.",
    content: [
      "Los sistemas simbólicos son marcos culturales que usan patrones —números, posiciones celestiales, ciclos de animales— para dar sentido a la experiencia humana. No miden como una balanza: interpretan como un lenguaje.",
      "La diferencia entre un sistema simbólico y una ciencia es esta: la ciencia busca medir, predecir y falsificar. Un sistema simbólico busca ofrecer una lectura, una perspectiva, una forma de preguntarse por uno mismo. Ambos tienen valor, pero no son lo mismo.",
      "Molino no mezcla las tradiciones como si fueran la misma cosa. Las presenta por separado, las cruza cuando hay motivo, y siempre señala qué es cálculo, qué es interpretación y qué es incertidumbre.",
    ],
    linkTo: "/conocimiento/numerologia",
  },
  {
    slug: "academia-nivel-5",
    level: 5,
    order: 10,
    title: "Aplicalo en tu mapa",
    subtitle: "Creá tu mapa y empezá a leerlo.",
    summary: "Tu perfil, calculado en tu navegador, sin registro ni guardado de datos.",
    content: [
      "Después de conocer los sistemas y sus cruces, el paso natural es crear tu propio mapa. Molino calcula tu perfil a partir de tu fecha de nacimiento (y tu nombre, si lo diste) —todo ocurre en tu navegador, sin servidor, sin base de datos, sin registro.",
      "Tu mapa tiene varias superficies: Mi Mapa (tu identidad base), Hoy (tu momento actual), Afinidades (tu relación con entidades del mundo), Journal (tu espacio para registrar), Año y Mes (tus ciclos temporales). Cada superficie responde una pregunta distinta.",
      "Si querés explorar antes de crear el mapa, la biblioteca y los conocimientos te esperan.",
    ],
    linkProduct: "/profile",
    linkProductLabel: "Creá tu mapa",
  },
];

/** Unión de todas las secciones del camino de aprendizaje, ordenadas. */
export function getLearningPathSections(): LearningPathSection[] {
  return [...LEVEL_NAVIGATION_SECTIONS, ...THREE_SYSTEMS_SECTIONS].sort(
    (a, b) => a.order - b.order,
  );
}

/** Secciones agrupadas por nivel. */
export function getSectionsByLevel(): Map<Level, LearningPathSection[]> {
  const map = new Map<Level, LearningPathSection[]>();
  for (const section of getLearningPathSections()) {
    const list = map.get(section.level) ?? [];
    list.push(section);
    map.set(section.level, list);
  }
  return map;
}

/** Obtener una sección por slug. */
export function getLearningPathSectionBySlug(
  slug: string,
): LearningPathSection | undefined {
  return getLearningPathSections().find((s) => s.slug === slug);
}