import { createRouteMetadata } from "@/lib/seo";
import RegalarClient from "./RegalarClient";

export const metadata = createRouteMetadata({
  title: "Regalar Mapa Personal",
  description:
    "Regalale un mapa personal completo: numerología, astrología y zodíaco chino. No necesitás su fecha de nacimiento — la ingresa quien lo recibe, al canjear.",
  path: "/regalar",
  ogTitle: "Regalale su mapa",
  ogDescription: "Un mapa personal completo, de regalo. $8 USD, pago único. El destinatario ingresa su fecha al canjear, no vos.",
});

export default function RegalarPage() {
  return <RegalarClient />;
}
