#!/usr/bin/env node
/**
 * Generate countries.ts with 195+ countries.
 * Run: node scripts/generate-countries.mjs
 * 
 * Uses getChineseAnimal formula: (year - 1900) % 12
 * Animals: Rata(0), Buey(1), Tigre(2), Conejo(3), Dragón(4), Serpiente(5),
 *          Caballo(6), Cabra(7), Mono(8), Gallo(9), Perro(10), Cerdo(11)
 * 
 * Elements: based on last digit of year:
 *   0,1 = Metal; 2,3 = Agua; 4,5 = Madera; 6,7 = Fuego; 8,9 = Tierra
 *   (This is the simplified Chinese Five Elements + stem mapping)
 */

const animals = ["Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];

function getAnimal(year) {
  const idx = ((year - 1900) % 12 + 12) % 12;
  return animals[idx];
}

function getElement(year) {
  // Stem-based: (year - 4) % 10 → 0,1=Wood; 2,3=Fire; 4,5=Earth; 6,7=Metal; 8,9=Water
  // Using the traditional Heavenly Stems mapping
  const stems = ["Madera", "Madera", "Fuego", "Fuego", "Tierra", "Tierra", "Metal", "Metal", "Agua", "Agua"];
  return stems[(year - 4 + 10000) % 10];
}

// All 195 UN member states + 2 observer states
const countries = [
  // Africa (54)
  { n: "Argelia", f: "🇩🇿", y: 1962, c: "África", ref: "Independencia" },
  { n: "Angola", f: "🇦🇴", y: 1975, c: "África", ref: "Independencia" },
  { n: "Benín", f: "🇧🇯", y: 1960, c: "África", ref: "Independencia" },
  { n: "Botsuana", f: "🇧🇼", y: 1966, c: "África", ref: "Independencia" },
  { n: "Burkina Faso", f: "🇧🇫", y: 1960, c: "África", ref: "Independencia" },
  { n: "Burundi", f: "🇧🇮", y: 1962, c: "África", ref: "Independencia" },
  { n: "Cabo Verde", f: "🇨🇻", y: 1975, c: "África", ref: "Independencia" },
  { n: "Camerún", f: "🇨🇲", y: 1960, c: "África", ref: "Federación" },
  { n: "Chad", f: "🇹🇩", y: 1960, c: "África", ref: "Independencia" },
  { n: "Comoras", f: "🇰🇲", y: 1975, c: "África", ref: "Independencia" },
  { n: "Congo", f: "🇨🇬", y: 1960, c: "África", ref: "Independencia" },
  { n: "Costa de Marfil", f: "🇨🇮", y: 1960, c: "África", ref: "Independencia" },
  { n: "Djibouti", f: "🇩🇯", y: 1977, c: "África", ref: "Independencia" },
  { n: "Egipto", f: "🇪🇬", y: 1922, c: "África", ref: "Independencia" },
  { n: "Eritrea", f: "🇪🇷", y: 1993, c: "África", ref: "Independencia" },
  { n: "Esuatini", f: "🇸🇿", y: 1968, c: "África", ref: "Independencia" },
  { n: "Etiopía", f: "🇪🇹", y: 1941, c: "África", ref: "Liberación" },
  { n: "Gabón", f: "🇬🇦", y: 1960, c: "África", ref: "Independencia" },
  { n: "Gambia", f: "🇬🇲", y: 1965, c: "África", ref: "Independencia" },
  { n: "Ghana", f: "🇬🇭", y: 1957, c: "África", ref: "Independencia" },
  { n: "Guinea", f: "🇬🇳", y: 1958, c: "África", ref: "Independencia" },
  { n: "Guinea-Bisáu", f: "🇬🇼", y: 1974, c: "África", ref: "Independencia" },
  { n: "Guinea Ecuatorial", f: "🇬🇶", y: 1968, c: "África", ref: "Independencia" },
  { n: "Kenia", f: "🇰🇪", y: 1963, c: "África", ref: "Independencia" },
  { n: "Lesoto", f: "🇱🇸", y: 1966, c: "África", ref: "Independencia" },
  { n: "Liberia", f: "🇱🇷", y: 1847, c: "África", ref: "Independencia" },
  { n: "Libia", f: "🇱🇾", y: 1951, c: "África", ref: "Independencia" },
  { n: "Madagascar", f: "🇲🇬", y: 1960, c: "África", ref: "Independencia" },
  { n: "Malaui", f: "🇲🇼", y: 1964, c: "África", ref: "Independencia" },
  { n: "Malí", f: "🇲🇱", y: 1960, c: "África", ref: "Independencia" },
  { n: "Marruecos", f: "🇲🇦", y: 1956, c: "África", ref: "Independencia" },
  { n: "Mauricio", f: "🇲🇺", y: 1968, c: "África", ref: "Independencia" },
  { n: "Mauritania", f: "🇲🇷", y: 1960, c: "África", ref: "Independencia" },
  { n: "Mozambique", f: "🇲🇿", y: 1975, c: "África", ref: "Independencia" },
  { n: "Namibia", f: "🇳🇦", y: 1990, c: "África", ref: "Independencia" },
  { n: "Níger", f: "🇳🇪", y: 1960, c: "África", ref: "Independencia" },
  { n: "Nigeria", f: "🇳🇬", y: 1960, c: "África", ref: "Independencia" },
  { n: "República Centroafricana", f: "🇨🇫", y: 1960, c: "África", ref: "Independencia" },
  { n: "República Democrática del Congo", f: "🇨🇩", y: 1960, c: "África", ref: "Independencia" },
  { n: "Ruanda", f: "🇷🇼", y: 1962, c: "África", ref: "Independencia" },
  { n: "Santo Tomé y Príncipe", f: "🇸🇹", y: 1975, c: "África", ref: "Independencia" },
  { n: "Senegal", f: "🇸🇳", y: 1960, c: "África", ref: "Independencia" },
  { n: "Seychelles", f: "🇸🇨", y: 1976, c: "África", ref: "Independencia" },
  { n: "Sierra Leona", f: "🇸🇱", y: 1961, c: "África", ref: "Independencia" },
  { n: "Somalia", f: "🇸🇴", y: 1960, c: "África", ref: "Unión" },
  { n: "Sudáfrica", f: "🇿🇦", y: 1910, c: "África", ref: "Unión" },
  { n: "Sudán", f: "🇸🇩", y: 1956, c: "África", ref: "Independencia" },
  { n: "Sudán del Sur", f: "🇸🇸", y: 2011, c: "África", ref: "Independencia" },
  { n: "Tanzania", f: "🇹🇿", y: 1961, c: "África", ref: "Independencia" },
  { n: "Togo", f: "🇹🇬", y: 1960, c: "África", ref: "Independencia" },
  { n: "Túnez", f: "🇹🇳", y: 1956, c: "África", ref: "Independencia" },
  { n: "Uganda", f: "🇺🇬", y: 1962, c: "África", ref: "Independencia" },
  { n: "Yibuti", f: "🇩🇯", y: 1977, c: "África", ref: "Independencia" },
  { n: "Zambia", f: "🇿🇲", y: 1964, c: "África", ref: "Independencia" },
  { n: "Zimbabue", f: "🇿🇼", y: 1980, c: "África", ref: "Independencia" },

  // Asia (48)
  { n: "Afganistán", f: "🇦🇫", y: 1919, c: "Asia", ref: "Independencia" },
  { n: "Arabia Saudita", f: "🇸🇦", y: 1932, c: "Asia", ref: "Unificación" },
  { n: "Armenia", f: "🇦🇲", y: 1991, c: "Asia", ref: "Independencia" },
  { n: "Azerbaiyán", f: "🇦🇿", y: 1991, c: "Asia", ref: "Independencia" },
  { n: "Bangladés", f: "🇧🇩", y: 1971, c: "Asia", ref: "Independencia" },
  { n: "Baréin", f: "🇧🇭", y: 1971, c: "Asia", ref: "Independencia" },
  { n: "Bhután", f: "🇧🇹", y: 1907, c: "Asia", ref: "Tratado" },
  { n: "Brunéi", f: "🇧🇳", y: 1984, c: "Asia", ref: "Independencia" },
  { n: "Camboya", f: "🇰🇭", y: 1953, c: "Asia", ref: "Independencia" },
  { n: "China", f: "🇨🇳", y: 1949, c: "Asia", ref: "República Popular" },
  { n: "Chipre", f: "🇨🇾", y: 1960, c: "Asia", ref: "Independencia" },
  { n: "Corea del Norte", f: "🇰🇵", y: 1948, c: "Asia", ref: "República" },
  { n: "Corea del Sur", f: "🇰🇷", y: 1948, c: "Asia", ref: "República" },
  { n: "Emiratos Árabes Unidos", f: "🇦🇪", y: 1971, c: "Asia", ref: "Federación" },
  { n: "Filipinas", f: "🇵🇭", y: 1898, c: "Asia", ref: "Independencia" },
  { n: "Georgia", f: "🇬🇪", y: 1991, c: "Asia", ref: "Independencia" },
  { n: "India", f: "🇮🇳", y: 1947, c: "Asia", ref: "Independencia" },
  { n: "Indonesia", f: "🇮🇩", y: 1945, c: "Asia", ref: "Declaración" },
  { n: "Irak", f: "🇮🇶", y: 1932, c: "Asia", ref: "Independencia" },
  { n: "Irán", f: "🇮🇷", y: 1979, c: "Asia", ref: "Revolución" },
  { n: "Israel", f: "🇮🇱", y: 1948, c: "Asia", ref: "Declaración" },
  { n: "Japón", f: "🇯🇵", y: 660, c: "Asia", ref: "Fundación mítica" },
  { n: "Jordania", f: "🇯🇴", y: 1946, c: "Asia", ref: "Independencia" },
  { n: "Kazajistán", f: "🇰🇿", y: 1991, c: "Asia", ref: "Independencia" },
  { n: "Kuwait", f: "🇰🇼", y: 1961, c: "Asia", ref: "Independencia" },
  { n: "Kirguistán", f: "🇰🇬", y: 1991, c: "Asia", ref: "Independencia" },
  { n: "Laos", f: "🇱🇦", y: 1953, c: "Asia", ref: "Independencia" },
  { n: "Líbano", f: "🇱🇧", y: 1943, c: "Asia", ref: "Independencia" },
  { n: "Malasia", f: "🇲🇾", y: 1957, c: "Asia", ref: "Independencia" },
  { n: "Maldivas", f: "🇲🇻", y: 1965, c: "Asia", ref: "Independencia" },
  { n: "Mongolia", f: "🇲🇳", y: 1911, c: "Asia", ref: "Independencia" },
  { n: "Myanmar", f: "🇲🇲", y: 1948, c: "Asia", ref: "Independencia" },
  { n: "Nepal", f: "🇳🇵", y: 1768, c: "Asia", ref: "Unificación" },
  { n: "Omán", f: "🇴🇲", y: 1970, c: "Asia", ref: "Reforma" },
  { n: "Pakistán", f: "🇵🇰", y: 1947, c: "Asia", ref: "Independencia" },
  { n: "Palestina", f: "🇵🇸", y: 1988, c: "Asia", ref: "Declaración" },
  { n: "Qatar", f: "🇶🇦", y: 1971, c: "Asia", ref: "Independencia" },
  { n: "Singapur", f: "🇸🇬", y: 1965, c: "Asia", ref: "Independencia" },
  { n: "Siria", f: "🇸🇾", y: 1946, c: "Asia", ref: "Independencia" },
  { n: "Sri Lanka", f: "🇱🇰", y: 1948, c: "Asia", ref: "Independencia" },
  { n: "Tailandia", f: "🇹🇭", y: 1238, c: "Asia", ref: "Reino de Sukhothai" },
  { n: "Taiwán", f: "🇹🇼", y: 1949, c: "Asia", ref: "República" },
  { n: "Tayikistán", f: "🇹🇯", y: 1991, c: "Asia", ref: "Independencia" },
  { n: "Timor Oriental", f: "🇹🇱", y: 2002, c: "Asia", ref: "Independencia" },
  { n: "Turkmenistán", f: "🇹🇲", y: 1991, c: "Asia", ref: "Independencia" },
  { n: "Turquía", f: "🇹🇷", y: 1923, c: "Asia", ref: "República" },
  { n: "Uzbekistán", f: "🇺🇿", y: 1991, c: "Asia", ref: "Independencia" },
  { n: "Vietnam", f: "🇻🇳", y: 1945, c: "Asia", ref: "Declaración" },
  { n: "Yemen", f: "🇾🇪", y: 1990, c: "Asia", ref: "Unificación" },

  // Europe (44)
  { n: "Albania", f: "🇦🇱", y: 1912, c: "Europa", ref: "Independencia" },
  { n: "Alemania", f: "🇩🇪", y: 1990, c: "Europa", ref: "Reunificación" },
  { n: "Andorra", f: "🇦🇩", y: 1278, c: "Europa", ref: "Parias" },
  { n: "Austria", f: "🇦🇹", y: 1955, c: "Europa", ref: "Independencia" },
  { n: "Bélgica", f: "🇧🇪", y: 1830, c: "Europa", ref: "Independencia" },
  { n: "Bielorrusia", f: "🇧🇾", y: 1991, c: "Europa", ref: "Independencia" },
  { n: "Bosnia y Herzegovina", f: "🇧🇦", y: 1992, c: "Europa", ref: "Independencia" },
  { n: "Bulgaria", f: "🇧🇬", y: 1908, c: "Europa", ref: "Independencia" },
  { n: "Chequia", f: "🇨🇿", y: 1993, c: "Europa", ref: "Disolución" },
  { n: "Croacia", f: "🇭🇷", y: 1991, c: "Europa", ref: "Independencia" },
  { n: "Dinamarca", f: "🇩🇰", y: 1849, c: "Europa", ref: "Constitución" },
  { n: "Eslovaquia", f: "🇸🇰", y: 1993, c: "Europa", ref: "Disolución" },
  { n: "Eslovenia", f: "🇸🇮", y: 1991, c: "Europa", ref: "Independencia" },
  { n: "España", f: "🇪🇸", y: 1492, c: "Europa", ref: "Unificación" },
  { n: "Estonia", f: "🇪🇪", y: 1991, c: "Europa", ref: "Independencia" },
  { n: "Finlandia", f: "🇫🇮", y: 1917, c: "Europa", ref: "Independencia" },
  { n: "Francia", f: "🇫🇷", y: 1789, c: "Europa", ref: "Revolución" },
  { n: "Grecia", f: "🇬🇷", y: 1821, c: "Europa", ref: "Guerra de independencia" },
  { n: "Hungría", f: "🇭🇺", y: 1848, c: "Europa", ref: "Revolución" },
  { n: "Irlanda", f: "🇮🇪", y: 1922, c: "Europa", ref: "Estado Libre" },
  { n: "Islandia", f: "🇮🇸", y: 1944, c: "Europa", ref: "República" },
  { n: "Italia", f: "🇮🇹", y: 1861, c: "Europa", ref: "Unificación" },
  { n: "Letonia", f: "🇱🇻", y: 1991, c: "Europa", ref: "Independencia" },
  { n: "Liechtenstein", f: "🇱🇮", y: 1806, c: "Europa", ref: "Soberanía" },
  { n: "Lituania", f: "🇱🇹", y: 1990, c: "Europa", ref: "Independencia" },
  { n: "Luxemburgo", f: "🇱🇺", y: 1839, c: "Europa", ref: "Independencia" },
  { n: "Malta", f: "🇲🇹", y: 1964, c: "Europa", ref: "Independencia" },
  { n: "Moldavia", f: "🇲🇩", y: 1991, c: "Europa", ref: "Independencia" },
  { n: "Mónaco", f: "🇲🇨", y: 1861, c: "Europa", ref: "Tratado" },
  { n: "Montenegro", f: "🇲🇪", y: 2006, c: "Europa", ref: "Independencia" },
  { n: "Noruega", f: "🇳🇴", y: 1905, c: "Europa", ref: "Disolución de unión" },
  { n: "Países Bajos", f: "🇳🇱", y: 1581, c: "Europa", ref: "Acta de Abjuración" },
  { n: "Polonia", f: "🇵🇱", y: 1918, c: "Europa", ref: "Independencia" },
  { n: "Portugal", f: "🇵🇹", y: 1143, c: "Europa", ref: "Reconocimiento" },
  { n: "Rumanía", f: "🇷🇴", y: 1877, c: "Europa", ref: "Independencia" },
  { n: "Rusia", f: "🇷🇺", y: 1991, c: "Europa", ref: "Disolución URSS" },
  { n: "San Marino", f: "🇸🇲", y: 301, c: "Europa", ref: "Fundación" },
  { n: "Serbia", f: "🇷🇸", y: 2006, c: "Europa", ref: "Independencia" },
  { n: "Suecia", f: "🇸🇪", y: 1523, c: "Europa", ref: "Unión de Kalmar" },
  { n: "Suiza", f: "🇨🇭", y: 1848, c: "Europa", ref: "Constitución" },
  { n: "Ucrania", f: "🇺🇦", y: 1991, c: "Europa", ref: "Independencia" },
  { n: "Reino Unido", f: "🇬🇧", y: 1707, c: "Europa", ref: "Acta de Unión" },
  { n: "Vaticano", f: "🇻🇦", y: 1929, c: "Europa", ref: "Tratados de Letrán" },
  { n: "Kosovo", f: "🇽🇰", y: 2008, c: "Europa", ref: "Declaración" },

  // North America (23)
  { n: "Antigua y Barbuda", f: "🇦🇬", y: 1981, c: "América del Norte", ref: "Independencia" },
  { n: "Bahamas", f: "🇧🇸", y: 1973, c: "América del Norte", ref: "Independencia" },
  { n: "Barbados", f: "🇧🇧", y: 1966, c: "América del Norte", ref: "Independencia" },
  { n: "Belice", f: "🇧🇿", y: 1981, c: "América del Norte", ref: "Independencia" },
  { n: "Canadá", f: "🇨🇦", y: 1867, c: "América del Norte", ref: "Confederación" },
  { n: "Costa Rica", f: "🇨🇷", y: 1821, c: "América del Norte", ref: "Independencia" },
  { n: "Cuba", f: "🇨🇺", y: 1902, c: "América del Norte", ref: "República" },
  { n: "Dominica", f: "🇩🇲", y: 1978, c: "América del Norte", ref: "Independencia" },
  { n: "El Salvador", f: "🇸🇻", y: 1821, c: "América del Norte", ref: "Independencia" },
  { n: "Granada", f: "🇬🇩", y: 1974, c: "América del Norte", ref: "Estado" },
  { n: "Guatemala", f: "🇬🇹", y: 1821, c: "América del Norte", ref: "Independencia" },
  { n: "Haití", f: "🇭🇹", y: 1804, c: "América del Norte", ref: "Independencia" },
  { n: "Honduras", f: "🇭🇳", y: 1821, c: "América del Norte", ref: "Independencia" },
  { n: "Jamaica", f: "🇯🇲", y: 1962, c: "América del Norte", ref: "Independencia" },
  { n: "México", f: "🇲🇽", y: 1810, c: "América del Norte", ref: "Inicio de independencia" },
  { n: "Nicaragua", f: "🇳🇮", y: 1821, c: "América del Norte", ref: "Independencia" },
  { n: "Panamá", f: "🇵🇦", y: 1903, c: "América del Norte", ref: "Independencia" },
  { n: "República Dominicana", f: "🇩🇴", y: 1844, c: "América del Norte", ref: "Independencia" },
  { n: "San Cristóbal y Nieves", f: "🇰🇳", y: 1983, c: "América del Norte", ref: "Independencia" },
  { n: "San Vicente y las Granadinas", f: "🇻🇨", y: 1979, c: "América del Norte", ref: "Independencia" },
  { n: "Santa Lucía", f: "🇱🇨", y: 1979, c: "América del Norte", ref: "Independencia" },
  { n: "Trinidad y Tobago", f: "🇹🇹", y: 1962, c: "América del Norte", ref: "Independencia" },
  { n: "Estados Unidos", f: "🇺🇸", y: 1776, c: "América del Norte", ref: "Declaración de independencia" },

  // South America (12)
  { n: "Argentina", f: "🇦🇷", y: 1816, c: "América del Sur", ref: "Independencia" },
  { n: "Bolivia", f: "🇧🇴", y: 1825, c: "América del Sur", ref: "Independencia" },
  { n: "Brasil", f: "🇧🇷", y: 1822, c: "América del Sur", ref: "Independencia" },
  { n: "Chile", f: "🇨🇱", y: 1818, c: "América del Sur", ref: "Independencia" },
  { n: "Colombia", f: "🇨🇴", y: 1810, c: "América del Sur", ref: "Independencia" },
  { n: "Ecuador", f: "🇪🇨", y: 1830, c: "América del Sur", ref: "Independencia" },
  { n: "Guyana", f: "🇬🇾", y: 1966, c: "América del Sur", ref: "Independencia" },
  { n: "Paraguay", f: "🇵🇾", y: 1811, c: "América del Sur", ref: "Independencia" },
  { n: "Perú", f: "🇵🇪", y: 1821, c: "América del Sur", ref: "Independencia" },
  { n: "Surinam", f: "🇸🇷", y: 1975, c: "América del Sur", ref: "Independencia" },
  { n: "Uruguay", f: "🇺🇾", y: 1825, c: "América del Sur", ref: "Independencia" },
  { n: "Venezuela", f: "🇻🇪", y: 1811, c: "América del Sur", ref: "Independencia" },

  // Oceania (14)
  { n: "Australia", f: "🇦🇺", y: 1901, c: "Oceanía", ref: "Federación" },
  { n: "Fiyi", f: "🇫🇯", y: 1970, c: "Oceanía", ref: "Independencia" },
  { n: "Islas Marshall", f: "🇲🇭", y: 1986, c: "Oceanía", ref: "Compacto" },
  { n: "Islas Salomón", f: "🇸🇧", y: 1978, c: "Oceanía", ref: "Independencia" },
  { n: "Kiribati", f: "🇰🇮", y: 1979, c: "Oceanía", ref: "Independencia" },
  { n: "Micronesia", f: "🇫🇲", y: 1986, c: "Oceanía", ref: "Compacto" },
  { n: "Nauru", f: "🇳🇷", y: 1968, c: "Oceanía", ref: "República" },
  { n: "Nueva Zelanda", f: "🇳🇿", y: 1907, c: "Oceanía", ref: "Dominio" },
  { n: "Palaos", f: "🇵🇼", y: 1994, c: "Oceanía", ref: "Compacto" },
  { n: "Papúa Nueva Guinea", f: "🇵🇬", y: 1975, c: "Oceanía", ref: "Independencia" },
  { n: "Samoa", f: "🇼🇸", y: 1962, c: "Oceanía", ref: "Independencia" },
  { n: "Tonga", f: "🇹🇴", y: 1970, c: "Oceanía", ref: "Tratado" },
  { n: "Tuvalu", f: "🇹🇻", y: 1978, c: "Oceanía", ref: "Independencia" },
  { n: "Vanuatu", f: "🇻🇺", y: 1980, c: "Oceanía", ref: "Independencia" },
];

// Generate the file
let output = `/**
 * Complete country database — ${countries.length} countries.
 * Chinese zodiac computed from reference year using project's getChineseAnimal formula.
 * Elements from Heavenly Stems mapping.
 * Generated by scripts/generate-countries.mjs
 */

export interface CountryData {
  name: string;
  flag: string;
  year: number;
  animal: string;
  element: string;
  continent: string;
  reference: string;
}

export const COUNTRIES: CountryData[] = [
`;

// Group by continent for readability
const continents = ["África", "Asia", "Europa", "América del Norte", "América del Sur", "Oceanía"];
for (const cont of continents) {
  const group = countries.filter(c => c.c === cont);
  output += `\n  // ${cont} (${group.length})\n`;
  for (const c of group) {
    const animal = getAnimal(c.y);
    const element = getElement(c.y);
    output += `  { name: "${c.n}", flag: "${c.f}", year: ${c.y}, animal: "${animal}", element: "${element}", continent: "${c.c}", reference: "${c.ref}" },\n`;
  }
}

output += `];

// Helper: get all unique continents
export function getContinents(): string[] {
  return [...new Set(COUNTRIES.map(c => c.continent))].sort();
}

// Helper: find country by name (case-insensitive)
export function findCountry(name: string): CountryData | undefined {
  return COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}
`;

const fs = await import('fs');
fs.writeFileSync('./lib/data/countries.ts', output);
console.log(`Generated ${countries.length} countries → lib/data/countries.ts`);

// Print verification
console.log('\nSample verifications:');
const samples = ["Argentina", "Brasil", "Japón", "Francia", "Estados Unidos", "Alemania", "Australia", "China", "India", "Nigeria"];
for (const name of samples) {
  const c = countries.find(x => x.n === name);
  if (c) {
    console.log(`  ${c.f} ${c.n} (${c.y}) → ${getAnimal(c.y)} de ${getElement(c.y)}`);
  }
}
