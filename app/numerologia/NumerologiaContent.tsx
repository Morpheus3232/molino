"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function NumerologiaContent() {
  const num = KNOWLEDGE_BASE.numerology;

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <div className="mx-auto max-w-content px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-3">Numerología</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">El lenguaje de los números</h1>
            <p className="mt-3 text-sm text-muted max-w-2xl mx-auto">{num.history}</p>
          </div>
        </Section>

        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">Metodología</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background">
                <p className="text-sm font-medium text-foreground">Pitagórico</p>
                <p className="text-sm text-muted mt-1">{num.methods.pythagorean}</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background">
                <p className="text-sm font-medium text-foreground">Caldeo</p>
                <p className="text-sm text-muted mt-1">{num.methods.chaldean}</p>
              </div>
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">Números maestros</p>
            <p className="text-sm text-muted mb-4">Vibraciones de alta frecuencia que no se reducen a un solo dígito.</p>
            <div className="flex flex-wrap gap-3">
              {num.masterNumbers.map((n) => (
                <div key={n} className="rounded-xl border border-border bg-background px-5 py-3 text-center">
                  <p className="text-xl font-serif font-semibold text-foreground">{n}</p>
                  <p className="text-xs text-muted mt-1">
                    {n === 11 ? "Intuición elevada" : n === 22 ? "Construcción maestra" : "Amor universal"}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section>
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">Cálculos fundamentales</p>
            <div className="space-y-3">
              {(num.topics || []).map((topic: any) => (
                <div key={topic.title} className="flex gap-4 rounded-xl border border-border bg-background p-4">
                  <span className="text-accent mt-0.5" aria-hidden="true">•</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{topic.title}</p>
                    <p className="text-sm text-muted mt-1">{topic.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button variant="secondary" fullWidth onClick={() => window.location.href = "/profile"}>
                Volver a mi perfil
              </Button>
            </div>
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
