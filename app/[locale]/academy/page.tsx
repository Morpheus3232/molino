import AcademyContent from "./AcademyContent";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["La Academia", "The Academy"],
  description: ["La historia de las tradiciones simbólicas: desde Babilonia y Pitágoras hasta el zodíaco chino moderno.", "The history of the symbolic traditions: from Babylon and Pythagoras to the modern Chinese zodiac."],
  path: "/academy",
  ogTitle: ["La Academia", "The Academy"],
  ogDescription: ["La historia de las tradiciones simbólicas que alimentan tu mapa personal.", "The history of the symbolic traditions that feed your personal map."],
});

export default function AcademyPage() {
  return <AcademyContent />;
}
