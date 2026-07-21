"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProfileFromStorage } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AiPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = loadProfileFromStorage();
    if (stored) {
      const calculated = calculateUserProfile(stored.name, stored.birthDate);
      setProfile({ ...calculated, ...stored } as UserProfile);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !profile) return;
    setLoading(true);
    setTimeout(() => {
      const text = prompt.toLowerCase();
      let answer = "Molino AI te ayuda a interpretar tu perfil. Podés consultar tu Life Path, arquetipo, elemento y más.";
      if (text.includes("life path") || text.includes("misión")) {
        answer = `Tu Life Path es ${profile.lifePath}. Representa tu propósito fundamental y el camino natural de tu vida.`;
      } else if (text.includes("arquetipo")) {
        const archetype = profile.archetypeInfo?.name || profile.archetype;
        answer = `Tu arquetipo es ${archetype}. Describe el rol que naturalmente encarnás frente a los demás.`;
      } else if (text.includes("elemento")) {
        answer = `Tu elemento es ${profile.element} y tu modality es ${profile.modality}. Esto influye en tu energía, ritmo y forma de relacionarte.`;
      } else if (text.includes("compatibilidad") || text.includes("vínculo")) {
        answer = `Tu compatibilidad se analiza combinando numerología, astrología y zodiaco chino. Podés comparar tu perfil con otras entidades.`;
      }
      setResponse(answer);
      setLoading(false);
    }, 600);
  };

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">🤖 Molino AI</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Asistente contextual</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">Consultá tu perfil simbólico: Life Path, arquetipo, elemento y más.</p>
          </div>
        </Section>

        <Section>
          <Card hover={false} padding="lg">
            <form onSubmit={handleAsk} className="space-y-4">
              <Input
                label="Tu consulta"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: ¿Qué significa mi Life Path?"
                required
              />
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Consultando..." : "Consultar"}
              </Button>
            </form>

            {response && (
              <div className="mt-6 bg-background rounded-2xl p-4 border border-border">
                <p className="text-sm font-medium text-foreground mb-1">Respuesta</p>
                <p className="text-sm text-muted leading-relaxed">{response}</p>
              </div>
            )}
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
