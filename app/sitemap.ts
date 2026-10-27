import { MetadataRoute } from "next";
import { SYMBOLIC_ENTITIES, getAvailableTypes, type EntityType } from "@/lib/data/symbolic-entities";
import { CHINESE_ANIMALS } from "@/lib/data/zodiaco-chino-content";
import { NUMBERS } from "@/lib/data/numerologia-content";
import { ZODIAC_SIGNS } from "@/lib/data/astrologia-content";
import { ACADEMY_PIECES } from "@/lib/data/academy-content";
import { ACADEMY_GUIDES } from "@/lib/data/academy-guides";
import { SOURCES as BIBLIOTECA_SOURCES } from "@/lib/data/biblioteca-content";
import { BLOG_POSTS } from "@/lib/data/blog-content";
import { SITE_URL, localeUrl } from "@/lib/seo";
import { getPrimaryEvent } from "@/lib/data/entity-events";
import { compatibilidadSignosRoutes } from "@/lib/seo/programmatic";

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/explore`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/hoy`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/pareja`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/journal`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/premium`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/profesionales`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/shortcuts`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/nosotros`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/filosofia`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/changelog`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/ejemplo`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/docs`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/docs/motores`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/biblioteca`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/metodos-y-fuentes`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/academy`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/privacidad`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/terminos`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/calendario`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/herramientas`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/herramientas/camino-de-vida`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/herramientas/signo-solar`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/herramientas/zodiaco-chino`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/herramientas/compatibilidad`, changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  // Sinastría — Programmatic SEO (144 combinaciones zodiacales)
  // Fase 3 — `/sinastria/a/b` salió del sitemap: cubre el mismo intent
  // signo×signo que `/compatibilidad/a-b` (canónica, ver
  // lib/seo/programmatic.ts). Las páginas siguen vivas con canonical + noindex.

  // Affinity hub + category listings
  const affinityPages = [
    // Las marcas se listan en tres: /affinity/autos, /affinity/ropa y /affinity/brand.
    ...[...getAvailableTypes(), "autos", "ropa"].map((type) => ({
      url: `${BASE_URL}/affinity/${type}`,
     
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  // Affinity entity detail pages (canonical URLs) — solo tipos con ruta real en
  // /affinity/[type]/[slug] (getAvailableTypes), y solo con fecha exacta: las
  // demás son noindex (ver generateMetadata de la ficha).
  const availableTypes = new Set<EntityType>(getAvailableTypes());
  const entityPages = SYMBOLIC_ENTITIES.filter((entity) => availableTypes.has(entity.type as EntityType) && getPrimaryEvent(entity)?.date).map((entity) => ({
    url: `${BASE_URL}/affinity/${entity.type}/${entity.id}`,
   
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  // Fase 3 — `/compatibility/*` se consolidó en `/affinity/*` (301). Ya no
  // se anuncia en el sitemap.

  // Conocimiento — educational content (high SEO value)
  const conocimientoPages = [
    { url: `${BASE_URL}/conocimiento/astrologia`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/conocimiento/numerologia`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/conocimiento/zodiaco-chino`, changeFrequency: "monthly" as const, priority: 0.8 },
    ...ZODIAC_SIGNS.map((sign) => ({
      url: `${BASE_URL}/conocimiento/astrologia/${encodeURIComponent(sign.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}`,
     
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...NUMBERS.map((num) => ({
      url: `${BASE_URL}/conocimiento/numerologia/${num.number}`,
     
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...CHINESE_ANIMALS.map((animal) => ({
      url: `${BASE_URL}/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`,
     
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Guía pages
  const guiaPages = [
    { url: `${BASE_URL}/guia`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/guia/camino-de-vida-7`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/guia/numeros-maestros`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/guia/compatibilidad-astrologica`, changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  // Academia — historia de las tradiciones y guías prácticas (comparten /academy/[slug])
  const academyPages = [...ACADEMY_PIECES, ...ACADEMY_GUIDES].map((piece) => ({
    url: `${BASE_URL}/academy/${piece.slug}`,
   
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Biblioteca — fichas de fuentes y referencias
  const bibliotecaPages = BIBLIOTECA_SOURCES.map((source) => ({
    url: `${BASE_URL}/biblioteca/${source.slug}`,
   
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Blog — artículos SEO (alta prioridad para capturar tráfico orgánico)
  const blogPages = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(BLOG_POSTS.map((p) => p.updatedAt ?? p.date).sort().at(-1)!),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...BLOG_POSTS.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  // Fase 3 — Las rutas programáticas (signo×casa, compatibilidad
  // signo-signo) NO se anuncian en el sitemap. Son contenido de
  // exploración con plantilla corta; Google las descubre por enlaces
  // internos (sinastria → compatibilidad, conocimiento → signos) sin
  // consumir presupuesto de rastreo anunciando 252 URLs casi idénticas.
  // Las páginas siguen existiendo (generateStaticParams en cada page.tsx).
  //
  // Excepción (2026-10-17): /compatibilidad/a-b vuelve al índice con más
  // contenido, y se anuncian solo las 78 canónicas (orden zodiacal); las 66
  // inversas apuntan a ellas con canonical. Signo×casa sigue afuera.
  const programmaticPages: MetadataRoute.Sitemap = compatibilidadSignosRoutes().map((r) => ({
    url: `${BASE_URL}/${r.path}`,
   
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  // El protocolo de sitemaps exige URLs escapadas: ids como "dragón" o
  // "david-lebón" salían crudos. encodeURI no toca lo que ya es ASCII.
  const all: MetadataRoute.Sitemap = [...staticPages, ...affinityPages, ...entityPages, ...conocimientoPages, ...guiaPages, ...academyPages, ...bibliotecaPages, ...blogPages, ...programmaticPages];

  // Cada URL existe en español (raíz) y en inglés (/en): se anuncian las dos
  // y cada una declara a la otra como alternativa (hreflang).
  return all.flatMap((entry) => {
    const path = entry.url.slice(BASE_URL.length) || "/";
    const es = encodeURI(localeUrl(path, "es"));
    const en = encodeURI(localeUrl(path, "en"));
    const alternates = { languages: { es, en, "x-default": es } };
    return [
      { ...entry, url: es, alternates },
      { ...entry, url: en, alternates },
    ];
  });
}
