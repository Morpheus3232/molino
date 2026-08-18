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
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "numerologia-numero-de-vida",
    title: "Qué significa tu Número de Vida según la Numerología",
    excerpt:
      "El Número de Vida (o Camino de Vida) se calcula con tu fecha de nacimiento y revela la dirección central de tu personalidad. Aprendé a calcularlo y a leerlo.",
    metaDescription:
      "Descubrí qué es el Número de Vida en la numerología, cómo se calcula desde tu fecha de nacimiento y qué revela cada número sobre tu personalidad y propósito.",
    category: "Numerología",
    date: "2026-08-13",
    image: "/blog/numerologia-numero-de-vida.svg",
    author: "Equipo Molino",
    intro: [
      "En numerología, tu Número de Vida —también llamado Camino de Vida o Life Path— es el dato más importante de tu mapa. Se deriva únicamente de tu fecha de nacimiento y describe la dirección general que tiende a tomar tu vida: tus dones, tus desafíos y el tipo de experiencias que vas a buscar una y otra vez.",
      "A diferencia de los números que salen de tu nombre (Expresión, Alma, Personalidad), el Número de Vida no cambia y no depende de cómo te llamen. Es tu punto de partida. Por eso casi toda la numerología moderna —desde las escuelas pitagóricas hasta las aplicaciones actuales— empieza por acá.",
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
    title: "El Año Personal en numerología: cómo funciona y cómo usarlo para planificar",
    excerpt:
      "El Año Personal es el ciclo de nueve años que se mueve dentro de tu numerología. Aprendé cómo se calcula, qué representa cada año del ciclo y cómo usarlo para planificar sin caer en el determinismo.",
    metaDescription:
      "Descubrí qué es el Año Personal en numerología, cómo calcularlo a partir de tu cumpleaños y qué representa cada uno de los 9 años del ciclo para planificar tu año con más criterio.",
    category: "Numerología",
    date: "2026-08-16",
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
    title: "Números Maestros: qué significan el 11, el 22 y el 33",
    excerpt:
      "Los números maestros (11, 22 y 33) no se reducen como el resto y pueden aparecer en cuatro lugares distintos de tu mapa. Aprendé qué representan y por qué el mismo maestro se lee distinto según dónde cae.",
    metaDescription:
      "Qué son los números maestros 11, 22 y 33 en numerología, por qué no se reducen, en qué cuatro posiciones de tu mapa pueden aparecer y cómo se lee cada uno según dónde cae.",
    category: "Numerología",
    date: "2026-08-18",
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
        id: "cuatro-posiciones",
        heading: "Las cuatro posiciones donde puede aparecer un maestro",
        paragraphs: [
          "Un error común es pensar que los números maestros solo aparecen en el Número de Vida. En realidad pueden salir en cualquiera de los cuatro números centrales de un mapa numerológico, y cada posición describe una parte distinta de la persona.",
        ],
        list: [
          "Camino de Vida: la trayectoria completa — se calcula con la fecha de nacimiento entera.",
          "Expresión: cómo te comunicás y te mostrás hacia afuera — se calcula con el nombre completo.",
          "Alma: tu motivación interna, lo que buscás aunque no lo digas — se calcula con las vocales del nombre.",
          "Personalidad: la primera impresión que das — se calcula con las consonantes del nombre.",
        ],
      },
      {
        id: "el-mismo-numero-distinto-lugar",
        heading: "Por qué el mismo maestro se lee distinto según dónde cae",
        paragraphs: [
          "Un 11 en el Camino de Vida describe una trayectoria completa marcada por la intuición y la sensibilidad elevada — es el eje de toda la vida. El mismo 11 en el número de Alma no describe tu trayectoria: describe una motivación interna, el tipo de sentido que buscás aunque no se note desde afuera. Y en Personalidad describe algo todavía más acotado: la impresión que generás en los primeros minutos de conocer a alguien.",
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
        a: "Sí. Como el Camino de Vida, la Expresión, el Alma y la Personalidad se calculan por separado, es posible (aunque poco común) que más de una posición dé un número maestro. Cada una se lee de forma independiente según lo que representa esa posición.",
      },
      {
        q: "¿Por qué algunas lecturas también muestran la versión reducida (2, 4 o 6)?",
        a: "Porque muchos numerólogos leen el maestro y su reducción juntos: el maestro como la energía elevada y su reducción como el 'piso' al que se puede volver cuando esa intensidad pesa demasiado. Ambas lecturas son complementarias, no contradictorias.",
      },
    ],
    related: ["numerologia-numero-de-vida", "signo-astral-personalidad", "numerologia-ano-personal"],
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
