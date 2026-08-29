import { createRouteMetadata } from "@/lib/seo";
import CanjearClient from "./CanjearClient";

interface Props {
  searchParams: Promise<{ codigo?: string }>;
}

export const metadata = createRouteMetadata({
  title: "Canjear un código",
  description: "Ingresá el código que te compartieron y desbloqueá tu Lectura Pro.",
  path: "/canjear",
  // Es una landing para audiencias que llegan con un código en mano, no una
  // página que queremos en los buscadores.
  noIndex: true,
});

export default async function CanjearPage({ searchParams }: Props) {
  const { codigo } = await searchParams;
  return <CanjearClient initialCode={codigo ?? ""} />;
}
