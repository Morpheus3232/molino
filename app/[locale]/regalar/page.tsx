import { initLocale } from "@/lib/i18n/server";
import { metadataFor } from "@/lib/seo";
import RegalarClient from "./RegalarClient";

export const generateMetadata = metadataFor({
  title: ["Regalar Mapa Personal", "Gift a Personal Map"],
  description:
    ["Regalale un mapa personal completo: numerología, astrología y zodíaco chino. No necesitás su fecha de nacimiento — la ingresa quien lo recibe, al canjear.", "Give someone a complete personal map: numerology, astrology and the Chinese zodiac. You don't need their date of birth — the person who receives it enters it when redeeming."],
  path: "/regalar",
  ogTitle: ["Regalale su mapa", "Give them their map"],
  ogDescription: ["Un mapa personal completo, de regalo. $8 USD, pago único. El destinatario ingresa su fecha al canjear, no vos.", "A complete personal map, as a gift. $8 USD, one-time payment. The recipient enters their date when redeeming, not you."],
});

export default async function RegalarPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return <RegalarClient />;
}
