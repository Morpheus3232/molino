"use client";

import dynamic from "next/dynamic";

const EnContentDict = dynamic(() => import("./EnContentDict"));

/** En español no hay diccionario que cargar: el contenido ya está en español. */
export function LocaleContentDict({ en, children }: { en: boolean; children: React.ReactNode }) {
  return en ? <EnContentDict>{children}</EnContentDict> : <>{children}</>;
}
