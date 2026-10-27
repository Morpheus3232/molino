import AcademyContent from "./AcademyContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "La Academia",
  description: "La historia de las tradiciones simbólicas: desde Babilonia y Pitágoras hasta el zodíaco chino moderno.",
  path: "/academy",
  ogTitle: "La Academia",
  ogDescription: "La historia de las tradiciones simbólicas que alimentan tu mapa personal.",
});

export default function AcademyPage() {
  return <AcademyContent />;
}
