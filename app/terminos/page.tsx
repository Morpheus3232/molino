import TerminosContent from "./TerminosContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de Molino.",
  path: "/terminos",
  image: "/opengraph-image",
});

export default function TerminosPage() {
  return <TerminosContent />;
}
