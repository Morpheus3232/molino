import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, siteUrl } from "@/lib/seo";
import { ACADEMY_PIECES, getAcademyPieceBySlug } from "@/lib/data/academy-content";
import { ACADEMY_GUIDES, getAcademyGuideBySlug } from "@/lib/data/academy-guides";
import AcademyArticleContent from "./AcademyArticleContent";
import AcademyGuideContent from "./AcademyGuideContent";

type Props = { params: Promise<{ slug: string }> };

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
  const { slug } = await params;
  const piece = getAcademyPieceBySlug(slug);
  if (piece) {
    return {
      title: `${piece.title} — La Academia`,
      description: piece.metaDescription,
      alternates: { canonical: siteUrl(`/academy/${piece.slug}`) },
      openGraph: {
        title: `${piece.title} — La Academia`,
        description: piece.metaDescription,
        type: "article",
        url: siteUrl(`/academy/${piece.slug}`),
      },
    };
  }

  const guide = getAcademyGuideBySlug(slug);
  if (guide) {
    return {
      title: `${guide.title} — La Academia`,
      description: guide.metaDescription,
      alternates: { canonical: siteUrl(`/academy/${guide.slug}`) },
      openGraph: {
        title: `${guide.title} — La Academia`,
        description: guide.metaDescription,
        type: "article",
        url: siteUrl(`/academy/${guide.slug}`),
      },
    };
  }

  return { title: "Artículo no encontrado" };
}

export default async function AcademyArticlePage({ params }: Props) {
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
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "La Academia", item: siteUrl("/academy") },
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
