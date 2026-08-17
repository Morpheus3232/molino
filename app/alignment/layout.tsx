import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Alineación",
  description: "Explorá tu alineación y equilibrio energético.",
  noIndex: true,
  noFollow: true,
});

export default function AlignmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}