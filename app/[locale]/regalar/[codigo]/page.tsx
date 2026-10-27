import { initLocale } from "@/lib/i18n/server";
import { metadataFor } from "@/lib/seo";
import CanjeClient from "./CanjeClient";

interface Props {
  params: Promise<{ codigo: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; codigo: string }> }) {
  const { codigo } = await params;
  return metadataFor({
    title: ["Te regalaron un mapa", "You've been given a map"],
    description: [
      "Canjeá tu regalo: un mapa personal completo de numerología, astrología y zodíaco chino.",
      "Redeem your gift: a complete personal map of numerology, astrology and the Chinese zodiac.",
    ],
    path: `/regalar/${codigo}`,
  })({ params });
}

export default async function CanjePage({ params }: Props) {
  await initLocale(params);
  const { codigo } = await params;
  return <CanjeClient codigo={codigo} />;
}
