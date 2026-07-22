"use client";

import Link from "next/link";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

const systems = [
  {
    id: "numerologia",
    title: "Numerología",
    description: "El lenguaje matemático de la personalidad, los patrones y el significado.",
    href: "/numerologia",
    icon: "📚",
    color: "#D4A843",
    topics: ["Life Path", "Expresión", "Alma", "Personalidad", "Números maestros"],
  },
  {
    id: "astrologia",
    title: "Astrología",
    description: "El influjo de los astros en la psicología humana.",
    href: "/astrologia",
    icon: "🌌",
    color: "#4A5568",
    topics: ["Signos", "Planetas", "Casas", "Aspectos"],
  },
  {
    id: "zodiaco-chino",
    title: "Zodiaco Chino",
    description: "El ciclo de 12 animales y 5 elementos del calendario lunar.",
    href: "/zodiaco-chino",
    icon: "🐉",
    color: "#C44536",
    topics: ["Animales", "Elementos", "Compatibilidad", "Ciclo sexagenario"],
  },
  {
    id: "tarot",
    title: "Tarot",
    description: "Arcanos mayores y menores como sistema de autoconocimiento.",
    href: "#",
    icon: "🔮",
    color: "#6B4C7A",
    topics: ["Arcanos mayores", "Arcanos menores", "Tiros"],
  },
  {
    id: "human-design",
    title: "Human Design",
    description: "Tipos, estrategias y autoridades energéticas.",
    href: "#",
    icon: "🧬",
    color: "#2D5A3D",
    topics: ["Generadores", "Proyectores", "Manifestadores", "Reflectores"],
  },
  {
    id: "eneagrama",
    title: "Eneagrama",
    description: "9 personalidades, miedos y deseos profundos.",
    href: "#",
    icon: "🧩",
    color: "#8FBC8F",
    topics: ["E1-E9", "Instintos", "Centros", "Alas"],
  },
];

export default function ConocimientoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">🏛️ Conocimiento</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Sistemas simbólicos</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">
              Explorá marcos de conocimiento públicos y accesibles. Cada sistema ofrece una mirada complementaria sobre la identidad, el tiempo y la relación.
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
                <Button
                  variant="secondary"
                  fullWidth
                  asChild={sys.href !== "#"}
                  disabled={sys.href === "#"}
                >
                  {sys.href !== "#" ? (
                    <Link href={sys.href}>Explorar →</Link>
                  ) : (
                    <span>Próximamente</span>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="mt-8">
          <Card hover={false}>
            <div className="text-center">
              <p className="text-sm text-muted">
                Esta sección se expande con fuentes públicas y curadas.
              </p>
              <Button variant="secondary" className="mt-3" asChild>
                <Link href="/biblioteca">Ir a la Biblioteca Pública →</Link>
              </Button>
            </div>
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
