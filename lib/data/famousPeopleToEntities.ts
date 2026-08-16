/**
 * Adapter and dataset for famous people matching.
 * Contains 70+ historical and modern figures with verified birth dates.
 *
 * Provides:
 * 1. FAMOUS_PEOPLE: Full dataset of famous personalities across disciplines
 * 2. findFamousMatches(profile): Matches user profile against famous figures
 * 3. FAMOUS_PEOPLE_ENTITIES: Preserves backward compatibility for Affinity System
 */

import { calculateLifePath } from "@/lib/engines/numerologyEngine";
import { getSunSign } from "@/lib/engines/astrologyEngine";
import { getChineseZodiac } from "@/lib/engines/chineseZodiacEngine";
import { FAMOUS_BY_ANIMAL, type FamousPerson } from "./famousPeople";
import type { AtlasEntityInput } from "@/types/atlas";
import type { UserProfile } from "@/types/user";

export type FamousField =
  | "Ciencia"
  | "Música"
  | "Arte"
  | "Deporte"
  | "Literatura"
  | "Tecnología"
  | "Política"
  | "Filosofía"
  | "Cine";

export interface RawFamousPerson {
  name: string;
  birthDate: string; // YYYY-MM-DD
  field: FamousField;
  country: string;
  shortBio: string;
  emoji: string;
  quote?: string;
}

export interface FamousPersonProfile extends RawFamousPerson {
  id: string;
  lifePath: number;
  sunSign: string;
  chineseZodiac: string;
  initials: string;
}

export const RAW_FAMOUS_PEOPLE: RawFamousPerson[] = [
  // ──── CIENCIA & TECNOLOGÍA ────
  {
    name: "Albert Einstein",
    birthDate: "1879-03-14",
    field: "Ciencia",
    country: "Alemania",
    shortBio: "Físico teórico, autor de la teoría de la relatividad y Nobel de Física.",
    emoji: "🔬",
    quote: "La imaginación es más importante que el conocimiento.",
  },
  {
    name: "Marie Curie",
    birthDate: "1867-11-07",
    field: "Ciencia",
    country: "Polonia",
    shortBio: "Pionera en radiactividad y primera persona con dos premios Nobel.",
    emoji: "⚗️",
    quote: "Nada en la vida debe ser temido, solo comprendido.",
  },
  {
    name: "Nikola Tesla",
    birthDate: "1856-07-10",
    field: "Ciencia",
    country: "Croacia / Serbia",
    shortBio: "Inventor del motor de corriente alterna y visionario de la energía inalámbrica.",
    emoji: "⚡",
    quote: "El presente es de ellos; el futuro, por el que trabajé, es mío.",
  },
  {
    name: "Charles Darwin",
    birthDate: "1809-02-12",
    field: "Ciencia",
    country: "Reino Unido",
    shortBio: "Naturalista que propuso la teoría de la evolución por selección natural.",
    emoji: "🌱",
  },
  {
    name: "Stephen Hawking",
    birthDate: "1942-01-08",
    field: "Ciencia",
    country: "Reino Unido",
    shortBio: "Físico teórico y cosmólogo, explorador de agujeros negros.",
    emoji: "🌌",
    quote: "Mirá a las estrellas y no abajo a tus pies.",
  },
  {
    name: "Carl Sagan",
    birthDate: "1934-11-09",
    field: "Ciencia",
    country: "Estados Unidos",
    shortBio: "Astrónomo, divulgador y creador de la serie Cosmos.",
    emoji: "🪐",
    quote: "Somos una forma del cosmos de conocerse a sí mismo.",
  },
  {
    name: "Alan Turing",
    birthDate: "1912-06-23",
    field: "Tecnología",
    country: "Reino Unido",
    shortBio: "Padre de la ciencia de la computación y la inteligencia artificial.",
    emoji: "💻",
  },
  {
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    field: "Tecnología",
    country: "Reino Unido",
    shortBio: "Matemática y primera programadora de computadoras de la historia.",
    emoji: "⚙️",
  },
  {
    name: "Steve Jobs",
    birthDate: "1955-02-24",
    field: "Tecnología",
    country: "Estados Unidos",
    shortBio: "Cofundador de Apple y revolucionario del diseño y la tecnología personal.",
    emoji: "📱",
    quote: "Mantenete hambriento, mantenete alocado.",
  },
  {
    name: "Tim Berners-Lee",
    birthDate: "1955-06-08",
    field: "Tecnología",
    country: "Reino Unido",
    shortBio: "Científico de la computación creador de la World Wide Web.",
    emoji: "🌐",
  },
  {
    name: "Linus Torvalds",
    birthDate: "1969-12-28",
    field: "Tecnología",
    country: "Finlandia",
    shortBio: "Creador del kernel Linux y del sistema de control de versiones Git.",
    emoji: "🐧",
  },
  {
    name: "Elon Musk",
    birthDate: "1971-06-28",
    field: "Tecnología",
    country: "Sudáfrica",
    shortBio: "Fundador de SpaceX y líder de Tesla en innovación energética y espacial.",
    emoji: "🚀",
  },
  {
    name: "Bill Gates",
    birthDate: "1955-10-28",
    field: "Tecnología",
    country: "Estados Unidos",
    shortBio: "Cofundador de Microsoft y filántropo global en salud y educación.",
    emoji: "🖥️",
  },

  // ──── MÚSICA ────
  {
    name: "Wolfgang Amadeus Mozart",
    birthDate: "1756-01-27",
    field: "Música",
    country: "Austria",
    shortBio: "Compositor prolífico y genial del periodo clásico occidental.",
    emoji: "🎼",
  },
  {
    name: "Ludwig van Beethoven",
    birthDate: "1770-12-16",
    field: "Música",
    country: "Alemania",
    shortBio: "Compositor cumbre entre el clasicismo y el romanticismo musical.",
    emoji: "🎹",
  },
  {
    name: "Freddie Mercury",
    birthDate: "1946-09-05",
    field: "Música",
    country: "Reino Unido",
    shortBio: "Vocalista de Queen y uno de los frontmans más icónicos del rock.",
    emoji: "👑",
  },
  {
    name: "David Bowie",
    birthDate: "1947-01-08",
    field: "Música",
    country: "Reino Unido",
    shortBio: "Innovador del glam rock, camaleón sonoro e icono cultural.",
    emoji: "⚡",
  },
  {
    name: "John Lennon",
    birthDate: "1940-10-09",
    field: "Música",
    country: "Reino Unido",
    shortBio: "Miembro de The Beatles, pacifista y autor de himnos generacionales.",
    emoji: "✌️",
    quote: "La vida es lo que te pasa mientras estás ocupado haciendo otros planes.",
  },
  {
    name: "Paul McCartney",
    birthDate: "1942-06-18",
    field: "Música",
    country: "Reino Unido",
    shortBio: "Compositor, multiinstrumentista y leyenda de The Beatles.",
    emoji: "🎸",
  },
  {
    name: "Bob Dylan",
    birthDate: "1941-05-24",
    field: "Música",
    country: "Estados Unidos",
    shortBio: "Cantautor poético, renovador de la música popular y Nobel de Literatura.",
    emoji: "🎙️",
  },
  {
    name: "Bob Marley",
    birthDate: "1945-02-06",
    field: "Música",
    country: "Jamaica",
    shortBio: "Embajador mundial del reggae, espiritualidad y justicia social.",
    emoji: "☀️",
  },
  {
    name: "Beyoncé",
    birthDate: "1981-09-04",
    field: "Música",
    country: "Estados Unidos",
    shortBio: "Cantante, productora y referente de la cultura pop y el R&B global.",
    emoji: "🐝",
  },
  {
    name: "Taylor Swift",
    birthDate: "1989-12-13",
    field: "Música",
    country: "Estados Unidos",
    shortBio: "Cantautora prolífica y fenómeno discográfico de la era contemporánea.",
    emoji: "✨",
  },
  {
    name: "Lady Gaga",
    birthDate: "1986-03-28",
    field: "Música",
    country: "Estados Unidos",
    shortBio: "Cantante pop camaleónica, compositora y actriz galardonada.",
    emoji: "🌟",
  },
  {
    name: "Adele",
    birthDate: "1988-05-05",
    field: "Música",
    country: "Reino Unido",
    shortBio: "Cantautora británica con voz conmovedora y éxitos récord mundiales.",
    emoji: "🎤",
  },
  {
    name: "Billie Eilish",
    birthDate: "2001-12-18",
    field: "Música",
    country: "Estados Unidos",
    shortBio: "Compositora e intérprete que redefinió el pop alternativo moderno.",
    emoji: "🖤",
  },
  {
    name: "Shakira",
    birthDate: "1977-02-02",
    field: "Música",
    country: "Colombia",
    shortBio: "Artista latina global con fusiones de pop, rock y ritmos árabes.",
    emoji: "💃",
  },
  {
    name: "Prince",
    birthDate: "1958-06-07",
    field: "Música",
    country: "Estados Unidos",
    shortBio: "Virtuoso multiinstrumentista del funk, rock y R&B.",
    emoji: "💜",
  },
  {
    name: "Michael Jackson",
    birthDate: "1958-08-29",
    field: "Música",
    country: "Estados Unidos",
    shortBio: "El Rey del Pop, bailarín revolucionario y artista legendario.",
    emoji: "🕺",
  },
  {
    name: "Amy Winehouse",
    birthDate: "1983-09-14",
    field: "Música",
    country: "Reino Unido",
    shortBio: "Voz única del soul contemporáneo y compositora visceral.",
    emoji: "🎺",
  },
  {
    name: "Charly García",
    birthDate: "1951-10-23",
    field: "Música",
    country: "Argentina",
    shortBio: "Ícono mayor del rock en español, compositor prolífico y vanguardista.",
    emoji: "🎹",
  },
  {
    name: "Gustavo Cerati",
    birthDate: "1959-08-11",
    field: "Música",
    country: "Argentina",
    shortBio: "Líder de Soda Stereo y referente supremo del rock latinoamericano.",
    emoji: "🌙",
  },

  // ──── ARTE & CINE ────
  {
    name: "Leonardo da Vinci",
    birthDate: "1452-04-15",
    field: "Arte",
    country: "Italia",
    shortBio: "Polímata renacentista, pintor de la Mona Lisa e inventor genial.",
    emoji: "🎨",
    quote: "El aprendizaje nunca agota la mente.",
  },
  {
    name: "Pablo Picasso",
    birthDate: "1881-10-25",
    field: "Arte",
    country: "España",
    shortBio: "Cofundador del cubismo y figura transformadora del arte del siglo XX.",
    emoji: "🖼️",
  },
  {
    name: "Vincent van Gogh",
    birthDate: "1853-03-30",
    field: "Arte",
    country: "Países Bajos",
    shortBio: "Pintor postimpresionista de pincelada expresiva y vibrante.",
    emoji: "🌻",
  },
  {
    name: "Salvador Dalí",
    birthDate: "1904-05-11",
    field: "Arte",
    country: "España",
    shortBio: "Máximo exponente del surrealismo pictórico y onírico.",
    emoji: "🕰️",
  },
  {
    name: "Frida Kahlo",
    birthDate: "1907-07-06",
    field: "Arte",
    country: "México",
    shortBio: "Pintora de autorretratos cargados de simbolismo, dolor e identidad.",
    emoji: "🌺",
    quote: "Pies, ¿para qué los quiero si tengo alas para volar?",
  },
  {
    name: "Claude Monet",
    birthDate: "1840-11-14",
    field: "Arte",
    country: "Francia",
    shortBio: "Padre del impresionismo y maestro de la luz natural.",
    emoji: "🪷",
  },
  {
    name: "Charlie Chaplin",
    birthDate: "1889-04-16",
    field: "Cine",
    country: "Reino Unido",
    shortBio: "Pionero del cine mudo, comediante universal y director de clásicos.",
    emoji: "🎬",
  },
  {
    name: "Audrey Hepburn",
    birthDate: "1929-05-04",
    field: "Cine",
    country: "Reino Unido / Bélgica",
    shortBio: "Actriz icónica de la época dorada de Hollywood y embajadora de UNICEF.",
    emoji: "✨",
  },
  {
    name: "Marilyn Monroe",
    birthDate: "1926-06-01",
    field: "Cine",
    country: "Estados Unidos",
    shortBio: "Símbolo cultural eterno y actriz de comedia cinematográfica.",
    emoji: "💎",
  },
  {
    name: "Marlon Brando",
    birthDate: "1924-04-03",
    field: "Cine",
    country: "Estados Unidos",
    shortBio: "Actor revolucionario del método y estrella de El Padrino.",
    emoji: "🎭",
  },
  {
    name: "Keanu Reeves",
    birthDate: "1964-09-02",
    field: "Cine",
    country: "Canadá",
    shortBio: "Actor protagonista de Matrix y John Wick, admirado por su generosidad.",
    emoji: "🕶️",
  },
  {
    name: "Robin Williams",
    birthDate: "1951-07-21",
    field: "Cine",
    country: "Estados Unidos",
    shortBio: "Genio de la improvisación y la calidez humana en pantalla.",
    emoji: "🎪",
  },
  {
    name: "Meryl Streep",
    birthDate: "1949-06-22",
    field: "Cine",
    country: "Estados Unidos",
    shortBio: "Una de las actrices más aclamadas y versátiles de la historia del cine.",
    emoji: "🏆",
  },
  {
    name: "Hayao Miyazaki",
    birthDate: "1941-01-05",
    field: "Cine",
    country: "Japón",
    shortBio: "Director de animación fundador de Studio Ghibli y creador de mundos líricos.",
    emoji: "🐉",
  },

  // ──── LITERATURA & FILOSOFÍA ────
  {
    name: "Gabriel García Márquez",
    birthDate: "1927-03-06",
    field: "Literatura",
    country: "Colombia",
    shortBio: "Maestro del realismo mágico, autor de Cien años de soledad y premio Nobel.",
    emoji: "📚",
  },
  {
    name: "Jorge Luis Borges",
    birthDate: "1899-08-24",
    field: "Literatura",
    country: "Argentina",
    shortBio: "Escritor universal de laberintos, espejos y ficciones infinitas.",
    emoji: "📖",
  },
  {
    name: "Julio Cortázar",
    birthDate: "1914-08-26",
    field: "Literatura",
    country: "Argentina",
    shortBio: "Autor innovador de Rayuela y maestro del relato breve fantástico.",
    emoji: "🎲",
  },
  {
    name: "William Shakespeare",
    birthDate: "1564-04-26",
    field: "Literatura",
    country: "Reino Unido",
    shortBio: "Dramaturgo y poeta cumbre de la lengua inglesa y el teatro universal.",
    emoji: "✒️",
  },
  {
    name: "Edgar Allan Poe",
    birthDate: "1809-01-19",
    field: "Literatura",
    country: "Estados Unidos",
    shortBio: "Padre del cuento de terror moderno y del relato detectivesco.",
    emoji: "🦅",
  },
  {
    name: "Franz Kafka",
    birthDate: "1883-07-03",
    field: "Literatura",
    country: "República Checa",
    shortBio: "Narrador de la alienación y el absurdo burocrático existencial.",
    emoji: "🪲",
  },
  {
    name: "Virginia Woolf",
    birthDate: "1882-01-25",
    field: "Literatura",
    country: "Reino Unido",
    shortBio: "Pionera de la narrativa modernista y del ensayo feminista.",
    emoji: "🌊",
  },
  {
    name: "Oscar Wilde",
    birthDate: "1854-10-16",
    field: "Literatura",
    country: "Irlanda",
    shortBio: "Dramaturgo de ingenio chispeante, estética y profundidad humana.",
    emoji: "🎭",
  },
  {
    name: "Friedrich Nietzsche",
    birthDate: "1844-10-15",
    field: "Filosofía",
    country: "Alemania",
    shortBio: "Filósofo de la voluntad de poder y el pensamiento crítico radical.",
    emoji: "🏔️",
  },
  {
    name: "Carl Jung",
    birthDate: "1875-07-26",
    field: "Filosofía",
    country: "Suiza",
    shortBio: "Fundador de la psicología analítica y explorador de los arquetipos.",
    emoji: "🧠",
  },

  // ──── DEPORTE ────
  {
    name: "Lionel Messi",
    birthDate: "1987-06-24",
    field: "Deporte",
    country: "Argentina",
    shortBio: "Campeón del mundo y considerado el futbolista más completo de todos los tiempos.",
    emoji: "⚽",
  },
  {
    name: "Diego Maradona",
    birthDate: "1960-10-30",
    field: "Deporte",
    country: "Argentina",
    shortBio: "Genio mítico del fútbol y líder inspirador en copas del mundo.",
    emoji: "🔟",
  },
  {
    name: "Michael Jordan",
    birthDate: "1963-02-17",
    field: "Deporte",
    country: "Estados Unidos",
    shortBio: "Seis veces campeón de la NBA e icono global de la competitividad.",
    emoji: "🏀",
  },
  {
    name: "Ayrton Senna",
    birthDate: "1960-03-21",
    field: "Deporte",
    country: "Brasil",
    shortBio: "Tricampeón de Fórmula 1 y piloto legendario por su maestría bajo lluvia.",
    emoji: "🏎️",
  },
  {
    name: "Roger Federer",
    birthDate: "1981-08-08",
    field: "Deporte",
    country: "Suiza",
    shortBio: "Ganador de 20 Grand Slams y emblema de elegancia tenística.",
    emoji: "🎾",
  },
  {
    name: "Usain Bolt",
    birthDate: "1986-08-21",
    field: "Deporte",
    country: "Jamaica",
    shortBio: "El hombre más veloz del planeta y plusmarquista mundial de atletismo.",
    emoji: "⚡",
  },
  {
    name: "Muhammad Ali",
    birthDate: "1942-01-17",
    field: "Deporte",
    country: "Estados Unidos",
    shortBio: "Tres veces campeón mundial de peso pesado y activista por los derechos civiles.",
    emoji: "🥊",
  },
  {
    name: "Serena Williams",
    birthDate: "1981-09-26",
    field: "Deporte",
    country: "Estados Unidos",
    shortBio: "Ganadora de 23 títulos individuales de Grand Slam y dominadora del tenis.",
    emoji: "🥇",
  },
  {
    name: "Pelé",
    birthDate: "1940-10-23",
    field: "Deporte",
    country: "Brasil",
    shortBio: "Tres veces campeón del mundo con Brasil y rey del fútbol del siglo XX.",
    emoji: "👑",
  },

  // ──── LIDERAZGO & PAZ ────
  {
    name: "Mahatma Gandhi",
    birthDate: "1869-10-02",
    field: "Política",
    country: "India",
    shortBio: "Líder de la no violencia que guió a la India hacia la independencia.",
    emoji: "🕊️",
    quote: "Sé el cambio que querés ver en el mundo.",
  },
  {
    name: "Nelson Mandela",
    birthDate: "1918-07-18",
    field: "Política",
    country: "Sudáfrica",
    shortBio: "Premio Nobel de la Paz y líder de la reconciliación contra el apartheid.",
    emoji: "✊",
    quote: "Siempre parece imposible hasta que se hace.",
  },
  {
    name: "Martin Luther King Jr.",
    birthDate: "1929-01-15",
    field: "Política",
    country: "Estados Unidos",
    shortBio: "Líder del movimiento por los derechos civiles con discurso no violento.",
    emoji: "📢",
    quote: "Tengo un sueño.",
  },
  {
    name: "Abraham Lincoln",
    birthDate: "1809-02-12",
    field: "Política",
    country: "Estados Unidos",
    shortBio: "Presidente que preservó la Unión estadounidense y abolió la esclavitud.",
    emoji: "🏛️",
  },
  {
    name: "Barack Obama",
    birthDate: "1961-08-04",
    field: "Política",
    country: "Estados Unidos",
    shortBio: "Primer presidente afroamericano de EE.UU. y premio Nobel de la Paz.",
    emoji: "🗽",
  },
  {
    name: "Denzel Washington",
    birthDate: "1954-12-28",
    field: "Cine",
    country: "Estados Unidos",
    shortBio: "Actor y director con dos premios Óscar, ícono de la actuación seria.",
    emoji: "🎬",
  },
  {
    name: "Neil Armstrong",
    birthDate: "1930-08-05",
    field: "Ciencia",
    country: "Estados Unidos",
    shortBio: "Primer hombre en caminar sobre la Luna, comandante del Apolo 11.",
    emoji: "🌙",
    quote: "Un pequeño paso para el hombre, un gran salto para la humanidad.",
  },
  {
    name: "Tom Hanks",
    birthDate: "1956-07-09",
    field: "Cine",
    country: "Estados Unidos",
    shortBio: "Actor y productor ganador de dos Óscar, cara del cine norteamericano.",
    emoji: "🎬",
  },
  {
    name: "Bruce Lee",
    birthDate: "1940-11-27",
    field: "Cine",
    country: "Hong Kong / Estados Unidos",
    shortBio: "Artista marcial y actor, leyenda del cine de acción.",
    emoji: "🥋",
    quote: "No temas al que practica más, sino al que entrena con propósito.",
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Hydrated full list of famous personalities with computed symbolic anchors.
 */
export const FAMOUS_PEOPLE: FamousPersonProfile[] = RAW_FAMOUS_PEOPLE.map((p) => {
  const lifePath = calculateLifePath(p.birthDate);
  const sunSign = getSunSign(p.birthDate);
  const chineseZodiac = getChineseZodiac(p.birthDate);

  return {
    ...p,
    id: slugify(p.name),
    lifePath,
    sunSign,
    chineseZodiac,
    initials: getInitials(p.name),
  };
});

export interface FamousMatchResult {
  person: FamousPersonProfile;
  matchLifePath: boolean;
  matchSunSign: boolean;
  matchChineseZodiac: boolean;
  matchCount: number;
  rarityScore: number;
  matchReasons: string[];
  headline: string;
}

/**
 * Calculates matching famous personalities for a user profile,
 * prioritizing the rarest triple and double resonances.
 */
export function findFamousMatches(
  profile: Partial<UserProfile>,
  limit: number = 3
): FamousMatchResult[] {
  if (!profile) return [];

  const userLifePath = typeof profile.lifePath === "number" ? profile.lifePath : null;
  const userSunSign = profile.sunSign?.toLowerCase().trim() || null;
  const userAnimal = profile.chineseZodiac?.toLowerCase().trim() || null;

  if (!userLifePath && !userSunSign && !userAnimal) return [];

  const matches: FamousMatchResult[] = [];

  for (const person of FAMOUS_PEOPLE) {
    const matchLifePath = userLifePath !== null && person.lifePath === userLifePath;
    const matchSunSign =
      userSunSign !== null && person.sunSign.toLowerCase().trim() === userSunSign;
    const matchChineseZodiac =
      userAnimal !== null && person.chineseZodiac.toLowerCase().trim() === userAnimal;

    let matchCount = 0;
    if (matchLifePath) matchCount++;
    if (matchSunSign) matchCount++;
    if (matchChineseZodiac) matchCount++;

    if (matchCount === 0) continue;

    const reasons: string[] = [];
    if (matchLifePath) {
      reasons.push(`Compartís tu Número de Vida ${person.lifePath}`);
    }
    if (matchSunSign) {
      reasons.push(`Tu signo solar es ${person.sunSign}`);
    }
    if (matchChineseZodiac) {
      reasons.push(`Coincidís en el año del ${person.chineseZodiac}`);
    }

    // Weighting:
    // 3 dimensions: ~1000 pts (ultra rare)
    // 2 dimensions: ~500 pts (rare)
    // 1 dimension:
    //   - Life Path: 320 pts (1/9-1/11 distribution)
    //   - Chinese Zodiac: 210 pts (1/12 distribution)
    //   - Sun Sign: 150 pts (1/12 distribution)
    let rarityScore = 0;
    if (matchCount === 3) {
      rarityScore = 1000;
    } else if (matchCount === 2) {
      rarityScore = 500;
      if (matchLifePath) rarityScore += 50;
    } else {
      if (matchLifePath) rarityScore = 320;
      else if (matchChineseZodiac) rarityScore = 210;
      else if (matchSunSign) rarityScore = 150;
    }

    let headline = "";
    if (matchCount === 3) {
      headline = `¡Triple resonancia! Compartís Número de Vida, Signo Solar y Zodíaco Chino`;
    } else if (matchCount === 2) {
      if (matchLifePath && matchSunSign) {
        headline = `Compartís Número de Vida ${person.lifePath} y Signo Solar ${person.sunSign}`;
      } else if (matchLifePath && matchChineseZodiac) {
        headline = `Compartís Número de Vida ${person.lifePath} y Zodíaco Chino (${person.chineseZodiac})`;
      } else {
        headline = `Compartís Signo Solar (${person.sunSign}) y Zodíaco Chino (${person.chineseZodiac})`;
      }
    } else {
      if (matchLifePath) {
        headline = `Compartís tu Número de Vida con ${person.name}`;
      } else if (matchSunSign) {
        headline = `Tu signo solar es el mismo que ${person.name}`;
      } else {
        headline = `Tu animal del zodíaco chino coincide con ${person.name}`;
      }
    }

    matches.push({
      person,
      matchLifePath,
      matchSunSign,
      matchChineseZodiac,
      matchCount,
      rarityScore,
      matchReasons: reasons,
      headline,
    });
  }

  // Sort by rarityScore desc
  matches.sort((a, b) => b.rarityScore - a.rarityScore);

  // El zodíaco chino es el criterio excluyente de esta sección: solo se
  // muestran figuras con el MISMO animal del usuario, nunca un animal distinto.
  // Si el usuario no define animal, se usan todas las coincidencias.
  const ordered =
    userAnimal !== null ? matches.filter((m) => m.matchChineseZodiac) : matches;

  // Pick up to limit with field diversity if possible
  const selected: FamousMatchResult[] = [];
  const usedFields = new Set<string>();

  // Pass 1: pick top matches preferring distinct fields
  for (const m of ordered) {
    if (selected.length >= limit) break;
    if (!usedFields.has(m.person.field) || m.matchCount >= 2) {
      selected.push(m);
      usedFields.add(m.person.field);
    }
  }

  // Pass 2: fill remaining slots if needed
  if (selected.length < limit) {
    for (const m of ordered) {
      if (selected.length >= limit) break;
      if (!selected.some((s) => s.person.id === m.person.id)) {
        selected.push(m);
      }
    }
  }

  return selected;
}

// ═══════════════════════════════════════════════════════════
// AFFINITY SYSTEM COMPATIBILITY (SymbolicEntity integration)
// ═══════════════════════════════════════════════════════════

const ARTIST_FIELDS = new Set(["Música", "Cine", "Arte", "Literatura", "Animación"]);

interface Selection {
  name: string;
  animal: string;
}

const SELECTED_PEOPLE: Selection[] = [
  { name: "William Shakespeare", animal: "Rata" },
  { name: "Wolfgang Amadeus Mozart", animal: "Rata" },
  { name: "Marlon Brando", animal: "Rata" },
  { name: "Pablo Picasso", animal: "Serpiente" },
  { name: "Taylor Swift", animal: "Serpiente" },
  { name: "Bob Dylan", animal: "Serpiente" },
  { name: "Frank Sinatra", animal: "Gato" },
  { name: "Angelina Jolie", animal: "Gato" },
  { name: "John Lennon", animal: "Dragón" },
];

function findPerson(sel: Selection): FamousPerson {
  const person = (FAMOUS_BY_ANIMAL[sel.animal] ?? []).find((p) => p.name === sel.name);
  if (!person) {
    throw new Error(`famousPeopleToEntities: "${sel.name}" not found in FAMOUS_BY_ANIMAL.${sel.animal}`);
  }
  if (!ARTIST_FIELDS.has(person.field)) {
    throw new Error(`famousPeopleToEntities: "${sel.name}" field "${person.field}" is not an artist field`);
  }
  return person;
}

function personToEntity(person: FamousPerson): AtlasEntityInput {
  const id = `person-${slugify(person.name)}`;
  return {
    id,
    name: person.name,
    type: "artist",
    country: person.country,
    emoji: person.emoji,
    description: `${person.name} es una figura de referencia en ${person.field.toLowerCase()}, nacida en ${person.year}.`,
    keyThemes: [person.field, person.westernSign],
    category: person.field,
    sourceNote: `Nacido en ${person.year}. Fuente: famousPeople.ts. Fecha exacta de nacimiento no incluida en esa fuente; se usa el año (cálculo aproximado).`,
    events: [
      {
        id: `${id}-nacimiento`,
        type: "creacion",
        label: "Nacimiento",
        year: person.year,
        description: `${person.name} nace en ${person.year}.`,
        source: "Molino — famousPeople.ts (selección curada)",
        confidence: "media",
        primaryForAffinity: true,
      },
    ],
  };
}

export const FAMOUS_PEOPLE_ENTITIES: AtlasEntityInput[] = SELECTED_PEOPLE.map((sel) =>
  personToEntity(findPerson(sel))
);
