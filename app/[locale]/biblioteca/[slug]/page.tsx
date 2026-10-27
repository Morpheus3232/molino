import { getL, initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, siteUrl, localeAlternates, localeUrl } from "@/lib/seo";
import { SOURCES, getSourceBySlug } from "@/lib/data/biblioteca-content";
import BibliotecaSourceContent from "./BibliotecaSourceContent";

type Props = { params: Promise<{ slug: string }> };

// Solo los slugs pre-generados son válidos; el resto resuelve a 404 real.
export const dynamicParams = false;

export function generateStaticParams() {
  return SOURCES.map((source) => ({ slug: source.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const L = await metaL(params);
  const { slug } = await params;
  const source = getSourceBySlug(slug);

  if (!source) {
    return { title: L("Fuente no encontrada", "Source not found") };
  }

  const path = `/biblioteca/${source.slug}`;
  const title = L(`${source.title} — Biblioteca`, `${L.t(source.title)} — Library`);
  const description = L.t(source.metaDescription);
  return {
    title,
    description,
    alternates: localeAlternates(path, L.locale),
    openGraph: { title, description, type: "article", url: localeUrl(path, L.locale) },
  };
}

export default async function BibliotecaSourcePage({ params }: Props) {
  await initLocale(params);
  const L = await getL();
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
        { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
        { "@type": "ListItem", position: 2, name: L("Biblioteca", "Library"), item: siteUrl("/biblioteca") },
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
