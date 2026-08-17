import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Mi Evolución",
  noIndex: true,
});

export default function EvolutionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
