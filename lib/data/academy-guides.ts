/**
 * Academy Guides — Guías temáticas de "cómo funciona Molino".
 *
 * Distintas de ACADEMY_PIECES (academy-content.ts): las piezas cuentan la
 * historia de las tradiciones; estas guías explican cómo Molino usa esas
 * tradiciones hoy, en el producto real. Contenido fijo y editorial — no se
 * genera con IA ni depende del perfil (el perfil solo agrega el bloque
 * "En tu mapa" vía ProfileBridge).
 *
 * Fase 1: solo 4 guías, elegidas por utilidad real, no por cantidad.
 */

export interface AcademyGuideLink {
  label: string;
  href: string;
}

export interface AcademyGuideExample {
  title: string;
  body: string;
}

export interface AcademyGuide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  metaDescription: string;
  /** "Qué vas a aprender" — 3 a 5 bullets. */
  whatYouLearn: string[];
  /** "Qué es" — 1-2 párrafos. */
  whatIs: string[];
  /** "Cómo funciona" — 1-3 párrafos, explicación humana (no nombres de función). */
  howItWorks: string[];
  /** "Cómo lo usa Molino" — 1-2 párrafos. */
  howMolinoUsesIt: string[];
  /** Separación explícita dato / tradición / lectura de Molino. */
  dato: string;
  tradicion: string;
  molino: string;
  /** Ejemplos concretos (guía 3 usa 3; las demás pueden tener 0). */
  examples?: AcademyGuideExample[];
  /** "Qué NO significa" — límites explícitos de la interpretación. */
  whatItDoesNotMean: string[];
  /** Links reales hacia superficies del producto, mostrados "en tu mapa" y "dónde seguir". */
  exploreLinks: AcademyGuideLink[];
}

export const ACADEMY_GUIDES: AcademyGuide[] = [
  {
    id: "como-funciona-tu-mapa",
    slug: "como-funciona-tu-mapa",
    title: "Cómo funciona tu mapa",
    subtitle: "Las seis superficies de Molino y qué pregunta responde cada una.",
    metaDescription:
      "Mi Mapa, Hoy, Afinidades, Journal, Año y Mes: qué pregunta responde cada superficie de Molino y cómo se conectan entre sí.",
    whatYouLearn: [
      "Qué es cada superficie de Molino y para qué sirve",
      "Qué pregunta podés hacerle a cada una",
      "Cómo se relacionan entre sí (todas parten del mismo perfil)",
      "Por dónde seguir explorando según lo que quieras entender",
    ],
    whatIs: [
      "Molino no es una sola pantalla: es un conjunto de superficies que leen el mismo perfil desde ángulos distintos. Cada una existe para responder una pregunta concreta, no para repetir lo que ya viste en otra.",
      "Todas parten del mismo cálculo — tu fecha de nacimiento y, si lo diste, tu nombre — hecho una sola vez cuando armaste tu mapa. Lo que cambia entre superficies es el recorte: identidad fija, momento presente, relación con el mundo, o el arco de tiempo largo.",
    ],
    howItWorks: [
      "Mi Mapa responde ¿quién soy según los sistemas que usa Molino? Ahí están tu Camino de Vida, tu signo solar y tu animal del zodíaco chino: los datos base que no cambian con la fecha.",
      "Hoy responde ¿qué está activo para mí ahora? Combina tu día personal, tu año personal y la fase lunar del día para armar el Consejo del Momento — se explica en detalle en la guía de Hoy.",
      "Afinidades responde ¿con qué entidades del mundo comparto una resonancia simbólica según mi animal del zodíaco chino? Países, ciudades, marcas, universidades, famosos, películas y equipos, comparados con vos por la relación tradicional entre animales (ver la guía de afinidades).",
      "Journal responde ¿qué quiero registrar y observar de mi propio recorrido? Es el único espacio donde el contenido lo escribís vos, no Molino.",
      "Año (Evolution) responde ¿en qué ciclo largo estoy? Mira el arco de tiempo más amplio que tu Año Personal, con perspectiva sobre patrones que no se ven día a día.",
      "Mes (Calendario) responde ¿qué cambia durante este período? Es la vista intermedia entre el detalle diario de Hoy y el arco largo de Año.",
    ],
    howMolinoUsesIt: [
      "Ninguna superficie inventa un dato nuevo: todas leen del mismo perfil calculado una sola vez. Esto es deliberado — es la razón por la que Molino no tiene base de datos ni servidor para tu perfil: todo vive en tu navegador y se recalcula localmente cada vez.",
    ],
    dato: "Tu fecha de nacimiento (y tu nombre, si lo diste) es el único dato de entrada. Se calcula una sola vez y todas las superficies lo reutilizan.",
    tradicion: "Cada superficie se apoya en una tradición distinta: numerología para Camino de Vida y ciclos personales, astrología occidental para el signo solar, zodíaco chino para el animal y las afinidades.",
    molino: "Molino no fusiona las tradiciones en un solo número: las muestra por separado y las conecta contigo — vos decidís qué explorar y cuándo.",
    whatItDoesNotMean: [
      "Ninguna superficie predice el futuro ni te dice qué hacer: son lecturas simbólicas, no instrucciones.",
      "No hay una superficie 'más importante' que otra — cada una responde una pregunta distinta, no una versión resumida de las demás.",
    ],
    exploreLinks: [
      { label: "Ver Mi Mapa", href: "/profile" },
      { label: "Ver Hoy", href: "/hoy" },
      { label: "Ver Afinidades", href: "/affinity" },
      { label: "Ver Mi Journal", href: "/journal" },
      { label: "Ver Año", href: "/evolution" },
      { label: "Ver Mes", href: "/calendario" },
    ],
  },
  {
    id: "como-funciona-el-zodiaco-chino",
    // "zodiaco-chino" ya es el slug de la pieza histórica en ACADEMY_PIECES
    // (academy-content.ts) — esta guía es distinta (how-to, no historia) y
    // necesita su propio slug para no pisar esa ruta.
    slug: "como-funciona-el-zodiaco-chino",
    title: "Zodíaco chino: cómo se calcula tu animal",
    subtitle: "El ciclo de 12 animales, el límite real del Año Nuevo chino y las relaciones tradicionales que usa Molino.",
    metaDescription:
      "Cómo Molino calcula tu animal del zodíaco chino a partir de tu fecha de nacimiento, y qué significan mismo animal, tríada y opuesto.",
    whatYouLearn: [
      "Cómo se determina tu animal a partir de tu fecha de nacimiento",
      "Por qué el Año Nuevo chino no cae el 1 de enero, y por qué eso importa",
      "Qué significan 'mismo animal', 'tríada' y 'opuesto'",
      "Dónde aparece cada uno de estos conceptos dentro de Molino",
    ],
    whatIs: [
      "El zodíaco chino agrupa los años en un ciclo de 12: Rata, Buey, Tigre, Gato, Dragón, Serpiente, Caballo, Cabra, Mono, Gallo, Perro y Cerdo. Cada persona nace bajo uno de esos doce animales, según el año — no el mes — de su nacimiento.",
    ],
    howItWorks: [
      "Tu animal se obtiene a partir de tu fecha de nacimiento completa, y respeta el límite real del Año Nuevo chino — que no es fijo como el 1 de enero, sino que cae entre fines de enero y mediados de febrero según el año. Por eso alguien nacido, por ejemplo, el 20 de enero puede pertenecer al animal del año anterior, aunque el calendario occidental ya haya cambiado de año.",
      "Cuando Molino solo cuenta con el año de nacimiento de una entidad (sin fecha exacta), no puede aplicar ese límite con precisión: en ese caso usa una fecha de referencia dentro del año (después del Año Nuevo chino) y lo marca como aproximado. Nunca presenta una fecha estimada como si fuera exacta.",
    ],
    howMolinoUsesIt: [
      "Además del animal, cada uno tiene un elemento asociado dentro del ciclo de 60 años del sistema tradicional (Madera, Fuego, Tierra, Metal, Agua). Molino muestra el elemento cuando el perfil lo tiene calculado.",
      "La relación entre dos animales — el tuyo y el de otra persona o entidad — es la base del sistema de Afinidades. Molino usa exactamente tres relaciones documentadas:",
    ],
    dato: "Tu fecha de nacimiento exacta. Es el único dato necesario — no hace falta hora ni lugar de nacimiento para calcular el animal.",
    tradicion: "El sistema tradicional chino de doce animales, con sus agrupaciones de tríadas (San He, 三合) y sus oposiciones directas en el ciclo (Liu Chong, 六冲) — documentadas en textos y enciclopedias especializadas, no inventadas por Molino.",
    molino: "Molino calcula tu animal, identifica su elemento y usa las relaciones tradicionales (mismo animal, tríada, opuesto) como base del sistema de Afinidades — nunca como un puntaje aislado.",
    examples: [
      {
        title: "Mismo animal",
        body: "Dos personas — o una persona y una entidad — que comparten el mismo animal comparten, según la tradición, fortalezas naturales pero también los mismos puntos ciegos.",
      },
      {
        title: "Tríada (San He)",
        body: "Los doce animales se agrupan en cuatro tríadas de tres, cada una asociada a un elemento oculto: Rata-Dragón-Mono (Agua), Buey-Serpiente-Gallo (Metal), Tigre-Caballo-Perro (Fuego), Gato-Cabra-Cerdo (Madera). Pertenecer a la misma tríada es, en la tradición, una de las combinaciones más armoniosas del sistema.",
      },
      {
        title: "Opuesto (Liu Chong)",
        body: "Cada animal tiene exactamente un opuesto directo en el ciclo de doce años: Rata-Caballo, Buey-Cabra, Tigre-Mono, Gato-Gallo, Dragón-Perro, Serpiente-Cerdo. La tradición lo describe como una relación de tensión, no de incompatibilidad.",
      },
    ],
    whatItDoesNotMean: [
      "Tu animal no determina tu personalidad ni tu destino — es un dato calculado a partir de tu fecha de nacimiento, leído dentro de una tradición cultural.",
      "'Opuesto' no significa 'incompatible': en la tradición es una relación de tensión, no una advertencia.",
    ],
    exploreLinks: [
      { label: "Ver mi animal en Mi Mapa", href: "/profile" },
      { label: "Explorar Afinidades", href: "/affinity" },
      { label: "Conocé el origen del zodíaco chino", href: "/academy/zodiaco-chino" },
    ],
  },
  {
    id: "como-leer-una-afinidad",
    slug: "como-leer-una-afinidad",
    title: "Cómo leer una afinidad",
    subtitle: "Dato, tradición y lectura de Molino: las tres capas de cada página de Afinidades.",
    metaDescription:
      "Aprendé a distinguir el dato documentado, la tradición simbólica y la lectura de Molino en cada página de Afinidades — sin porcentajes inventados.",
    whatYouLearn: [
      "Qué dato concreto conoce Molino de cada entidad",
      "Qué relación simbólica surge entre tu animal y el de la entidad",
      "Cómo Molino presenta esa relación, sin inventar un puntaje de compatibilidad",
      "Qué NO te está diciendo una afinidad",
    ],
    whatIs: [
      "Una página de Afinidad compara tu animal del zodíaco chino con el de una entidad real — un país, una ciudad, una marca, una universidad, un famoso, una película o un equipo. No mide compatibilidad ni predice nada: muestra una relación simbólica documentada entre dos animales.",
    ],
    howItWorks: [
      "Todo empieza con un dato verificable: el evento histórico principal de esa entidad, con su fecha y su año — una fundación, una creación, un lanzamiento, según corresponda. Molino usa exclusivamente ese evento para calcular el animal de la entidad, de la misma forma que calcula el tuyo a partir de tu fecha de nacimiento.",
      "Con los dos animales — el tuyo y el de la entidad — Molino busca la relación tradicional entre ambos: si comparten el mismo animal, si pertenecen a la misma tríada, si son animales opuestos en el ciclo, o si no tienen una relación especial documentada.",
      "Esa relación es la que se muestra en la página, junto con el evento que le da origen. Nunca aparece separada del dato histórico que la sostiene.",
    ],
    howMolinoUsesIt: [
      "Molino agrupa el resultado en categorías con nombre propio — no en un porcentaje: resonancia alta, afinidad media, complementarios, desafiante o distante. Estas categorías describen qué tan fuerte es la relación tradicional entre los animales, no si la entidad es 'buena' o 'mala' para vos.",
      "El número interno que ordena esas categorías nunca se muestra: lo que ves es siempre el nombre de la categoría y la explicación de por qué, con la entidad y el evento nombrados — nunca una frase genérica.",
    ],
    dato: "El nombre de la entidad, su tipo, y el evento histórico documentado (con fecha, fuente y nivel de certeza) que Molino usa para calcular su animal. Si la fecha exacta no se conoce, Molino usa el año y lo marca como aproximado — nunca lo presenta como una fecha exacta.",
    tradicion: "La relación entre el animal del usuario y el animal de la entidad, según el sistema tradicional del zodíaco chino: mismo animal, tríada (San He), par armonioso (Liu He), opuesto (Liu Chong) o sin relación especial documentada (neutral).",
    molino: "Molino traduce esa relación en una categoría con nombre (resonancia alta, afinidad media, complementarios, desafiante, distante) y una explicación que nombra la entidad y su evento real. No hay porcentaje visible, no hay fórmula secreta: la categoría sale directamente del tipo de relación tradicional.",
    examples: [
      {
        title: "Mismo animal — Spider-Man (2002)",
        body: "El estreno de Spider-Man en 2002 corresponde al año del Caballo. Si tu animal también es Caballo, la relación es 'mismo animal': comparten, según la tradición, fortalezas naturales y también los mismos puntos ciegos.",
      },
      {
        title: "Tríada — YPF (1922)",
        body: "YPF fue fundada en 1922, año del Perro. El Perro forma tríada (San He, elemento Fuego) con el Tigre y el Caballo. Si tu animal es Tigre o Caballo, la relación con YPF es 'tríada': una de las combinaciones que la tradición considera más armoniosas.",
      },
      {
        title: "Opuesto — Corrientes (1588)",
        body: "La ciudad de Corrientes fue fundada en 1588, año de la Rata. La Rata es el opuesto tradicional (Liu Chong) del Caballo. Si tu animal es Caballo, la relación con Corrientes es 'opuesto': una relación de tensión según el ciclo de doce años, no una advertencia.",
      },
    ],
    whatItDoesNotMean: [
      "Una afinidad no predice cómo será una relación ni determina si algo es bueno o malo para vos. Es una lectura simbólica construida a partir de datos documentados y una tradición interpretativa.",
      "Molino no mide 'compatibilidad' en ningún sentido científico ni psicológico — no hay estudio, encuesta ni algoritmo de predicción detrás de una afinidad.",
      "Un resultado 'desafiante' u 'opuesto' no es una alerta: es, según la tradición, una relación de tensión — ni más ni menos.",
    ],
    exploreLinks: [
      { label: "Explorar Afinidades", href: "/affinity" },
      { label: "Cómo se calcula tu animal", href: "/academy/como-funciona-el-zodiaco-chino" },
    ],
  },
  {
    id: "como-funciona-hoy",
    slug: "como-funciona-hoy",
    title: "Cómo funciona Hoy",
    subtitle: "El Consejo del Momento no es una frase al azar: así se arma con tu ciclo y el día.",
    metaDescription:
      "Cómo se arma el Consejo del Momento en Hoy: día personal, año personal y fase lunar, y por qué el resultado es el mismo si volvés a entrar el mismo día.",
    whatYouLearn: [
      "Qué es el Consejo del Momento y de dónde sale",
      "Qué significan Foco, Evitar, Luna y Año Personal en la pantalla de Hoy",
      "Por qué el resultado es determinista, no aleatorio",
      "Cómo cambia la lectura con el paso del tiempo",
    ],
    whatIs: [
      "Hoy es la superficie de Molino que responde qué está activo para mí ahora. Todo lo que ves ahí — el Consejo del Momento, el foco del día, lo que conviene evitar, la fase lunar y tu Año Personal — sale de combinar tu fecha de nacimiento con la fecha de hoy.",
    ],
    howItWorks: [
      "El Consejo del Momento no se elige al azar: depende del día personal que te corresponde según tu ciclo. Tu día personal es un número que resulta de combinar tu fecha de nacimiento con la fecha de hoy, y ese número tiene asociada una acción concreta dentro de la tradición numerológica. Si volvés a entrar el mismo día, vas a ver exactamente el mismo consejo — no cambia entre visitas.",
      "Debajo del consejo, Molino muestra la evidencia que lo sostiene: tu Foco del momento (una palabra que resume tu energía del día, como Acción, Construcción o Descanso, según qué tan favorable esté el puntaje general), la fase de la Luna del día, tu Año Personal, y a veces el área de tu vida más favorecida ese día. Cada uno de esos datos sale de un cálculo propio, no de una sola fórmula que mezcla todo en un número final.",
      "El foco y lo que conviene evitar se arman con la misma lógica: cada día personal tiene, según la tradición numerológica, un tipo de energía asociada, y de ahí sale qué conviene priorizar y qué conviene posponer ese día en particular.",
    ],
    howMolinoUsesIt: [
      "La fase lunar del día también influye en el puntaje general de energía y en qué áreas aparecen más favorecidas — es una señal más, no la única.",
      "Tu Año Personal es el ciclo más amplio de los que aparecen en Hoy: cambia una vez al año, mientras que tu día personal cambia todos los días. Para entender cómo se calcula el Año Personal en profundidad, Molino tiene una guía dedicada en el blog.",
    ],
    dato: "Tu fecha de nacimiento y la fecha de hoy. Con esas dos fechas se calcula tu día personal y tu año personal — sin necesitar ningún otro dato tuyo.",
    tradicion: "La tradición numerológica asigna un tema y una energía distinta a cada uno de los nueve días personales posibles (más los números maestros 11, 22 y 33), y la tradición astrológica-lunar asocia cada fase de la Luna con una cualidad distinta del día.",
    molino: "Molino combina el tema del día personal con la fase lunar del día para dar una orientación de una sola línea, siempre acompañada de la evidencia que la sostiene — nunca como una frase suelta sin origen.",
    whatItDoesNotMean: [
      "El Consejo del Momento no es una predicción de lo que va a pasar hoy: es una orientación basada en un cálculo determinista, pensada como punto de partida para decidir, no como un mandato.",
      "No es generado por inteligencia artificial ni cambia si volvés a cargar la página el mismo día — el mismo cálculo da siempre el mismo resultado.",
    ],
    exploreLinks: [
      { label: "Ver Hoy", href: "/hoy" },
      { label: "Cómo se calcula el Año Personal", href: "/blog/numerologia-ano-personal" },
    ],
  },
];

export function getAcademyGuideBySlug(slug: string): AcademyGuide | undefined {
  return ACADEMY_GUIDES.find((guide) => guide.slug === slug);
}
