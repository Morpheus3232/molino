import { getL, initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, siteUrl, localeAlternates, localeUrl } from "@/lib/seo";
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
  const L = await metaL(params);
  const { signo: signId } = await params;
  const sign = ZODIAC_SIGNS.find(s => normalize(s.name) === normalize(signId));

  if (!sign) {
    return { title: L("Signo no encontrado", "Sign not found") };
  }

  const name = L.t(sign.name);
  const description = L.t(sign.meaning).slice(0, 155);
  const path = `/conocimiento/astrologia/${normalize(sign.name)}`;
  return {
    title: L(`${sign.symbol} ${name} — Astrología`, `${sign.symbol} ${name} — Astrology`),
    description,
    alternates: localeAlternates(path, L.locale),
    openGraph: {
      title: `${sign.symbol} ${name}`,
      description,
      type: "article",
      url: localeUrl(path, L.locale),
    },
  };
}

export default async function SignoPage({ params }: Props) {
  await initLocale(params);
  const L = await getL();
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
        { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
        { "@type": "ListItem", position: 2, name: L("Conocimiento", "Knowledge"), item: siteUrl("/explore") },
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
