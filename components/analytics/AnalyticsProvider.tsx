"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/analytics/analytics";

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Una vez por carga de la app (no por navegación): detecta un retorno
    // (24 h sin visitas) y actualiza la marca de última visita.
    analytics.trackReturnVisit();
    analytics.updateLastVisit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    analytics.trackPageView(pathname || "/");
  }, [pathname]);

  return null;
}
