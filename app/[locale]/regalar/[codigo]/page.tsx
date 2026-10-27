import { createRouteMetadata } from "@/lib/seo";
import CanjeClient from "./CanjeClient";

interface Props {
  params: Promise<{ codigo: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { codigo } = await params;
  return createRouteMetadata({
    title: "Te regalaron un mapa",
    description: "Canjeá tu regalo: un mapa personal completo de numerología, astrología y zodíaco chino.",
    path: `/regalar/${codigo}`,
  });
}

export default async function CanjePage({ params }: Props) {
  const { codigo } = await params;
  return <CanjeClient codigo={codigo} />;
}
