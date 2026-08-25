import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_URL, createRouteMetadata } from "@/lib/seo";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { UserProfile } from "@/types/user";
import ProfileHub from "@/components/profile/ProfileHub";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const metadata = createRouteMetadata({
  title: "Ejemplo de mapa personal",
  description: "Perfil de ejemplo: la misma estructura y los mismos cálculos de numerología, astrología y zodíaco chino que ve cualquier usuario en su propio mapa.",
  path: "/ejemplo",
  ogDescription: "Perfil de ejemplo con la estructura real del mapa de Molino.",
  image: "/opengraph-image",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ejemplo" },
    ],
  },
];

// Mismo pipeline que /profile para el flujo dob-only (ver buildProfile en
// app/profile/page.tsx): calculateUserProfile() es el único cálculo real,
// sin hora ni lugar de nacimiento — por eso no hay signo lunar en ningún
// lado del mapa real, tampoco acá.
function buildDemoProfile(): UserProfile {
  const calculated = calculateUserProfile("María", "1990-03-15");
  return {
    ...calculated,
    birthPlace: "",
    birthTime: undefined,
    goal: "life" as const,
    interests: [],
    onboardingStep: 4,
    completedSections: ["identity"],
    theme: "light" as const,
    language: "es" as const,
    notifications: true,
    cycles: calculated.cycles || { personalYear: 0, personalMonth: 0, personalDay: 0 },
    recommendations: calculated.recommendations || { strengths: [], challenges: [], practices: [] },
  };
}

const demoProfile = buildDemoProfile();
const catalog = SYMBOLIC_ENTITIES.map(toLightweightEntity);

export default function EjemploPage() {
  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-6">
        <nav className="flex items-center gap-2 text-xs text-muted mb-4" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Ejemplo</span>
        </nav>
        <div className="flex items-center gap-3 pb-4">
          <Badge variant="muted">Perfil de ejemplo</Badge>
          <p className="text-xs text-muted">
            Este mapa usa un perfil de demostración para mostrar la estructura y los cálculos reales.
          </p>
        </div>
      </div>

      <ProfileHub profile={demoProfile} catalog={catalog} isDemo />

      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-16 text-center border-t border-ink/10">
        <Button variant="accent" size="lg" asChild>
          <Link href="/">
            Generá tu propio mapa
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
