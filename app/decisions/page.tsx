"use client";

import { useState } from "react";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function DecisionsPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<any>(null);

  const analyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setResult({
      question,
      alignment: Math.floor(Math.random() * 40) + 60,
      recommendation: "Alineado con tu Life Path y tu arquetipo. Buen momento para avanzar.",
      considerations: ["Revisá tu timing personal", "Consultá tus patrones", "Evaluá el entorno"] },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">⚖️ Decision Engine</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Análisis de decisiones</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">Ingresá una decisión y obtené una lectura de alineación con tu perfil.</p>
          </div>
        </Section>

        <Section>
          <Card hover={false} padding="lg">
            <form onSubmit={analyze} className="space-y-4">
              <Input
                label="Tu decisión"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ej: ¿Debo aceptar esta propuesta laboral?"
                required
              />
              <Button type="submit" fullWidth>Analizar</Button>
            </form>

            {result && (
              <div className="mt-6 space-y-4">
                <div className="bg-background rounded-2xl p-4 border border-border">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-1">Alineación</p>
                  <p className="text-3xl font-serif font-bold text-foreground">{result.alignment}%</p>
                  <p className="text-sm text-muted mt-2">{result.recommendation}</p>
                </div>
                <div className="bg-background rounded-2xl p-4 border border-border">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-1">A considerar</p>
                  <ul className="text-sm text-muted mt-2 space-y-1 list-disc list-inside">
                    {result.considerations.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
