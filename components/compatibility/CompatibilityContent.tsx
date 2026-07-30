"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateCompatibility } from "@/lib/engines/compatibilityEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { generateMatchStory, type MatchStory } from "@/lib/engines/storyEngine";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import CompatibilityLab from "@/components/lab/CompatibilityLab";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import Link from "next/link";
import type { EntityProfile } from "@/lib/data/entities";

interface CompatibilityContentProps {
  entity: EntityProfile;
}

export default function CompatibilityContent({ entity }: CompatibilityContentProps) {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const compat = useMemo(() => {
    if (!profile) return null;
    return calculateCompatibility(profile, {
      lifePath: entity.symbolism.lifePath || 5,
      sunSign: entity.symbolism.sunSign,
      chineseZodiac: entity.symbolism.chineseZodiac,
      archetype: entity.symbolism.archetype,
      element: entity.symbolism.element,
      name: entity.name,
    });
  }, [profile, entity]);

  const dailyEnergy = useMemo(() => {
    if (!profile) return null;
    return calculateDailyEnergy(profile, new Date());
  }, [profile]);

  const story: MatchStory | null = useMemo(() => {
    if (!profile || !compat) return null;
    try {
      return generateMatchStory(profile, entity, compat.scores.overall);
    } catch {
      return null;
    }
  }, [profile, entity, compat]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/compatibility/${entity.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Compatibilidad con ${entity.name}`,
        text: `Descubrí tu compatibilidad con ${entity.name} en Molino`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("Link copiado al portapapeles");
      }).catch(() => {});
    }
  }, [entity]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingState message="Cargando compatibilidad..." />
        <UniversityFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-12 text-center">
          <div className="mb-6">
            <span className="text-5xl">{entity.emoji}</span>
          </div>
          <h1 className="font-heading text-3xl font-semibold text-foreground mb-4">
            Compatibilidad con {entity.name}
          </h1>
          <p className="text-sm text-muted mb-8 max-w-md mx-auto">
            Para ver tu compatibilidad con {entity.name}, primero necesitás crear tu perfil personal.
          </p>
          <Button size="lg" onClick={() => router.push("/")}>
            Crear mi perfil
          </Button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-content px-4 sm:px-6 py-8 pb-24" id="main-content">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <span>›</span>
          <Link href="/explore" className="hover:text-foreground transition-colors">Explorar</Link>
          <span>›</span>
          <span className="text-foreground font-medium">{entity.name}</span>
        </nav>

        {/* Entity header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{entity.emoji}</span>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Análisis multi-factor de {entity.name}
            </h1>
            <p className="text-sm text-muted mt-1">
              {entity.category} · {entity.context.keyThemes.slice(0, 3).join(' · ')}
            </p>
          </div>
        </div>

        {/* Explanation of what this page is */}
        <div className="mb-6 p-4 rounded-none bg-accent/[0.05] border border-accent/20">
          <p className="text-sm text-muted leading-relaxed">
            Este análisis usa <strong>múltiples sistemas</strong> (numerología, astrología occidental, zodiaco chino, arquetipos) para evaluar la compatibilidad.
            Para la <strong>afinidad principal</strong> basada solo en el zodíaco chino, visitá la página de <a href={`/affinity`} className="text-accent hover:underline">afinidad simbólica</a>.
          </p>
        </div>

        {/* User context */}
        <div className="mb-6 p-4 rounded-none bg-background border border-border">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Tu perfil</p>
          <p className="text-sm text-foreground">
            <span className="font-medium">{profile.name}</span> · Camino de Vida {profile.lifePath} · {profile.sunSign} · {profile.chineseZodiac}
          </p>
        </div>

        {/* Compatibility results */}
        {compat && (
          <CompatibilityLab
            user={profile}
            entity={entity}
            result={compat}
            template={`Analiza la compatibilidad desde la perspectiva de ${entity.category}.`}
          />
        )}

        {/* Narrative */}
        {story && (
          <div className="mt-6">
            <div className="rounded-none border border-border bg-card p-6">
              <span className="badge mb-3">Narrativa de conexión</span>
              <p className="text-lg leading-relaxed text-foreground mb-4">{story.narrative}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-none bg-background p-4 border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">Puntos de conexión</p>
                  <ul className="text-sm text-muted space-y-2">
                    {story.connections.map((conn, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{conn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-none bg-background p-4 border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">Áreas de crecimiento</p>
                  <ul className="text-sm text-muted space-y-2">
                    {story.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">⟳</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Interpretation */}
        {compat && (
          <div className="mt-6">
            <MolinoInterpretation
              profile={profile}
              type="compatibility"
              compatibility={compat}
              dailyEnergy={dailyEnergy || undefined}
              entity={entity}
              label="Interpretación de Molino"
              description="Análisis personalizado de tu compatibilidad"
            />
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-card rounded-none border border-border text-center space-y-2">
          <p className="text-xs text-muted">
            Resultado para <span className="font-medium">{profile.name}</span> con {entity.name}
          </p>
          <p className="text-xs text-muted">
            Análisis basado en numerología, astrología occidental, zodiaco chino y arquetipos.
          </p>
        </div>

        {/* Share */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleShare}
            className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-mono tracking-wider text-muted hover:text-accent transition-colors border border-border hover:border-accent rounded-none"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Compartir resultado
          </button>
        </div>
      </main>

      <UniversityFooter />
    </div>
  );
}
