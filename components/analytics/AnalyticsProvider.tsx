"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/analytics/analytics";
import Script from "next/script";

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.trackPageView(pathname || "/");
    analytics.trackReturnVisit();
  }, [pathname]);

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleScriptUrl =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL || "https://plausible.io/js/script.js";

  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiScriptUrl =
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js";

  return (
    <>
      {/* Plausible Analytics (100% Privacy-first, cookieless, GDPR-compliant) */}
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src={plausibleScriptUrl}
          strategy="afterInteractive"
        />
      )}

      {/* Umami Analytics (Open Source, self-hosted or cloud, cookieless) */}
      {umamiWebsiteId && (
        <Script
          defer
          data-website-id={umamiWebsiteId}
          src={umamiScriptUrl}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
