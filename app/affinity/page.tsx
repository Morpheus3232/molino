import { siteUrl } from "@/lib/seo";

export const metadata = {
  title: "Afinidad",
  description: "Descubrí la afinidad simbólica entre vos y el mundo: marcas, países, ciudades y personas históricas.",
  alternates: {
    canonical: siteUrl("/affinity"),
  },
  openGraph: {
    title: "Afinidad — Molino",
    description: "Afinidad simbólica entre vos y el mundo.",
    type: "website",
    url: siteUrl("/affinity"),
    images: [siteUrl("/opengraph-image")],
  },
};

import AffinityClient from "./AffinityClient";

export default function AffinityPage() {
  return <AffinityClient />;
}