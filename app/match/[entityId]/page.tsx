"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ENTITIES } from "@/lib/data/entities";
import { calculateCompatibility } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { generateMatchStory } from "@/lib/engines/storyEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { getScoreColor, getScoreLabel } from "@/lib/utils/score";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";



export default function MatchPage() {
  const router = useRouter();
  const params = useParams();
  const entityId = params.entityId as string;

  const [profile, setProfile] = useState<UserProfile | null>(getOrCreateProfile);
  const [entity, setEntity] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [story, setStory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const current = getOrCreateProfile();
    if (!current) {
      router.push("/");
      return;
    }
    setProfile(current);
  }, [router]);

  useEffect(() => {
    if (!profile || !entityId) return;

    const allEntities = [...ENTITIES];
    const foundEntity = allEntities.find((e: any) => e.id === entityId);
    if (!foundEntity) {
      router.push("/explore");
      return;
    }

    setEntity(foundEntity);
    const compatibilityResult = calculateCompatibility(profile, foundEntity);
    setResult(compatibilityResult);
    setStory(generateMatchStory(profile, foundEntity, compatibilityResult.scores.overall));
    setIsLoading(false);
  }, [profile, entityId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Analizando compatibilidad...</div>
      </div>
    );
  }

  if (!profile || !entity || !result || !story) return null;

  const score = result.scores.overall;
  const getScoreColor = (s: number): string => {
    if (s >= 80) return "text-green-500";
    if (s >= 60) return "text-blue-500";
    if (s >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (s: number): string => {
    if (s >= 80) return "Excelente conexión";
    if (s >= 60) return "Muy buena conexión";
    if (s >= 40) return "Buena conexión";
    return "Conexión en desarrollo";
  };

  const scoreSlices = [
    { label: "Numerología", value: result.scores.numerology || 0 },
    { label: "Astrología", value: result.scores.westernAstrology || 0 },
    { label: "Zodiaco chino", value: result.scores.chineseAstrology || 0 },
    { label: "Arquetipo", value: result.scores.archetype || 0 },
    { label: "Elemento", value: result.scores.element || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/explore")}>
            ← Volver a explorar
          </Button>
        </div>

        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 text-center sm:text-left">
                <span className="badge mb-3">Match</span>
                <h1 className="font-serif text-3xl font-bold text-foreground mt-3">{entity.name}</h1>
                <p className="text-muted mt-2">{getScoreLabel(score)} · {entity.category}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-accent">
                  <span className={`text-5xl font-serif ${getScoreColor(score)}`}>{score}%</span>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Desglose</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {scoreSlices.map((item) => (
                <div key={item.label} className="bg-background rounded-2xl p-4 text-center border border-border">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">{item.label}</p>
                  <p className={`text-2xl font-serif font-bold mt-2 ${getScoreColor(item.value)}`}>{item.value}%</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Narrativa de conexión</span>
            </div>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-foreground">{story.narrative}</p>

              <div className="bg-background rounded-2xl p-4 border border-border">
                <p className="text-sm font-medium text-foreground mb-2">Puntos de conexión</p>
                <ul className="text-sm text-muted space-y-2">
                  {story.connections.map((conn: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{conn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-background rounded-2xl p-4 border border-border">
                <p className="text-sm font-medium text-foreground mb-2">Áreas de crecimiento</p>
                <ul className="text-sm text-muted space-y-2">
                  {story.challenges.map((challenge: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">⟳</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </Section>

        <Section>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button fullWidth onClick={() => router.push("/explore")}>
              Explorar más compatibilidades →
            </Button>
            <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>
              Ver mi perfil
            </Button>
          </div>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
