/** Idioma de la página actual en el navegador (para cuerpos de fetch a la API). */
export function pageLocale(): "es" | "en" {
  if (typeof window === "undefined") return "es";
  const p = window.location.pathname;
  return p === "/en" || p.startsWith("/en/") ? "en" : "es";
}
