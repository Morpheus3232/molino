import { createRouteMetadata } from "@/lib/seo";
import CompradoClient from "./CompradoClient";

export const metadata = createRouteMetadata({
  title: "Tu regalo está listo",
  description: "Copiá tu código de regalo y compartilo con quien se lo vas a dar.",
  path: "/regalar/comprado",
});

export default function CompradoPage() {
  return <CompradoClient />;
}
