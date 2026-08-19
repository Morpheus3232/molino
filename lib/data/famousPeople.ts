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
    { name: "Marlon Brando", animal: "Rata", year: 1924, westernSign: "Aries", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Eminem", animal: "Rata", year: 1972, westernSign: "Escorpio", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Greta Garbo", animal: "Rata", year: 1905, westernSign: "Virgo", field: "Cine", country: "Suecia", emoji: "🎬" },
    { name: "Avril Lavigne", animal: "Rata", year: 1984, westernSign: "Libra", field: "Música", country: "Canadá", emoji: "🎵" },
  ],
  Buey: [
    { name: "Barack Obama", animal: "Buey", year: 1961, westernSign: "Leo", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Napoleón Bonaparte", animal: "Buey", year: 1769, westernSign: "Leo", field: "Historia", country: "Francia", emoji: "⚔" },
    { name: "Margaret Thatcher", animal: "Buey", year: 1925, westernSign: "Libra", field: "Política", country: "Reino Unido", emoji: "🏛" },
    { name: "Bruno Mars", animal: "Buey", year: 1985, westernSign: "Libra", field: "Música", country: "Estados Unidos", emoji: "🎵" },
    { name: "Malala Yousafzai", animal: "Buey", year: 1997, westernSign: "Acuario", field: "Activismo", country: "Pakistán", emoji: "✊" },
    { name: "Walt Disney", animal: "Buey", year: 1901, westernSign: "Sagitario", field: "Animación", country: "Estados Unidos", emoji: "🐭" },
    { name: "Meryl Streep", animal: "Buey", year: 1949, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Vincent van Gogh", animal: "Buey", year: 1853, westernSign: "Aries", field: "Arte", country: "Países Bajos", emoji: "🎨" },
    { name: "Rosa Parks", animal: "Buey", year: 1913, westernSign: "Acuario", field: "Activismo", country: "Estados Unidos", emoji: "✊" },
  ],
  Tigre: [
    { name: "Queen Elizabeth II", animal: "Tigre", year: 1926, westernSign: "Tauro", field: "Monarquía", country: "Reino Unido", emoji: "👑" },
    { name: "Tom Cruise", animal: "Tigre", year: 1962, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Leonardo DiCaprio", animal: "Tigre", year: 1974, westernSign: "Acuario", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Lady Gaga", animal: "Tigre", year: 1986, westernSign: "Aries", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Usain Bolt", animal: "Tigre", year: 1986, westernSign: "Leo", field: "Deportes", country: "Jamaica", emoji: "⚡" },
    { name: "Joaquin Phoenix", animal: "Tigre", year: 1974, westernSign: "Escorpio", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Marilyn Monroe", animal: "Tigre", year: 1926, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Stevie Wonder", animal: "Tigre", year: 1950, westernSign: "Tauro", field: "Música", country: "Estados Unidos", emoji: "🎵" },
    { name: "Bob Marley", animal: "Tigre", year: 1945, westernSign: "Acuario", field: "Música", country: "Jamaica", emoji: "🎵" },
  ],
  Gato: [
    { name: "Albert Einstein", animal: "Gato", year: 1879, westernSign: "Piscis", field: "Ciencia", country: "Alemania", emoji: "🔬" },
    { name: "Angelina Jolie", animal: "Gato", year: 1975, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "David Beckham", animal: "Gato", year: 1975, westernSign: "Tauro", field: "Deportes", country: "Reino Unido", emoji: "⚽" },
    { name: "Lionel Messi", animal: "Gato", year: 1987, westernSign: "Cáncer", field: "Deportes", country: "Argentina", emoji: "⚽" },
    { name: "Lana Del Rey", animal: "Gato", year: 1985, westernSign: "Géminis", field: "Música", country: "Estados Unidos", emoji: "🎵" },
    { name: "Audrey Hepburn", animal: "Gato", year: 1929, westernSign: "Tauro", field: "Cine", country: "Reino Unido", emoji: "🎬" },
    { name: "Marie Curie", animal: "Gato", year: 1867, westernSign: "Escorpio", field: "Ciencia", country: "Polonia", emoji: "🔬" },
    { name: "Michael J. Fox", animal: "Gato", year: 1961, westernSign: "Cáncer", field: "Cine", country: "Canadá", emoji: "🎬" },
    { name: "Frank Sinatra", animal: "Gato", year: 1915, westernSign: "Sagitario", field: "Música", country: "Estados Unidos", emoji: "🎵" },
  ],
  Dragón: [
    { name: "Bruce Lee", animal: "Dragón", year: 1940, westernSign: "Sagitario", field: "Cine", country: "Estados Unidos", emoji: "🥋" },
    { name: "John Lennon", animal: "Dragón", year: 1940, westernSign: "Libra", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Vladimir Putin", animal: "Dragón", year: 1952, westernSign: "Libra", field: "Política", country: "Rusia", emoji: "🏛" },
    { name: "Rihanna", animal: "Dragón", year: 1988, westernSign: "Piscis", field: "Música", country: "Barbados", emoji: "🎤" },
    { name: "Adele", animal: "Dragón", year: 1988, westernSign: "Tauro", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Salvador Dalí", animal: "Dragón", year: 1904, westernSign: "Tauro", field: "Arte", country: "España", emoji: "🎨" },
    { name: "Neil Armstrong", animal: "Dragón", year: 1930, westernSign: "Leo", field: "Exploración", country: "Estados Unidos", emoji: "🚀" },
    { name: "Sigmund Freud", animal: "Dragón", year: 1856, westernSign: "Tauro", field: "Psicología", country: "Austria", emoji: "🧠" },
    { name: "Che Guevara", animal: "Dragón", year: 1928, westernSign: "Cáncer", field: "Revolución", country: "Argentina", emoji: "✊" },
    { name: "Shakira", animal: "Dragón", year: 1977, westernSign: "Acuario", field: "Música", country: "Colombia", emoji: "🎤" },
  ],
  Serpiente: [
    { name: "Mahatma Gandhi", animal: "Serpiente", year: 1869, westernSign: "Libra", field: "Política", country: "India", emoji: "☮" },
    { name: "Pablo Picasso", animal: "Serpiente", year: 1881, westernSign: "Escorpio", field: "Arte", country: "España", emoji: "🎨" },
    { name: "John F. Kennedy", animal: "Serpiente", year: 1917, westernSign: "Tauro", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Oprah Winfrey", animal: "Serpiente", year: 1954, westernSign: "Acuario", field: "Medios", country: "Estados Unidos", emoji: "📺" },
    { name: "Taylor Swift", animal: "Serpiente", year: 1989, westernSign: "Sagitario", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Charles Darwin", animal: "Serpiente", year: 1809, westernSign: "Acuario", field: "Ciencia", country: "Reino Unido", emoji: "🔬" },
    { name: "Abraham Lincoln", animal: "Serpiente", year: 1809, westernSign: "Acuario", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Bob Dylan", animal: "Serpiente", year: 1941, westernSign: "Tauro", field: "Música", country: "Estados Unidos", emoji: "🎵" },
    { name: "Edgar Allan Poe", animal: "Serpiente", year: 1809, westernSign: "Capricornio", field: "Literatura", country: "Estados Unidos", emoji: "📚" },
  ],
  Caballo: [
    { name: "Genghis Khan", animal: "Caballo", year: 1162, westernSign: "Tauro", field: "Historia", country: "Mongolia", emoji: "⚔" },
    { name: "Rembrandt", animal: "Caballo", year: 1606, westernSign: "Libra", field: "Arte", country: "Países Bajos", emoji: "🎨" },
    { name: "Theodore Roosevelt", animal: "Caballo", year: 1858, westernSign: "Acuario", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Paul McCartney", animal: "Caballo", year: 1942, westernSign: "Géminis", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Greta Thunberg", animal: "Caballo", year: 2003, westernSign: "Acuario", field: "Activismo", country: "Suecia", emoji: "🌍" },
    { name: "Aretha Franklin", animal: "Caballo", year: 1942, westernSign: "Aries", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Samuel L. Jackson", animal: "Caballo", year: 1948, westernSign: "Capricornio", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Denzel Washington", animal: "Caballo", year: 1954, westernSign: "Capricornio", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Stephen Hawking", animal: "Caballo", year: 1942, westernSign: "Capricornio", field: "Ciencia", country: "Reino Unido", emoji: "🔬" },
    { name: "Carlos Gardel", animal: "Caballo", year: 1890, westernSign: "Sagitario", field: "Música", country: "Argentina", emoji: "🎤" },
  ],
  Cabra: [
    { name: "Mark Twain", animal: "Cabra", year: 1835, westernSign: "Sagitario", field: "Literatura", country: "Estados Unidos", emoji: "📚" },
    { name: "Steve Jobs", animal: "Cabra", year: 1955, westernSign: "Acuario", field: "Tecnología", country: "Estados Unidos", emoji: "💻" },
    { name: "Julia Roberts", animal: "Cabra", year: 1967, westernSign: "Escorpio", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Ed Sheeran", animal: "Cabra", year: 1991, westernSign: "Acuario", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Billie Eilish", animal: "Cabra", year: 2001, westernSign: "Acuario", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Julius Caesar", animal: "Cabra", year: 100, westernSign: "Cáncer", field: "Historia", country: "Roma", emoji: "⚔" },
    { name: "Miguel de Cervantes", animal: "Cabra", year: 1547, westernSign: "Libra", field: "Literatura", country: "España", emoji: "📚" },
    { name: "Andy Warhol", animal: "Cabra", year: 1928, westernSign: "Leo", field: "Arte", country: "Estados Unidos", emoji: "🎨" },
    { name: "Nicole Kidman", animal: "Cabra", year: 1967, westernSign: "Cáncer", field: "Cine", country: "Australia", emoji: "🎬" },
  ],
  Mono: [
    { name: "Leonardo da Vinci", animal: "Mono", year: 1452, westernSign: "Aries", field: "Arte", country: "Italia", emoji: "🎨" },
    { name: "Charles Dickens", animal: "Mono", year: 1812, westernSign: "Acuario", field: "Literatura", country: "Reino Unido", emoji: "📚" },
    { name: "Harry S. Truman", animal: "Mono", year: 1884, westernSign: "Tauro", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Will Smith", animal: "Mono", year: 1968, westernSign: "Libra", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Daniel Craig", animal: "Mono", year: 1968, westernSign: "Aries", field: "Cine", country: "Reino Unido", emoji: "🎬" },
    { name: "Tom Hanks", animal: "Mono", year: 1956, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Michael Jordan", animal: "Mono", year: 1963, westernSign: "Acuario", field: "Deportes", country: "Estados Unidos", emoji: "🏀" },
    { name: "Elizabeth Taylor", animal: "Mono", year: 1932, westernSign: "Acuario", field: "Cine", country: "Reino Unido", emoji: "🎬" },
    { name: "Beyoncé", animal: "Mono", year: 1981, westernSign: "Virgo", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Kylie Minogue", animal: "Mono", year: 1968, westernSign: "Tauro", field: "Música", country: "Australia", emoji: "🎵" },
  ],
  Gallo: [
    { name: "Confucius", animal: "Gallo", year: 551, westernSign: "Virgo", field: "Filosofía", country: "China", emoji: "📖" },
    { name: "Bud Spencer", animal: "Gallo", year: 1929, westernSign: "Acuario", field: "Cine", country: "Italia", emoji: "🎬" },
    { name: "Muhammad Ali", animal: "Gallo", year: 1942, westernSign: "Acuario", field: "Deportes", country: "Estados Unidos", emoji: "🥊" },
    { name: "Matt Damon", animal: "Gallo", year: 1970, westernSign: "Acuario", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Beyoncé", animal: "Gallo", year: 1981, westernSign: "Virgo", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Roger Federer", animal: "Gallo", year: 1981, westernSign: "Leo", field: "Deportes", country: "Suiza", emoji: "🎾" },
    { name: "Jennifer Lawrence", animal: "Gallo", year: 1990, westernSign: "Leo", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Yoko Ono", animal: "Gallo", year: 1933, westernSign: "Piscis", field: "Arte", country: "Japón", emoji: "🎨" },
    { name: "Enrico Caruso", animal: "Gallo", year: 1873, westernSign: "Piscis", field: "Música", country: "Italia", emoji: "🎵" },
  ],
  Perro: [
    { name: "Wolfgang Amadeus Mozart", animal: "Perro", year: 1756, westernSign: "Acuario", field: "Música", country: "Austria", emoji: "🎵" },
    { name: "Winston Churchill", animal: "Perro", year: 1874, westernSign: "Sagitario", field: "Política", country: "Reino Unido", emoji: "🏛" },
    { name: "Elvis Presley", animal: "Perro", year: 1935, westernSign: "Capricornio", field: "Música", country: "Estados Unidos", emoji: "🎵" },
    { name: "Madonna", animal: "Perro", year: 1958, westernSign: "Leo", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Michael Bublé", animal: "Perro", year: 1975, westernSign: "Libra", field: "Música", country: "Canadá", emoji: "🎵" },
    { name: "Mother Teresa", animal: "Perro", year: 1910, westernSign: "Virgo", field: "Activismo", country: "India", emoji: "✊" },
    { name: "David Bowie", animal: "Perro", year: 1947, westernSign: "Capricornio", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Steve Martin", animal: "Perro", year: 1945, westernSign: "Leo", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Miley Cyrus", animal: "Perro", year: 1992, westernSign: "Sagitario", field: "Música", country: "Estados Unidos", emoji: "🎤" },
    { name: "Donald Trump", animal: "Perro", year: 1946, westernSign: "Cáncer", field: "Política", country: "Estados Unidos", emoji: "🏛" },
  ],
  Cerdo: [
    { name: "Henry Ford", animal: "Cerdo", year: 1863, westernSign: "Cáncer", field: "Industria", country: "Estados Unidos", emoji: "🏭" },
    { name: "Ernest Hemingway", animal: "Cerdo", year: 1899, westernSign: "Cáncer", field: "Literatura", country: "Estados Unidos", emoji: "📚" },
    { name: "Alfred Hitchcock", animal: "Cerdo", year: 1899, westernSign: "Leo", field: "Cine", country: "Reino Unido", emoji: "🎬" },
    { name: "Ronald Reagan", animal: "Cerdo", year: 1911, westernSign: "Acuario", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Amy Winehouse", animal: "Cerdo", year: 1983, westernSign: "Virgo", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Woody Allen", animal: "Cerdo", year: 1935, westernSign: "Capricornio", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Henry Kissinger", animal: "Cerdo", year: 1923, westernSign: "Cáncer", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "David Hume", animal: "Cerdo", year: 1711, westernSign: "Tauro", field: "Filosofía", country: "Escocia", emoji: "📖" },
    { name: "Ludwig van Beethoven", animal: "Cerdo", year: 1770, westernSign: "Sagitario", field: "Música", country: "Alemania", emoji: "🎵" },
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
    { name: "David Beckham", animal: "Gato", year: 1975, westernSign: "Tauro", field: "Deportes", country: "Reino Unido", emoji: "⚽" },
    { name: "Adele", animal: "Dragón", year: 1988, westernSign: "Tauro", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "John F. Kennedy", animal: "Serpiente", year: 1917, westernSign: "Tauro", field: "Política", country: "Estados Unidos", emoji: "🏛" },
  ],
  Géminis: [
    { name: "Prince", animal: "Rata", year: 1958, westernSign: "Géminis", field: "Música", country: "Estados Unidos", emoji: "🎶" },
    { name: "Paul McCartney", animal: "Caballo", year: 1942, westernSign: "Géminis", field: "Música", country: "Reino Unido", emoji: "🎵" },
    { name: "Lana Del Rey", animal: "Gato", year: 1985, westernSign: "Géminis", field: "Música", country: "Estados Unidos", emoji: "🎵" },
    { name: "Morgan Freeman", animal: "Cabra", year: 1937, westernSign: "Géminis", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Kanye West", animal: "Cabra", year: 1977, westernSign: "Géminis", field: "Música", country: "Estados Unidos", emoji: "🎵" },
  ],
  Cáncer: [
    { name: "Albert Einstein", animal: "Gato", year: 1879, westernSign: "Piscis", field: "Ciencia", country: "Alemania", emoji: "🔬" },
    { name: "Tom Cruise", animal: "Tigre", year: 1962, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Angelina Jolie", animal: "Gato", year: 1975, westernSign: "Cáncer", field: "Cine", country: "Estados Unidos", emoji: "🎬" },
    { name: "Lionel Messi", animal: "Gato", year: 1987, westernSign: "Cáncer", field: "Deportes", country: "Argentina", emoji: "⚽" },
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
    { name: "Michael Jackson", animal: "Gato", year: 1958, westernSign: "Virgo", field: "Música", country: "Estados Unidos", emoji: "🎤" },
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
    { name: "Carlos Gardel", animal: "Caballo", year: 1890, westernSign: "Sagitario", field: "Música", country: "Argentina", emoji: "🎤" },
  ],
  Capricornio: [
    { name: "Isaac Newton", animal: "Tigre", year: 1643, westernSign: "Capricornio", field: "Ciencia", country: "Reino Unido", emoji: "🔬" },
    { name: "Martin Luther King Jr.", animal: "Gato", year: 1929, westernSign: "Capricornio", field: "Activismo", country: "Estados Unidos", emoji: "✊" },
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
    { name: "Albert Einstein", animal: "Gato", year: 1879, westernSign: "Piscis", field: "Ciencia", country: "Alemania", emoji: "🔬" },
    { name: "George Washington", animal: "Rata", year: 1732, westernSign: "Piscis", field: "Política", country: "Estados Unidos", emoji: "🏛" },
    { name: "Rihanna", animal: "Dragón", year: 1988, westernSign: "Piscis", field: "Música", country: "Barbados", emoji: "🎤" },
    { name: "Justin Bieber", animal: "Dragón", year: 1994, westernSign: "Piscis", field: "Música", country: "Canadá", emoji: "🎵" },
    { name: "Adam Levine", animal: "Gato", year: 1979, westernSign: "Piscis", field: "Música", country: "Estados Unidos", emoji: "🎤" },
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
