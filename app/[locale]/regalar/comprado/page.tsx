import { metadataFor } from "@/lib/seo";
import CompradoClient from "./CompradoClient";

export const generateMetadata = metadataFor({
  title: ["Tu regalo está listo", "Your gift is ready"],
  description: ["Copiá tu código de regalo y compartilo con quien se lo vas a dar.", "Copy your gift code and share it with the person you're giving it to."],
  path: "/regalar/comprado",
});

export default function CompradoPage() {
  return <CompradoClient />;
}
