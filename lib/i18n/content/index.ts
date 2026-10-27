import type { ContentDict } from "../translate";
import terms from "./en/terms.json";

/**
 * Diccionario español → inglés del contenido que no vive en los componentes.
 * Se arma por dominios (en/*.json). `CLIENT_CONTENT_DICT_EN` es lo que viaja
 * a las páginas en inglés para los componentes de cliente; el resto se
 * traduce en el servidor y llega ya traducido.
 */
export const CONTENT_DICT_EN: ContentDict = {
  ...terms,
};

export const CLIENT_CONTENT_DICT_EN: ContentDict = {
  ...terms,
};
