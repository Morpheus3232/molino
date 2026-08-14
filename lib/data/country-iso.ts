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
};

/** Derive the ISO country code from a country name, if known. */
export function getCountryISO(country: string): string | undefined {
  return COUNTRY_ISO[country] ?? COUNTRY_ISO[country.split(" / ")[0]];
}
