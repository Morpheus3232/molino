"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/analytics/analytics";

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.trackPageView(pathname || "/");
    // Check for return visit on first mount (once per session)
    analytics.trackReturnVisit();
  }, [pathname]);

  return null;
}
