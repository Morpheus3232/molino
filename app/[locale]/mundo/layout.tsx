import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Tu Mundo", "Your World"],
  description: ["Los países, ciudades y marcas que resuenan con tu mapa personal.", "The countries, cities and brands that resonate with your personal map."],
  noIndex: true,
});

export default function MundoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
