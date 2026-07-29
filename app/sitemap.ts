import { MetadataRoute } from "next";
import { SYMBOLIC_ENTITIES, getAvailableTypes } from "@/lib/data/symbolic-entities";
import { ENTITIES } from "@/lib/data/entities";
import { CHINESE_ANIMALS } from "@/lib/data/zodiaco-chino-content";
import { NUMBERS } from "@/lib/data/numerologia-content";
import { ZODIAC_SIGNS } from "@/lib/data/astrologia-content";
import { SITE_URL } from "@/lib/seo";

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/explore`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/biblioteca`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/method`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/academy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/filosofia`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/docs/motores`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  // Affinity hub + category listings
  const affinityPages = [
    { url: `${BASE_URL}/affinity`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...getAvailableTypes().map((type) => ({
      url: `${BASE_URL}/affinity/${type}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  // Affinity entity detail pages (canonical URLs)
  const entityPages = SYMBOLIC_ENTITIES.map((entity) => ({
    url: `${BASE_URL}/affinity/${entity.type}/${entity.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  // Compatibility pages
  const compatibilityPages = ENTITIES.map((entity) => ({
    url: `${BASE_URL}/compatibility/${entity.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Conocimiento — educational content (high SEO value)
  const conocimientoPages = [
    { url: `${BASE_URL}/conocimiento/astrologia`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/conocimiento/numerologia`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/conocimiento/zodiaco-chino`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/conocimiento/fuentes`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    ...ZODIAC_SIGNS.map((sign) => ({
      url: `${BASE_URL}/conocimiento/astrologia/${encodeURIComponent(sign.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...NUMBERS.map((num) => ({
      url: `${BASE_URL}/conocimiento/numerologia/${num.number}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...CHINESE_ANIMALS.map((animal) => ({
      url: `${BASE_URL}/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Guía pages
  const guiaPages = [
    { url: `${BASE_URL}/guia`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/guia/camino-de-vida-7`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  return [...staticPages, ...affinityPages, ...entityPages, ...compatibilityPages, ...conocimientoPages, ...guiaPages];
}
