import TerminosContent from "./TerminosContent";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Términos y Condiciones", "Terms and Conditions"],
  description: ["Términos y condiciones de uso de Molino.", "Terms and conditions of use for Molino."],
  path: "/terminos",
  image: "/opengraph-image",
});

export default function TerminosPage() {
  return <TerminosContent />;
}
