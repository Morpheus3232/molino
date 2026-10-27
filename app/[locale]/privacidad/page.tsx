import { initLocale } from "@/lib/i18n/server";
import PrivacidadContent from "./PrivacidadContent";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Política de Privacidad", "Privacy Policy"],
  description: ["Política de privacidad de Molino. Cómo recopilamos, usamos y protegemos tu información.", "Molino's privacy policy. How we collect, use and protect your information."],
  path: "/privacidad",
  ogTitle: ["Política de Privacidad", "Privacy Policy"],
  ogDescription: ["Política de privacidad de Molino.", "Molino's privacy policy."],
  image: "/opengraph-image",
});

export default async function PrivacidadPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return <PrivacidadContent />;
}
