/**
 * Contenido profundo de numerología para Molino.
 * Cada número incluye: significado tradicional, fortalezas, desafíos,
 * simbolismo, interpretación, ejemplo práctico, fuentes, disclaimer.
 */

export interface NumerologyNumber {
  number: number;
  title: string;
  keywords: string[];
  meaning: string;
  history: string;
  strengths: string[];
  challenges: string[];
  symbolism: string;
  interpretation: string;
  example: string;
  relationshipWithOther: string;
  scientificNote: string;
  sourceIds: string[];
  /** Qué mueve a este número desde adentro — más allá de sus rasgos observables. */
  coreDrive: string;
  /** Cómo suele traducirse ese impulso en comportamiento cotidiano observable. */
  behaviorPattern: string;
  /** Capacidades concretas que emergen cuando este número se expresa de forma equilibrada. */
  potential: string[];
  /** Su desequilibrio simbólico — no una lista de defectos, sino el mismo impulso llevado al extremo. */
  shadow: string;
  /** Qué necesita aprender o desarrollar, según esta tradición interpretativa. */
  growthEdge: string;
  /** Cómo puede manifestarse este número en tres áreas concretas de la vida. */
  manifestation: {
    decisions: string;
    relationships: string;
    work: string;
  };
  /** Pregunta abierta pensada para la reflexión personal, no para un diagnóstico. */
  reflectionQuestion: string;
}

export const NUMBERS: NumerologyNumber[] = [
  {
    number: 1,
    title: "El Líder",
    keywords: ["Independencia", "Iniciativa", "Originalidad"],
    meaning: "Según la tradición numerológica, el 1 representa el principio activo, la individualidad y la capacidad de liderazgo. Se asocia con la iniciativa, la originalidad y la autosuficiencia.",
    history: "En la tradición pitagórica, el 1 era considerado el número generador, el origen de todos los demás números. Pitágoras lo asociaba con la unidad y la masculinidad cósmica.",
    strengths: ["Capacidad de liderazgo natural", "Originalidad y creatividad", "Determinación", "Independencia", "Coraje para iniciar"],
    challenges: ["Tendencia al egoísmo", "Dificultad para delegar", "Impaciencia", "Aislamiento por exceso de independencia", "Inflexibilidad"],
    symbolism: "El 1 es representado como un pilar vertical, símbolo de fuerza y dirección. En muchas tradiciones, representa al sol, la masculinidad y el principio activo del universo.",
    interpretation: "Cuando el 1 aparece en tu Camino de Vida, la tradición numerológica sugiere que tu camino está orientado al liderazgo y la autosuficiencia. Esto no significa que debas liderar en todos los contextos, sino que tu crecimiento personal pasa por desarrollar confianza en tus propias decisiones.",
    example: "Alguien nacido el 15/03/1990: 1+5+0+3+1+9+9+0 = 28 → 2+8 = 10 → 1+0 = 1. Su Camino de Vida sería 1.",
    relationshipWithOther: "El 1 funciona especialmente bien con los números 3, 5 y 7, que complementan su energía con expresión, versatilidad e introspección.",
    scientificNote: "La numerología es un sistema de creencias sin evidencia científica que respalde sus afirmaciones. Los significados atribuidos a los números son interpretaciones culturales y simbólicas.",
    sourceIds: ["britannica-numerology", "stanford-pythagoras"],
    coreDrive: "En numerología, el impulso central del 1 suele describirse como la necesidad de iniciar: abrir camino donde antes no había ninguno, más que continuar algo que ya existe.",
    behaviorPattern: "Puede manifestarse como una tendencia a tomar la iniciativa casi automáticamente — proponer, decidir, ponerse al frente — incluso en contextos donde nadie se lo pidió explícitamente.",
    potential: [
      "Abrir caminos que otros todavía no ven",
      "Tomar decisiones bajo incertidumbre sin esperar consenso",
      "Convertir una idea vaga en un primer paso concreto",
      "Asumir responsabilidad por el resultado de lo que inicia",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer cuando la iniciativa se convierte en la necesidad de controlar todo el proceso, o cuando pedir ayuda se vive como una forma de debilidad.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 1 crece cuando aprende a liderar sin cargar en soledad con lo que podría delegar o compartir.",
    manifestation: {
      decisions: "Suele inclinarse por decidir rápido y ajustar sobre la marcha, antes que esperar tener toda la información disponible.",
      relationships: "Puede tender a ocupar el rol de quien propone o resuelve, lo que a veces deja poco espacio para que otros lideren.",
      work: "Suele encontrar sentido en proyectos donde puede empezar algo desde cero, más que en sostener procesos ya establecidos.",
    },
    reflectionQuestion: "¿Estás abriendo tu propio camino o tratando de demostrar que podés con todo vos solo?",
  },
  {
    number: 2,
    title: "El Puente",
    keywords: ["Cooperación", "Diplomacia", "Sensibilidad"],
    meaning: "El 2 se asocia en la tradición numerológica con la dualidad, la cooperación y la capacidad de mediar. Representa la energía receptiva y la sensibilidad interpersonal.",
    history: "Pitágoras consideraba al 2 como el primer número 'real' y lo asociaba con la materia y la dualidad. En tradiciones orientales, el 2 representa el yin, la receptividad y la armonía.",
    strengths: ["Capacidad de mediación", "Empatía y sensibilidad", "Paciencia", "Cooperación", "Sensibilidad artística"],
    challenges: ["Indecisión por exceso de consideración", "Dependencia emocional", "Dificultad para poner límites", "Evitación de conflictos a cualquier costo", "Inseguridad"],
    symbolism: "El 2 es representado como una línea curva o un espejo, símbolo de reflejo y dualidad. Se asocia con la luna, lo femenino y la receptividad.",
    interpretation: "Si tu Camino de Vida es 2, la tradición sugiere que tu energía está orientada hacia la conexión con otros. Tu crecimiento pasa por aprender a equilibrar tus necesidades con las de quienes te rodean.",
    example: "Alguien nacido el 23/07/1985: 2+3+0+7+1+9+8+5 = 35 → 3+5 = 8. Pero si nació el 11/07/1985: 1+1+0+7+1+9+8+5 = 32 → 3+2 = 5.",
    relationshipWithOther: "El 2 se complementa naturalmente con el 6 (responsabilidad) y el 9 (servicio), mientras que puede tensionarse con el 1 (independencia).",
    scientificNote: "Los significados atribuidos al 2 en numerología son construcciones simbólicas. No existe evidencia de que la fecha de nacimiento determine rasgos de personalidad.",
    sourceIds: ["britannica-numerology", "iep-pythagoreanism"],
    coreDrive: "El impulso central del 2 suele describirse como la búsqueda de conexión genuina: entender al otro lo suficiente como para construir algo en conjunto.",
    behaviorPattern: "Puede expresarse como una atención constante al estado emocional de quienes lo rodean, y una tendencia a ajustar la propia postura para mantener la armonía del grupo.",
    potential: [
      "Mediar entre posiciones que parecen irreconciliables",
      "Escuchar matices que otros pasan por alto",
      "Sostener un vínculo en el tiempo, no solo iniciarlo",
      "Detectar tensión antes de que se vuelva conflicto abierto",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer cuando la búsqueda de armonía se convierte en evitar cualquier desacuerdo, incluso a costa de las propias necesidades.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 2 crece cuando aprende a sostener un límite sin necesitar la aprobación de la otra parte para hacerlo.",
    manifestation: {
      decisions: "Suele preferir decidir en conjunto o consultar antes de avanzar, incluso cuando la decisión le corresponde solo a él o ella.",
      relationships: "Tiende a ser quien sostiene el vínculo de forma activa, a veces más allá de lo que el vínculo le devuelve.",
      work: "Suele rendir mejor en entornos colaborativos que en roles donde debe imponer una postura en solitario.",
    },
    reflectionQuestion: "¿Estás construyendo un vínculo real o evitando el conflicto a cualquier precio?",
  },
  {
    number: 3,
    title: "El Creador",
    keywords: ["Expresión", "Creatividad", "Comunicación"],
    meaning: "El 3 representa en la tradición numerológica la expresión creativa, la comunicación y la alegría. Se asocia con el arte, la sociabilidad y la optimismo.",
    history: "En el pitagorismo, el 3 era considerado el primer número 'perfecto' porque tiene principio, medio y fin. Se asociaba con la armonía y la totalidad.",
    strengths: ["Creatividad", "Comunicación expresiva", "Optimismo natural", "Carisma social", "Imaginación"],
    challenges: ["Dispersión por exceso de ideas", "Superficialidad", "Exageración", "Dificultad para concentrarse", "Necesidad de aprobación"],
    symbolism: "El 3 se asocia con el triángulo, símbolo de estabilidad y dirección. En múltiples tradiciones, representa la totalidad: cuerpo, mente y espíritu.",
    interpretation: "Un Camino de Vida 3 sugiere que tu energía está orientada hacia la expresión y la creación. Tu desafío es mantener el foco sin dispersarte en demasiadas direcciones.",
    example: "Alguien nacido el 12/04/1992: 1+2+0+4+1+9+9+2 = 28 → 2+8 = 10 → 1+0 = 1. Pero si el cálculo llega a 3, se interpreta como energía expresiva.",
    relationshipWithOther: "El 3 resuena especialmente con el 5 (aventura) y el 7 (profundidad), creando equilibrio entre expresión exterior e introspección.",
    scientificNote: "La numerología es un sistema de creencias. Las asociaciones entre el número 3 y la creatividad son interpretaciones culturales, no hechos científicos.",
    sourceIds: ["britannica-numerology", "stanford-pythagoras"],
    coreDrive: "El impulso central del 3 suele describirse como la necesidad de poner algo interno hacia afuera: convertir una idea, una emoción o una observación en algo comunicable.",
    behaviorPattern: "Puede manifestarse como facilidad para encontrar palabras, imágenes o gestos que otros tardan más en articular, y una búsqueda casi constante de un canal para expresarse.",
    potential: [
      "Convertir una idea abstracta en un mensaje que se entiende",
      "Conectar personas o ideas que no se habían cruzado antes",
      "Sostener el ánimo de un grupo en momentos difíciles",
      "Encontrar la versión más simple y atractiva de algo complejo",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer cuando la expresión se dispersa en demasiadas direcciones a la vez, o cuando necesita validación externa para sentir que lo que hizo tiene valor.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 3 crece cuando aprende a sostener una idea el tiempo suficiente para terminarla, en vez de saltar a la siguiente.",
    manifestation: {
      decisions: "Puede decidir guiado por el entusiasmo del momento, y suele beneficiarse de sumar una mirada más estructurada antes de comprometerse del todo.",
      relationships: "Suele aportar liviandad y humor al vínculo, aunque puede evitar las conversaciones que requieren sostener incomodidad.",
      work: "Suele prosperar en roles donde comunicar es parte central de la tarea, más que en tareas repetitivas sin salida creativa.",
    },
    reflectionQuestion: "¿Tu expresión está construyendo algo o solo persiguiendo el próximo estímulo?",
  },
  {
    number: 4,
    title: "El Constructor",
    keywords: ["Estabilidad", "Disciplina", "Practicidad"],
    meaning: "El 4 representa en la tradición numerológica los cimientos, la organización y la disciplina. Se asocia con la estructura, la confiabilidad y el trabajo metódico.",
    history: "Pitágoras consideraba al 4 como el número de la justicia y la estabilidad, ya que 4 es el primer cuadrado perfecto (2×2). Lo asociaba con la tierra y la solidez.",
    strengths: ["Organización", "Disciplina", "Confiabilidad", "Practicidad", "Persistencia"],
    challenges: ["Rigidez", "Terquedad", "Resistencia al cambio", "Exceso de control", "Dificultad para improvisar"],
    symbolism: "El 4 se asocia con el cuadrado, símbolo de estabilidad y fundamento. Representa los cuatro puntos cardinales, las cuatro estaciones y los cuatro elementos.",
    interpretation: "Un Camino de Vida 4 sugiere que tu crecimiento pasa por construir estructuras sólidas. Tu energía se manifiesta en la práctica, no en la teoría.",
    example: "Los 4 años de un ciclo personal se asocian con trabajo duro y preparación. Si estás en un Año 4, la tradición dice que es momento de consolidar.",
    relationshipWithOther: "El 4 funciona bien con el 8 (logros materiales) y el 1 (iniciativa), pero puede generar tensión con el 5 (cambio) y el 7 (introspección).",
    scientificNote: "No existe evidencia científica de que el número 4 determine características de personalidad o ciclos de vida.",
    sourceIds: ["britannica-numerology", "iep-pythagoreanism"],
    coreDrive: "El impulso central del 4 suele describirse como la necesidad de construir algo que perdure: un sistema, una rutina, una base que no dependa del ánimo del día.",
    behaviorPattern: "Puede expresarse como preferencia por el método sobre la improvisación, y una tendencia a medir el progreso en pasos concretos y verificables.",
    potential: [
      "Sostener un proyecto mucho después de que el entusiasmo inicial se apagó",
      "Detectar qué falta en un sistema para que funcione de verdad",
      "Convertir una intención vaga en un plan ejecutable",
      "Ser el punto de estabilidad cuando todo lo demás cambia",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer cuando la estructura deja de servir al objetivo y se convierte en un fin en sí misma, o cuando cualquier cambio se vive como una amenaza.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 4 crece cuando aprende a distinguir la estructura que lo sostiene de la que ya dejó de sostenerlo.",
    manifestation: {
      decisions: "Suele preferir decidir con información completa y un plan claro, incluso si eso implica postergar la decisión.",
      relationships: "Tiende a demostrar compromiso a través de la constancia y los actos concretos, más que con las palabras.",
      work: "Suele encontrar satisfacción en roles donde el esfuerzo sostenido se traduce en resultados medibles.",
    },
    reflectionQuestion: "¿La estructura que armaste te sostiene o ya te está encerrando?",
  },
  {
    number: 5,
    title: "El Nómada",
    keywords: ["Libertad", "Versatilidad", "Curiosidad"],
    meaning: "El 5 representa en la tradición numerológica la libertad, el cambio y la aventura. Se asocia con la curiosidad, la versatilidad y la experiencia sensorial.",
    history: "En el pitagorismo, el 5 era el número del matrimonio (2+3) y de la vida humana (4 extremidades + 1 cabeza). Con el tiempo, pasó a representar la transformación.",
    strengths: ["Adaptabilidad", "Curiosidad intelectual", "Versatilidad", "Carisma", "Capacidad de cambio"],
    challenges: ["Inconstancia", "Impulsividad", "Dificultad para comprometerse", "Dispersión", "Búsqueda excesiva de novedad"],
    symbolism: "El 5 se asocia con el pentágono y el microcosmos humano. Representa los cinco sentidos y la experiencia sensorial directa.",
    interpretation: "Un Camino de Vida 5 sugiere que tu energía está orientada hacia la exploración y el cambio. Tu crecimiento pasa por encontrar estabilidad dentro del movimiento.",
    example: "El 5 es el número más dinámico en numerología. Se asocia con los cinco elementos y la experiencia directa de la vida.",
    relationshipWithOther: "El 5 resuena con el 3 (expresión) y el 7 (introspección), pero puede generar tensión con el 1 (orden) y el 4 (estabilidad).",
    scientificNote: "Las asociaciones entre el 5 y la libertad son construcciones simbólicas. No existe evidencia de que el número determine rasgos de comportamiento.",
    sourceIds: ["britannica-numerology", "stanford-pythagoras"],
    coreDrive: "El impulso central del 5 no suele describirse simplemente como necesidad de cambio, sino como necesidad de mantener abierta la posibilidad de elegir distinto.",
    behaviorPattern: "Puede expresarse como curiosidad activa ante lo nuevo, y una resistencia — a veces física, a veces solo interna — ante cualquier cosa que se sienta como una jaula.",
    potential: [
      "Adaptarse a un contexto que cambió sin perder el eje",
      "Conectar mundos o grupos que normalmente no se cruzan",
      "Encontrar oportunidades donde otros solo ven inestabilidad",
      "Reinventar un plan cuando el original dejó de servir",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer cuando el movimiento se vuelve un fin en sí mismo: cambiar por no quedarse quieto, más que por haber evolucionado realmente.",
    growthEdge: "Dentro de esta tradición, el desafío del 5 no se interpreta como elegir entre libertad y estructura, sino como descubrir qué estructura mínima le permite sostener su libertad en el tiempo.",
    manifestation: {
      decisions: "Suele evitar comprometerse con una sola opción mientras sienta que existen otras disponibles, aunque eso implique postergar decisiones importantes.",
      relationships: "Puede necesitar espacio y variedad dentro del vínculo, y suele beneficiarse de entornos que no interpreten eso como falta de compromiso.",
      work: "Suele rendir mejor en roles con variedad genuina de tareas que en estructuras rígidas y repetitivas.",
    },
    reflectionQuestion: "¿Estás cambiando porque evolucionaste o porque no soportás quedarte quieto?",
  },
  {
    number: 6,
    title: "El Nutridor",
    keywords: ["Responsabilidad", "Armonía", "Cuidado"],
    meaning: "El 6 representa en la tradición numerología la responsabilidad, el cuidado y la armonía del hogar. Se asocia con la familia, el servicio y el amor incondicional.",
    history: "Pitágoras consideraba al 6 como el primer número 'perfecto' (1+2+3=6, y 1×2×3=6). Lo asociaba con la armonía y la perfección.",
    strengths: ["Empatía", "Responsabilidad", "Cuidado del hogar", "Armonía", "Generosidad"],
    challenges: ["Autosacrificio", "Culpa", "Control excesivo", "Dificultad para decir no", "Preocupación excesiva por otros"],
    symbolism: "El 6 se asocia con la estrella de seis puntas, símbolo de equilibrio y armonía. Representa la unión de lo espiritual (3+3) y lo material (2+2+2).",
    interpretation: "Un Camino de Vida 6 sugiere que tu energía está orientada hacia el cuidado de otros. Tu desafío es encontrar el equilibrio entre servir y cuidarte a ti mismo.",
    example: "El 6 es común en personas que trabajan en áreas de salud, educación o servicio comunitario, según la tradición numerológica.",
    relationshipWithOther: "El 6 se complementa con el 2 (cooperación) y el 9 (servicio), pero puede generar dependencia con el 1 (independencia).",
    scientificNote: "La numerología es un sistema simbólico. No existe evidencia de que el 6 determine la vocación o las relaciones de una persona.",
    sourceIds: ["britannica-numerology", "iep-pythagoreanism"],
    coreDrive: "El impulso central del 6 suele describirse como la necesidad de que las personas y los espacios que lo rodean estén bien: cuidados, en armonía, sostenidos.",
    behaviorPattern: "Puede expresarse como disposición casi automática a hacerse cargo de lo que otros dejan sin resolver, y una atención constante al bienestar del entorno.",
    potential: [
      "Sostener a otros en momentos difíciles sin perder el propio eje",
      "Crear espacios y vínculos que se sienten seguros",
      "Convertir la responsabilidad en un tipo de liderazgo afectivo",
      "Detectar necesidades que nadie verbalizó todavía",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer cuando cuidar se convierte en una obligación que no puede rechazar, o cuando confunde el amor con hacerse responsable de la felicidad ajena.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 6 crece cuando aprende a distinguir entre cuidar porque elige hacerlo y cuidar porque siente que, si no lo hace, todo se derrumba.",
    manifestation: {
      decisions: "Suele decidir pensando primero en el impacto sobre los demás, y puede beneficiarse de preguntarse qué quiere él o ella antes de resolver.",
      relationships: "Tiende a ser quien sostiene al grupo o a la familia, un rol que puede volverse pesado si nadie más lo comparte.",
      work: "Suele encontrar sentido en tareas centradas en personas, donde el cuidado o el servicio son parte visible del resultado.",
    },
    reflectionQuestion: "¿Estás cuidando porque elegís hacerlo o porque sentís que todo depende de vos?",
  },
  {
    number: 7,
    title: "El Investigador",
    keywords: ["Introspección", "Análisis", "Búsqueda de verdad"],
    meaning: "El 7 representa en la tradición numerológica la introspección, el análisis y la búsqueda de conocimiento profundo. Se asocia con la espiritualidad, la sabiduría y la investigación.",
    history: "Pitágoras consideraba al 7 como el número sagrado,因为它 era considerado un número primo que no podía dividirse. Se asociaba con la perfección y la divinidad.",
    strengths: ["Capacidad analítica", "Introspección", "Búsqueda de verdad", "Espiritualidad", "Sabiduría"],
    challenges: ["Aislamiento", "Escepticismo excesivo", "Perfeccionismo", "Dificultad para expresar emociones", "Retiro excesivo"],
    symbolism: "El 7 se asocia con el arcoiris, los siete días de la creación y las siete notas musicales. Representa el misterio y la búsqueda de significado.",
    interpretation: "Un Camino de Vida 7 sugiere que tu energía está orientada hacia la búsqueda de conocimiento profundo. Tu crecimiento pasa por equilibrar la introspección con la conexión.",
    example: "El 7 es el número más introspectivo en numerología. Se dice que las personas con 7 en su mapa buscan constantemente respuestas más profundas.",
    relationshipWithOther: "El 7 resuena con el 3 (expresión) y el 9 (sabiduría), pero puede generar aislamiento si se combina con números muy materiales.",
    scientificNote: "La asociación entre el 7 y la espiritualidad es una construcción cultural. No existe evidencia de que el número determine tendencias espirituales.",
    sourceIds: ["britannica-numerology", "stanford-pythagoras"],
    coreDrive: "El impulso central del 7 suele describirse como la necesidad de comprender lo que hay debajo de la superficie, más que conformarse con la explicación disponible.",
    behaviorPattern: "Puede expresarse como preferencia por la reflexión antes que la reacción inmediata, y una tendencia a necesitar tiempo a solas para procesar lo que vive.",
    potential: [
      "Detectar patrones que pasan inadvertidos para la mayoría",
      "Desarrollar un conocimiento profundo en un área específica",
      "Hacer la pregunta que nadie más se animó a hacer",
      "Mantener criterio propio frente a la opinión mayoritaria",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer cuando el análisis se convierte en una forma de mantener distancia emocional, o cuando la introspección reemplaza a la experiencia en vez de complementarla.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 7 crece cuando aprende a compartir lo que descubre en soledad, en vez de guardarlo solo para sí mismo.",
    manifestation: {
      decisions: "Suele necesitar tiempo e información suficiente antes de decidir, y puede resistirse a resolver bajo presión externa.",
      relationships: "Tiende a mostrar afecto de forma más reservada que expresiva, lo que puede leerse como distancia sin serlo.",
      work: "Suele prosperar en roles que permiten profundizar en un tema, más que en entornos de estímulo constante e interrupciones.",
    },
    reflectionQuestion: "¿Tu necesidad de entender te acerca a la verdad o te aleja de vivir la experiencia?",
  },
  {
    number: 8,
    title: "El Poderoso",
    keywords: ["Poder", "Ambición", "Manifestación material"],
    meaning: "El 8 representa en la tradición numerológica el poder, la ambición y la materialización. Se asocia con el éxito material, la autoridad y la visión estratégica.",
    history: "El 8 era considerado en tradiciones orientales como el número más auspicioso, relacionado con la prosperidad y el equilibrio kármico.",
    strengths: ["Visión estratégica", "Capacidad de manifestación", "Liderazgo ejecutivo", "Determinación", "Organización financiera"],
    challenges: ["Materialismo excesivo", "Control", "Intimidación", "Obsesión por el poder", "Desequilibrio entre vida personal y profesional"],
    symbolism: "El 8 se asocia con el infinito (∞), símbolo de flujo continuo y equilibrio. Representa la interacción entre lo material y lo espiritual.",
    interpretation: "Un Camino de Vida 8 sugiere que tu energía está orientada hacia la materialización de proyectos grandes. Tu desafío es no perder de vista lo que realmente importa.",
    example: "El 8 es considerado un número de manifestación. Se asocia con ciclos de karma y equilibrio entre dar y recibir.",
    relationshipWithOther: "El 8 funciona bien con el 4 (estabilidad) y el 1 (liderazgo), pero puede generar conflictos con el 2 (cooperación) y el 6 (cuidado).",
    scientificNote: "La asociación entre el 8 y la prosperidad es una creencia cultural, particularmente fuerte en tradiciones orientales. No tiene base científica.",
    sourceIds: ["britannica-numerology", "iep-pythagoreanism"],
    coreDrive: "El impulso central del 8 suele describirse como la necesidad de traducir la ambición en resultados concretos y verificables.",
    behaviorPattern: "Puede expresarse como orientación clara hacia metas medibles, y una lectura natural de las dinámicas de poder dentro de cualquier grupo u organización.",
    potential: [
      "Administrar recursos con visión estratégica",
      "Sostener la disciplina necesaria para proyectos de largo plazo",
      "Negociar sin perder de vista el objetivo final",
      "Construir estructuras u organizaciones que escalan",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer cuando el resultado se vuelve la única medida del propio valor, o cuando la necesidad de control desplaza a los vínculos que ese mismo resultado debería sostener.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 8 crece cuando aprende a separar lo que logra de lo que vale como persona. La riqueza, en este marco simbólico, es una temática asociada al número — nunca una garantía ni una predicción.",
    manifestation: {
      decisions: "Suele decidir con foco en el resultado y el costo-beneficio, a veces dejando en segundo plano el impacto emocional inmediato.",
      relationships: "Puede tender a asumir un rol de autoridad o proveedor dentro del vínculo, incluso cuando no se lo pidieron.",
      work: "Suele destacarse en roles de gestión, negociación o estrategia, donde la ambición tiene un canal claro de expresión.",
    },
    reflectionQuestion: "¿Estás usando el poder para construir algo o necesitás poder para sentir que valés?",
  },
  {
    number: 9,
    title: "El Filósofo",
    keywords: ["Sabiduría", "Compasión", "Ciclos"],
    meaning: "El 9 representa en la tradición numerología la sabiduría, la compasión y la culminación de ciclos. Se asocia con la humanidad, el servicio y la visión global.",
    history: "En el pitagorismo, el 9 era el número de la perfección porque es el único que, multiplicado por cualquier número, siempre se reduce a sí mismo (9×2=18→9, 9×3=27→9).",
    strengths: ["Compasión humanitaria", "Sabiduría", "Visión global", "Capacidad de cierre", "Generosidad"],
    challenges: ["Apego al pasado", "Idealismo excesivo", "Dificultad para soltar", "Carga emocional por otros", "Sentido de superioridad"],
    symbolism: "El 9 se asocia con la completion y el regreso al origen. Representa la sabiduría acumulada y la capacidad de ver más allá de lo inmediato.",
    interpretation: "Un Camino de Vida 9 sugiere que tu energía está orientada hacia el servicio y la visión global. Tu desafío es aprender a soltar sin perder la conexión.",
    example: "El 9 es el último dígito simple, por lo que representa la culminación. Numerología tradicional dice que los 9 tienen una visión más amplia de la vida.",
    relationshipWithOther: "El 9 se complementa con el 3 (expresión) y el 6 (servicio), pero puede generar tensión con el 1 (individualismo).",
    scientificNote: "Las propiedades matemáticas del 9 son reales, pero su interpretación como 'sabiduría' o 'servicio' es una construcción simbólica sin respaldo científico.",
    sourceIds: ["britannica-numerology", "stanford-pythagoras"],
    coreDrive: "El impulso central del 9 suele describirse como la necesidad de comprender el conjunto: ver más allá de la situación inmediata y encontrarle un sentido más amplio.",
    behaviorPattern: "Puede expresarse como una sensibilidad marcada al estado del entorno, y una facilidad para adaptarse — casi reflejar — distintos contextos y personas.",
    potential: [
      "Integrar experiencias muy distintas en una sola comprensión",
      "Adaptarse a contextos nuevos sin perder perspectiva",
      "Cerrar ciclos en vez de prolongarlos indefinidamente",
      "Ver en otra persona algo que ella todavía no ve en sí misma",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer cuando absorbe tanto del entorno que le cuesta distinguir su propio deseo de la influencia ajena, o cuando le cuesta soltar lo que ya cumplió su ciclo.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 9 crece cuando aprende a cerrar un ciclo sin necesitar que el resultado final sea perfecto.",
    manifestation: {
      decisions: "Suele decidir considerando el panorama completo, lo que puede volver la decisión más lenta cuando la situación pide algo inmediato.",
      relationships: "Tiende a adaptarse mucho al otro, y puede beneficiarse de preguntarse cuánto de esa adaptación es elección propia.",
      work: "Suele encontrar sentido en roles que integran distintas áreas o perspectivas, más que en tareas aisladas y repetitivas.",
    },
    reflectionQuestion: "¿Estás viendo quién sos de verdad o solo reflejando lo que tenés alrededor?",
  },
  {
    number: 11,
    title: "El Vidente",
    keywords: ["Intuición", "Inspiración", "Iluminación"],
    meaning: "El 11 es un número maestro en la tradición numerológica, asociado con la intuición elevada, la inspiración espiritual y la conexión con lo trascendente.",
    history: "Los números maestros (11, 22, 33) fueron incorporados a la numerología moderna en el siglo XX. No formaban parte del sistema pitagórico original.",
    strengths: ["Intuición extraordinaria", "Inspiración creativa", "Conexión espiritual", "Capacidad visionaria", "Empatía profunda"],
    challenges: ["Ansiedad e inseguridad", "Sobreestimulación", "Dificultad para enraizarse", "Nerviosismo", "Idealismo paralizante"],
    symbolism: "El 11 se asocia con la iluminación y la inspiración. En numerología moderna, se considera un canal de energía espiritual más elevada que el 2 simple.",
    interpretation: "El 11 como número maestro sugiere una sensibilidad extraordinaria. No es 'mejor' que otros números — representa un tipo diferente de energía que requiere canales específicos de expresión.",
    example: "Si tu Life Path es 11, no se reduce a 2. El 11 se mantiene como número maestro y se interpreta de forma diferente.",
    relationshipWithOther: "El 11 se complementa con el 22 (maestro constructor) y el 33 (maestro sanador) como parte de la trinidad de números maestros.",
    scientificNote: "Los números maestros son una invención de la numerología moderna. No existen en la tradición pitagórica original ni tienen evidencia científica.",
    sourceIds: ["britannica-numerology", "buchanan-numerology-book"],
    coreDrive: "El impulso central del 11 suele describirse como la necesidad de captar lo que todavía no es evidente: una intuición que llega antes que la evidencia concreta.",
    behaviorPattern: "Puede expresarse como sensibilidad marcada a matices, atmósferas y señales que otros no registran conscientemente, junto con una intensidad interna difícil de traducir en palabras.",
    potential: [
      "Detectar una tendencia o un cambio antes de que sea visible para el resto",
      "Inspirar a otros a través de una visión o una idea",
      "Conectar percepción intuitiva con conocimiento concreto",
      "Ofrecer una lectura de una situación que otros no alcanzan a ver",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer como sobrecarga sensorial o emocional, o como dificultad para bajar una visión amplia a un paso concreto y ejecutable.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 11 crece cuando encuentra un canal específico para lo que percibe, en vez de quedarse solo en la intensidad de percibirlo.",
    manifestation: {
      decisions: "Suele guiarse por la intuición de forma marcada, y puede beneficiarse de contrastarla con información concreta antes de actuar.",
      relationships: "Tiende a percibir el estado emocional del otro con una precisión inusual, lo que puede resultar tanto un puente como una sobrecarga.",
      work: "Suele encontrar sentido en roles donde la visión, la inspiración o la anticipación de tendencias tienen un lugar central.",
    },
    reflectionQuestion: "¿Qué hacés con lo que intuís antes de que los demás lo vean?",
  },
  {
    number: 22,
    title: "El Maestro Constructor",
    keywords: ["Visión", "Manifestación a gran escala", "Organización"],
    meaning: "El 22 es un número maestro asociado con la capacidad de construir a gran escala. Se le considera el 'Maestro Constructor' por su potencial para materializar visiones ambiciosas.",
    history: "Como el 11, el 22 fue incorporado a la numerología moderna. Su interpretación como 'número maestro' no tiene precedentes en el pitagorismo clásico.",
    strengths: ["Visión a gran escala", "Capacidad organizativa", "Manifestación práctica", "Liderazgo inspirador", "Disciplina extraordinaria"],
    challenges: ["Presión interna por lograr", "Perfeccionismo extremo", "Rigidez", "Dificultad para delegar", "Agotamiento"],
    symbolism: "El 22 se asocia con la construcción de legados duraderos. Representa la unión de intuición (11) y manifestación práctica (4).",
    interpretation: "El 22 como número maestro sugiere un potencial de manifestación excepcional. Sin embargo, este potencial se desarrolla a lo largo de la vida y no se activa automáticamente.",
    example: "El 22 combina la intuición del 11 con la practicidad del 4 (2+2=4). Se le asocia con grandes proyectos y legados.",
    relationshipWithOther: "El 22 se complementa con el 11 (intuición) y el 33 (compasión) como los tres números maestros.",
    scientificNote: "Los números maestros son una construcción de la numerología moderna sin respaldo en la tradición pitagórica ni en la evidencia científica.",
    sourceIds: ["britannica-numerology", "lavoselle-numerology"],
    coreDrive: "El impulso central del 22 suele describirse como el cruce entre una visión de gran escala y la necesidad de volverla algo concreto y sostenible.",
    behaviorPattern: "Puede expresarse como capacidad para pensar en sistemas completos — no solo en la próxima tarea, sino en cómo todas las piezas encajan a largo plazo.",
    potential: [
      "Diseñar sistemas u organizaciones que sostienen a mucha gente",
      "Convertir una visión ambiciosa en etapas ejecutables",
      "Sostener disciplina extraordinaria durante proyectos largos",
      "Elevar el estándar de lo que un grupo cree que es posible",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer como sentirse abrumado por la magnitud de lo que quiere construir, o como perfeccionismo que posterga indefinidamente el primer paso.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 22 crece cuando aprende a avanzar con una estructura imperfecta, en vez de esperar tener la visión completa resuelta antes de empezar.",
    manifestation: {
      decisions: "Suele decidir pensando en el impacto de largo plazo, lo que puede volver lenta la puesta en marcha de proyectos más simples.",
      relationships: "Puede tender a involucrar a su entorno cercano en sus proyectos, y suele necesitar aprender a delegar en vez de sostener todo personalmente.",
      work: "Suele destacarse liderando proyectos de gran escala u organizaciones, más que en tareas acotadas y de corto plazo.",
    },
    reflectionQuestion: "¿Qué parte de tu visión podés empezar a construir hoy, en vez de esperar a tenerla completa?",
  },
  {
    number: 33,
    title: "El Maestro Sanador",
    keywords: ["Compasión", "Sanación", "Servicio universal"],
    meaning: "El 33 es el más elevado de los números maestros, asociado con la compasión universal, la sanación y el servicio a la humanidad. Se le llama el 'Maestro Sanador'.",
    history: "El 33 es el número maestro más recientemente incorporado a la numerología. Su interpretación es la más especulativa de los tres números maestros.",
    strengths: ["Compasión profunda", "Capacidad de sanación", "Inspiración espiritual", "Servicio desinteresado", "Sabiduría empática"],
    challenges: ["Carga emocional excesiva", "Autosacrificio", "Dificultad para poner límites", "Idealismo paralizante", "Agotamiento espiritual"],
    symbolism: "El 33 se asocia con la energía maternal y la sanación. Representa la culminación de la evolución espiritual en la tradición numerológica moderna.",
    interpretation: "El 33 como número maestro sugiere una capacidad extraordinaria de servicio y sanación. Es extremadamente raro y su interpretación debe tomarse como simbólica, no literal.",
    example: "El 33 combina expresión (3+3=6, nutrición) con la energía del 33 como número maestro. Se le asocia con figuras como el Buda o el Cristo en tradiciones espirituales.",
    relationshipWithOther: "El 33 se complementa con el 11 (intuición) y el 22 (manifestación) como los tres números maestros.",
    scientificNote: "El 33 como número maestro es la interpretación más especulativa de la numerología moderna. No tiene base histórica en el pitagorismo ni evidencia científica.",
    sourceIds: ["britannica-numerology", "lavoselle-numerology"],
    coreDrive: "El impulso central del 33 suele describirse como la combinación entre sensibilidad, responsabilidad y una capacidad marcada de influir positivamente en otros.",
    behaviorPattern: "Puede expresarse como disposición a enseñar, acompañar o cuidar incluso sin que se lo pidan explícitamente, y una sensibilidad amplificada al malestar ajeno.",
    potential: [
      "Transformar experiencia personal en conocimiento útil para otros",
      "Acompañar procesos de aprendizaje o cambio ajenos",
      "Comunicar ideas complejas de forma accesible y cercana",
      "Influir positivamente sobre un grupo o comunidad",
    ],
    shadow: "Su desequilibrio simbólico puede aparecer como la sensación de tener que resolver el malestar de todos los que lo rodean, o como dificultad para sostener límites frente a las necesidades ajenas.",
    growthEdge: "Dentro de esta tradición, se interpreta que el 33 crece cuando aprende a compartir lo que sabe sin sentir que carga con la responsabilidad de salvar a cada persona que ayuda.",
    manifestation: {
      decisions: "Suele decidir priorizando el bienestar colectivo, y puede beneficiarse de incluir su propio bienestar en esa misma ecuación.",
      relationships: "Tiende a ocupar un rol de guía o sostén dentro de sus vínculos, un lugar que puede volverse agotador si no se equilibra.",
      work: "Suele encontrar sentido en roles de enseñanza, acompañamiento o servicio, donde el impacto sobre otros es visible.",
    },
    reflectionQuestion: "¿Estás compartiendo lo que aprendiste o cargando con el peso del mundo entero?",
  },
];

/**
 * Nota introductoria para 11, 22 y 33: por qué Molino los trata como
 * vibraciones propias en vez de reducirlos a 2, 4 y 6, y qué NO implica esa
 * convención (ni jerarquía espiritual, ni destino predeterminado).
 */
export const MASTER_NUMBERS_NOTE =
  "Algunas escuelas de la tradición numerológica interpretan al 11, al 22 y al 33 como vibraciones distintas de sus reducciones simples (2, 4 y 6): números que conservarían una intensidad simbólica propia en vez de reducirse al dígito final. Molino sigue esa convención cuando el cálculo produce directamente 11, 22 o 33. Esto no implica que representen un destino superior, una 'misión' predeterminada ni ningún tipo de jerarquía espiritual frente a los demás números — son, como el resto del sistema, una capa más de interpretación simbólica.";

/**
 * Cálculos de numerología que Molino implementa.
 */
export const CALCULATIONS = {
  lifePath: {
    title: "Camino de Vida (Life Path)",
    description: "Se reduce la fecha de nacimiento completa a un solo dígito, excepto cuando se obtiene 11, 22 o 33 (números maestros).",
    formula: "Sumar todos los dígitos de la fecha de nacimiento y reducir a un solo dígito.",
    example: "15/03/1990: 1+5+0+3+1+9+9+0 = 28 → 2+8 = 10 → 1+0 = 1",
    caveat: "Molino utiliza el método de reducción continua. Otros sistemas numerológicos pueden usar métodos de cálculo diferentes.",
  },
  expression: {
    title: "Número de Expresión",
    description: "Se asignan valores a las letras del nombre completo, se suman y se reducen.",
    formula: "Asignar valor numérico a cada letra (A=1, B=2, ..., I=9, J=1, etc.) y reducir.",
    caveat: "Se utiliza el nombre completo al nacer. Este cálculo depende de la ortografía exacta del nombre.",
  },
  soulUrge: {
    title: "Número del Alma",
    description: "Usa solo las vocales del nombre completo. Se interpreta como motivación interna.",
    formula: "Sumar los valores de las vocales del nombre completo y reducir.",
    caveat: "La vocalización depende del idioma. Molino usa vocales en español: A, E, I, O, U.",
  },
  personality: {
    title: "Número de Personalidad",
    description: "Se obtiene exclusivamente a partir del día de nacimiento. Representa la energía que proyectas al mundo.",
    formula: "Reducir el dígito del día de nacimiento a un solo dígito (o mantener 11, 22 y 33 como números maestros).",
    caveat: "No depende del nombre ni de la fecha completa. Solo del día en que naciste.",
  },
};

/**
 * Números maestros.
 */
export const MASTER_NUMBERS = [11, 22, 33];

/**
 * Disclaimer de numerología.
 */
export const NUMEROLOGY_DISCLAIMER = "La numerología es un sistema simbólico tradicional. Molino la utiliza como herramienta de reflexión y autoconocimiento. Las interpretaciones numerológicas no constituyen evidencia científica, predicciones ni diagnósticos profesionales. Los cálculos son deterministas y reproducibles a partir de los mismos datos de entrada.";
