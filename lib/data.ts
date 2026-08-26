export const ARCHETYPES: Record<number, any> = {
  1: { number: 1, name: "EL LÍDER", keywords: ["Independiente", "Innovador", "Determinado"], description: "Naciste para liderar.", quote: "El poder no se te da. Lo tomás.", color: "#7B5E1C", colorLight: "#F5E6C8", careers: ["Emprendedor", "CEO", "Líder político", "Consultor", "Director", "Inversor"] },
  2: { number: 2, name: "EL MEDIADOR", keywords: ["Diplomático", "Sensible", "Cooperativo"], description: "Tu energía es la del puente.", quote: "La verdadera fuerza está en la unión.", color: "#B33740", colorLight: "#F5E0E3", careers: ["Diplomático", "Terapeuta", "Mediador", "RRHH", "Asistente social", "Psicólogo"] },
  3: { number: 3, name: "EL COMUNICADOR", keywords: ["Creativo", "Expresivo", "Optimista"], description: "Tu energía es la de la expresión.", quote: "El mundo es tu lienzo.", color: "#A84200", colorLight: "#FFE4D1", careers: ["Artista", "Escritor", "Actor", "Diseñador", "Periodista", "Cantante"] },
  4: { number: 4, name: "EL CONSTRUCTOR", keywords: ["Práctico", "Organizado", "Confiable"], description: "Tu energía es la de los cimientos.", quote: "Los grandes edificios se levantan un ladrillo a la vez.", color: "#2D5A3D", colorLight: "#D4E5D8", careers: ["Ingeniero", "Arquitecto", "Gerente de proyectos", "Contador", "Analista", "Supervisor"] },
  5: { number: 5, name: "EL AVENTURERO", keywords: ["Versátil", "Libre", "Curioso"], description: "Tu energía es la del viento.", quote: "La vida es demasiado corta para seguir el camino trillado.", color: "#B03E30", colorLight: "#F5D5D0", careers: ["Viajero", "Periodista", "Emprendedor digital", "Fotógrafo", "Marketing", "Relaciones públicas"] },
  6: { number: 6, name: "EL NUTRIDOR", keywords: ["Responsable", "Protector", "Armonioso"], description: "Tu energía es la del hogar.", quote: "El amor más grande es el que te das para poder dar.", color: "#436F43", colorLight: "#E0F0E0", careers: ["Médico", "Enfermero", "Docente", "Terapeuta familiar", "Chef", "Diseñador de interiores"] },
  7: { number: 7, name: "EL INVESTIGADOR", keywords: ["Curioso", "Analítico", "Observador"], description: "Tu energía es la de la verdad.", quote: "La verdad no teme a la pregunta.", color: "#4A5568", colorLight: "#D8DEE4", careers: ["Científico", "Investigador", "Programador", "Filósofo", "Analista de datos", "Estratega"] },
  8: { number: 8, name: "EL PODEROSO", keywords: ["Ambicioso", "Estratégico", "Autoritario"], description: "Tu energía es la del imperio.", quote: "El verdadero poder es el que compartís.", color: "#6B4C7A", colorLight: "#E0D5E8", careers: ["Ejecutivo", "Abogado", "Empresario", "Inversor", "Director financiero", "Político"] },
  9: { number: 9, name: "EL CAMALEÓN / EL MÍSTICO", keywords: ["Adaptación", "Compasión", "Sabiduría Universal", "Finalización"], essence: "El 9 es el número de la culminación y la sabiduría adquirida. Su mayor fortaleza es su capacidad de adaptación: absorbe la energía de su entorno y se moldea a sí mismo para tener éxito. Es el 'espejo' que ayuda a otros a verse a sí mismos. Su misión es completar ciclos y dejar un legado, pero debe protegerse de los apegos emocionales que pueden desviarlo.", description: "Tu energía es la del todo.", quote: "Una sola persona puede cambiar el mundo.", color: "#2E5C8A", colorLight: "#D0E0F0", careers: ["Filántropo", "Activista", "Terapeuta", "Coach", "ONG", "Artista social"] },
  11: { number: 11, name: "EL VISIONARIO", keywords: ["Intuitivo", "Inspirador", "Iluminado"], description: "Tu energía es la del puente entre mundos.", quote: "Los ojos ven lo que la mente está preparada para comprender.", color: "#7A44F5", colorLight: "#E5D5FF", careers: ["Mentor", "Sanador", "Artista espiritual", "Consultor", "Escritor inspiracional", "Innovador"] },
  22: { number: 22, name: "EL CONSTRUCTOR MAESTRO", keywords: ["Práctico", "Visionario", "Manifestador"], description: "Tu energía es la del arquitecto divino.", quote: "Soñá en grande, construí con determinación.", color: "#38678F", colorLight: "#D0E0F0", careers: ["Arquitecto", "Ingeniero civil", "CEO de gran escala", "Urbanista", "Desarrollador", "Líder global"] },
  33: { number: 33, name: "EL MAESTRO", keywords: ["Compasivo", "Sabio", "Transformador"], description: "Tu energía es la del amor universal en acción.", quote: "El amor no es lo que decís. Es lo que hacés.", color: "#886308", colorLight: "#F5E6C8", careers: ["Maestro", "Sanador", "Guía espiritual", "Coach humanista", "Artista curativo", "Filántropo"] }
};

export interface Archetype {
  number: number;
  name: string;
  keywords: string[];
  description: string;
  quote: string;
  color: string;
  colorLight: string;
  careers: string[];
}

export const ENERGY_TYPES: Record<number, any> = {
  1: { name: "Iniciación", color: "#D4A843", icon: "⚡", insights: ["Hoy es día de comenzar algo nuevo.", "Tu energía de líder está al máximo."] },
  2: { name: "Cooperación", color: "#E8B4B8", icon: "🤝", insights: ["Hoy la magia está en escuchar.", "Buscá el equilibrio."] },
  3: { name: "Expresión", color: "#FF8C42", icon: "🎨", insights: ["Dejá fluir tu creatividad.", "Hoy tu voz tiene poder especial."] },
  4: { name: "Construcción", color: "#2D5A3D", icon: "🏗️", insights: ["Organizá tu espacio.", "La disciplina te recompensará."] },
  5: { name: "Cambio", color: "#C44536", icon: "🌪️", insights: ["Abríte a lo inesperado.", "Una oportunidad aparecerá."] },
  6: { name: "Responsabilidad", color: "#8FBC8F", icon: "🏠", insights: ["Cuidá de quienes te rodean.", "Un gesto pequeño tendrá gran impacto."] },
  7: { name: "Introspección", color: "#4A5568", icon: "🔍", insights: ["Tu energía está orientada hacia adentro.", "Escuchá más de lo que hablás."] },
  8: { name: "Manifestación", color: "#6B4C7A", icon: "👑", insights: ["Tu poder de manifestación está activado.", "Asumí liderazgo en proyectos."] },
  9: { name: "Compasión", color: "#2E5C8A", icon: "💙", insights: ["Tu corazón está abierto.", "Perdoná para liberar tu energía."] },
  11: { name: "Iluminación", color: "#8B5CF6", icon: "✨", insights: ["Tu intuición está en su punto más alto.", "Prestá atención a las señales."] },
  22: { name: "Construcción Divina", color: "#4682B4", icon: "🏛️", insights: ["Soñá en grande.", "Tu visión puede materializarse."] },
  33: { name: "Amor Universal", color: "#B8860B", icon: "❤️", insights: ["Tu energía sanadora está al máximo.", "Serví a otros sin esperar nada."] }
};

export const YEAR_TYPES: Record<number, any> = {
  1: { name: "Año de Nuevos Comienzos", description: "Semillas, independencia, liderazgo." },
  2: { name: "Año de Cooperación", description: "Relaciones, paciencia, diplomacia." },
  3: { name: "Año de Expresión", description: "Creatividad, comunicación, alegría." },
  4: { name: "Año de Construcción", description: "Trabajo, estabilidad, disciplina." },
  5: { name: "Año de Cambio", description: "Libertad, aventura, transformación." },
  6: { name: "Año de Responsabilidad", description: "Familia, hogar, servicio." },
  7: { name: "Año de Introspección", description: "Análisis, espiritualidad, sabiduría." },
  8: { name: "Año de Manifestación", description: "Poder, abundancia, logros." },
  9: { name: "Año de Cierre", description: "Finalización, compasión, liberación." },
  11: { name: "Año de Iluminación", description: "Intuición, inspiración, despertar espiritual." },
  22: { name: "Año de Construcción Maestra", description: "Visión práctica, manifestación a gran escala." },
  33: { name: "Año de Amor Universal", description: "Servicio, compasión, transformación global." }
};

export const COUNTRY_DATA: Record<string, any> = {
  "Argentina": { year: 1816, animal: "Rata", element: "Fuego", flag: "🇦🇷" },
  "Brasil": { year: 1822, animal: "Caballo", element: "Agua", flag: "🇧🇷" },
  "Chile": { year: 1818, animal: "Tigre", element: "Tierra", flag: "🇨🇱" },
  "Colombia": { year: 1810, animal: "Caballo", element: "Metal", flag: "🇨🇴" },
  "México": { year: 1810, animal: "Caballo", element: "Metal", flag: "🇲🇽" },
  "Perú": { year: 1821, animal: "Serpiente", element: "Metal", flag: "🇵🇪" },
  "Uruguay": { year: 1825, animal: "Gallo", element: "Madera", flag: "🇺🇾" },
  "Venezuela": { year: 1811, animal: "Cabra", element: "Metal", flag: "🇻🇪" },
  "España": { year: 1492, animal: "Rata", element: "Agua", flag: "🇪🇸" },
  "Francia": { year: 843, animal: "Cerdo", element: "Agua", flag: "🇫🇷" },
  "Alemania": { year: 1871, animal: "Cabra", element: "Metal", flag: "🇩🇪" },
  "Italia": { year: 1861, animal: "Gallo", element: "Metal", flag: "🇮🇹" },
  "Reino Unido": { year: 1707, animal: "Cerdo", element: "Fuego", flag: "🇬🇧" },
  "Estados Unidos": { year: 1776, animal: "Mono", element: "Fuego", flag: "🇺🇸" },
  "Canadá": { year: 1867, animal: "Gato", element: "Fuego", flag: "🇨🇦" },
  "Australia": { year: 1901, animal: "Buey", element: "Metal", flag: "🇦🇺" },
  "China": { year: 1949, animal: "Buey", element: "Tierra", flag: "🇨🇳" },
  "Japón": { year: 660, animal: "Rata", element: "Metal", flag: "🇯🇵" },
  "India": { year: 1947, animal: "Cerdo", element: "Fuego", flag: "🇮🇳" },
  "Egipto": { year: 1922, animal: "Perro", element: "Agua", flag: "🇪🇬" }
};

export const BRAND_DATA: Record<string, any> = {
  "Apple": { year: 1976, animal: "Dragón", element: "Fuego", logo: "🍎", category: "Tecnología" },
  "Google": { year: 1998, animal: "Tigre", element: "Tierra", logo: "🔍", category: "Tecnología" },
  "Microsoft": { year: 1975, animal: "Gato", element: "Madera", logo: "💻", category: "Tecnología" },
  "Amazon": { year: 1994, animal: "Perro", element: "Madera", logo: "📦", category: "Tecnología" },
  "Tesla": { year: 2003, animal: "Cabra", element: "Agua", logo: "⚡", category: "Automotriz" },
  "Netflix": { year: 1997, animal: "Buey", element: "Fuego", logo: "🎬", category: "Entretenimiento" },
  "Nike": { year: 1964, animal: "Dragón", element: "Madera", logo: "👟", category: "Moda" },
  "Adidas": { year: 1949, animal: "Buey", element: "Tierra", logo: "👕", category: "Moda" },
  "Coca-Cola": { year: 1886, animal: "Perro", element: "Fuego", logo: "🥤", category: "Alimentación" },
  "Starbucks": { year: 1971, animal: "Cerdo", element: "Metal", logo: "☕", category: "Alimentación" }
};

export const BAND_DATA: Record<string, any> = {
  "The Beatles": { year: 1960, animal: "Rata", element: "Metal", logo: "🎵", genre: "Rock" },
  "The Rolling Stones": { year: 1962, animal: "Tigre", element: "Agua", logo: "🎸", genre: "Rock" },
  "Queen": { year: 1970, animal: "Perro", element: "Metal", logo: "👑", genre: "Rock" },
  "Soda Stereo": { year: 1982, animal: "Perro", element: "Agua", logo: "🌟", genre: "Rock en Español" },
  "Nirvana": { year: 1987, animal: "Gato", element: "Fuego", logo: "😵", genre: "Grunge" },
  "Metallica": { year: 1981, animal: "Gallo", element: "Metal", logo: "⚡", genre: "Metal" }
};

export const TEAM_DATA: Record<string, any> = {
  "Boca Juniors": { year: 1905, animal: "Serpiente", element: "Madera", logo: "🔵🟡", country: "Argentina" },
  "River Plate": { year: 1901, animal: "Buey", element: "Metal", logo: "🔴⚪", country: "Argentina" },
  "Real Madrid": { year: 1902, animal: "Tigre", element: "Agua", logo: "⚪", country: "España" },
  "Barcelona": { year: 1899, animal: "Cerdo", element: "Tierra", logo: "🔵🔴", country: "España" },
  "Manchester United": { year: 1878, animal: "Tigre", element: "Tierra", logo: "🔴", country: "Inglaterra" },
  "Liverpool": { year: 1892, animal: "Dragón", element: "Agua", logo: "🔴", country: "Inglaterra" }
};

export const POLITICIAN_DATA: Record<string, any> = {
  "Javier Milei": { year: 1970, animal: "Perro", element: "Metal", logo: "🦁", country: "Argentina", role: "Presidente" },
  "Joe Biden": { year: 1942, animal: "Caballo", element: "Agua", logo: "🇺🇸", country: "Estados Unidos", role: "Presidente" },
  "Donald Trump": { year: 1946, animal: "Perro", element: "Fuego", logo: "🇺🇸", country: "Estados Unidos", role: "Ex Presidente" },
  "Lula da Silva": { year: 1945, animal: "Gallo", element: "Madera", logo: "🇧🇷", country: "Brasil", role: "Presidente" },
  "Pedro Sánchez": { year: 1972, animal: "Rata", element: "Agua", logo: "🇪🇸", country: "España", role: "Presidente" },
  "Emmanuel Macron": { year: 1977, animal: "Serpiente", element: "Fuego", logo: "🇫🇷", country: "Francia", role: "Presidente" },
  "Olaf Scholz": { year: 1958, animal: "Perro", element: "Tierra", logo: "🇩🇪", country: "Alemania", role: "Canciller" }
};

export const ACTOR_DATA: Record<string, any> = {
  "Leonardo DiCaprio": { year: 1974, animal: "Tigre", element: "Madera", logo: "🎬", country: "Estados Unidos", knownFor: "Titanic, Inception" },
  "Brad Pitt": { year: 1963, animal: "Gato", element: "Agua", logo: "🎬", country: "Estados Unidos", knownFor: "Fight Club" },
  "Tom Hanks": { year: 1956, animal: "Mono", element: "Fuego", logo: "🎬", country: "Estados Unidos", knownFor: "Forrest Gump" },
  "Will Smith": { year: 1968, animal: "Mono", element: "Tierra", logo: "🎬", country: "Estados Unidos", knownFor: "Men in Black" },
  "Ricardo Darín": { year: 1957, animal: "Gallo", element: "Fuego", logo: "🎬", country: "Argentina", knownFor: "El Secreto de sus Ojos" }
};

export function getCompatibilityScore(userAnimal: string, targetAnimal: string): number {
  if (!userAnimal || !targetAnimal) return 50;
  // Lazy import to avoid circular dependency
  const animalRelations = require("@/lib/data/animalRelations") as typeof import("@/lib/data/animalRelations");
  return animalRelations.getRelation(userAnimal as any, targetAnimal as any).score;
}

export function getCompatibilityDescription(score: number, animal: string): string {
  if (score >= 80) return `✨ Excelente compatibilidad con ${animal}. Energías complementarias.`;
  if (score >= 60) return `👍 Buena compatibilidad con ${animal}. Potencial de crecimiento.`;
  if (score >= 40) return `🔄 Compatibilidad moderada con ${animal}. Requiere esfuerzo.`;
  return `🔴 Compatibilidad baja con ${animal}. Dinámicas desafiantes.`;
}

export const CUISINE_DATA: Record<string, any> = {
  "Argentina": { year: 1816, animal: "Rata", element: "Fuego", flag: "🇦🇷", dish: "Asado", type: "Parrilla" },
  "Brasil": { year: 1822, animal: "Caballo", element: "Agua", flag: "🇧🇷", dish: "Feijoada", type: "Tradicional" },
  "México": { year: 1810, animal: "Caballo", element: "Metal", flag: "🇲🇽", dish: "Tacos", type: "Tex-mex" },
  "Italia": { year: 1861, animal: "Gallo", element: "Metal", flag: "🇮🇹", dish: "Pasta", type: "Mediterránea" },
  "Japón": { year: 660, animal: "Rata", element: "Metal", flag: "🇯🇵", dish: "Sushi", type: "Asiática" },
  "India": { year: 1947, animal: "Cerdo", element: "Fuego", flag: "🇮🇳", dish: "Curry", type: "Especiada" },
  "Francia": { year: 843, animal: "Cerdo", element: "Agua", flag: "🇫🇷", dish: "Croissant", type: "Pastelería" },
  "China": { year: 1949, animal: "Buey", element: "Tierra", flag: "🇨🇳", dish: "Dim sum", type: "Asiática" }
};

export const CITY_DATA: Record<string, any> = {
  "Buenos Aires": { year: 1536, animal: "Gato", element: "Tierra", flag: "🇦🇷", country: "Argentina", population: "3M", vibe: "Cosmopolita" },
  "Madrid": { year: 1561, animal: "Perro", element: "Fuego", flag: "🇪🇸", country: "España", population: "6.7M", vibe: "Vibrante" },
  "Ciudad de México": { year: 1325, animal: "Serpiente", element: "Agua", flag: "🇲🇽", country: "México", population: "9M", vibe: "Cultural" },
  "Tokio": { year: 1457, animal: "Serpiente", element: "Metal", flag: "🇯🇵", country: "Japón", population: "37M", vibe: "Futurista" },
  "París": { year: 508, animal: "Buey", element: "Madera", flag: "🇫🇷", country: "Francia", population: "11M", vibe: "Romántica" },
  "Nueva York": { year: 1624, animal: "Gallo", element: "Agua", flag: "🇺🇸", country: "Estados Unidos", population: "8.4M", vibe: "Urbana" },
  "Londres": { year: 50, animal: "Rata", element: "Agua", flag: "🇬🇧", country: "Reino Unido", population: "9M", vibe: "Histórica" },
  "Barcelona": { year: -218, animal: "Dragón", element: "Fuego", flag: "🇪🇸", country: "España", population: "5.6M", vibe: "Mediterránea" }
};

export const CELEBRITY_DATA: Record<string, any> = {
  "Taylor Swift": { year: 1989, animal: "Serpiente", element: "Tierra", logo: "🎤", category: "Música" },
  "Bad Bunny": { year: 1994, animal: "Perro", element: "Madera", logo: "🎵", category: "Música" },
  "Cristiano Ronaldo": { year: 1985, animal: "Buey", element: "Tierra", logo: "⚽", category: "Deportes" },
  "Lionel Messi": { year: 1987, animal: "Gato", element: "Fuego", logo: "⚽", category: "Deportes" },
  "Elon Musk": { year: 1971, animal: "Cerdo", element: "Metal", logo: "🚀", category: "Negocios" },
  "Bill Gates": { year: 1955, animal: "Cabra", element: "Madera", logo: "💻", category: "Tecnología" },
  "Oprah Winfrey": { year: 1954, animal: "Caballo", element: "Madera", logo: "📺", category: "Medios" },
  "Serena Williams": { year: 1981, animal: "Gallo", element: "Metal", logo: "🎾", category: "Deportes" }
};

export const INTENTION_OPTIONS = [
  { id: "autoconocimiento", label: "Autoconocimiento", icon: "🔮" },
  { id: "relaciones", label: "Relaciones", icon: "💞" },
  { id: "decisiones", label: "Decisiones", icon: "🧭" },
  { id: "creatividad", label: "Creatividad", icon: "🎨" },
];

export const SAMPLE_RELATIONS = [
  { name: "María", day: 15, month: 6, year: 1990 },
  { name: "Juan", day: 3, month: 9, year: 1988 },
  { name: "Sofía", day: 22, month: 12, year: 1992 },
];

export function getCompatibility(lifePath1: number, lifePath2: number): { score: number; love: string; work: string; communication: string; friendship: string; advice: string } {
  const diff = Math.abs(lifePath1 - lifePath2) % 9;
  const score = 100 - diff * 12;
  const clampedScore = Math.max(20, Math.min(100, score));

  if (clampedScore >= 80) {
    return {
      score: clampedScore,
      love: "Conexión emocional muy fuerte.",
      work: "Gran sinergia profesional.",
      communication: "Diálogo fluido y respetuoso.",
      friendship: "Confianza y apoyo mutuo.",
      advice: "Disfrutá esta relación, es un vínculo privilegiado.",
    };
  }
  if (clampedScore >= 60) {
    return {
      score: clampedScore,
      love: "Buena química, requiere atención.",
      work: "Colaboran bien con claridad.",
      communication: "Pueden mejorar la escucha activa.",
      friendship: "Complicidad con ajustes.",
      advice: "Invertí en pequeños gestos de atención.",
    };
  }
  return {
    score: clampedScore,
    love: "Diferencias emocionales importantes.",
    work: "Mejor tareas separadas o roles claros.",
    communication: "Necesitan paciencia y respeto.",
    friendship: "Requiere límites sanos.",
    advice: "Aceptá las diferencias sin culpa.",
  };
}

export const CYCLE_YEARS: Record<number, any> = YEAR_TYPES;

export const SYMBOLIC_FRAMEWORKS = [
  { id: "numerologia", name: "Numerología", description: "Tu número de vida y energía diaria", icon: "🔢", available: true },
  { id: "chino", name: "Horóscopo chino", description: "Tu animal y elemento", icon: "🐉", available: true },
  { id: " occidental", name: "Astrología occidental", description: "Signo solar, lunar y ascendente", icon: "⭐", available: true },
  { id: "ciclos", name: "Ciclos personales", description: "Tu año y tus fases", icon: "🌀", available: true },
  { id: "compatibilidad", name: "Compatibilidad", description: "Conexiones entre almas", icon: "💞", available: true },
  { id: "meditacion", name: "Meditación guiada", description: "Audio personalizado", icon: "🧘", available: false },
];
