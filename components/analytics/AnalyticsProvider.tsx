"use client";

import { useEffect } from "react";
import { usePathname } from "@/lib/i18n/navigation";
import { analytics } from "@/lib/analytics/analytics";

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.trackPageView(pathname || "/");
    analytics.trackReturnVisit();
  }, [pathname]);

  return null;
}
