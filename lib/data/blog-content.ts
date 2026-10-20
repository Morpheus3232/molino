import { NUMBERS } from "@/lib/data/numerologia-content";
import { CHINESE_NEW_YEAR_DATES, getChineseZodiac } from "@/lib/data/chinese-new-year";
import { ANIMALS, ANIMAL_PROFILES, SAN_HE_TRIADS, getClashPartner } from "@/lib/data/animalRelations";

export type BlogCategory =
  | "Numerología"
  | "Astrología"
  | "Zodiaco Chino"
  | "Autoconocimiento";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Numerología",
  "Astrología",
  "Zodiaco Chino",
  "Autoconocimiento",
];

export interface BlogSection {
  id: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: BlogCategory;
  date: string;
  updatedAt?: string;
  image: string;
  author: string;
  intro: string[];
  sections: BlogSection[];
  faq?: { q: string; a: string }[];
  related: string[];
  featureLink?: { href: string; label: string }; // Internal link to a Molino feature
}

// Elemento del año chino por su último dígito (0-1 Metal … 8-9 Tierra).
const YEAR_ELEMENT = ["Metal", "Metal", "Agua", "Agua", "Madera", "Madera", "Fuego", "Fuego", "Tierra", "Tierra"];

/** "1990: 27 de enero — Caballo de Metal", desde la misma tabla que usa el motor. */
function lunarNewYearLine(year: number): string {
  const date = CHINESE_NEW_YEAR_DATES[year];
  const month = date.slice(5, 7) === "01" ? "enero" : "febrero";
  return `${year}: ${Number(date.slice(8))} de ${month} — ${getChineseZodiac(date)} de ${YEAR_ELEMENT[year % 10]}.`;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "numerologia-numero-de-vida",
    title: "Número de Vida: qué es, cómo se calcula y qué significa",
    excerpt:
      "El Número de Vida (o Camino de Vida) se calcula con tu fecha de nacimiento y revela la dirección central de tu personalidad. Aprendé a calcularlo y a leerlo.",
    metaDescription:
      "Es tu fecha de nacimiento reducida a una cifra: del 1 al 9, o 11, 22 y 33. Cómo calcularlo paso a paso con un ejemplo y qué significa cada Número de Vida.",
    category: "Numerología",
    date: "2026-08-13",
    updatedAt: "2026-10-19",
    image: "/blog/numerologia-numero-de-vida.svg",
    author: "Equipo Molino",
    intro: [
      "En numerología, tu Número de Vida —también llamado Camino de Vida o Life Path— es el dato más importante de tu mapa. Se deriva únicamente de tu fecha de nacimiento y describe la dirección general que tiende a tomar tu vida: tus dones, tus desafíos y el tipo de experiencias que vas a buscar una y otra vez.",
      "A diferencia de los números que salen de tu nombre (Expresión) o de tu día de nacimiento (Personalidad), el Número de Vida no cambia y no depende de cómo te llamen. Es tu punto de partida. Por eso casi toda la numerología moderna —desde las escuelas pitagóricas hasta las aplicaciones actuales— empieza por acá.",
    ],
    sections: [
      {
        id: "que-es",
        heading: "Qué es el Número de Vida",
        paragraphs: [
          "El Número de Vida reduce tu fecha de nacimiento completa a una sola cifra del 1 al 9 (o a uno de los números maestros 11, 22 y 33). Cada cifra representa una energía o un arquetipo distinto: un conjunto de fortalezas, de puntos ciegos y de lecciones recurrentes.",
          "Es importante entender qué es y qué no es. No es una sentencia ni una profecía: es una tendencia. La numerología lo describe como la 'ruta principal' de tu vida, la que vas a transitar por carácter incluso si no la elegís conscientemente. Saberla no te encasilla; te da un vocabulario para observar tus propios patrones.",
        ],
      },
      {
        id: "como-calcularlo",
        heading: "Cómo calcular tu Número de Vida",
        paragraphs: [
          "El cálculo es simple y se hace en dos pasos. Sumás todos los dígitos de tu fecha de nacimiento y después reducís el resultado a una sola cifra, sumando los dígitos del total hasta obtener un número entre 1 y 9.",
          "Tomemos como ejemplo la fecha 15 de agosto de 1990. Se suma dígito por dígito: 1 + 5 + 8 + 1 + 9 + 9 + 0 = 33. Como 33 es un número maestro, no se reduce: tu Número de Vida sería 33. Si en cambio el total fuera 28, se reduce: 2 + 8 = 10, y luego 1 + 0 = 1, dando un Número de Vida 1.",
        ],
        list: [
          "Sumá todos los dígitos de tu fecha completa (día, mes y año).",
          "Si el resultado es 11, 22 o 33, se deja como número maestro.",
          "Si no, reducí sumando los dígitos del total hasta obtener 1–9.",
        ],
      },
      {
        id: "significado",
        heading: "Qué revela cada número",
        paragraphs: [
          "Cada cifra tiene un matiz distinto. El 1 habla de liderazgo, independencia y de empezar cosas nuevas. El 2, de cooperación, sensibilidad y de construir puentes. El 3, de expresión, creatividad y comunicación. El 4, de orden, trabajo y estabilidad. El 5, de libertad, cambio y movimiento.",
          "El 6 es el número de la responsabilidad, el cuidado y el hogar. El 7, el del análisis, la introspección y la búsqueda de conocimiento. El 8, el del poder, la ambición y la materialidad. El 9, el del cierre, la compasión y el servicio. Los números maestros 11, 22 y 33 intensifican esas energías: intuición, construcción y enseñanza a gran escala.",
          "Ninguno es 'mejor' que otro. La numerología lee el mapa completo: tu Número de Vida es una nota base, y el resto de tu fecha y tu nombre le agregan armonía y tensión. Por eso dos personas con el mismo Número de Vida pueden vivir vidas muy distintas.",
        ],
      },
      {
        id: "cada-numero",
        heading: "Significado de cada Número de Vida, del 1 al 33",
        paragraphs: [
          "El arquetipo y las tres palabras clave que la tradición le asigna a cada número. Cada uno tiene su página con el detalle completo en la sección de Numerología.",
        ],
        list: NUMBERS.map(
          (n) => `${n.number} — ${n.title}: ${n.keywords.join(", ").toLowerCase()}.`,
        ),
      },
      {
        id: "aplicarlo",
        heading: "Cómo aplicarlo a tu vida",
        paragraphs: [
          "Conocer tu Número de Vida es útil como espejo, no como guión. Si tenés un 7 y siempre te sentiste atraído por la soledad y el estudio, verlo por escrito puede validar una parte tuya que no siempre sabías nombrar. Si tenés un 5 y te cuesta comprometerte, entender la energía de la libertad te ayuda a negociar con ella en vez de pelearle.",
          "Lo ideal es combinarlo con las otras capas de tu mapa: el año personal (que cambia cada año) y los números de tu nombre. Ese cruce es exactamente lo que hace un mapa personal completo, donde el Número de Vida es solo la primera pieza del rompecabezas.",
        ],
      },
    ],
    faq: [
      {
        q: "¿El Número de Vida es lo mismo que el Camino de Vida?",
        a: "Sí. Son dos nombres para el mismo cálculo: el número que se obtiene al reducir tu fecha de nacimiento completa. En español también se lo llama Número del Destino o Life Path.",
      },
      {
        q: "¿Qué pasa si obtengo un número maestro (11, 22 o 33)?",
        a: "Los números maestros no se reducen. Representan una energía más intensa y un potencial mayor, pero también más exigencia. Muchos numerólogos los leen como 11, 22 o 33 y también como su reducción (2, 4 o 6).",
      },
      {
        q: "¿Mi Número de Vida puede cambiar?",
        a: "No. Como se calcula con tu fecha de nacimiento, es fijo para toda la vida. Lo que sí cambia es cómo lo vivís según la etapa y el año personal en el que estés.",
      },
    ],
    related: ["numerologia-numeros-maestros", "signo-astral-personalidad", "numerologia-ano-personal"],
    featureLink: { href: "/herramientas/camino-de-vida", label: "Calculá tu Número de Vida" },
  },
  {
    slug: "zodiaco-chino-animal-personalidad",
    title: "Cómo calcular tu animal del Zodíaco Chino y qué revela de tu personalidad",
    excerpt:
      "Tu animal del zodíaco chino se determina por tu año de nacimiento. Conocé cómo calcularlo y qué dice cada uno de los 12 animales sobre tu carácter.",
    metaDescription:
      "Aprendé a calcular tu animal del zodíaco chino según tu año de nacimiento y descubrí qué revela cada uno de los 12 animales sobre tu personalidad y tus ciclos.",
    category: "Zodiaco Chino",
    date: "2026-08-13",
    image: "/blog/zodiaco-chino-animal-personalidad.svg",
    author: "Equipo Molino",
    intro: [
      "El zodíaco chino organiza el tiempo en ciclos de doce años, cada uno asociado a un animal. A diferencia del zodíaco occidental —que mira el día de nacimiento— el zodíaco chino se define por el año. Tu animal no cambia con el mes: es el que corresponde al año lunar en el que naciste.",
      "Cada animal no es solo un símbolo: es un arquetipo con rasgos, fortalezas y desafíos. Conocer el tuyo te da una lente distinta para observarte, muy complementaria con la numerología y la astrología occidental.",
    ],
    sections: [
      {
        id: "como-calcular",
        heading: "Cómo calcular tu animal",
        paragraphs: [
          "Tu animal se determina por tu año de nacimiento, pero con una salvedad: el año chino no empieza el 1 de enero, sino con el Año Nuevo Lunar (entre fines de enero y fines de febrero). Si naciste en enero o principios de febrero, tu animal puede corresponder al año anterior.",
          "La secuencia de los doce animales es fija: Rata, Buey, Tigre, Conejo, Dragón, Serpiente, Caballo, Cabra, Mono, Gallo, Perro y Cerdo. Para saber el tuyo, buscá tu año de nacimiento en el ciclo de doce años y tomá el animal que le corresponde.",
        ],
        list: [
          "Ubicá tu año de nacimiento dentro del ciclo de 12 años.",
          "Si naciste entre el 1 de enero y el Año Nuevo Lunar, verificá si tu animal pertenece al año anterior.",
          "Cada animal también tiene un elemento (madera, fuego, tierra, metal o agua) en ciclos de 60 años.",
        ],
      },
      {
        id: "los-doce",
        heading: "Los 12 animales y su carácter",
        paragraphs: [
          "La Rata es ingeniosa, adaptable y observadora; el Buey, paciente, confiable y trabajador. El Tigre es valiente, competitivo y carismático; el Conejo, sensible, diplomático y cuidadoso. El Dragón es ambicioso, magnético y enérgico; la Serpiente, sabia, misteriosa e intuitiva.",
          "El Caballo valora la libertad, la energía y la sociabilidad; la Cabra es creativa, amable y soñadora. El Mono es inteligente, ingenioso y juguetón; el Gallo, observador, puntual y decidido. El Perro es leal, honesto y protector; y el Cerdo, generoso, sincero y pacífico.",
          "Estos rasgos son el punto de partida. En la lectura completa se combinan con el elemento y con la hora de nacimiento, lo que matiza muchísimo el perfil: dos Dragones pueden ser muy distintos según su elemento.",
        ],
      },
      {
        id: "elementos",
        heading: "El elemento que matiza tu animal",
        paragraphs: [
          "Además del animal, cada año está regido por uno de los cinco elementos: madera, fuego, tierra, metal y agua. El ciclo completo de elementos y animales dura 60 años, así que, por ejemplo, hay un Dragón de Madera, un Dragón de Fuego y así sucesivamente.",
          "El elemento agrega profundidad. Un Tigre de Fuego es más intenso y explosivo que un Tigre de Agua, que tiende a ser más reflexivo y flexible. Incluir el elemento en tu lectura te acerca mucho más a tu perfil real que quedarte solo con el animal.",
        ],
      },
      {
        id: "compatibilidad",
        heading: "Compatibilidad entre animales",
        paragraphs: [
          "La tradición china asocia ciertos animales con afinidades naturales y otros con relaciones más tensas. Por ejemplo, la Rata y el Dragón suelen complementarse, y el Tigre y el Caballo comparten el gusto por la aventura.",
          "Estas afinidades son útiles como marco, pero no son una sentencia sobre tus relaciones. En un mapa personal completo se cruzan con la numerología y la astrología occidental, y la lectura combinada siempre gana en matices.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Cómo sé mi animal si nací en enero o febrero?",
        a: "Depende de si naciste antes o después del Año Nuevo Lunar de ese año. Si naciste justo en el límite, tu animal puede ser el del año anterior. Conviene verificarlo con el calendario lunar exacto.",
      },
      {
        q: "¿Mi animal es el mismo que mi signo astrológico occidental?",
        a: "No. El signo occidental se calcula por el día de nacimiento, y el animal chino por el año. Son dos sistemas independientes que se complementan.",
      },
      {
        q: "¿El elemento cambia mi animal?",
        a: "El animal sigue siendo el mismo, pero el elemento matiza cómo se expresa. Es como la diferencia entre un mismo color en distintas luces.",
      },
    ],
    related: ["numerologia-numero-de-vida", "signo-astral-personalidad", "compatibilidad-zodiaco-chino"],
  },
  {
    slug: "signo-astral-personalidad",
    title: "Tu signo astral: los 3 elementos que definen tu personalidad",
    excerpt:
      "Tu signo solar es solo el comienzo. Conocé los 3 elementos —signo solar, signo lunar y ascendente— que componen tu identidad astral completa.",
    metaDescription:
      "Tu carta astral va más allá del signo solar. Descubrí los 3 elementos —signo solar, signo lunar y ascendente— y cómo se combinan para definir tu personalidad.",
    category: "Astrología",
    date: "2026-08-13",
    image: "/blog/signo-astral-personalidad.svg",
    author: "Equipo Molino",
    intro: [
      "Cuando alguien pregunta '¿qué signo sos?', casi siempre se refiere a tu signo solar: el que depende de tu día de nacimiento. Pero la astrología es más rica que eso. Tu identidad astral se compone de varios elementos, y los tres más importantes forman lo que se llama tu 'triángulo' personal.",
      "Entender los tres elementos te da una imagen mucho más fiel de tu personalidad que leer solo tu signo solar, porque cada uno describe una capa distinta de tu experiencia.",
    ],
    sections: [
      {
        id: "signo-solar",
        heading: "El signo solar: tu esencia",
        paragraphs: [
          "Tu signo solar es la capa más visible: el que la mayoría conoce. Representa tu identidad central, tu vitalidad y el 'yo' que estás desarrollando. Es la energía que brilla cuando estás siendo vos mismo, tu propósito expresado en forma de carácter.",
          "Se calcula por la posición del Sol en el momento de tu nacimiento, es decir, por tu fecha. Es la razón por la que tu signo solar es fijo y fácil de determinar: basta con tu día de nacimiento.",
        ],
      },
      {
        id: "signo-lunar",
        heading: "El signo lunar: tu mundo emocional",
        paragraphs: [
          "Tu signo lunar se calcula con la posición de la Luna en tu nacimiento y describe tu vida emocional, tus instintos y cómo reaccionás cuando estás en piloto automático. Es tu mundo interior: lo que necesitás para sentirte segura, tus hábitos emocionales y tu memoria.",
          "Es la capa menos visible pero una de las más reveladoras. Dos personas con el mismo signo solar pero distinto signo lunar pueden sentir y reaccionar de maneras muy distintas frente a la misma situación.",
        ],
      },
      {
        id: "ascendente",
        heading: "El ascendente: tu máscara y tu proyección",
        paragraphs: [
          "El ascendente es el signo que subía por el horizonte en el momento exacto de tu nacimiento. Depende de la hora, por eso es el más preciso (y el más difícil de determinar si no conocés tu hora).",
          "Describe tu proyección hacia afuera: la primera impresión que das, tu estilo y cómo te acercás al mundo. Es tu 'máscara', pero también es la puerta de entrada de tu carta: muchas veces el ascendente explica por qué no te sentís del todo identificado con tu signo solar.",
        ],
      },
      {
        id: "combinacion",
        heading: "Cómo se combinan los tres",
        paragraphs: [
          "El signo solar es el motor, el lunar el piloto emocional y el ascendente la carrocería que ves desde afuera. Juntos forman un retrato mucho más completo. Un Aries solar con luna en Cáncer y ascendente Libra no se parece a un Aries solar con luna en Leo y ascendente Escorpio, aunque compartan el signo solar.",
          "Esa combinación es la que te acerca a tu identidad real. Por eso los mapas personales que cruzan varias capas —astrología, numerología y zodíaco chino— ofrecen una lectura que ningún dato suelto puede dar por sí solo.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Qué es más importante, el signo solar o el ascendente?",
        a: "Ninguno es 'más importante': describen capas distintas. El solar es tu esencia, el lunar tus emociones y el ascendente tu proyección. Para una lectura completa necesitás los tres.",
      },
      {
        q: "¿Por qué no me siento identificado con mi signo solar?",
        a: "Es muy común. Si tu ascendente o tu luna son muy distintos, la lectura del signo solar solo no alcanza. La combinación de los tres explica por qué.",
      },
      {
        q: "¿Necesito mi hora de nacimiento?",
        a: "Para el signo solar y el lunar no necesariamente, pero para el ascendente sí. La hora exacta define qué signo estaba en el horizonte en tu nacimiento.",
      },
    ],
    related: ["numerologia-numero-de-vida", "zodiaco-chino-animal-personalidad", "luna-ascendente-fecha-nacimiento-no-alcanza"],
  },
  {
    slug: "autoconocimiento-que-es-que-no",
    title: "Qué es realmente el autoconocimiento (y qué no)",
    excerpt:
      "El autoconocimiento genuino no es lo mismo que un test de personalidad o una carta astral. Entendé la diferencia entre usar un sistema simbólico como entrada y usarlo como sustituto de conocerte a vos mismo.",
    metaDescription:
      "Qué es el autoconocimiento genuino, en qué se diferencia de sistemas simbólicos como la numerología o la astrología, y cómo usarlos como punto de partida sin que reemplacen tu propia reflexión.",
    category: "Autoconocimiento",
    date: "2026-08-16",
    image: "/blog/autoconocimiento-que-es-que-no.svg",
    author: "Equipo Molino",
    intro: [
      "\"Autoconocimiento\" se usa para casi cualquier cosa: un test de personalidad, una carta astral, una sesión de terapia, un feed de reels con 'señales de que sos un alma vieja'. Esa amplitud lo vacía de contenido. Antes de usar cualquier herramienta —incluida la numerología o la astrología— vale la pena preguntarse qué es realmente conocerse a uno mismo y qué es, en cambio, adoptar una etiqueta prestada.",
      "Esta distinción no es un tecnicismo. Define si un sistema simbólico te ayuda a pensar mejor sobre vos mismo o si termina pensando por vos. Este artículo no busca convencerte de que la numerología o la astrología 'funcionan' ni de que no funcionan: busca darte un criterio para usarlas sin perder el propio.",
    ],
    sections: [
      {
        id: "genuino-vs-sustituto",
        heading: "Autoconocimiento genuino vs. usar un sistema simbólico como sustituto",
        paragraphs: [
          "El autoconocimiento genuino se construye con evidencia de primera mano: cómo reaccionás bajo presión, qué patrones se repiten en tus vínculos, qué te cuesta admitir de vos. Es lento, incómodo por momentos, y no tiene un resultado final prolijo — se revisa constantemente.",
          "Un sistema simbólico como la numerología, la astrología o el zodíaco chino describe arquetipos y tendencias de un tipo de dato (una fecha, una hora). No te observa a vos: ofrece una plantilla que podés comparar con lo que ya sabés de vos mismo. La diferencia importa: la plantilla no reemplaza la observación, la organiza.",
        ],
      },
      {
        id: "entrada-no-reemplazo",
        heading: "Por qué son una entrada, no un reemplazo",
        paragraphs: [
          "Ningún cálculo simbólico tiene acceso a tu historia real: tu familia, las decisiones que tomaste, el contexto en el que creciste. Lo que puede hacer es nombrar un patrón amplio ('tendencia a la introspección', 'necesidad de estructura') que vos contrastás con tu propia experiencia.",
          "Tratarlo como una entrada significa: lo leés, te preguntás si resuena, y seguís investigando con tus propias herramientas. Tratarlo como reemplazo significa dejar de preguntarte y adoptar la etiqueta como si fuera un diagnóstico. La primera postura suma información; la segunda la sustituye.",
        ],
      },
      {
        id: "perspectiva-vs-identidad",
        heading: "Cómo distinguir 'esto me da perspectiva' de 'esto me dice quién soy'",
        paragraphs: [
          "Hay una prueba simple para notar la diferencia en el momento en que estás leyendo tu mapa: preguntarte qué harías si el resultado fuera distinto. Si la respuesta cambia poco —porque igual ibas a reflexionar sobre ese aspecto tuyo— estás usando el sistema como perspectiva. Si sentís que necesitás que el número 'te dé la razón' para confiar en algo que ya sospechabas, estás empezando a usarlo como identidad.",
        ],
        list: [
          "Perspectiva: 'esto nombra algo que ya venía notando en mí'.",
          "Identidad: 'esto explica todo lo que soy, no necesito seguir revisando'.",
          "Perspectiva: podés descartar la parte que no aplica sin sentir que perdés algo.",
          "Identidad: descartar una parte se siente como perder una certeza.",
        ],
      },
      {
        id: "punto-de-partida",
        heading: "Cómo usar Molino como punto de partida",
        paragraphs: [
          "Un mapa en Molino cruza numerología, astrología y zodíaco chino a partir de tu fecha de nacimiento. Es un punto de partida útil precisamente porque combina varias lentes: cuando dos o tres sistemas coinciden en algo, tenés más motivo para prestarle atención que si solo mirás uno.",
          "Pero el punto de partida sigue siendo un punto de partida. Lo que hagas después —anotarlo en tu journal, contrastarlo con una decisión real, dejarlo pasar si no te dice nada— es la parte que realmente construye autoconocimiento. El mapa abre la pregunta; no la cierra.",
        ],
      },
    ],
    faq: [
      {
        q: "¿La numerología es una pseudociencia?",
        a: "Sí, en el sentido estricto: no tiene un mecanismo causal comprobado ni pasa pruebas empíricas controladas. Eso no la vuelve inútil como herramienta de reflexión —del mismo modo que un ejercicio de journaling tampoco es 'ciencia'— pero sí significa que no deberías tratar sus resultados como hechos verificados sobre vos.",
      },
      {
        q: "¿Puedo confiar en mi mapa para decisiones grandes?",
        a: "No como única fuente. Un mapa simbólico puede darte un ángulo o confirmar algo que ya intuías, pero una decisión grande —cambiar de trabajo, terminar una relación, mudarte de país— merece información real: datos concretos, conversación con personas que te conocen, y si hace falta, ayuda profesional. Usalo como una voz más en la conversación, no como la que decide.",
      },
    ],
    related: ["numerologia-astrologia-herramientas-no-oraculo", "numerologia-numero-de-vida"],
  },
  {
    slug: "numerologia-astrologia-herramientas-no-oraculo",
    title: "Cómo usar la numerología y la astrología como herramientas, no como oráculo",
    excerpt:
      "La numerología y la astrología dan perspectiva, no predicciones. Aprendé 3 formas concretas de aplicar un patrón a tu vida diaria sin convertirlo en un oráculo del que dependés.",
    metaDescription:
      "Cómo usar la numerología y la astrología como herramientas de reflexión y no como oráculo: la diferencia entre perspectiva y predicción, y 3 formas de aplicar un patrón a tu vida diaria.",
    category: "Autoconocimiento",
    date: "2026-08-16",
    image: "/blog/numerologia-astrologia-herramientas-no-oraculo.svg",
    author: "Equipo Molino",
    intro: [
      "Hay una manera de usar la numerología y la astrología que las vuelve útiles, y otra que las vuelve una forma elegante de dejar de pensar. La diferencia no está en el sistema —los mismos números, los mismos signos— sino en qué le pedís que haga por vos: ¿perspectiva sobre un patrón, o una respuesta que te saque de encima la responsabilidad de decidir?",
      "Este artículo no es una defensa ni una crítica de estos sistemas. Es una guía práctica para sacarles algo real sin caer en la lectura de oráculo: la que espera un 'sí' o un 'no' en vez de una pregunta mejor formulada.",
    ],
    sections: [
      {
        id: "perspectiva-vs-prediccion",
        heading: "Perspectiva vs. predicción: la diferencia que cambia todo",
        paragraphs: [
          "La predicción promete saber qué va a pasar. La perspectiva te ofrece un ángulo distinto sobre algo que ya está pasando. 'Este año vas a conocer al amor de tu vida' es predicción. 'Los años que cierran un ciclo suelen traer decisiones pendientes: ¿hay algo en tu vida que se siente en esa etapa?' es perspectiva.",
          "La predicción te deja pasivo, esperando que algo externo confirme o desmienta lo que te dijeron. La perspectiva te deja con una pregunta que solo vos podés responder con tu propia vida. Cualquier lectura —tuya, de un profesional, de una app— que suene más a lo primero que a lo segundo merece sospecha.",
        ],
      },
      {
        id: "tres-formas",
        heading: "3 formas concretas de usar un patrón en tu vida diaria",
        paragraphs: [
          "Un patrón simbólico rinde más cuando lo bajás a algo chico y verificable, no cuando lo dejás como una frase abstracta flotando.",
        ],
        list: [
          "Como pregunta de journal: en vez de 'soy un 7, analítico e introspectivo', escribí '¿dónde estoy usando el análisis para evitar actuar esta semana?'.",
          "Como chequeo antes de una decisión chica: si tu patrón señala una tendencia a la impulsividad, usalo como una pausa de dos minutos antes de responder un mensaje difícil, no como una etiqueta fija.",
          "Como lente para revisar un conflicto ya pasado: releé una discusión reciente preguntándote si el patrón que te muestra tu mapa tuvo algo que ver — no para justificarte, sino para verte con más claridad.",
        ],
      },
      {
        id: "cuando-no-aplica",
        heading: "Qué hacer cuando un patrón 'no aplica'",
        paragraphs: [
          "Va a pasar seguido: leés que tu Número de Vida 8 habla de ambición material y vos sos la persona menos interesada en el dinero que conocés. Eso no es un error del sistema ni tuyo — es lo esperable de un modelo que reduce a una persona entera a una sola cifra.",
          "Lo que hay que evitar es forzar la coincidencia ('en el fondo sí soy ambicioso, solo que no lo veo') o descartar todo el sistema de un saque. El punto medio es más simple: anotá que no aplicó, seguí leyendo el resto, y si un patrón entero de tu mapa no resuena en nada, tomalo como información sobre los límites del modelo, no como una verdad escondida sobre vos.",
        ],
      },
      {
        id: "rol-del-journal",
        heading: "El rol del journal: de patrón abstracto a evidencia propia",
        paragraphs: [
          "La diferencia entre alguien que usa estos sistemas como herramienta y alguien que los usa como oráculo casi siempre está en si hay un registro de por medio. Sin journal, un patrón queda como una frase que leíste una vez y que se activa selectivamente en tu memoria —la recordás cuando confirma algo, la olvidás cuando no.",
          "Con journal, el patrón se convierte en algo que podés revisar contra hechos: ¿cuántas veces en el último mes se cumplió esto que mi mapa señala? Esa pregunta es la que separa la reflexión de la superstición. Molino tiene un journal pensado justamente para esto: no para registrar el mapa, sino para registrar tu vida al lado de él.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Qué hago si mi patrón no se siente cierto?",
        a: "Anotalo así, sin forzar. Un patrón que no resuena es información válida: te dice algo sobre los límites del modelo o sobre un aspecto tuyo que quizás cambió. No hace falta reinterpretarlo hasta que encaje.",
      },
      {
        q: "¿Cada cuánto conviene revisar mi mapa?",
        a: "No hay una cadencia correcta. Tu Número de Vida y tu animal chino no cambian nunca, así que releerlos no aporta nada nuevo salvo que vos hayas cambiado de contexto. Lo que sí tiene sentido revisar con más frecuencia es lo que se mueve —como el Año Personal— y solo cuando estés atravesando algo que quieras pensar mejor, no como rutina fija.",
      },
    ],
    related: ["autoconocimiento-que-es-que-no", "numerologia-ano-personal"],
  },
  {
    slug: "numerologia-ano-personal",
    // El año en el título es lo que se busca en el último trimestre ("año
    // personal 2027"). Actualizarlo cada octubre junto con el ejemplo de
    // "Cómo se calcula" — si queda viejo, promete algo que el texto no tiene.
    title: "Año Personal 2027: calculalo con tu fecha de nacimiento",
    excerpt:
      "El Año Personal es el ciclo de nueve años que se mueve dentro de tu numerología. Aprendé cómo se calcula, qué representa cada año del ciclo y cómo usarlo para planificar sin caer en el determinismo.",
    metaDescription:
      "Sumá tu día y mes de nacimiento al año y reducilo a una cifra: así sale tu Año Personal 2026 y 2027, con un ejemplo paso a paso y qué significa cada uno de los 9 años.",
    category: "Numerología",
    date: "2026-08-16",
    updatedAt: "2026-10-17",
    image: "/blog/numerologia-ano-personal.svg",
    author: "Equipo Molino",
    intro: [
      "A diferencia del Número de Vida, que es fijo, el Año Personal es la parte de la numerología que se mueve. Es un ciclo de nueve años que se repite durante toda tu vida, y cada uno de esos nueve tiene un carácter distinto: hay años de inicio, años de repliegue, años de cosecha. Saber en qué año estás no te dice qué va a pasar, pero te da un marco para planificar con más criterio.",
      "Este artículo explica cómo se calcula, qué representa cada número del ciclo y, sobre todo, cómo usarlo sin caer en la trampa de esperar que el calendario haga el trabajo por vos.",
    ],
    sections: [
      {
        id: "que-es",
        heading: "Qué es el Año Personal",
        paragraphs: [
          "El Año Personal es un número del 1 al 9 que resulta de combinar tu día y mes de nacimiento con el año en curso. Cambia una vez por año (en tu cumpleaños, no el 1 de enero) y se repite en ciclos de nueve: después del año 9 volvés al 1 y el ciclo arranca de nuevo.",
          "La lógica detrás es la misma que la del Número de Vida —reducir una suma de dígitos a una cifra entre 1 y 9— pero aplicada a un período específico en vez de a toda tu vida. Por eso se lee como una 'temporada': una energía que predomina durante ese año, no una identidad permanente.",
        ],
      },
      {
        id: "como-se-calcula",
        heading: "Cómo se calcula",
        paragraphs: [
          "Se suma el día y el mes de tu nacimiento con el año en curso, y se reduce el total a una sola cifra del 1 al 9 (a diferencia del Número de Vida, en el Año Personal los números maestros 11, 22 y 33 generalmente también se reducen, porque describe un período corto y no un rasgo estructural).",
          "Por ejemplo, alguien que nació el 15 de agosto, en 2026, suma 1 + 5 (día) + 8 (mes) + 2 + 0 + 2 + 6 (año) = 24, y reduce 2 + 4 = 6. Esa persona transita un Año Personal 6 desde su cumpleaños de 2026 hasta el de 2027.",
          "Para 2027 la cuenta es la misma con el año nuevo: 1 + 5 + 8 + 2 + 0 + 2 + 7 = 25, y 2 + 5 = 7. Desde su cumpleaños de 2027 entra en un Año Personal 7. Cada año suma uno más al ciclo, y después del 9 vuelve al 1.",
        ],
      },
      {
        id: "los-nueve-anos",
        heading: "Qué representa cada uno de los 9 años del ciclo",
        paragraphs: [
          "Cada número del ciclo tiene un tono distinto, pensado como una progresión: se empieza, se construye, y se cierra para volver a empezar.",
        ],
        list: [
          "Año 1 — Inicio: momento de sembrar, empezar proyectos, tomar la iniciativa.",
          "Año 2 — Cooperación: los vínculos y la paciencia pesan más que la acción individual.",
          "Año 3 — Expresión: comunicación, creatividad, visibilidad social.",
          "Año 4 — Trabajo: consolidar, ordenar, poner estructura a lo sembrado en el 1.",
          "Año 5 — Cambio: movimiento, imprevistos, decisiones que rompen la rutina.",
          "Año 6 — Responsabilidad: foco en el hogar, la familia y los compromisos asumidos.",
          "Año 7 — Introspección: repliegue, estudio, revisión interna más que expansión.",
          "Año 8 — Resultados: el año donde suele verse el efecto material del trabajo previo.",
          "Año 9 — Cierre: se sueltan cosas que ya cumplieron su ciclo, preparando el 1 siguiente.",
        ],
      },
      {
        id: "sin-determinismo",
        heading: "Cómo usarlo sin caer en determinismo",
        paragraphs: [
          "El riesgo más común es leer 'Año 7: introspección' y decidir no intentar nada nuevo ese año, como si el número lo prohibiera. Eso invierte la lógica: el Año Personal describe una tendencia predominante, no un límite. Se puede lanzar un proyecto en un Año 7 —simplemente puede pedir más esfuerzo a contracorriente que en un Año 1.",
          "La forma más útil de usarlo es como contexto para planificar, no como permiso o prohibición. Si estás en un Año 4 y sentís que todo pide orden, tiene sentido priorizar tareas de consolidación en vez de forzar una expansión grande — pero la decisión final sigue siendo tuya, con datos de tu vida real, no del calendario numerológico.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Se calcula por año calendario o por tu cumpleaños?",
        a: "Por tu cumpleaños. El Año Personal cambia el día que cumplís años, no el 1 de enero. Eso significa que durante los primeros meses de un año calendario todavía podés estar transitando el Año Personal 'del año anterior' si tu cumpleaños es más tarde en el año.",
      },
      {
        q: "¿Qué pasa si no coincide con lo que estoy viviendo?",
        a: "Es esperable que no coincida siempre — es un promedio simbólico aplicado a una vida real y particular. Si tu Año 9 no se siente como un cierre, no hay nada que 'arreglar': tomalo como un marco de referencia flexible, no como una descripción exacta de tu año.",
      },
    ],
    related: ["numerologia-numero-de-vida", "numerologia-astrologia-herramientas-no-oraculo"],
  },
  {
    slug: "luna-ascendente-fecha-nacimiento-no-alcanza",
    title: "Luna y Ascendente: por qué tu fecha de nacimiento sola no alcanza",
    excerpt:
      "Tu signo solar sale con la fecha, pero la Luna y el ascendente necesitan mucho más. Entendé qué tan precisa es la astrología que calcula Molino hoy y qué datos hacen falta para ir más allá.",
    metaDescription:
      "Por qué el signo lunar y el ascendente necesitan hora y lugar de nacimiento exactos, qué tan preciso es lo que Molino calcula hoy, y cómo conseguir tu hora de nacimiento para una lectura más completa.",
    category: "Astrología",
    date: "2026-08-16",
    image: "/blog/luna-ascendente-fecha-nacimiento-no-alcanza.svg",
    author: "Equipo Molino",
    intro: [
      "Casi todo el mundo conoce su signo solar: el que sale con solo el día y el mes de nacimiento. Pero la astrología tradicional describe la personalidad con al menos tres capas —sol, luna y ascendente— y las últimas dos necesitan datos que la fecha sola no provee. Sin ellos, cualquier lectura astrológica es una aproximación, no un cálculo exacto.",
      "Vale la pena entender exactamente qué necesita cada capa y qué tan precisa es la versión que hoy calcula Molino, para leer tu mapa con las expectativas correctas.",
    ],
    sections: [
      {
        id: "signo-lunar",
        heading: "El signo lunar: qué es y por qué la fecha sola es una aproximación",
        paragraphs: [
          "El signo lunar describe tu mundo emocional: cómo reaccionás en piloto automático, qué necesitás para sentirte en calma. Se calcula por la posición de la Luna en el momento de tu nacimiento, y a diferencia del Sol —que tarda un mes en recorrer un signo— la Luna cambia de signo cada dos o tres días, y a veces hasta dentro del mismo día.",
          "Eso significa que, sin la hora exacta, el cálculo del signo lunar es una aproximación: se estima con un horario de referencia (mediodía) que puede coincidir con tu Luna real o puede quedar del lado equivocado de un cambio de signo, sobre todo si naciste cerca de la medianoche o de un cambio lunar.",
        ],
      },
      {
        id: "ascendente",
        heading: "El ascendente: qué es y por qué requiere hora y lugar exactos",
        paragraphs: [
          "El ascendente es el signo que estaba saliendo por el horizonte en el momento y el lugar exactos de tu nacimiento. Es la capa más precisa de la carta astral —y también la más exigente: cambia aproximadamente cada dos horas, así que un margen de error de 30 minutos en tu hora de nacimiento puede alterar el resultado.",
          "Calcularlo requiere tres datos: fecha, hora exacta y coordenadas geográficas del lugar de nacimiento. Sin alguno de los tres, no hay ascendente confiable posible — no es una cuestión de precisión aproximada como con la Luna, es un dato que simplemente no se puede derivar sin esa información.",
        ],
      },
      {
        id: "precision-de-molino",
        heading: "Qué tan preciso es lo que Molino calcula hoy",
        paragraphs: [
          "Molino calcula tu signo solar con exactitud a partir de tu fecha de nacimiento, y tu signo lunar con un algoritmo astronómico que usa mediodía como hora de referencia cuando no cargás una hora exacta. Es una aproximación razonable —el Sol es preciso, la Luna es una estimación— pero una aproximación al fin.",
          "El ascendente, hoy, Molino no lo calcula. No es una limitación de diseño ni una simplificación deliberada: requiere hora y lugar de nacimiento exactos, datos que la plataforma no solicita en este momento. Si en algún mapa o lectura ves mención al ascendente, tratala como contenido educativo general sobre el concepto, no como un cálculo hecho sobre tu carta.",
        ],
      },
      {
        id: "como-conseguir-hora",
        heading: "Cómo conseguir tu hora de nacimiento",
        paragraphs: [
          "Si te interesa una lectura más precisa —con ascendente incluido, calculada en otra herramienta especializada en cartas natales— vas a necesitar tu hora exacta de nacimiento. Estas son las fuentes más confiables, en orden:",
        ],
        list: [
          "El certificado de nacimiento original: en la mayoría de los países consigna la hora exacta.",
          "El registro civil o la partida de nacimiento, si el certificado no está a mano.",
          "El hospital o la institución donde naciste, que suele guardar registros de partos.",
          "Preguntarle directamente a quien estuvo presente, aunque conviene confirmarlo con un documento si la decisión que vas a tomar con esa información te importa.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Por qué Molino no pide la hora de nacimiento?",
        a: "Porque hoy el motor no calcula ascendente ni casas astrológicas, que son los únicos datos donde la hora es estrictamente necesaria. Para el signo solar no hace falta, y para el signo lunar se usa una hora de referencia. Si en el futuro se suma el cálculo de ascendente, ahí sí tendría sentido pedirla.",
      },
      {
        q: "¿Cuánto cambia mi lectura sin la hora exacta?",
        a: "Tu signo solar no cambia nada — no depende de la hora. Tu signo lunar puede cambiar si naciste cerca de un cambio de signo lunar (raro, pero posible). Lo que no vas a tener, sin la hora exacta, es un ascendente confiable: ese dato directamente no está disponible en un cálculo aproximado.",
      },
    ],
    related: ["signo-astral-personalidad", "autoconocimiento-que-es-que-no"],
  },
  {
    slug: "compatibilidad-zodiaco-chino",
    title: "Compatibilidad en el Zodíaco Chino: qué significa realmente (y qué no)",
    excerpt:
      "La compatibilidad tradicional del zodíaco chino describe tendencias entre arquetipos, no un veredicto sobre tu relación. Conocé cómo funciona y cómo Molino calcula el % de Modo Pareja.",
    metaDescription:
      "Qué significa realmente la compatibilidad en el zodíaco chino, por qué 'incompatible' no es una sentencia, y cómo Molino combina zodíaco chino, astrología y numerología para calcular el % de Modo Pareja.",
    category: "Zodiaco Chino",
    date: "2026-08-16",
    image: "/blog/compatibilidad-zodiaco-chino.svg",
    author: "Equipo Molino",
    intro: [
      "La tradición china asocia ciertos animales del zodíaco con afinidades naturales y otros con tensión estructural. Es un sistema con siglos de desarrollo y bastante más matiz del que suele llegar en versiones resumidas ('Rata y Caballo, incompatibles'). Pero incluso en su versión completa, sigue siendo un sistema simbólico: describe una tendencia entre arquetipos, no un veredicto sobre una relación real entre dos personas.",
      "Este artículo explica cómo funciona la compatibilidad tradicional, qué tan lejos llega esa información, y cómo Molino la usa —como una pieza entre varias— para calcular el porcentaje que ves en Modo Pareja.",
    ],
    sections: [
      {
        id: "como-funciona",
        heading: "Cómo funciona la compatibilidad tradicional",
        paragraphs: [
          "El sistema agrupa a los doce animales en relaciones de distinto tipo, construidas sobre patrones astronómicos y ciclos de doce y de cuatro años.",
        ],
        list: [
          "Tríos afines: grupos de tres animales (por ejemplo Rata, Dragón y Mono) que la tradición considera especialmente compatibles entre sí.",
          "Combinaciones armónicas de a pares: animales opuestos en el ciclo que se consideran complementarios, como la Rata y el Buey.",
          "Choques (clash): animales ubicados a seis posiciones de distancia en el ciclo, considerados tensos por naturaleza — como la Rata y el Caballo.",
          "Daños y penalizaciones: relaciones más sutiles, consideradas desafiantes pero no necesariamente negativas.",
        ],
      },
      {
        id: "que-dice-que-no",
        heading: "Qué dice y qué no dice sobre una relación real",
        paragraphs: [
          "Lo que sí describe: una tendencia arquetípica entre dos energías —por ejemplo, si ambos animales tienden al mismo tipo de ritmo o a ritmos opuestos, si comparten una forma de resolver conflictos o si chocan en eso. Es información con valor de perspectiva, igual que cualquier otro sistema simbólico de este sitio.",
          "Lo que no describe: dos personas específicas, con historia, comunicación, contexto y decisión propia. No hay ningún par de animales que garantice una relación sana, ni ningún par que la condene. El sistema opera sobre el arquetipo del animal, no sobre vos ni sobre tu pareja.",
        ],
      },
      {
        id: "incompatible-no-es-sentencia",
        heading: "Por qué 'incompatible' en el sistema no significa incompatible en la vida",
        paragraphs: [
          "Cuando dos animales están en una relación de choque, la lectura tradicional no dice 'esta relación va a fallar': dice que hay una tensión estructural que, sin trabajo consciente, tiende a generar fricción. Esa fricción puede ser justamente lo que hace interesante a una relación, o puede ser algo que ambos deciden gestionar activamente.",
          "Vale la pena recordar además que ningún par de personas se reduce a un par de animales. Cada uno también tiene un elemento, un Número de Vida, un signo solar — capas adicionales que pueden equilibrar o intensificar lo que marca la relación de animales. Un choque de animales con un elemento compartido se lee distinto que el mismo choque sin nada más en común.",
        ],
      },
      {
        id: "como-calcula-molino",
        heading: "Cómo Molino calcula el % de Modo Pareja",
        paragraphs: [
          "El porcentaje que ves en Modo Pareja no sale únicamente del zodíaco chino: combina tres capas con distinto peso. La relación entre animales del zodíaco chino pesa más que las otras dos, la compatibilidad astrológica de signos solares pesa un poco menos, y la compatibilidad numerológica entre Números de Vida completa el cálculo con el peso más chico.",
          "Esa mezcla es deliberada: busca que ningún factor solo determine el resultado. Un choque fuerte en el zodíaco chino puede compensarse parcialmente con una buena combinación astrológica o numerológica, de la misma forma en que en la vida real ninguna tensión sola define una relación completa.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Dos signos 'incompatibles' pueden funcionar como pareja?",
        a: "Sí, y de hecho es común. La compatibilidad tradicional describe una tendencia a la fricción, no una imposibilidad. Muchas relaciones sólidas se construyen justamente trabajando las tensiones que marca un choque de animales, en vez de evitarlas.",
      },
      {
        q: "¿La compatibilidad cambia con la edad o el elemento?",
        a: "El elemento sí matiza la lectura: un mismo par de animales se siente distinto si comparten elemento que si tienen elementos opuestos. La edad, en el sentido de la relación entre animales, no cambia — pero cómo cada persona vive esa relación sí evoluciona con el tiempo y el contexto, que es información que ningún cálculo simbólico puede capturar.",
      },
    ],
    related: ["zodiaco-chino-animal-personalidad", "numerologia-astrologia-herramientas-no-oraculo"],
  },
  {
    slug: "numerologia-numeros-maestros",
    title: "Números maestros 11, 22 y 33: qué significan y cómo saber el tuyo",
    excerpt:
      "Los números maestros (11, 22 y 33) no se reducen como el resto y pueden aparecer en cuatro lugares distintos de tu mapa. Aprendé qué representan y por qué el mismo maestro se lee distinto según dónde cae.",
    metaDescription:
      "Qué son los números maestros 11, 22 y 33 en numerología, por qué no se reducen, en qué cuatro posiciones de tu mapa pueden aparecer y cómo se lee cada uno según dónde cae.",
    category: "Numerología",
    date: "2026-08-18",
    updatedAt: "2026-10-19",
    image: "/blog/numerologia-numeros-maestros.svg",
    author: "Equipo Molino",
    intro: [
      "En numerología, casi todos los cálculos terminan en una cifra del 1 al 9: se suman los dígitos y se reduce el total hasta llegar a un número simple. Los números maestros son la excepción. Cuando la suma intermedia da 11, 22 o 33, la reducción se detiene ahí — no se sigue sumando hasta obtener un dígito único.",
      "Esa pausa no es un capricho del cálculo: la tradición numerológica lee esos tres números como una intensificación de su versión reducida (2, 4 y 6 respectivamente), no como un número más en la lista. Este artículo explica dónde pueden aparecer en tu mapa, qué representa cada uno y por qué el mismo maestro no se lee igual en todas partes.",
    ],
    sections: [
      {
        id: "por-que-no-se-reducen",
        heading: "Por qué el 11, el 22 y el 33 no se reducen",
        paragraphs: [
          "La reducción numerológica busca siempre la cifra más simple porque cada número del 1 al 9 representa una energía arquetípica completa. Los números maestros rompen esa regla porque la tradición los interpreta como un doble dígito con carga propia: el 11 duplica el 1 (individualidad, iniciativa), el 22 duplica el 2 elevado a escala de construcción, y el 33 combina la intuición del 11 con la capacidad de estructura del 22, orientada al cuidado de otros.",
          "En la práctica esto significa que un cálculo que en cualquier otro caso seguiría sumando dígitos (11 → 1+1 = 2) se detiene apenas aparece uno de los tres. Si tu fecha o tu nombre producen un 11, un 22 o un 33 en algún paso intermedio, ese es el número que se queda — no su reducción.",
        ],
      },
      {
        id: "posiciones-maestras",
        heading: "Las posiciones donde puede aparecer un maestro",
        paragraphs: [
          "Un error común es pensar que los números maestros solo aparecen en el Número de Vida. En realidad pueden salir en las distintas posiciones de un mapa numerológico, y cada posición describe una parte distinta de la persona.",
        ],
        list: [
          "Camino de Vida: la trayectoria completa — se calcula con la fecha de nacimiento entera.",
          "Expresión: cómo te comunicás y te mostrás hacia afuera — se calcula con el nombre completo.",
          "Personalidad: la impronta de tu día de nacimiento — se calcula reduciendo el día exacto en que naciste.",
        ],
      },
      {
        id: "el-mismo-numero-distinto-lugar",
        heading: "Por qué el mismo maestro se lee distinto según dónde cae",
        paragraphs: [
          "Un 11 en el Camino de Vida describe una trayectoria completa marcada por la intuición y la sensibilidad elevada — es el eje de toda la vida. En Personalidad describe algo todavía más acotado: la impronta inmediata de cómo te proyectás al interactuar con otros.",
          "Por eso tener un número maestro no es 'tener más energía' en general, sino tenerla concentrada en una zona específica del mapa. Dos personas con un 22 —una en su Camino de Vida, otra en su número de Expresión— comparten el arquetipo del 'constructor a gran escala', pero lo viven en dominios distintos: una como el sentido de toda su vida, la otra como un matiz de cómo se comunica.",
        ],
      },
      {
        id: "como-leerlo-sin-presion",
        heading: "Cómo leer un número maestro sin que se convierta en presión",
        paragraphs: [
          "La tradición asocia los números maestros con más potencial, pero también con más exigencia — la lectura popular suele exagerar esto último hasta convertirlo en una carga ('tenés una misión especial que cumplir'). Es una forma de leerlo que genera más ansiedad que perspectiva.",
          "Una lectura más útil trata el maestro como una intensidad, no como una obligación: si te tocó un 11 en Expresión, no significa que tengas que inspirar a las masas — significa que tu forma de comunicar tiende a tener un matiz de claridad inusual, y que vale la pena prestarle atención a esa tendencia en vez de forzarla a un molde ajeno.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Es mejor tener un número maestro que uno reducido?",
        a: "No. La numerología no jerarquiza los números del 1 al 9 ni los maestros por encima de ellos — cada uno describe un arquetipo distinto, no una escala de calidad. Un maestro implica más intensidad y más exigencia en esa posición específica, no una ventaja general.",
      },
      {
        q: "¿Puedo tener varios números maestros a la vez?",
        a: "Sí. Como el Camino de Vida, la Expresión y la Personalidad se calculan por separado, es posible (aunque poco común) que más de una posición dé un número maestro. Cada una se lee de forma independiente según lo que representa esa posición.",
      },
      {
        q: "¿Por qué algunas lecturas también muestran la versión reducida (2, 4 o 6)?",
        a: "Porque muchos numerólogos leen el maestro y su reducción juntos: el maestro como la energía elevada y su reducción como el 'piso' al que se puede volver cuando esa intensidad pesa demasiado. Ambas lecturas son complementarias, no contradictorias.",
      },
    ],
    related: ["numerologia-numero-de-vida", "signo-astral-personalidad", "numerologia-ano-personal"],
  },
  {
    slug: "honestidad-radical-lo-que-molino-es-y-no-es",
    title: "Honestidad radical: lo que Molino es (y lo que no es)",
    excerpt:
      "Cada tanto vale la pena parar y mirar el proyecto con ojo crítico. Esto es lo que encontramos cuando lo hicimos con sin marketing, sin vender expertise que no tenemos.",
    metaDescription:
      "Qué hace bien Molino, qué le falta, y qué es (y qué no es) el proyecto: no somos expertos certificados, somos aficionados que construyeron una herramienta gratuita y privada de autoconocimiento.",
    category: "Autoconocimiento",
    date: "2026-08-19",
    image: "/blog/honestidad-radical-lo-que-molino-es-y-no-es.svg",
    author: "Equipo Molino",
    intro: [
      "Cada tanto vale la pena parar y mirar un proyecto propio con la misma honestidad que le pedimos a la gente que se mire a sí misma con un mapa simbólico. Esto es lo que vemos cuando hacemos ese ejercicio con Molino, hoy.",
      "No es un comunicado de prensa ni una respuesta a un incidente puntual. Es simplemente una foto honesta de dónde estamos parados: qué funciona, qué falta, y sobre todo, qué es este proyecto realmente — sin inflar credenciales que no tenemos.",
    ],
    sections: [
      {
        id: "lo-que-hicimos-bien",
        heading: "Lo que hicimos bien",
        paragraphs: [
          "La privacidad no es una promesa de marketing acá: el cálculo del mapa gratuito corre enteramente en tu navegador. Tu fecha de nacimiento no viaja a un servidor de Molino para darte tu Camino de Vida, tu signo solar o tu animal del zodíaco chino.",
          "El motor de cálculo está publicado como código abierto — no hay un proceso propietario y opaco escondiendo cómo se llega a cada resultado. Y no hay suscripción mensual: lo gratuito es gratuito para siempre, y lo único que tiene costo (la síntesis con IA) se paga una sola vez, no todos los meses.",
        ],
      },
      {
        id: "lo-que-mejoramos",
        heading: "Lo que mejoramos",
        paragraphs: [
          "Durante mucho tiempo la página de 'Quiénes somos' hablaba del proyecto en abstracto, sin contar por qué existe realmente. La reescribimos para que cuente la historia real: nació de la frustración de pagar por conocimiento que debería ser público, no de un plan de negocio.",
          "También nos faltaba documentación honesta sobre las limitaciones del proyecto — hacia dónde no llega, qué no reemplaza. Ese trabajo sigue en curso, y preferimos decirlo así en vez de aparentar que ya está resuelto.",
        ],
      },
      {
        id: "lo-que-no-somos",
        heading: "Lo que NO somos",
        paragraphs: [
          "No somos expertos certificados en numerología, astrología ni zodíaco chino. No somos una empresa tradicional con equipo de soporte, oficina o ronda de inversión. No ofrecemos diagnósticos, terapia ni predicciones — los sistemas simbólicos que usamos no tienen respaldo científico, y lo decimos así de directo en cada rincón del sitio.",
        ],
      },
      {
        id: "lo-que-si-somos",
        heading: "Lo que SÍ somos",
        paragraphs: [
          "Somos aficionados que se cansaron de pagar suscripciones. Construimos esto porque creemos que el conocimiento simbólico debe ser público, gratuito y privado. No somos expertos certificados, y eso está bien: no vendemos expertise, vendemos herramientas.",
          "El proyecto es más grande que una persona — el código es público justamente para que no dependa de que alguien en particular siga sosteniéndolo. Cualquiera puede leerlo, cuestionarlo o mejorarlo.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Puedo revisar el código de Molino yo mismo?",
        a: "Sí. El repositorio es público en GitHub, bajo la cuenta Morpheus3232/molino. Cualquiera puede leer el motor de cálculo, abrir un issue o proponer un cambio.",
      },
      {
        q: "¿Dónde puedo leer más sobre la filosofía del proyecto?",
        a: "En molino.app/filosofia están los principios completos (conocimiento libre, privacidad radical, transparencia total, código abierto, sin tracking invasivo). En molino.app/nosotros está la historia de por qué existe Molino.",
      },
      {
        q: "¿Por qué admiten esto públicamente en vez de sonar más 'profesionales'?",
        a: "Porque sonar más profesionales de lo que somos sería exactamente el tipo de sensacionalismo que Molino existe para evitar. Preferimos que confíes en la herramienta por lo que hace, no por credenciales infladas.",
      },
    ],
    related: ["autoconocimiento-que-es-que-no", "numerologia-astrologia-herramientas-no-oraculo"],
  },
  {
    slug: "mes-personal-dia-personal-numerologia",
    title: "Mes Personal y Día Personal: el zoom que le falta a tu Año Personal",
    excerpt:
      "Tu Año Personal te dice el clima general del año. El Mes y el Día Personal son el zoom: la energía puntual de esta semana, de hoy. Así se calculan y así se leen juntos.",
    metaDescription:
      "Qué son el Mes Personal y el Día Personal en numerología, cómo se calculan a partir de tu Año Personal (no de tu fecha de nacimiento sola) y cómo usarlos para leer el momento exacto que estás viviendo.",
    category: "Numerología",
    date: "2026-08-19",
    image: "/blog/mes-personal-dia-personal-numerologia.svg",
    author: "Equipo Molino",
    intro: [
      "Si ya conocés tu Año Personal, seguro notaste que describe un clima amplio — todo un año de una sola tacada. Útil para planificar, pero demasiado grueso para una pregunta como '¿hoy es buen día para esa conversación difícil?'. Ahí es donde entran el Mes Personal y el Día Personal: la misma lógica numerológica, aplicada con más resolución.",
      "La parte que casi nadie explica bien —y que en Molino tuvimos que corregir en nuestro propio motor de cálculo— es que el Mes Personal no sale de sumar tu fecha de nacimiento con el mes del calendario. Sale de tu Año Personal. Esa diferencia cambia el resultado.",
    ],
    sections: [
      {
        id: "por-que-no-alcanza-el-ano",
        heading: "Por qué el Año Personal solo no alcanza",
        paragraphs: [
          "El Año Personal reduce tu día y mes de nacimiento sumados al año calendario actual a un solo dígito (o a un número maestro). Te da el tema general del año: si es de inicios, de consolidación, de cierre. Pero un año entero tiene 365 días adentro, y no todos pesan igual.",
          "El Mes Personal achica esa ventana a cuatro o cinco semanas. El Día Personal la achica a 24 horas. Cuanto más corta la ventana, más específica (y más volátil) la lectura — un buen Año Personal puede tener meses flojos adentro, y un mes flojo puede tener un día excelente.",
        ],
      },
      {
        id: "como-se-calcula",
        heading: "Cómo se calcula el Mes Personal (la parte que solemos ver mal)",
        paragraphs: [
          "La fórmula correcta es: Mes Personal = reducir(Año Personal + número del mes calendario actual). No es tu fecha de nacimiento otra vez — es tu Año Personal ya calculado, sumado al mes en curso.",
          "Ejemplo: si tu Año Personal 2026 es un 6, y estamos en agosto (mes 8), tu Mes Personal es 6 + 8 = 14 → 1 + 4 = 5. Ese 5 es el que rige agosto para vos este año — no el que regiría agosto en cualquier otro año, porque depende de qué Año Personal estés transitando.",
          "El error común (y el que tuvimos que corregir en nuestro propio código) es calcular el Mes Personal directamente desde tu fecha de nacimiento y el mes calendario, sin pasar por el Año Personal primero. Con ese método, agosto te daría siempre el mismo Mes Personal sin importar en qué año personal estés — lo cual contradice la lógica de capas que tiene todo el sistema: cada nivel se apoya en el anterior.",
        ],
      },
      {
        id: "dia-personal",
        heading: "El Día Personal: la misma lógica, un escalón más abajo",
        paragraphs: [
          "El Día Personal sigue el mismo principio de capas, pero parte de tu Camino de Vida en vez de tu Año Personal: se suma tu Camino de Vida al día, mes y año calendario de hoy, y se reduce. Es la unidad más chica y la más específica — la que responde '¿hoy?' en vez de '¿este año?' o '¿este mes?'.",
          "Por eso en Molino el Día Personal se actualiza todos los días en /hoy, mientras que el Año Personal solo cambia una vez al año: son la misma familia de cálculo, aplicada a distintas escalas de tiempo.",
        ],
      },
      {
        id: "como-leerlos-juntos",
        heading: "Cómo leer los tres juntos",
        paragraphs: [
          "Ninguno de los tres reemplaza a los otros — se leen en capas, de más ancho a más angosto. El Año Personal te da el contexto ('este es un año de cierre'), el Mes Personal ajusta ese contexto a las próximas semanas, y el Día Personal te dice si hoy en particular conviene forzar o esperar.",
          "Un Día Personal 'flojo' dentro de un Año Personal fuerte no invalida el año — es solo una mala hora dentro de una buena temporada. La utilidad está en no leer ninguno de los tres de forma aislada.",
        ],
      },
    ],
    faq: [
      {
        q: "¿El Mes Personal cambia si cambio de Año Personal?",
        a: "Sí, necesariamente — el Mes Personal se calcula a partir de tu Año Personal, así que el mismo mes calendario (por ejemplo, agosto) te va a dar un Mes Personal distinto según en qué Año Personal estés parado ese año.",
      },
      {
        q: "¿Puedo calcular mi Mes Personal de un año futuro?",
        a: "Sí: primero calculás tu Año Personal para ese año futuro, y después le sumás el número del mes que te interesa. El orden importa — no se puede saltear el paso del Año Personal.",
      },
      {
        q: "¿Por qué el Día Personal usa el Camino de Vida y no el Año Personal?",
        a: "Porque el Camino de Vida es el número más estable de tu mapa (no cambia nunca), y el Día Personal necesita una base fija para poder compararse día a día. Si usara el Año Personal como base, el cálculo se volvería circular y perdería sentido dentro del mismo año.",
      },
    ],
    related: ["numerologia-ano-personal", "numerologia-numero-de-vida", "numerologia-numeros-maestros"],
  },
  {
    slug: "como-molino-calcula-compatibilidad-de-pareja",
    title: "Cómo Molino calcula la compatibilidad de pareja: las 5 capas detrás del número",
    excerpt:
      "El % que ves en Modo Pareja no sale de un solo sistema — es un promedio ponderado de cinco capas distintas. Así se arma ese número, capa por capa, sin métodos ocultos.",
    metaDescription:
      "Cómo se calcula el porcentaje de compatibilidad en el Modo Pareja de Molino: las 5 capas (numerología, astrología occidental, zodíaco chino, arquetipo y elemento) y el peso real de cada una en el resultado final.",
    category: "Autoconocimiento",
    date: "2026-08-19",
    image: "/blog/como-molino-calcula-compatibilidad-de-pareja.svg",
    author: "Equipo Molino",
    intro: [
      "Cuando dos personas usan el Modo Pareja de Molino, el resultado final es un solo número — un porcentaje de compatibilidad. Es tentador tratarlo como un cálculo cerrado ('el algoritmo dijo 78%'), pero no lo es: ese número sale de promediar cinco capas distintas, cada una con un peso específico, y las cinco están calculadas con datos reales de las dos personas, no con un puntaje al azar.",
      "Publicamos esta desagregación porque creemos que un número sin su método detrás no sirve para nada — y porque un score de compatibilidad que no podés desarmar es indistinguible de una tirada de dados.",
    ],
    sections: [
      {
        id: "las-cinco-capas",
        heading: "Las cinco capas y su peso real",
        paragraphs: [
          "El score final combina cinco capas con estos pesos: numerología 25%, astrología occidental 25%, zodíaco chino 20%, arquetipo 20% y elemento 10%. Ninguna capa por sí sola define el resultado — por diseño, para que un choque fuerte en una sola dimensión no hunda todo el score, y una afinidad fuerte en una sola tampoco lo infle artificialmente.",
          "Numerología y astrología occidental pesan lo mismo (25% cada una) porque en Molino se tratan como las dos capas más estructurales del mapa de una persona. Zodíaco chino y arquetipo pesan un poco menos (20% cada uno) porque describen patrones más generales. El elemento astrológico pesa menos (10%) porque ya está parcialmente reflejado en las otras capas — pondera bajo para no duplicar señal.",
        ],
      },
      {
        id: "que-mide-cada-capa",
        heading: "Qué mide cada capa, en criollo",
        paragraphs: [
          "Numerología compara los números centrales de cada mapa (Camino de Vida, Expresión, entre otros) y evalúa qué tan alineados están. Astrología occidental compara signos solares y sus relaciones tradicionales (elementos compatibles, tensiones clásicas entre signos). Zodíaco chino hace lo mismo pero con los animales del ciclo de 12 años — las tríadas y pares armoniosos que ya explicamos en otra nota.",
          "Arquetipo compara los perfiles de personalidad que Molino deriva del mapa completo — busca si hay complementariedad (opuestos que se equilibran) o resonancia (afinidades directas). Elemento compara el elemento astrológico dominante de cada persona (fuego, tierra, aire, agua) como una capa adicional, más fina, sobre la astrología occidental.",
        ],
      },
      {
        id: "por-que-desagregado",
        heading: "Por qué te mostramos las cinco capas, no solo el promedio",
        paragraphs: [
          "Un 65% de compatibilidad puede significar cosas muy distintas según de dónde venga. Si sale de una numerología altísima (95%) y una astrología muy floja (30%), el desafío de esa pareja probablemente esté en la forma de comunicarse y no en los valores de fondo. Si el mismo 65% sale de cinco capas todas moderadas, es un panorama completamente distinto: parejo, sin picos ni valles marcados.",
          "El promedio solo no distingue estos dos escenarios — por eso Modo Pareja siempre muestra el desglose completo, no solo el número final. Fortalezas y tensiones se generan automáticamente a partir de qué capas quedaron por encima o por debajo de ciertos umbrales, así que el texto que ves también sale del mismo desglose, no de una interpretación separada.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Un score bajo significa que la relación no funciona?",
        a: "No. Es una lectura simbólica de patrones, no una predicción ni un diagnóstico de la relación real. Un score bajo en Modo Pareja describe tensión en ciertos patrones sistémicos — cómo dos personas terminan resolviendo esa tensión depende de factores que ningún sistema simbólico puede medir.",
      },
      {
        q: "¿Por qué la astrología occidental pesa lo mismo que la numerología?",
        a: "Es una decisión de diseño de Molino, no una verdad universal de ningún sistema tradicional — elegimos ponderarlas igual porque consideramos que ambas capas describen estructura profunda de la personalidad, a diferencia de capas más superficiales como el elemento.",
      },
      {
        q: "¿Se puede cambiar la ponderación de las capas?",
        a: "Hoy no es configurable desde la interfaz — es un valor fijo en el motor de cálculo. Lo documentamos acá justamente para que quede claro qué estás viendo, aunque no puedas ajustarlo vos mismo todavía.",
      },
    ],
    related: ["compatibilidad-zodiaco-chino", "numerologia-numero-de-vida", "autoconocimiento-que-es-que-no"],
  },
  {
    slug: "numeros-del-poder-28-y-8",
    title: "El 28 y el 8: el patrón de los números del poder",
    excerpt:
      "¿Por qué el 28 y el 8 aparecen una y otra vez en las fechas y decisiones de Steve Jobs, Elon Musk, Bill Gates y Nikola Tesla? Una mirada curiosa (y honesta) a un patrón numerológico famoso.",
    metaDescription:
      "El 28 y el 8 como números del dinero y del poder: el patrón que se repite en Steve Jobs, Elon Musk, Bill Gates y Nikola Tesla, explicado con curiosidad y sin caer en la superstición.",
    category: "Numerología",
    date: "2026-08-19",
    image: "/blog/numeros-del-poder-28-y-8.svg",
    author: "Equipo Molino",
    intro: [
      "Hay números que la tradición numerológica asocia con la riqueza y el poder: el 28 (el llamado 'número del dinero') y el 8 (su reducción, el número de la materialidad y la ambición). Y una curiosidad que circula hace años: las fechas más importantes de algunos de los creadores de riqueza más conocidos del mundo tienden a sumar 28 o 8.",
      "En este artículo recorremos ese patrón —con las fechas reales, no inventadas—, porque es un ejemplo fascinante de cómo la numerología lee la realidad: no afirmando que el número cause el éxito, sino notando que el patrón se repite más de lo que el azar parecería explicar. Como siempre en Molino, lo contamos con honestidad: esto es observación de patrones, no una ley mágica.",
    ],
    sections: [
      {
        id: "la-clave",
        heading: "La clave numerológica",
        paragraphs: [
          "En numerología, la reducción de una fecha se hace sumando todos sus dígitos hasta llegar a un número del 1 al 9 (o a un número maestro). Dentro de ese mapa, el 8 es el arquetipo del dinero, el poder y la materialidad: la energía de construir, administrar y lograr resultados tangibles.",
          "El 28 es una cifra especial porque, al reducirse, da 2 + 8 = 10 → 1 + 0 = 1. Pero antes de llegar al 1, el 28 conserva la marca del 8 (la riqueza) y del 2 (la cooperación). Por eso en muchas escuelas se lo llama 'el número del dinero': une la materialidad del 8 con la capacidad de trabajar con otros del 2.",
          "Cuando una fecha importante suma 28, o cuando una decisión gira alrededor del 8, quienes leen numerología suelen detenerse a mirarla. Veamos qué encontramos en las vidas —reales— de cuatro nombres famosos.",
        ],
      },
      {
        id: "steve-jobs",
        heading: "Steve Jobs: el arquitecto del 28",
        paragraphs: [
          "Jobs es el caso más citado. Su fecha de nacimiento, el 24 de febrero de 1955, suma 2 + 4 + 2 + 1 + 9 + 5 + 5 = 28. La fundación de Apple, el 1 de abril de 1976, da 1 + 4 + 1 + 9 + 7 + 6 = 28. Y su incorporación legal, el 3 de enero de 1977, da 3 + 1 + 1 + 9 + 7 + 7 = 28.",
          "El 8 también asoma en sus lanzamientos: el iPhone original salió el 29 de junio de 2007, que se reduce a 6 + 2 + 9 + 2 + 0 + 0 + 7 = 26 → 2 + 6 = 8, el número del dinero en plena era de máxima creación de valor para la compañía.",
        ],
        list: [
          "Nacimiento (24/02/1955): 2+4+2+1+9+5+5 = 28 — el número del dinero.",
          "Fundación de Apple (01/04/1976): 1+4+1+9+7+6 = 28.",
          "Incorporación legal de Apple (03/01/1977): 3+1+1+9+7+7 = 28.",
          "Lanzamiento del iPhone (29/06/2007): suma 26 → 8, el número del dinero.",
        ],
      },
      {
        id: "elon-musk",
        heading: "Elon Musk: el visionario del 28",
        paragraphs: [
          "Musk nació el 28 de junio de 1971 — literalmente un día 28, lo que en numerología se lee como un 'birthday number' 28 reducido a 1, la cifra del liderazgo y de empezar proyectos nuevos. Su Life Path se calcula como 34 → 7, la energía del visionario y del análisis.",
          "Y el 8 aparece una y otra vez en sus decisiones: la compra de Twitter fue de 44 mil millones de dólares (4 + 4 = 8), la fecha de la oferta (25 de abril de 2022) suma 17 → 1 + 7 = 8, y el precio del tick de verificación fue USD 8 por mes, directo. Sus lanzamientos de Tesla y SpaceX suelen caer en fechas que suman 8, 17 o 26 — todas reducen a 8.",
        ],
        list: [
          "Nacimiento: 28 de junio de 1971 — nacido un día 28 (birthday 28 → 1).",
          "Life Path: 34 → 7, el arquetipo del visionario.",
          "Compra de Twitter: USD 44.000 millones → 4 + 4 = 8.",
          "Oferta por Twitter (25/04/2022): 2+5+4+2+0+2+2 = 17 → 1 + 7 = 8.",
          "Precio del check azul: USD 8/mes — el 8 directo.",
          "Lanzamientos de Tesla y SpaceX en fechas que suman 8, 17 o 26 (todas → 8).",
        ],
      },
      {
        id: "bill-gates",
        heading: "Bill Gates: el constructor del 28",
        paragraphs: [
          "Gates nació el 28 de octubre de 1955 — también un día 28, otro 'birthday number' que reduce a 1. Su Life Path se calcula como 31 → 4, la energía del constructor: la persona que organiza, sistematiza y construye a escala.",
          "El 28 como 'número del dinero' se lee acá de forma directa: el nacimiento en día 28, sumado a un Life Path 4 (construcción, estructura) describe, para la tradición numerológica, al que edifica imperios sobre bases sólidas.",
        ],
        list: [
          "Nacimiento: 28 de octubre de 1955 — nacido un día 28.",
          "Birthday number: 28 → 1 — el número de la riqueza y el liderazgo.",
          "Life Path: 31 → 4 — el constructor, la estructura.",
        ],
      },
      {
        id: "nikola-tesla",
        heading: "Nikola Tesla: el genio del 28",
        paragraphs: [
          "Tesla es un caso particular porque su fecha de nacimiento se registra en dos calendarios. En el calendario juliano nació el 28 de junio de 1856 — un día 28. En el gregoriano (10 de julio de 1856) la suma da 7 + 1 + 0 + 1 + 8 + 5 + 6 = 28 también. Hasta se señala que cayó en la semana 28 del año, y su Life Path fue 28/10/1, la energía del líder.",
          "La empresa que lo homenajea, Tesla Motors, se fundó el 1 de julio de 2003, que reduce a 1 + 7 + 2 + 0 + 0 + 3 = 13 → 4, la construcción. Y su complementariedad con Musk (Life Path 7 + 4) se lee como una tensión complementaria: el visionario y el constructor.",
        ],
        list: [
          "Nacimiento juliano: 28 de junio de 1856 — día 28.",
          "Nacimiento gregoriano (10/07/1856): 7+1+0+1+8+5+6 = 28.",
          "Life Path: 28/10/1 — el líder.",
          "Cayó en la semana 28 del año 1856.",
          "Fundación de Tesla Motors (01/07/2003): 1+7+2+0+0+3 = 13 → 4 (construcción).",
        ],
      },
      {
        id: "conclusion-honesta",
        heading: "Conclusión (con honestidad)",
        paragraphs: [
          "El patrón es real en los datos: el 28 y el 8 aparecen en momentos clave de Jobs, Musk, Gates y Tesla. Ahora bien, la lectura honesta —la que sostiene Molino— es que estos números describen un patrón, no provocan el éxito. La numerología no dice que el 28 cause la riqueza; dice que las personas que construyen riqueza suelen vivir rodeadas de la cifra que la simboliza.",
          "Esa es justamente la pregunta que vale la pena: no '¿el número me hará rico?', sino '¿qué patrón repito yo?'. El 28 y el 8 pueden ser un espejo para mirar tu propia relación con el dinero, el poder y la construcción — no un atajo, sino una lente para conocerte mejor.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Tener un 28 o un 8 garantiza riqueza?",
        a: "No. La numerología describe patrones simbólicos, no causas. El 28 y el 8 coinciden con la vida de grandes creadores de riqueza, pero muchísima gente con esos números no construyó imperios, y mucha gente sin ellos sí lo hizo. Leelo como un espejo de tendencias, nunca como una promesa.",
      },
      {
        q: "¿Los nacidos un día 28 están destinados a ser ricos?",
        a: "Esa afirmación circula mucho, pero es una lectura popular simplificada. En numerología, el día 28 (que reduce a 1) habla de liderazgo y de construir proyectos propios — pero el mapa completo, no un solo número, es lo que describe a una persona.",
      },
      {
        q: "¿Estos números son 'magia' o hay algo matemático de fondo?",
        a: "Las fechas y las sumas son reales y verificables. Lo simbólico es la interpretación. La instrucción de reducir cifras tiene incluso un correlato aritmético riguroso (el resto módulo 9), pero eso no convierte la lectura en una ley — la lectura sigue siendo una forma de mirarse, no un oráculo.",
      },
    ],
    related: ["numerologia-numero-de-vida", "numerologia-numeros-maestros", "numerologia-astrologia-herramientas-no-oraculo"],
  },
  {
    slug: "numero-8-dinero-poder",
    title: "El 8 en numerología: el número del dinero, el poder y la ambición",
    excerpt:
      "El 8 es el arquetipo del dinero y el poder. Conocé qué representa, cómo detectarlo en tu fecha y tu nombre, y cómo usarlo como herramienta de autoconocimiento sin caer en la codicia.",
    metaDescription:
      "Qué significa el 8 en numerología: el número del dinero, el poder, la ambición y la materialidad. Cómo se calcula, dónde aparece en tu mapa y cómo leerlo con equilibrio.",
    category: "Numerología",
    date: "2026-08-19",
    image: "/blog/numero-8-dinero-poder.svg",
    author: "Equipo Molino",
    intro: [
      "Dentro del mapa numerológico, el 8 ocupa un lugar particular: es el único número asociado de forma casi unánime al dinero, el poder y la materialidad. Representa la energía de construir, administrar y ver resultados tangibles en el mundo — la capacidad de convertir una idea en algo que existe y vale.",
      "Pero el 8 también tiene su sombra: la ambición desmedida, el control y el miedo a soltar. Como todo arquetipo numerológico, se entiende mejor en su equilibrio: cuánto 8 tenés, dónde aparece en tu mapa y cómo lo estás viviendo.",
    ],
    sections: [
      {
        id: "que-representa",
        heading: "Qué representa el 8",
        paragraphs: [
          "El 8 es la energía de la manifestación material. Mientras el 1 inicia y el 3 comunica, el 8 construye y administra: es el número de los negocios, la gestión, el dinero y el poder bien (o mal) administrado. Su forma, el símbolo del infinito, también apila dos círculos: lo de abajo, lo material; lo de arriba, lo espiritual — y su desafío es equilibrarlos.",
          "En la numerología pitagórica, el 8 se asocia con Saturno (la disciplina y el límite) en la astrología tradicional, lo que refuerza su lectura: el 8 llega a la cima a través del trabajo sostenido, no del atajo. Es el número del que administra y del que rinde cuentas.",
        ],
      },
      {
        id: "donde-aparece",
        heading: "Dónde detectarlo en tu mapa",
        paragraphs: [
          "El 8 puede aparecer en varias posiciones de tu mapa, y cada una dice algo distinto. Como Life Path, habla de una trayectoria marcada por el poder y la construcción. Como Expresión, describe a alguien que se muestra capaz, autoridad presente. Como Alhambre o número personal, marca períodos en los que los temas del dinero y el poder pasan al frente.",
        ],
        list: [
          "Life Path 8: una vida orientada a construir y administrar — el 'ejecutivo' del mapa.",
          "Expresión 8: mostrás autoridad y capacidad de mando hacia afuera.",
          "Año personal 8: un año para consolidar, cobrar y crecer materialmente.",
          "Día 8 o fechas que suman 8: momentos de decisión con fuerte impronta material.",
        ],
      },
      {
        id: "el-28-y-el-8",
        heading: "El 28, la versión 'rica' del 8",
        paragraphs: [
          "Hay una cifra que la tradición numérica destaca especialmente: el 28. Antes de reducirse a 1, el 28 conserva la marca del 8 (la riqueza) y del 2 (la cooperación), por eso se lo llama 'el número del dinero': une la materialidad del 8 con la capacidad de trabajar con otros del 2.",
          "Por eso, cuando en una lectura aparece un 28 —en una fecha de nacimiento, en una suma de fechas clave o en cálculos de nombre— los numerólogos suelen leerlo como un acento riqueza dentro del mapa. Es el mismo tema del 8, pero con la alianza del 2: no dinero aislado, sino dinero construido en sociedad.",
        ],
      },
      {
        id: "equilibrio",
        heading: "El lado oscuro y cómo leerlo con equilibrio",
        paragraphs: [
          "El 8 en exceso es el arquetipo del poder desequilibrado: el control, la codicia, la necesidad de ganar siempre y el olvido de lo que no se puede medir. Quien vive un 8 puro desde la sombra tiende a confundir valor con precio.",
          "La lectura útil del 8 no es perseguir más dinero, sino preguntarse: ¿estoy construyendo algo sólido? ¿Estoy administrando bien mis recursos — tiempo, energía, relaciones, además del dinero? ¿Mi ambición suma a los demás o solo a mí? Ese es el 8 maduro: el poder que construye y administra, sin perder el piso.",
        ],
      },
    ],
    faq: [
      {
        q: "¿El 8 es 'el número del dinero' de verdad o es un mito?",
        a: "Es una convención de la tradición numerológica: el 8 se asocia de forma casi unánime al dinero, el poder y la materialidad. No es una verdad científica, sino el arquetipo que esa tradición asignó a la cifra — y como tal, una lente para mirarse, no una ley.",
      },
      {
        q: "¿Cómo calculo si tengo un 8?",
        a: "Sumás los dígitos de tu fecha de nacimiento (y los de tu nombre si querés los del nombre) y reducís hasta una cifra del 1 al 9. Si da 8, ese es tu número en esa posición. Los nacidos un día 8, 17 o 26 (o un 28 reducido a 1) tienen el acento del 8 en su birthday number.",
      },
      {
        q: "¿Tener un 8 significa que voy a ser rico?",
        a: "No. El 8 describe una tendencia a los temas del poder y la construcción, no garantiza resultados. La riqueza depende de muchísimas variables que ningún número puede capturar. El 8 es útil como espejo de tu relación con lo material, no como una promesa.",
      },
    ],
    related: ["numerologia-numero-de-vida", "numerologia-numeros-maestros", "numeros-del-poder-28-y-8"],
  },
  {
    slug: "filosofia-codigo-abierto",
    title: "Molino es código abierto: por qué la transparencia es parte de tu mapa",
    excerpt:
      "Todo lo que Molino hace está disponible en GitHub. No hay secretos, no hay algoritmos ocultos, no hay recolección de datos a tus espaldas. La filosofía de código abierto es la garantía de que tu privacidad importa.",
    metaDescription:
      "Descubrí por qué Molino eligió ser código abierto, cómo eso protege tu privacidad, y qué significa que un sistema de autoconocimiento sea transparente por defecto.",
    category: "Autoconocimiento",
    date: "2026-08-21",
    image: "/blog/filosofia-codigo-abierto.svg",
    author: "Equipo Molino",
    intro: [
      "En un mundo donde la mayoría de las plataformas de tecnología venden tus datos, Molino eligió el camino opuesto: ser completamente abierta. Eso significa que todo el código que genera tu mapa personal está disponible en GitHub para que lo leas, lo audites y lo entiendas.",
      "No es un acto de generosidad corporativa. Es una decisión sobre qué clase de herramienta queremos ser: una que confía en sus usuarios lo suficiente como para dejarles ver adentro.",
    ],
    sections: [
      {
        id: "que-es-codigo-abierto",
        heading: "¿Qué significa que Molino sea código abierto?",
        paragraphs: [
          "Código abierto (open source) significa que todo el código que hace funcionar Molino está publicado públicamente en GitHub, bajo la licencia Affero General Public License v3 (AGPL-3.0). No es solo 'disponible si lo pedís'. Es 'aquí está, léelo ahora'.",
          "Cualquiera puede descargar el código, estudiarlo línea por línea, verificar cómo funciona el cálculo de tu Número de Vida, cómo se calcula la afinidad con otro signo, cómo se almacenan (o no) tus datos. No hay trucos. No hay algoritmos ocultos diseñados para retenerte o venderte.",
          "El código abierto es una garantía: si alguien notara un fallo o una vulnerabilidad, podría reportarlo (y lo hace). Si Molino hiciera algo malicioso, el código lo delataría. Es transparencia radical.",
        ],
      },
      {
        id: "por-que-codigo-abierto",
        heading: "¿Por qué elegir código abierto?",
        paragraphs: [
          "Porque un sistema de autoconocimiento no puede confiar en la magia de marca. La fe que deposites en Molino tiene que estar fundamentada en verificación, no en promesas. Si te decimos 'tu privacidad nos importa', la forma de probarlo no es con un video publicitario: es dejar que mires el código.",
          "Las herramientas de autoconocimiento — numerología, astrología, zodíaco chino — trabajan con información profunda: tu fecha de nacimiento, tu nombre, tus patrones personales. Eso merece un nivel de confianza que solo la transparencia puede dar.",
          "Además: el código abierto hace que Molino sea mejor. Cuando cientos de personas pueden leer el código, los bugs se encuentran antes. Cuando alguien ve una mejora, puede aportar. Es colaboración en lugar de secreto corporativo.",
        ],
      },
      {
        id: "privacidad-por-diseno",
        heading: "Privacidad por diseño: no es accidental",
        paragraphs: [
          "Molino no guarda tu perfil en servidores. No hace tracking. No vende tus datos. Pero lo más importante es que **puedes verificar que eso es verdad** leyendo el código.",
          "Cuando generas tu mapa en Molino, los datos se calculan en tu navegador. Se guardan solo en tu dispositivo (en localStorage, donde tú tienes control). Cuando cierras sesión, se van. Nadie en Molino ve tu información a menos que vos la compartas (por ejemplo, si generás un link para pareja).",
          "Eso no es una política de privacidad que podría cambiar mañana. Es arquitectura: está construido en el código. Y el código está abierto para que lo confirmes.",
        ],
      },
      {
        id: "comunidad-no-corporacion",
        heading: "Comunidad, no corporación",
        paragraphs: [
          "Código abierto significa que Molino no es solo una empresa. Es un proyecto colaborativo. Contribuyentes pueden proponer mejoras, traducir a otros idiomas, crear variantes adaptadas a diferentes culturas numerológicas, o simplemente auditar la seguridad.",
          "Algunos de los mejores sistemas de autoconocimiento del futuro probablemente vendrán de comunidades de código abierto, no de startups con inversión de riesgo. Porque la comunidad no tiene presión de sacar rendimiento: solo el propósito de hacer herramientas que funcionen bien.",
          "Si en algún momento Molino dejara de mantener el código, la comunidad podría seguir adelante. El proyecto no desaparece cuando una empresa quiebra. Es propiedad común.",
        ],
      },
      {
        id: "como-explorar-codigo",
        heading: "Cómo explorar el código de Molino",
        paragraphs: [
          "No necesitas ser programador. El código está en https://github.com/Morpheus3232/molino. Podes:",
          "Leer el README para entender cómo está estructurado.",
          "Navegar la carpeta `/lib/engines/` para ver cómo se calculan los números.",
          "Revisar `/app/` para ver cómo funciona la interfaz.",
          "Ver `/lib/data/` para entender cómo se define cada concepto numerológico.",
          "Si no entiendes algo, podés abrir una issue (un ticket) y preguntar. La comunidad responde.",
        ],
        list: [
          "Leer el README para entender cómo está estructurado",
          "Navegar la carpeta `/lib/engines/` para ver cómo se calculan los números",
          "Revisar `/app/` para ver cómo funciona la interfaz",
          "Ver `/lib/data/` para entender cómo se define cada concepto numerológico",
          "Si no entiendes algo, abrir una issue (un ticket) y preguntar",
        ],
      },
      {
        id: "licencia-agpl",
        heading: "¿Qué es AGPL y por qué importa?",
        paragraphs: [
          "AGPL-3.0 es una licencia de código abierto que dice: si usas Molino (incluso como base para otro proyecto), tienes que compartir también tu código. No puedes construir una versión privada que robe el trabajo sin dar nada a cambio.",
          "Es la forma de proteger que Molino siga siendo abierto. Si alguien crea una versión modificada de Molino, esa versión también tiene que ser abierta. Es comunidad por defecto.",
          "Para proyectos sin ánimo de lucro, o para contribuciones a Molino mismo, no hay restricción. Solo si comercializar una derivada de Molino, tienes que mantener la licencia abierta.",
        ],
      },
      {
        id: "riesgos-codigo-abierto",
        heading: "¿Hay riesgos en ser abierto?",
        paragraphs: [
          "Sí, algunos. El código abierto visible a todos también es visible a personas malintencionadas que buscan vulnerabilidades. Pero la realidad es: código cerrado no es más seguro, es solo menos verificable. Los hacks grandes suelen venir de software privado porque nadie puede auditar.",
          "Además: en Molino no hay datos centralizados. No hay base de datos de usuarios. El riesgo típico de 'hackear la plataforma y robar datos' no existe aquí. El código es el único ataque posible, y está siendo monitoreado por cientos de ojos.",
          "El código abierto es, en realidad, más seguro. Es transparencia + comunidad = confianza verificada.",
        ],
      },
      {
        id: "futuro-abierto",
        heading: "El futuro de Molino es código abierto",
        paragraphs: [
          "No es un experimento. Es la arquitectura. Molino será siempre abierto porque la confianza en herramientas de autoconocimiento no puede construirse de otro modo.",
          "Si contribuís, si reportas bugs, si ayudas a mejorar Molino, tu nombre estará en los créditos. Si traduces a otro idioma, tu trabajo cuenta. Si auditas el código y encuentras una vulnerabilidad, te lo agradecemos (y te crédito público).",
          "La numerología, la astrología, el zodíaco chino — estas tradiciones han existido miles de años porque funcionan como espejos. Molino es solo ese espejo, pero digital y verificable. Y eso es para todos.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Molino gana dinero siendo código abierto?",
        a: "No directamente de licencias. Molino es gratuito y siempre lo será. En el futuro podría haber servicios de pago (como análisis avanzados o consultas), pero el código base seguirá siendo abierto y gratuito. La idea es que el autoconocimiento no sea un lujo.",
      },
      {
        q: "¿Puedo copiar Molino y hacer mi propia versión?",
        a: "Sí, bajo AGPL-3.0. Eso significa: descargá el código, modificalo, úsalo. Pero tu versión también tiene que ser abierta. No puedes vender una copia privada de Molino. Es justo: si se beneficia del trabajo de Molino, devuelve el conocimiento.",
      },
      {
        q: "¿Qué pasa si encuentro un bug en el código?",
        a: "Abrí un issue en GitHub (https://github.com/Morpheus3232/molino/issues). Describeí qué pasó, incluí pasos para reproducirlo, y la comunidad lo verá. Los mantenedores lo abordarán. Eres parte de mejorar Molino.",
      },
      {
        q: "¿El código abierto significa que Molino no tiene seguridad?",
        a: "Lo opuesto. El código abierto es más seguro porque puede ser auditado. Los mejores proyectos de seguridad del mundo (como OpenSSL, que protege la mayoría de internet) son de código abierto. La privacidad en Molino está garantizada no por secreto, sino por verificación.",
      },
      {
        q: "¿Necesito saber programar para usar Molino?",
        a: "No. El interfaz de Molino es para todos. El código abierto es para quienes quieran verificar cómo funciona adentro. Pero generando tu mapa, no necesitas tocar una línea de código.",
      },
    ],
    related: ["numerologia-numero-de-vida", "honestidad-radical-lo-que-molino-es-y-no-es", "numerologia-astrologia-herramientas-no-oraculo"],
  },  {
    slug: "ano-nuevo-chino-fechas-signo",
    title: "Año Nuevo chino: la fecha de cada año y por qué tu signo puede ser el del año anterior",
    excerpt:
      "El Año Nuevo chino cae entre el 21 de enero y el 20 de febrero. Si naciste en esas semanas, tu signo puede no ser el que dicen las tablas por año. Acá están las fechas de 1925 a 2030.",
    metaDescription:
      "Fechas del Año Nuevo chino de 1925 a 2030 con el signo y el elemento de cada año. Si naciste en enero o febrero, así sabés si tu signo es el del año anterior.",
    category: "Zodiaco Chino",
    date: "2026-10-19",
    image: "/blog/ano-nuevo-chino-fechas-signo.svg",
    author: "Equipo Molino",
    intro: [
      "Casi todas las tablas del zodíaco chino que circulan dicen algo como «1990: Caballo». Es cierto para la mayor parte de 1990, pero no para todo: el año del Caballo empezó el 27 de enero de 1990. Quien nació el 20 de enero de ese año es Serpiente, el signo de 1989.",
      "No es un detalle menor. El signo es lo único que el zodíaco chino usa para leer afinidades, y si está mal, todo lo que se lee después también lo está. Por eso en Molino tu signo sale de tu fecha completa, no del número del año.",
    ],
    sections: [
      {
        id: "por-que-cambia",
        heading: "Por qué el Año Nuevo chino no cae siempre el mismo día",
        paragraphs: [
          "El calendario chino tradicional es lunisolar: los meses siguen a la Luna y los años se ajustan al Sol. El año empieza con una luna nueva —en general, la segunda después del solsticio de invierno del hemisferio norte—, y como el ciclo lunar no coincide con el calendario que usamos, la fecha se corre de un año a otro.",
          "El resultado es una ventana fija: el Año Nuevo chino siempre cae entre el 21 de enero y el 20 de febrero. Antes de esa fecha seguís en el año anterior; desde ese día, en el nuevo.",
        ],
      },
      {
        id: "quien-tiene-que-fijarse",
        heading: "Quién tiene que fijarse",
        paragraphs: [
          "Si naciste entre el 1 de enero y el 20 de febrero, buscá tu año en la lista de abajo. Si tu cumpleaños es anterior a la fecha que figura, tu signo es el del año anterior. Si naciste del 21 de febrero en adelante, no hay duda posible: tu signo es el de tu año.",
          "Un ejemplo: alguien nacido el 5 de febrero de 1986. Ese año el Año Nuevo cayó el 9 de febrero, así que todavía corría el año del Buey de 1985. Su signo es Buey, no Tigre, aunque cualquier tabla por año diga Tigre.",
        ],
      },
      {
        id: "fechas",
        heading: "Fechas del Año Nuevo chino de 1925 a 2030",
        paragraphs: [
          "Cada línea dice qué día empezó ese año en el calendario chino y qué signo y elemento le corresponden desde esa fecha. Es la misma tabla que usa Molino para calcular tu signo.",
        ],
        list: Array.from({ length: 2030 - 1925 + 1 }, (_, i) => lunarNewYearLine(1925 + i)),
      },
      {
        id: "li-chun",
        heading: "¿Y el 4 de febrero?",
        paragraphs: [
          "Vas a encontrar quien diga que el signo cambia alrededor del 4 de febrero. Es otra convención legítima: la astrología de los Cuatro Pilares (BaZi) cuenta el año desde Li Chun, el comienzo de la primavera en el calendario solar chino, que cae el 3, 4 o 5 de febrero.",
          "Molino usa el Año Nuevo lunar, que es el que se celebra y el que la mayoría de la gente conoce como el cambio de signo. Si naciste entre esas dos fechas, las dos convenciones te van a dar signos distintos, y conviene saber de dónde sale cada uno.",
        ],
      },
    ],
    faq: [
      {
        q: "Nací el 21 de enero, ¿qué signo soy?",
        a: "Depende del año. En algunos años el Año Nuevo cayó justo ese día o antes, y en otros recién en febrero. Buscá tu año en la lista: si tu fecha es igual o posterior a la que figura, sos el signo de ese año; si es anterior, el del año anterior.",
      },
      {
        q: "¿La hora de nacimiento importa?",
        a: "Solo si naciste exactamente el día del Año Nuevo chino, y aun así la diferencia es de horas. Para todos los demás días, la fecha alcanza.",
      },
    ],
    related: ["zodiaco-chino-animal-personalidad", "doce-signos-zodiaco-chino", "cinco-elementos-zodiaco-chino"],
    featureLink: { href: "/profile", label: "Ver mi signo en Mi Mapa" },
  },
  {
    slug: "amigos-y-enemigo-zodiaco-chino",
    title: "Los dos amigos y el enemigo de cada signo del zodíaco chino",
    excerpt:
      "Cada signo del zodíaco chino tiene dos amigos y un enemigo, y se encuentran contando posiciones en el ciclo. La lista completa de los doce, y por qué alcanza con eso.",
    metaDescription:
      "Los dos amigos (San He) y el enemigo (Liu Chong) de cada uno de los 12 signos del zodíaco chino, cómo se calculan contando posiciones y cómo se usan.",
    category: "Zodiaco Chino",
    date: "2026-10-19",
    image: "/blog/amigos-y-enemigo-zodiaco-chino.svg",
    author: "Equipo Molino",
    intro: [
      "De todas las relaciones que la tradición china describe entre signos, hay dos que aparecen en cualquier fuente y que no dependen de interpretaciones: los amigos de la misma tríada (San He, 三合) y el opuesto directo en el ciclo (Liu Chong, 六冲).",
      "Molino usa solo esas, más tu propio signo. Tres casillas: con quién compartís el signo, quiénes son tus dos amigos y cuál es tu enemigo. El resto del ciclo no tiene una relación especial.",
    ],
    sections: [
      {
        id: "regla",
        heading: "La regla: contar posiciones en el ciclo",
        paragraphs: [
          "Poné los doce signos en un círculo, en su orden: Rata, Buey, Tigre, Gato, Dragón, Serpiente, Caballo, Cabra, Mono, Gallo, Perro y Cerdo. Tus dos amigos son los que están a cuatro posiciones de vos, para un lado y para el otro. Los tres juntos forman un triángulo equilátero dentro del círculo.",
          "Tu enemigo es el que está a seis posiciones: el signo de enfrente, en la otra punta del diámetro. Cada signo tiene exactamente uno.",
        ],
      },
      {
        id: "triadas",
        heading: "Los cuatro triángulos de amigos",
        paragraphs: [
          "Los doce signos se reparten en cuatro tríadas de tres. La tradición asocia cada una a un elemento, que no tiene que ver con el elemento de tu año: es el de la tríada.",
        ],
        list: SAN_HE_TRIADS.map((t) => `${t.animals.join(", ")}: tríada de ${t.element}.`),
      },
      {
        id: "lista",
        heading: "Amigos y enemigo de cada signo",
        paragraphs: [
          "La lista completa, en el orden del ciclo. Sale de los mismos datos con los que Molino arma tu mapa.",
        ],
        list: ANIMALS.map(
          (a) => `${a}: amigos ${ANIMAL_PROFILES[a].harmonyPartners.join(" y ")}; enemigo ${getClashPartner(a)}.`,
        ),
      },
      {
        id: "por-que-solo-estas",
        heading: "Por qué solo estas tres casillas",
        paragraphs: [
          "La tradición tiene más relaciones: pares armónicos (Liu He), pares que se dañan (Liu Hai), castigos. Existen y están documentadas, pero se superponen entre sí y dependen más de la escuela que de una regla. Si se usan todas, casi cualquier par de signos termina teniendo algo bueno y algo malo, y la lectura deja de decir algo.",
          "Con tres casillas la respuesta es clara: tu signo, tus dos amigos, tu enemigo. Los otros ocho signos quedan en el resto del ciclo, sin una relación especial, y eso también es información.",
        ],
      },
      {
        id: "como-usarlo",
        heading: "Cómo se usa",
        paragraphs: [
          "El orden de lectura es siempre el mismo: primero lo de tu propio signo, después lo de tus dos amigos, y por último lo del enemigo, que se lee como lo que conviene evitar. No es una condena ni una prohibición: es la relación de más tensión del ciclo, y saberlo sirve para elegir con los ojos abiertos.",
          "En Mi Mapa, Molino aplica esto a ciudades, equipos, universidades, personas, autos y más: cada entidad tiene un año de origen, ese año da su signo, y el signo la ubica en una de tus casillas.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Mi enemigo es incompatible conmigo?",
        a: "No en un sentido literal. La tradición lo describe como la relación de más fricción del ciclo. Muchas parejas, sociedades y amistades entre signos opuestos funcionan; la lectura solo te dice dónde está la tensión.",
      },
      {
        q: "¿Y el Liu He, el «amigo secreto»?",
        a: "Es real en la tradición, pero Molino lo deja fuera para no mezclar categorías. Cuenta como parte del resto del ciclo.",
      },
    ],
    related: ["compatibilidad-zodiaco-chino", "doce-signos-zodiaco-chino", "ano-nuevo-chino-fechas-signo"],
    featureLink: { href: "/profile", label: "Ver mis casillas en Mi Mapa" },
  },
  {
    slug: "doce-signos-zodiaco-chino",
    title: "Los 12 signos del zodíaco chino: orden, años y rasgos",
    excerpt:
      "Rata, Buey, Tigre, Gato, Dragón, Serpiente, Caballo, Cabra, Mono, Gallo, Perro y Cerdo: el orden del ciclo, los años de cada signo desde 1924 y los rasgos que les asigna la tradición.",
    metaDescription:
      "Los 12 signos del zodíaco chino en orden, con los años de cada uno de 1924 a 2031 y sus rasgos tradicionales. Incluye la aclaración para los nacidos en enero y febrero.",
    category: "Zodiaco Chino",
    date: "2026-10-19",
    image: "/blog/doce-signos-zodiaco-chino.svg",
    author: "Equipo Molino",
    intro: [
      "El zodíaco chino asigna un signo a cada año en un ciclo de doce. El orden no cambia nunca: después del Cerdo vuelve la Rata. Por eso, si sabés el signo de un año, sabés el de cualquier otro contando de a doce.",
      "Esta es la lista completa, con los años de cada signo y los tres rasgos que la tradición asocia a cada uno.",
    ],
    sections: [
      {
        id: "orden",
        heading: "El orden y la leyenda de la carrera",
        paragraphs: [
          "La explicación popular del orden es una leyenda: el Emperador de Jade convocó a los animales a una carrera, y el orden de llegada fijó el calendario. La Rata ganó viajando sobre el lomo del Buey y saltando a último momento; el Cerdo llegó último. Es un cuento, pero sirve para recordar la secuencia.",
          "El cuarto signo merece una aclaración: en China es el Conejo y en Vietnam el Gato. En Molino lo llamamos Gato. Si en otro lado leés «Conejo», es el mismo lugar del ciclo y los mismos años.",
        ],
      },
      {
        id: "signos",
        heading: "Los doce signos y sus años",
        paragraphs: [
          "Los años de cada signo de 1924 a 2031, y sus rasgos tradicionales. Ojo con enero y febrero: el signo cambia con el Año Nuevo chino, no el 1 de enero, así que si naciste en esas semanas, revisá la fecha exacta de tu año.",
        ],
        list: ANIMALS.map((a, i) => {
          const years = Array.from({ length: 9 }, (_, k) => 1924 + i + 12 * k);
          return `${a}: ${years.join(", ")}. Rasgos: ${ANIMAL_PROFILES[a].traits.join(", ").toLowerCase()}.`;
        }),
      },
      {
        id: "rasgos",
        heading: "Qué son los rasgos y qué no",
        paragraphs: [
          "Los rasgos son la forma en que la tradición resume el carácter de cada signo. Sirven como vocabulario, no como diagnóstico: nadie es solo «astuto» por ser Rata. Lo que el sistema sí ordena con precisión es la relación entre signos —quién es amigo y quién es opuesto—, porque sale de la posición en el ciclo y no de una opinión.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Conejo y Gato son el mismo signo?",
        a: "Sí. Ocupan el mismo lugar del ciclo (el cuarto) y los mismos años. China usa el Conejo y Vietnam el Gato; en Molino se llama Gato.",
      },
      {
        q: "¿Cómo calculo el signo de cualquier año?",
        a: "Contá de a doce desde un año conocido: 2020 fue Rata, entonces 2008, 1996 y 1984 también. Después revisá si la fecha cae antes del Año Nuevo chino.",
      },
    ],
    related: ["ano-nuevo-chino-fechas-signo", "amigos-y-enemigo-zodiaco-chino", "zodiaco-chino-animal-personalidad"],
    featureLink: { href: "/profile", label: "Ver mi signo en Mi Mapa" },
  },
  {
    slug: "cinco-elementos-zodiaco-chino",
    title: "Los cinco elementos del zodíaco chino: cómo saber el tuyo por el último dígito del año",
    excerpt:
      "Metal, Agua, Madera, Fuego y Tierra: el elemento de tu año sale del último dígito. Cómo se combina con los doce signos para formar el ciclo de 60 años.",
    metaDescription:
      "Cómo saber tu elemento del zodíaco chino por el último dígito de tu año de nacimiento, qué es el ciclo de 60 años y cómo se relacionan Metal, Agua, Madera, Fuego y Tierra.",
    category: "Zodiaco Chino",
    date: "2026-10-19",
    image: "/blog/cinco-elementos-zodiaco-chino.svg",
    author: "Equipo Molino",
    intro: [
      "Además del signo, cada año del calendario chino tiene un elemento: Metal, Agua, Madera, Fuego o Tierra. Juntos forman el nombre completo del año: 1990 fue Caballo de Metal; 2026, Caballo de Fuego.",
      "Saber el tuyo es fácil, porque depende de una sola cifra: la última de tu año de nacimiento.",
    ],
    sections: [
      {
        id: "regla",
        heading: "La regla del último dígito",
        paragraphs: [
          "Cada elemento dura dos años seguidos: el primero es yang (cifra par) y el segundo yin (cifra impar).",
        ],
        list: [
          "Termina en 0 o 1: Metal.",
          "Termina en 2 o 3: Agua.",
          "Termina en 4 o 5: Madera.",
          "Termina en 6 o 7: Fuego.",
          "Termina en 8 o 9: Tierra.",
        ],
      },
      {
        id: "enero-febrero",
        heading: "Si naciste en enero o febrero",
        paragraphs: [
          "La regla se aplica al año chino, no al calendario. Si naciste antes del Año Nuevo chino, tu año es el anterior, y con él cambian el signo y también el elemento.",
          "Ejemplo: el 5 de febrero de 1986 todavía era año 1985 en el calendario chino, que empezó el 20 de febrero de 1985 y terminó el 8 de febrero de 1986. Esa persona es Buey de Madera (yin), no Tigre de Fuego.",
        ],
      },
      {
        id: "ciclo-60",
        heading: "El ciclo de 60 años",
        paragraphs: [
          "Los doce signos y los cinco elementos (cada uno en su versión yang y yin, diez en total) avanzan a la vez, y la misma combinación tarda 60 años en repetirse. Por eso el Caballo de Fuego de 2026 es el mismo del año 1966, y el próximo será en 2086.",
          "En la tradición, cumplir 60 es completar el ciclo y volver al año en que se nació.",
        ],
      },
      {
        id: "relaciones",
        heading: "Cómo se relacionan los elementos",
        paragraphs: [
          "La teoría de los cinco elementos (Wu Xing) describe dos ciclos. En el de generación, cada elemento alimenta al siguiente: la Madera alimenta al Fuego, el Fuego deja Tierra, la Tierra produce Metal, el Metal recoge Agua y el Agua nutre la Madera. En el de control, cada uno frena a otro: la Madera a la Tierra, la Tierra al Agua, el Agua al Fuego, el Fuego al Metal y el Metal a la Madera.",
        ],
      },
      {
        id: "en-molino",
        heading: "Dónde aparece en Molino (y dónde no)",
        paragraphs: [
          "Tu elemento aparece en Mi Mapa, al lado de tu signo, como parte del nombre completo de tu año. No entra en las afinidades: ahí Molino compara signo contra signo y nada más, para que la lectura sea clara y se pueda verificar a mano.",
          "Tampoco hay que confundirlo con el elemento de una tríada de amigos (por ejemplo, la tríada de Fuego de Tigre, Caballo y Perro). Son dos clasificaciones distintas que comparten nombres.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Yin y yang cambian algo?",
        a: "Indican la mitad del par: el año par es la versión yang (más expansiva) del elemento y el impar la yin (más receptiva). Los dos años consecutivos tienen el mismo elemento.",
      },
    ],
    related: ["doce-signos-zodiaco-chino", "ano-nuevo-chino-fechas-signo", "zodiaco-chino-animal-personalidad"],
  },
  {
    slug: "numero-de-expresion-nombre",
    title: "Número de Expresión: cómo se calcula con tu nombre (con tildes y eñe)",
    excerpt:
      "El Número de Expresión sale de las letras de tu nombre completo. La tabla pitagórica, un ejemplo paso a paso y qué hacer con las tildes, la ñ y los nombres compuestos.",
    metaDescription:
      "Cómo calcular el Número de Expresión con tu nombre: tabla pitagórica de letras, ejemplo paso a paso, qué pasa con tildes y ñ, y qué significa cada número.",
    category: "Numerología",
    date: "2026-10-19",
    image: "/blog/numero-de-expresion-nombre.svg",
    author: "Equipo Molino",
    intro: [
      "Si el Número de Vida sale de tu fecha de nacimiento, el Número de Expresión sale de tu nombre. La numerología lo lee como la forma en que tus capacidades se ponen en juego: no hacia dónde vas, sino con qué herramientas.",
      "El cálculo es simple, pero en castellano tiene dos trampas que la mayoría de las calculadoras en inglés no resuelven: las tildes y la ñ.",
    ],
    sections: [
      {
        id: "tabla",
        heading: "La tabla pitagórica",
        paragraphs: [
          "Cada letra vale un número del 1 al 9, siguiendo el orden del alfabeto y volviendo a empezar cada nueve letras.",
        ],
        list: [
          "1: A, J, S",
          "2: B, K, T",
          "3: C, L, U",
          "4: D, M, V",
          "5: E, N, W",
          "6: F, O, X",
          "7: G, P, Y",
          "8: H, Q, Z",
          "9: I, R",
        ],
      },
      {
        id: "ejemplo",
        heading: "Ejemplo paso a paso",
        paragraphs: [
          "Tomemos «Ana López». A (1) + N (5) + A (1) = 7. L (3) + O (6) + P (7) + E (5) + Z (8) = 29. En total, 7 + 29 = 36, y 3 + 6 = 9. El Número de Expresión es 9.",
          "Igual que con el Número de Vida, si en algún paso de la reducción aparece 11, 22 o 33, se deja así: son números maestros y no se reducen.",
        ],
      },
      {
        id: "tildes-y-ene",
        heading: "Tildes, eñe y otros signos",
        paragraphs: [
          "Las tildes no cambian la letra: la ó de López vale lo mismo que una o, la í de María lo mismo que una i. La ñ se cuenta como n (5) y la ü como u. Espacios, guiones y apóstrofos no suman.",
          "Esto importa más de lo que parece: una calculadora que descarta las letras con tilde en vez de contarlas le saca una vocal a María, José o Martín y da otro número.",
        ],
      },
      {
        id: "que-nombre",
        heading: "Qué nombre usar",
        paragraphs: [
          "La tradición pitagórica usa el nombre completo de nacimiento, tal como figura en tu partida: todos los nombres y todos los apellidos. Es el que se considera tu nombre «de origen».",
          "Si usás otro nombre en la vida diaria —un apodo, un apellido de casada, un nombre artístico—, podés calcularlo también. Muchos numerólogos lo leen como la energía de esa etapa o de ese rol, sin reemplazar al de nacimiento.",
        ],
      },
      {
        id: "significados",
        heading: "Qué significa cada número",
        paragraphs: [
          "Los arquetipos son los mismos que en el Número de Vida; lo que cambia es la lectura. En el Número de Vida describen el camino; en el de Expresión, cómo lo recorrés.",
        ],
        list: NUMBERS.map(
          (n) => `${n.number} — ${n.title}: ${n.keywords.join(", ").toLowerCase()}.`,
        ),
      },
    ],
    faq: [
      {
        q: "¿Uso uno o los dos apellidos?",
        a: "En la tradición, todos los que figuran en tu nombre de nacimiento. En países donde se usan dos apellidos, van los dos.",
      },
      {
        q: "¿Qué pasa si me cambié el nombre?",
        a: "El de nacimiento sigue siendo tu Número de Expresión de base. El nuevo se puede leer aparte, como el tono de la etapa en la que lo adoptaste.",
      },
    ],
    related: ["numerologia-numero-de-vida", "numerologia-numeros-maestros", "numerologia-ano-personal"],
    featureLink: { href: "/profile", label: "Ver mis números en Mi Mapa" },
  },
  {
    slug: "fechas-signos-zodiaco-cuspide",
    title: "Fechas de los signos del zodíaco y qué pasa si naciste en la cúspide",
    excerpt:
      "Las fechas de los doce signos solares y por qué cambian un día según el año. Qué hacer si tu cumpleaños cae justo en el borde entre dos signos.",
    metaDescription:
      "Fechas de los 12 signos del zodíaco occidental, por qué varían un día según el año y cómo saber tu signo solar si naciste en la cúspide entre dos signos.",
    category: "Astrología",
    date: "2026-10-19",
    image: "/blog/fechas-signos-zodiaco-cuspide.svg",
    author: "Equipo Molino",
    intro: [
      "El signo solar es el signo en el que estaba el Sol el día que naciste. Las fechas de cada signo parecen fijas, pero no lo son del todo: el Sol cambia de signo en un momento preciso que se corre unas horas de un año a otro.",
      "Para casi todo el mundo da igual. Para quien nació en el borde entre dos signos —la «cúspide»—, es la diferencia entre un signo y otro.",
    ],
    sections: [
      {
        id: "fechas",
        heading: "Las fechas de los doce signos",
        paragraphs: [
          "Estas son las fechas habituales, que son también las que usa Molino.",
        ],
        list: [
          "Aries: 21 de marzo al 19 de abril.",
          "Tauro: 20 de abril al 20 de mayo.",
          "Géminis: 21 de mayo al 20 de junio.",
          "Cáncer: 21 de junio al 22 de julio.",
          "Leo: 23 de julio al 22 de agosto.",
          "Virgo: 23 de agosto al 22 de septiembre.",
          "Libra: 23 de septiembre al 22 de octubre.",
          "Escorpio: 23 de octubre al 21 de noviembre.",
          "Sagitario: 22 de noviembre al 21 de diciembre.",
          "Capricornio: 22 de diciembre al 19 de enero.",
          "Acuario: 20 de enero al 18 de febrero.",
          "Piscis: 19 de febrero al 20 de marzo.",
        ],
      },
      {
        id: "por-que-varian",
        heading: "Por qué las fechas se corren un día",
        paragraphs: [
          "El año del calendario dura 365 días, pero el Sol tarda unos 365 días y 6 horas en volver al mismo punto. Cada año el cambio de signo ocurre unas seis horas más tarde, hasta que el 29 de febrero lo vuelve a acomodar. Además, la hora depende del huso horario: el Sol puede entrar en Aries el 20 de marzo a la noche en Buenos Aires y el 21 de madrugada en Madrid.",
        ],
      },
      {
        id: "cuspide",
        heading: "Si naciste en la cúspide",
        paragraphs: [
          "En astrología no existen los signos intermedios: el Sol está en un signo o en el siguiente. Lo que sí existe es la duda sobre en cuál estaba. Si naciste el primer o el último día de un signo, la única forma de saberlo con certeza es una efeméride, que da la hora exacta del cambio en ese año; con tu hora y lugar de nacimiento, sale la respuesta.",
          "Molino usa la tabla de fechas habituales, sin hora. Si tu cumpleaños es un día de cambio, tomá el signo que te da como el más probable y verificalo con una efeméride si querés certeza.",
        ],
      },
      {
        id: "tropical",
        heading: "Signos y constelaciones no son lo mismo",
        paragraphs: [
          "Los signos de la astrología occidental se cuentan desde el equinoccio de marzo, en tramos iguales de 30 grados. Las constelaciones con el mismo nombre ya no coinciden con esos tramos por la precesión de los equinoccios, y por eso aparece cada tanto la noticia de que «cambiaron los signos». No cambiaron: son dos sistemas distintos, y el occidental siempre usó el primero.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Existe un signo número trece, Ofiuco?",
        a: "Ofiuco es una constelación por la que pasa el Sol, pero no un signo. La astrología occidental divide el cielo en doce tramos iguales que no dependen de las constelaciones.",
      },
    ],
    related: ["signo-astral-personalidad", "luna-ascendente-fecha-nacimiento-no-alcanza", "numerologia-astrologia-herramientas-no-oraculo"],
  },
  {
    slug: "diario-de-autoconocimiento",
    title: "Cómo llevar un diario de autoconocimiento (y para qué sirve de verdad)",
    excerpt:
      "Un diario no sirve para escribir lindo: sirve para tener datos sobre vos mismo. Cómo llevarlo para que, en unos meses, te muestre algo que no veías.",
    metaDescription:
      "Cómo llevar un diario de autoconocimiento útil: qué anotar, cada cuánto, cómo releerlo y cómo cruzarlo con tus ciclos sin forzar las conclusiones.",
    category: "Autoconocimiento",
    date: "2026-10-19",
    image: "/blog/diario-de-autoconocimiento.svg",
    author: "Equipo Molino",
    intro: [
      "La memoria no es un buen registro de uno mismo. Recordamos lo que confirma la historia que ya nos contamos y olvidamos lo que no encaja. Un diario corrige eso: deja escrito lo que pasó y lo que sentiste antes de que la memoria lo edite.",
      "No hace falta escribir bien ni mucho. Hace falta escribir parecido, seguido, y releer.",
    ],
    sections: [
      {
        id: "que-anotar",
        heading: "Qué anotar",
        paragraphs: [
          "Separá lo que pasó de lo que pensás de lo que pasó. «Discutí con mi hermano por la herencia» es un hecho; «siempre me deja solo con todo» es una interpretación. Las dos sirven, pero mezcladas no se pueden comparar después.",
        ],
        list: [
          "Qué pasó hoy que te importó, en una o dos líneas.",
          "Cómo te sentiste, con una palabra concreta (no «bien» o «mal»).",
          "Una decisión que tomaste o postergaste.",
          "Algo que se repitió de otro día.",
        ],
      },
      {
        id: "cada-cuanto",
        heading: "Cada cuánto y cuánto",
        paragraphs: [
          "Mejor cinco minutos todos los días que una hora una vez por mes. La regularidad es lo que permite ver patrones: un registro con huecos de semanas muestra los días excepcionales, no los comunes.",
          "Si un día no tenés nada, anotá eso. «Día sin novedad» también es un dato.",
        ],
      },
      {
        id: "releer",
        heading: "Releer es la mitad del trabajo",
        paragraphs: [
          "Una vez por mes, leé todo lo del mes de un tirón y anotá aparte lo que se repite: personas, situaciones, horarios, emociones. Ahí es donde el diario empieza a devolverte algo que no veías mientras lo escribías.",
        ],
      },
      {
        id: "ciclos",
        heading: "Cruzarlo con tus ciclos, sin forzarlo",
        paragraphs: [
          "Si usás tu Año Personal o tu día personal como marco, el diario es la forma de comprobarlo en vez de creerlo. Anotá primero lo que pasó y recién después mirá qué decía tu ciclo. Si coincide, bien; si no, también es información.",
          "El error más común es al revés: leer el ciclo a la mañana y después buscar en el día lo que lo confirma. Así cualquier sistema parece acertar.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Papel o digital?",
        a: "El que vayas a usar. El papel ayuda a escribir más despacio; lo digital, a buscar y releer. Lo que importa es que esté a mano a la misma hora todos los días.",
      },
      {
        q: "¿Dónde queda guardado el diario de Molino?",
        a: "En tu navegador. Molino no tiene un servidor donde guardar tu perfil ni lo que escribís.",
      },
    ],
    related: ["autoconocimiento-que-es-que-no", "numerologia-ano-personal", "mes-personal-dia-personal-numerologia"],
    featureLink: { href: "/journal", label: "Abrir mi diario" },
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: BlogCategory | "Todos"): BlogPost[] {
  if (category === "Todos") return BLOG_POSTS;
  return BLOG_POSTS.filter((post) => post.category === category);
}

export function getReadingTime(post: BlogPost): number {
  const wordsPerMinute = 200;
  const text = [
    ...post.intro,
    ...post.sections.flatMap((s) => [...s.paragraphs, ...(s.list ?? [])]),
  ]
    .join(" ")
    .trim();
  const words = text.length > 0 ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
