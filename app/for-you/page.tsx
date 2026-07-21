"use client";

import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

const FEED = [
  { id: 1, title: "Hoy: energía de introspección", body: "Tu número del día invita a mirrors internos más que a decisiones externas.", tag: "Timing" },
  { id: 2, title: "Tu arquetipo en acción", body: "El Buscador funciona mejor cuando combina análisis con momentos de pausa.", tag: "Patrones" },
  { id: 3, title: "Recordatorio de alineación", body: "Revisá tu semana: los martes suelen ser días favorables para tu elemento.", tag: "Alineación" },
];

export default function ForYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">✨ For You</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Feed personal</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">Contenido curado según tu perfil: insights, recordatorios y recomendaciones.</p>
          </div>
        </Section>

        <Section>
          <div className="space-y-4">
            {FEED.map((item) => (
              <Card key={item.id} hover padding="lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted">{item.tag}</span>
                    <h3 className="font-semibold text-foreground mt-1">{item.title}</h3>
                    <p className="text-sm text-muted mt-1">{item.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
