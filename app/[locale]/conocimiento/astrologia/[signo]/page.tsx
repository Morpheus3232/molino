import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, siteUrl } from "@/lib/seo";
import { ZODIAC_SIGNS } from "@/lib/data/astrologia-content";
import SignoContent from "./SignoContent";

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

type Props = { params: Promise<{ signo: string }> };

// Los 12 signos válidos se pre-generan; cualquier otro slug resuelve a 404 real
// en el router (antes renderizaba "Signo no encontrado" con status 200).
export const dynamicParams = false;

export async function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ signo: normalize(s.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { signo: signId } = await params;
  const sign = ZODIAC_SIGNS.find(s => normalize(s.name) === normalize(signId));

  if (!sign) {
    return { title: "Signo no encontrado" };
  }

  return {
    title: `${sign.symbol} ${sign.name} — Astrología`,
    description: `${sign.meaning.slice(0, 155)}`,
    alternates: {
      canonical: siteUrl(`/conocimiento/astrologia/${normalize(sign.name)}`),
    },
    openGraph: {
      title: `${sign.symbol} ${sign.name}`,
      description: `${sign.meaning.slice(0, 155)}`,
      type: "article",
      url: siteUrl(`/conocimiento/astrologia/${normalize(sign.name)}`),
    },
  };
}

export default async function SignoPage({ params }: Props) {
  const { signo: signId } = await params;
  const sign = ZODIAC_SIGNS.find(s => normalize(s.name) === normalize(signId));

  if (!sign) notFound();

  const jsonLd = sign ? [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${sign.symbol} ${sign.name}`,
      description: sign.meaning.slice(0, 200),
      author: { "@type": "Organization", name: "Molino" },
      publisher: { "@type": "Organization", name: "Molino" },
      url: siteUrl(`/conocimiento/astrologia/${normalize(sign.name)}`),
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(`/conocimiento/astrologia/${normalize(sign.name)}`) },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Conocimiento", item: siteUrl("/explore") },
        { "@type": "ListItem", position: 3, name: "Astrología", item: siteUrl("/conocimiento/astrologia") },
        { "@type": "ListItem", position: 4, name: sign.name },
      ],
    },
  ] : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <SignoContent sign={sign} />
    </>
  );
}
