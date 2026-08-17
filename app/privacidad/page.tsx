import PrivacidadContent from "./PrivacidadContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Política de Privacidad",
  description: "Política de privacidad de Molino. Cómo recopilamos, usamos y protegemos tu información.",
  path: "/privacidad",
  ogTitle: "Política de Privacidad — Molino",
  ogDescription: "Política de privacidad de Molino.",
  image: "/opengraph-image",
});

export default function PrivacidadPage() {
  return <PrivacidadContent />;
}
