import { initLocale } from "@/lib/i18n/server";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Analytics",
  noIndex: true,
  noFollow: true,
});

export default async function AnalyticsLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return <>{children}</>;
}