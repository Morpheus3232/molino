import type { AtlasEntityInput } from "@/types/atlas";

/**
 * Ciudades de los siete países del público objetivo cargadas el 2026-10-31.
 * Cada fecha coincide en día, mes y año entre Wikidata (precisión de día) y
 * la ficha de Wikipedia en español (campo «fundación»); las que no coincidían
 * se descartaron. San Martín de los Andes y Comodoro Rivadavia no tienen el
 * día en Wikidata: la segunda fuente es la prensa local que documenta el
 * aniversario oficial. Fechas anteriores a 1582 en calendario juliano, como
 * las dan las fuentes. Los distritos de Lima y la comuna de Providencia
 * llevan la fecha de creación, no de fundación.
 */
export const CITIES_EXPANSION: AtlasEntityInput[] = [
  {
    id: "25-de-mayo", name: "25 de Mayo", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del centro-norte de la provincia de Buenos Aires, cabecera del partido homónimo.",
    keyThemes: ["Pampa", "Agro"],
    sourceNote: "Fundada el 8 de noviembre de 1836.",
    events: [
      {
        id: "25-de-mayo-fundacion", type: "fundacion", label: "Fundación",
        date: "1836-11-08", year: 1836,
        description: "Se funda 25 de Mayo.",
        source: "Wikidata Q2109979 + Wikipedia (es): 25 de Mayo (Buenos Aires)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "avellaneda", name: "Avellaneda", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del noreste de Santa Fe, sobre el arroyo El Rey, en el corazón de la región agroindustrial del norte santafesino.",
    keyThemes: ["Litoral", "Agro", "Industria"],
    sourceNote: "Fundada el 18 de enero de 1879.",
    events: [
      {
        id: "avellaneda-fundacion", type: "fundacion", label: "Fundación",
        date: "1879-01-18", year: 1879,
        description: "Se funda Avellaneda.",
        source: "Wikidata Q932398 + Wikipedia (es): Avellaneda (Santa Fe)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "balcarce", name: "Balcarce", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad serrana del sudeste bonaerense, cuna de Juan Manuel Fangio y de un circuito de automovilismo histórico.",
    keyThemes: ["Sierras", "Agro", "Automovilismo"],
    sourceNote: "Fundada el 22 de junio de 1876.",
    events: [
      {
        id: "balcarce-fundacion", type: "fundacion", label: "Fundación",
        date: "1876-06-22", year: 1876,
        description: "Se funda Balcarce.",
        source: "Wikidata Q2365352 + Wikipedia (es): Balcarce (ciudad)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "baradero", name: "Baradero", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Fundada como Santiago del Baradero sobre el río homónimo, es uno de los pueblos más antiguos de la provincia de Buenos Aires.",
    keyThemes: ["Río", "Historia", "Colonial"],
    sourceNote: "Fundada el 25 de julio de 1615.",
    events: [
      {
        id: "baradero-fundacion", type: "fundacion", label: "Fundación",
        date: "1615-07-25", year: 1615,
        description: "Se funda Baradero.",
        source: "Wikidata Q2318528 + Wikipedia (es): Baradero", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "bella-vista", name: "Bella Vista", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad correntina a orillas del río Paraná, cabecera del departamento homónimo.",
    keyThemes: ["Litoral", "Río", "Cítricos"],
    sourceNote: "Fundada el 3 de junio de 1825.",
    events: [
      {
        id: "bella-vista-fundacion", type: "fundacion", label: "Fundación",
        date: "1825-06-03", year: 1825,
        description: "Se funda Bella Vista.",
        source: "Wikidata Q55855 + Wikipedia (es): Bella Vista (Corrientes)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "chajari", name: "Chajarí", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del noreste de Entre Ríos, en el departamento Federación, fundada como colonia agrícola.",
    keyThemes: ["Litoral", "Cítricos", "Inmigración"],
    sourceNote: "Fundada el 28 de mayo de 1872.",
    events: [
      {
        id: "chajari-fundacion", type: "fundacion", label: "Fundación",
        date: "1872-05-28", year: 1872,
        description: "Se funda Chajarí.",
        source: "Wikidata Q2654603 + Wikipedia (es): Chajarí", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "chascomus", name: "Chascomús", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad turística bonaerense junto a la laguna de Chascomús, una de las fundaciones coloniales de la frontera.",
    keyThemes: ["Laguna", "Colonial", "Turismo"],
    sourceNote: "Fundada el 30 de mayo de 1779.",
    events: [
      {
        id: "chascomus-fundacion", type: "fundacion", label: "Fundación",
        date: "1779-05-30", year: 1779,
        description: "Se funda Chascomús.",
        source: "Wikidata Q2677190 + Wikipedia (es): Chascomús", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "colon", name: "Colón", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad entrerriana sobre el río Uruguay, destino de playas de río y termas.",
    keyThemes: ["Litoral", "Río", "Termas", "Turismo"],
    sourceNote: "Fundada el 12 de abril de 1863.",
    events: [
      {
        id: "colon-fundacion", type: "fundacion", label: "Fundación",
        date: "1863-04-12", year: 1863,
        description: "Se funda Colón.",
        source: "Wikidata Q52591 + Wikipedia (es): Colón (Entre Ríos)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "comodoro-rivadavia", name: "Comodoro Rivadavia", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "La ciudad más poblada de Chubut, sobre el golfo San Jorge, capital nacional del petróleo desde el hallazgo de 1907.",
    keyThemes: ["Patagonia", "Petróleo", "Puerto", "Viento"],
    sourceNote: "Fundada el 23 de febrero de 1901.",
    events: [
      {
        id: "comodoro-rivadavia-fundacion", type: "fundacion", label: "Fundación",
        date: "1901-02-23", year: 1901,
        description: "Se funda Comodoro Rivadavia.",
        source: "Wikipedia (es): Comodoro Rivadavia + Billiken (125 años de su fundación)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "coronel-pringles", name: "Coronel Pringles", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del sudoeste bonaerense, al pie de las sierras de Pillahuincó.",
    keyThemes: ["Pampa", "Sierras", "Agro"],
    sourceNote: "Fundada el 24 de septiembre de 1882.",
    events: [
      {
        id: "coronel-pringles-fundacion", type: "fundacion", label: "Fundación",
        date: "1882-09-24", year: 1882,
        description: "Se funda Coronel Pringles.",
        source: "Wikidata Q992586 + Wikipedia (es): Coronel Pringles", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "dolores", name: "Dolores", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Conocida como Primer Pueblo Patrio: fue la primera población fundada por el Estado argentino después de la declaración de la independencia.",
    keyThemes: ["Historia", "Pampa", "Independencia"],
    sourceNote: "Fundada el 21 de agosto de 1817.",
    events: [
      {
        id: "dolores-fundacion", type: "fundacion", label: "Fundación",
        date: "1817-08-21", year: 1817,
        description: "Se funda Dolores.",
        source: "Wikidata Q2024388 + Wikipedia (es): Dolores (Buenos Aires)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "el-calafate", name: "El Calafate", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad de Santa Cruz sobre el lago Argentino, puerta de entrada al glaciar Perito Moreno y al Parque Nacional Los Glaciares.",
    keyThemes: ["Patagonia", "Glaciares", "Turismo", "Lagos"],
    sourceNote: "Fundada el 7 de diciembre de 1927.",
    events: [
      {
        id: "el-calafate-fundacion", type: "fundacion", label: "Fundación",
        date: "1927-12-07", year: 1927,
        description: "Se funda El Calafate.",
        source: "Wikidata Q81561 + Wikipedia (es): El Calafate", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "embarcacion", name: "Embarcación", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del norte de Salta, sobre la Ruta Nacional 34, a orillas del río Bermejo.",
    keyThemes: ["Norte", "Río", "Frontera"],
    sourceNote: "Fundada el 11 de octubre de 1911.",
    events: [
      {
        id: "embarcacion-fundacion", type: "fundacion", label: "Fundación",
        date: "1911-10-11", year: 1911,
        description: "Se funda Embarcación.",
        source: "Wikidata Q3052011 + Wikipedia (es): Embarcación (Salta)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "esquel", name: "Esquel", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad cordillerana del noroeste de Chubut, centro de servicios de la Patagonia andina y del esquí en La Hoya.",
    keyThemes: ["Patagonia", "Montaña", "Nieve", "Turismo"],
    sourceNote: "Fundada el 25 de febrero de 1906.",
    events: [
      {
        id: "esquel-fundacion", type: "fundacion", label: "Fundación",
        date: "1906-02-25", year: 1906,
        description: "Se funda Esquel.",
        source: "Wikidata Q81656 + Wikipedia (es): Esquel", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "ezeiza", name: "Ezeiza", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Cabecera del partido homónimo en el Gran Buenos Aires, donde está el principal aeropuerto internacional del país.",
    keyThemes: ["Gran Buenos Aires", "Aeropuerto"],
    sourceNote: "Fundada el 17 de julio de 1885.",
    events: [
      {
        id: "ezeiza-fundacion", type: "fundacion", label: "Fundación",
        date: "1885-07-17", year: 1885,
        description: "Se funda Ezeiza.",
        source: "Wikidata Q1385982 + Wikipedia (es): Ezeiza", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "florencio-varela", name: "Florencio Varela", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "San Juan Bautista, conocida como Florencio Varela, cabecera del partido homónimo en el sur del Gran Buenos Aires.",
    keyThemes: ["Gran Buenos Aires"],
    sourceNote: "Fundada el 30 de enero de 1891.",
    events: [
      {
        id: "florencio-varela-fundacion", type: "fundacion", label: "Fundación",
        date: "1891-01-30", year: 1891,
        description: "Se funda Florencio Varela.",
        source: "Wikidata Q2359107 + Wikipedia (es): Florencio Varela (ciudad)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "gerli", name: "Gerli", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del sur del Gran Buenos Aires, repartida entre los partidos de Lanús y Avellaneda.",
    keyThemes: ["Gran Buenos Aires", "Industria", "Ferrocarril"],
    sourceNote: "Fundada el 30 de marzo de 1909.",
    events: [
      {
        id: "gerli-fundacion", type: "fundacion", label: "Fundación",
        date: "1909-03-30", year: 1909,
        description: "Se funda Gerli.",
        source: "Wikidata Q616906 + Wikipedia (es): Gerli", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "jardin-america", name: "Jardín América", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "La localidad más importante del departamento San Ignacio, en Misiones, entre yerbales y monte.",
    keyThemes: ["Misiones", "Yerba mate", "Selva"],
    sourceNote: "Fundada el 7 de mayo de 1946.",
    events: [
      {
        id: "jardin-america-fundacion", type: "fundacion", label: "Fundación",
        date: "1946-05-07", year: 1946,
        description: "Se funda Jardín América.",
        source: "Wikidata Q3115487 + Wikipedia (es): Jardín América (Misiones)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "las-heras", name: "Las Heras", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad petrolera del norte de Santa Cruz, en la Patagonia argentina.",
    keyThemes: ["Patagonia", "Petróleo"],
    sourceNote: "Fundada el 6 de octubre de 1914.",
    events: [
      {
        id: "las-heras-fundacion", type: "fundacion", label: "Fundación",
        date: "1914-10-06", year: 1914,
        description: "Se funda Las Heras.",
        source: "Wikidata Q2204862 + Wikipedia (es): Las Heras (Santa Cruz)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "longchamps", name: "Longchamps", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Localidad del partido de Almirante Brown, en el sur del Gran Buenos Aires.",
    keyThemes: ["Gran Buenos Aires", "Ferrocarril"],
    sourceNote: "Fundada el 10 de agosto de 1910.",
    events: [
      {
        id: "longchamps-fundacion", type: "fundacion", label: "Fundación",
        date: "1910-08-10", year: 1910,
        description: "Se funda Longchamps.",
        source: "Wikidata Q649510 + Wikipedia (es): Longchamps", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "los-polvorines", name: "Los Polvorines", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "La localidad más antigua del partido de Malvinas Argentinas, nacida junto a la estación de ferrocarril.",
    keyThemes: ["Gran Buenos Aires", "Ferrocarril"],
    sourceNote: "Fundada el 17 de diciembre de 1908.",
    events: [
      {
        id: "los-polvorines-fundacion", type: "fundacion", label: "Fundación",
        date: "1908-12-17", year: 1908,
        description: "Se funda Los Polvorines.",
        source: "Wikidata Q3723035 + Wikipedia (es): Los Polvorines", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "mar-de-ajo", name: "Mar de Ajó", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad balnearia del partido de La Costa, en la costa atlántica bonaerense.",
    keyThemes: ["Costa atlántica", "Playa", "Turismo"],
    sourceNote: "Fundada el 21 de diciembre de 1935.",
    events: [
      {
        id: "mar-de-ajo-fundacion", type: "fundacion", label: "Fundación",
        date: "1935-12-21", year: 1935,
        description: "Se funda Mar de Ajó.",
        source: "Wikidata Q991680 + Wikipedia (es): Mar de Ajó", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "merlo", name: "Merlo", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Cabecera del partido de Merlo, en el oeste del Gran Buenos Aires, junto al río Reconquista.",
    keyThemes: ["Gran Buenos Aires", "Colonial", "Río"],
    sourceNote: "Fundada el 28 de agosto de 1755.",
    events: [
      {
        id: "merlo-fundacion", type: "fundacion", label: "Fundación",
        date: "1755-08-28", year: 1755,
        description: "Se funda Merlo.",
        source: "Wikidata Q1017594 + Wikipedia (es): Merlo (Buenos Aires)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "miramar", name: "Miramar", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad balnearia del sudeste bonaerense, a 46 km de Mar del Plata, conocida como la ciudad de los niños.",
    keyThemes: ["Costa atlántica", "Playa", "Turismo"],
    sourceNote: "Fundada el 20 de septiembre de 1888.",
    events: [
      {
        id: "miramar-fundacion", type: "fundacion", label: "Fundación",
        date: "1888-09-20", year: 1888,
        description: "Se funda Miramar.",
        source: "Wikidata Q2152435 + Wikipedia (es): Miramar (Buenos Aires)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "necochea", name: "Necochea", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del sur bonaerense sobre la costa atlántica, con amplias playas y un importante puerto cerealero en Quequén.",
    keyThemes: ["Costa atlántica", "Playa", "Puerto"],
    sourceNote: "Fundada el 12 de octubre de 1881.",
    events: [
      {
        id: "necochea-fundacion", type: "fundacion", label: "Fundación",
        date: "1881-10-12", year: 1881,
        description: "Se funda Necochea.",
        source: "Wikidata Q1022275 + Wikipedia (es): Necochea", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "olavarria", name: "Olavarría", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del centro de la provincia de Buenos Aires, capital nacional del cemento por sus canteras.",
    keyThemes: ["Pampa", "Industria", "Minería"],
    sourceNote: "Fundada el 25 de noviembre de 1867.",
    events: [
      {
        id: "olavarria-fundacion", type: "fundacion", label: "Fundación",
        date: "1867-11-25", year: 1867,
        description: "Se funda Olavarría.",
        source: "Wikidata Q1004149 + Wikipedia (es): Olavarría", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "palpala", name: "Palpalá", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad siderúrgica a 13 km de San Salvador de Jujuy, a 1125 metros de altura.",
    keyThemes: ["Norte", "Industria", "Montaña"],
    sourceNote: "Fundada el 17 de abril de 1948.",
    events: [
      {
        id: "palpala-fundacion", type: "fundacion", label: "Fundación",
        date: "1948-04-17", year: 1948,
        description: "Se funda Palpalá.",
        source: "Wikidata Q55385 + Wikipedia (es): Palpalá", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "pinamar", name: "Pinamar", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad balnearia de la costa atlántica bonaerense, entre médanos y pinares, uno de los grandes destinos de verano.",
    keyThemes: ["Costa atlántica", "Playa", "Bosque", "Turismo"],
    sourceNote: "Fundada el 14 de febrero de 1943.",
    events: [
      {
        id: "pinamar-fundacion", type: "fundacion", label: "Fundación",
        date: "1943-02-14", year: 1943,
        description: "Se funda Pinamar.",
        source: "Wikidata Q517783 + Wikipedia (es): Pinamar", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "plottier", name: "Plottier", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Segunda ciudad del Neuquén por población, a 15 km de la capital provincial, en el valle de Confluencia.",
    keyThemes: ["Patagonia", "Valle", "Fruticultura"],
    sourceNote: "Fundada el 26 de marzo de 1935.",
    events: [
      {
        id: "plottier-fundacion", type: "fundacion", label: "Fundación",
        date: "1935-03-26", year: 1935,
        description: "Se funda Plottier.",
        source: "Wikidata Q1017590 + Wikipedia (es): Plottier", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "presidencia-roque-saenz-pena", name: "Presidencia Roque Sáenz Peña", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Segunda ciudad del Chaco, conocida como La Termal por sus aguas termales.",
    keyThemes: ["Termas", "Chaco", "Agro"],
    sourceNote: "Fundada el 1 de marzo de 1912.",
    events: [
      {
        id: "presidencia-roque-saenz-pena-fundacion", type: "fundacion", label: "Fundación",
        date: "1912-03-01", year: 1912,
        description: "Se funda Presidencia Roque Sáenz Peña.",
        source: "Wikidata Q1656936 + Wikipedia (es): Presidencia Roque Sáenz Peña", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "puerto-piramides", name: "Puerto Pirámides", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Única localidad de la península Valdés, en Chubut, base para avistar ballenas en el golfo Nuevo.",
    keyThemes: ["Patagonia", "Ballenas", "Mar", "Turismo"],
    sourceNote: "Fundada el 14 de julio de 1900.",
    events: [
      {
        id: "puerto-piramides-fundacion", type: "fundacion", label: "Fundación",
        date: "1900-07-14", year: 1900,
        description: "Se funda Puerto Pirámides.",
        source: "Wikidata Q516860 + Wikipedia (es): Puerto Pirámides", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "punta-alta", name: "Punta Alta", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del sudoeste bonaerense, vecina de la Base Naval Puerto Belgrano, la mayor de la Armada Argentina.",
    keyThemes: ["Puerto", "Armada", "Costa atlántica"],
    sourceNote: "Fundada el 2 de julio de 1898.",
    events: [
      {
        id: "punta-alta-fundacion", type: "fundacion", label: "Fundación",
        date: "1898-07-02", year: 1898,
        description: "Se funda Punta Alta.",
        source: "Wikidata Q603592 + Wikipedia (es): Punta Alta", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "quitilipi", name: "Quitilipi", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del centro del Chaco, cabecera del departamento homónimo.",
    keyThemes: ["Chaco", "Agro"],
    sourceNote: "Fundada el 30 de noviembre de 1912.",
    events: [
      {
        id: "quitilipi-fundacion", type: "fundacion", label: "Fundación",
        date: "1912-11-30", year: 1912,
        description: "Se funda Quitilipi.",
        source: "Wikidata Q1656947 + Wikipedia (es): Quitilipi", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "rafael-calzada", name: "Rafael Calzada", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Localidad del partido de Almirante Brown, en el sur del Gran Buenos Aires.",
    keyThemes: ["Gran Buenos Aires", "Ferrocarril"],
    sourceNote: "Fundada el 18 de julio de 1909.",
    events: [
      {
        id: "rafael-calzada-fundacion", type: "fundacion", label: "Fundación",
        date: "1909-07-18", year: 1909,
        description: "Se funda Rafael Calzada.",
        source: "Wikidata Q2195778 + Wikipedia (es): Rafael Calzada", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "reconquista", name: "Reconquista", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Cabecera del departamento General Obligado, en el nordeste de Santa Fe, junto a la Ruta Nacional 11 y el río Paraná.",
    keyThemes: ["Litoral", "Río", "Agro"],
    sourceNote: "Fundada el 27 de abril de 1872.",
    events: [
      {
        id: "reconquista-fundacion", type: "fundacion", label: "Fundación",
        date: "1872-04-27", year: 1872,
        description: "Se funda Reconquista.",
        source: "Wikidata Q933165 + Wikipedia (es): Reconquista (ciudad)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-carlos-de-bolivar", name: "San Carlos de Bolívar", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del centro-noroeste de la provincia de Buenos Aires, cabecera del partido de Bolívar.",
    keyThemes: ["Pampa", "Agro"],
    sourceNote: "Fundada el 2 de marzo de 1878.",
    events: [
      {
        id: "san-carlos-de-bolivar-fundacion", type: "fundacion", label: "Fundación",
        date: "1878-03-02", year: 1878,
        description: "Se funda San Carlos de Bolívar.",
        source: "Wikidata Q1884316 + Wikipedia (es): San Carlos de Bolívar", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-isidro", name: "San Isidro", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Cabecera del partido de San Isidro, en la zona norte del Gran Buenos Aires, sobre el Río de la Plata.",
    keyThemes: ["Gran Buenos Aires", "Colonial", "Río"],
    sourceNote: "Fundada el 14 de octubre de 1706.",
    events: [
      {
        id: "san-isidro-fundacion", type: "fundacion", label: "Fundación",
        date: "1706-10-14", year: 1706,
        description: "Se funda San Isidro.",
        source: "Wikidata Q2164117 + Wikipedia (es): San Isidro (Buenos Aires)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-justo", name: "San Justo", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Cabecera del partido de La Matanza, en el oeste del Gran Buenos Aires, sede de la Universidad Nacional de La Matanza.",
    keyThemes: ["Gran Buenos Aires", "Universidad"],
    sourceNote: "Fundada el 25 de diciembre de 1856.",
    events: [
      {
        id: "san-justo-fundacion", type: "fundacion", label: "Fundación",
        date: "1856-12-25", year: 1856,
        description: "Se funda San Justo.",
        source: "Wikidata Q2466841 + Wikipedia (es): San Justo (Buenos Aires)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-martin-de-los-andes", name: "San Martín de los Andes", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad cordillerana del sur del Neuquén, a orillas del lago Lácar, puerta del Parque Nacional Lanín y del cerro Chapelco.",
    keyThemes: ["Patagonia", "Lagos", "Montaña", "Nieve", "Turismo"],
    sourceNote: "Fundada el 4 de febrero de 1898.",
    events: [
      {
        id: "san-martin-de-los-andes-fundacion", type: "fundacion", label: "Fundación",
        date: "1898-02-04", year: 1898,
        description: "Se funda San Martín de los Andes.",
        source: "Wikipedia (es): San Martín de los Andes + Noticias NQN (aniversario oficial, 2024)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tapiales", name: "Tapiales", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Localidad del partido de La Matanza, en el Gran Buenos Aires.",
    keyThemes: ["Gran Buenos Aires"],
    sourceNote: "Fundada el 22 de enero de 1902.",
    events: [
      {
        id: "tapiales-fundacion", type: "fundacion", label: "Fundación",
        date: "1902-01-22", year: 1902,
        description: "Se funda Tapiales.",
        source: "Wikidata Q7684607 + Wikipedia (es): Tapiales", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "trelew", name: "Trelew", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del valle inferior del río Chubut, fundada por colonos galeses junto al ferrocarril.",
    keyThemes: ["Patagonia", "Inmigración", "Ferrocarril"],
    sourceNote: "Fundada el 20 de octubre de 1886.",
    events: [
      {
        id: "trelew-fundacion", type: "fundacion", label: "Fundación",
        date: "1886-10-20", year: 1886,
        description: "Se funda Trelew.",
        source: "Wikidata Q1009276 + Wikipedia (es): Trelew", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tres-arroyos", name: "Tres Arroyos", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del sur bonaerense, cerca de la costa, que recibió una fuerte inmigración europea a fines del siglo XIX.",
    keyThemes: ["Pampa", "Agro", "Inmigración"],
    sourceNote: "Fundada el 24 de abril de 1884.",
    events: [
      {
        id: "tres-arroyos-fundacion", type: "fundacion", label: "Fundación",
        date: "1884-04-24", year: 1884,
        description: "Se funda Tres Arroyos.",
        source: "Wikidata Q2077013 + Wikipedia (es): Tres Arroyos", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "victoria", name: "Victoria", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad entrerriana frente a Rosario, sobre las islas del Paraná, llamada La Matanza hasta 1829.",
    keyThemes: ["Litoral", "Río", "Historia"],
    sourceNote: "Fundada el 13 de mayo de 1810.",
    events: [
      {
        id: "victoria-fundacion", type: "fundacion", label: "Fundación",
        date: "1810-05-13", year: 1810,
        description: "Se funda Victoria.",
        source: "Wikidata Q1905080 + Wikipedia (es): Victoria (Entre Ríos)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villa-adelina", name: "Villa Adelina", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Localidad del norte del Gran Buenos Aires, repartida entre San Isidro y Vicente López, nacida con la llegada del ferrocarril.",
    keyThemes: ["Gran Buenos Aires", "Ferrocarril"],
    sourceNote: "Fundada el 29 de marzo de 1909.",
    events: [
      {
        id: "villa-adelina-fundacion", type: "fundacion", label: "Fundación",
        date: "1909-03-29", year: 1909,
        description: "Se funda Villa Adelina.",
        source: "Wikidata Q2276572 + Wikipedia (es): Villa Adelina", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villa-constitucion", name: "Villa Constitución", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad portuaria del sudeste de Santa Fe, sobre el río Paraná, con fuerte industria siderúrgica.",
    keyThemes: ["Puerto", "Industria", "Río"],
    sourceNote: "Fundada el 14 de febrero de 1858.",
    events: [
      {
        id: "villa-constitucion-fundacion", type: "fundacion", label: "Fundación",
        date: "1858-02-14", year: 1858,
        description: "Se funda Villa Constitución.",
        source: "Wikidata Q2584195 + Wikipedia (es): Villa Constitución", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villa-dolores", name: "Villa Dolores", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Principal ciudad del valle de Traslasierra, en el oeste de la provincia de Córdoba.",
    keyThemes: ["Sierras", "Valle", "Turismo"],
    sourceNote: "Fundada el 21 de abril de 1853.",
    events: [
      {
        id: "villa-dolores-fundacion", type: "fundacion", label: "Fundación",
        date: "1853-04-21", year: 1853,
        description: "Se funda Villa Dolores.",
        source: "Wikidata Q374013 + Wikipedia (es): Villa Dolores (Córdoba)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villa-general-belgrano", name: "Villa General Belgrano", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Villa serrana del valle de Calamuchita, en Córdoba, de tradición alemana y famosa por su Oktoberfest.",
    keyThemes: ["Sierras", "Inmigración", "Cerveza", "Turismo"],
    sourceNote: "Fundada el 11 de octubre de 1932.",
    events: [
      {
        id: "villa-general-belgrano-fundacion", type: "fundacion", label: "Fundación",
        date: "1932-10-11", year: 1932,
        description: "Se funda Villa General Belgrano.",
        source: "Wikidata Q1013424 + Wikipedia (es): Villa General Belgrano", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villa-gesell", name: "Villa Gesell", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad balnearia bonaerense nacida entre médanos y pinares que forestó su fundador, Carlos Gesell.",
    keyThemes: ["Costa atlántica", "Playa", "Bosque", "Turismo"],
    sourceNote: "Fundada el 14 de diciembre de 1931.",
    events: [
      {
        id: "villa-gesell-fundacion", type: "fundacion", label: "Fundación",
        date: "1931-12-14", year: 1931,
        description: "Se funda Villa Gesell.",
        source: "Wikidata Q991574 + Wikipedia (es): Villa Gesell", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villa-la-angostura", name: "Villa La Angostura", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Villa de montaña en el norte del Parque Nacional Nahuel Huapi, en Neuquén, a orillas del lago Nahuel Huapi.",
    keyThemes: ["Patagonia", "Lagos", "Montaña", "Turismo"],
    sourceNote: "Fundada el 15 de mayo de 1932.",
    events: [
      {
        id: "villa-la-angostura-fundacion", type: "fundacion", label: "Fundación",
        date: "1932-05-15", year: 1932,
        description: "Se funda Villa La Angostura.",
        source: "Wikidata Q106096 + Wikipedia (es): Villa La Angostura", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villa-regina", name: "Villa Regina", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Ciudad del Alto Valle de Río Negro, fundada por colonos italianos y conocida por su Fiesta de la Vendimia.",
    keyThemes: ["Patagonia", "Fruticultura", "Inmigración", "Vino"],
    sourceNote: "Fundada el 7 de noviembre de 1924.",
    events: [
      {
        id: "villa-regina-fundacion", type: "fundacion", label: "Fundación",
        date: "1924-11-07", year: 1924,
        description: "Se funda Villa Regina.",
        source: "Wikidata Q1017096 + Wikipedia (es): Villa Regina", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villaguay", name: "Villaguay", type: "city", country: "Argentina", emoji: "🇦🇷",
    description: "Santa Rosa de Villaguay, cabecera del departamento homónimo en el centro de Entre Ríos.",
    keyThemes: ["Litoral", "Agro"],
    sourceNote: "Fundada el 20 de noviembre de 1823.",
    events: [
      {
        id: "villaguay-fundacion", type: "fundacion", label: "Fundación",
        date: "1823-11-20", year: 1823,
        description: "Se funda Villaguay.",
        source: "Wikidata Q2297707 + Wikipedia (es): Villaguay", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "coyhaique", name: "Coyhaique", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Capital de la región de Aysén, principal ciudad de la Patagonia chilena continental.",
    keyThemes: ["Patagonia", "Montaña", "Capital"],
    sourceNote: "Fundada el 12 de octubre de 1929.",
    events: [
      {
        id: "coyhaique-fundacion", type: "fundacion", label: "Fundación",
        date: "1929-10-12", year: 1929,
        description: "Se funda Coyhaique.",
        source: "Wikidata Q3810 + Wikipedia (es): Coyhaique", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "frutillar", name: "Frutillar", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Ciudad a orillas del lago Llanquihue, fundada por colonos alemanes, con vista a los volcanes Osorno y Calbuco.",
    keyThemes: ["Lagos", "Volcán", "Inmigración", "Turismo"],
    sourceNote: "Fundada el 23 de noviembre de 1856.",
    events: [
      {
        id: "frutillar-fundacion", type: "fundacion", label: "Fundación",
        date: "1856-11-23", year: 1856,
        description: "Se funda Frutillar.",
        source: "Wikidata Q13058 + Wikipedia (es): Frutillar", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "linares", name: "Linares", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Fundada como Villa San Ambrosio de Linares, capital de la provincia homónima y centro agrícola del Maule.",
    keyThemes: ["Valle central", "Agro", "Colonial"],
    sourceNote: "Fundada el 23 de mayo de 1794.",
    events: [
      {
        id: "linares-fundacion", type: "fundacion", label: "Fundación",
        date: "1794-05-23", year: 1794,
        description: "Se funda Linares.",
        source: "Wikidata Q14494 + Wikipedia (es): Linares (Chile)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "providencia", name: "Providencia", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Comuna del nororiente de Santiago de Chile, con barrios residenciales y comerciales de la capital.",
    keyThemes: ["Capital", "Comercio", "Barrio"],
    sourceNote: "Creada el 25 de febrero de 1897.",
    events: [
      {
        id: "providencia-fundacion", type: "fundacion", label: "Creación de la comuna",
        date: "1897-02-25", year: 1897,
        description: "Se crea la comuna de Providencia.",
        source: "Wikidata Q51587 + Wikipedia (es): Providencia (Chile)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "pucon", name: "Pucón", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Ciudad de la Araucanía a orillas del lago Villarrica y al pie del volcán, uno de los grandes destinos del sur chileno.",
    keyThemes: ["Lagos", "Volcán", "Montaña", "Turismo"],
    sourceNote: "Fundada el 27 de febrero de 1883.",
    events: [
      {
        id: "pucon-fundacion", type: "fundacion", label: "Fundación",
        date: "1883-02-27", year: 1883,
        description: "Se funda Pucón.",
        source: "Wikidata Q51590 + Wikipedia (es): Pucón", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "quillota", name: "Quillota", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Capital de la provincia de Quillota, con el cementerio más antiguo y el primer hospital de Chile.",
    keyThemes: ["Historia", "Valle", "Agro"],
    sourceNote: "Fundada el 11 de noviembre de 1717.",
    events: [
      {
        id: "quillota-fundacion", type: "fundacion", label: "Fundación",
        date: "1717-11-11", year: 1717,
        description: "Se funda Quillota.",
        source: "Wikidata Q56108 + Wikipedia (es): Quillota", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "salamanca-cl", name: "Salamanca", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Ciudad del Norte Chico, en el extremo sureste de la Región de Coquimbo, en el valle del Choapa.",
    keyThemes: ["Valle", "Minería", "Norte"],
    sourceNote: "Fundada el 29 de noviembre de 1844.",
    events: [
      {
        id: "salamanca-cl-fundacion", type: "fundacion", label: "Fundación",
        date: "1844-11-29", year: 1844,
        description: "Se funda Salamanca.",
        source: "Wikidata Q56134 + Wikipedia (es): Salamanca (Chile)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-javier-de-loncomilla", name: "San Javier de Loncomilla", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Ciudad del Maule, en la provincia de Linares, en la zona central de Chile.",
    keyThemes: ["Valle central", "Vino", "Agro"],
    sourceNote: "Fundada el 18 de noviembre de 1852.",
    events: [
      {
        id: "san-javier-de-loncomilla-fundacion", type: "fundacion", label: "Fundación",
        date: "1852-11-18", year: 1852,
        description: "Se funda San Javier de Loncomilla.",
        source: "Wikidata Q187831 + Wikipedia (es): San Javier de Loncomilla", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "victoria-cl", name: "Victoria", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Ciudad de la Araucanía, en la provincia de Malleco, en el sur de Chile.",
    keyThemes: ["Sur", "Agro", "Araucanía"],
    sourceNote: "Fundada el 28 de marzo de 1881.",
    events: [
      {
        id: "victoria-cl-fundacion", type: "fundacion", label: "Fundación",
        date: "1881-03-28", year: 1881,
        description: "Se funda Victoria.",
        source: "Wikidata Q200999 + Wikipedia (es): Victoria (Chile)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villa-alemana", name: "Villa Alemana", type: "city", country: "Chile", emoji: "🇨🇱",
    description: "Ciudad de la provincia de Marga Marga, parte del Gran Valparaíso.",
    keyThemes: ["Valle", "Ferrocarril"],
    sourceNote: "Fundada el 4 de noviembre de 1894.",
    events: [
      {
        id: "villa-alemana-fundacion", type: "fundacion", label: "Fundación",
        date: "1894-11-04", year: 1894,
        description: "Se funda Villa Alemana.",
        source: "Wikidata Q174744 + Wikipedia (es): Villa Alemana", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "abejorral", name: "Abejorral", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del oriente antioqueño, uno de los pueblos patrimonio de Colombia.",
    keyThemes: ["Antioquia", "Patrimonio", "Café"],
    sourceNote: "Fundada el 15 de enero de 1811.",
    events: [
      {
        id: "abejorral-fundacion", type: "fundacion", label: "Fundación",
        date: "1811-01-15", year: 1811,
        description: "Se funda Abejorral.",
        source: "Wikidata Q1441947 + Wikipedia (es): Abejorral", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "aguazul", name: "Aguazul", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de Casanare, gran productor de arroz en los Llanos Orientales.",
    keyThemes: ["Llanos", "Arroz", "Petróleo"],
    sourceNote: "Fundada el 5 de abril de 1954.",
    events: [
      {
        id: "aguazul-fundacion", type: "fundacion", label: "Fundación",
        date: "1954-04-05", year: 1954,
        description: "Se funda Aguazul.",
        source: "Wikidata Q13663 + Wikipedia (es): Aguazul", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "aipe", name: "Aipe", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del noroccidente del Huila, a orillas del río Magdalena.",
    keyThemes: ["Río", "Agro"],
    sourceNote: "Fundada el 2 de enero de 1741.",
    events: [
      {
        id: "aipe-fundacion", type: "fundacion", label: "Fundación",
        date: "1741-01-02", year: 1741,
        description: "Se funda Aipe.",
        source: "Wikidata Q1524884 + Wikipedia (es): Aipe", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "anserma", name: "Anserma", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Santa Ana de los Caballeros, una de las fundaciones más antiguas del Eje Cafetero, en el occidente de Caldas.",
    keyThemes: ["Eje Cafetero", "Café", "Colonial"],
    sourceNote: "Fundada el 15 de agosto de 1539.",
    events: [
      {
        id: "anserma-fundacion", type: "fundacion", label: "Fundación",
        date: "1539-08-15", year: 1539,
        description: "Se funda Anserma.",
        source: "Wikidata Q547678 + Wikipedia (es): Anserma", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "aracataca", name: "Aracataca", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Pueblo del Magdalena donde nació Gabriel García Márquez, inspiración del Macondo de Cien años de soledad.",
    keyThemes: ["Literatura", "Caribe", "Cultura"],
    sourceNote: "Fundada el 24 de junio de 1885.",
    events: [
      {
        id: "aracataca-fundacion", type: "fundacion", label: "Fundación",
        date: "1885-06-24", year: 1885,
        description: "Se funda Aracataca.",
        source: "Wikidata Q624492 + Wikipedia (es): Aracataca", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "baranoa", name: "Baranoa", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del Atlántico, en la región Caribe colombiana, conocido por su Festival de Orquestas.",
    keyThemes: ["Caribe", "Música", "Agro"],
    sourceNote: "Fundada el 26 de julio de 1543.",
    events: [
      {
        id: "baranoa-fundacion", type: "fundacion", label: "Fundación",
        date: "1543-07-26", year: 1543,
        description: "Se funda Baranoa.",
        source: "Wikidata Q979097 + Wikipedia (es): Baranoa", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "barbosa", name: "Barbosa", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del norte del valle de Aburrá, en Antioquia.",
    keyThemes: ["Antioquia", "Valle"],
    sourceNote: "Fundada el 25 de agosto de 1795.",
    events: [
      {
        id: "barbosa-fundacion", type: "fundacion", label: "Fundación",
        date: "1795-08-25", year: 1795,
        description: "Se funda Barbosa.",
        source: "Wikidata Q1946659 + Wikipedia (es): Barbosa (Antioquia)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "cajica", name: "Cajicá", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de la Sabana Centro, a 17 km al norte de Bogotá.",
    keyThemes: ["Sabana de Bogotá", "Agro"],
    sourceNote: "Fundada el 22 de marzo de 1537.",
    events: [
      {
        id: "cajica-fundacion", type: "fundacion", label: "Fundación",
        date: "1537-03-22", year: 1537,
        description: "Se funda Cajicá.",
        source: "Wikidata Q1093182 + Wikipedia (es): Cajicá", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "caucasia", name: "Caucasia", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Capital del Bajo Cauca antioqueño, principal centro comercial de la subregión.",
    keyThemes: ["Río", "Comercio", "Antioquia"],
    sourceNote: "Fundada el 12 de abril de 1886.",
    events: [
      {
        id: "caucasia-fundacion", type: "fundacion", label: "Fundación",
        date: "1886-04-12", year: 1886,
        description: "Se funda Caucasia.",
        source: "Wikidata Q511705 + Wikipedia (es): Caucasia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "cienaga-de-oro", name: "Ciénaga de Oro", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del Medio Sinú, en el departamento de Córdoba.",
    keyThemes: ["Caribe", "Agro", "Río"],
    sourceNote: "Fundada el 15 de diciembre de 1776.",
    events: [
      {
        id: "cienaga-de-oro-fundacion", type: "fundacion", label: "Fundación",
        date: "1776-12-15", year: 1776,
        description: "Se funda Ciénaga de Oro.",
        source: "Wikidata Q2069794 + Wikipedia (es): Ciénaga de Oro", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "cogua", name: "Cogua", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de la Sabana Centro conocido por el embalse del Neusa.",
    keyThemes: ["Sabana de Bogotá", "Embalse", "Turismo"],
    sourceNote: "Fundada el 23 de agosto de 1604.",
    events: [
      {
        id: "cogua-fundacion", type: "fundacion", label: "Fundación",
        date: "1604-08-23", year: 1604,
        description: "Se funda Cogua.",
        source: "Wikidata Q1524844 + Wikipedia (es): Cogua", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "cota", name: "Cota", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de la Sabana Centro, a 15 km de Bogotá, en el altiplano cundiboyacense.",
    keyThemes: ["Sabana de Bogotá", "Agro"],
    sourceNote: "Fundada el 29 de noviembre de 1604.",
    events: [
      {
        id: "cota-fundacion", type: "fundacion", label: "Fundación",
        date: "1604-11-29", year: 1604,
        description: "Se funda Cota.",
        source: "Wikidata Q579820 + Wikipedia (es): Cota (Cundinamarca)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "el-charco", name: "El Charco", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de Nariño en la desembocadura del río Tapaje, sobre el océano Pacífico.",
    keyThemes: ["Pacífico", "Río"],
    sourceNote: "Fundada el 16 de octubre de 1886.",
    events: [
      {
        id: "el-charco-fundacion", type: "fundacion", label: "Fundación",
        date: "1886-10-16", year: 1886,
        description: "Se funda El Charco.",
        source: "Wikidata Q1441184 + Wikipedia (es): El Charco (Nariño)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "el-paujil", name: "El Paujil", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del occidente del Caquetá, en la Amazonía colombiana.",
    keyThemes: ["Amazonía", "Agro"],
    sourceNote: "Fundada el 24 de noviembre de 1955.",
    events: [
      {
        id: "el-paujil-fundacion", type: "fundacion", label: "Fundación",
        date: "1955-11-24", year: 1955,
        description: "Se funda El Paujil.",
        source: "Wikidata Q13998 + Wikipedia (es): El Paujil", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "envigado", name: "Envigado", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del sur del valle de Aburrá, conurbado con Medellín.",
    keyThemes: ["Antioquia", "Valle", "Comercio"],
    sourceNote: "Fundada el 14 de julio de 1775.",
    events: [
      {
        id: "envigado-fundacion", type: "fundacion", label: "Fundación",
        date: "1775-07-14", year: 1775,
        description: "Se funda Envigado.",
        source: "Wikidata Q1447266 + Wikipedia (es): Envigado", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "facatativa", name: "Facatativá", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Capital de la provincia de Sabana Occidente, en el área metropolitana de Bogotá.",
    keyThemes: ["Sabana de Bogotá", "Agro", "Historia"],
    sourceNote: "Fundada el 3 de julio de 1600.",
    events: [
      {
        id: "facatativa-fundacion", type: "fundacion", label: "Fundación",
        date: "1600-07-03", year: 1600,
        description: "Se funda Facatativá.",
        source: "Wikidata Q1947594 + Wikipedia (es): Facatativá", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "floridablanca", name: "Floridablanca", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de Santander conurbado con Bucaramanga, cuna de las obleas.",
    keyThemes: ["Santander", "Andes", "Comercio"],
    sourceNote: "Fundada el 7 de noviembre de 1817.",
    events: [
      {
        id: "floridablanca-fundacion", type: "fundacion", label: "Fundación",
        date: "1817-11-07", year: 1817,
        description: "Se funda Floridablanca.",
        source: "Wikidata Q1006661 + Wikipedia (es): Floridablanca (Colombia)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "fusagasuga", name: "Fusagasugá", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Capital de la provincia del Sumapaz, el segundo municipio más poblado de Cundinamarca.",
    keyThemes: ["Clima templado", "Turismo", "Agro"],
    sourceNote: "Fundada el 5 de febrero de 1592.",
    events: [
      {
        id: "fusagasuga-fundacion", type: "fundacion", label: "Fundación",
        date: "1592-02-05", year: 1592,
        description: "Se funda Fusagasugá.",
        source: "Wikidata Q2077525 + Wikipedia (es): Fusagasugá", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "gigante", name: "Gigante", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del centro del Huila, sobre el río Magdalena, en la región andina.",
    keyThemes: ["Andes", "Río", "Café"],
    sourceNote: "Fundada el 17 de septiembre de 1782.",
    events: [
      {
        id: "gigante-fundacion", type: "fundacion", label: "Fundación",
        date: "1782-09-17", year: 1782,
        description: "Se funda Gigante.",
        source: "Wikidata Q919595 + Wikipedia (es): Gigante (Huila)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "guapi", name: "Guapi", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del litoral Pacífico del Cauca, fundado por colonos en el Firme del Barro.",
    keyThemes: ["Pacífico", "Río", "Música"],
    sourceNote: "Fundada el 11 de diciembre de 1772.",
    events: [
      {
        id: "guapi-fundacion", type: "fundacion", label: "Fundación",
        date: "1772-12-11", year: 1772,
        description: "Se funda Guapi.",
        source: "Wikidata Q2432113 + Wikipedia (es): Guapi", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "honda-co", name: "Honda", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Ciudad de puentes sobre el río Magdalena, en el norte del Tolima, parte de la Red de Pueblos Patrimonio de Colombia.",
    keyThemes: ["Río", "Colonial", "Patrimonio", "Turismo"],
    sourceNote: "Fundada el 24 de agosto de 1539.",
    events: [
      {
        id: "honda-co-fundacion", type: "fundacion", label: "Fundación",
        date: "1539-08-24", year: 1539,
        description: "Se funda Honda.",
        source: "Wikidata Q932513 + Wikipedia (es): Honda (Tolima)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "la-calera", name: "La Calera", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de Cundinamarca a 16 km de Bogotá, en el páramo de la cordillera Oriental.",
    keyThemes: ["Montaña", "Páramo", "Turismo"],
    sourceNote: "Fundada el 16 de diciembre de 1772.",
    events: [
      {
        id: "la-calera-fundacion", type: "fundacion", label: "Fundación",
        date: "1772-12-16", year: 1772,
        description: "Se funda La Calera.",
        source: "Wikidata Q1440823 + Wikipedia (es): La Calera (Cundinamarca)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "la-mesa", name: "La Mesa", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Capital de la provincia del Tequendama, en Cundinamarca, a 54 km de Bogotá.",
    keyThemes: ["Clima cálido", "Agro", "Turismo"],
    sourceNote: "Fundada el 12 de marzo de 1777.",
    events: [
      {
        id: "la-mesa-fundacion", type: "fundacion", label: "Fundación",
        date: "1777-03-12", year: 1777,
        description: "Se funda La Mesa.",
        source: "Wikidata Q936790 + Wikipedia (es): La Mesa (Cundinamarca)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "la-tebaida", name: "La Tebaida", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del Quindío donde funcionan el Aeropuerto Internacional El Edén y la Zona Franca del Quindío.",
    keyThemes: ["Eje Cafetero", "Café", "Aeropuerto"],
    sourceNote: "Fundada el 14 de agosto de 1916.",
    events: [
      {
        id: "la-tebaida-fundacion", type: "fundacion", label: "Fundación",
        date: "1916-08-14", year: 1916,
        description: "Se funda La Tebaida.",
        source: "Wikidata Q2432300 + Wikipedia (es): La Tebaida", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "malambo", name: "Malambo", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del área metropolitana de Barranquilla, en el Atlántico.",
    keyThemes: ["Caribe", "Río"],
    sourceNote: "Fundada el 30 de agosto de 1531.",
    events: [
      {
        id: "malambo-fundacion", type: "fundacion", label: "Fundación",
        date: "1531-08-30", year: 1531,
        description: "Se funda Malambo.",
        source: "Wikidata Q568597 + Wikipedia (es): Malambo (Atlántico)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "mariquita", name: "Mariquita", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "San Sebastián de Mariquita, municipio del norte del Tolima donde vivió José Celestino Mutis durante la Expedición Botánica.",
    keyThemes: ["Colonial", "Historia", "Ciencia"],
    sourceNote: "Fundada el 28 de agosto de 1551.",
    events: [
      {
        id: "mariquita-fundacion", type: "fundacion", label: "Fundación",
        date: "1551-08-28", year: 1551,
        description: "Se funda Mariquita.",
        source: "Wikidata Q532572 + Wikipedia (es): Mariquita (Tolima)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "monitos", name: "Moñitos", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de Córdoba a orillas del mar Caribe, a 78 km de Montería.",
    keyThemes: ["Caribe", "Playa"],
    sourceNote: "Fundada el 17 de febrero de 1740.",
    events: [
      {
        id: "monitos-fundacion", type: "fundacion", label: "Fundación",
        date: "1740-02-17", year: 1740,
        description: "Se funda Moñitos.",
        source: "Wikidata Q1441218 + Wikipedia (es): Moñitos", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "paipa", name: "Paipa", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Villa de San Miguel Arcángel de Paipa, en Boyacá, conocida por sus aguas termales y el Pantano de Vargas.",
    keyThemes: ["Termas", "Historia", "Boyacá"],
    sourceNote: "Fundada el 19 de febrero de 1602.",
    events: [
      {
        id: "paipa-fundacion", type: "fundacion", label: "Fundación",
        date: "1602-02-19", year: 1602,
        description: "Se funda Paipa.",
        source: "Wikidata Q1391867 + Wikipedia (es): Paipa", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "pamplona", name: "Pamplona", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Ciudad de Norte de Santander, antigua capital de provincia, conocida por su Semana Santa.",
    keyThemes: ["Andes", "Colonial", "Universidad"],
    sourceNote: "Fundada el 1 de noviembre de 1549.",
    events: [
      {
        id: "pamplona-fundacion", type: "fundacion", label: "Fundación",
        date: "1549-11-01", year: 1549,
        description: "Se funda Pamplona.",
        source: "Wikidata Q997796 + Wikipedia (es): Pamplona (Colombia)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "pitalito", name: "Pitalito", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del sur del Huila en el valle del alto Magdalena, gran productor de café.",
    keyThemes: ["Café", "Valle", "Andes"],
    sourceNote: "Fundada el 13 de junio de 1818.",
    events: [
      {
        id: "pitalito-fundacion", type: "fundacion", label: "Fundación",
        date: "1818-06-13", year: 1818,
        description: "Se funda Pitalito.",
        source: "Wikidata Q1014922 + Wikipedia (es): Pitalito", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "ponedera", name: "Ponedera", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del Atlántico, a orillas del río Magdalena.",
    keyThemes: ["Caribe", "Río"],
    sourceNote: "Fundada el 23 de noviembre de 1743.",
    events: [
      {
        id: "ponedera-fundacion", type: "fundacion", label: "Fundación",
        date: "1743-11-23", year: 1743,
        description: "Se funda Ponedera.",
        source: "Wikidata Q512871 + Wikipedia (es): Ponedera", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "puerto-colombia", name: "Puerto Colombia", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del Atlántico sobre el mar Caribe, con un muelle histórico que fue la puerta de entrada al país.",
    keyThemes: ["Caribe", "Playa", "Puerto", "Historia"],
    sourceNote: "Fundada el 31 de diciembre de 1888.",
    events: [
      {
        id: "puerto-colombia-fundacion", type: "fundacion", label: "Fundación",
        date: "1888-12-31", year: 1888,
        description: "Se funda Puerto Colombia.",
        source: "Wikidata Q2186176 + Wikipedia (es): Puerto Colombia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "puerto-lopez", name: "Puerto López", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Uno de los principales puertos fluviales sobre el río Meta, conocido como el ombligo de Colombia.",
    keyThemes: ["Llanos", "Río", "Puerto"],
    sourceNote: "Fundada el 1 de mayo de 1935.",
    events: [
      {
        id: "puerto-lopez-fundacion", type: "fundacion", label: "Fundación",
        date: "1935-05-01", year: 1935,
        description: "Se funda Puerto López.",
        source: "Wikidata Q2143650 + Wikipedia (es): Puerto López (Colombia)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "rionegro", name: "Rionegro", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de Santander a 19 km de Bucaramanga, fundado como Santa Bárbara de Rionegro.",
    keyThemes: ["Santander", "Andes", "Agro"],
    sourceNote: "Fundada el 5 de mayo de 1805.",
    events: [
      {
        id: "rionegro-fundacion", type: "fundacion", label: "Fundación",
        date: "1805-05-05", year: 1805,
        description: "Se funda Rionegro.",
        source: "Wikidata Q2433619 + Wikipedia (es): Rionegro (Santander)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "riosucio", name: "Riosucio", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del Alto Occidente de Caldas, conocido por su Carnaval del Diablo.",
    keyThemes: ["Carnaval", "Eje Cafetero", "Cultura"],
    sourceNote: "Fundada el 7 de agosto de 1819.",
    events: [
      {
        id: "riosucio-fundacion", type: "fundacion", label: "Fundación",
        date: "1819-08-07", year: 1819,
        description: "Se funda Riosucio.",
        source: "Wikidata Q1093015 + Wikipedia (es): Riosucio (Caldas)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-gil", name: "San Gil", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Principal centro urbano del sur de Santander, capital del turismo de aventura en Colombia.",
    keyThemes: ["Aventura", "Río", "Colonial", "Turismo"],
    sourceNote: "Fundada el 17 de marzo de 1689.",
    events: [
      {
        id: "san-gil-fundacion", type: "fundacion", label: "Fundación",
        date: "1689-03-17", year: 1689,
        description: "Se funda San Gil.",
        source: "Wikidata Q1294128 + Wikipedia (es): San Gil (Colombia)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-vicente-de-chucuri", name: "San Vicente de Chucurí", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de Santander, gran productor de cacao, a 87 km de Bucaramanga.",
    keyThemes: ["Cacao", "Santander", "Andes"],
    sourceNote: "Fundada el 7 de septiembre de 1876.",
    events: [
      {
        id: "san-vicente-de-chucuri-fundacion", type: "fundacion", label: "Fundación",
        date: "1876-09-07", year: 1876,
        description: "Se funda San Vicente de Chucurí.",
        source: "Wikidata Q1256417 + Wikipedia (es): San Vicente de Chucurí", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "santa-fe-de-antioquia", name: "Santa Fe de Antioquia", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Primera capital de Antioquia, con un centro colonial declarado monumento nacional.",
    keyThemes: ["Colonial", "Patrimonio", "Antioquia", "Turismo"],
    sourceNote: "Fundada el 4 de diciembre de 1541.",
    events: [
      {
        id: "santa-fe-de-antioquia-fundacion", type: "fundacion", label: "Fundación",
        date: "1541-12-04", year: 1541,
        description: "Se funda Santa Fe de Antioquia.",
        source: "Wikidata Q927703 + Wikipedia (es): Santa Fe de Antioquia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "silvania", name: "Silvania", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de la provincia del Sumapaz, a 44 km de Bogotá.",
    keyThemes: ["Clima templado", "Agro"],
    sourceNote: "Fundada el 21 de febrero de 1935.",
    events: [
      {
        id: "silvania-fundacion", type: "fundacion", label: "Fundación",
        date: "1935-02-21", year: 1935,
        description: "Se funda Silvania.",
        source: "Wikidata Q1441993 + Wikipedia (es): Silvania", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "soledad", name: "Soledad", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Uno de los municipios más poblados de Colombia, conurbado con Barranquilla.",
    keyThemes: ["Caribe", "Río", "Comercio"],
    sourceNote: "Fundada el 8 de marzo de 1598.",
    events: [
      {
        id: "soledad-fundacion", type: "fundacion", label: "Fundación",
        date: "1598-03-08", year: 1598,
        description: "Se funda Soledad.",
        source: "Wikidata Q767071 + Wikipedia (es): Soledad (Atlántico)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "sopo", name: "Sopó", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de la Sabana Centro, a 39 km de Bogotá, conocido por su tradición lechera.",
    keyThemes: ["Sabana de Bogotá", "Lácteos", "Turismo"],
    sourceNote: "Fundada el 25 de mayo de 1653.",
    events: [
      {
        id: "sopo-fundacion", type: "fundacion", label: "Fundación",
        date: "1653-05-25", year: 1653,
        description: "Se funda Sopó.",
        source: "Wikidata Q1440902 + Wikipedia (es): Sopó", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tabio", name: "Tabio", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de la Sabana Centro, a 31 km de Bogotá.",
    keyThemes: ["Sabana de Bogotá", "Agro"],
    sourceNote: "Fundada el 8 de abril de 1603.",
    events: [
      {
        id: "tabio-fundacion", type: "fundacion", label: "Fundación",
        date: "1603-04-08", year: 1603,
        description: "Se funda Tabio.",
        source: "Wikidata Q1441966 + Wikipedia (es): Tabio", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tenjo", name: "Tenjo", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de la Sabana Centro, a 28 km de Bogotá.",
    keyThemes: ["Sabana de Bogotá", "Agro"],
    sourceNote: "Fundada el 8 de abril de 1603.",
    events: [
      {
        id: "tenjo-fundacion", type: "fundacion", label: "Fundación",
        date: "1603-04-08", year: 1603,
        description: "Se funda Tenjo.",
        source: "Wikidata Q1525701 + Wikipedia (es): Tenjo", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "totoro", name: "Totoró", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del Cauca, en la cordillera Central, en la cuenca alta del río Cauca.",
    keyThemes: ["Andes", "Montaña", "Indígena"],
    sourceNote: "Fundada el 30 de enero de 1815.",
    events: [
      {
        id: "totoro-fundacion", type: "fundacion", label: "Fundación",
        date: "1815-01-30", year: 1815,
        description: "Se funda Totoró.",
        source: "Wikidata Q2405808 + Wikipedia (es): Totoró", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tumaco", name: "Tumaco", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "San Andrés de Tumaco, la Perla del Pacífico, puerto de Nariño sobre el océano Pacífico.",
    keyThemes: ["Pacífico", "Puerto", "Playa"],
    sourceNote: "Fundada el 30 de noviembre de 1640.",
    events: [
      {
        id: "tumaco-fundacion", type: "fundacion", label: "Fundación",
        date: "1640-11-30", year: 1640,
        description: "Se funda Tumaco.",
        source: "Wikidata Q1005555 + Wikipedia (es): Tumaco", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "uribia", name: "Uribia", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "La capital indígena de Colombia, en La Guajira, puerta hacia el Cabo de la Vela.",
    keyThemes: ["Wayuu", "Desierto", "Caribe", "Turismo"],
    sourceNote: "Fundada el 1 de marzo de 1935.",
    events: [
      {
        id: "uribia-fundacion", type: "fundacion", label: "Fundación",
        date: "1935-03-01", year: 1935,
        description: "Se funda Uribia.",
        source: "Wikidata Q2215403 + Wikipedia (es): Uribia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villamaria", name: "Villamaría", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de Caldas vecino de Manizales, en el Eje Cafetero.",
    keyThemes: ["Eje Cafetero", "Café", "Andes"],
    sourceNote: "Fundada el 19 de octubre de 1852.",
    events: [
      {
        id: "villamaria-fundacion", type: "fundacion", label: "Fundación",
        date: "1852-10-19", year: 1852,
        description: "Se funda Villamaría.",
        source: "Wikidata Q961399 + Wikipedia (es): Villamaría", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villapinzon", name: "Villapinzón", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio de Cundinamarca donde nace el río Bogotá.",
    keyThemes: ["Andes", "Río", "Agro"],
    sourceNote: "Fundada el 14 de octubre de 1776.",
    events: [
      {
        id: "villapinzon-fundacion", type: "fundacion", label: "Fundación",
        date: "1776-10-14", year: 1776,
        description: "Se funda Villapinzón.",
        source: "Wikidata Q1526073 + Wikipedia (es): Villapinzón", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villeta", name: "Villeta", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Capital de la provincia del Gualivá, en Cundinamarca, conocida como la capital panelera.",
    keyThemes: ["Clima cálido", "Panela", "Turismo"],
    sourceNote: "Fundada el 29 de septiembre de 1551.",
    events: [
      {
        id: "villeta-fundacion", type: "fundacion", label: "Fundación",
        date: "1551-09-29", year: 1551,
        description: "Se funda Villeta.",
        source: "Wikidata Q1440837 + Wikipedia (es): Villeta (Cundinamarca)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "yarumal", name: "Yarumal", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Municipio del norte de Antioquia, de clima frío, en la cordillera Central.",
    keyThemes: ["Andes", "Antioquia", "Agro"],
    sourceNote: "Fundada el 29 de marzo de 1787.",
    events: [
      {
        id: "yarumal-fundacion", type: "fundacion", label: "Fundación",
        date: "1787-03-29", year: 1787,
        description: "Se funda Yarumal.",
        source: "Wikidata Q972405 + Wikipedia (es): Yarumal", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "zipaquira", name: "Zipaquirá", type: "city", country: "Colombia", emoji: "🇨🇴",
    description: "Capital de la Sabana Centro, famosa por la Catedral de Sal excavada en una mina.",
    keyThemes: ["Sal", "Turismo", "Sabana de Bogotá", "Minería"],
    sourceNote: "Fundada el 18 de julio de 1600.",
    events: [
      {
        id: "zipaquira-fundacion", type: "fundacion", label: "Fundación",
        date: "1600-07-18", year: 1600,
        description: "Se funda Zipaquirá.",
        source: "Wikidata Q205429 + Wikipedia (es): Zipaquirá", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "chiclana-de-la-frontera", name: "Chiclana de la Frontera", type: "city", country: "España", emoji: "🇪🇸",
    description: "Ciudad de la bahía de Cádiz, con playas atlánticas como La Barrosa.",
    keyThemes: ["Andalucía", "Playa", "Vino"],
    sourceNote: "Fundada el 15 de mayo de 1303.",
    events: [
      {
        id: "chiclana-de-la-frontera-fundacion", type: "fundacion", label: "Fundación",
        date: "1303-05-15", year: 1303,
        description: "Se funda Chiclana de la Frontera.",
        source: "Wikidata Q277302 + Wikipedia (es): Chiclana de la Frontera", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "irun", name: "Irún", type: "city", country: "España", emoji: "🇪🇸",
    description: "Ciudad guipuzcoana fronteriza con Francia, separada de Hendaya por el río Bidasoa.",
    keyThemes: ["País Vasco", "Frontera", "Río"],
    sourceNote: "Fundada el 28 de febrero de 1776.",
    events: [
      {
        id: "irun-fundacion", type: "fundacion", label: "Fundación",
        date: "1776-02-28", year: 1776,
        description: "Se funda Irún.",
        source: "Wikidata Q200201 + Wikipedia (es): Irún", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "mondragon", name: "Mondragón", type: "city", country: "España", emoji: "🇪🇸",
    description: "Arrasate en euskera, villa guipuzcoana del Alto Deva, cuna del grupo cooperativo Mondragón.",
    keyThemes: ["País Vasco", "Cooperativas", "Industria"],
    sourceNote: "Fundada el 15 de mayo de 1260.",
    events: [
      {
        id: "mondragon-fundacion", type: "fundacion", label: "Fundación",
        date: "1260-05-15", year: 1260,
        description: "Se funda Mondragón.",
        source: "Wikidata Q491922 + Wikipedia (es): Mondragón", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-roque", name: "San Roque", type: "city", country: "España", emoji: "🇪🇸",
    description: "Ciudad gaditana del Campo de Gibraltar, fundada por los gibraltareños que dejaron el Peñón en 1704.",
    keyThemes: ["Historia", "Gibraltar", "Andalucía"],
    sourceNote: "Fundada el 21 de mayo de 1706.",
    events: [
      {
        id: "san-roque-fundacion", type: "fundacion", label: "Fundación",
        date: "1706-05-21", year: 1706,
        description: "Se funda San Roque.",
        source: "Wikidata Q846153 + Wikipedia (es): San Roque (Cádiz)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "eibar", name: "Éibar", type: "city", country: "España", emoji: "🇪🇸",
    description: "Ciudad guipuzcoana del Bajo Deva, con larga tradición armera e industrial.",
    keyThemes: ["País Vasco", "Industria", "Historia"],
    sourceNote: "Fundada el 5 de febrero de 1346.",
    events: [
      {
        id: "eibar-fundacion", type: "fundacion", label: "Fundación",
        date: "1346-02-05", year: 1346,
        description: "Se funda Éibar.",
        source: "Wikidata Q496567 + Wikipedia (es): Éibar", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "celaya", name: "Celaya", type: "city", country: "México", emoji: "🇲🇽",
    description: "Fundada como Villa de la Purísima Concepción de Zalaya, principal ciudad del Bajío guanajuatense, famosa por su cajeta.",
    keyThemes: ["Colonial", "Bajío", "Agro"],
    sourceNote: "Fundada el 12 de octubre de 1570.",
    events: [
      {
        id: "celaya-fundacion", type: "fundacion", label: "Fundación",
        date: "1570-10-12", year: 1570,
        description: "Se funda Celaya.",
        source: "Wikidata Q580649 + Wikipedia (es): Celaya", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "chiapa-de-corzo", name: "Chiapa de Corzo", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad a orillas del río Grijalva, en Chiapas, punto de partida hacia el Cañón del Sumidero.",
    keyThemes: ["Colonial", "Río", "Turismo"],
    sourceNote: "Fundada el 1 de marzo de 1528.",
    events: [
      {
        id: "chiapa-de-corzo-fundacion", type: "fundacion", label: "Fundación",
        date: "1528-03-01", year: 1528,
        description: "Se funda Chiapa de Corzo.",
        source: "Wikidata Q2085574 + Wikipedia (es): Chiapa de Corzo", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "chilpancingo-de-los-bravo", name: "Chilpancingo de los Bravo", type: "city", country: "México", emoji: "🇲🇽",
    description: "Capital del estado de Guerrero, sede del Primer Congreso de Anáhuac en 1813.",
    keyThemes: ["Capital", "Historia", "Montaña"],
    sourceNote: "Fundada el 1 de noviembre de 1591.",
    events: [
      {
        id: "chilpancingo-de-los-bravo-fundacion", type: "fundacion", label: "Fundación",
        date: "1591-11-01", year: 1591,
        description: "Se funda Chilpancingo de los Bravo.",
        source: "Wikidata Q207935 + Wikipedia (es): Chilpancingo de los Bravo", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "ciudad-victoria", name: "Ciudad Victoria", type: "city", country: "México", emoji: "🇲🇽",
    description: "Capital de Tamaulipas, al pie de la Sierra Madre Oriental.",
    keyThemes: ["Capital", "Montaña", "Norte"],
    sourceNote: "Fundada el 6 de octubre de 1750.",
    events: [
      {
        id: "ciudad-victoria-fundacion", type: "fundacion", label: "Fundación",
        date: "1750-10-06", year: 1750,
        description: "Se funda Ciudad Victoria.",
        source: "Wikidata Q331661 + Wikipedia (es): Ciudad Victoria", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "delicias", name: "Delicias", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad agrícola del centro de Chihuahua, cabecera del municipio homónimo.",
    keyThemes: ["Agro", "Desierto", "Norte"],
    sourceNote: "Fundada el 1 de abril de 1933.",
    events: [
      {
        id: "delicias-fundacion", type: "fundacion", label: "Fundación",
        date: "1933-04-01", year: 1933,
        description: "Se funda Delicias.",
        source: "Wikidata Q1962715 + Wikipedia (es): Delicias (Chihuahua)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "empalme", name: "Empalme", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad ferroviaria del suroeste de Sonora, junto al golfo de California.",
    keyThemes: ["Ferrocarril", "Desierto", "Costa"],
    sourceNote: "Fundada el 15 de septiembre de 1905.",
    events: [
      {
        id: "empalme-fundacion", type: "fundacion", label: "Fundación",
        date: "1905-09-15", year: 1905,
        description: "Se funda Empalme.",
        source: "Wikidata Q934086 + Wikipedia (es): Empalme", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "general-escobedo", name: "General Escobedo", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad industrial de la zona metropolitana de Monterrey, en Nuevo León.",
    keyThemes: ["Industria", "Norte"],
    sourceNote: "Fundada el 25 de abril de 1604.",
    events: [
      {
        id: "general-escobedo-fundacion", type: "fundacion", label: "Fundación",
        date: "1604-04-25", year: 1604,
        description: "Se funda General Escobedo.",
        source: "Wikidata Q778941 + Wikipedia (es): General Escobedo", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "heroica-cardenas", name: "Heroica Cárdenas", type: "city", country: "México", emoji: "🇲🇽",
    description: "Segunda ciudad de Tabasco, en la región de La Chontalpa.",
    keyThemes: ["Agro", "Cacao", "Trópico"],
    sourceNote: "Fundada el 22 de abril de 1797.",
    events: [
      {
        id: "heroica-cardenas-fundacion", type: "fundacion", label: "Fundación",
        date: "1797-04-22", year: 1797,
        description: "Se funda Heroica Cárdenas.",
        source: "Wikidata Q1962471 + Wikipedia (es): Heroica Cárdenas (Tabasco)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "lagos-de-moreno", name: "Lagos de Moreno", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad de los Altos de Jalisco, Zona de Monumentos Históricos por su arquitectura virreinal.",
    keyThemes: ["Colonial", "Patrimonio", "Agro"],
    sourceNote: "Fundada el 31 de marzo de 1563.",
    events: [
      {
        id: "lagos-de-moreno-fundacion", type: "fundacion", label: "Fundación",
        date: "1563-03-31", year: 1563,
        description: "Se funda Lagos de Moreno.",
        source: "Wikidata Q1962295 + Wikipedia (es): Lagos de Moreno", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "leon-de-los-aldama", name: "León de Los Aldama", type: "city", country: "México", emoji: "🇲🇽",
    description: "La ciudad más poblada de Guanajuato, capital del calzado y del cuero en México.",
    keyThemes: ["Industria", "Cuero", "Comercio"],
    sourceNote: "Fundada el 20 de enero de 1576.",
    events: [
      {
        id: "leon-de-los-aldama-fundacion", type: "fundacion", label: "Fundación",
        date: "1576-01-20", year: 1576,
        description: "Se funda León de Los Aldama.",
        source: "Wikidata Q189128 + Wikipedia (es): León de Los Aldama", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "macuspana", name: "Macuspana", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad de la región del Usumacinta, en Tabasco, a 45 km de Villahermosa.",
    keyThemes: ["Trópico", "Petróleo", "Río"],
    sourceNote: "Fundada el 17 de febrero de 1665.",
    events: [
      {
        id: "macuspana-fundacion", type: "fundacion", label: "Fundación",
        date: "1665-02-17", year: 1665,
        description: "Se funda Macuspana.",
        source: "Wikidata Q1962453 + Wikipedia (es): Macuspana", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "morelia", name: "Morelia", type: "city", country: "México", emoji: "🇲🇽",
    description: "Capital de Michoacán, fundada como Valladolid, con un centro de cantera rosa declarado Patrimonio de la Humanidad.",
    keyThemes: ["Colonial", "Patrimonio", "Capital"],
    sourceNote: "Fundada el 18 de mayo de 1541.",
    events: [
      {
        id: "morelia-fundacion", type: "fundacion", label: "Fundación",
        date: "1541-05-18", year: 1541,
        description: "Se funda Morelia.",
        source: "Wikidata Q200252 + Wikipedia (es): Morelia", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "rosarito", name: "Rosarito", type: "city", country: "México", emoji: "🇲🇽",
    description: "Cabecera de Playas de Rosarito, en Baja California, sobre el Pacífico y cerca de la frontera con Estados Unidos.",
    keyThemes: ["Playa", "Pacífico", "Frontera", "Turismo"],
    sourceNote: "Fundada el 14 de mayo de 1885.",
    events: [
      {
        id: "rosarito-fundacion", type: "fundacion", label: "Fundación",
        date: "1885-05-14", year: 1885,
        description: "Se funda Rosarito.",
        source: "Wikidata Q1020753 + Wikipedia (es): Rosarito", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "sabinas", name: "Sabinas", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad del noreste de Coahuila, en la región carbonífera del norte de México.",
    keyThemes: ["Minería", "Carbón", "Norte"],
    sourceNote: "Fundada el 29 de junio de 1883.",
    events: [
      {
        id: "sabinas-fundacion", type: "fundacion", label: "Fundación",
        date: "1883-06-29", year: 1883,
        description: "Se funda Sabinas.",
        source: "Wikidata Q2010445 + Wikipedia (es): Sabinas (Coahuila)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-francisco-de-campeche", name: "San Francisco de Campeche", type: "city", country: "México", emoji: "🇲🇽",
    description: "Capital del estado de Campeche, ciudad amurallada contra los piratas y Patrimonio de la Humanidad.",
    keyThemes: ["Colonial", "Patrimonio", "Golfo de México", "Murallas"],
    sourceNote: "Fundada el 4 de octubre de 1540.",
    events: [
      {
        id: "san-francisco-de-campeche-fundacion", type: "fundacion", label: "Fundación",
        date: "1540-10-04", year: 1540,
        description: "Se funda San Francisco de Campeche.",
        source: "Wikidata Q61301 + Wikipedia (es): San Francisco de Campeche", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "santa-rosalia-de-camargo", name: "Santa Rosalía de Camargo", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad del centro-sur de Chihuahua, también conocida como Camargo.",
    keyThemes: ["Desierto", "Agro", "Norte"],
    sourceNote: "Fundada el 25 de noviembre de 1797.",
    events: [
      {
        id: "santa-rosalia-de-camargo-fundacion", type: "fundacion", label: "Fundación",
        date: "1797-11-25", year: 1797,
        description: "Se funda Santa Rosalía de Camargo.",
        source: "Wikidata Q2528602 + Wikipedia (es): Santa Rosalía de Camargo", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tampico", name: "Tampico", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad y puerto de la región Huasteca, en Tamaulipas, sobre el golfo de México.",
    keyThemes: ["Puerto", "Golfo de México", "Petróleo"],
    sourceNote: "Fundada el 12 de abril de 1823.",
    events: [
      {
        id: "tampico-fundacion", type: "fundacion", label: "Fundación",
        date: "1823-04-12", year: 1823,
        description: "Se funda Tampico.",
        source: "Wikidata Q273014 + Wikipedia (es): Tampico", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tequila", name: "Tequila", type: "city", country: "México", emoji: "🇲🇽",
    description: "Pueblo de Jalisco que da nombre a la bebida, rodeado de campos de agave azul declarados Patrimonio de la Humanidad.",
    keyThemes: ["Tequila", "Agave", "Patrimonio", "Turismo"],
    sourceNote: "Fundada el 15 de abril de 1530.",
    events: [
      {
        id: "tequila-fundacion", type: "fundacion", label: "Fundación",
        date: "1530-04-15", year: 1530,
        description: "Se funda Tequila.",
        source: "Wikidata Q847764 + Wikipedia (es): Tequila (Jalisco)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "valladolid-mx", name: "Valladolid", type: "city", country: "México", emoji: "🇲🇽",
    description: "Ciudad colonial del oriente de Yucatán, cercana a Chichén Itzá y a los cenotes de la región.",
    keyThemes: ["Colonial", "Maya", "Cenotes", "Turismo"],
    sourceNote: "Fundada el 28 de mayo de 1543.",
    events: [
      {
        id: "valladolid-mx-fundacion", type: "fundacion", label: "Fundación",
        date: "1543-05-28", year: 1543,
        description: "Se funda Valladolid.",
        source: "Wikidata Q1024731 + Wikipedia (es): Valladolid (México)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "barranco", name: "Barranco", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Distrito bohemio de Lima sobre los acantilados del Pacífico, barrio de artistas y casonas republicanas.",
    keyThemes: ["Lima", "Arte", "Pacífico", "Barrio"],
    sourceNote: "Creada el 26 de octubre de 1874.",
    events: [
      {
        id: "barranco-fundacion", type: "fundacion", label: "Creación del distrito",
        date: "1874-10-26", year: 1874,
        description: "Se crea el distrito de Barranco.",
        source: "Wikidata Q808823 + Wikipedia (es): Distrito de Barranco", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "huancavelica", name: "Huancavelica", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Fundada como Villa Rica de Oropesa por la mina de mercurio de Santa Bárbara, capital del departamento homónimo.",
    keyThemes: ["Andes", "Minería", "Colonial"],
    sourceNote: "Fundada el 4 de agosto de 1571.",
    events: [
      {
        id: "huancavelica-fundacion", type: "fundacion", label: "Fundación",
        date: "1571-08-04", year: 1571,
        description: "Se funda Huancavelica.",
        source: "Wikidata Q1000333 + Wikipedia (es): Huancavelica", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "huaral", name: "Huaral", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Capital de la provincia de Huaral, en el departamento de Lima, en la costa central del Perú.",
    keyThemes: ["Costa", "Agro", "Valle"],
    sourceNote: "Fundada el 21 de marzo de 1551.",
    events: [
      {
        id: "huaral-fundacion", type: "fundacion", label: "Fundación",
        date: "1551-03-21", year: 1551,
        description: "Se funda Huaral.",
        source: "Wikidata Q723677 + Wikipedia (es): Huaral", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "huaraz", name: "Huaraz", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Fundada como San Sebastián de Guarás, capital de Áncash al pie de la Cordillera Blanca.",
    keyThemes: ["Andes", "Montaña", "Turismo", "Colonial"],
    sourceNote: "Fundada el 20 de enero de 1574.",
    events: [
      {
        id: "huaraz-fundacion", type: "fundacion", label: "Fundación",
        date: "1574-01-20", year: 1574,
        description: "Se funda Huaraz.",
        source: "Wikidata Q793809 + Wikipedia (es): Huaraz", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "jauja", name: "Jauja", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Fundada por Francisco Pizarro en 1534, fue la primera capital del Perú español, en el valle del Mantaro.",
    keyThemes: ["Andes", "Colonial", "Historia"],
    sourceNote: "Fundada el 25 de abril de 1534.",
    events: [
      {
        id: "jauja-fundacion", type: "fundacion", label: "Fundación",
        date: "1534-04-25", year: 1534,
        description: "Francisco Pizarro funda Jauja.",
        source: "Wikidata Q917434 + Wikipedia (es): Jauja", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "jesus-maria", name: "Jesús María", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Distrito residencial del centro de Lima, sede del Campo de Marte.",
    keyThemes: ["Lima", "Barrio"],
    sourceNote: "Creada el 17 de diciembre de 1963.",
    events: [
      {
        id: "jesus-maria-fundacion", type: "fundacion", label: "Creación del distrito",
        date: "1963-12-17", year: 1963,
        description: "Se crea el distrito de Jesús María.",
        source: "Wikidata Q2723643 + Wikipedia (es): Distrito de Jesús María", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "miraflores", name: "Miraflores", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Distrito costero de Lima sobre los acantilados del Pacífico, centro turístico y comercial de la capital peruana.",
    keyThemes: ["Lima", "Pacífico", "Turismo", "Barrio"],
    sourceNote: "Creada el 2 de enero de 1857.",
    events: [
      {
        id: "miraflores-fundacion", type: "fundacion", label: "Creación del distrito",
        date: "1857-01-02", year: 1857,
        description: "Se crea el distrito de Miraflores.",
        source: "Wikidata Q1026229 + Wikipedia (es): Distrito de Miraflores (Lima)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "pucallpa", name: "Pucallpa", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Capital de Ucayali sobre el río Ucayali, principal ciudad de la Amazonía central peruana.",
    keyThemes: ["Amazonía", "Río", "Selva"],
    sourceNote: "Fundada el 13 de octubre de 1888.",
    events: [
      {
        id: "pucallpa-fundacion", type: "fundacion", label: "Fundación",
        date: "1888-10-13", year: 1888,
        description: "Se funda Pucallpa.",
        source: "Wikidata Q217071 + Wikipedia (es): Pucallpa", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "san-juan-de-miraflores", name: "San Juan de Miraflores", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Distrito del sur de Lima, uno de los cuarenta y tres de la provincia capital.",
    keyThemes: ["Lima", "Barrio"],
    sourceNote: "Creada el 12 de enero de 1965.",
    events: [
      {
        id: "san-juan-de-miraflores-fundacion", type: "fundacion", label: "Creación del distrito",
        date: "1965-01-12", year: 1965,
        description: "Se crea el distrito de San Juan de Miraflores.",
        source: "Wikidata Q3303734 + Wikipedia (es): Distrito de San Juan de Miraflores", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "tingo-maria", name: "Tingo María", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Capital de la provincia de Leoncio Prado, en la selva de Huánuco, conocida como la ciudad de la Bella Durmiente.",
    keyThemes: ["Selva", "Amazonía", "Turismo"],
    sourceNote: "Fundada el 15 de octubre de 1938.",
    events: [
      {
        id: "tingo-maria-fundacion", type: "fundacion", label: "Fundación",
        date: "1938-10-15", year: 1938,
        description: "Se funda Tingo María.",
        source: "Wikidata Q1974467 + Wikipedia (es): Tingo María", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "villa-maria-del-triunfo", name: "Villa María del Triunfo", type: "city", country: "Perú", emoji: "🇵🇪",
    description: "Distrito del sur de Lima, uno de los cuarenta y tres de la provincia capital.",
    keyThemes: ["Lima", "Barrio"],
    sourceNote: "Creada el 28 de diciembre de 1961.",
    events: [
      {
        id: "villa-maria-del-triunfo-fundacion", type: "fundacion", label: "Creación del distrito",
        date: "1961-12-28", year: 1961,
        description: "Se crea el distrito de Villa María del Triunfo.",
        source: "Wikidata Q2038962 + Wikipedia (es): Distrito de Villa María del Triunfo", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
  {
    id: "treinta-y-tres", name: "Treinta y Tres", type: "city", country: "Uruguay", emoji: "🇺🇾",
    description: "Capital del departamento homónimo en el este de Uruguay, cuna de artistas y deportistas uruguayos.",
    keyThemes: ["Cultura", "Río", "Agro"],
    sourceNote: "Fundada el 10 de marzo de 1853.",
    events: [
      {
        id: "treinta-y-tres-fundacion", type: "fundacion", label: "Fundación",
        date: "1853-03-10", year: 1853,
        description: "Se funda Treinta y Tres.",
        source: "Wikidata Q830390 + Wikipedia (es): Treinta y Tres (Uruguay)", confidence: "exacta", primaryForAffinity: true,
      },
    ],
  },
];
