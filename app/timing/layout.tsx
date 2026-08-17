import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Timing",
  noIndex: true,
});

export default function TimingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
