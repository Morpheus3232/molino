import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Analytics",
  noIndex: true,
  noFollow: true,
});

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}