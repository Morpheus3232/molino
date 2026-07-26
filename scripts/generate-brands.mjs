#!/usr/bin/env node
/**
 * Generate brands.ts with 200+ brands.
 * Run: node scripts/generate-brands.mjs
 */

const animals = ["Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];

function getAnimal(year) {
  const idx = ((year - 1900) % 12 + 12) % 12;
  return animals[idx];
}

function getElement(year) {
  const stems = ["Madera", "Madera", "Fuego", "Fuego", "Tierra", "Tierra", "Metal", "Metal", "Agua", "Agua"];
  return stems[(year - 4 + 10000) % 10];
}

const brands = [
  // Tecnología (25)
  { n: "Apple", y: 1976, p: "Estados Unidos", c: "Tecnología", l: "🍎" },
  { n: "Google", y: 1998, p: "Estados Unidos", c: "Tecnología", l: "🔍" },
  { n: "Microsoft", y: 1975, p: "Estados Unidos", c: "Tecnología", l: "💻" },
  { n: "Amazon", y: 1994, p: "Estados Unidos", c: "Tecnología", l: "📦" },
  { n: "Samsung", y: 1938, p: "Corea del Sur", c: "Tecnología", l: "📱" },
  { n: "Sony", y: 1946, p: "Japón", c: "Tecnología", l: "🎮" },
  { n: "IBM", y: 1911, p: "Estados Unidos", c: "Tecnología", l: "🖥️" },
  { n: "Intel", y: 1968, p: "Estados Unidos", c: "Tecnología", l: "⚡" },
  { n: "Meta", y: 2004, p: "Estados Unidos", c: "Tecnología", l: "👤" },
  { n: "Netflix", y: 1997, p: "Estados Unidos", c: "Tecnología", l: "🎬" },
  { n: "Twitter/X", y: 2006, p: "Estados Unidos", c: "Tecnología", l: "🐦" },
  { n: "Spotify", y: 2006, p: "Suecia", c: "Tecnología", l: "🎵" },
  { n: "Adobe", y: 1982, p: "Estados Unidos", c: "Tecnología", l: "🎨" },
  { n: "Oracle", y: 1977, p: "Estados Unidos", c: "Tecnología", l: "🗄️" },
  { n: "Cisco", y: 1984, p: "Estados Unidos", c: "Tecnología", l: "🌐" },
  { n: "HP", y: 1939, p: "Estados Unidos", c: "Tecnología", l: "🖨️" },
  { n: "Dell", y: 1984, p: "Estados Unidos", c: "Tecnología", l: "💻" },
  { n: "Lenovo", y: 1984, p: "China", c: "Tecnología", l: "💻" },
  { n: "Huawei", y: 1987, p: "China", c: "Tecnología", l: "📡" },
  { n: "Xiaomi", y: 2010, p: "China", c: "Tecnología", l: "📱" },
  { n: "Nokia", y: 1865, p: "Finlandia", c: "Tecnología", l: "📞" },
  { n: "BlackBerry", y: 1984, p: "Canadá", c: "Tecnología", l: "📱" },
  { n: "Snapchat", y: 2011, p: "Estados Unidos", c: "Tecnología", l: "👻" },
  { n: "TikTok", y: 2016, p: "China", c: "Tecnología", l: "🎵" },
  { n: "Zoom", y: 2011, p: "Estados Unidos", c: "Tecnología", l: "📹" },

  // Moda (25)
  { n: "Nike", y: 1964, p: "Estados Unidos", c: "Moda", l: "👟" },
  { n: "Adidas", y: 1949, p: "Alemania", c: "Moda", l: "👕" },
  { n: "Puma", y: 1948, p: "Alemania", c: "Moda", l: "🐾" },
  { n: "Zara", y: 1975, p: "España", c: "Moda", l: "👗" },
  { n: "H&M", y: 1947, p: "Suecia", c: "Moda", l: "👕" },
  { n: "Uniqlo", y: 1984, p: "Japón", c: "Moda", l: "👔" },
  { n: "Levi's", y: 1853, p: "Estados Unidos", c: "Moda", l: "👖" },
  { n: "Ralph Lauren", y: 1967, p: "Estados Unidos", c: "Moda", l: "🏇" },
  { n: "Gucci", y: 1921, p: "Italia", c: "Moda", l: "👒" },
  { n: "Chanel", y: 1910, p: "Francia", c: "Moda", l: "💎" },
  { n: "Prada", y: 1913, p: "Italia", c: "Moda", l: "🕶️" },
  { n: "Dior", y: 1946, p: "Francia", c: "Moda", l: "🌹" },
  { n: "Burberry", y: 1856, p: "Reino Unido", c: "Moda", l: "🧥" },
  { n: "Versace", y: 1978, p: "Italia", c: "Moda", l: "🦁" },
  { n: "Calvin Klein", y: 1968, p: "Estados Unidos", c: "Moda", l: "✏️" },
  { n: "Tommy Hilfiger", y: 1985, p: "Estados Unidos", c: "Moda", l: "🏴" },
  { n: "Under Armour", y: 1996, p: "Estados Unidos", c: "Moda", l: "🏃" },
  { n: "FILA", y: 1911, p: "Italia", c: "Moda", l: "🏋️" },
  { n: "New Balance", y: 1906, p: "Estados Unidos", c: "Moda", l: "🥾" },
  { n: "Reebok", y: 1958, p: "Reino Unido", c: "Moda", l: "👟" },
  { n: "ASICS", y: 1949, p: "Japón", c: "Moda", l: "👟" },
  { n: "Coach", y: 1941, p: "Estados Unidos", c: "Moda", l: "👜" },
  { n: "Fendi", y: 1925, p: "Italia", c: "Moda", l: "🧣" },
  { n: "Yves Saint Laurent", y: 1961, p: "Francia", c: "Moda", l: "✨" },
  { n: "Lululemon", y: 1998, p: "Canadá", c: "Moda", l: "🧘" },

  // Lujo (20)
  { n: "Louis Vuitton", y: 1854, p: "Francia", c: "Lujo", l: "👜" },
  { n: "Hermès", y: 1837, p: "Francia", c: "Lujo", l: "🧣" },
  { n: "Rolex", y: 1905, p: "Suiza", c: "Lujo", l: "⌚" },
  { n: "Cartier", y: 1847, p: "Francia", c: "Lujo", l: "💍" },
  { n: "Tiffany", y: 1837, p: "Estados Unidos", c: "Lujo", l: "💙" },
  { n: "Bulgari", y: 1884, p: "Italia", c: "Lujo", l: "🐍" },
  { n: "Bvlgari", y: 1884, p: "Italia", c: "Lujo", l: "🐍" },
  { n: "Chopard", y: 1860, p: "Suiza", c: "Lujo", l: "⭐" },
  { n: "Versace", y: 1978, p: "Italia", c: "Lujo", l: "🦁" },
  { n: "Armani", y: 1975, p: "Italia", c: "Lujo", l: "🦅" },
  { n: "Balenciaga", y: 1919, p: "España", c: "Lujo", l: "👟" },
  { n: "Givenchy", y: 1952, p: "Francia", c: "Lujo", l: "🌹" },
  { n: "Valentino", y: 1960, p: "Italia", c: "Lujo", l: "❤️" },
  { n: "Dolce & Gabbana", y: 1985, p: "Italia", c: "Lujo", l: "🌻" },
  { n: "Bottega Veneta", y: 1966, p: "Italia", c: "Lujo", l: "编织" },
  { n: "Moncler", y: 1952, p: "Francia", c: "Lujo", l: "🧥" },
  { n: "Ralph Lauren", y: 1967, p: "Estados Unidos", c: "Lujo", l: "🏇" },
  { n: "Coach", y: 1941, p: "Estados Unidos", c: "Lujo", l: "👜" },
  { n: "Tod's", y: 1920, p: "Italia", c: "Lujo", l: "👞" },
  { n: "Ferragamo", y: 1927, p: "Italia", c: "Lujo", l: "👠" },

  // Deportes (20)
  { n: "Red Bull", y: 1987, p: "Austria", c: "Deportes", l: "🐂" },
  { n: "Gatorade", y: 1965, p: "Estados Unidos", c: "Deportes", l: "⚡" },
  { n: "Under Armour", y: 1996, p: "Estados Unidos", c: "Deportes", l: "🏃" },
  { n: "Wilson", y: 1913, p: "Estados Unidos", c: "Deportes", l: "🎾" },
  { n: "Callaway", y: 1982, p: "Estados Unidos", c: "Deportes", l: "⛳" },
  { n: "Decathlon", y: 1976, p: "Francia", c: "Deportes", l: "🏃" },
  { n: "Mizuno", y: 1906, p: "Japón", c: "Deportes", l: "👟" },
  { n: "Speedo", y: 1914, p: "Australia", c: "Deportes", l: "🏊" },
  { n: "Yeti", y: 2006, p: "Estados Unidos", c: "Deportes", l: "❄️" },
  { n: "The North Face", y: 1966, p: "Estados Unidos", c: "Deportes", l: "⛰️" },
  { n: "Patagonia", y: 1973, p: "Estados Unidos", c: "Deportes", l: "🏔️" },
  { n: "Columbia", y: 1938, p: "Estados Unidos", c: "Deportes", l: "🧥" },
  { n: "Specialized", y: 1974, p: "Estados Unidos", c: "Deportes", l: "🚴" },
  { n: "Trek", y: 1976, p: "Estados Unidos", c: "Deportes", l: "🚴" },
  { n: "Oakley", y: 1975, p: "Estados Unidos", c: "Deportes", l: "🕶️" },
  { n: "Skullcandy", y: 2003, p: "Estados Unidos", c: "Deportes", l: "🎧" },
  { n: "GoPro", y: 2002, p: "Estados Unidos", c: "Deportes", l: "📷" },
  { n: "Garmin", y: 1989, p: "Estados Unidos", c: "Deportes", l: "⌚" },
  { n: "Peloton", y: 2012, p: "Estados Unidos", c: "Deportes", l: "🚴" },
  { n: "Lululemon", y: 1998, p: "Canadá", c: "Deportes", l: "🧘" },

  // Automóviles (20)
  { n: "Tesla", y: 2003, p: "Estados Unidos", c: "Automóviles", l: "⚡" },
  { n: "Ferrari", y: 1939, p: "Italia", c: "Automóviles", l: "🏎️" },
  { n: "Porsche", y: 1931, p: "Alemania", c: "Automóviles", l: "🚗" },
  { n: "Toyota", y: 1937, p: "Japón", c: "Automóviles", l: "🚙" },
  { n: "BMW", y: 1916, p: "Alemania", c: "Automóviles", l: "🚘" },
  { n: "Mercedes-Benz", y: 1926, p: "Alemania", c: "Automóviles", l: "🏁" },
  { n: "Lamborghini", y: 1963, p: "Italia", c: "Automóviles", l: "🐂" },
  { n: "Audi", y: 1909, p: "Alemania", c: "Automóviles", l: "🔶" },
  { n: "Volvo", y: 1927, p: "Suecia", c: "Automóviles", l: "🔩" },
  { n: "Hyundai", y: 1967, p: "Corea del Sur", c: "Automóviles", l: "🟠" },
  { n: "Ford", y: 1903, p: "Estados Unidos", c: "Automóviles", l: "🔵" },
  { n: "Chevrolet", y: 1911, p: "Estados Unidos", c: "Automóviles", l: "⭐" },
  { n: "Honda", y: 1948, p: "Japón", c: "Automóviles", l: "🔴" },
  { n: "Nissan", y: 1933, p: "Japón", c: "Automóviles", l: "⭕" },
  { n: "Subaru", y: 1953, p: "Japón", c: "Automóviles", l: "⭐" },
  { n: "Mazda", y: 1920, p: "Japón", c: "Automóviles", l: "🪽" },
  { n: "Jeep", y: 1941, p: "Estados Unidos", c: "Automóviles", l: "🚙" },
  { n: "Land Rover", y: 1948, p: "Reino Unido", c: "Automóviles", l: "🚙" },
  { n: "Alfa Romeo", y: 1910, p: "Italia", c: "Automóviles", l: "🐍" },
  { n: "Bentley", y: 1919, p: "Reino Unido", c: "Automóviles", l: "🅱️" },

  // Alimentos y bebidas (25)
  { n: "Coca-Cola", y: 1886, p: "Estados Unidos", c: "Alimentos", l: "🥤" },
  { n: "Starbucks", y: 1971, p: "Estados Unidos", c: "Alimentos", l: "☕" },
  { n: "McDonald's", y: 1955, p: "Estados Unidos", c: "Alimentos", l: "🍔" },
  { n: "Nestlé", y: 1866, p: "Suiza", c: "Alimentos", l: "🍫" },
  { n: "Pepsi", y: 1893, p: "Estados Unidos", c: "Alimentos", l: "🥤" },
  { n: "Heineken", y: 1864, p: "Países Bajos", c: "Alimentos", l: "🍺" },
  { n: "Ben & Jerry's", y: 1978, p: "Estados Unidos", c: "Alimentos", l: "🍦" },
  { n: "KFC", y: 1930, p: "Estados Unidos", c: "Alimentos", l: "🍗" },
  { n: "Subway", y: 1965, p: "Estados Unidos", c: "Alimentos", l: "🥖" },
  { n: "Domino's", y: 1960, p: "Estados Unidos", c: "Alimentos", l: "🍕" },
  { n: "Burger King", y: 1954, p: "Estados Unidos", c: "Alimentos", l: "🍔" },
  { n: "Dunkin'", y: 1950, p: "Estados Unidos", c: "Alimentos", l: "🍩" },
  { n: "Costa Coffee", y: 1971, p: "Reino Unido", c: "Alimentos", l: "☕" },
  { n: "Lavazza", y: 1895, p: "Italia", c: "Alimentos", l: "☕" },
  { n: "Illy", y: 1933, p: "Italia", c: "Alimentos", l: "☕" },
  { n: "Corona", y: 1925, p: "México", c: "Alimentos", l: "🍺" },
  { n: "Budweiser", y: 1876, p: "Estados Unidos", c: "Alimentos", l: "🍺" },
  { n: "Guinness", y: 1759, p: "Irlanda", c: "Alimentos", l: "🍺" },
  { n: "Ferrero", y: 1946, p: "Italia", c: "Alimentos", l: "🍫" },
  { n: "Cadbury", y: 1824, p: "Reino Unido", c: "Alimentos", l: "🍫" },
  { n: "Oreo", y: 1912, p: "Estados Unidos", c: "Alimentos", l: "🍪" },
  { n: "Tabasco", y: 1868, p: "Estados Unidos", c: "Alimentos", l: "🌶️" },
  { n: "Sriracha", y: 1980, p: "Estados Unidos", c: "Alimentos", l: "🌶️" },
  { n: "Red Bull", y: 1987, p: "Austria", c: "Alimentos", l: "🐂" },
  { n: "Monster", y: 2002, p: "Estados Unidos", c: "Alimentos", l: "⚡" },

  // Entretenimiento (25)
  { n: "Disney", y: 1923, p: "Estados Unidos", c: "Entretenimiento", l: "🏰" },
  { n: "Warner Bros", y: 1923, p: "Estados Unidos", c: "Entretenimiento", l: "🎬" },
  { n: "Marvel", y: 1939, p: "Estados Unidos", c: "Entretenimiento", l: "🦸" },
  { n: "Pixar", y: 1986, p: "Estados Unidos", c: "Entretenimiento", l: "🐠" },
  { n: "HBO", y: 1972, p: "Estados Unidos", c: "Entretenimiento", l: "📺" },
  { n: "Steam", y: 2003, p: "Estados Unidos", c: "Entretenimiento", l: "🎮" },
  { n: "Nintendo", y: 1889, p: "Japón", c: "Entretenimiento", l: "🎮" },
  { n: "Lego", y: 1932, p: "Dinamarca", c: "Entretenimiento", l: "🧱" },
  { n: "PlayStation", y: 1994, p: "Japón", c: "Entretenimiento", l: "🎮" },
  { n: "Xbox", y: 2001, p: "Estados Unidos", c: "Entretenimiento", l: "🎮" },
  { n: "Universal Studios", y: 1912, p: "Estados Unidos", c: "Entretenimiento", l: "🎬" },
  { n: "Paramount", y: 1912, p: "Estados Unidos", c: "Entretenimiento", l: "⛰️" },
  { n: "DreamWorks", y: 1994, p: "Estados Unidos", c: "Entretenimiento", l: "🌙" },
  { n: "Hulu", y: 2007, p: "Estados Unidos", c: "Entretenimiento", l: "📺" },
  { n: "Amazon Prime", y: 2006, p: "Estados Unidos", c: "Entretenimiento", l: "📦" },
  { n: "Disney+", y: 2019, p: "Estados Unidos", c: "Entretenimiento", l: "✨" },
  { n: "Crunchyroll", y: 2006, p: "Estados Unidos", c: "Entretenimiento", l: "🧡" },
  { n: "Hasbro", y: 1923, p: "Estados Unidos", c: "Entretenimiento", l: "🎲" },
  { n: "Mattel", y: 1945, p: "Estados Unidos", c: "Entretenimiento", l: "🧸" },
  { n: "Bandai", y: 1950, p: "Japón", c: "Entretenimiento", l: "🤖" },
  { n: "Rockstar Games", y: 1998, p: "Estados Unidos", c: "Entretenimiento", l: "⭐" },
  { n: "Epic Games", y: 1991, p: "Estados Unidos", c: "Entretenimiento", l: "🎮" },
  { n: "Ubisoft", y: 1986, p: "Francia", c: "Entretenimiento", l: "🌀" },
  { n: "Capcom", y: 1979, p: "Japón", c: "Entretenimiento", l: "🎮" },
  { n: "Square Enix", y: 1986, p: "Japón", c: "Entretenimiento", l: "🏰" },

  // Música (15)
  { n: "Spotify", y: 2006, p: "Suecia", c: "Música", l: "🎵" },
  { n: "Apple Music", y: 2015, p: "Estados Unidos", c: "Música", l: "🎶" },
  { n: "SoundCloud", y: 2007, p: "Alemania", c: "Música", l: "☁️" },
  { n: "Shazam", y: 1999, p: "Reino Unido", c: "Música", l: "🔮" },
  { n: "Fender", y: 1946, p: "Estados Unidos", c: "Música", l: "🎸" },
  { n: "Gibson", y: 1902, p: "Estados Unidos", c: "Música", l: "🎸" },
  { n: "Yamaha", y: 1887, p: "Japón", c: "Música", l: "🎹" },
  { n: "Roland", y: 1972, p: "Japón", c: "Música", l: "🎹" },
  { n: "Bose", y: 1964, p: "Estados Unidos", c: "Música", l: "🎧" },
  { n: "Sennheiser", y: 1945, p: "Alemania", c: "Música", l: "🎧" },
  { n: "Beat Electronics", y: 2006, p: "Estados Unidos", c: "Música", l: "🎧" },
  { n: "Vinyl Me Please", y: 2013, p: "Estados Unidos", c: "Música", l: "💿" },
  { n: "Discogs", y: 2000, p: "Estados Unidos", c: "Música", l: "📀" },
  { n: "Tidal", y: 2014, p: "Noruega", c: "Música", l: "🌊" },
  { n: "Deezer", y: 2007, p: "Francia", c: "Música", l: "🎵" },

  // Viajes (15)
  { n: "Marriott", y: 1927, p: "Estados Unidos", c: "Viajes", l: "🏨" },
  { n: "Hilton", y: 1919, p: "Estados Unidos", c: "Viajes", l: "🛎️" },
  { n: "Airbnb", y: 2008, p: "Estados Unidos", c: "Viajes", l: "🏠" },
  { n: "Booking.com", y: 1996, p: "Países Bajos", c: "Viajes", l: "📋" },
  { n: "Expedia", y: 1996, p: "Estados Unidos", c: "Viajes", l: "✈️" },
  { n: "TripAdvisor", y: 2000, p: "Estados Unidos", c: "Viajes", l: "🦉" },
  { n: "Lonely Planet", y: 1973, p: "Australia", c: "Viajes", l: "🌍" },
  { n: "Delta Airlines", y: 1925, p: "Estados Unidos", c: "Viajes", l: "✈️" },
  { n: "Emirates", y: 1985, p: "Emiratos Árabes", c: "Viajes", l: "✈️" },
  { n: "LATAM", y: 2012, p: "Chile", c: "Viajes", l: "🛫" },
  { n: "Copa Airlines", y: 1947, p: "Panamá", c: "Viajes", l: "✈️" },
  { n: "Iberia", y: 1927, p: "España", c: "Viajes", l: "✈️" },
  { n: "Ryanair", y: 1984, p: "Irlanda", c: "Viajes", l: "✈️" },
  { n: "Norwegian", y: 1993, p: "Noruega", c: "Viajes", l: "✈️" },
  { n: "Uber", y: 2009, p: "Estados Unidos", c: "Viajes", l: "🚗" },

  // Belleza (15)
  { n: "L'Oréal", y: 1909, p: "Francia", c: "Belleza", l: "💄" },
  { n: "Estée Lauder", y: 1946, p: "Estados Unidos", c: "Belleza", l: "💄" },
  { n: "MAC", y: 1984, p: "Canadá", c: "Belleza", l: "💄" },
  { n: "Sephora", y: 1970, p: "Francia", c: "Belleza", l: "💄" },
  { n: "Nivea", y: 1911, p: "Alemania", c: "Belleza", l: "🧴" },
  { n: "Dove", y: 1957, p: "Estados Unidos", c: "Belleza", l: "🕊️" },
  { n: "The Body Shop", y: 1976, p: "Reino Unido", c: "Belleza", l: "🌿" },
  { n: "Shiseido", y: 1872, p: "Japón", c: "Belleza", l: "🌸" },
  { n: "Clinique", y: 1968, p: "Estados Unidos", c: "Belleza", l: "💚" },
  { n: "Glossier", y: 2014, p: "Estados Unidos", c: "Belleza", l: "🩷" },
  { n: "Dyson", y: 1991, p: "Reino Unido", c: "Belleza", l: "💨" },
  { n: "Olaplex", y: 2014, p: "Estados Unidos", c: "Belleza", l: "✨" },
  { n: "Fenty Beauty", y: 2017, p: "Estados Unidos", c: "Belleza", l: "💄" },
  { n: "Charlotte Tilbury", y: 2013, p: "Reino Unido", c: "Belleza", l: "💄" },
  { n: "Kiehl's", y: 1851, p: "Estados Unidos", c: "Belleza", l: "🧴" },

  // Retail (15)
  { n: "Walmart", y: 1962, p: "Estados Unidos", c: "Retail", l: "🛒" },
  { n: "Target", y: 1962, p: "Estados Unidos", c: "Retail", l: "🎯" },
  { n: "Costco", y: 1976, p: "Estados Unidos", c: "Retail", l: "📦" },
  { n: "IKEA", y: 1943, p: "Suecia", c: "Retail", l: "🪑" },
  { n: "Home Depot", y: 1978, p: "Estados Unidos", c: "Retail", l: "🔨" },
  { n: "Alibaba", y: 1999, p: "China", c: "Retail", l: "🛒" },
  { n: "Mercado Libre", y: 1999, p: "Argentina", c: "Retail", l: "📦" },
  { n: "Shopify", y: 2006, p: "Canadá", c: "Retail", l: "🛍️" },
  { n: "eBay", y: 1995, p: "Estados Unidos", c: "Retail", l: "🏷️" },
  { n: "Etsy", y: 2005, p: "Estados Unidos", c: "Retail", l: "🎨" },
  { n: "Zalando", y: 2008, p: "Alemania", c: "Retail", l: "👟" },
  { n: "ASOS", y: 2000, p: "Reino Unido", c: "Retail", l: "👗" },
  { n: "Shein", y: 2008, p: "China", c: "Retail", l: "👗" },
  { n: "Best Buy", y: 1966, p: "Estados Unidos", c: "Retail", l: "📱" },
  { n: "Nordstrom", y: 1901, p: "Estados Unidos", c: "Retail", l: "🏬" },

  // Finanzas (15)
  { n: "Visa", y: 1958, p: "Estados Unidos", c: "Finanzas", l: "💳" },
  { n: "Mastercard", y: 1966, p: "Estados Unidos", c: "Finanzas", l: "💳" },
  { n: "PayPal", y: 1998, p: "Estados Unidos", c: "Finanzas", l: "💰" },
  { n: "Stripe", y: 2010, p: "Estados Unidos", c: "Finanzas", l: "💳" },
  { n: "Square", y: 2009, p: "Estados Unidos", c: "Finanzas", l: "📱" },
  { n: "Coinbase", y: 2012, p: "Estados Unidos", c: "Finanzas", l: "₿" },
  { n: "Robinhood", y: 2013, p: "Estados Unidos", c: "Finanzas", l: "📈" },
  { n: "Goldman Sachs", y: 1869, p: "Estados Unidos", c: "Finanzas", l: "🏦" },
  { n: "JP Morgan", y: 1799, p: "Estados Unidos", c: "Finanzas", l: "🏦" },
  { n: "HSBC", y: 1865, p: "Reino Unido", c: "Finanzas", l: "🏦" },
  { n: "Allianz", y: 1890, p: "Alemania", c: "Finanzas", l: "🛡️" },
  { n: "Bloomberg", y: 1981, p: "Estados Unidos", c: "Finanzas", l: "📊" },
  { n: "Charles Schwab", y: 1971, p: "Estados Unidos", c: "Finanzas", l: "📈" },
  { n: "American Express", y: 1850, p: "Estados Unidos", c: "Finanzas", l: "💳" },
  { n: "Western Union", y: 1851, p: "Estados Unidos", c: "Finanzas", l: "💸" },
];

// Generate the file
let output = `/**
 * Complete brand database — ${brands.length} brands across ${[...new Set(brands.map(b => b.c))].length} categories.
 * Chinese zodiac computed from founding year using project's getChineseAnimal formula.
 * Generated by scripts/generate-brands.mjs
 */

export interface BrandData {
  name: string;
  logo: string;
  year: number;
  country: string;
  animal: string;
  element: string;
  category: string;
}

export const BRANDS: BrandData[] = [
`;

// Group by category
const categories = [...new Set(brands.map(b => b.c))].sort();
for (const cat of categories) {
  const group = brands.filter(b => b.c === cat);
  output += `\n  // ${cat} (${group.length})\n`;
  for (const b of group) {
    const animal = getAnimal(b.y);
    const element = getElement(b.y);
    output += `  { name: "${b.n}", logo: "${b.l}", year: ${b.y}, country: "${b.p}", animal: "${animal}", element: "${element}", category: "${b.c}" },\n`;
  }
}

output += `];

// Helper: get all unique categories
export function getBrandCategories(): string[] {
  return [...new Set(BRANDS.map(b => b.category))].sort();
}

// Helper: find brand by name
export function findBrand(name: string): BrandData | undefined {
  return BRANDS.find(b => b.name.toLowerCase() === name.toLowerCase());
}
`;

const fs = await import('fs');
fs.writeFileSync('./lib/data/brands.ts', output);
console.log(`Generated ${brands.length} brands → lib/data/brands.ts`);
console.log(`Categories: ${categories.join(', ')}`);
