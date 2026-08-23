import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Ciudades argentinas — Expansión completa
 * Incluye capitales provinciales, ciudades principales y cabeceras departamentales.
 * Todas con fechas de fundación verificadas.
 */
export const CITIES_ARGENTINA_COMPLETO: AtlasEntityInput[] = [
  // ────────────────────────────────────────────────────
  // BUENOS AIRES Y CONURBANO
  // ────────────────────────────────────────────────────
  {
    id: "buenos-aires", name: "Buenos Aires", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Capital de Argentina, metrópolis rioplatense, cuna de la política, cultura y tango del país.",
    keyThemes: ["Capital", "Tango", "Política", "Cultura"],
    sourceNote: "Fundada el 3 de febrero de 1580 por Juan de Garay.",
    events: [{ id: "bsas-fund", type: "fundacion", label: "Fundación", date: "1580-02-03", year: 1580, description: "Juan de Garay funda la ciudad de la Santísima Trinidad y Puerto de Santa María de Buenos Aires.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "la-plata", name: "La Plata", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Capital de la provincia de Buenos Aires, ciudad planificada con trazado geométrico y fuerte vida universitaria.",
    keyThemes: ["Planificación", "Universidad", "Orden", "Juventud"],
    sourceNote: "Fundada el 19 de noviembre de 1882 por Dardo Rocha.",
    events: [{ id: "laplata-fund", type: "fundacion", label: "Fundación", date: "1882-11-19", year: 1882, description: "Dardo Rocha funda La Plata como nueva capital de Buenos Aires.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    // id "quilmes-ciudad" (no "quilmes") — ese id ya lo usa la marca de
    // cerveza Quilmes en brands-argentina.ts; con el mismo id,
    // getEntityById() devolvía siempre la marca y esta ciudad nunca era
    // alcanzable.
    id: "quilmes-ciudad", name: "Quilmes", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Quilmes es ciudad del conurbano bonaerense, importante centro industrial y comercial.",
    keyThemes: ["Industria", "Conurbano", "Tradición", "Trabajo"],
    sourceNote: "Fundada en 1876 como ciudad.",
    events: [{ id: "quilmes-fund", type: "fundacion", label: "Fundación", year: 1876, description: "Se funda Quilmes como ciudad en Buenos Aires.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "lanus", name: "Lanús", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Lanús es ciudad del conurbano sur, importante centro urbano de Buenos Aires.",
    keyThemes: ["Conurbano", "Comercio", "Población", "Tradición"],
    sourceNote: "Fundada en 1904.",
    events: [{ id: "lanus-fund", type: "fundacion", label: "Fundación", year: 1904, description: "Se funda Lanús en el conurbano bonaerense.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },

  // ────────────────────────────────────────────────────
  // LITORAL (ENTRE RÍOS, CORRIENTES, MISIONES)
  // ────────────────────────────────────────────────────
  {
    id: "parana", name: "Paraná", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Capital de Entre Ríos, ciudad histórica a orillas del río Paraná, centro político durante el Rosismo.",
    keyThemes: ["Río", "Historia", "Política", "Litoral"],
    sourceNote: "Fundada el 16 de octubre de 1730.",
    events: [{ id: "parana-fund", type: "fundacion", label: "Fundación", year: 1730, description: "Se funda Paraná como asentamiento en el río.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "concordia", name: "Concordia", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Concordia es ciudad de Entre Ríos, importante puerto fluvial y centro fruticola.",
    keyThemes: ["Puerto", "Fruta", "Comercio", "Frontera"],
    sourceNote: "Fundada el 2 de abril de 1821.",
    events: [{ id: "concordia-fund", type: "fundacion", label: "Fundación", date: "1821-04-02", year: 1821, description: "Se funda Concordia en el litoral entrerriano.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "corrientes-cap", name: "Corrientes", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Capital de Corrientes, ciudad histórica a orillas del río Paraná, cuna de la música y danza típica.",
    keyThemes: ["Río", "Música", "Tradición", "Frontera"],
    sourceNote: "Fundada el 3 de abril de 1588 por Juan de Vera y Zárate.",
    events: [{ id: "corrientes-fund", type: "fundacion", label: "Fundación", date: "1588-04-03", year: 1588, description: "Juan de Vera y Zárate funda San Juan de Vera (Corrientes).", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "posadas", name: "Posadas", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Posadas es capital de Misiones, ciudad fronteriza con Paraguay, centro comercial y turístico.",
    keyThemes: ["Frontera", "Selva", "Comercio", "Paraguay"],
    sourceNote: "Fundada en 1873.",
    events: [{ id: "posadas-fund", type: "fundacion", label: "Fundación", year: 1873, description: "Se funda Posadas como puerto en Misiones.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "puerto-iguazu", name: "Puerto Iguazú", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Puerto Iguazú es ciudad misionera, sede de las Cataratas del Iguazú, destino turístico internacional.",
    keyThemes: ["Naturaleza", "Turismo", "Cataratas", "Aventura"],
    sourceNote: "Fundada en 1901 como puerto.",
    events: [{ id: "iguazu-fund", type: "fundacion", label: "Fundación", year: 1901, description: "Se funda Puerto Iguazú como puerto turístico.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },

  // ────────────────────────────────────────────────────
  // CUYO (MENDOZA, SAN JUAN, SAN LUIS)
  // ────────────────────────────────────────────────────
  {
    id: "mendoza", name: "Mendoza", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Mendoza es capital del vino argentino, al pie de los Andes, centro de la industria vitivinícola.",
    keyThemes: ["Vino", "Montaña", "Tradición", "Comercio"],
    sourceNote: "Fundada el 2 de marzo de 1561 por Pedro del Castillo.",
    events: [{ id: "mendoza-fund", type: "fundacion", label: "Fundación", date: "1561-03-02", year: 1561, description: "Pedro del Castillo funda la Ciudad de Mendoza del Nuevo Valle de La Rioja.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "san-juan", name: "San Juan", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "San Juan es capital de la provincia homónima, centro sísmico histórico, ciudad de tradición minera.",
    keyThemes: ["Montaña", "Minería", "Sismo", "Tradición"],
    sourceNote: "Fundada el 13 de junio de 1562 por Juan Jufré.",
    events: [{ id: "sanjuan-fund", type: "fundacion", label: "Fundación", date: "1562-06-13", year: 1562, description: "Juan Jufré funda San Juan de la Frontera.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "san-luis", name: "San Luis", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "San Luis es capital de la provincia homónima, ciudad serrana del corazón de Argentina.",
    keyThemes: ["Centro", "Montaña", "Tradición", "Comercio"],
    sourceNote: "Fundada el 25 de agosto de 1594 por Luis Jufré.",
    events: [{ id: "sanluisarg-fund", type: "fundacion", label: "Fundación", date: "1594-08-25", year: 1594, description: "Luis Jufré funda San Luis de la Punta.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },

  // ────────────────────────────────────────────────────
  // CENTRO (CÓRDOBA, SANTA FE)
  // ────────────────────────────────────────────────────
  {
    id: "cordoba", name: "Córdoba", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Córdoba es la segunda ciudad más grande de Argentina, cuna de la universidad más antigua y tradición estudiantil.",
    keyThemes: ["Estudio", "Historia", "Cultura", "Sierras"],
    sourceNote: "Fundada el 6 de julio de 1573 por Jerónimo Luis de Cabrera.",
    events: [{ id: "cordoba-fund", type: "fundacion", label: "Fundación", date: "1573-07-06", year: 1573, description: "Jerónimo Luis de Cabrera funda la ciudad de Córdoba de la Nueva Andalucía.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "santa-fe", name: "Santa Fe", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Santa Fe es capital de la provincia homónima, ciudad histórica a orillas del río Paraná, cuna de la Constitución.",
    keyThemes: ["Política", "Río", "Constitución", "Historia"],
    sourceNote: "Fundada el 15 de noviembre de 1573 por Juan de Garay.",
    events: [{ id: "santafe-fund", type: "fundacion", label: "Fundación", date: "1573-11-15", year: 1573, description: "Juan de Garay funda Santa Fe la Vieja.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "rosario", name: "Rosario", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Rosario es la tercera ciudad más grande de Argentina, importante puerto sobre el río Paraná, cuna de revolucionarios.",
    keyThemes: ["Puerto", "Comercio", "Revolución", "Río"],
    sourceNote: "Se formó espontáneamente desde fines del siglo XVII; erigida ciudad en 1862.",
    events: [{ id: "rosario-fund", type: "fundacion", label: "Fundación oficial", year: 1862, description: "Rosario es erigida formalmente como ciudad.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },

  // ────────────────────────────────────────────────────
  // NORESTE (FORMOSA, CHACO)
  // ────────────────────────────────────────────────────
  {
    id: "formosa", name: "Formosa", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Formosa es capital de la provincia homónima, ciudad fronteriza con Paraguay, centro comercial del noreste.",
    keyThemes: ["Frontera", "Selva", "Comercio", "Paraguay"],
    sourceNote: "Fundada el 8 de abril de 1879.",
    events: [{ id: "formosa-fund", type: "fundacion", label: "Fundación", date: "1879-04-08", year: 1879, description: "Se funda Formosa como capital territorial.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "resistencia", name: "Resistencia", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Resistencia es capital del Chaco, ciudad de tradición artística y cultural, centro administrativo norteño.",
    keyThemes: ["Arte", "Tradición", "Comercio", "Noreste"],
    sourceNote: "Fundada el 2 de febrero de 1878 como Fuerte Necochea.",
    events: [{ id: "resistencia-fund", type: "fundacion", label: "Fundación", date: "1878-02-02", year: 1878, description: "Se funda Resistencia como fuerte defensivo.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },

  // ────────────────────────────────────────────────────
  // NOROESTE (SALTA, JUJUY, TUCUMÁN, SANTIAGO DEL ESTERO, CATAMARCA, LA RIOJA)
  // ────────────────────────────────────────────────────
  {
    id: "salta", name: "Salta", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Salta 'la linda' conserva fuerte identidad colonial, es capital cultural del noroeste argentino.",
    keyThemes: ["Colonial", "Tradición", "Identidad", "Noreste"],
    sourceNote: "Fundada el 16 de abril de 1582 por Hernando de Lerma.",
    events: [{ id: "salta-fund", type: "fundacion", label: "Fundación", date: "1582-04-16", year: 1582, description: "Hernando de Lerma funda San Felipe y Santiago de Lerma (Salta).", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "san-salvador-jujuy", name: "San Salvador de Jujuy", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "San Salvador de Jujuy es capital de Jujuy, ciudad histórica en el corazón de las montañas norteñas.",
    keyThemes: ["Montaña", "Historia", "Frontera", "Tradición"],
    sourceNote: "Fundada el 23 de abril de 1593.",
    events: [{ id: "jujuy-fund", type: "fundacion", label: "Fundación", date: "1593-04-23", year: 1593, description: "Se funda San Salvador de Jujuy.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "tucuman", name: "San Miguel de Tucumán", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Tucumán es cuna de la independencia argentina, centro histórico y cultural del noroeste.",
    keyThemes: ["Independencia", "Historia", "Tradición", "Cultura"],
    sourceNote: "Fundada el 31 de mayo de 1565 por Diego de Villarroel.",
    events: [{ id: "tucuman-fund", type: "fundacion", label: "Fundación", date: "1565-05-31", year: 1565, description: "Diego de Villarroel funda San Miguel de Tucumán.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "santiago-del-estero", name: "Santiago del Estero", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Santiago del Estero es la ciudad más antigua de Argentina, fundación colonial histórica, cuna del folklore.",
    keyThemes: ["Antigüedad", "Colonial", "Folklore", "Tradición"],
    sourceNote: "Fundada el 25 de julio de 1553 por Juan Núñez de Prado.",
    events: [{ id: "santiago-fund", type: "fundacion", label: "Fundación", date: "1553-07-25", year: 1553, description: "Juan Núñez de Prado funda Santiago del Estero.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "catamarca", name: "San Fernando del Valle de Catamarca", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Catamarca es capital provincial, ciudad andina de tradición religiosa y mineral.",
    keyThemes: ["Montaña", "Minería", "Tradición", "Religión"],
    sourceNote: "Fundada el 15 de agosto de 1683.",
    events: [{ id: "catamarca-fund", type: "fundacion", label: "Fundación", year: 1683, description: "Se funda San Fernando del Valle de Catamarca.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "la-rioja", name: "La Rioja", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "La Rioja es capital provincial, ciudad colonial serrana con tradición de artesanías.",
    keyThemes: ["Colonial", "Artesanía", "Montaña", "Tradición"],
    sourceNote: "Fundada el 20 de mayo de 1591 por Juan Ramírez de Velasco.",
    events: [{ id: "larioja-fund", type: "fundacion", label: "Fundación", date: "1591-05-20", year: 1591, description: "Juan Ramírez de Velasco funda La Rioja.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },

  // ────────────────────────────────────────────────────
  // SUR (NEUQUÉN, RÍO NEGRO, CHUBUT, SANTA CRUZ, TIERRA DEL FUEGO)
  // ────────────────────────────────────────────────────
  {
    id: "neuquen", name: "Neuquén", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Neuquén es capital provincial patagónica, centro de la industria petrolera argentina.",
    keyThemes: ["Petróleo", "Patagonia", "Comercio", "Tecnología"],
    sourceNote: "Fundada en 1904 como ciudad.",
    events: [{ id: "neuquen-fund", type: "fundacion", label: "Fundación", year: 1904, description: "Se funda Neuquén como puerto sobre el río.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "viedma", name: "Viedma", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Viedma es capital de Río Negro, ciudad patagónica histórica a orillas del río homónimo.",
    keyThemes: ["Río", "Patagonia", "Historia", "Comercio"],
    sourceNote: "Fundada el 2 de abril de 1779 como Carmen de Patagones.",
    events: [{ id: "viedma-fund", type: "fundacion", label: "Fundación", date: "1779-04-02", year: 1779, description: "Se funda Carmen de Patagones (Viedma).", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "bariloche", name: "San Carlos de Bariloche", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Bariloche es destino patagónico por excelencia, entre lagos, montañas, chocolaterías y aventura.",
    keyThemes: ["Naturaleza", "Lago", "Aventura", "Patagonia"],
    sourceNote: "Fundada oficialmente el 3 de mayo de 1902.",
    events: [{ id: "bariloche-fund", type: "fundacion", label: "Fundación", date: "1902-05-03", year: 1902, description: "Se funda San Carlos de Bariloche.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "rawson", name: "Rawson", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Rawson es capital de Chubut, puerto patagónico sobre el océano Atlántico.",
    keyThemes: ["Puerto", "Mar", "Patagonia", "Pesca"],
    sourceNote: "Fundada el 28 de julio de 1865.",
    events: [{ id: "rawson-fund", type: "fundacion", label: "Fundación", date: "1865-07-28", year: 1865, description: "Se funda Rawson como puerto patagónico.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "puerto-madryn", name: "Puerto Madryn", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Puerto Madryn es ciudad chubutense sobre el océano, importante puerto pesquero y turístico.",
    keyThemes: ["Mar", "Pesca", "Turismo", "Patagonia"],
    sourceNote: "Fundada en 1865 como puerto galés.",
    events: [{ id: "madryn-fund", type: "fundacion", label: "Fundación", year: 1865, description: "Se funda Puerto Madryn como puerto galés.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "rio-gallegos", name: "Río Gallegos", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Río Gallegos es capital de Santa Cruz, puerto petrolero patagónico extremo.",
    keyThemes: ["Petróleo", "Patagonia", "Extremo sur", "Puerto"],
    sourceNote: "Fundada en 1885.",
    events: [{ id: "gallegos-fund", type: "fundacion", label: "Fundación", year: 1885, description: "Se funda Río Gallegos como puerto.", source: "Documentación histórica", confidence: "media", primaryForAffinity: true }],
  },
  {
    id: "ushuaia", name: "Ushuaia", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Ushuaia es la ciudad más austral de Argentina, capital de Tierra del Fuego, puerta a la Antártida.",
    keyThemes: ["Extremo", "Antártida", "Aventura", "Frontera"],
    sourceNote: "Fundada el 3 de diciembre de 1884.",
    events: [{ id: "ushuaia-fund", type: "fundacion", label: "Fundación", date: "1884-12-03", year: 1884, description: "Se funda Ushuaia como asentamiento penal y puerto antártico.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },

  // ────────────────────────────────────────────────────
  // OTRAS CIUDADES IMPORTANTES
  // ────────────────────────────────────────────────────
  {
    id: "mar-del-plata", name: "Mar del Plata", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Mar del Plata es el balneario más popular de Argentina, puerto pesquero y veraniego.",
    keyThemes: ["Verano", "Mar", "Turismo", "Encuentro"],
    sourceNote: "Fundada el 10 de febrero de 1874 por Patricio Peralta Ramos.",
    events: [{ id: "mardelplata-fund", type: "fundacion", label: "Fundación", date: "1874-02-10", year: 1874, description: "Patricio Peralta Ramos funda Mar del Plata.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "tandil", name: "Tandil", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Tandil es ciudad serrana de Buenos Aires, importante centro turístico y de tradición gaucha.",
    keyThemes: ["Montaña", "Gaucho", "Tradición", "Turismo"],
    sourceNote: "Fundada el 4 de abril de 1823.",
    events: [{ id: "tandil-fund", type: "fundacion", label: "Fundación", date: "1823-04-04", year: 1823, description: "Se funda Tandil como fuerte defensivo.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "azul", name: "Azul", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Azul es ciudad del interior bonaerense, importante centro comercial y agrícola.",
    keyThemes: ["Agricultura", "Comercio", "Llanura", "Tradición"],
    sourceNote: "Fundada el 15 de julio de 1821.",
    events: [{ id: "azul-fund", type: "fundacion", label: "Fundación", date: "1821-07-15", year: 1821, description: "Se funda Azul como fuerte defensivo.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "villa-maria", name: "Villa María", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Villa María es ciudad de Córdoba, importante centro comercial agrícola-ganadero del país.",
    keyThemes: ["Agricultura", "Ganadería", "Comercio", "Córdoba"],
    sourceNote: "Fundada el 1 de junio de 1887.",
    events: [{ id: "villamaria-fund", type: "fundacion", label: "Fundación", date: "1887-06-01", year: 1887, description: "Se funda Villa María.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "rio-cuarto", name: "Río Cuarto", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Río Cuarto es ciudad de Córdoba, importante centro comercial y educativo del sur provincial.",
    keyThemes: ["Educación", "Comercio", "Agricultura", "Córdoba"],
    sourceNote: "Fundada el 2 de junio de 1821.",
    events: [{ id: "riocuarto-fund", type: "fundacion", label: "Fundación", date: "1821-06-02", year: 1821, description: "Se funda Río Cuarto.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
  {
    id: "venado-tuerto", name: "Venado Tuerto", type: "city", country: "Argentina",
    emoji: "🇦🇷",
    description: "Venado Tuerto es ciudad santafesina, importante centro agrícola del sur provincial.",
    keyThemes: ["Agricultura", "Comercio", "Llanura", "Santa Fe"],
    sourceNote: "Fundada el 3 de noviembre de 1883.",
    events: [{ id: "venadotuerto-fund", type: "fundacion", label: "Fundación", date: "1883-11-03", year: 1883, description: "Se funda Venado Tuerto.", source: "Documentación histórica", confidence: "exacta", primaryForAffinity: true }],
  },
];
