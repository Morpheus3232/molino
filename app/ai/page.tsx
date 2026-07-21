"use client";

import { useState } from "react";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const MOCK_RESPONSES: Record<string, string> = {
  "life path": "Tu Life Path revela tu propósito fundamental. Está vinculado a tus desafíos y dones centrales.",
  "arquetipo": "Tu arquetipo describe el rol que naturalmente encarnás frente a los demás.",
  "compatibilidad": "La compatibilidad combina numerología, astrología y zodiaco chino para mostrar alineaciones.",
  "default": "Molino AI te ayuda a interpretar tu perfil simbólico. Próximamente con respuestas contextuales avanzadas."
};

export default function AiPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const key = prompt.toLowerCase();
      const answer = Object.entries(MOCK_RESPONSES).find(([k]) => key.includes(k));
      setResponse(answer ? answer[1] : MOCK_RESPONSES.default);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">🤖 Molino AI</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Asistente contextual</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">Consultá tu perfil simbólico: Life Path, arquetipo, compatibilidades y más.</p>
          </div>
        </Section>

        <Section>
          <Card hover={false} padding="lg">
            <form onSubmit={handleAsk} className="space-y-4">
              <Input
                label="Tu consulta"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: ¿Qué significa mi Life Path 7?"
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
