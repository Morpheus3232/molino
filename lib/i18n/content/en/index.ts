import type { ContentDict } from "../../translate";
import academy from "./academy.json";
import biblioteca from "./biblioteca.json";
import blog from "./blog.json";
import core from "./core.json";
import entities from "./entities.json";
import terms from "./terms.json";
import uiExtra from "./ui-extra.json";

/**
 * Diccionario español → inglés del contenido que no vive en los componentes,
 * armado por dominio. Si una frase aparece en dos dominios, gana el más
 * específico de la interfaz (terms, después core).
 */
export const EN_CONTENT: ContentDict = {
  ...entities,
  ...blog,
  ...biblioteca,
  ...academy,
  ...core,
  ...uiExtra,
  ...terms,
};
