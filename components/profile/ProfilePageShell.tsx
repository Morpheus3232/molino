"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/lib/hooks/useProfile";
import Button from "@/components/ui/Button";
import type { UserProfile } from "@/types/user";

interface ProfilePageShellProps {
  breadcrumbLabel: string;
  loadingLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  children: (profile: UserProfile) => React.ReactNode;
}

/**
 * Shell compartido por las páginas propias de un capítulo de perfil
 * (/circulo, /mundo) — mismo patrón de carga/vacío/breadcrumb que ya usan
 * /evolution y /nudo, factorizado acá para no repetirlo una tercera y
 * cuarta vez.
 */
export default function ProfilePageShell({
  breadcrumbLabel,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  children,
}: ProfilePageShellProps) {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">
          <p className="sr-only" role="status" aria-label={loadingLabel}>
            {loadingLabel}
          </p>
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
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-24 text-center" id="main-content">
          <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-foreground mb-4">
            {emptyTitle}
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">{emptyDescription}</p>
          <Button variant="primary" size="lg" onClick={() => router.push("/onboarding")}>
            Crear mi perfil
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20">
        <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
            Inicio
          </Link>
          <span>›</span>
          <Link href="/profile" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
            Mi mapa
          </Link>
          <span>›</span>
          <span className="text-foreground font-medium">{breadcrumbLabel}</span>
        </nav>
      </div>
      <main id="main-content">{children(profile)}</main>
    </div>
  );
}
