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
    related: ["signo-astral-personalidad", "zodiaco-chino-animal-personalidad"],
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
    related: ["numerologia-numero-de-vida", "signo-astral-personalidad"],
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
    related: ["numerologia-numero-de-vida", "zodiaco-chino-animal-personalidad"],
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
