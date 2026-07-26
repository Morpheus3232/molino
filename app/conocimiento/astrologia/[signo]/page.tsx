import type { Metadata } from "next";
import { ZODIAC_SIGNS } from "@/lib/data/astrologia-content";
import SignoContent from "./SignoContent";

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

type Props = { params: Promise<{ signo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { signo: signId } = await params;
  const sign = ZODIAC_SIGNS.find(s => normalize(s.name) === normalize(signId));

  if (!sign) {
    return { title: "Signo no encontrado" };
  }

  return {
    title: `${sign.symbol} ${sign.name} — Astrología Molino`,
    description: `${sign.meaning.slice(0, 155)}`,
    openGraph: {
      title: `${sign.symbol} ${sign.name} — Molino`,
      description: `${sign.meaning.slice(0, 155)}`,
      type: "article",
    },
  };
}

export default async function SignoPage({ params }: Props) {
  const { signo: signId } = await params;
  const sign = ZODIAC_SIGNS.find(s => normalize(s.name) === normalize(signId));

  const jsonLd = sign ? [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${sign.symbol} ${sign.name}`,
      description: sign.meaning.slice(0, 200),
      author: { "@type": "Organization", name: "Molino" },
      publisher: { "@type": "Organization", name: "Molino" },
      url: `https://molino-alpha.vercel.app/conocimiento/astrologia/${normalize(sign.name)}`,
      mainEntityOfPage: { "@type": "WebPage", "@id": `https://molino-alpha.vercel.app/conocimiento/astrologia/${normalize(sign.name)}` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://molino-alpha.vercel.app" },
        { "@type": "ListItem", position: 2, name: "Conocimiento", item: "https://molino-alpha.vercel.app/explore" },
        { "@type": "ListItem", position: 3, name: "Astrología", item: "https://molino-alpha.vercel.app/conocimiento/astrologia" },
        { "@type": "ListItem", position: 4, name: sign.name },
      ],
    },
  ] : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <SignoContent />
    </>
  );
}
