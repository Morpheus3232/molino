import { getL, initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, siteUrl, localeAlternates, localeUrl } from "@/lib/seo";
import { ACADEMY_PIECES, getAcademyPieceBySlug } from "@/lib/data/academy-content";
import { ACADEMY_GUIDES, getAcademyGuideBySlug } from "@/lib/data/academy-guides";
import AcademyArticleContent from "./AcademyArticleContent";
import AcademyGuideContent from "./AcademyGuideContent";

type Props = { params: Promise<{ slug: string }> };

// Todos los slugs válidos se pre-generan (piezas + guías); el resto resuelve
// a 404 real en el router en vez de servir un soft-404 con status 200.
export const dynamicParams = false;

// Dos colecciones de contenido conviven bajo /academy/[slug]: las piezas
// históricas (ACADEMY_PIECES) y las guías prácticas (ACADEMY_GUIDES). Los
// slugs de ambas son mutuamente excluyentes por diseño editorial — se
// verifica en lib/data/__tests__/academy-guides.test.ts.
export function generateStaticParams() {
  return [
    ...ACADEMY_PIECES.map((piece) => ({ slug: piece.slug })),
    ...ACADEMY_GUIDES.map((guide) => ({ slug: guide.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const L = await metaL(params);
  const { slug } = await params;
  const item = getAcademyPieceBySlug(slug) ?? getAcademyGuideBySlug(slug);
  if (!item) return { title: L("Artículo no encontrado", "Article not found") };

  const path = `/academy/${item.slug}`;
  const title = L(`${item.title} — La Academia`, `${L.t(item.title)} — The Academy`);
  const description = L.t(item.metaDescription);
  return {
    title,
    description,
    alternates: localeAlternates(path, L.locale),
    openGraph: { title, description, type: "article", url: localeUrl(path, L.locale) },
  };
}

export default async function AcademyArticlePage({ params }: Props) {
  await initLocale(params);
  const L = await getL();
  const { slug } = await params;
  const piece = getAcademyPieceBySlug(slug);
  const guide = piece ? undefined : getAcademyGuideBySlug(slug);

  if (!piece && !guide) {
    notFound();
  }

  const title = piece?.title ?? guide!.title;
  const description = piece?.metaDescription ?? guide!.metaDescription;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      author: { "@type": "Organization", name: "Molino" },
      publisher: { "@type": "Organization", name: "Molino" },
      url: siteUrl(`/academy/${slug}`),
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(`/academy/${slug}`) },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
        { "@type": "ListItem", position: 2, name: L("La Academia", "The Academy"), item: siteUrl("/academy") },
        { "@type": "ListItem", position: 3, name: title },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {piece ? <AcademyArticleContent piece={piece} /> : <AcademyGuideContent guide={guide!} />}
    </>
  );
}
