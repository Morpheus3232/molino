import BlogContent from "./BlogContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Blog de Autoconocimiento",
  description:
    "Artículos sobre numerología, astrología y zodíaco chino para entender tu mapa personal de autoconocimiento: tu Número de Vida, tu animal y tu signo astral.",
  path: "/blog",
  ogTitle: "Blog",
  ogDescription: "Numerología, astrología y zodíaco chino explicados con claridad. Aprendé a leer tu mapa personal de autoconocimiento.",
});

export default function BlogPage() {
  return <BlogContent />;
}
