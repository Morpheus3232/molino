import { initLocale } from "@/lib/i18n/server";
import BlogContent from "./BlogContent";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Blog de Autoconocimiento", "Self-Knowledge Blog"],
  description:
    ["Artículos sobre numerología, astrología y zodíaco chino para entender tu mapa personal de autoconocimiento: tu Número de Vida, tu animal y tu signo astral.", "Articles on numerology, astrology and the Chinese zodiac to understand your personal self-knowledge map: your Life Path Number, your animal and your star sign."],
  path: "/blog",
  ogTitle: "Blog",
  ogDescription: ["Numerología, astrología y zodíaco chino explicados con claridad. Aprendé a leer tu mapa personal de autoconocimiento.", "Numerology, astrology and the Chinese zodiac explained clearly. Learn to read your personal self-knowledge map."],
});

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return <BlogContent />;
}
