"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function NumerologiaPage() {
  const num = KNOWLEDGE_BASE.numerology;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <Card hover={false}>
            <div className="text-center mb-6">
              <span className="badge mb-3">📚 Numerología</span>
              <h1 className="font-serif text-3xl font-bold text-foreground">El lenguaje de los números</h1>
              <p className="text-muted mt-2 max-w-2xl mx-auto">{num.history}</p>
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Metodología</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-background rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-1">Pitagórico</h3>
                <p className="text-sm text-muted mb-2">{num.methods.pythagorean}</p>
                <p className="text-xs text-muted">El más utilizado en occidente. Asigna valores 1-9 a las letras del alfabeto.</p>
              </div>
              <div className="bg-background rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-1">Caldeo</h3>
                <p className="text-sm text-muted mb-2">{num.methods.chaldean}</p>
                <p className="text-xs text-muted">Sistema antiguo que no usa el 9. Considerado más preciso por algunos practicantes.</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">Tabla pitagórica</h3>
              <div className="bg-background rounded-2xl p-4 font-mono text-sm text-muted leading-relaxed">
                <p>A=1 · B=2 · C=3 · D=4 · E=5 · F=6 · G=7 · H=8 · I=9</p>
                <p>J=1 · K=2 · L=3 · M=4 · N=5 · O=6 · P=7 · Q=8 · R=9</p>
                <p>S=1 · T=2 · U=3 · V=4 · W=5 · X=6 · Y=7 · Z=8</p>
              </div>
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Números maestros</span>
            </div>
            <p className="text-sm text-muted mb-4">
              Los números maestros son vibraciones de alta frecuencia que no se reducen a un solo dígito.
            </p>
            <div className="flex flex-wrap gap-3">
              {num.masterNumbers.map((n) => (
                <div key={n} className="bg-background border border-border rounded-2xl px-5 py-3 text-center">
                  <p className="text-2xl font-serif font-bold text-foreground">{n}</p>
                  <p className="text-xs text-muted mt-1">
                    {n === 11 ? "Intuición elevada" : n === 22 ? "Construcción maestra" : "Amor universal"}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section>
          <Card>
            <div className="mb-4">
              <span className="badge">Cálculos fundamentales</span>
            </div>
            <div className="space-y-3">
              {(num.topics || []).map((topic: any) => (
                <div key={topic.title} className="bg-background rounded-2xl p-4 flex gap-4">
                  <span className="text-xl text-accent">•</span>
                  <div>
                    <p className="font-medium text-foreground">{topic.title}</p>
                    <p className="text-sm text-muted">{topic.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
