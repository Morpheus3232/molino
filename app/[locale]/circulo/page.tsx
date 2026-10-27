"use client";
import { useL } from "@/lib/i18n/useL";

import { useMemo } from "react";
import { useRouter, Link } from "@/lib/i18n/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { decodePublicShareData, profileFromPublicShareData } from "@/lib/utils/profileShare";
import CircleAlignment from "@/components/profile/CircleAlignment";
import SharePublicButton from "@/components/profile/SharePublicButton";
import Button from "@/components/ui/Button";
import { PageHero, PrimaryLink } from "@/components/knowledge/Kit";
import { hasStoredProfile } from "@/lib/session/localStorage";

interface CirculoClientProps {
  refParam: string | null;
}

export default function CirculoClient({ refParam }: CirculoClientProps) {
  const L = useL();
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const sharedProfile = useMemo(() => {
    if (!refParam) return null;
    const data = decodePublicShareData(refParam);
    if (!data) return null;
    return profileFromPublicShareData(data);
  }, [refParam]);

  // Shared view: show the other person's circle
  if (sharedProfile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20">
          <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">{L(<>
            <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
              Inicio
            </Link>
            <span>›</span>
            <Link href="/circulo" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
              Círculo
            </Link>
            <span>›</span>
            <span className="text-foreground font-medium">Compartido</span>
          </>, <><Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Home</Link><span>›</span><Link href="/circulo" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Circle</Link><span>›</span><span className="text-foreground font-medium">Shared</span></>)}</nav>
        </div>

        {/* Public share banner */}
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 mb-6">
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <p className="text-sm text-foreground">{L(<>
              <span className="font-medium">Círculo compartido</span> — datos públicos (sin nombre ni fecha de nacimiento).
            </>, <><span className="font-medium">Shared circle</span> — public data (no name or date of birth).</>)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {mounted && (
                <>
                  {hasStoredProfile() ? (
                    <Button variant="ghost" size="sm" onClick={() => router.push("/circulo")}>{L("Ver mi círculo", "See my circle")}</Button>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => router.push("/onboarding")}>{L("Generá el tuyo para comparar", "Create yours to compare")}</Button>
                  )}
                  <SharePublicButton
                    profile={sharedProfile}
                    path="/circulo"
                    label={L("Compartir este círculo", "Share this circle")}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <main id="main-content">
          <CircleAlignment profile={sharedProfile} />
        </main>
      </div>
    );
  }

  // Own profile view
  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">
          <p className="sr-only" role="status">{L("Cargando tu círculo...", "Loading your circle...")}</p>
          <div className="animate-pulse">
            <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
            <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
            <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
            <div className="h-64 bg-[var(--skeleton)] border border-ink/10 mb-6" />
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <main id="main-content" className="bg-background">
        <PageHero
          crumbs={[{ href: "/", label: L("Inicio", "Home") }, { href: "/profile", label: L("Mi mapa", "My map") }, { label: L("Círculo", "Circle") }]}
          eyebrow={L("Mi mapa", "My map")}
          title={L("Tu círculo de energías", "Your circle of energies")}
          lead={L("Los animales del zodíaco chino que te acompañan y los que te desafían. Para verlo, primero creá tu mapa.", "The Chinese zodiac animals that walk with you and the ones that challenge you. To see it, create your map first.")}
        >
          <PrimaryLink href="/onboarding">{L("Crear mi mapa", "Create my map")}</PrimaryLink>
        </PageHero>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-12 sm:pt-16">
        <PageHero
          bare
          crumbs={[{ href: "/", label: L("Inicio", "Home") }, { href: "/profile", label: L("Mi mapa", "My map") }, { label: L("Círculo", "Circle") }]}
          eyebrow={L("Mi mapa", "My map")}
          title={L("Tu círculo", "Your circle")}
          lead={L("Los animales del ciclo chino que te acompañan y los que te desafían.", "The animals of the Chinese cycle that walk with you and the ones that challenge you.")}
        >
          <SharePublicButton profile={profile} path="/circulo" label={L("Compartir mi círculo", "Share my circle")} />
        </PageHero>
      </div>
      <main id="main-content">
        <CircleAlignment profile={profile} />
      </main>
    </div>
  );
}
