export const ZODIAC_SIGNS = [
  { name: "Aries", element: "Fuego", modality: "Cardinal", dates: "21 mar - 19 abr", symbol: "♈", keywords: ["Independiente", "Energético", "Valiente"], archetype: "El Pionero", archetypeEn: "The Pioneer" },
  { name: "Tauro", element: "Tierra", modality: "Fijo", dates: "20 abr - 20 may", symbol: "♉", keywords: ["Paciente", "Práctico", "Determinado"], archetype: "El Constructor", archetypeEn: "The Builder" },
  { name: "Géminis", element: "Aire", modality: "Mutable", dates: "21 may - 20 jun", symbol: "♊", keywords: ["Curioso", "Comunicativo", "Versátil"], archetype: "El Narrador", archetypeEn: "The Storyteller" },
  { name: "Cáncer", element: "Agua", modality: "Cardinal", dates: "21 jun - 22 jul", symbol: "♋", keywords: ["Sensible", "Protector", "Emocional"], archetype: "El Sanador", archetypeEn: "The Healer" },
  { name: "Leo", element: "Fuego", modality: "Fijo", dates: "23 jul - 22 ago", symbol: "♌", keywords: ["Creativo", "Líder", "Generoso"], archetype: "La Estrella", archetypeEn: "The Star" },
  { name: "Virgo", element: "Tierra", modality: "Mutable", dates: "23 ago - 22 sep", symbol: "♍", keywords: ["Analítico", "Detallista", "Servicial"], archetype: "El Organizador", archetypeEn: "The Organizer" },
  { name: "Libra", element: "Aire", modality: "Cardinal", dates: "23 sep - 22 oct", symbol: "♎", keywords: ["Diplomático", "Armonioso", "Justo"], archetype: "El Pacificador", archetypeEn: "The Peacemaker" },
  { name: "Escorpio", element: "Agua", modality: "Fijo", dates: "23 oct - 21 nov", symbol: "♏", keywords: ["Intenso", "Transformador", "Misterioso"], archetype: "El Investigador", archetypeEn: "The Investigator" },
  { name: "Sagitario", element: "Fuego", modality: "Mutable", dates: "22 nov - 21 dic", symbol: "♐", keywords: ["Aventurero", "Optimista", "Filósofo"], archetype: "El Aventurero", archetypeEn: "The Adventurer" },
  { name: "Capricornio", element: "Tierra", modality: "Cardinal", dates: "22 dic - 19 ene", symbol: "♑", keywords: ["Ambicioso", "Responsable", "Disciplinado"], archetype: "El que consigue", archetypeEn: "The Achiever" },
  { name: "Acuario", element: "Aire", modality: "Fijo", dates: "20 ene - 18 feb", symbol: "♒", keywords: ["Innovador", "Independiente", "Humanitario"], archetype: "El Visionario", archetypeEn: "The Visionary" },
  { name: "Piscis", element: "Agua", modality: "Mutable", dates: "19 feb - 20 mar", symbol: "♓", keywords: ["Sensíble", "Intuitivo", "Creativo"], archetype: "El Poeta", archetypeEn: "The Poet" },
];

export const PLANETS = [
  { name: "Sol", symbol: "☉", meaning: "Identidad, ego, vitalidad" },
  { name: "Luna", symbol: "☽", meaning: "Emociones, instinto, subconsciente" },
  { name: "Mercurio", symbol: "☿", meaning: "Comunicación, pensamiento, lógica" },
  { name: "Venus", symbol: "♀", meaning: "Amor, belleza, valores" },
  { name: "Marte", symbol: "♂", meaning: "Acción, energía, deseo" },
  { name: "Júpiter", symbol: "♃", meaning: "Expansión, suerte, sabiduría" },
  { name: "Saturno", symbol: "♄", meaning: "Limitación, karma, lecciones" },
  { name: "Urano", symbol: "♅", meaning: "Innovación, cambio, revolución" },
  { name: "Neptuno", symbol: "♆", meaning: "Sueños, espiritualidad, ilusión" },
  { name: "Plutón", symbol: "♇", meaning: "Poder, transformación, regeneración" },
];

export const HOUSES = [
  { number: 1, name: "Personalidad", area: "Identidad y apariencia" },
  { number: 2, name: "Recursos", area: "Dinero y valores" },
  { number: 3, name: "Comunicación", area: "Hermandad y aprendizaje" },
  { number: 4, name: "Hogar", area: "Familia y raíces" },
  { number: 5, name: "Creatividad", area: "Amor, hijos y arte" },
  { number: 6, name: "Servicio", area: "Trabajo y salud" },
  { number: 7, name: "Relaciones", area: "Pareja y socios" },
  { number: 8, name: "Transformación", area: "Muerte y renacimiento" },
  { number: 9, name: "Filosofía", area: "Viajes y creencias" },
  { number: 10, name: "Carrera", area: "Vocación y reconocimiento" },
  { number: 11, name: "Amigos", area: "Comunidad y grupos" },
  { number: 12, name: "Espiritualidad", area: "Lo oculto y kármico" },
];

export const ASPECTS = [
  { name: "Conjunción", angle: "0°", meaning: "Fusión de energías" },
  { name: "Sextil", angle: "60°", meaning: "Oportunidad y talento" },
  { name: "Cuadratura", angle: "90°", meaning: "Tensión y desafío" },
  { name: "Trígono", angle: "120°", meaning: "Flujo natural y don" },
  { name: "Oposición", angle: "180°", meaning: "Polaridad y proyección" },
];

/** Re-export from the canonical source of truth. */
import { ANIMALS } from "@/lib/data/animalRelations";
export const CHINESE_ANIMALS = ANIMALS;
export const CHINESE_ELEMENTS = ["Metal", "Agua", "Madera", "Fuego", "Tierra"];
/**
 * @deprecated Legacy data — use animalRelations.ts as the single source of truth
 * for zodiac relationships and scores. This array is only used for display in
 * the knowledge section. Animal names corrected: "Oveja" → "Cabra".
 */
export const CHINESE_COMPATIBILITY = [
  ["Rata", ["Dragón", "Mono", "Rata"], ["Caballo", "Gato"]],
  ["Buey", ["Serpiente", "Gallo", "Buey"], ["Cabra", "Perro"]],
  ["Tigre", ["Caballo", "Perro", "Tigre"], ["Serpiente", "Mono"]],
  ["Gato", ["Cabra", "Cerdo", "Gato"], ["Rata", "Gallo"]],
  ["Dragón", ["Rata", "Serpiente", "Dragón"], ["Perro", "Gato"]],
  ["Serpiente", ["Mono", "Gallo", "Serpiente"], ["Cerdo", "Tigre"]],
  ["Caballo", ["Tigre", "Perro", "Caballo"], ["Rata", "Buey"]],
  ["Cabra", ["Gato", "Cerdo", "Cabra"], ["Buey", "Perro"]],
  ["Mono", ["Rata", "Dragón", "Mono"], ["Tigre", "Cerdo"]],
  ["Gallo", ["Buey", "Serpiente", "Gallo"], ["Gato", "Perro"]],
  ["Perro", ["Tigre", "Gato", "Perro"], ["Buey", "Dragón"]],
  ["Cerdo", ["Gato", "Cabra", "Cerdo"], ["Serpiente", "Mono"]],
];

export const HUMAN_DESIGN_TYPES = [
  { type: "Generador", description: "Energía de trabajo y creación.", strategy: "Esperar a responder" },
  { type: "Proyector", description: "Energía de dirección y gestión.", strategy: "Esperar la invitación" },
  { type: "Manifestador", description: "Energía de inicio e innovación.", strategy: "Informar antes de actuar" },
  { type: "Generador Manifestante", description: "Combinación de energía y acción.", strategy: "Esperar y después informar/actuar" },
  { type: "Reflector", description: "Espejo de la comunidad.", strategy: "Esperar el ciclo lunar" },
];

export const ENEAGRAM_TYPES = [
  { number: 1, name: "El Perfeccionista", fear: "Ser defectuoso", desire: "Ser bueno" },
  { number: 2, name: "El Ayudador", fear: "Ser amado", desire: "Ser querido" },
  { number: 3, name: "El Triunfador", fear: "Ser inútil", desire: "Ser valioso" },
  { number: 4, name: "El Individualista", fear: "No tener identidad", desire: "Ser único" },
  { number: 5, name: "El Investigador", fear: "Ser invadido", desire: "Ser competente" },
  { number: 6, name: "El Lealista", fear: "No tener seguridad", desire: "Ser seguro" },
  { number: 7, name: "El Entusiasta", fear: "Ser privado", desire: "Ser feliz" },
  { number: 8, name: "El Desafiador", fear: "Ser vulnerable", desire: "Ser protector" },
  { number: 9, name: "El Pacificador", fear: "Ser en conflicto", desire: "Ser pacífico" },
];

export const ICHING_HEXAGRAMS = [
  { number: 1, name: "Lo Creativo", description: "Fuerza creativa, origen, movimiento." },
  { number: 2, name: "Lo Receptivo", description: "Receptividad, tierra, dedicación." },
  { number: 3, name: "La Dificultad Inicial", description: "Esfuerzo, lucha, ingenuidad." },
  { number: 22, name: "La Gracia", description: "Belleza, arte, elegancia." },
  { number: 55, name: "La Abundancia", description: "Riqueza, éxito, culminación." },
];

export const KABBALAH_TREE = [
  { sefirah: "Keter", meaning: "Corona", attribute: "Voluntad divina" },
  { sefirah: "Chokmah", meaning: "Sabiduría", attribute: "Creatividad" },
  { sefirah: "Binah", meaning: "Entendimiento", attribute: "Lógica" },
  { sefirah: "Chesed", meaning: "Misericordia", attribute: "Benevolencia" },
  { sefirah: "Gevurah", meaning: "Severidad", attribute: "Fuerza" },
  { sefirah: "Tiferet", meaning: "Belleza", attribute: "Equilibrio" },
];

export const GENE_KEYS = [
  { number: 1, gift: "Creatividad", shadow: "Adicción" },
  { number: 2, gift: "Unidad", shadow: "Separación" },
  { number: 3, gift: "Innovación", shadow: "Fricción" },
  { number: 4, gift: "Forma", shadow: "Condena" },
  { number: 5, gift: "Paciencia", shadow: "Impaciencia" },
];

export const KNOWLEDGE_BASE = {
  numerology: {
    history: "La numerología pitagórica se originó en la antigua Grecia con Pitágoras, pero sus raíces se remontan a tradiciones babilónicas y hebreas.",
    methods: {
      pythagorean: "A=1, B=2, ... Z=8",
      chaldean: "A=1, B=2, ... Z=7",
    },
    masterNumbers: [11, 22, 33],
    sources: ["Pitágoras", "Numerología Caldea"],
    topics: [
      { title: "Historia y orígenes", description: "Desde Babilonia hasta Pitágoras." },
      { title: "Tabla pitagórica", description: "Correspondencia letra-número." },
      { title: "Números maestros", description: "11, 22, 33: significado y poder." },
      { title: "Cálculos básicos", description: "Life Path, Expresión, Soul, Personality." },
    ],
  },
  astrology: {
    history: "La astrología occidental tiene más de 4000 años de antigüedad, pasando por Babilonia, Egipto, Grecia y Roma.",
    signs: ZODIAC_SIGNS,
    planets: PLANETS,
    houses: HOUSES,
    aspects: ASPECTS,
    sources: ["Tradición Helenística", "Astrología Moderna", "Zodíaco Tropical"],
    topics: [
      { title: "Signos y elementos", description: "Los 12 signos y sus cualidades." },
      { title: "Planetas", description: "Influencias planetarias básicas." },
      { title: "Casas astrológicas", description: "Áreas de la vida." },
      { title: "Aspectos", description: "Ángulos y relaciones planetarias." },
    ],
  },
  chineseZodiac: {
    history: "El zodiaco chino tiene más de 2000 años y está basado en el calendario lunar y el ciclo sexagenario.",
    animals: CHINESE_ANIMALS,
    elements: CHINESE_ELEMENTS,
    compatibility: CHINESE_COMPATIBILITY,
    sources: ["Calendario Lunar Chino", "I Ching", "Taoísmo"],
    topics: [
      { title: "Animales y elementos", description: "Los 12 animales y 5 elementos." },
      { title: "Compatibilidades", description: "Relaciones entre signos." },
      { title: "Años chinos", description: "Ciclo de 60 años." },
    ],
  },
  frameworks: [
    { id: "human-design", name: "Human Design", description: "Tipos y estrategias.", icon: "🧬" },
    { id: "eneagrama", name: "Eneagrama", description: "9 personalidades básicas.", icon: "🧩" },
    { id: "i-ching", name: "I Ching", description: "Hexagramas y cambio.", icon: "☯️" },
    { id: "kabbalah", name: "Kabbalah", description: "Árbol de la vida y sefirot.", icon: "🌳" },
    { id: "gene-keys", name: "Gene Keys", description: "Dones y sombras.", icon: "🧪" },
  ],
};
