import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, siteUrl } from "@/lib/seo";
import { ACADEMY_PIECES, getAcademyPieceBySlug } from "@/lib/data/academy-content";
import AcademyArticleContent from "./AcademyArticleContent";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ACADEMY_PIECES.map((piece) => ({ slug: piece.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const piece = getAcademyPieceBySlug(slug);

  if (!piece) {
    return { title: "Artículo no encontrado" };
  }

  return {
    title: `${piece.title} — La Academia`,
    description: piece.metaDescription,
    alternates: {
      canonical: siteUrl(`/academy/${piece.slug}`),
    },
    openGraph: {
      title: `${piece.title} — La Academia | Molino`,
      description: piece.metaDescription,
      type: "article",
      url: siteUrl(`/academy/${piece.slug}`),
    },
  };
}

export default async function AcademyArticlePage({ params }: Props) {
  const { slug } = await params;
  const piece = getAcademyPieceBySlug(slug);

  if (!piece) {
    notFound();
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: piece.title,
      description: piece.metaDescription,
      author: { "@type": "Organization", name: "Molino" },
      publisher: { "@type": "Organization", name: "Molino" },
      url: siteUrl(`/academy/${piece.slug}`),
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(`/academy/${piece.slug}`) },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "La Academia", item: siteUrl("/academy") },
        { "@type": "ListItem", position: 3, name: piece.title },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AcademyArticleContent piece={piece} />
    </>
  );
}
