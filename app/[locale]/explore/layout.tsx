import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Explorá el conocimiento", "Explore the knowledge"],
  description:
    ["Explorá numerología, astrología, zodiaco chino y compatibilidad. Todo el conocimiento de Molino, con sus fuentes y metodología, abierto y auditable.", "Explore numerology, astrology, the Chinese zodiac and compatibility. All of Molino's knowledge, with its sources and methodology, open and auditable."],
  path: "/explore",
  ogTitle: ["Explorá el conocimiento", "Explore the knowledge"],
  ogDescription: ["Numerología, astrología, zodiaco chino y compatibilidad. Conocimiento abierto y auditable.", "Numerology, astrology, the Chinese zodiac and compatibility. Open, auditable knowledge."],
  image: "/opengraph-image",
});

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
