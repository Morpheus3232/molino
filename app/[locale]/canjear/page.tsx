import { metadataFor } from "@/lib/seo";
import CanjearClient from "./CanjearClient";

interface Props {
  searchParams: Promise<{ codigo?: string }>;
}

export const generateMetadata = metadataFor({
  title: ["Canjear un código", "Redeem a code"],
  description: ["Ingresá el código que te compartieron y desbloqueá tu Lectura Pro.", "Enter the code someone shared with you and unlock your Pro Reading."],
  path: "/canjear",
  // Es una landing para audiencias que llegan con un código en mano, no una
  // página que queremos en los buscadores.
  noIndex: true,
});

export default async function CanjearPage({ searchParams }: Props) {
  const { codigo } = await searchParams;
  return <CanjearClient initialCode={codigo ?? ""} />;
}
