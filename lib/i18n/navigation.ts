import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Reemplazos locale-aware de next/link y next/navigation. `Link href="/hoy"`
 * apunta a /hoy en español y a /en/hoy en inglés; `usePathname()` devuelve
 * la ruta SIN prefijo, así las comparaciones de "ruta activa" siguen
 * funcionando igual en los dos idiomas.
 */
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } = createNavigation(routing);
