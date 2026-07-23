import { MetadataRoute } from "next";
import { ENTITIES } from "@/lib/data/entities";

const BASE_URL = "https://molino-alpha.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/explore`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/numerologia`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/astrologia`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/zodiaco-chino`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/biblioteca`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/method`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  // Entity detail pages
  const entityPages = ENTITIES.map((entity) => ({
    url: `${BASE_URL}/entities/${entity.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  // Compatibility pages (SEO-optimized)
  const compatibilityPages = ENTITIES.map((entity) => ({
    url: `${BASE_URL}/compatibility/${entity.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...entityPages, ...compatibilityPages];
}
