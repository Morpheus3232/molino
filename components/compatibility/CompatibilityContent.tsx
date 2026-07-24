"use client";

import { useMemo } from "react";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateCompatibility } from "@/lib/engines/compatibilityEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import CompatibilityLab from "@/components/lab/CompatibilityLab";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import Link from "next/link";
import type { EntityProfile } from "@/lib/data/entities";

interface CompatibilityContentProps {
  entity: EntityProfile;
}

export default function CompatibilityContent({ entity }: CompatibilityContentProps) {
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

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <LoadingState message="Cargando compatibilidad..." />
        <UniversityFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="mx-auto max-w-content px-4 sm:px-6 py-12 text-center">
          <div className="mb-6">
            <span className="text-5xl">{entity.emoji}</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-4">
            Compatibilidad con {entity.name}
          </h1>
          <p className="text-sm text-muted mb-8 max-w-md mx-auto">
            Para ver tu compatibilidad con {entity.name}, primero necesitás crear tu perfil personal.
          </p>
          <Button size="lg" onClick={() => window.location.href = "/"}>
            Crear mi perfil
          </Button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

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
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Compatibilidad con {entity.name}
            </h1>
            <p className="text-sm text-muted mt-1">
              {entity.category} · {entity.context.keyThemes.slice(0, 3).join(' · ')}
            </p>
          </div>
        </div>

        {/* User context */}
        <div className="mb-6 p-4 rounded-xl bg-background border border-border">
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
        <div className="mt-8 p-4 bg-card rounded-xl border border-border text-center space-y-2">
          <p className="text-xs text-muted">
            Resultado para <span className="font-medium">{profile.name}</span> con {entity.name}
          </p>
          <p className="text-xs text-muted/70">
            Análisis basado en numerología, astrología occidental, zodiaco chino y arquetipos.
          </p>
        </div>
      </main>

      <UniversityFooter />
    </div>
  );
}
