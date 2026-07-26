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
  },
];

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
    description: "Usa solo las consonantes. Representa la imagen pública y las primeras impresiones.",
    formula: "Sumar los valores de las consonantes del nombre completo y reducir.",
    caveat: "Representa cómo te perciben los demás, no quién 'eres' realmente.",
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
