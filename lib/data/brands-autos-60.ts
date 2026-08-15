import type { AtlasEntityInput } from "@/types/atlas";

export const BRANDS_AUTOS_60: AtlasEntityInput[] = [
  // Rata
  {
    id: "dodge-autos", name: "Dodge", type: "brand",
    country: "Estados Unidos", emoji: "🚙",
    category: "autos",
    description: "La voz rugiente de Detroit, Dodge moldea la rebeldía americana en muscle cars y camionetas que no piden permiso en la carretera.",
    keyThemes: ["Potencia", "Muscle", "Americano", "Durabilidad"],
    events: [{ id: "dodge-autos-fund", type: "fundacion", label: "Fundación", year: 1900, confidence: "media", primaryForAffinity: true, description: "Los hermanos John y Horace Dodge la fundaron en Detroit fabricando piezas para Ford antes de lanzar su primer auto en 1914.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1900.",
  },
  // Rata
  {
    id: "mg-autos", name: "MG", type: "brand",
    country: "Reino Unido", emoji: "🚗",
    category: "autos",
    description: "Nacida en los talleres de Morris Garages, MG hizo del roadster británico un lujo accesible y hoy renace enchufada a la electricidad.",
    keyThemes: ["Británico", "Deportivo", "Clásico", "Accesible"],
    events: [{ id: "mg-autos-fund", type: "fundacion", label: "Fundación", year: 1924, confidence: "media", primaryForAffinity: true, description: "Nació como Morris Garages, cuando Cecil Kimber convirtió autos Morris de serie en deportivos accesibles de dos plazas.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1924.",
  },
  // Rata
  {
    id: "land-rover-autos", name: "Land Rover", type: "brand",
    country: "Reino Unido", emoji: "🚙",
    category: "autos",
    description: "Forjado en las granjas de posguerra para cruzar donde otros se rinden, Land Rover convirtió la aventura británica en máquina infatigable.",
    keyThemes: ["Aventura", "Británico", "Capacidad", "Exploración"],
    events: [{ id: "land-rover-autos-fund", type: "fundacion", label: "Fundación", year: 1948, confidence: "media", primaryForAffinity: true, description: "Los hermanos Wilks, inspirados en un Jeep de posguerra, idearon en su granja un todoterreno para trabajo agrícola.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1948.",
  },
  // Rata
  {
    id: "honda-motor-autos", name: "Honda Motor", type: "brand",
    country: "Japón", emoji: "🏍️",
    category: "autos",
    description: "De motorizar bicicletas con excedentes de guerra a dominar el mundo, Honda convirtió la ingeniería japonesa en pura obstinación y genio.",
    keyThemes: ["Japón", "Innovación", "Motocicletas", "Confiabilidad"],
    events: [{ id: "honda-motor-autos-fund", type: "fundacion", label: "Fundación", year: 1948, confidence: "media", primaryForAffinity: true, description: "Soichiro Honda, un mecánico autodidacta, fundó la empresa en Hamamatsu motorizando bicicletas con motores de excedentes de guerra.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1948.",
  },
  // Cerdo
  {
    id: "fiat-1899-autos", name: "Fiat", type: "brand",
    country: "Italia", emoji: "🚗",
    category: "autos",
    description: "Nacida en Turín para poner a Italia en movimiento, Fiat hizo del auto pequeño un lienzo de diseño que cabía en cada callejón.",
    keyThemes: ["Italiano", "Compacto", "Diseño", "Accesibilidad"],
    events: [{ id: "fiat-1899-autos-fund", type: "fundacion", label: "Fundación", year: 1899, confidence: "media", primaryForAffinity: true, description: "Turín fue cuna de la 'Fabbrica Italiana Automobili Torino', que debutó con el pequeño Fiat 4 HP en 1899.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1899.",
  },
  // Buey
  {
    id: "gmc-autos", name: "GMC", type: "brand",
    country: "Estados Unidos", emoji: "🚛",
    category: "autos",
    description: "Del taller pionero de camiones de Max Grabowski al corazón de la autopista, GMC es la fuerza americana hecha capacidad y músculo.",
    keyThemes: ["Americano", "Capacidad", "Durabilidad", "Potencia"],
    events: [{ id: "gmc-autos-fund", type: "fundacion", label: "Fundación", year: 1901, confidence: "media", primaryForAffinity: true, description: "Su origen fue la Rapid Motor Vehicle Company de Max Grabowski en Pontiac, pionera de los camiones estadounidenses.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1901.",
  },
  // Buey
  {
    id: "aston-martin-autos", name: "Aston Martin", type: "brand",
    country: "Reino Unido", emoji: "007",
    category: "autos",
    description: "El auto de James Bond, lujo británico con alma deportiva.",
    keyThemes: ["Lujo", "Británico", "Elegancia", "Deportivo"],
    events: [{ id: "aston-martin-autos-fund", type: "fundacion", label: "Fundación", year: 1913, confidence: "media", primaryForAffinity: true, description: "Lionel Martin y Robert Bamford fundaron la firma en Londres, bautizada por la colina Aston Hill y el apellido de Martin.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1913.",
  },
  // Buey
  {
    id: "chrysler-autos", name: "Chrysler", type: "brand",
    country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "Walter Chrysler resucitó una marca moribunda y la convirtió en el tercer gigante de Detroit, donde la aerodinámica se vestía de arte americano.",
    keyThemes: ["Americano", "Innovación", "Diseño", "Potencia"],
    events: [{ id: "chrysler-autos-fund", type: "fundacion", label: "Fundación", year: 1925, confidence: "media", primaryForAffinity: true, description: "Walter Chrysler relanzó en 1925 la moribunda Maxwell Motors con su nombre y el vanguardista Chrysler Six.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1925.",
  },
  // Buey
  {
    id: "toyota-autos", name: "Toyota", type: "brand",
    country: "Japón", emoji: "🚗",
    category: "autos",
    description: "Del telar al asfalto, Toyota convirtió la obsesión por la mejora continua en el mayor imperio automotriz del planeta.",
    keyThemes: ["Japón", "Calidad", "Innovación", "Confiabilidad"],
    events: [{ id: "toyota-autos-fund", type: "fundacion", label: "Fundación", year: 1937, confidence: "media", primaryForAffinity: true, description: "Kiichiro Toyoda separó la automotriz de los telares familiares y presentó el sedán Modelo AA como su primer auto.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1937.",
  },
  // Gallo
  {
    id: "morgan-autos", name: "Morgan", type: "brand",
    country: "Reino Unido", emoji: "🚗",
    category: "autos",
    description: "En Malvern, Morgan sigue doblando madera y martillando aluminio como en 1909, una reliquia viva de la artesanía británica sobre ruedas.",
    keyThemes: ["Británico", "Artesanal", "Clásico", "Deportivo"],
    events: [{ id: "morgan-autos-fund", type: "fundacion", label: "Fundación", year: 1909, confidence: "media", primaryForAffinity: true, description: "En Malvern, H.F.S. Morgan fabricó primero un triciclo de una rueda al frente, germen de sus autos artesanales.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1909.",
  },
  // Tigre
  {
    id: "cadillac-autos", name: "Cadillac", type: "brand",
    country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "Desde los albores del automóvil, Cadillac definió el lujo americano con la precisión obsesiva de Henry Leland y las aletas del sueño de posguerra.",
    keyThemes: ["Lujo", "Americano", "Elegancia", "Estatus"],
    events: [{ id: "cadillac-autos-fund", type: "fundacion", label: "Fundación", year: 1902, confidence: "media", primaryForAffinity: true, description: "Fundada en Detroit y bautizada por el explorador Antoine de la Mothe Cadillac, Henry Leland la convirtió en sinónimo de precisión.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1902.",
  },
  // Tigre
  {
    id: "maserati-autos", name: "Maserati", type: "brand",
    country: "Italia", emoji: "🔱",
    category: "autos",
    description: "Bajo el tridente robado a la fuente de Neptuno, Maserati teje elegancia italiana con un rugido de competición reservado a pocos.",
    keyThemes: ["Lujo", "Italiano", "Elegancia", "Deportivo"],
    events: [{ id: "maserati-autos-fund", type: "fundacion", label: "Fundación", year: 1914, confidence: "media", primaryForAffinity: true, description: "Los hermanos Maserati abrieron su taller en Bolonia; el tridente del emblema proviene de la fuente de Neptuno.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1914.",
  },
  // Tigre
  {
    id: "mercedes-autos", name: "Mercedes-Benz", type: "brand",
    country: "Alemania", emoji: "🚗",
    category: "autos",
    description: "Hija de los propios inventores del automóvil, Mercedes-Benz convierte la ingeniería alemana en elegancia que envejece como el mejor de los orgullos.",
    keyThemes: ["Lujo", "Innovación", "Ingeniería", "Elegancia"],
    events: [{ id: "mercedes-autos-fund", type: "fundacion", label: "Fundación", year: 1926, confidence: "media", primaryForAffinity: true, description: "Nació de la fusión en 1926 de las empresas de Carl Benz y Gottlieb Daimler, los inventores del automóvil.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1926.",
  },
  // Tigre
  {
    id: "seat-autos", name: "SEAT", type: "brand",
    country: "España", emoji: "🚗",
    category: "autos",
    description: "La marca que puso a España sobre ruedas, de la Barcelona industrial al orgullo joven, fusiona la sobriedad latina con carácter mediterráneo.",
    keyThemes: ["España", "Accesibilidad", "Diseño", "Juventud"],
    events: [{ id: "seat-autos-fund", type: "fundacion", label: "Fundación", year: 1950, confidence: "media", primaryForAffinity: true, description: "El estado español y Fiat crearon en Barcelona la 'Sociedad Española de Automóviles de Turismo' para motorizar al país.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1950.",
  },
  // Tigre
  {
    id: "acura-autos", name: "Acura", type: "brand",
    country: "Japón", emoji: "🔧",
    category: "autos",
    description: "La primera marca de lujo japonesa en América, Acura llevó la precisión de Honda al asfalto con el cuchillo afilado del deportivo NSX.",
    keyThemes: ["Japón", "Precisión", "Deportivo", "Lujo"],
    events: [{ id: "acura-autos-fund", type: "fundacion", label: "Fundación", year: 1986, confidence: "media", primaryForAffinity: true, description: "Honda estrenó en Estados Unidos la primera marca de lujo japonesa, debutando con el sedán Legend y el deportivo Integra.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1986.",
  },
  // Gato
  {
    id: "ford-autos", name: "Ford", type: "brand",
    country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "Revolucionó el mundo con la cadena de montaje y el Ford T.",
    keyThemes: ["Innovación", "Americano", "Tradición", "Accesibilidad"],
    events: [{ id: "ford-autos-fund", type: "fundacion", label: "Fundación", year: 1903, confidence: "media", primaryForAffinity: true, description: "Henry Ford, tras dos empresas fallidas, fundó la compañía en Detroit; el Modelo T llegaría cinco años después.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1903.",
  },
  // Gato
  {
    id: "buick-autos", name: "Buick", type: "brand",
    country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "Fundada por un escocés obsesionado con los motores de válvulas, Buick se ganó ser la piedra fundacional del imperio de General Motors.",
    keyThemes: ["Americano", "Lujo", "Tradición", "Confiabilidad"],
    events: [{ id: "buick-autos-fund", type: "fundacion", label: "Fundación", year: 1903, confidence: "media", primaryForAffinity: true, description: "El escocés David Dunbar Buick patentó un motor de válvulas en culata y fundó la marca en Detroit en 1903.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1903.",
  },
  // Gato
  {
    id: "harley-autos", name: "Harley-Davidson", type: "brand",
    country: "Estados Unidos", emoji: "🏍️",
    category: "autos",
    description: "Nacida en un cobertizo de Milwaukee, Harley-Davidson es más que una moto: el rugido de una nación que aprendió a ser libre sobre dos ruedas.",
    keyThemes: ["Americano", "Libertad", "Rebeldía", "Tradición"],
    events: [{ id: "harley-autos-fund", type: "fundacion", label: "Fundación", year: 1903, confidence: "media", primaryForAffinity: true, description: "William Harley y los hermanos Davidson construyeron su primera motocicleta en un cobertizo de Milwaukee.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1903.",
  },
  // Gato
  {
    id: "volvo-autos", name: "Volvo", type: "brand",
    country: "Suecia", emoji: "🛡️",
    category: "autos",
    description: "Marcada por la seguridad obsesiva nacida en los fiordos de Suecia, cada Volvo es una promesa silenciosa de proteger lo que más importa.",
    keyThemes: ["Seguridad", "Suecia", "Confiabilidad", "Diseño"],
    events: [{ id: "volvo-autos-fund", type: "fundacion", label: "Fundación", year: 1927, confidence: "media", primaryForAffinity: true, description: "Assar Gabrielsson y Gustaf Larson fundaron la marca en Gotemburgo; 'volvo', en latín, significa 'yo ruedo'.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1927.",
  },
  // Gato
  {
    id: "lamborghini-autos", name: "Lamborghini", type: "brand",
    country: "Italia", emoji: "🐂",
    category: "autos",
    description: "Nacidos de la afrenta de un fabricante de tractores despreciado por Ferrari, los Lamborghini son el rugido de un toro que nunca se rinde.",
    keyThemes: ["Audacia", "Potencia", "Lujo", "Rebeldía"],
    events: [{ id: "lamborghini-autos-fund", type: "fundacion", label: "Fundación", year: 1963, confidence: "media", primaryForAffinity: true, description: "El fabricante de tractores Ferruccio Lamborghini creó la firma en Sant'Agata tras sentirse despreciado por Ferrari.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1963.",
  },
  // Gato
  {
    id: "mclaren-autos", name: "McLaren", type: "brand",
    country: "Reino Unido", emoji: "🏁",
    category: "autos",
    description: "Del genio de un piloto neozelandés a la cúspide de la Fórmula 1, McLaren convierte cada pista en laboratorio y cada curva en vértigo.",
    keyThemes: ["Velocidad", "Competencia", "Innovación", "Británico"],
    events: [{ id: "mclaren-autos-fund", type: "fundacion", label: "Fundación", year: 1963, confidence: "media", primaryForAffinity: true, description: "Bruce McLaren, piloto neozelandés, fundó el equipo en 1963 y ganó su primer Gran Premio tres años después.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1963.",
  },
  // Dragón
  {
    id: "bmw-autos", name: "BMW", type: "brand",
    country: "Alemania", emoji: "🚘",
    category: "autos",
    description: "De los motores de aviación de Múnich a la carretera, BMW convirtió la precisión bávara en el placer de conducir sin concesiones.",
    keyThemes: ["Deportivo", "Lujo", "Ingeniería", "Precisión"],
    events: [{ id: "bmw-autos-fund", type: "fundacion", label: "Fundación", year: 1916, confidence: "media", primaryForAffinity: true, description: "Nacida en Múnich como fabricante de motores de aviación, heredera de Rapp Motorenwerke, significa 'Fábricas Bávaras de Motores'.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1916.",
  },
  // Dragón
  {
    id: "isuzu-autos", name: "Isuzu", type: "brand",
    country: "Japón", emoji: "🚛",
    category: "autos",
    description: "Nacida de los astilleros Ishikawajima, Isuzu forjó camiones y todoterrenos con la durabilidad indestructible del acero de un navío japonés.",
    keyThemes: ["Japón", "Durabilidad", "Camiones", "Confiabilidad"],
    events: [{ id: "isuzu-autos-fund", type: "fundacion", label: "Fundación", year: 1916, confidence: "media", primaryForAffinity: true, description: "Comenzó como división automotriz de los astilleros Ishikawajima de Tokio, ensamblando autos Wolseley bajo licencia.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1916.",
  },
  // Dragón
  {
    id: "panoz-autos", name: "Panoz", type: "brand",
    country: "Estados Unidos", emoji: "🏎️",
    category: "autos",
    description: "Del rancho de un empresario georgiano, Panoz moldeó deportivos de aluminio que llevan la pura esencia americana a la pista y a la carretera.",
    keyThemes: ["Deportivo", "Americano", "Innovación", "Potencia"],
    events: [{ id: "panoz-autos-fund", type: "fundacion", label: "Fundación", year: 1988, confidence: "media", primaryForAffinity: true, description: "El empresario estadounidense Dan Panoz fundó la firma en Georgia con el deportivo Roadster de chasis de aluminio.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1988.",
  },
  // Cerdo
  {
    id: "ferrari-autos", name: "Ferrari", type: "brand",
    country: "Italia", emoji: "🏎️",
    category: "autos",
    description: "Del circuito de Maranello a los sueños de velocidad, el cavallino rampante encarna la pasión italiana por la belleza mecánica.",
    keyThemes: ["Pasión", "Velocidad", "Lujo", "Excelencia"],
    events: [{ id: "ferrari-autos-fund", type: "fundacion", label: "Fundación", year: 1947, confidence: "media", primaryForAffinity: true, description: "Enzo Ferrari presentó en Maranello el 125 S, primer auto de calle con el legendario cavallino rampante.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1947.",
  },
  // Gato
  {
    id: "mclaren-racing", name: "McLaren Racing", type: "brand",
    country: "Reino Unido", emoji: "🏁",
    category: "autos",
    description: "La escudería fundada por Bruce McLaren convirtió la guerra por milésimas de la Fórmula 1 en una escuela de superdeportivos extremos.",
    keyThemes: ["Velocidad", "Competencia", "Innovación", "Británico"],
    events: [{ id: "mclaren-racing-fund", type: "fundacion", label: "Fundación", year: 1963, confidence: "media", primaryForAffinity: true, description: "Creada como escudería por Bruce McLaren, debutó en Fórmula 1 en 1966 en el Gran Premio de Mónaco.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1963.",
  },
  // Serpiente
  {
    id: "mitsubishi-autos", name: "Mitsubishi", type: "brand",
    country: "Japón", emoji: "🚙",
    category: "autos",
    description: "Heredera de los astilleros que construyeron el primer auto japonés, Mitsubishi forjó su leyenda en todoterrenos que sobreviven a cualquier desierto.",
    keyThemes: ["Japón", "Tecnología", "Durabilidad", "Tradición"],
    events: [{ id: "mitsubishi-autos-fund", type: "fundacion", label: "Fundación", year: 1917, confidence: "media", primaryForAffinity: true, description: "La división de astilleros de Mitsubishi presentó en 1917 el Modelo A, el primer auto de producción de Japón.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1917.",
  },
  // Serpiente
  {
    id: "jeep-autos", name: "Jeep", type: "brand",
    country: "Estados Unidos", emoji: "🦅",
    category: "autos",
    description: "Héroe anónimo de la guerra, el Jeep se convirtió en el vehículo que enseñó al mundo que la aventura no tiene fronteras.",
    keyThemes: ["Aventura", "Libertad", "Americano", "Durabilidad"],
    events: [{ id: "jeep-autos-fund", type: "fundacion", label: "Fundación", year: 1941, confidence: "media", primaryForAffinity: true, description: "El vehículo militar Willys MB, apodado 'Jeep', nació para la Segunda Guerra Mundial y conquistó a los aliados.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1941.",
  },
  // Serpiente
  {
    id: "subaru-autos", name: "Subaru", type: "brand",
    country: "Japón", emoji: "⭐",
    category: "autos",
    description: "Bautizada con las estrellas de las Pléyades, Subaru unió motores bóxer y tracción integral para que ningún camino quede sin conquistar.",
    keyThemes: ["Japón", "Confiabilidad", "Aventura", "Tecnología"],
    events: [{ id: "subaru-autos-fund", type: "fundacion", label: "Fundación", year: 1953, confidence: "media", primaryForAffinity: true, description: "Bautizada como las estrellas Pléyades, nació de la fusión de Fuji Heavy Industries y lanzó el mini auto 360.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1953.",
  },
  // Serpiente
  {
    id: "lexus-autos", name: "Lexus", type: "brand",
    country: "Japón", emoji: "L",
    category: "autos",
    description: "Nacida en secreto de los laboratorios de Toyota, Lexus demostró que el lujo japonés podía ser silencioso, impecable y deslumbrante a la vez.",
    keyThemes: ["Lujo", "Japón", "Confiabilidad", "Innovación"],
    events: [{ id: "lexus-autos-fund", type: "fundacion", label: "Fundación", year: 1989, confidence: "media", primaryForAffinity: true, description: "Toyota desarrolló en secreto el sedán LS 400 y en 1989 lo lanzó bajo una marca de lujo llamada Lexus.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1989.",
  },
  // Serpiente
  {
    id: "infiniti-autos", name: "Infiniti", type: "brand",
    country: "Japón", emoji: "♾️",
    category: "autos",
    description: "El horizonte infinito del lujo japonés, Infiniti elevó a Nissan hacia una elegancia que se siente antes de verse.",
    keyThemes: ["Japón", "Lujo", "Rendimiento", "Diseño"],
    events: [{ id: "infiniti-autos-fund", type: "fundacion", label: "Fundación", year: 1989, confidence: "media", primaryForAffinity: true, description: "La división premium de Nissan debutó en Estados Unidos con el sedán Q45, rival directo del Lexus LS.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1989.",
  },
  // Caballo
  {
    id: "rolls-royce-autos", name: "Rolls-Royce", type: "brand",
    country: "Reino Unido", emoji: "👑",
    category: "autos",
    description: "El pacto entre un piloto aristócrata y un ingeniero obsesivo dio al mundo autos tan silenciosos que solo se escucha el tic-tac del reloj.",
    keyThemes: ["Lujo", "Excelencia", "Artesanía", "Estatus"],
    events: [{ id: "rolls-royce-autos-fund", type: "fundacion", label: "Fundación", year: 1906, confidence: "media", primaryForAffinity: true, description: "El aristócrata piloto Charles Rolls y el ingeniero Henry Royce se unieron para crear el 'mejor auto del mundo'.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1906.",
  },
  // Gallo
  {
    id: "bugatti-autos", name: "Bugatti", type: "brand",
    country: "Francia", emoji: "🏁",
    category: "autos",
    description: "Del genio italiano Ettore Bugatti en Alsacia nació un ideal: autos que son esculturas rodantes, más rápidos que el relámpago y más escasos que las obras maestras.",
    keyThemes: ["Velocidad", "Lujo", "Innovación", "Excelencia"],
    events: [{ id: "bugatti-autos-fund", type: "fundacion", label: "Fundación", year: 1909, confidence: "media", primaryForAffinity: true, description: "El italiano Ettore Bugatti instaló su taller en Molsheim, Alsacia, y allí nació su primer auto, el Type 13.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1909.",
  },
  // Gallo
  {
    id: "suzuki-autos", name: "Suzuki", type: "brand",
    country: "Japón", emoji: "🚙",
    category: "autos",
    description: "De los telares de seda de Hamamatsu a las calles del mundo, Suzuki demostró que lo pequeño, bien hecho, puede conquistarlo todo.",
    keyThemes: ["Japón", "Versatilidad", "Accesibilidad", "Compacto"],
    events: [{ id: "suzuki-autos-fund", type: "fundacion", label: "Fundación", year: 1909, confidence: "media", primaryForAffinity: true, description: "Michio Suzuki fundó en Hamamatsu una fábrica de telares de seda que décadas después se volcó a los vehículos.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1909.",
  },
  // Gallo
  {
    id: "audi-autos", name: "Audi", type: "brand",
    country: "Alemania", emoji: "🔗",
    category: "autos",
    description: "Nacida cuando August Horch tuvo que traducir su propio nombre al latín, Audi unió cuatro fábricas bajo cuatro aros de promesa alemana.",
    keyThemes: ["Tecnología", "Alemán", "Innovación", "Diseño"],
    events: [{ id: "audi-autos-fund", type: "fundacion", label: "Fundación", year: 1909, confidence: "media", primaryForAffinity: true, description: "August Horch fundó la marca tras perder los derechos de su nombre; 'audi' es su traducción latina.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1909.",
  },
  // Gallo
  {
    id: "nissan-autos", name: "Nissan", type: "brand",
    country: "Japón", emoji: "🚘",
    category: "autos",
    description: "Del legado de los autos Datsun al Leaf que corre sin gasolina, Nissan ha convertido la innovación japonesa en progreso cotidiano para el mundo.",
    keyThemes: ["Innovación", "Japón", "Tecnología", "Confiabilidad"],
    events: [{ id: "nissan-autos-fund", type: "fundacion", label: "Fundación", year: 1933, confidence: "media", primaryForAffinity: true, description: "Yoshisuke Aikawa creó Jidosha Seizo, heredera de los autos Datsun, y la rebautizó Nissan por Nihon Sangyo.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1933.",
  },
  // Cabra
  {
    id: "porsche-autos", name: "Porsche", type: "brand",
    country: "Alemania", emoji: "🏎️",
    category: "autos",
    description: "De un despacho de ingeniería en Stuttgart a las victorias de Le Mans, Porsche perfeccionó la idea de que el auto deportivo es una obra de precisión.",
    keyThemes: ["Deportivo", "Lujo", "Alemán", "Precisión"],
    events: [{ id: "porsche-autos-fund", type: "fundacion", label: "Fundación", year: 1931, confidence: "media", primaryForAffinity: true, description: "Ferdinand Porsche abrió en Stuttgart un despacho de ingeniería que se convertiría en emblema del auto deportivo.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1931.",
  },
  // Cabra
  {
    id: "bentley-autos", name: "Bentley", type: "brand",
    country: "Reino Unido", emoji: "🅱️",
    category: "autos",
    description: "Forjada por un hombre que diseñaba motores de avión, Bentley unió las victorias de Le Mans con la artesanía más exquisita de la isla.",
    keyThemes: ["Lujo", "Británico", "Velocidad", "Artesanía"],
    events: [{ id: "bentley-autos-fund", type: "fundacion", label: "Fundación", year: 1919, confidence: "media", primaryForAffinity: true, description: "W.O. Bentley, obsesionado con el rendimiento, fundó la firma en Cricklewood, Londres, tras diseñar motores de aviación.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1919.",
  },
  // Cabra
  {
    id: "citroen-autos", name: "Citroën", type: "brand",
    country: "Francia", emoji: "🚘",
    category: "autos",
    description: "Del fabricante de engranajes André Citroën al de doble cheurón, Citroën convirtió la carretera en una nube y el diseño en vanguardia francesa.",
    keyThemes: ["Innovación", "Francés", "Diseño", "Comodidad"],
    events: [{ id: "citroen-autos-fund", type: "fundacion", label: "Fundación", year: 1919, confidence: "media", primaryForAffinity: true, description: "El fabricante de engranajes André Citroën lanzó en 1919 el Type A, el primer auto europeo de producción masiva.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1919.",
  },
  // Rata
  {
    id: "porsche-cabra", name: "Porsche 356", type: "brand",
    country: "Alemania", emoji: "🏎️",
    category: "autos",
    description: "Construido en un aserradero de Gmünd por Ferry Porsche, el 356 fue la primera nota de una sinfonía que sigue afinando la esencia del deportivo.",
    keyThemes: ["Deportivo", "Clásico", "Alemán", "Innovación"],
    events: [{ id: "porsche-cabra-fund", type: "fundacion", label: "Fundación", year: 1948, confidence: "media", primaryForAffinity: true, description: "En un aserradero de Gmünd, Austria, Ferry Porsche construyó el 356, el primer auto con el apellido Porsche.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1948.",
  },
  // Cabra
  {
    id: "hyundai-autos", name: "Hyundai", type: "brand",
    country: "Corea del Sur", emoji: "🚙",
    category: "autos",
    description: "Del imperio de la construcción al asfalto, Hyundai encarnó el milagro coreano convirtiendo modestos comienzos en un gigante global de la movilidad.",
    keyThemes: ["Crecimiento", "Innovación", "Confiabilidad", "Calidad"],
    events: [{ id: "hyundai-autos-fund", type: "fundacion", label: "Fundación", year: 1967, confidence: "media", primaryForAffinity: true, description: "El magnate Chung Ju-yung diversificó su imperio constructor con Hyundai Motor, que empezó ensamblando Fords.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1967.",
  },
  // Cabra
  {
    id: "tesla-autos", name: "Tesla", type: "brand",
    country: "Estados Unidos", emoji: "⚡",
    category: "autos",
    description: "Nacida en Silicon Valley para reinventar el automóvil, cada Tesla carga la audacia de creer que el futuro no emite gases.",
    keyThemes: ["Innovación", "Sostenibilidad", "Tecnología", "Futuro"],
    events: [{ id: "tesla-autos-fund", type: "fundacion", label: "Fundación", year: 2003, confidence: "media", primaryForAffinity: true, description: "Martin Eberhard y Marc Tarpenning fundaron la firma en Silicon Valley, bautizada en honor a Nikola Tesla.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 2003.",
  },
  // Mono
  {
    id: "gm-autos", name: "General Motors", type: "brand",
    country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "William Durant tejió en Flint un imperio de marcas rivales unidas bajo un mismo techo, dando al mundo el primer gigante automotriz americano.",
    keyThemes: ["Americano", "Gigante", "Innovación", "Tradición"],
    events: [{ id: "gm-autos-fund", type: "fundacion", label: "Fundación", year: 1908, confidence: "media", primaryForAffinity: true, description: "William C. Durant consolidó en Flint una holding que absorbió a Buick, Oldsmobile y Cadillac para formar GM.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1908.",
  },
  // Mono
  {
    id: "mazda-autos", name: "Mazda", type: "brand",
    country: "Japón", emoji: "🌀",
    category: "autos",
    description: "De los telares de Hiroshima a la carretera, Mazda siguió la luz de Ahura Mazda y encontró su alma en un motor rotativo imposiblemente único.",
    keyThemes: ["Innovación", "Japón", "Deportivo", "Diseño"],
    events: [{ id: "mazda-autos-fund", type: "fundacion", label: "Fundación", year: 1920, confidence: "media", primaryForAffinity: true, description: "Jujiro Matsuda, fabricante de maquinaria de corcho, fundó la empresa en Hiroshima; el nombre evoca al dios Ahura Mazda.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1920.",
  },
  // Mono
  {
    id: "pagani-autos", name: "Pagani", type: "brand",
    country: "Italia", emoji: "✨",
    category: "autos",
    description: "Del argentino que soñaba con esculturas a toda velocidad, Pagani fabrica hiperautos de fibra de carbono que son galerías de arte en movimiento.",
    keyThemes: ["Arte", "Lujo", "Innovación", "Exclusividad"],
    events: [{ id: "pagani-autos-fund", type: "fundacion", label: "Fundación", year: 1992, confidence: "media", primaryForAffinity: true, description: "El argentino Horacio Pagani, ex Lamborghini, abrió su taller en Módena y años después sorprendió con el Zonda.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1992.",
  },
  // Mono
  {
    id: "piaggio-autos", name: "Piaggio", type: "brand",
    country: "Italia", emoji: "🛵",
    category: "autos",
    description: "Del taller naval de Génova a la posguerra italiana, Piaggio transformó el devastado país en movilidad elegante sobre el zumbido de una avispa.",
    keyThemes: ["Italiano", "Innovación", "Movilidad", "Tradición"],
    events: [{ id: "piaggio-autos-fund", type: "fundacion", label: "Fundación", year: 1884, confidence: "media", primaryForAffinity: true, description: "Rinaldo Piaggio fundó en Génova un taller naval que creció hasta construir locomotoras, aviones y, luego, la Vespa.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1884.",
  },
  // Perro
  {
    id: "renault-autos", name: "Renault", type: "brand",
    country: "Francia", emoji: "🚘",
    category: "autos",
    description: "Cuando Louis Renault subió su primer coche por la calle de Lepic en París, sembró una estirpe francesa de innovación y diseño que nunca se detuvo.",
    keyThemes: ["Francés", "Innovación", "Diseño", "Historia"],
    events: [{ id: "renault-autos-fund", type: "fundacion", label: "Fundación", year: 1898, confidence: "media", primaryForAffinity: true, description: "Louis Renault armó su primer coche en el patio familiar de Boulogne-Billancourt y lo probó subiendo la calle de Lepic.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1898.",
  },
  // Gallo
  {
    id: "oldsmobile-autos", name: "Oldsmobile", type: "brand",
    country: "Estados Unidos", emoji: "🚗",
    category: "autos",
    description: "Ransom Olds inventó la producción en serie antes que Ford, y su Curved Dash encendió el camino de un siglo de autos americanos.",
    keyThemes: ["Americano", "Tradición", "Historia", "Innovación"],
    events: [{ id: "oldsmobile-autos-fund", type: "fundacion", label: "Fundación", year: 1897, confidence: "media", primaryForAffinity: true, description: "Ransom E. Olds lanzó en Lansing el Curved Dash, primer auto producido en serie en Estados Unidos.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1897.",
  },
  // Gallo
  {
    id: "saab-autos", name: "Saab", type: "brand",
    country: "Suecia", emoji: "✈️",
    category: "autos",
    description: "Con alma de aeronave y cabina de caza, Saab diseñó autos suecos tan singulares que volar en carretera parecía lo más natural del mundo.",
    keyThemes: ["Suecia", "Innovación", "Seguridad", "Diseño"],
    events: [{ id: "saab-autos-fund", type: "fundacion", label: "Fundación", year: 1945, confidence: "media", primaryForAffinity: true, description: "La aeronáutica sueca Svenska Aeroplan (SAAB) diversificó tras la guerra y presentó el futurista prototipo 92.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1945.",
  },
  // Perro
  {
    id: "opel-autos", name: "Opel", type: "brand",
    country: "Alemania", emoji: "⚡",
    category: "autos",
    description: "De máquinas de coser a rayo de luz, Opel lleva siglo y medio dando a Alemania autos honestos, accesibles y eternamente confiables.",
    keyThemes: ["Alemán", "Tradición", "Accesibilidad", "Confiabilidad"],
    events: [{ id: "opel-autos-fund", type: "fundacion", label: "Fundación", year: 1862, confidence: "media", primaryForAffinity: true, description: "Adam Opel fundó en Rüsselsheim una fábrica de máquinas de coser que sus hijos transformaron en automotriz.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1862.",
  },
  // Gallo
  {
    id: "triumph-autos", name: "Triumph", type: "brand",
    country: "Reino Unido", emoji: "🏍️",
    category: "autos",
    description: "De Coventry al corazón de la cultura británica, Triumph canta el rugido de motos que hicieron de la rebeldía un arte en dos ruedas.",
    keyThemes: ["Británico", "Clásico", "Estilo", "Motocicletas"],
    events: [{ id: "triumph-autos-fund", type: "fundacion", label: "Fundación", year: 1885, confidence: "media", primaryForAffinity: true, description: "El inmigrante alemán Siegfried Bettmann fundó en Coventry una fábrica de bicicletas célebre por sus motos.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1885.",
  },
  // Gallo
  {
    id: "daimler-autos", name: "Daimler", type: "brand",
    country: "Alemania", emoji: "⭐",
    category: "autos",
    description: "Gottlieb Daimler encendió el primer motor de alta velocidad y, con él, el motor mismo de la industria automotriz moderna.",
    keyThemes: ["Alemán", "Tradición", "Ingeniería", "Historia"],
    events: [{ id: "daimler-autos-fund", type: "fundacion", label: "Fundación", year: 1885, confidence: "media", primaryForAffinity: true, description: "Gottlieb Daimler construyó en 1885 su motor de alta velocidad, semilla de la futura Daimler-Motoren-Gesellschaft.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1885.",
  },
  // Perro
  {
    id: "alfa-romeo-autos", name: "Alfa Romeo", type: "brand",
    country: "Italia", emoji: "🍀",
    category: "autos",
    description: "De las cenizas de una fábrica fallida en Milán, Alfa Romeo nació con un trébol de la suerte y un corazón que late en italiano.",
    keyThemes: ["Pasión", "Italiano", "Diseño", "Deportivo"],
    events: [{ id: "alfa-romeo-autos-fund", type: "fundacion", label: "Fundación", year: 1910, confidence: "media", primaryForAffinity: true, description: "Nacida en Milán de las cenizas de la filial italiana de Darracq, la A.L.F.A. debutó con el 24 HP.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1910.",
  },
  // Perro
  {
    id: "range-rover-autos", name: "Range Rover", type: "brand",
    country: "Reino Unido", emoji: "🚙",
    category: "autos",
    description: "El lujo se hizo todoterreno en 1970 cuando Range Rover inventó la idea de cruzar la sabana vestido de primera clase.",
    keyThemes: ["Lujo", "Capacidad", "Británico", "Aventura"],
    events: [{ id: "range-rover-autos-fund", type: "fundacion", label: "Fundación", year: 1970, confidence: "media", primaryForAffinity: true, description: "Surgido de un prototipo de lujo llamado 'Velar', el Range Rover inventó en 1970 el SUV premium.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1970.",
  },
  // Perro
  {
    id: "koenigsegg-autos", name: "Koenigsegg", type: "brand",
    country: "Suecia", emoji: "⚡",
    category: "autos",
    description: "Un joven sueco de 22 años soñó el hiperauto definitivo, y Koenigsegg lleva décadas demostrando que la imaginación fría del norte puede volar más rápido.",
    keyThemes: ["Velocidad", "Innovación", "Suecia", "Tecnología"],
    events: [{ id: "koenigsegg-autos-fund", type: "fundacion", label: "Fundación", year: 1994, confidence: "media", primaryForAffinity: true, description: "El joven Christian von Koenigsegg construyó en Suecia un prototipo propio, bautizado CC, inicio de sus hiperautos.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1994.",
  },
  // Perro
  {
    id: "vespa-autos", name: "Vespa", type: "brand",
    country: "Italia", emoji: "🛵",
    category: "autos",
    description: "Diseñada por un ingeniero aeronáutico en la posguerra, la Vespa zumbó sobre las calles rotas de Italia y se volvió sinónimo de estilo y libertad.",
    keyThemes: ["Italiano", "Diseño", "Libertad", "Estilo"],
    events: [{ id: "vespa-autos-fund", type: "fundacion", label: "Fundación", year: 1946, confidence: "media", primaryForAffinity: true, description: "El ingeniero aeronáutico Corradino D'Ascanio diseñó para Piaggio un escúter de chasis autoportante llamado 'avispa'.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1946.",
  },
  // Perro
  {
    id: "ktm-autos", name: "KTM", type: "brand",
    country: "Austria", emoji: "🏍️",
    category: "autos",
    description: "Del taller de reparaciones de Trunkenpolz en Mattighofen, KTM forjó motos naranjas que muerden el polvo, la piedra y el barro sin piedad.",
    keyThemes: ["Austria", "Deportivo", "Motocicletas", "Aventura"],
    events: [{ id: "ktm-autos-fund", type: "fundacion", label: "Fundación", year: 1934, confidence: "media", primaryForAffinity: true, description: "Hans Trunkenpolz abrió en Mattighofen un taller de reparaciones, 'Kraftfahrzeug Trunkenpolz Mattighofen', origen de KTM.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1934.",
  },
  // Cerdo
  {
    id: "chevrolet-autos", name: "Chevrolet", type: "brand",
    country: "Estados Unidos", emoji: "🚘",
    category: "autos",
    description: "Del lazo dorado de Louis Chevrolet nació la marca que montó el sueño americano sobre cuatro ruedas y lo llevó por cada autopista del país.",
    keyThemes: ["Americano", "Tradición", "Potencia", "Libertad"],
    events: [{ id: "chevrolet-autos-fund", type: "fundacion", label: "Fundación", year: 1911, confidence: "media", primaryForAffinity: true, description: "El piloto suizo Louis Chevrolet y William Durant fundaron en Detroit la marca del lazo dorado.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1911.",
  },
  // Cerdo
  {
    id: "jaguar-autos", name: "Jaguar", type: "brand",
    country: "Reino Unido", emoji: "🐆",
    category: "autos",
    description: "Con la mirada de un felino y la suavidad del paño inglés, Jaguar convierte cada carretera en un paseo de elegancia depredadora.",
    keyThemes: ["Lujo", "Elegancia", "Británico", "Velocidad"],
    events: [{ id: "jaguar-autos-fund", type: "fundacion", label: "Fundación", year: 1935, confidence: "media", primaryForAffinity: true, description: "William Lyons rebautizó sus 'SS Cars' de Coventry como Jaguar y presentó el veloz SS Jaguar 100.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1935.",
  },
  // Cerdo
  {
    id: "mini-autos", name: "Mini", type: "brand",
    country: "Reino Unido", emoji: "🚗",
    category: "autos",
    description: "Alec Issigonis empujó las ruedas hasta las esquinas y creó un pequeño británico con alma de go-kart que conquistó el mundo en dos tamaños.",
    keyThemes: ["Británico", "Compacto", "Estilo", "Diversión"],
    events: [{ id: "mini-autos-fund", type: "fundacion", label: "Fundación", year: 1959, confidence: "media", primaryForAffinity: true, description: "Alec Issigonis diseñó para BMC un auto de ruedas en las esquinas: el Morris Mini-Minor nació en 1959.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1959.",
  },
  // Cerdo
  {
    id: "proton-autos", name: "Proton", type: "brand",
    country: "Malasia", emoji: "🚘",
    category: "autos",
    description: "El auto nacional de Malasia, Proton puso a una nación joven sobre ruedas propias y convirtió el orgullo asiático en industria.",
    keyThemes: ["Malasia", "Crecimiento", "Accesibilidad", "Industria"],
    events: [{ id: "proton-autos-fund", type: "fundacion", label: "Fundación", year: 1983, confidence: "media", primaryForAffinity: true, description: "Proton nació como el auto nacional de Malasia y su primer modelo, el Saga, usó tecnología de Mitsubishi.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1983.",
  },
  // Caballo
  {
    id: "peugeot-autos", name: "Peugeot", type: "brand",
    country: "Francia", emoji: "🚘",
    category: "autos",
    description: "Del acero del siglo XIX al león rampante, Peugeot ha acompañado a Francia desde los carruajes hasta el asfalto de hoy.",
    keyThemes: ["Tradición", "Francés", "Diseño", "Historia"],
    events: [{ id: "peugeot-autos-fund", type: "fundacion", label: "Fundación", year: 1810, confidence: "media", primaryForAffinity: true, description: "La familia Peugeot, dedicada al acero desde 1810, presentó su primer automóvil de vapor en 1889.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1810.",
  },
  // Buey
  {
    id: "vw-autos", name: "Volkswagen", type: "brand",
    country: "Alemania", emoji: "🚗",
    category: "autos",
    description: "El gigante alemán que democratizó el automóvil con el Escarabajo.",
    keyThemes: ["Confiabilidad", "Tradición", "Accesibilidad", "Ingeniería"],
    events: [{ id: "vw-autos-fund", type: "fundacion", label: "Fundación", year: 1937, confidence: "media", primaryForAffinity: true, description: "Con el encargo del 'auto del pueblo', Ferdinand Porsche diseñó el Escarabajo que dio nombre a la fábrica de Wolfsburgo.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1937.",
  },
  // Buey
  {
    id: "chery-autos", name: "Chery", type: "brand",
    country: "China", emoji: "🚗",
    category: "autos",
    description: "Nacida en Wuhu con ambición estatal, Chery convirtió motores y diseño en el emblema de un gigante que aprendió a cruzar las fronteras del mundo.",
    keyThemes: ["China", "Crecimiento", "Innovación", "Accesibilidad"],
    events: [{ id: "chery-autos-fund", type: "fundacion", label: "Fundación", year: 1997, confidence: "media", primaryForAffinity: true, description: "Nacida en Wuhu con apoyo estatal, Chery comenzó fabricando motores y se volvió la gran exportadora china.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1997.",
  },
  // Serpiente
  {
    id: "ferrari-racing", name: "Scuderia Ferrari", type: "brand",
    country: "Italia", emoji: "🏎️",
    category: "autos",
    description: "La escuadra donde el cavallino rampante aprendió a correr, Scuderia Ferrari lleva casi un siglo tiñendo de rojo el altar de la Fórmula 1.",
    keyThemes: ["Pasión", "Velocidad", "Competencia", "Historia"],
    events: [{ id: "ferrari-racing-fund", type: "fundacion", label: "Fundación", year: 1929, confidence: "media", primaryForAffinity: true, description: "Enzo Ferrari fundó en Módena la escudería que competía a bordo de los Alfas de la firma de Milán.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1929.",
  },
  // Caballo
  {
    id: "lancia-autos", name: "Lancia", type: "brand",
    country: "Italia", emoji: "🚗",
    category: "autos",
    description: "El ingeniero Vincenzo Lancia dejó FIAT para inventar autos con alma propia, sembrando una innovación técnica que hoy vive en las leyendas del rally.",
    keyThemes: ["Italiano", "Innovación", "Diseño", "Historia"],
    events: [{ id: "lancia-autos-fund", type: "fundacion", label: "Fundación", year: 1906, confidence: "media", primaryForAffinity: true, description: "Vincenzo Lancia dejó FIAT para fundar su marca en Turín con el Alfa 12 HP, precursor del innovador Lambda.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1906.",
  },
  // Perro
  {
    id: "changan-autos", name: "Changan", type: "brand",
    country: "China", emoji: "🚗",
    category: "autos",
    description: "Del arsenal de Shanghái en 1862 a los motores de Chongqing, Changan guarda en su nombre la larga memoria industrial de China.",
    keyThemes: ["China", "Tradición", "Crecimiento", "Innovación"],
    events: [{ id: "changan-autos-fund", type: "fundacion", label: "Fundación", year: 1862, confidence: "media", primaryForAffinity: true, description: "Sus raíces están en el arsenal de Shanghái de 1862, que décadas después dio vida al fabricante de Chongqing.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1862.",
  },
  // Cabra
  {
    id: "skoda-autos", name: "Škoda", type: "brand",
    country: "República Checa", emoji: "🚗",
    category: "autos",
    description: "De dos mecánicos que armaron bicicletas en Bohemia, Škoda escaló hasta convertirse en el orgullo checo que conquista Europa con ingeniería seria.",
    keyThemes: ["Tradición", "Accesibilidad", "Ingeniería", "Calidad"],
    events: [{ id: "skoda-autos-fund", type: "fundacion", label: "Fundación", year: 1895, confidence: "media", primaryForAffinity: true, description: "Václav Laurin y Václav Klement fundaron en Mladá Boleslav una fábrica de bicicletas que se volvió Škoda.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1895.",
  },
  // Mono
  {
    id: "kia-autos", name: "Kia", type: "brand",
    country: "Corea del Sur", emoji: "🚗",
    category: "autos",
    description: "De piezas de bicicleta en la Seúl de posguerra al diseño más atrevido de Corea, Kia pasó de imitar a marcar el paso.",
    keyThemes: ["Corea", "Calidad", "Innovación", "Accesibilidad"],
    events: [{ id: "kia-autos-fund", type: "fundacion", label: "Fundación", year: 1944, confidence: "media", primaryForAffinity: true, description: "Nacida como Kyungsung Precision Industry en Seúl, Kia empezó fabricando tubos de acero y piezas de bicicleta.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1944.",
  },

  // ──── AUTOS ADICIONALES ────
  {
    id: "honda-autos", name: "Honda", type: "brand",
    country: "Japón", emoji: "🔴",
    category: "autos",
    description: "De un taller de motores para bicicletas a una de las marcas más confiables del mundo, Honda encarna la precisión y el ingenio japonés en cada motor.",
    keyThemes: ["Ingenio", "Precisión", "Japón", "Motor"],
    events: [{ id: "honda-autos-fund", type: "fundacion", label: "Fundación", year: 1948, confidence: "media", primaryForAffinity: true, description: "Soichiro Honda fundó la compañía en Hamamatsu, Japón, empezando con motores para bicicletas y soñando con la Fórmula 1.", source: "Documentación histórica" }],
    sourceNote: "Fundada en 1948.",
  },
];
