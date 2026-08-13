/**
 * Numerology Interpretations — Textual descriptions, archetypes, and insights keyed by number.
 * Separated from mathematical calculation logic.
 */

export interface ArchetypeInterpretation {
  number: number;
  name: string;
  keywords: string[];
  description: string;
  quote: string;
  careers: string[];
  strengths: string[];
  challenges: string[];
  essence?: string;
}

export const NUMEROLOGY_ARCHETYPES_ES: Readonly<Record<number, ArchetypeInterpretation>> = {
  1: {
    number: 1,
    name: "El Líder",
    keywords: ["Independiente", "Innovador", "Determinado"],
    description: "Naciste para liderar con independencia y claridad. Tu camino se construye con iniciativa, originalidad y coraje.",
    quote: "El poder no se te da. Lo tomás.",
    careers: ["Emprendedor", "CEO", "Líder político", "Consultor", "Director", "Inversor"],
    strengths: ["Iniciativa", "Creatividad", "Coraje", "Originalidad"],
    challenges: ["Impaciencia", "Ego", "Control"],
  },
  2: {
    number: 2,
    name: "El Mediador",
    keywords: ["Diplomático", "Sensible", "Cooperativo"],
    description: "Tu energía es la del puente. Desarrollás la sensibilidad, la diplomacia y la capacidad de unir mundos diferentes.",
    quote: "La verdadera fuerza está en la unión.",
    careers: ["Diplomático", "Terapeuta", "Mediador", "RRHH", "Asistente social", "Psicólogo"],
    strengths: ["Diplomacia", "Intuición", "Paciencia", "Empatía"],
    challenges: ["Indecisión", "Dependencia", "Hipersensibilidad"],
  },
  3: {
    number: 3,
    name: "El Comunicador",
    keywords: ["Creativo", "Expresivo", "Optimista"],
    description: "Tu energía es la expresión creativa. Desarrollás la comunicación, la alegría y la capacidad de inspirar a otros.",
    quote: "El mundo es tu lienzo.",
    careers: ["Artista", "Escritor", "Actor", "Diseñador", "Periodista", "Cantante"],
    strengths: ["Creatividad", "Comunicación", "Carisma", "Optimismo"],
    challenges: ["Dispersión", "Exageración", "Falta de disciplina"],
  },
  4: {
    number: 4,
    name: "El Constructor",
    keywords: ["Práctico", "Organizado", "Confiable"],
    description: "Tu energía es la de los cimientos. Desarrollás la confiabilidad, la organización y la capacidad de construir cosas duraderas.",
    quote: "Los grandes edificios se levantan un ladrillo a la vez.",
    careers: ["Ingeniero", "Arquitecto", "Gerente de proyectos", "Contador", "Analista", "Supervisor"],
    strengths: ["Organización", "Disciplina", "Lealtad", "Persistencia"],
    challenges: ["Rigidez", "Terquedad", "Resistencia al cambio"],
  },
  5: {
    number: 5,
    name: "El Aventurero",
    keywords: ["Versátil", "Libre", "Curioso"],
    description: "Tu energía es del cambio. Desarrollás la curiosidad, la adaptabilidad y la capacidad de expandir horizontes.",
    quote: "La vida es demasiado corta para seguir el camino trillado.",
    careers: ["Viajero", "Periodista", "Emprendedor digital", "Fotógrafo", "Marketing", "Relaciones públicas"],
    strengths: ["Adaptabilidad", "Curiosidad", "Entusiasmo", "Magnetismo"],
    challenges: ["Inquietud", "Impulsividad", "Inconstancia"],
  },
  6: {
    number: 6,
    name: "El Nutridor",
    keywords: ["Responsable", "Protector", "Armonioso"],
    description: "Tu energía es la del hogar y la responsabilidad. Desarrollás la protección, la armonía y el amor práctico.",
    quote: "El amor más grande es el que te das para poder dar.",
    careers: ["Médico", "Enfermero", "Docente", "Terapeuta familiar", "Chef", "Diseñador de interiores"],
    strengths: ["Responsabilidad", "Empatía", "Generosidad", "Armonía"],
    challenges: ["Autosacrificio", "Control", "Culpa"],
  },
  7: {
    number: 7,
    name: "El Investigador",
    keywords: ["Curioso", "Analítico", "Observador"],
    description: "Tu energía es la verdad interna. Desarrollás la sabiduría, la observación y la capacidad de ir más allá de lo superficial.",
    quote: "La verdad no teme a la pregunta.",
    careers: ["Científico", "Investigador", "Programador", "Filósofo", "Analista de datos", "Estratega"],
    strengths: ["Análisis", "Sabiduría", "Observación", "Intuición"],
    challenges: ["Aislamiento", "Escepticismo", "Perfeccionismo"],
  },
  8: {
    number: 8,
    name: "El Poderoso",
    keywords: ["Ambicioso", "Estratégico", "Autoritario"],
    description: "Tu energía es la del imperio. Desarrollás la estrategia, la visión y la capacidad de materializar proyectos grandes.",
    quote: "El verdadero poder es el que compartís.",
    careers: ["Ejecutivo", "Abogado", "Empresario", "Inversor", "Director financiero", "Político"],
    strengths: ["Ambición", "Estrategia", "Liderazgo", "Visión"],
    challenges: ["Materialismo", "Control", "Intimidación"],
  },
  9: {
    number: 9,
    name: "El Adaptador / El Místico",
    keywords: ["Adaptación", "Compasión", "Sabiduría Universal", "Finalización"],
    description: "Tu energía es la del todo. Desarrollás la adaptación, la compasión y la capacidad de cerrar ciclos con sabiduría.",
    quote: "Una sola persona puede cambiar el mundo.",
    careers: ["Filántropo", "Activista", "Terapeuta", "Coach", "ONG", "Artista social"],
    strengths: ["Adaptabilidad", "Compasión", "Sabiduría", "Capacidad de reflejar a otros", "Visión global"],
    challenges: ["Apego emocional", "Ego excesivo", "Influencia del entorno negativo", "Dificultad para soltar"],
    essence: "El 9 es el número de la culminación y la sabiduría adquirida. Su mayor fortaleza es su capacidad de adaptación: absorbe la energía de su entorno y se moldea a sí mismo para tener éxito. Es el 'espejo' que ayuda a otros a verse a sí mismos. Su misión es completar ciclos y dejar un legado, pero debe protegerse de los apegos emocionales que pueden desviarlo.",
  },
  11: {
    number: 11,
    name: "El Visionario",
    keywords: ["Intuitivo", "Inspirador", "Iluminado"],
    description: "Tu energía es la del puente entre mundos. Desarrollás la intuición, la inspiración y la capacidad de transmitir ideas nuevas.",
    quote: "Los ojos ven lo que la mente está preparada para comprender.",
    careers: ["Mentor", "Sanador", "Artista espiritual", "Consultor", "Escritor inspiracional", "Innovador"],
    strengths: ["Intuición", "Inspiración", "Sensibilidad", "Creatividad"],
    challenges: ["Ansiedad", "Inseguridad", "Presión"],
  },
  22: {
    number: 22,
    name: "El Constructor Maestro",
    keywords: ["Práctico", "Visionario", "Manifestador"],
    description: "Tu energía es la del arquitecto divino. Desarrollás la manifestación, la organización y la capacidad de construir a gran escala.",
    quote: "Soñá en grande, construí con determinación.",
    careers: ["Arquitecto", "Ingeniero civil", "CEO de gran escala", "Urbanista", "Desarrollador", "Líder global"],
    strengths: ["Manifestación", "Organización", "Visión", "Inspiración"],
    challenges: ["Presión", "Perfeccionismo", "Rigidez"],
  },
  33: {
    number: 33,
    name: "El Maestro",
    keywords: ["Compasivo", "Sabio", "Transformador"],
    description: "Tu energía es la del amor universal en acción. Desarrollás la sanación, la compasión y la capacidad de transformar desde el corazón.",
    quote: "El amor no es lo que decís. Es lo que hacés.",
    careers: ["Maestro", "Sanador", "Guía espiritual", "Coach humanista", "Artista curativo", "Filántropo"],
    strengths: ["Compasión", "Sabiduría", "Sanación", "Liderazgo"],
    challenges: ["Autosacrificio", "Carga emocional", "Perfeccionismo"],
  },
};

export const PERSONAL_YEAR_INTERPRETATIONS_ES: Readonly<Record<number, { name: string; description: string; theme: string }>> = {
  1: { name: "Año de Nuevos Comienzos", description: "Semillas, independencia y liderazgo activo.", theme: "un año de nuevos comienzos" },
  2: { name: "Año de Cooperación", description: "Relaciones, paciencia y diplomacia receptiva.", theme: "un año de cooperación y relaciones" },
  3: { name: "Año de Expresión", description: "Creatividad, comunicación social y alegría expansiva.", theme: "un año de expresión y creatividad" },
  4: { name: "Año de Construcción", description: "Trabajo metódico, estabilidad y cimientos sólidos.", theme: "un año de trabajo y estabilidad" },
  5: { name: "Año de Cambio", description: "Libertad, aventura y transformación flexible.", theme: "un año de cambio y aventura" },
  6: { name: "Año de Responsabilidad", description: "Familia, hogar, cuidado y armonía afectiva.", theme: "un año de responsabilidad y hogar" },
  7: { name: "Año de Introspección", description: "Análisis profundo, espiritualidad y sabiduría interna.", theme: "un año de introspección y sabiduría" },
  8: { name: "Año de Manifestación", description: "Poder personal, logros materiales y liderazgo estratégico.", theme: "un año de manifestación y poder" },
  9: { name: "Año de Cierre", description: "Finalización de ciclos, compasión y liberación consciente.", theme: "un año de cierre y compasión" },
  11: { name: "Año de Iluminación", description: "Intuición elevada, inspiración y despertar de consciencia.", theme: "un año de intuición elevada" },
  22: { name: "Año de Construcción Maestra", description: "Visión práctica a gran escala y manifestación colectiva.", theme: "un año de construcción a gran escala" },
  33: { name: "Año de Amor Universal", description: "Servicio altruista, sanación y compasión transformadora.", theme: "un año de servicio y amor" },
};
