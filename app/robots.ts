import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /profile?dob=... y /profile?data=... son mapas personales de un
        // solo usuario (ya noindex a nivel de página, ver app/profile/page.tsx)
        // — evitamos gastar crawl budget en ellos directamente acá también.
        disallow: ["/api/", "/admin/", "/profile?*"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
