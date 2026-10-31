/** Idioma de la página actual en el navegador (para cuerpos de fetch a la API). */
export function pageLocale(): "es" | "en" {
  if (typeof window === "undefined") return "es";
  const p = window.location.pathname;
  return p === "/en" || p.startsWith("/en/") ? "en" : "es";
}

/** Ruta interna con el prefijo del idioma actual ("/profile" → "/en/profile" en inglés). */
export function localePath(path: string): string {
  return pageLocale() === "en" ? (path === "/" ? "/en" : `/en${path}`) : path;
}
