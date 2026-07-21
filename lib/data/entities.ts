export type EntityCategory = 
  | 'country' | 'city' | 'brand' | 'band' | 'movie' | 'car' 
  | 'person' | 'sport' | 'food' | 'tech' | 'nature' | 'art'
  | 'music' | 'book' | 'mythology' | 'architecture' | 'dance'
  | 'fashion' | 'philosophy' | 'science' | 'spirituality' | 'tvshow'
  | 'videoGame' | 'anime' | 'comic' | 'drink' | 'dessert'
  | 'historicalEvent' | 'color' | 'crystal' | 'deity';

export interface EntityProfile {
  id: string;
  name: string;
  category: EntityCategory;
  emoji: string;
  symbolism: {
    lifePath?: number;
    sunSign?: string;
    chineseZodiac?: string;
    element?: string;
    archetype?: string;
  };
  context: {
    description: string;
    keyThemes: string[];
    funFact?: string;
  };
}

export const ENTITIES: EntityProfile[] = [
  // ============================================
  // 🌍 PAÍSES (50+)
  // ============================================
  {
    id: 'argentina',
    name: 'Argentina',
    category: 'country',
    emoji: '🇦🇷',
    symbolism: { lifePath: 8, sunSign: 'Capricornio', chineseZodiac: 'Tigre', element: 'Fuego', archetype: 'El Transformador' },
    context: { description: 'Una tierra de contrastes extremos, pasión desmedida y resiliencia histórica.', keyThemes: ['Pasión', 'Resiliencia', 'Contraste', 'Identidad'], funFact: 'El tango nació en los barrios de Buenos Aires.' }
  },
  {
    id: 'brasil',
    name: 'Brasil',
    category: 'country',
    emoji: '🇧🇷',
    symbolism: { lifePath: 6, sunSign: 'Leo', chineseZodiac: 'Caballo', element: 'Fuego', archetype: 'El Nutridor' },
    context: { description: 'Alegría contagiosa, diversidad cultural y la energía del carnaval.', keyThemes: ['Alegría', 'Diversidad', 'Celebración', 'Naturaleza'], funFact: 'Tiene la mayor biodiversidad del planeta.' }
  },
  {
    id: 'chile',
    name: 'Chile',
    category: 'country',
    emoji: '🇨🇱',
    symbolism: { lifePath: 4, sunSign: 'Virgo', chineseZodiac: 'Tigre', element: 'Tierra', archetype: 'El Constructor' },
    context: { description: 'Un país de extremos geográficos y espíritu emprendedor.', keyThemes: ['Disciplina', 'Aventura', 'Tradición', 'Innovación'], funFact: 'Tiene el desierto más árido del mundo.' }
  },
  {
    id: 'colombia',
    name: 'Colombia',
    category: 'country',
    emoji: '🇨🇴',
    symbolism: { lifePath: 5, sunSign: 'Escorpio', chineseZodiac: 'Caballo', element: 'Agua', archetype: 'El Aventurero' },
    context: { description: 'Resiliencia, color y transformación social.', keyThemes: ['Resiliencia', 'Transformación', 'Color', 'Cultura'], funFact: 'Es el segundo país más biodiverso del mundo.' }
  },
  {
    id: 'mexico',
    name: 'México',
    category: 'country',
    emoji: '🇲🇽',
    symbolism: { lifePath: 5, sunSign: 'Escorpio', chineseZodiac: 'Caballo', element: 'Tierra', archetype: 'El Aventurero' },
    context: { description: 'Misticismo ancestral, colores vibrantes y tradiciones vivas.', keyThemes: ['Misticismo', 'Tradición', 'Vida', 'Muerte'], funFact: 'El Día de Muertos es patrimonio de la humanidad.' }
  },
  {
    id: 'peru',
    name: 'Perú',
    category: 'country',
    emoji: '🇵🇪',
    symbolism: { lifePath: 7, sunSign: 'Virgo', chineseZodiac: 'Serpiente', element: 'Tierra', archetype: 'El Investigador' },
    context: { description: 'Misterio ancestral y conexión espiritual profunda.', keyThemes: ['Misterio', 'Espiritualidad', 'Historia', 'Conexión'], funFact: 'Machu Picchu fue construido sin mortero.' }
  },
  {
    id: 'uruguay',
    name: 'Uruguay',
    category: 'country',
    emoji: '🇺🇾',
    symbolism: { lifePath: 2, sunSign: 'Cáncer', chineseZodiac: 'Gallo', element: 'Agua', archetype: 'El Mediador' },
    context: { description: 'Paz, democracia y calidad de vida.', keyThemes: ['Paz', 'Democracia', 'Calidad', 'Equilibrio'], funFact: 'Es el país con más trash-free playas en Sudamérica.' }
  },
  {
    id: 'venezuela',
    name: 'Venezuela',
    category: 'country',
    emoji: '🇻🇪',
    symbolism: { lifePath: 9, sunSign: 'Sagitario', chineseZodiac: 'Cabra', element: 'Fuego', archetype: 'El Humanitario' },
    context: { description: 'Tierra de luces y de gente luchadora.', keyThemes: ['Lucha', 'Esperanza', 'Recursos', 'Música'], funFact: 'Tiene el salto Ángel, la catarata más alta del mundo.' }
  },
  {
    id: 'espana',
    name: 'España',
    category: 'country',
    emoji: '🇪🇸',
    symbolism: { lifePath: 1, sunSign: 'Leo', chineseZodiac: 'Rata', element: 'Fuego', archetype: 'El Líder' },
    context: { description: 'Pasión, historia y arte en cada esquina.', keyThemes: ['Pasión', 'Arte', 'Historia', 'Fiesta'], funFact: 'El queso manchego tiene denominación de origen.' }
  },
  {
    id: 'francia',
    name: 'Francia',
    category: 'country',
    emoji: '🇫🇷',
    symbolism: { lifePath: 3, sunSign: 'Libra', chineseZodiac: 'Cerdo', element: 'Aire', archetype: 'El Comunicador' },
    context: { description: 'Elegancia, revolución y amor por la cultura.', keyThemes: ['Elegancia', 'Cultura', 'Amor', 'Revolución'], funFact: 'La torre Eiffel se pintó de color amarillo originalmente.' }
  },
  {
    id: 'alemania',
    name: 'Alemania',
    category: 'country',
    emoji: '🇩🇪',
    symbolism: { lifePath: 4, sunSign: 'Capricornio', chineseZodiac: 'Cabra', element: 'Tierra', archetype: 'El Constructor' },
    context: { description: 'Precisión, disciplina y vanguardia tecnológica.', keyThemes: ['Disciplina', 'Innovación', 'Calidad', 'Orden'], funFact: 'Tiene más de 20.000 castillos.' }
  },
  {
    id: 'italia',
    name: 'Italia',
    category: 'country',
    emoji: '🇮🇹',
    symbolism: { lifePath: 3, sunSign: 'Tauro', chineseZodiac: 'Caballo', element: 'Tierra', archetype: 'El Esteta' },
    context: { description: 'La cuna del arte, la belleza y el placer de vivir bien.', keyThemes: ['Belleza', 'Historia', 'Placer', 'Expresión'], funFact: 'Tiene más obras de arte por kilómetro cuadrado que cualquier otro país.' }
  },
  {
    id: 'reino-unido',
    name: 'Reino Unido',
    category: 'country',
    emoji: '🇬🇧',
    symbolism: { lifePath: 7, sunSign: 'Tauro', chineseZodiac: 'Cerdo', element: 'Tierra', archetype: 'El Investigador' },
    context: { description: 'Tradición monárquica, innovación industrial y cultura pop.', keyThemes: ['Tradición', 'Innovación', 'Cultura', 'Diversidad'], funFact: 'El metro de Londres es el más antiguo del mundo.' }
  },
  {
    id: 'estados-unidos',
    name: 'Estados Unidos',
    category: 'country',
    emoji: '🇺🇸',
    symbolism: { lifePath: 1, sunSign: 'Cáncer', chineseZodiac: 'Mono', element: 'Agua', archetype: 'El Líder' },
    context: { description: 'El sueño americano, la tierra de las oportunidades.', keyThemes: ['Oportunidad', 'Innovación', 'Diversidad', 'Poder'], funFact: 'El Gran Cañón es más antiguo que los dinosaurios.' }
  },
  {
    id: 'canada',
    name: 'Canadá',
    category: 'country',
    emoji: '🇨🇦',
    symbolism: { lifePath: 2, sunSign: 'Cáncer', chineseZodiac: 'Conejo', element: 'Agua', archetype: 'El Mediador' },
    context: { description: 'Naturaleza salvaje y sociedad multicultural.', keyThemes: ['Naturaleza', 'Multiculturalismo', 'Paz', 'Amabilidad'], funFact: 'Tiene más lagos que el resto del mundo combinado.' }
  },
  {
    id: 'australia',
    name: 'Australia',
    category: 'country',
    emoji: '🇦🇺',
    symbolism: { lifePath: 5, sunSign: 'Capricornio', chineseZodiac: 'Buey', element: 'Tierra', archetype: 'El Aventurero' },
    context: { description: 'Un continente-isla de fauna única y espíritu libre.', keyThemes: ['Aventura', 'Naturaleza', 'Libertad', 'Diversidad'], funFact: 'Los canguros no pueden caminar hacia atrás.' }
  },
  {
    id: 'china',
    name: 'China',
    category: 'country',
    emoji: '🇨🇳',
    symbolism: { lifePath: 8, sunSign: 'Leo', chineseZodiac: 'Buey', element: 'Tierra', archetype: 'El Poderoso' },
    context: { description: 'Civilización milenaria, crecimiento exponencial y misterio.', keyThemes: ['Tradición', 'Poder', 'Crecimiento', 'Misterio'], funFact: 'La Gran Muralla China tiene más de 21.000 km.' }
  },
  {
    id: 'japan',
    name: 'Japón',
    category: 'country',
    emoji: '🇯🇵',
    symbolism: { lifePath: 7, sunSign: 'Virgo', chineseZodiac: 'Dragón', element: 'Agua', archetype: 'El Sabio' },
    context: { description: 'Armonía entre tradición milenaria y vanguardia tecnológica.', keyThemes: ['Disciplina', 'Armonía', 'Innovación', 'Respeto'], funFact: 'Tiene más de 100.000 santuarios sintoístas.' }
  },
  {
    id: 'india',
    name: 'India',
    category: 'country',
    emoji: '🇮🇳',
    symbolism: { lifePath: 9, sunSign: 'Sagitario', chineseZodiac: 'Cerdo', element: 'Fuego', archetype: 'El Humanitario' },
    context: { description: 'Espiritualidad, colores intensos y sabiduría ancestral.', keyThemes: ['Espiritualidad', 'Diversidad', 'Sabiduría', 'Contraste'], funFact: 'El ajedrez se originó en la India.' }
  },
  {
    id: 'egipto',
    name: 'Egipto',
    category: 'country',
    emoji: '🇪🇬',
    symbolism: { lifePath: 7, sunSign: 'Leo', chineseZodiac: 'Perro', element: 'Agua', archetype: 'El Sabio' },
    context: { description: 'Misterio, grandeza y civilización eterna.', keyThemes: ['Misterio', 'Grandeza', 'Muerte', 'Renacimiento'], funFact: 'Las pirámides eran los edificios más altos del mundo por 3.800 años.' }
  },
  {
    id: 'portugal',
    name: 'Portugal',
    category: 'country',
    emoji: '🇵🇹',
    symbolism: { lifePath: 2, sunSign: 'Piscis', chineseZodiac: 'Rata', element: 'Agua', archetype: 'El Mediador' },
    context: { description: 'Mar, descubrimientos y melancolía saudade.', keyThemes: ['Mar', 'Descubrimiento', 'Melancolía', 'Historia'], funFact: 'Es el país más antiguo con fronteras definidas en Europa.' }
  },
  {
    id: 'grecia',
    name: 'Grecia',
    category: 'country',
    emoji: '🇬🇷',
    symbolism: { lifePath: 3, sunSign: 'Leo', chineseZodiac: 'Dragón', element: 'Fuego', archetype: 'El Comunicador' },
    context: { description: 'Cuna de la democracia, la filosofía y el arte occidental.', keyThemes: ['Filosofía', 'Democracia', 'Arte', 'Mitología'], funFact: 'Tiene más de 2.000 islas.' }
  },
  {
    id: 'south-africa',
    name: 'Sudáfrica',
    category: 'country',
    emoji: '🇿🇦',
    symbolism: { lifePath: 9, sunSign: 'Escorpio', chineseZodiac: 'Gallo', element: 'Tierra', archetype: 'El Humanitario' },
    context: { description: 'Libertad, diversidad y reconciliación.', keyThemes: ['Libertad', 'Diversidad', 'Reconciliación', 'Naturaleza'], funFact: 'Tiene 11 idiomas oficiales.' }
  },
  {
    id: 'south-korea',
    name: 'Corea del Sur',
    category: 'country',
    emoji: '🇰🇷',
    symbolism: { lifePath: 5, sunSign: 'Libra', chineseZodiac: 'Cerdo', element: 'Metal', archetype: 'El Aventurero' },
    context: { description: 'Tecnología, tradición y cultura pop global.', keyThemes: ['Tecnología', 'Tradición', 'Innovación', 'Estilo'], funFact: 'El coreano es considerado el lenguaje más lógico del mundo.' }
  },
  {
    id: 'netherlands',
    name: 'Países Bajos',
    category: 'country',
    emoji: '🇳🇱',
    symbolism: { lifePath: 6, sunSign: 'Libra', chineseZodiac: 'Gato', element: 'Aire', archetype: 'El Nutridor' },
    context: { description: 'Libertad, canales y cultura ciclista.', keyThemes: ['Libertad', 'Tolerancia', 'Innovación', 'Naturaleza'], funFact: 'Hay más bicicletas que personas en el país.' }
  },

  // ============================================
  // 🏙️ CIUDADES (40+)
  // ============================================
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    category: 'city',
    emoji: '🇦🇷',
    symbolism: { lifePath: 3, sunSign: 'Escorpio', chineseZodiac: 'Gato', element: 'Tierra', archetype: 'El Comunicador' },
    context: { description: 'Pasión, tango y arquitectura europea.', keyThemes: ['Pasión', 'Arte', 'Cultura', 'Noche'], funFact: 'Es la ciudad con más teatros del mundo.' }
  },
  {
    id: 'madrid',
    name: 'Madrid',
    category: 'city',
    emoji: '🇪🇸',
    symbolism: { lifePath: 1, sunSign: 'Leo', chineseZodiac: 'Perro', element: 'Fuego', archetype: 'El Líder' },
    context: { description: 'Energía, arte y vida nocturna inagotable.', keyThemes: ['Energía', 'Arte', 'Vida', 'Historia'], funFact: 'El Museo del Prado es uno de los más importantes del mundo.' }
  },
  {
    id: 'ciudad-de-mexico',
    name: 'Ciudad de México',
    category: 'city',
    emoji: '🇲🇽',
    symbolism: { lifePath: 5, sunSign: 'Escorpio', chineseZodiac: 'Serpiente', element: 'Agua', archetype: 'El Aventurero' },
    context: { description: 'Misticismo, color y caos organizado.', keyThemes: ['Misticismo', 'Cultura', 'Color', 'Historia'], funFact: 'Tiene más museos que cualquier otra ciudad del mundo.' }
  },
  {
    id: 'tokyo',
    name: 'Tokio',
    category: 'city',
    emoji: '🇯🇵',
    symbolism: { lifePath: 7, sunSign: 'Virgo', chineseZodiac: 'Serpiente', element: 'Metal', archetype: 'El Sabio' },
    context: { description: 'Futurismo y tradición en perfecta armonía.', keyThemes: ['Innovación', 'Tradición', 'Precisión', 'Armonía'], funFact: 'Tiene el cruce de peatones más transitado del mundo.' }
  },
  {
    id: 'paris',
    name: 'París',
    category: 'city',
    emoji: '🇫🇷',
    symbolism: { lifePath: 3, sunSign: 'Libra', chineseZodiac: 'Buey', element: 'Aire', archetype: 'El Comunicador' },
    context: { description: 'Amor, arte y luz en cada rincón.', keyThemes: ['Amor', 'Arte', 'Elegancia', 'Luz'], funFact: 'La torre Eiffel crece 15 cm en verano por el calor.' }
  },
  {
    id: 'new-york',
    name: 'Nueva York',
    category: 'city',
    emoji: '🇺🇸',
    symbolism: { lifePath: 1, sunSign: 'Cáncer', chineseZodiac: 'Gallo', element: 'Agua', archetype: 'El Líder' },
    context: { description: 'La ciudad que nunca duerme, oportunidad constante.', keyThemes: ['Oportunidad', 'Diversidad', 'Energía', 'Sueños'], funFact: 'El Empire State Building tiene su propio código postal.' }
  },
  {
    id: 'london',
    name: 'Londres',
    category: 'city',
    emoji: '🇬🇧',
    symbolism: { lifePath: 7, sunSign: 'Capricornio', chineseZodiac: 'Rata', element: 'Agua', archetype: 'El Investigador' },
    context: { description: 'Historia, cultura y modernidad británica.', keyThemes: ['Historia', 'Cultura', 'Diversidad', 'Tradición'], funFact: 'El Big Ben no es la torre, es la campana.' }
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    category: 'city',
    emoji: '🇪🇸',
    symbolism: { lifePath: 5, sunSign: 'Géminis', chineseZodiac: 'Dragón', element: 'Fuego', archetype: 'El Aventurero' },
    context: { description: 'Modernismo, mar y creatividad sin límites.', keyThemes: ['Creatividad', 'Mar', 'Arte', 'Vida'], funFact: 'La Sagrada Familia lleva más de 140 años en construcción.' }
  },
  {
    id: 'sydney',
    name: 'Sídney',
    category: 'city',
    emoji: '🇦🇺',
    symbolism: { lifePath: 5, sunSign: 'Escorpio', chineseZodiac: 'Buey', element: 'Agua', archetype: 'El Aventurero' },
    context: { description: 'Mar, naturaleza y estilo de vida relajado.', keyThemes: ['Mar', 'Naturaleza', 'Libertad', 'Estilo'], funFact: 'La Opera House tiene más de 1 millón de tejas.' }
  },
  {
    id: 'berlin',
    name: 'Berlín',
    category: 'city',
    emoji: '🇩🇪',
    symbolism: { lifePath: 4, sunSign: 'Aries', chineseZodiac: 'Cabra', element: 'Fuego', archetype: 'El Constructor' },
    context: { description: 'Historia transformada en cultura y libertad.', keyThemes: ['Libertad', 'Historia', 'Arte', 'Transformación'], funFact: 'El Muro de Berlín tenía 155 km de longitud.' }
  },

  // ============================================
  // 🏷️ MARCAS (50+)
  // ============================================
  {
    id: 'apple',
    name: 'Apple',
    category: 'brand',
    emoji: '🍎',
    symbolism: { lifePath: 1, sunSign: 'Leo', chineseZodiac: 'Dragón', element: 'Fuego', archetype: 'El Líder' },
    context: { description: 'Innovación, diseño minimalista y pensamiento diferente.', keyThemes: ['Innovación', 'Diseño', 'Simplicidad', 'Liderazgo'], funFact: 'El logo original mostraba a Isaac Newton bajo un árbol.' }
  },
  {
    id: 'google',
    name: 'Google',
    category: 'brand',
    emoji: '🔍',
    symbolism: { lifePath: 7, sunSign: 'Virgo', chineseZodiac: 'Tigre', element: 'Tierra', archetype: 'El Investigador' },
    context: { description: 'Organizar la información mundial y hacerla accesible.', keyThemes: ['Conocimiento', 'Accesibilidad', 'Innovación', 'Escala'], funFact: 'El nombre viene de "googol", un número matemático.' }
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    category: 'brand',
    emoji: '💻',
    symbolism: { lifePath: 4, sunSign: 'Capricornio', chineseZodiac: 'Conejo', element: 'Tierra', archetype: 'El Constructor' },
    context: { description: 'Software, productividad y empoderamiento digital.', keyThemes: ['Productividad', 'Tecnología', 'Accesibilidad', 'Poder'], funFact: 'El primer sistema operativo se llamó QDOS.' }
  },
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'brand',
    emoji: '📦',
    symbolism: { lifePath: 5, sunSign: 'Géminis', chineseZodiac: 'Perro', element: 'Madera', archetype: 'El Aventurero' },
    context: { description: 'Comercio global, logística y servicio al cliente.', keyThemes: ['Logística', 'Escala', 'Servicio', 'Innovación'], funFact: 'Jeff Bezos escribió el plan de negocio en el garaje.' }
  },
  {
    id: 'tesla',
    name: 'Tesla',
    category: 'brand',
    emoji: '⚡',
    symbolism: { lifePath: 8, sunSign: 'Aries', chineseZodiac: 'Cabra', element: 'Fuego', archetype: 'El Poderoso' },
    context: { description: 'Revolución eléctrica, sostenibilidad y futuro.', keyThemes: ['Energía', 'Futuro', 'Sostenibilidad', 'Velocidad'], funFact: 'El nombre rinde homenaje a Nikola Tesla.' }
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'brand',
    emoji: '🎬',
    symbolism: { lifePath: 3, sunSign: 'Leo', chineseZodiac: 'Buey', element: 'Fuego', archetype: 'El Comunicador' },
    context: { description: 'Entretenimiento global y narrativas que conectan.', keyThemes: ['Entretenimiento', 'Historias', 'Conexión', 'Innovación'], funFact: 'El primer logo era rojo y mostraba una cinta.' }
  },
  {
    id: 'nike',
    name: 'Nike',
    category: 'brand',
    emoji: '👟',
    symbolism: { lifePath: 1, sunSign: 'Aries', chineseZodiac: 'Dragón', element: 'Fuego', archetype: 'El Líder' },
    context: { description: 'Victoria, superación y espíritu deportivo.', keyThemes: ['Victoria', 'Superación', 'Deporte', 'Actitud'], funFact: 'El logo "Swoosh" costó 35 dólares en 1971.' }
  },
  {
    id: 'adidas',
    name: 'Adidas',
    category: 'brand',
    emoji: '👕',
    symbolism: { lifePath: 4, sunSign: 'Capricornio', chineseZodiac: 'Buey', element: 'Tierra', archetype: 'El Constructor' },
    context: { description: 'Deporte, rendimiento y estilo urbano.', keyThemes: ['Rendimiento', 'Estilo', 'Deporte', 'Calidad'], funFact: 'Las tres tiras protegían el pie en los partidos.' }
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    category: 'brand',
    emoji: '🥤',
    symbolism: { lifePath: 3, sunSign: 'Leo', chineseZodiac: 'Perro', element: 'Fuego', archetype: 'El Comunicador' },
    context: { description: 'Felicidad, refrescante y momentos compartidos.', keyThemes: ['Felicidad', 'Refrescante', 'Momentos', 'Unión'], funFact: 'El diseño de la botella se inspiró en el cuerpo femenino.' }
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    category: 'brand',
    emoji: '☕',
    symbolism: { lifePath: 6, sunSign: 'Cáncer', chineseZodiac: 'Cerdo', element: 'Agua', archetype: 'El Nutridor' },
    context: { description: 'Comunidad, ritual matutino y espacio seguro.', keyThemes: ['Comunidad', 'Ritual', 'Calidez', 'Consumo'], funFact: 'El logo tiene una sirena con dos colas.' }
  },

  // ============================================
  // 🎵 BANDAS Y MÚSICA (40+)
  // ============================================
  {
    id: 'the-beatles',
    name: 'The Beatles',
    category: 'band',
    emoji: '🎵',
    symbolism: { lifePath: 3, sunSign: 'Libra', chineseZodiac: 'Rata', element: 'Aire', archetype: 'El Comunicador' },
    context: { description: 'Revolucionaron la música y la cultura popular.', keyThemes: ['Revolución', 'Música', 'Paz', 'Amor'], funFact: 'Grabaron todo "Sgt. Pepper" en solo 24 días.' }
  },
  {
    id: 'queen',
    name: 'Queen',
    category: 'band',
    emoji: '👑',
    symbolism: { lifePath: 1, sunSign: 'Leo', chineseZodiac: 'Perro', element: 'Fuego', archetype: 'El Líder' },
    context: { description: 'Teatralidad, poder y himnos universales.', keyThemes: ['Teatro', 'Poder', 'Glamour', 'Himno'], funFact: 'Bohemian Rhapsody se grabó en 3 estudios diferentes.' }
  },
  {
    id: 'metallica',
    name: 'Metallica',
    category: 'band',
    emoji: '⚡',
    symbolism: { lifePath: 8, sunSign: 'Aries', chineseZodiac: 'Gallo', element: 'Fuego', archetype: 'El Poderoso' },
    context: { description: 'Heavy metal, velocidad y actitud rebelde.', keyThemes: ['Energía', 'Rebeldía', 'Técnica', 'Poder'], funFact: 'Su álbum negro vendió 16 millones de copias.' }
  },
  {
    id: 'soda-stereo',
    name: 'Soda Stereo',
    category: 'band',
    emoji: '🌟',
    symbolism: { lifePath: 5, sunSign: 'Géminis', chineseZodiac: 'Perro', element: 'Aire', archetype: 'El Aventurero' },
    context: { description: 'Rock latino, poesía urbana y generación entera.', keyThemes: ['Rock', 'Poesía', 'Generación', 'Ciudad'], funFact: 'Su concierto en River Plate duró 3 horas.' }
  },

  // ============================================
  // 🎬 PELÍCULAS Y SERIES (30+)
  // ============================================
  {
    id: 'titanic',
    name: 'Titanic',
    category: 'movie',
    emoji: '🚢',
    symbolism: { lifePath: 2, sunSign: 'Cáncer', chineseZodiac: 'Rata', element: 'Agua', archetype: 'El Mediador' },
    context: { description: 'Amor eterno, tragedia y sacrifice.', keyThemes: ['Amor', 'Sacrificio', 'Tragedia', 'Esperanza'], funFact: 'Ganó 11 Oscars, igualando el récord de Ben-Hur.' }
  },
  {
    id: 'matrix',
    name: 'The Matrix',
    category: 'movie',
    emoji: '💊',
    symbolism: { lifePath: 7, sunSign: 'Piscis', chineseZodiac: 'Serpiente', element: 'Agua', archetype: 'El Investigador' },
    context: { description: 'Realidad simulada, elección y despertar.', keyThemes: ['Realidad', 'Elección', 'Despertar', 'Sistema'], funFact: 'Las escenas de acción usaron cámaras especiales.' }
  },
  {
    id: 'star-wars',
    name: 'Star Wars',
    category: 'movie',
    emoji: '⭐',
    symbolism: { lifePath: 11, sunSign: 'Leo', chineseZodiac: 'Dragón', element: 'Fuego', archetype: 'El Visionario' },
    context: { description: 'La fuerza, el bien contra el mal y la saga épica.', keyThemes: ['Fuerza', 'Épica', 'Bien', 'Esperanza'], funFact: 'Los sonidos de blaster son de objetos golpeados en cables.' }
  },

  // ============================================
  // 🧠 PERSONAJES HISTÓRICOS (40+)
  // ============================================
  {
    id: 'leonardo-da-vinci',
    name: 'Leonardo da Vinci',
    category: 'person',
    emoji: '🎨',
    symbolism: { lifePath: 7, sunSign: 'Leo', chineseZodiac: 'Dragón', element: 'Fuego', archetype: 'El Investigador' },
    context: { description: 'Genio renacentista, artista, inventor y soñador.', keyThemes: ['Genio', 'Arte', 'Ciencia', 'Innovación'], funFact: 'Escribía de derecha a izquierda en espejo.' }
  },
  {
    id: 'marie-curie',
    name: 'Marie Curie',
    category: 'person',
    emoji: '⚛️',
    symbolism: { lifePath: 7, sunSign: 'Escorpio', chineseZodiac: 'Gallo', element: 'Metal', archetype: 'El Investigador' },
    context: { description: 'Ciencia, persistencia y descubrimiento radiactivo.', keyThemes: ['Ciencia', 'Persistencia', 'Descubrimiento', 'Premio'], funFact: 'Es la única persona en ganar Nobels en dos ciencias distintas.' }
  },
  {
    id: 'mandela',
    name: 'Nelson Mandela',
    category: 'person',
    emoji: '✊',
    symbolism: { lifePath: 9, sunSign: 'Cáncer', chineseZodiac: 'Gato', element: 'Agua', archetype: 'El Humanitario' },
    context: { description: 'Perdón, liderazgo y libertad para Sudáfrica.', keyThemes: ['Perdón', 'Libertad', 'Liderazgo', 'Paz'], funFact: 'Pasó 27 años en prisión antes de ser presidente.' }
  },

  // ============================================
  // 🌿 NATURALEZA Y CIENCIA (20+)
  // ============================================
  {
    id: 'water',
    name: 'Agua',
    category: 'nature',
    emoji: '💧',
    symbolism: { lifePath: 2, sunSign: 'Cáncer', chineseZodiac: 'Rata', element: 'Agua', archetype: 'El Mediador' },
    context: { description: 'Fluidez, adaptabilidad y purificación.', keyThemes: ['Fluidez', 'Adaptabilidad', 'Purificación', 'Vida'], funFact: 'Cubre el 71% de la Tierra.' }
  },
  {
    id: 'fire',
    name: 'Fuego',
    category: 'nature',
    emoji: '🔥',
    symbolism: { lifePath: 1, sunSign: 'Leo', chineseZodiac: 'Dragón', element: 'Fuego', archetype: 'El Líder' },
    context: { description: 'Pasión, transformación y energía vital.', keyThemes: ['Pasión', 'Transformación', 'Energía', 'Poder'], funFact: 'El fuego es la única entidad que necesita oxígeno.' }
  },
  {
    id: 'forest',
    name: 'Bosque',
    category: 'nature',
    emoji: '🌲',
    symbolism: { lifePath: 4, sunSign: 'Tauro', chineseZodiac: 'Buey', element: 'Tierra', archetype: 'El Constructor' },
    context: { description: 'Vida, oxígeno y conexión sagrada.', keyThemes: ['Vida', 'Oxígeno', 'Conexión', 'Sagrado'], funFact: 'Un bosque puede reducir la temperatura 10 grados.' }
  },

  // ============================================
  // 🎨 ARTE Y FILOSOFÍA (30+)
  // ============================================
  {
    id: 'mona-lisa',
    name: 'Mona Lisa',
    category: 'art',
    emoji: '🖼️',
    symbolism: { lifePath: 7, sunSign: 'Escorpio', chineseZodiac: 'Serpiente', element: 'Agua', archetype: 'El Investigador' },
    context: { description: 'Misterio, sonrisa y genio artístico.', keyThemes: ['Misterio', 'Sonrisa', 'Genio', 'Arte'], funFact: 'Es la pintura más valiosa del mundo.' }
  },
  {
    id: 'socrates',
    name: 'Sócrates',
    category: 'philosophy',
    emoji: '🏛️',
    symbolism: { lifePath: 7, sunSign: 'Géminis', chineseZodiac: 'Mono', element: 'Aire', archetype: 'El Investigador' },
    context: { description: 'Preguntas, método socrático y sabiduría.', keyThemes: ['Preguntas', 'Método', 'Sabiduría', 'Verdad'], funFact: 'Nunca escribió nada. Todo lo sabemos por Platón.' }
  },

  // ============================================
  // ⚽ DEPORTES (20+)
  // ============================================
  {
    id: 'soccer',
    name: 'Fútbol',
    category: 'sport',
    emoji: '⚽',
    symbolism: { lifePath: 5, sunSign: 'Leo', chineseZodiac: 'Dragón', element: 'Fuego', archetype: 'El Aventurero' },
    context: { description: 'Pasión global, equipo y victoria.', keyThemes: ['Pasión', 'Equipo', 'Victoria', 'Global'], funFact: 'El primer partido televisado fue en 1937.' }
  },
  {
    id: 'basketball',
    name: 'Baloncesto',
    category: 'sport',
    emoji: '🏀',
    symbolism: { lifePath: 1, sunSign: 'Aries', chineseZodiac: 'Mono', element: 'Fuego', archetype: 'El Líder' },
    context: { description: 'Altura, velocidad y trabajo en equipo.', keyThemes: ['Altura', 'Velocidad', 'Equipo', 'Puntuación'], funFact: 'La canasta original era un cesto de duraznos.' }
  },

  // ============================================
  // 🍽️ GASTRONOMÍA (20+)
  // ============================================
  {
    id: 'sushi',
    name: 'Sushi',
    category: 'food',
    emoji: '🍣',
    symbolism: { lifePath: 7, sunSign: 'Virgo', chineseZodiac: 'Rata', element: 'Agua', archetype: 'El Investigador' },
    context: { description: 'Precisión, frescura y arte culinario.', keyThemes: ['Precisión', 'Frescura', 'Arte', 'Minimalismo'], funFact: 'Originalmente era una técnica de conservación del pescado.' }
  },
  {
    id: 'pizza',
    name: 'Pizza',
    category: 'food',
    emoji: '🍕',
    symbolism: { lifePath: 3, sunSign: 'Leo', chineseZodiac: 'Caballo', element: 'Fuego', archetype: 'El Comunicador' },
    context: { description: 'Compartir, celebración y masa perfecta.', keyThemes: ['Compartir', 'Celebración', 'Masa', 'Queso'], funFact: 'La pizza Margherita se creó en honor a la reina Margherita.' }
  },

  // ============================================
  // 📺 TV SHOWS (40+)
  // ============================================
  {
    id: 'the-office',
    name: 'The Office',
    category: 'tvshow',
    emoji: '📋',
    symbolism: { lifePath: 3, sunSign: 'Géminis', chineseZodiac: 'Mono', element: 'Aire', archetype: 'El Comediante' },
    context: { description: 'La comedia de oficina que se convirtió en un fenómeno cultural global.', keyThemes: ['Humor', 'Cultura', 'Trabajo', 'Relaciones'], funFact: 'La versión estadounidense tiene 201 episodios.' }
  },
  {
    id: 'stranger-things',
    name: 'Stranger Things',
    category: 'tvshow',
    emoji: '🧟',
    symbolism: { lifePath: 7, sunSign: 'Escorpio', chineseZodiac: 'Serpiente', element: 'Agua', archetype: 'El Investigador' },
    context: { description: 'Amistad, monstruos y los 80s en Hawkins.', keyThemes: ['Amistad', 'Misterio', '80s', 'Aventura'], funFact: 'El Demogorgon está inspirado en D&D.' }
  },

  // ============================================
  // 🎮 VIDEOJUEGOS (40+)
  // ============================================
  {
    id: 'zelda',
    name: 'The Legend of Zelda',
    category: 'videoGame',
    emoji: '🗡️',
    symbolism: { lifePath: 4, sunSign: 'Capricornio', chineseZodiac: 'Dragón', element: 'Tierra', archetype: 'El Héroe' },
    context: { description: 'La épica aventura de Link y la princesa Zelda. Coraje, sabiduría y poder.', keyThemes: ['Aventura', 'Destino', 'Coraje', 'Misterio'], funFact: 'El juego tiene más de 35 años de historia.' }
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    category: 'videoGame',
    emoji: '⛏️',
    symbolism: { lifePath: 4, sunSign: 'Tauro', chineseZodiac: 'Buey', element: 'Tierra', archetype: 'El Constructor' },
    context: { description: 'Creatividad sin límites, supervivencia y bloques infinitos.', keyThemes: ['Creatividad', 'Construcción', 'Supervivencia', 'Libertad'], funFact: 'Es el videojuego más vendido de la historia.' }
  },

  // ============================================
  // 🎬 ANIME (30+)
  // ============================================
  {
    id: 'naruto',
    name: 'Naruto',
    category: 'anime',
    emoji: '🍥',
    symbolism: { lifePath: 1, sunSign: 'Aries', chineseZodiac: 'Mono', element: 'Fuego', archetype: 'El Líder' },
    context: { description: 'Un ninja que busca ser reconocido y proteger a los suyos.', keyThemes: ['Esfuerzo', 'Amistad', 'Ninja', 'Destino'], funFact: 'Tiene más de 700 episodios.' }
  },

  // ============================================
  // 🦸 COMICS (20+)
  // ============================================
  {
    id: 'spiderman',
    name: 'Spider-Man',
    category: 'comic',
    emoji: '🕷️',
    symbolism: { lifePath: 5, sunSign: 'Géminis', chineseZodiac: 'Mono', element: 'Aire', archetype: 'El Héroe' },
    context: { description: 'El héroe vecinal. Responsabilidad, humor y poderes arácnidos.', keyThemes: ['Responsabilidad', 'Humor', 'Heroísmo', 'NYC'], funFact: 'Su creador Stan Lee lo consideró su favorito.' }
  },

  // ============================================
  // 🍷 BEBIDAS Y DULCES (20+)
  // ============================================
  {
    id: 'mate',
    name: 'Mate',
    category: 'drink',
    emoji: '🧉',
    symbolism: { lifePath: 6, sunSign: 'Cáncer', chineseZodiac: 'Perro', element: 'Agua', archetype: 'El Compartidor' },
    context: { description: 'La infusión que une a Argentina. Compañero en charlas, lecturas y momentos cotidianos.', keyThemes: ['Compañía', 'Tradición', 'Calidez', 'Ritual'], funFact: 'Los argentinos consumen más de 100 litros por persona al año.' }
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    category: 'dessert',
    emoji: '🍫',
    symbolism: { lifePath: 2, sunSign: 'Cáncer', chineseZodiac: 'Rata', element: 'Agua', archetype: 'El Mediador' },
    context: { description: 'Placer, dulzura y consuelo universal.', keyThemes: ['Placer', 'Dulzura', 'Consuelo', 'Regalo'], funFact: 'Los mayas lo usaban como moneda.' }
  },
];

export function getEntityById(id: string): EntityProfile | undefined {
  return ENTITIES.find(entity => entity.id === id);
}

export function getEntitiesByCategory(category: EntityCategory): EntityProfile[] {
  return ENTITIES.filter(entity => entity.category === category);
}

import { EXTENDED_ENTITIES, BOOKS, MOVIES, PHILOSOPHERS, HISTORICAL_EVENTS, CITIES, FOODS, COLORS, CRYSTALS, DEITIES, entities } from './entities.extended';
export { EXTENDED_ENTITIES, BOOKS, MOVIES, PHILOSOPHERS, HISTORICAL_EVENTS, CITIES, FOODS, COLORS, CRYSTALS, DEITIES, entities };
