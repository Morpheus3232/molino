/**
 * Academy Guides — Guías temáticas de "cómo funciona Molino".
 *
 * Distintas de ACADEMY_PIECES (academy-content.ts): las piezas cuentan la
 * historia de las tradiciones; estas guías explican cómo Molino usa esas
 * tradiciones hoy, en el producto real. Contenido fijo y editorial — no se
 * genera con IA ni depende del perfil (el perfil solo agrega el bloque
 * "En tu mapa" vía ProfileBridge).
 *
 * Fase 2: 6 guías, elegidas por utilidad real, no por cantidad.
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
      "Mi Mapa responde ¿quién soy según los sistemas que usa Molino? Ahí están tu Camino de Vida, tu signo solar y tu signo del zodíaco chino: los datos base que no cambian con la fecha.",
      "Hoy responde ¿qué está activo para mí ahora? Combina tu día personal, tu año personal y la fase lunar del día para armar el Consejo del Momento — se explica en detalle en la guía de Hoy.",
      "Afinidades responde ¿en qué casilla de mi ciclo cae cada entidad del mundo? Países, ciudades, marcas, universidades, famosos y películas, comparados signo contra signo con el tuyo: tu propio signo, tus dos amigos, tu enemigo o el resto (ver la guía de afinidades).",
      "Journal responde ¿qué quiero registrar y observar de mi propio recorrido? Es el único espacio donde el contenido lo escribís vos, no Molino.",
      "Año (Evolution) responde ¿en qué ciclo largo estoy? Mira el arco de tiempo más amplio que tu Año Personal, con perspectiva sobre patrones que no se ven día a día.",
      "Mes (Calendario) responde ¿qué cambia durante este período? Es la vista intermedia entre el detalle diario de Hoy y el arco largo de Año.",
    ],
    howMolinoUsesIt: [
      "Ninguna superficie inventa un dato nuevo: todas leen del mismo perfil calculado una sola vez. Esto es deliberado — es la razón por la que Molino no tiene base de datos ni servidor para tu perfil: todo vive en tu navegador y se recalcula localmente cada vez.",
    ],
    dato: "Tu fecha de nacimiento (y tu nombre, si lo diste) es el único dato de entrada. Se calcula una sola vez y todas las superficies lo reutilizan.",
    tradicion: "Cada superficie se apoya en una tradición distinta: numerología para Camino de Vida y ciclos personales, astrología occidental para el signo solar, zodíaco chino para tu signo chino y las afinidades.",
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
    title: "Zodíaco chino: cómo se calcula tu signo",
    subtitle: "El ciclo de doce signos, el límite real del Año Nuevo chino y las tres relaciones que usa Molino.",
    metaDescription:
      "Cómo Molino calcula tu signo del zodíaco chino a partir de tu fecha de nacimiento, y qué son tu propio signo, tus dos amigos y tu enemigo.",
    whatYouLearn: [
      "Cómo se determina tu signo a partir de tu fecha de nacimiento",
      "Por qué el Año Nuevo chino no cae el 1 de enero, y por qué eso importa",
      "Qué son tu propio signo, tus dos amigos y tu enemigo",
      "Dónde aparece cada uno de estos conceptos dentro de Molino",
    ],
    whatIs: [
      "El zodíaco chino agrupa los años en un ciclo de 12: Rata, Buey, Tigre, Gato, Dragón, Serpiente, Caballo, Cabra, Mono, Gallo, Perro y Cerdo. Cada persona nace bajo uno de esos doce signos, según el año chino — no el mes — de su nacimiento.",
    ],
    howItWorks: [
      "Tu signo se obtiene a partir de tu fecha de nacimiento completa, y respeta el límite real del Año Nuevo chino — que no es fijo como el 1 de enero, sino que cae entre el 21 de enero y el 20 de febrero según el año. Por eso alguien nacido, por ejemplo, el 20 de enero puede pertenecer al signo del año anterior, aunque el calendario occidental ya haya cambiado de año.",
      "Lo mismo vale para las entidades del Atlas. Si de una solo se conoce el año, no se puede saber su signo con certeza, y Mi Mapa no la usa: preferimos una lista más corta que una recomendación construida sobre una duda.",
    ],
    howMolinoUsesIt: [
      "Además del signo, cada año tiene un elemento (Madera, Fuego, Tierra, Metal, Agua) dentro del ciclo de 60 años. Molino lo muestra junto a tu signo, pero no lo usa en las afinidades: ahí compara signo contra signo y nada más.",
      "La relación entre dos signos — el tuyo y el de una entidad — es la base de las Afinidades y de Mi Mapa. Molino usa tres casillas, en este orden:",
    ],
    dato: "Tu fecha de nacimiento exacta. Es el único dato necesario — no hace falta hora ni lugar de nacimiento para calcular el signo.",
    tradicion: "El ciclo tradicional chino de doce signos, con sus cuatro triángulos de amigos (三合 San He) y sus seis pares de opuestos (六冲 Liu Chong) — documentados en textos y enciclopedias especializadas, no inventados por Molino. La tradición tiene más relaciones (Liu He, Liu Hai); Molino las deja en el resto del ciclo.",
    molino: "Molino calcula tu signo y lo compara signo contra signo: tu propio signo, tus dos amigos o tu enemigo. Es una casilla, nunca un puntaje.",
    examples: [
      {
        title: "Tu propio signo · 本命",
        body: "Dos personas — o una persona y una entidad — del mismo signo comparten, según la tradición, fortalezas naturales pero también los mismos puntos ciegos.",
      },
      {
        title: "Tus dos amigos · 三合 San He",
        body: "Los doce signos se agrupan en cuatro triángulos de amigos, separados por cuatro posiciones del ciclo y asociados a un elemento oculto: Rata-Dragón-Mono (Agua), Buey-Serpiente-Gallo (Metal), Tigre-Caballo-Perro (Fuego), Gato-Cabra-Cerdo (Madera). Tus dos amigos son los otros dos de tu triángulo.",
      },
      {
        title: "Tu enemigo · 六冲 Liu Chong",
        body: "Cada signo tiene exactamente un enemigo: el opuesto directo, a seis posiciones en el ciclo. Los seis pares son Rata-Caballo, Buey-Cabra, Tigre-Mono, Gato-Gallo, Dragón-Perro y Serpiente-Cerdo. Se lee como lo que conviene evitar, no como una condena.",
      },
    ],
    whatItDoesNotMean: [
      "Tu signo no determina tu personalidad ni tu destino — es un dato calculado a partir de tu fecha de nacimiento, leído dentro de una tradición cultural.",
      "'Enemigo' no significa 'incompatible': es la relación de más tensión del ciclo, y saberlo sirve para elegir con los ojos abiertos.",
    ],
    exploreLinks: [
      { label: "Ver mi signo en Mi Mapa", href: "/profile" },
      { label: "Explorar Afinidades", href: "/affinity" },
      { label: "Conocé el origen del zodíaco chino", href: "/academy/zodiaco-chino" },
    ],
  },
  {
    id: "como-se-arma-mi-mapa",
    slug: "como-se-arma-mi-mapa",
    title: "Cómo se arma Mi Mapa",
    subtitle: "Signo contra signo, tres casillas y un orden que no cambia el resultado.",
    metaDescription:
      "Cómo Mi Mapa cruza tu signo del zodíaco chino con ciudades, universidades, personas y marcas: las tres casillas, y por qué tu país ordena pero nunca puntúa.",
    whatYouLearn: [
      "Qué compara Mi Mapa y qué deja afuera a propósito",
      "Qué son las tres casillas: tu propio signo, tus dos amigos y tu enemigo",
      "Por qué tu país cambia el orden de la lista pero no el resultado",
      "Por qué algunos rubros todavía no aparecen",
    ],
    whatIs: [
      "Mi Mapa responde una sola pregunta: dónde toca el mundo tu signo del zodíaco chino. Toma entidades reales —ciudades y países, universidades, personas, películas, autos, ropa— y las ubica según la relación entre su signo y el tuyo.",
    ],
    howItWorks: [
      "Cada entidad tiene una fecha de origen documentada: la fundación de una ciudad o un club, el nacimiento de una persona, el estreno de una película. Esa fecha da su signo, con el mismo corte de Año Nuevo chino que se usa para el tuyo.",
      "Después se compara signo contra signo, y cada entidad cae en una de cuatro casillas: tu propio signo, uno de tus dos amigos (San He), tu enemigo (Liu Chong) o el resto del ciclo. Se muestran las tres primeras, en ese orden; la del enemigo se lee como lo que conviene evitar.",
      "Dentro de cada casilla hay un orden: primero hasta tres entidades de tu país y después el mundo; en personas, primero las nacidas dentro de una vuelta del ciclo de la tuya (doce años para cada lado); en marcas, las de gama alta van al final. Ese orden decide qué ves primero, nunca en qué casilla está algo.",
    ],
    howMolinoUsesIt: [
      "La regla es una sola y se puede verificar a mano: año de origen, signo, relación con el tuyo. No entran la numerología, el signo solar ni los elementos: esas capas tienen su propia sección.",
      "Un rubro aparece cuando tiene al menos doce entidades con fecha exacta, una por signo del ciclo. Con menos, la mitad de los signos vería un bloque vacío, así que se anuncia como pendiente en vez de rellenarse.",
    ],
    dato: "Tu fecha de nacimiento, tu país (si lo diste) y la fecha de origen documentada de cada entidad.",
    tradicion: "Las dos relaciones del ciclo de doce que aparecen en cualquier fuente: los amigos del mismo triángulo (三合 San He) y el opuesto directo (六冲 Liu Chong).",
    molino: "Molino agrupa por casilla en vez de puntuar. Dos personas del mismo signo ven las mismas entidades en las mismas casillas; el país solo cambia el orden en que aparecen.",
    whatItDoesNotMean: [
      "Que una ciudad o una universidad esté en tu casilla de amigos no es una recomendación de mudarte ni de cambiar de carrera: es una relación simbólica entre dos fechas.",
      "No hay un puntaje escondido: dentro de una casilla, todas las entidades tienen la misma relación con tu signo.",
    ],
    exploreLinks: [
      { label: "Ver Mi Mapa", href: "/profile" },
      { label: "Los amigos y el enemigo de cada signo", href: "/blog/amigos-y-enemigo-zodiaco-chino" },
    ],
  },
  {
    id: "por-que-fecha-exacta",
    slug: "por-que-fecha-exacta",
    title: "Por qué Molino pide fecha exacta",
    subtitle: "Un año solo no alcanza para saber un signo, y preferimos una lista más corta que una dudosa.",
    metaDescription:
      "Por qué Molino solo muestra entidades con fecha de origen exacta: el Año Nuevo chino cae entre el 21 de enero y el 20 de febrero, y un año solo puede corresponder a dos signos.",
    whatYouLearn: [
      "Por qué el año de nacimiento no alcanza para saber un signo",
      "Qué pasa con las entidades que solo tienen año de fundación",
      "Cómo se verifican las fechas que usa Molino",
      "Por qué algunas listas son más cortas de lo que esperarías",
    ],
    whatIs: [
      "El signo del zodíaco chino cambia con el Año Nuevo chino, que cae cada año en un día distinto entre el 21 de enero y el 20 de febrero. Todo lo que pasó antes de esa fecha pertenece al signo del año anterior.",
      "Eso vale para vos y para cada ciudad, club o marca del mapa. Si de una entidad solo se sabe el año, no se puede saber su signo con certeza: podría ser el de ese año o el del anterior.",
    ],
    howItWorks: [
      "Por eso Mi Mapa solo muestra entidades cuyo evento de origen tiene día, mes y año. Las que solo tienen año siguen en el catálogo, pero no se usan para recomendar nada.",
      "Las fechas se cargan con dos fuentes que tienen que coincidir —por ejemplo, Wikidata y Wikipedia, o Wikidata y el registro del propio sitio—. Si no coinciden en el día, el mes y el año, la fecha se descarta. Las fechas anteriores a 1582 se comparan teniendo en cuenta el cambio del calendario juliano al gregoriano.",
    ],
    howMolinoUsesIt: [
      "La consecuencia es visible: hay ciudades conocidas que no aparecen, como Santiago de Chile o Lima, porque su fundación cae en la ventana del Año Nuevo chino y un error de días cambiaría su signo. Y hay rubros, como la ropa, que todavía tienen pocas marcas con fecha exacta.",
    ],
    dato: "La fecha de origen de cada entidad, con día, mes y año, y la fuente de donde sale.",
    tradicion: "El calendario lunisolar chino, en el que el año empieza con la luna nueva de fines del invierno y no el 1 de enero.",
    molino: "Molino prefiere no mostrar una entidad antes que ubicarla en una casilla equivocada. Una recomendación construida sobre una fecha dudosa no es una recomendación.",
    whatItDoesNotMean: [
      "Que una entidad no aparezca no dice nada de ella: solo que todavía no tiene una fecha exacta confirmada por dos fuentes.",
      "Tampoco significa que tu signo sea dudoso: tu fecha de nacimiento es exacta, así que el tuyo siempre se calcula bien.",
    ],
    exploreLinks: [
      { label: "Fechas del Año Nuevo chino, año por año", href: "/blog/ano-nuevo-chino-fechas-signo" },
      { label: "Ver Mi Mapa", href: "/profile" },
    ],
  },
  {
    id: "como-leer-una-afinidad",
    slug: "como-leer-una-afinidad",
    title: "Cómo leer una afinidad",
    subtitle: "Dato, tradición y lectura de Molino: las tres capas de cada página de Afinidades.",
    metaDescription:
      "Cómo leer una página de Afinidades: la fecha de origen de la entidad, su signo, y en qué casilla cae respecto del tuyo — tu propio signo, tus dos amigos, tu enemigo o el resto del ciclo.",
    whatYouLearn: [
      "Qué dato concreto conoce Molino de cada entidad",
      "En qué casilla cae la entidad respecto de tu signo",
      "Por qué no hay porcentajes ni puntajes",
      "Qué NO te está diciendo una afinidad",
    ],
    whatIs: [
      "Una página de Afinidad compara tu signo del zodíaco chino con el de una entidad real — un país, una ciudad, una marca, una universidad, un famoso o una película. No mide compatibilidad ni predice nada: te dice en qué casilla del ciclo cae esa entidad respecto de vos.",
    ],
    howItWorks: [
      "Todo empieza con un dato verificable: el evento de origen de la entidad, con su fecha exacta — una fundación, un nacimiento, un estreno. Molino usa ese evento para calcular el signo de la entidad, con el mismo corte de Año Nuevo chino que usa para el tuyo.",
      "Con los dos signos, la entidad cae en una de cuatro casillas: tu propio signo, uno de tus dos amigos (三合 San He), tu enemigo (六冲 Liu Chong) o el resto del ciclo. Se leen en ese orden, y la del enemigo se lee como lo que conviene evitar.",
      "La casilla aparece siempre junto al evento que la sostiene. Nunca separada del dato histórico.",
    ],
    howMolinoUsesIt: [
      "No hay porcentaje ni puntaje: la relación es categórica. Dentro de una casilla, todas las entidades tienen la misma relación con tu signo, y un número de dos dígitos sugeriría una precisión que el sistema no tiene.",
      "Las otras relaciones que menciona la tradición (Liu He, Liu Hai) quedan en el resto del ciclo. Menos casillas, más señal.",
    ],
    dato: "El nombre de la entidad, su tipo y el evento de origen documentado, con fecha exacta y fuente. Si solo se conoce el año, el signo no es afirmable: la página lo dice y Mi Mapa no la usa.",
    tradicion: "Las dos relaciones del ciclo de doce que aparecen en cualquier fuente: los amigos del mismo triángulo (三合 San He) y el opuesto directo (六冲 Liu Chong).",
    molino: "Molino ubica la entidad en una casilla y explica por qué, nombrando los dos signos y el evento real. No hay fórmula secreta: se puede verificar a mano.",
    examples: [
      {
        title: "Tu propio signo — Spider-Man (2002)",
        body: "El estreno de Spider-Man en 2002 cae en el año del Caballo. Si tu signo también es Caballo, Spider-Man está en tu propia casilla.",
      },
      {
        title: "Signo amigo — YPF (1922)",
        body: "YPF fue fundada en 1922, año del Perro. Tigre, Caballo y Perro forman un triángulo de amigos (三合 San He, elemento Fuego). Si tu signo es Tigre o Caballo, YPF es de uno de tus dos amigos.",
      },
      {
        title: "Signo enemigo — Corrientes (1588)",
        body: "La ciudad de Corrientes fue fundada en 1588, año de la Rata. La Rata es el enemigo del Caballo (六冲 Liu Chong): su opuesto directo. Si tu signo es Caballo, Corrientes es lo que conviene evitar.",
      },
    ],
    whatItDoesNotMean: [
      "Una afinidad no predice cómo será una relación ni determina si algo es bueno o malo para vos. Es una lectura simbólica construida a partir de datos documentados y una tradición.",
      "Molino no mide 'compatibilidad' en ningún sentido científico ni psicológico — no hay estudio, encuesta ni algoritmo de predicción detrás de una afinidad.",
      "Que una entidad sea de tu enemigo no es una alerta: es la relación de más tensión del ciclo, ni más ni menos.",
    ],
    exploreLinks: [
      { label: "Explorar Afinidades", href: "/affinity" },
      { label: "Cómo se calcula tu signo", href: "/academy/como-funciona-el-zodiaco-chino" },
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
