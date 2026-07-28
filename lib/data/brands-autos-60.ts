import type { SymbolicEntity } from "./symbolic-entities";

export const BRANDS_AUTOS_60: SymbolicEntity[] = [
  // Rata
  {
    id: "dodge-autos", name: "Dodge", type: "brand",
    foundingYear: 1900, country: "Estados Unidos", emoji: "🚙",
    category: "autos",
    description: "Marca americana conocida por muscle cars y camionetas robustas.",
    keyThemes: ["Potencia", "Muscle", "Americano", "Durabilidad"],
    events: [{ id: "dodge-autos-fund", type: "fundacion", label: "Fundación", year: 1900, confidence: "media", primaryForAffinity: true, description: "Fundación de Dodge", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1900.",
  },
  // Rata
  {
    id: "mg-autos", name: "MG", type: "brand",
    foundingYear: 1924, country: "Reino Unido", emoji: "🚗",
    category: "autos",
    description: "Marca británica de autos deportivos accesibles, renacida como eléctrica.",
    keyThemes: ["Británico", "Deportivo", "Clásico", "Accesible"],
    events: [{ id: "mg-autos-fund", type: "fundacion", label: "Fundación", year: 1924, confidence: "media", primaryForAffinity: true, description: "Fundación de MG", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1924.",
  },
  // Rata
  {
    id: "land-rover-autos", name: "Land Rover", type: "brand",
    foundingYear: 1948, country: "Reino Unido", emoji: "🚙",
    category: "autos",
    description: "El todoterreno británico por excelencia, capaz en cualquier terreno.",
    keyThemes: ["Aventura", "Británico", "Capacidad", "Exploración"],
    events: [{ id: "land-rover-autos-fund", type: "fundacion", label: "Fundación", year: 1948, confidence: "media", primaryForAffinity: true, description: "Fundación de Land Rover", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1948.",
  },
  // Rata
  {
    id: "honda-motor-autos", name: "Honda Motor", type: "brand",
    foundingYear: 1948, country: "Japón", emoji: "🏍️",
    category: "autos",
    description: "El gigante japonés de motocicletas que conquistó el mundo.",
    keyThemes: ["Japón", "Innovación", "Motocicletas", "Confiabilidad"],
    events: [{ id: "honda-motor-autos-fund", type: "fundacion", label: "Fundación", year: 1948, confidence: "media", primaryForAffinity: true, description: "Fundación de Honda Motor", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1948.",
  },
  // Cerdo
  {
    id: "fiat-1899-autos", name: "Fiat", type: "brand",
    foundingYear: 1899, country: "Italia", emoji: "🚗",
    category: "autos",
    description: "El fabricante italiano que motorizó Italia con autos compactos.",
    keyThemes: ["Italiano", "Compacto", "Diseño", "Accesibilidad"],
    events: [{ id: "fiat-1899-autos-fund", type: "fundacion", label: "Fundación", year: 1899, confidence: "media", primaryForAffinity: true, description: "Fundación de Fiat", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1899.",
  },
  // Buey
  {
    id: "gmc-autos", name: "GMC", type: "brand",
    foundingYear: 1901, country: "Estados Unidos", emoji: "🚛",
    category: "autos",
    description: "Marca americana de camionetas y SUVs, capacidad y resistencia.",
    keyThemes: ["Americano", "Capacidad", "Durabilidad", "Potencia"],
    events: [{ id: "gmc-autos-fund", type: "fundacion", label: "Fundación", year: 1901, confidence: "media", primaryForAffinity: true, description: "Fundación de GMC", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1901.",
  },
  // Buey
  {
    id: "aston-martin-autos", name: "Aston Martin", type: "brand",
    foundingYear: 1913, country: "Reino Unido", emoji: "007",
    category: "autos",
    description: "El auto de James Bond, lujo británico con alma deportiva.",
    keyThemes: ["Lujo", "Británico", "Elegancia", "Deportivo"],
    events: [{ id: "aston-martin-autos-fund", type: "fundacion", label: "Fundación", year: 1913, confidence: "media", primaryForAffinity: true, description: "Fundación de Aston Martin", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1913.",
  },
  // Buey
  {
    id: "chrysler-autos", name: "Chrysler", type: "brand",
    foundingYear: 1925, country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "Uno de los tres grandes de Detroit, pionero en diseño.",
    keyThemes: ["Americano", "Innovación", "Diseño", "Potencia"],
    events: [{ id: "chrysler-autos-fund", type: "fundacion", label: "Fundación", year: 1925, confidence: "media", primaryForAffinity: true, description: "Fundación de Chrysler", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1925.",
  },
  // Buey
  {
    id: "toyota-autos", name: "Toyota", type: "brand",
    foundingYear: 1937, country: "Japón", emoji: "🚗",
    category: "autos",
    description: "El mayor fabricante de autos del mundo, calidad y confiabilidad.",
    keyThemes: ["Japón", "Calidad", "Innovación", "Confiabilidad"],
    events: [{ id: "toyota-autos-fund", type: "fundacion", label: "Fundación", year: 1937, confidence: "media", primaryForAffinity: true, description: "Fundación de Toyota", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1937.",
  },
  // Gallo
  {
    id: "morgan-autos", name: "Morgan", type: "brand",
    foundingYear: 1909, country: "Reino Unido", emoji: "🚗",
    category: "autos",
    description: "Fabricante británico de autos deportivos artesanales desde 1909.",
    keyThemes: ["Británico", "Artesanal", "Clásico", "Deportivo"],
    events: [{ id: "morgan-autos-fund", type: "fundacion", label: "Fundación", year: 1909, confidence: "media", primaryForAffinity: true, description: "Fundación de Morgan", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1909.",
  },
  // Tigre
  {
    id: "cadillac-autos", name: "Cadillac", type: "brand",
    foundingYear: 1902, country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "El estándar del lujo americano desde los albores del automóvil.",
    keyThemes: ["Lujo", "Americano", "Elegancia", "Estatus"],
    events: [{ id: "cadillac-autos-fund", type: "fundacion", label: "Fundación", year: 1902, confidence: "media", primaryForAffinity: true, description: "Fundación de Cadillac", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1902.",
  },
  // Tigre
  {
    id: "maserati-autos", name: "Maserati", type: "brand",
    foundingYear: 1914, country: "Italia", emoji: "🔱",
    category: "autos",
    description: "Marca italiana de lujo con el tridente de Bolonia.",
    keyThemes: ["Lujo", "Italiano", "Elegancia", "Deportivo"],
    events: [{ id: "maserati-autos-fund", type: "fundacion", label: "Fundación", year: 1914, confidence: "media", primaryForAffinity: true, description: "Fundación de Maserati", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1914.",
  },
  // Tigre
  {
    id: "mercedes-autos", name: "Mercedes-Benz", type: "brand",
    foundingYear: 1926, country: "Alemania", emoji: "🚗",
    category: "autos",
    description: "La marca de autos de lujo más prestigiosa del mundo.",
    keyThemes: ["Lujo", "Innovación", "Ingeniería", "Elegancia"],
    events: [{ id: "mercedes-autos-fund", type: "fundacion", label: "Fundación", year: 1926, confidence: "media", primaryForAffinity: true, description: "Fundación de Mercedes-Benz", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1926.",
  },
  // Tigre
  {
    id: "seat-autos", name: "SEAT", type: "brand",
    foundingYear: 1950, country: "España", emoji: "🚗",
    category: "autos",
    description: "La marca española de autos, nacida para motorizar España.",
    keyThemes: ["España", "Accesibilidad", "Diseño", "Juventud"],
    events: [{ id: "seat-autos-fund", type: "fundacion", label: "Fundación", year: 1950, confidence: "media", primaryForAffinity: true, description: "Fundación de SEAT", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1950.",
  },
  // Tigre
  {
    id: "acura-autos", name: "Acura", type: "brand",
    foundingYear: 1986, country: "Japón", emoji: "🔧",
    category: "autos",
    description: "La marca premium de Honda, precisión con rendimiento.",
    keyThemes: ["Japón", "Precisión", "Deportivo", "Lujo"],
    events: [{ id: "acura-autos-fund", type: "fundacion", label: "Fundación", year: 1986, confidence: "media", primaryForAffinity: true, description: "Fundación de Acura", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1986.",
  },
  // Gato
  {
    id: "ford-autos", name: "Ford", type: "brand",
    foundingYear: 1903, country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "Revolucionó el mundo con la cadena de montaje y el Ford T.",
    keyThemes: ["Innovación", "Americano", "Tradición", "Accesibilidad"],
    events: [{ id: "ford-autos-fund", type: "fundacion", label: "Fundación", year: 1903, confidence: "media", primaryForAffinity: true, description: "Fundación de Ford", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1903.",
  },
  // Gato
  {
    id: "buick-autos", name: "Buick", type: "brand",
    foundingYear: 1903, country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "Marca americana de lujo accesible desde los inicios de GM.",
    keyThemes: ["Americano", "Lujo", "Tradición", "Confiabilidad"],
    events: [{ id: "buick-autos-fund", type: "fundacion", label: "Fundación", year: 1903, confidence: "media", primaryForAffinity: true, description: "Fundación de Buick", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1903.",
  },
  // Gato
  {
    id: "harley-autos", name: "Harley-Davidson", type: "brand",
    foundingYear: 1903, country: "Estados Unidos", emoji: "🏍️",
    category: "autos",
    description: "La leyenda americana de las motocicletas, libertad sobre ruedas.",
    keyThemes: ["Americano", "Libertad", "Rebeldía", "Tradición"],
    events: [{ id: "harley-autos-fund", type: "fundacion", label: "Fundación", year: 1903, confidence: "media", primaryForAffinity: true, description: "Fundación de Harley-Davidson", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1903.",
  },
  // Gato
  {
    id: "volvo-autos", name: "Volvo", type: "brand",
    foundingYear: 1927, country: "Suecia", emoji: "🛡️",
    category: "autos",
    description: "Marca sueca pionera en seguridad automotriz y diseño escandinavo.",
    keyThemes: ["Seguridad", "Suecia", "Confiabilidad", "Diseño"],
    events: [{ id: "volvo-autos-fund", type: "fundacion", label: "Fundación", year: 1927, confidence: "media", primaryForAffinity: true, description: "Fundación de Volvo", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1927.",
  },
  // Gato
  {
    id: "lamborghini-autos", name: "Lamborghini", type: "brand",
    foundingYear: 1963, country: "Italia", emoji: "🐂",
    category: "autos",
    description: "Superdeportivos italianos nacidos del desafío a Ferrari.",
    keyThemes: ["Audacia", "Potencia", "Lujo", "Rebeldía"],
    events: [{ id: "lamborghini-autos-fund", type: "fundacion", label: "Fundación", year: 1963, confidence: "media", primaryForAffinity: true, description: "Fundación de Lamborghini", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1963.",
  },
  // Gato
  {
    id: "mclaren-autos", name: "McLaren", type: "brand",
    foundingYear: 1963, country: "Reino Unido", emoji: "🏁",
    category: "autos",
    description: "Superdeportivos británicos nacidos en la Fórmula 1.",
    keyThemes: ["Velocidad", "Competencia", "Innovación", "Británico"],
    events: [{ id: "mclaren-autos-fund", type: "fundacion", label: "Fundación", year: 1963, confidence: "media", primaryForAffinity: true, description: "Fundación de McLaren", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1963.",
  },
  // Dragón
  {
    id: "bmw-autos", name: "BMW", type: "brand",
    foundingYear: 1916, country: "Alemania", emoji: "🚘",
    category: "autos",
    description: "Bayerische Motoren Werke, deportividad y lujo alemán.",
    keyThemes: ["Deportivo", "Lujo", "Ingeniería", "Precisión"],
    events: [{ id: "bmw-autos-fund", type: "fundacion", label: "Fundación", year: 1916, confidence: "media", primaryForAffinity: true, description: "Fundación de BMW", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1916.",
  },
  // Dragón
  {
    id: "isuzu-autos", name: "Isuzu", type: "brand",
    foundingYear: 1916, country: "Japón", emoji: "🚛",
    category: "autos",
    description: "Fabricante japonés de camiones y SUVs con durabilidad legendaria.",
    keyThemes: ["Japón", "Durabilidad", "Camiones", "Confiabilidad"],
    events: [{ id: "isuzu-autos-fund", type: "fundacion", label: "Fundación", year: 1916, confidence: "media", primaryForAffinity: true, description: "Fundación de Isuzu", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1916.",
  },
  // Dragón
  {
    id: "panoz-autos", name: "Panoz", type: "brand",
    foundingYear: 1988, country: "Estados Unidos", emoji: "🏎️",
    category: "autos",
    description: "Fabricante estadounidense de autos deportivos de alto rendimiento.",
    keyThemes: ["Deportivo", "Americano", "Innovación", "Potencia"],
    events: [{ id: "panoz-autos-fund", type: "fundacion", label: "Fundación", year: 1988, confidence: "media", primaryForAffinity: true, description: "Fundación de Panoz", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1988.",
  },
  // Cerdo
  {
    id: "ferrari-autos", name: "Ferrari", type: "brand",
    foundingYear: 1947, country: "Italia", emoji: "🏎️",
    category: "autos",
    description: "El cavallino rampante, máxima expresión de deportividad.",
    keyThemes: ["Pasión", "Velocidad", "Lujo", "Excelencia"],
    events: [{ id: "ferrari-autos-fund", type: "fundacion", label: "Fundación", year: 1947, confidence: "media", primaryForAffinity: true, description: "Fundación de Ferrari", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1947.",
  },
  // Gato
  {
    id: "mclaren-racing", name: "McLaren Racing", type: "brand",
    foundingYear: 1963, country: "Reino Unido", emoji: "🏁",
    category: "autos",
    description: "Escudería de F1 que se convirtió en fabricante de superdeportivos.",
    keyThemes: ["Velocidad", "Competencia", "Innovación", "Británico"],
    events: [{ id: "mclaren-racing-fund", type: "fundacion", label: "Fundación", year: 1963, confidence: "media", primaryForAffinity: true, description: "Fundación de McLaren Racing", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1963.",
  },
  // Serpiente
  {
    id: "mitsubishi-autos", name: "Mitsubishi", type: "brand",
    foundingYear: 1917, country: "Japón", emoji: "🚙",
    category: "autos",
    description: "Marca japonesa con tradición en todoterreno y tecnología.",
    keyThemes: ["Japón", "Tecnología", "Durabilidad", "Tradición"],
    events: [{ id: "mitsubishi-autos-fund", type: "fundacion", label: "Fundación", year: 1917, confidence: "media", primaryForAffinity: true, description: "Fundación de Mitsubishi", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1917.",
  },
  // Serpiente
  {
    id: "jeep-autos", name: "Jeep", type: "brand",
    foundingYear: 1941, country: "Estados Unidos", emoji: "🦅",
    category: "autos",
    description: "Vehículo militar convertido en icono de libertad y aventura.",
    keyThemes: ["Aventura", "Libertad", "Americano", "Durabilidad"],
    events: [{ id: "jeep-autos-fund", type: "fundacion", label: "Fundación", year: 1941, confidence: "media", primaryForAffinity: true, description: "Fundación de Jeep", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1941.",
  },
  // Serpiente
  {
    id: "subaru-autos", name: "Subaru", type: "brand",
    foundingYear: 1953, country: "Japón", emoji: "⭐",
    category: "autos",
    description: "Marca japonesa famosa por tracción integral y motores bóxer.",
    keyThemes: ["Japón", "Confiabilidad", "Aventura", "Tecnología"],
    events: [{ id: "subaru-autos-fund", type: "fundacion", label: "Fundación", year: 1953, confidence: "media", primaryForAffinity: true, description: "Fundación de Subaru", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1953.",
  },
  // Serpiente
  {
    id: "lexus-autos", name: "Lexus", type: "brand",
    foundingYear: 1989, country: "Japón", emoji: "L",
    category: "autos",
    description: "La división de lujo de Toyota que revolucionó la confiabilidad premium.",
    keyThemes: ["Lujo", "Japón", "Confiabilidad", "Innovación"],
    events: [{ id: "lexus-autos-fund", type: "fundacion", label: "Fundación", year: 1989, confidence: "media", primaryForAffinity: true, description: "Fundación de Lexus", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1989.",
  },
  // Serpiente
  {
    id: "infiniti-autos", name: "Infiniti", type: "brand",
    foundingYear: 1989, country: "Japón", emoji: "♾️",
    category: "autos",
    description: "La marca de lujo de Nissan, rendimiento sin límites.",
    keyThemes: ["Japón", "Lujo", "Rendimiento", "Diseño"],
    events: [{ id: "infiniti-autos-fund", type: "fundacion", label: "Fundación", year: 1989, confidence: "media", primaryForAffinity: true, description: "Fundación de Infiniti", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1989.",
  },
  // Caballo
  {
    id: "rolls-royce-autos", name: "Rolls-Royce", type: "brand",
    foundingYear: 1906, country: "Reino Unido", emoji: "👑",
    category: "autos",
    description: "El pináculo del lujo automotriz, cada auto es una obra de arte.",
    keyThemes: ["Lujo", "Excelencia", "Artesanía", "Estatus"],
    events: [{ id: "rolls-royce-autos-fund", type: "fundacion", label: "Fundación", year: 1906, confidence: "media", primaryForAffinity: true, description: "Fundación de Rolls-Royce", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1906.",
  },
  // Gallo
  {
    id: "bugatti-autos", name: "Bugatti", type: "brand",
    foundingYear: 1909, country: "Francia", emoji: "🏁",
    category: "autos",
    description: "La leyenda francesa de los autos más veloces y exclusivos.",
    keyThemes: ["Velocidad", "Lujo", "Innovación", "Excelencia"],
    events: [{ id: "bugatti-autos-fund", type: "fundacion", label: "Fundación", year: 1909, confidence: "media", primaryForAffinity: true, description: "Fundación de Bugatti", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1909.",
  },
  // Gallo
  {
    id: "suzuki-autos", name: "Suzuki", type: "brand",
    foundingYear: 1909, country: "Japón", emoji: "🚙",
    category: "autos",
    description: "Fabricante de autos pequeños y motos, versátil y accesible.",
    keyThemes: ["Japón", "Versatilidad", "Accesibilidad", "Compacto"],
    events: [{ id: "suzuki-autos-fund", type: "fundacion", label: "Fundación", year: 1909, confidence: "media", primaryForAffinity: true, description: "Fundación de Suzuki", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1909.",
  },
  // Gallo
  {
    id: "audi-autos", name: "Audi", type: "brand",
    foundingYear: 1909, country: "Alemania", emoji: "🔗",
    category: "autos",
    description: "Los cuatro aros alemanes, tecnología y diseño progresivo.",
    keyThemes: ["Tecnología", "Alemán", "Innovación", "Diseño"],
    events: [{ id: "audi-autos-fund", type: "fundacion", label: "Fundación", year: 1909, confidence: "media", primaryForAffinity: true, description: "Fundación de Audi", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1909.",
  },
  // Gallo
  {
    id: "nissan-autos", name: "Nissan", type: "brand",
    foundingYear: 1933, country: "Japón", emoji: "🚘",
    category: "autos",
    description: "Marca japonesa pionera en vehículos eléctricos y tecnología.",
    keyThemes: ["Innovación", "Japón", "Tecnología", "Confiabilidad"],
    events: [{ id: "nissan-autos-fund", type: "fundacion", label: "Fundación", year: 1933, confidence: "media", primaryForAffinity: true, description: "Fundación de Nissan", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1933.",
  },
  // Cabra
  {
    id: "porsche-autos", name: "Porsche", type: "brand",
    foundingYear: 1931, country: "Alemania", emoji: "🏎️",
    category: "autos",
    description: "Autos deportivos de lujo con ADN de competición.",
    keyThemes: ["Deportivo", "Lujo", "Alemán", "Precisión"],
    events: [{ id: "porsche-autos-fund", type: "fundacion", label: "Fundación", year: 1931, confidence: "media", primaryForAffinity: true, description: "Fundación de Porsche", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1931.",
  },
  // Cabra
  {
    id: "bentley-autos", name: "Bentley", type: "brand",
    foundingYear: 1919, country: "Reino Unido", emoji: "🅱️",
    category: "autos",
    description: "Lujo británico con ADN de competición desde Le Mans.",
    keyThemes: ["Lujo", "Británico", "Velocidad", "Artesanía"],
    events: [{ id: "bentley-autos-fund", type: "fundacion", label: "Fundación", year: 1919, confidence: "media", primaryForAffinity: true, description: "Fundación de Bentley", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1919.",
  },
  // Cabra
  {
    id: "citroen-autos", name: "Citroën", type: "brand",
    foundingYear: 1919, country: "Francia", emoji: "🚘",
    category: "autos",
    description: "Marca francesa con innovación en suspensión y diseño vanguardista.",
    keyThemes: ["Innovación", "Francés", "Diseño", "Comodidad"],
    events: [{ id: "citroen-autos-fund", type: "fundacion", label: "Fundación", year: 1919, confidence: "media", primaryForAffinity: true, description: "Fundación de Citroën", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1919.",
  },
  // Rata
  {
    id: "porsche-cabra", name: "Porsche 356", type: "brand",
    foundingYear: 1948, country: "Alemania", emoji: "🏎️",
    category: "autos",
    description: "El primer Porsche de producción, que definió la marca.",
    keyThemes: ["Deportivo", "Clásico", "Alemán", "Innovación"],
    events: [{ id: "porsche-cabra-fund", type: "fundacion", label: "Fundación", year: 1948, confidence: "media", primaryForAffinity: true, description: "Fundación de Porsche 356", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1948.",
  },
  // Cabra
  {
    id: "hyundai-autos", name: "Hyundai", type: "brand",
    foundingYear: 1967, country: "Corea del Sur", emoji: "🚙",
    category: "autos",
    description: "El mayor fabricante de Corea, milagro económico coreano.",
    keyThemes: ["Crecimiento", "Innovación", "Confiabilidad", "Calidad"],
    events: [{ id: "hyundai-autos-fund", type: "fundacion", label: "Fundación", year: 1967, confidence: "media", primaryForAffinity: true, description: "Fundación de Hyundai", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1967.",
  },
  // Cabra
  {
    id: "tesla-autos", name: "Tesla", type: "brand",
    foundingYear: 2003, country: "Estados Unidos", emoji: "⚡",
    category: "autos",
    description: "Revolucionó la industria con autos eléctricos de alto rendimiento.",
    keyThemes: ["Innovación", "Sostenibilidad", "Tecnología", "Futuro"],
    events: [{ id: "tesla-autos-fund", type: "fundacion", label: "Fundación", year: 2003, confidence: "media", primaryForAffinity: true, description: "Fundación de Tesla", source: "Documentación histórica" }],
    sourceNote: "Fundada en 2003.",
  },
  // Mono
  {
    id: "gm-autos", name: "General Motors", type: "brand",
    foundingYear: 1908, country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "El gigante americano que dominó la industria automotriz global.",
    keyThemes: ["Americano", "Gigante", "Innovación", "Tradición"],
    events: [{ id: "gm-autos-fund", type: "fundacion", label: "Fundación", year: 1908, confidence: "media", primaryForAffinity: true, description: "Fundación de General Motors", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1908.",
  },
  // Mono
  {
    id: "mazda-autos", name: "Mazda", type: "brand",
    foundingYear: 1920, country: "Japón", emoji: "🌀",
    category: "autos",
    description: "Marca japonesa conocida por su motor rotativo y diseño.",
    keyThemes: ["Innovación", "Japón", "Deportivo", "Diseño"],
    events: [{ id: "mazda-autos-fund", type: "fundacion", label: "Fundación", year: 1920, confidence: "media", primaryForAffinity: true, description: "Fundación de Mazda", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1920.",
  },
  // Mono
  {
    id: "pagani-autos", name: "Pagani", type: "brand",
    foundingYear: 1992, country: "Italia", emoji: "✨",
    category: "autos",
    description: "Hiperdeportivos artesanales italianos, obras de arte.",
    keyThemes: ["Arte", "Lujo", "Innovación", "Exclusividad"],
    events: [{ id: "pagani-autos-fund", type: "fundacion", label: "Fundación", year: 1992, confidence: "media", primaryForAffinity: true, description: "Fundación de Pagani", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1992.",
  },
  // Mono
  {
    id: "piaggio-autos", name: "Piaggio", type: "brand",
    foundingYear: 1884, country: "Italia", emoji: "🛵",
    category: "autos",
    description: "La empresa que creó la Vespa y revolucionó la movilidad.",
    keyThemes: ["Italiano", "Innovación", "Movilidad", "Tradición"],
    events: [{ id: "piaggio-autos-fund", type: "fundacion", label: "Fundación", year: 1884, confidence: "media", primaryForAffinity: true, description: "Fundación de Piaggio", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1884.",
  },
  // Perro
  {
    id: "renault-autos", name: "Renault", type: "brand",
    foundingYear: 1898, country: "Francia", emoji: "🚘",
    category: "autos",
    description: "Marca francesa pionera del automóvil, innovadora en diseño.",
    keyThemes: ["Francés", "Innovación", "Diseño", "Historia"],
    events: [{ id: "renault-autos-fund", type: "fundacion", label: "Fundación", year: 1898, confidence: "media", primaryForAffinity: true, description: "Fundación de Renault", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1898.",
  },
  // Gallo
  {
    id: "oldsmobile-autos", name: "Oldsmobile", type: "brand",
    foundingYear: 1897, country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "Marca pionera que produjo autos durante 107 años.",
    keyThemes: ["Americano", "Tradición", "Historia", "Innovación"],
    events: [{ id: "oldsmobile-autos-fund", type: "fundacion", label: "Fundación", year: 1897, confidence: "media", primaryForAffinity: true, description: "Fundación de Oldsmobile", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1897.",
  },
  // Gallo
  {
    id: "saab-autos", name: "Saab", type: "brand",
    foundingYear: 1945, country: "Suecia", emoji: "✈️",
    category: "autos",
    description: "Marca sueca nacida de la aviación, diseño único y seguridad.",
    keyThemes: ["Suecia", "Innovación", "Seguridad", "Diseño"],
    events: [{ id: "saab-autos-fund", type: "fundacion", label: "Fundación", year: 1945, confidence: "media", primaryForAffinity: true, description: "Fundación de Saab", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1945.",
  },
  // Perro
  {
    id: "opel-autos", name: "Opel", type: "brand",
    foundingYear: 1862, country: "Alemania", emoji: "⚡",
    category: "autos",
    description: "Marca alemana de autos accesibles con más de 160 años.",
    keyThemes: ["Alemán", "Tradición", "Accesibilidad", "Confiabilidad"],
    events: [{ id: "opel-autos-fund", type: "fundacion", label: "Fundación", year: 1862, confidence: "media", primaryForAffinity: true, description: "Fundación de Opel", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1862.",
  },
  // Gallo
  {
    id: "triumph-autos", name: "Triumph", type: "brand",
    foundingYear: 1885, country: "Reino Unido", emoji: "🏍️",
    category: "autos",
    description: "Marca británica de motos clásicas con legado de estilo.",
    keyThemes: ["Británico", "Clásico", "Estilo", "Motocicletas"],
    events: [{ id: "triumph-autos-fund", type: "fundacion", label: "Fundación", year: 1885, confidence: "media", primaryForAffinity: true, description: "Fundación de Triumph", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1885.",
  },
  // Gallo
  {
    id: "daimler-autos", name: "Daimler", type: "brand",
    foundingYear: 1885, country: "Alemania", emoji: "⭐",
    category: "autos",
    description: "El motor que dio origen a Mercedes-Benz y la industria.",
    keyThemes: ["Alemán", "Tradición", "Ingeniería", "Historia"],
    events: [{ id: "daimler-autos-fund", type: "fundacion", label: "Fundación", year: 1885, confidence: "media", primaryForAffinity: true, description: "Fundación de Daimler", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1885.",
  },
  // Perro
  {
    id: "alfa-romeo-autos", name: "Alfa Romeo", type: "brand",
    foundingYear: 1910, country: "Italia", emoji: "🍀",
    category: "autos",
    description: "Pasión italiana sobre ruedas, leyenda del diseño.",
    keyThemes: ["Pasión", "Italiano", "Diseño", "Deportivo"],
    events: [{ id: "alfa-romeo-autos-fund", type: "fundacion", label: "Fundación", year: 1910, confidence: "media", primaryForAffinity: true, description: "Fundación de Alfa Romeo", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1910.",
  },
  // Perro
  {
    id: "range-rover-autos", name: "Range Rover", type: "brand",
    foundingYear: 1970, country: "Reino Unido", emoji: "🚙",
    category: "autos",
    description: "El SUV de lujo original, capaz en cualquier terreno.",
    keyThemes: ["Lujo", "Capacidad", "Británico", "Aventura"],
    events: [{ id: "range-rover-autos-fund", type: "fundacion", label: "Fundación", year: 1970, confidence: "media", primaryForAffinity: true, description: "Fundación de Range Rover", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1970.",
  },
  // Perro
  {
    id: "koenigsegg-autos", name: "Koenigsegg", type: "brand",
    foundingYear: 1994, country: "Suecia", emoji: "⚡",
    category: "autos",
    description: "Hiperdeportivos suecos que rompen récords de velocidad.",
    keyThemes: ["Velocidad", "Innovación", "Suecia", "Tecnología"],
    events: [{ id: "koenigsegg-autos-fund", type: "fundacion", label: "Fundación", year: 1994, confidence: "media", primaryForAffinity: true, description: "Fundación de Koenigsegg", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1994.",
  },
  // Perro
  {
    id: "vespa-autos", name: "Vespa", type: "brand",
    foundingYear: 1946, country: "Italia", emoji: "🛵",
    category: "autos",
    description: "La scooter italiana más icónica, diseño y libertad.",
    keyThemes: ["Italiano", "Diseño", "Libertad", "Estilo"],
    events: [{ id: "vespa-autos-fund", type: "fundacion", label: "Fundación", year: 1946, confidence: "media", primaryForAffinity: true, description: "Fundación de Vespa", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1946.",
  },
  // Perro
  {
    id: "ktm-autos", name: "KTM", type: "brand",
    foundingYear: 1934, country: "Austria", emoji: "🏍️",
    category: "autos",
    description: "Fabricante austriaco de motos de enduro y calle.",
    keyThemes: ["Austria", "Deportivo", "Motocicletas", "Aventura"],
    events: [{ id: "ktm-autos-fund", type: "fundacion", label: "Fundación", year: 1934, confidence: "media", primaryForAffinity: true, description: "Fundación de KTM", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1934.",
  },
  // Cerdo
  {
    id: "chevrolet-autos", name: "Chevrolet", type: "brand",
    foundingYear: 1911, country: "Estados Unidos", emoji: "🚘",
    category: "autos",
    description: "Marca americana icónica, símbolo del sueño americano.",
    keyThemes: ["Americano", "Tradición", "Potencia", "Libertad"],
    events: [{ id: "chevrolet-autos-fund", type: "fundacion", label: "Fundación", year: 1911, confidence: "media", primaryForAffinity: true, description: "Fundación de Chevrolet", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1911.",
  },
  // Cerdo
  {
    id: "jaguar-autos", name: "Jaguar", type: "brand",
    foundingYear: 1935, country: "Reino Unido", emoji: "🐆",
    category: "autos",
    description: "Marca británica de autos de lujo con elegancia felina.",
    keyThemes: ["Lujo", "Elegancia", "Británico", "Velocidad"],
    events: [{ id: "jaguar-autos-fund", type: "fundacion", label: "Fundación", year: 1935, confidence: "media", primaryForAffinity: true, description: "Fundación de Jaguar", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1935.",
  },
  // Cerdo
  {
    id: "mini-autos", name: "Mini", type: "brand",
    foundingYear: 1959, country: "Reino Unido", emoji: "🚗",
    category: "autos",
    description: "El icónico auto británico compacto que conquistó las calles.",
    keyThemes: ["Británico", "Compacto", "Estilo", "Diversión"],
    events: [{ id: "mini-autos-fund", type: "fundacion", label: "Fundación", year: 1959, confidence: "media", primaryForAffinity: true, description: "Fundación de Mini", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1959.",
  },
  // Cerdo
  {
    id: "proton-autos", name: "Proton", type: "brand",
    foundingYear: 1983, country: "Malasia", emoji: "🚘",
    category: "autos",
    description: "El primer fabricante de autos de Malasia, industrialización.",
    keyThemes: ["Malasia", "Crecimiento", "Accesibilidad", "Industria"],
    events: [{ id: "proton-autos-fund", type: "fundacion", label: "Fundación", year: 1983, confidence: "media", primaryForAffinity: true, description: "Fundación de Proton", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1983.",
  },
  // Caballo
  {
    id: "peugeot-autos", name: "Peugeot", type: "brand",
    foundingYear: 1810, country: "Francia", emoji: "🚘",
    category: "autos",
    description: "Uno de los fabricantes más antiguos del mundo, ícono francés.",
    keyThemes: ["Tradición", "Francés", "Diseño", "Historia"],
    events: [{ id: "peugeot-autos-fund", type: "fundacion", label: "Fundación", year: 1810, confidence: "media", primaryForAffinity: true, description: "Fundación de Peugeot", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1810.",
  },
  // Buey
  {
    id: "vw-autos", name: "Volkswagen", type: "brand",
    foundingYear: 1937, country: "Alemania", emoji: "🚗",
    category: "autos",
    description: "El gigante alemán que democratizó el automóvil con el Escarabajo.",
    keyThemes: ["Confiabilidad", "Tradición", "Accesibilidad", "Ingeniería"],
    events: [{ id: "vw-autos-fund", type: "fundacion", label: "Fundación", year: 1937, confidence: "media", primaryForAffinity: true, description: "Fundación de Volkswagen", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1937.",
  },
  // Buey
  {
    id: "chery-autos", name: "Chery", type: "brand",
    foundingYear: 1997, country: "China", emoji: "🚗",
    category: "autos",
    description: "El mayor fabricante de autos de China, pionero en expansión global.",
    keyThemes: ["China", "Crecimiento", "Innovación", "Accesibilidad"],
    events: [{ id: "chery-autos-fund", type: "fundacion", label: "Fundación", year: 1997, confidence: "media", primaryForAffinity: true, description: "Fundación de Chery", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1997.",
  },
  // Serpiente
  {
    id: "ferrari-racing", name: "Scuderia Ferrari", type: "brand",
    foundingYear: 1929, country: "Italia", emoji: "🏎️",
    category: "autos",
    description: "La escudería más legendaria de la Fórmula 1.",
    keyThemes: ["Pasión", "Velocidad", "Competencia", "Historia"],
    events: [{ id: "ferrari-racing-fund", type: "fundacion", label: "Fundación", year: 1929, confidence: "media", primaryForAffinity: true, description: "Fundación de Scuderia Ferrari", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1929.",
  },
  // Caballo
  {
    id: "lancia-autos", name: "Lancia", type: "brand",
    foundingYear: 1906, country: "Italia", emoji: "🚗",
    category: "autos",
    description: "Marca italiana de autos pionera en innovación técnica y diseño.",
    keyThemes: ["Italiano", "Innovación", "Diseño", "Historia"],
    events: [{ id: "lancia-autos-fund", type: "fundacion", label: "Fundación", year: 1906, confidence: "media", primaryForAffinity: true, description: "Fundación de Lancia", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1906.",
  },
  // Perro
  {
    id: "changan-autos", name: "Changan", type: "brand",
    foundingYear: 1862, country: "China", emoji: "🚗",
    category: "autos",
    description: "El fabricante de autos más antiguo de China, con 160+ años.",
    keyThemes: ["China", "Tradición", "Crecimiento", "Innovación"],
    events: [{ id: "changan-autos-fund", type: "fundacion", label: "Fundación", year: 1862, confidence: "media", primaryForAffinity: true, description: "Fundación de Changan", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1862.",
  },
  // Cabra
  {
    id: "skoda-autos", name: "Škoda", type: "brand",
    foundingYear: 1895, country: "República Checa", emoji: "🚗",
    category: "autos",
    description: "Marca checa que empezó con bicicletas y hoy es gigante automotriz.",
    keyThemes: ["Tradición", "Accesibilidad", "Ingeniería", "Calidad"],
    events: [{ id: "skoda-autos-fund", type: "fundacion", label: "Fundación", year: 1895, confidence: "media", primaryForAffinity: true, description: "Fundación de Škoda", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1895.",
  },
  // Mono
  {
    id: "kia-autos", name: "Kia", type: "brand",
    foundingYear: 1944, country: "Corea del Sur", emoji: "🚗",
    category: "autos",
    description: "El segundo fabricante de Corea, conocido por su relación calidad-precio.",
    keyThemes: ["Corea", "Calidad", "Innovación", "Accesibilidad"],
    events: [{ id: "kia-autos-fund", type: "fundacion", label: "Fundación", year: 1944, confidence: "media", primaryForAffinity: true, description: "Fundación de Kia", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1944.",
  },
];
