import MethodContent from "./MethodContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Method — Cómo funciona",
  description: "Transparencia total: cómo se calculan los números, las limitaciones de cada sistema simbólico y las fuentes en las que se basa Molino.",
  path: "/method",
  ogTitle: "Method — Molino",
  ogDescription: "Transparencia total: cómo se calculan los números, las limitaciones de cada sistema y las fuentes en las que se basa.",
});

export default function MethodPage() {
  return <MethodContent />;
}
