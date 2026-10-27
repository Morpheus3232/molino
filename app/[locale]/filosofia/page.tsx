import { useL, type Pick2 } from "@/lib/i18n/useL";
import { SITE_URL, siteUrl, metadataFor } from "@/lib/seo";
import FilosofiaContent from "./FilosofiaContent";

export const generateMetadata = metadataFor({
  title: ["Filosofía de Molino: Autoconocimiento Sin Dogmas", "Molino's Philosophy: Self-Knowledge Without Dogma"],
  description:
    ["Conocé la filosofía de Molino: autoconocimiento sin dogmas, código abierto y privacidad radical. 100% privado, cálculo local, sin registro. Descubrí más.", "Discover Molino's philosophy: self-knowledge without dogma, open source and radical privacy. 100% private, calculated on your device, no sign-up. Learn more."],
  path: "/filosofia",
  ogDescription:
    ["Conocé la filosofía de Molino: autoconocimiento sin dogmas, código abierto y privacidad radical. 100% privado, cálculo local, sin registro. Descubrí más.", "Discover Molino's philosophy: self-knowledge without dogma, open source and radical privacy. 100% private, calculated on your device, no sign-up. Learn more."],
  image: "/opengraph-image",
});

const jsonLd = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: L("Filosofía de Molino: Autoconocimiento Sin Dogmas", "Molino's Philosophy: Self-Knowledge Without Dogma"),
    description:
      L("Conocé la filosofía de Molino: autoconocimiento sin dogmas, código abierto y privacidad radical. 100% privado, cálculo local, sin registro. Descubrí más.", "Discover Molino's philosophy: self-knowledge without dogma, open source and radical privacy. 100% private, calculated on your device, no sign-up. Learn more."),
    image: siteUrl("/opengraph-image"),
    // Fechas reales tomadas de `git log` sobre FilosofiaContent.tsx (no una
    // fecha "de hoy" inventada): creación 2026-07-28, última modificación
    // de contenido 2026-08-17.
    datePublished: "2026-07-28T00:00:00Z",
    dateModified: "2026-08-17T00:00:00Z",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/filosofia"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/filosofia") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: L("Filosofía", "Philosophy") },
    ],
  },
]);

export default function FilosofiaPage() {
  const L = useL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <FilosofiaContent />
    </>
  );
}