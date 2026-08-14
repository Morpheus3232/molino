import { MetadataRoute } from "next";
import { SYMBOLIC_ENTITIES, getAvailableTypes } from "@/lib/data/symbolic-entities";
import { ENTITIES } from "@/lib/data/entities";
import { CHINESE_ANIMALS } from "@/lib/data/zodiaco-chino-content";
import { NUMBERS } from "@/lib/data/numerologia-content";
import { ZODIAC_SIGNS } from "@/lib/data/astrologia-content";
import { ACADEMY_PIECES } from "@/lib/data/academy-content";
import { SOURCES as BIBLIOTECA_SOURCES } from "@/lib/data/biblioteca-content";
import { BLOG_POSTS } from "@/lib/data/blog-content";
import { SITE_URL } from "@/lib/seo";

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/explore`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/hoy`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/pareja`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/journal`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/onboarding`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/premium`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/precios`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/portal`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/profesionales`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/shortcuts`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/circulo`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/alignment`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/nosotros`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/filosofia`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/changelog`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/ejemplo`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/docs`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/docs/motores`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/biblioteca`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/method`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/academy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/privacidad`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/terminos`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/calendario`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/decisions`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/herramientas`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/herramientas/camino-de-vida`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/herramientas/signo-solar`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/herramientas/zodiaco-chino`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/herramientas/compatibilidad`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/affinity/recommendations/countries`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/affinity/recommendations/brands`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  // Sinastría — Programmatic SEO (144 combinaciones zodiacales)
  const signSlugs = ["aries", "tauro", "geminis", "cancer", "leo", "virgo", "libra", "escorpio", "sagitario", "capricornio", "acuario", "piscis"];
  const sinastriaPages: { url: string; lastModified: Date; changeFrequency: "monthly"; priority: number }[] = [];
  for (const a of signSlugs) {
    for (const b of signSlugs) {
      sinastriaPages.push({
        url: `${BASE_URL}/sinastria/${a}/${b}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    }
  }

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
    { url: `${BASE_URL}/guia/numeros-maestros`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/guia/compatibilidad-astrologica`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  // Academia — historia de las tradiciones (artículos individuales)
  const academyPages = ACADEMY_PIECES.map((piece) => ({
    url: `${BASE_URL}/academy/${piece.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Biblioteca — fichas de fuentes y referencias
  const bibliotecaPages = BIBLIOTECA_SOURCES.map((source) => ({
    url: `${BASE_URL}/biblioteca/${source.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Blog — artículos SEO (alta prioridad para capturar tráfico orgánico)
  const blogPages = [
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...BLOG_POSTS.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return [...staticPages, ...sinastriaPages, ...affinityPages, ...entityPages, ...compatibilityPages, ...conocimientoPages, ...guiaPages, ...academyPages, ...bibliotecaPages, ...blogPages];
}
