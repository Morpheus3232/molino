/**
 * Country name → ISO 3166-1 alpha-2 mapping.
 *
 * Client-safe: no server-only data. Shared by the server-only data layer
 * (lib/data/symbolic-entities.ts) and by Client Components that need to map a
 * user's country name (from UserContext) to an ISO code for Atlas
 * personalization. Facts only — no inference.
 */

/** ISO 3166-1 alpha-2 by common country name. Facts, not opinions. */
export const COUNTRY_ISO: Record<string, string> = {
  Alemania: "DE", "Arabia Saudita": "SA", Argentina: "AR", Australia: "AU",
  Austria: "AT", Bangladesh: "BD", Brasil: "BR", Bulgaria: "BG",
  Bélgica: "BE", Canadá: "CA", Chile: "CL", China: "CN", Colombia: "CO",
  "Corea del Sur": "KR", "Costa Rica": "CR", "Croacia / Serbia": "RS", Cuba: "CU",
  Dinamarca: "DK", Egipto: "EG", "Emiratos Árabes Unidos": "AE", España: "ES",
  "Estados Unidos": "US", Filipinas: "PH", Finlandia: "FI", Francia: "FR",
  Ghana: "GH", Grecia: "GR", Hungría: "HU", India: "IN", Indonesia: "ID",
  Irlanda: "IE", Irán: "IR", Israel: "IL", Italia: "IT", Jamaica: "JM",
  Japón: "JP", Kenia: "KE", Malasia: "MY", Marruecos: "MA", Mongolia: "MN",
  México: "MX", Nigeria: "NG", Noruega: "NO", "Nueva Zelanda": "NZ", Panamá: "PA",
  "Países Bajos": "NL", Perú: "PE", Polonia: "PL", Portugal: "PT",
  "Reino Unido": "GB", "Reino Unido / Bélgica": "GB", "República Checa": "CZ",
  Rumania: "RO", Rusia: "RU", Singapur: "SG", "Sudáfrica": "ZA", Suecia: "SE",
  Suiza: "CH", Tailandia: "TH", Taiwán: "TW", Turquía: "TR", Uruguay: "UY",
  Vietnam: "VN",

  // Los 139 países que el onboarding ofrece (lib/data/countries.ts) y que esta
  // tabla no cubría. Sin ellos, la prioridad "primero lo de tu país" del Mapa
  // Personal fallaba en silencio para cualquiera que no fuera de los ~60 de
  // arriba. Cada código se derivó de la bandera del propio registro —un emoji
  // de bandera ES el código ISO en indicadores regionales— y no de memoria:
  // en los nombres que ya estaban acá arriba, el código derivado coincidió con
  // el cargado a mano en los 58 casos, sin una sola discrepancia.
  Afganistán: "AF", Albania: "AL", Andorra: "AD", Angola: "AO",
  "Antigua y Barbuda": "AG", Argelia: "DZ", Armenia: "AM", Azerbaiyán: "AZ",
  Bahamas: "BS", Bangladés: "BD", Barbados: "BB", Baréin: "BH",
  Belice: "BZ", Benín: "BJ", Bhután: "BT", Bielorrusia: "BY",
  Bolivia: "BO", "Bosnia y Herzegovina": "BA", Botsuana: "BW", Brunéi: "BN",
  "Burkina Faso": "BF", Burundi: "BI", "Cabo Verde": "CV", Camboya: "KH",
  Camerún: "CM", Chad: "TD", Chequia: "CZ", Chipre: "CY",
  Comoras: "KM", Congo: "CG", "Corea del Norte": "KP", "Costa de Marfil": "CI",
  Croacia: "HR", Djibouti: "DJ", Dominica: "DM", Ecuador: "EC",
  "El Salvador": "SV", Eritrea: "ER", Eslovaquia: "SK", Eslovenia: "SI",
  Estonia: "EE", Esuatini: "SZ", Etiopía: "ET", Fiyi: "FJ",
  Gabón: "GA", Gambia: "GM", Georgia: "GE", Granada: "GD",
  Guatemala: "GT", Guinea: "GN", "Guinea Ecuatorial": "GQ", "Guinea-Bisáu": "GW",
  Guyana: "GY", Haití: "HT", Honduras: "HN", Irak: "IQ",
  Islandia: "IS", "Islas Marshall": "MH", "Islas Salomón": "SB", Jordania: "JO",
  Kazajistán: "KZ", Kirguistán: "KG", Kiribati: "KI", Kosovo: "XK",
  Kuwait: "KW", Laos: "LA", Lesoto: "LS", Letonia: "LV",
  Líbano: "LB", Liberia: "LR", Libia: "LY", Liechtenstein: "LI",
  Lituania: "LT", Luxemburgo: "LU", Madagascar: "MG", Malaui: "MW",
  Maldivas: "MV", Malí: "ML", Malta: "MT", Mauricio: "MU",
  Mauritania: "MR", Micronesia: "FM", Moldavia: "MD", Mónaco: "MC",
  Montenegro: "ME", Mozambique: "MZ", Myanmar: "MM", Namibia: "NA",
  Nauru: "NR", Nepal: "NP", Nicaragua: "NI", Níger: "NE",
  Omán: "OM", Pakistán: "PK", Palaos: "PW", Palestina: "PS",
  "Papúa Nueva Guinea": "PG", Paraguay: "PY", Qatar: "QA", "República Centroafricana": "CF",
  "República Democrática del Congo": "CD", "República Dominicana": "DO", Ruanda: "RW", Rumanía: "RO",
  Samoa: "WS", "San Cristóbal y Nieves": "KN", "San Marino": "SM", "San Vicente y las Granadinas": "VC",
  "Santa Lucía": "LC", "Santo Tomé y Príncipe": "ST", Senegal: "SN", Serbia: "RS",
  Seychelles: "SC", "Sierra Leona": "SL", Siria: "SY", Somalia: "SO",
  "Sri Lanka": "LK", Sudán: "SD", "Sudán del Sur": "SS", Surinam: "SR",
  Tanzania: "TZ", Tayikistán: "TJ", "Timor Oriental": "TL", Togo: "TG",
  Tonga: "TO", "Trinidad y Tobago": "TT", Túnez: "TN", Turkmenistán: "TM",
  Tuvalu: "TV", Ucrania: "UA", Uganda: "UG", Uzbekistán: "UZ",
  Vanuatu: "VU", Vaticano: "VA", Venezuela: "VE", Yemen: "YE",
  Yibuti: "DJ", Zambia: "ZM", Zimbabue: "ZW",
};

/** Derive the ISO country code from a country name, if known. */
export function getCountryISO(country: string): string | undefined {
  return COUNTRY_ISO[country] ?? COUNTRY_ISO[country.split(" / ")[0]];
}
