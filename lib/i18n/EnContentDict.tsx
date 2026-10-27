"use client";

import { EN_CONTENT } from "./content/en";
import { ContentDictProvider } from "./ContentDictProvider";

/**
 * El diccionario de contenido viaja como un chunk de JavaScript aparte: se
 * descarga solo en las páginas en inglés y el navegador lo cachea entre
 * páginas, en vez de repetirse en el HTML de cada una.
 */
export default function EnContentDict({ children }: { children: React.ReactNode }) {
  return <ContentDictProvider dict={EN_CONTENT}>{children}</ContentDictProvider>;
}
