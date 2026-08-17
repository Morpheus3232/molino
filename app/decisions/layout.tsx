import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Decisiones",
  description: "Registrá y revisá tus decisiones con el marco de Molino.",
  noIndex: true,
  noFollow: true,
});

export default function DecisionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}