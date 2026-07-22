"use client";

import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

interface CrossSystemSynthesisProps {
  profile: UserProfile;
}

export default function CrossSystemSynthesis({ profile }: CrossSystemSynthesisProps) {
  return (
    <Section>
      <div className="mb-8">
        <span className="badge mb-3">When Systems Meet</span>
        <h2 className="font-serif text-2xl font-semibold text-foreground mt-3">
          Cruzando tus sistemas
        </h2>
        <p className="text-sm text-muted mt-2 max-w-2xl">
          Molino combina tradiciones distintas para mostrar coincidencias y tensiones en tu perfil.
        </p>
      </div>

      <Card hover={false} padding="lg">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">
              Numerology
            </p>
            <p className="text-2xl font-serif font-bold text-foreground">{profile.lifePath}</p>
            <p className="text-sm text-muted mt-1">Depth · Analysis · Introspection</p>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-3xl text-muted">×</span>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">
              Chinese Zodiac
            </p>
            <p className="text-2xl font-serif font-bold text-foreground">{profile.chineseZodiac}</p>
            <p className="text-sm text-muted mt-1">
              {profile.chineseZodiacInfo?.element || ""} · Independence · Movement
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">
            Your Combined Pattern
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Tu perfil combina una fuerte necesidad de independencia con una tendencia natural hacia
            la introspección. Esto puede generar una tensión dinámica entre el deseo de explorar y la
            necesidad de procesar internamente antes de avanzar.
          </p>
        </div>
      </Card>
    </Section>
  );
}
