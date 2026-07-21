"use client";

import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

const systems = [
  { id: "numerology", title: "Numerología", icon: "📚", description: "Tu propósito, expresión, alma y personalidad.", href: "/numerologia", topics: ["Life Path", "Expresión", "Alma", "Personalidad"] },
  { id: "astrology", title: "Astrología", icon: "🌌", description: "Tu signo solar, planetas, casas y aspectos.", href: "/astrologia", topics: ["Signos", "Planetas", "Casas", "Aspectos"] },
  { id: "chinese", title: "Zodiaco Chino", icon: "🐉", description: "Tu animal y elemento del calendario lunar.", href: "/zodiaco-chino", topics: ["Animales", "Elementos", "Compatibilidad"] },
  { id: "tarot", title: "Tarot", icon: "🔮", description: "Arcanos como sistema de autoconocimiento.", href: "#", topics: ["Arcanos mayores", "Arcanos menores"] },
  { id: "human-design", title: "Human Design", icon: "🧬", description: "Tu tipo, estrategia y autoridad.", href: "#", topics: ["Generadores", "Proyectores", "Manifestadores"] },
  { id: "eneagrama", title: "Eneagrama", icon: "🧩", description: "Tu personalidad, miedos y deseos profundos.", href: "#", topics: ["E1-E9", "Instintos", "Centros"] },
];

export default function PatternsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">🧠 Tus patrones</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Sistemas simbólicos integrados</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">
              Cada sistema es una lente. Juntos forman un mapa de tu personalidad, ritmos y alineaciones.
            </p>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {systems.map((sys) => (
              <Card key={sys.id} hover padding="lg">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{sys.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{sys.title}</h3>
                    <p className="text-xs text-muted mt-1">{sys.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {sys.topics.map((topic) => (
                    <span key={topic} className="text-[10px] bg-background border border-border rounded-full px-2 py-1 text-muted">
                      {topic}
                    </span>
                  ))}
                </div>
                <Button variant="secondary" fullWidth asChild={sys.href !== "#"} disabled={sys.href === "#"}>
                  {sys.href !== "#" ? <a href={sys.href}>Explorar →</a> : <span>Próximamente</span>}
                </Button>
              </Card>
            ))}
          </div>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
