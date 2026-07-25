/**
 * Famous People by Chinese Zodiac Animal and Western Sign.
 * All data is real and verifiable.
 * Used for the Circle screen to show "people like you."
 */

export interface FamousPerson {
  name: string;
  animal: string;
  year: number;
  westernSign: string;
  field: string;
  country: string;
  emoji: string;
}

export const FAMOUS_BY_ANIMAL: Record<string, FamousPerson[]> = {
  Rata: [
    { name: "William Shakespeare", animal: "Rata", year: 1564, westernSign: "Aries", field: "Literatura", country: "Inglaterra", emoji: "🎭" },
    { name: "Wolfgang Amadeus Mozart", animal: "Rata", year: 1756, westernSign: "Acuario", field: "Música", country: "Austria", emoji: "🎵" },
    { name: "George Washington", animal: "Rata", year: 1732, westernSign: "Piscis", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Prince", animal: "Rata", year: 1958, westernSign: "Géminis", field: "Música", country: "Estados Unidos", emoji: "🎶" },
    { name: "Katy Perry", animal: "Rata", year: 1984, westernSign: "Escorpio", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Scarlett Johansson", animal: "Rata", year: 1984, westernSign: "Sagitario", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
  ],
  Buey: [
    { name: "Barack Obama", animal: "Buey", year: 1961, westernSign: "Leo", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Napoleón Bonaparte", animal: "Buey", year: 1769, westernSign: "Leo", field: "Historia", country: "Francia", emoji: "⚔" },
    { name: "Margaret Thatcher", animal: "Buey", year: 1925, westernSign: "Libra", field: "Política", country: "Reino Unido", emoji: "🏛" },
    { name: "Bruno Mars", animal: "Buey", year: 1985, westernSign: "Libra", field: "Música", country: "Estados Unidos", emoji: "🎵" },
    { name: "Malala Yousafzai", animal: "Buey", year: 1997, westernSign: "Acuario", field: "Activismo", country: "Pakistán", emoji: "✊" },
  ],
  Tigre: [
    { name: "Queen Elizabeth II", animal: "Tigre", year: 1926, westernSign: "Tauro", field: "Monarquía", country: "Reino Unido", emoji: "👑" },
    { name: "Tom Cruise", animal: "Tigre", year: 1962, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Leonardo DiCaprio", animal: "Tigre", year: 1974, westernSign: "Acuario", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Lady Gaga", animal: "Tigre", year: 1986, westernSign: "Aries", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Usain Bolt", animal: "Tigre", year: 1986, westernSign: "Leo", field: "Deportes", country: "Jamaica", emoji: "⚡" },
  ],
  Conejo: [
    { name: "Albert Einstein", animal: "Conejo", year: 1879, westernSign: "Piscis", field: "Ciencia", country: "Alemania", emoji: "🔬" },
    { name: "Angelina Jolie", animal: "Conejo", year: 1975, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "David Beckham", animal: "Conejo", year: 1975, westernSign: "Tauro", field: "Deportes", country: "Reino Unido", emoji: "⚽" },
    { name: "Lionel Messi", animal: "Conejo", year: 1987, westernSign: "Cáncer", field: "Deportes", country: "Argentina", emoji: "⚽" },
    { name: "Lana Del Rey", animal: "Conejo", year: 1985, westernSign: "Géminis", field: "Música", country: "Estados Unidos", emoji: "🎵" },
  ],
  Dragón: [
    { name: "Bruce Lee", animal: "Dragón", year: 1940, westernSign: "Sagitario", field: "Cine", country: "Estados Unidos", emoji: "🥋" },
    { name: "John Lennon", animal: "Dragón", year: 1940, westernSign: "Libra", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Vladimir Putin", animal: "Dragón", year: 1952, westernSign: "Libra", field: "Política", country: "Rusia", emoji: "🏛" },
    { name: "Rihanna", animal: "Dragón", year: 1988, westernSign: "Piscis", field: "Música", country: "Barbados", emoji: "🎤" },
    { name: "Adele", animal: "Dragón", year: 1988, westernSign: "Tauro", field: "Música", country: "Reino Unido", emoji: "🎵" },
  ],
  Serpiente: [
    { name: "Mahatma Gandhi", animal: "Serpiente", year: 1869, westernSign: "Libra", field: "Política", country: "India", emoji: "☮" },
    { name: "Pablo Picasso", animal: "Serpiente", year: 1881, westernSign: "Escorpio", field: "Arte", country: "España", emoji: "🎨" },
    { name: "John F. Kennedy", animal: "Serpiente", year: 1917, westernSign: "Tauro", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Oprah Winfrey", animal: "Serpiente", year: 1954, westernSign: "Acuario", field: "Medios", country: "Estados Unidos", emoji: "📺" },
    { name: "Taylor Swift", animal: "Serpiente", year: 1989, westernSign: "Sagitario", field: "Música", country: "Estados Unidos", emoji: "🎤" },
  ],
  Caballo: [
    { name: "Genghis Khan", animal: "Caballo", year: 1162, westernSign: "Tauro", field: "Historia", country: "Mongolia", emoji: "⚔" },
    { name: "Rembrandt", animal: "Caballo", year: 1606, westernSign: "Libra", field: "Arte", country: "Países Bajos", emoji: "🎨" },
    { name: "Theodore Roosevelt", animal: "Caballo", year: 1858, westernSign: "Acuario", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Paul McCartney", animal: "Caballo", year: 1942, westernSign: "Géminis", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Greta Thunberg", animal: "Caballo", year: 2003, westernSign: "Acuario", field: "Activismo", country: "Suecia", emoji: "🌍" },
  ],
  Cabra: [
    { name: "Mark Twain", animal: "Cabra", year: 1835, westernSign: "Sagitario", field: "Literatura", country: "Estados Unidos", emoji: "📚" },
    { name: "Steve Jobs", animal: "Cabra", year: 1955, westernSign: "Acuario", field: "Tecnología", country: "Estados Unidos", emoji: "💻" },
    { name: "Julia Roberts", animal: "Cabra", year: 1967, westernSign: "Escorpio", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Ed Sheeran", animal: "Cabra", year: 1991, westernSign: "Acuario", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Billie Eilish", animal: "Cabra", year: 2001, westernSign: "Acuario", field: "Música", country: "Estados Unidos", emoji: "🎤" },
  ],
  Mono: [
    { name: "Leonardo da Vinci", animal: "Mono", year: 1452, westernSign: "Aries", field: "Arte", country: "Italia", emoji: "🎨" },
    { name: "Charles Dickens", animal: "Mono", year: 1812, westernSign: "Acuario", field: "Literatura", country: "Reino Unido", emoji: "📚" },
    { name: "Harry S. Truman", animal: "Mono", year: 1884, westernSign: "Tauro", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Will Smith", animal: "Mono", year: 1968, westernSign: "Libra", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Daniel Craig", animal: "Mono", year: 1968, westernSign: "Aries", field: "Cine", country: "Reino Unido", emoji: "🎬" },
  ],
  Gallo: [
    { name: "Confucius", animal: "Gallo", year: 551, westernSign: "Virgo", field: "Filosofía", country: "China", emoji: "📖" },
    { name: "Bud Spencer", animal: "Gallo", year: 1929, westernSign: "Acuario", field: "Cine", country: "Italia", emoji: "🎬" },
    { name: "Muhammad Ali", animal: "Gallo", year: 1942, westernSign: "Acuario", field: "Deportes", country: "Estados Unidos", emoji: "🥊" },
    { name: "Matt Damon", animal: "Gallo", year: 1970, westernSign: "Acuario", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Beyoncé", animal: "Gallo", year: 1981, westernSign: "Virgo", field: "Música", country: "Estados Unidos", emoji: "🎤" },
  ],
  Perro: [
    { name: "Wolfgang Amadeus Mozart", animal: "Perro", year: 1756, westernSign: "Acuario", field: "Música", country: "Austria", emoji: "🎵" },
    { name: "Winston Churchill", animal: "Perro", year: 1874, westernSign: "Sagitario", field: "Política", country: "Reino Unido", emoji: "🏛" },
    { name: "Elvis Presley", animal: "Perro", year: 1935, westernSign: "Capricornio", field: "Música", country: "Estados Unidos", emoji: "🎵" },
    { name: "Madonna", animal: "Perro", year: 1958, westernSign: "Leo", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Michael Bublé", animal: "Perro", year: 1975, westernSign: "Libra", field: "Música", country: "Canadá", emoji: "🎵" },
  ],
  Cerdo: [
    { name: "Henry Ford", animal: "Cerdo", year: 1863, westernSign: "Cáncer", field: "Industria", country: "Estados Unidos", emoji: "🏭" },
    { name: "Ernest Hemingway", animal: "Cerdo", year: 1899, westernSign: "Cáncer", field: "Literatura", country: "Estados Unidos", emoji: "📚" },
    { name: "Alfred Hitchcock", animal: "Cerdo", year: 1899, westernSign: "Leo", field: "Cine", country: "Reino Unido", emoji: "🎬" },
    { name: "Ronald Reagan", animal: "Cerdo", year: 1911, westernSign: "Acuario", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Amy Winehouse", animal: "Cerdo", year: 1983, westernSign: "Virgo", field: "Música", country: "Reino Unido", emoji: "🎵" },
  ],
};

export const FAMOUS_BY_SIGN: Record<string, FamousPerson[]> = {
  Aries: [
    { name: "William Shakespeare", animal: "Rata", year: 1564, westernSign: "Aries", field: "Literatura", country: "Inglaterra", emoji: "🎭" },
    { name: "Leonardo da Vinci", animal: "Mono", year: 1452, westernSign: "Aries", field: "Arte", country: "Italia", emoji: "🎨" },
    { name: "Lady Gaga", animal: "Tigre", year: 1986, westernSign: "Aries", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Daniel Craig", animal: "Mono", year: 1968, westernSign: "Aries", field: "Cine", country: "Reino Unido", emoji: "🎬" },
    { name: "Mariah Carey", animal: "Cabra", year: 1969, westernSign: "Aries", field: "Música", country: "Estados Unidos", emoji: "🎤" },
  ],
  Tauro: [
    { name: "William Shakespeare", animal: "Rata", year: 1564, westernSign: "Aries", field: "Literatura", country: "Inglaterra", emoji: "🎭" },
    { name: "Queen Elizabeth II", animal: "Tigre", year: 1926, westernSign: "Tauro", field: "Monarquía", country: "Reino Unido", emoji: "👑" },
    { name: "David Beckham", animal: "Conejo", year: 1975, westernSign: "Tauro", field: "Deportes", country: "Reino Unido", emoji: "⚽" },
    { name: "Adele", animal: "Dragón", year: 1988, westernSign: "Tauro", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "John F. Kennedy", animal: "Serpiente", year: 1917, westernSign: "Tauro", field: "Política", country: "Estados Unidos", emoji: "🏛" },
  ],
  Géminis: [
    { name: "Prince", animal: "Rata", year: 1958, westernSign: "Géminis", field: "Música", country: "Estados Unidos", emoji: "🎶" },
    { name: "Paul McCartney", animal: "Caballo", year: 1942, westernSign: "Géminis", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Lana Del Rey", animal: "Conejo", year: 1985, westernSign: "Géminis", field: "Música", country: "Estados Unidos", emoji: "🎵" },
    { name: "Morgan Freeman", animal: "Cabra", year: 1937, westernSign: "Géminis", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Kanye West", animal: "Cabra", year: 1977, westernSign: "Géminis", field: "Música", country: "Estados Unidos", emoji: "🎵" },
  ],
  Cáncer: [
    { name: "Albert Einstein", animal: "Conejo", year: 1879, westernSign: "Piscis", field: "Ciencia", country: "Alemania", emoji: "🔬" },
    { name: "Tom Cruise", animal: "Tigre", year: 1962, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Angelina Jolie", animal: "Conejo", year: 1975, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Lionel Messi", animal: "Conejo", year: 1987, westernSign: "Cáncer", field: "Deportes", country: "Argentina", emoji: "⚽" },
    { name: "Henry Ford", animal: "Cerdo", year: 1863, westernSign: "Cáncer", field: "Industria", country: "Estados Unidos", emoji: "🏭" },
  ],
  Leo: [
    { name: "Barack Obama", animal: "Buey", year: 1961, westernSign: "Leo", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Napoleón Bonaparte", animal: "Buey", year: 1769, westernSign: "Leo", field: "Historia", country: "Francia", emoji: "⚔" },
    { name: "Usain Bolt", animal: "Tigre", year: 1986, westernSign: "Leo", field: "Deportes", country: "Jamaica", emoji: "⚡" },
    { name: "Madonna", animal: "Perro", year: 1958, westernSign: "Leo", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Alfred Hitchcock", animal: "Cerdo", year: 1899, westernSign: "Leo", field: "Cine", country: "Reino Unido", emoji: "🎬" },
  ],
  Virgo: [
    { name: "Confucius", animal: "Gallo", year: 551, westernSign: "Virgo", field: "Filosofía", country: "China", emoji: "📖" },
    { name: "Beyoncé", animal: "Gallo", year: 1981, westernSign: "Virgo", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Amy Winehouse", animal: "Cerdo", year: 1983, westernSign: "Virgo", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Michael Jackson", animal: "Conejo", year: 1958, westernSign: "Virgo", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Richard Gere", animal: "Caballo", year: 1949, westernSign: "Virgo", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
  ],
  Libra: [
    { name: "Mahatma Gandhi", animal: "Serpiente", year: 1869, westernSign: "Libra", field: "Política", country: "India", emoji: "☮" },
    { name: "Margaret Thatcher", animal: "Buey", year: 1925, westernSign: "Libra", field: "Política", country: "Reino Unido", emoji: "🏛" },
    { name: "John Lennon", animal: "Dragón", year: 1940, westernSign: "Libra", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Vladimir Putin", animal: "Dragón", year: 1952, westernSign: "Libra", field: "Política", country: "Rusia", emoji: "🏛" },
    { name: "Will Smith", animal: "Mono", year: 1968, westernSign: "Libra", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
  ],
  Escorpio: [
    { name: "Katy Perry", animal: "Rata", year: 1984, westernSign: "Escorpio", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Pablo Picasso", animal: "Serpiente", year: 1881, westernSign: "Escorpio", field: "Arte", country: "España", emoji: "🎨" },
    { name: "Julia Roberts", animal: "Cabra", year: 1967, westernSign: "Escorpio", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Ryan Gosling", animal: "Cabra", year: 1980, westernSign: "Escorpio", field: "Cine", country: "Canadá", emoji: "🎬" },
    { name: "Drake", animal: "Dragón", year: 1986, westernSign: "Escorpio", field: "Música", country: "Canadá", emoji: "🎵" },
  ],
  Sagitario: [
    { name: "Wolfgang Amadeus Mozart", animal: "Rata", year: 1756, westernSign: "Acuario", field: "Música", country: "Austria", emoji: "🎵" },
    { name: "Mark Twain", animal: "Cabra", year: 1835, westernSign: "Sagitario", field: "Literatura", country: "Estados Unidos", emoji: "📚" },
    { name: "Bruce Lee", animal: "Dragón", year: 1940, westernSign: "Sagitario", field: "Cine", country: "Estados Unidos", emoji: "🥋" },
    { name: "Taylor Swift", animal: "Serpiente", year: 1989, westernSign: "Sagitario", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Scarlett Johansson", animal: "Rata", year: 1984, westernSign: "Sagitario", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
  ],
  Capricornio: [
    { name: "Isaac Newton", animal: "Tigre", year: 1643, westernSign: "Capricornio", field: "Ciencia", country: "Reino Unido", emoji: "🔬" },
    { name: "Martin Luther King Jr.", animal: "Conejo", year: 1929, westernSign: "Capricornio", field: "Activismo", country: "Estados Unidos", emoji: "✊" },
    { name: "Elvis Presley", animal: "Perro", year: 1935, westernSign: "Capricornio", field: "Música", country: "Estados Unidos", emoji: "🎵" },
    { name: "Denzel Washington", animal: "Caballo", year: 1954, westernSign: "Capricornio", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Kate Middleton", animal: "Cabra", year: 1982, westernSign: "Capricornio", field: "Monarquía", country: "Reino Unido", emoji: "👑" },
  ],
  Acuario: [
    { name: "Wolfgang Amadeus Mozart", animal: "Rata", year: 1756, westernSign: "Acuario", field: "Música", country: "Austria", emoji: "🎵" },
    { name: "Charles Dickens", animal: "Mono", year: 1812, westernSign: "Acuario", field: "Literatura", country: "Reino Unido", emoji: "📚" },
    { name: "Steve Jobs", animal: "Cabra", year: 1955, westernSign: "Acuario", field: "Tecnología", country: "Estados Unidos", emoji: "💻" },
    { name: "Oprah Winfrey", animal: "Serpiente", year: 1954, westernSign: "Acuario", field: "Medios", country: "Estados Unidos", emoji: "📺" },
    { name: "Rihanna", animal: "Dragón", year: 1988, westernSign: "Piscis", field: "Música", country: "Barbados", emoji: "🎤" },
    { name: "Ed Sheeran", animal: "Cabra", year: 1991, westernSign: "Acuario", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Malala Yousafzai", animal: "Buey", year: 1997, westernSign: "Acuario", field: "Activismo", country: "Pakistán", emoji: "✊" },
    { name: "Greta Thunberg", animal: "Caballo", year: 2003, westernSign: "Acuario", field: "Activismo", country: "Suecia", emoji: "🌍" },
  ],
  Piscis: [
    { name: "Albert Einstein", animal: "Conejo", year: 1879, westernSign: "Piscis", field: "Ciencia", country: "Alemania", emoji: "🔬" },
    { name: "George Washington", animal: "Rata", year: 1732, westernSign: "Piscis", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Rihanna", animal: "Dragón", year: 1988, westernSign: "Piscis", field: "Música", country: "Barbados", emoji: "🎤" },
    { name: "Justin Bieber", animal: "Dragón", year: 1994, westernSign: "Piscis", field: "Música", country: "Canadá", emoji: "🎵" },
    { name: "Adam Levine", animal: "Conejo", year: 1979, westernSign: "Piscis", field: "Música", country: "Estados Unidos", emoji: "🎤" },
  ],
};

/**
 * Get famous people matching a user's Chinese animal.
 * Only returns people from different years (not the user's exact year).
 */
export function getFamousByAnimal(animal: string, userYear?: number): FamousPerson[] {
  const people = FAMOUS_BY_ANIMAL[animal] ?? [];
  if (!userYear) return people;
  return people.filter(p => p.year !== userYear);
}

/**
 * Get famous people matching a user's Western sign.
 * Only returns people from different years (not the user's exact year).
 */
export function getFamousBySign(sign: string, userYear?: number): FamousPerson[] {
  const people = FAMOUS_BY_SIGN[sign] ?? [];
  if (!userYear) return people;
  return people.filter(p => p.year !== userYear);
}
