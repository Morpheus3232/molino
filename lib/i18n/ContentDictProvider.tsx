"use client";

import { createContext, useContext } from "react";
import type { ContentDict } from "./translate";

const ContentDictContext = createContext<ContentDict | null>(null);

/** Lo monta app/[locale]/layout.tsx: el diccionario viaja solo en las páginas en inglés. */
export function ContentDictProvider({ dict, children }: { dict: ContentDict | null; children: React.ReactNode }) {
  return <ContentDictContext.Provider value={dict}>{children}</ContentDictContext.Provider>;
}

export function useContentDict(): ContentDict | null {
  return useContext(ContentDictContext);
}
