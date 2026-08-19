"use client";

import { usePathname } from "next/navigation";

/**
 * Oculta su `children` (ya renderizado del lado del servidor, ej. un footer
 * async) en rutas que empiezan con `hideOnPrefix` — La Lectura vive como
 * objeto autónomo en su propia pestaña, sin el chrome del resto del sitio.
 */
export default function RouteVisibilityGate({
  hideOnPrefix,
  children,
}: {
  hideOnPrefix: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith(hideOnPrefix)) return null;
  return <>{children}</>;
}
