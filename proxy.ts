import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

/**
 * Resuelve el idioma por URL: /en/... → inglés; todo lo demás → español
 * (reescrito internamente a /es/... sin cambiar la URL visible).
 */
export default createMiddleware(routing);

export const config = {
  // Todo menos API, internos de Next/Vercel, archivos con extensión
  // (sitemap.xml, robots.txt, imágenes, sw.js…) y las imágenes para compartir:
  // Next las publica con el locale en la ruta (/es/blog/x/opengraph-image) y
  // así se sirven directo, sin la redirección de /es/... a la raíz.
  matcher: ["/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)"],
};
