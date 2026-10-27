import { getL, initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, siteUrl, localeAlternates, localeUrl } from "@/lib/seo";
import { NUMBERS } from "@/lib/data/numerologia-content";
import NumeroContent from "./NumeroContent";

type Props = { params: Promise<{ numero: string }> };

// Los números válidos del catálogo se pre-generan; cualquier otro resuelve a
// 404 real en el router (antes renderizaba "Número no encontrado" con 200).
export const dynamicParams = false;

export async function generateStaticParams() {
  return NUMBERS.map((n) => ({ numero: String(n.number) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const L = await metaL(params);
  const { numero: numId } = await params;
  const num = NUMBERS.find(n => n.number === parseInt(numId));

  if (!num) {
    return { title: L("Número no encontrado", "Number not found") };
  }

  const t = L.t(num.title);
  const description = L.t(num.meaning).slice(0, 155);
  const path = `/conocimiento/numerologia/${num.number}`;
  return {
    title: L(`Número ${num.number} ${num.title} — Numerología`, `Number ${num.number} ${t} — Numerology`),
    description,
    alternates: localeAlternates(path, L.locale),
    openGraph: {
      title: L(`Número ${num.number} ${num.title}`, `Number ${num.number} ${t}`),
      description,
      type: "article",
      url: localeUrl(path, L.locale),
    },
  };
}

export default async function NumeroPage({ params }: Props) {
  await initLocale(params);
  const L = await getL();
  const { numero: numId } = await params;
  const num = NUMBERS.find(n => n.number === parseInt(numId));

  if (!num) notFound();

  const jsonLd = num ? [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: L(`Número ${num.number} ${num.title}`, `Number ${num.number} ${L.t(num.title)}`),
      description: num.meaning.slice(0, 200),
      author: { "@type": "Organization", name: "Molino" },
      publisher: { "@type": "Organization", name: "Molino" },
      url: siteUrl(`/conocimiento/numerologia/${num.number}`),
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(`/conocimiento/numerologia/${num.number}`) },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
        { "@type": "ListItem", position: 2, name: L("Conocimiento", "Knowledge"), item: siteUrl("/explore") },
        { "@type": "ListItem", position: 3, name: "Numerología", item: siteUrl("/conocimiento/numerologia") },
        { "@type": "ListItem", position: 4, name: L(`Número ${num.number}`, `Number ${num.number}`) },
      ],
    },
  ] : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <NumeroContent num={num} />
    </>
  );
}
