import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, siteUrl } from "@/lib/seo";
import { SOURCES, getSourceBySlug } from "@/lib/data/biblioteca-content";
import BibliotecaSourceContent from "./BibliotecaSourceContent";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SOURCES.map((source) => ({ slug: source.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const source = getSourceBySlug(slug);

  if (!source) {
    return { title: "Fuente no encontrada" };
  }

  return {
    title: `${source.title} — Biblioteca`,
    description: source.metaDescription,
    alternates: {
      canonical: siteUrl(`/biblioteca/${source.slug}`),
    },
    openGraph: {
      title: `${source.title} — Biblioteca`,
      description: source.metaDescription,
      type: "article",
      url: siteUrl(`/biblioteca/${source.slug}`),
    },
  };
}

export default async function BibliotecaSourcePage({ params }: Props) {
  const { slug } = await params;
  const source = getSourceBySlug(slug);

  if (!source) {
    notFound();
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: source.title,
      description: source.metaDescription,
      author: { "@type": "Organization", name: "Molino" },
      publisher: { "@type": "Organization", name: "Molino" },
      url: siteUrl(`/biblioteca/${source.slug}`),
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(`/biblioteca/${source.slug}`) },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Biblioteca", item: siteUrl("/biblioteca") },
        { "@type": "ListItem", position: 3, name: source.title },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BibliotecaSourceContent source={source} />
    </>
  );
}
