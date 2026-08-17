import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Portal",
  description: "Portal de Molino.",
  noIndex: true,
  noFollow: true,
});

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
