import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES, YEAR_TYPES } from "@/lib/data";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import BarChart from "@/components/ui/BarChart";

const SYSTEMS = [
  { id: "numerology", title: "Numerología", icon: "📚", description: "Tu Life Path, Expression, Alma y Personalidad.", href: "/numerologia" },
  { id: "astrology", title: "Astrología", icon: "🌌", description: "Tu signo solar, planetas, casas y aspectos.", href: "/astrologia" },
  { id: "chinese", title: "Zodiaco Chino", icon: "🐉", description: "Animal y elemento del calendario lunar.", href: "/zodiaco-chino" },
  { id: "tarot", title: "Tarot", icon: "🔮", description: "Arcanos como sistema de autoconocimiento.", href: "#" },
  { id: "human-design", title: "Human Design", icon: "🧬", description: "Tu tipo, estrategia y autoridad.", href: "#" },
  { id: "eneagrama", title: "Eneagrama", icon: "🧩", description: "Tu personalidad, miedos y deseos profundos.", href: "#" },
];

export default function PatternsDashboard({ profile }: { profile: UserProfile }) {
  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];
  const yearMeaning = YEAR_TYPES[(profile.lifePath % 9) || 9] || YEAR_TYPES[1];

  return (
    <div>
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
          {SYSTEMS.map((system) => (
            <Card key={system.id} hover padding="lg">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{system.icon}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{system.title}</h3>
                  <p className="text-xs text-muted mt-1">{system.description}</p>
                </div>
              </div>
              <Button variant="secondary" fullWidth asChild={system.href !== "#"} disabled={system.href === "#"}>
                <a href={system.href}>{system.href !== "#" ? "Explorar →" : "Próximamente"}</a>
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BarChart
            title="Tus números"
            data={[
              { name: "Life Path", value: profile.lifePath },
              { name: "Expresión", value: profile.expressionNumber || 0 },
              { name: "Alma", value: profile.soulNumber || 0 },
              { name: "Personalidad", value: profile.personalityNumber || 0 },
            ]}
          />

          <Card hover={false} padding="lg">
            <div className="text-center">
              <span className="badge mb-3">Tu resumen simbólico</span>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <span className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground">
                  <span>🎯</span> {archetype.name}
                </span>
                <span className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground">
                  <span>♈</span> {profile.sunSign}
                </span>
                <span className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground">
                  <span>{profile.chineseZodiacInfo?.emoji || "🐴"}</span> {profile.chineseZodiac}
                </span>
                <span className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground">
                  <span>🗓️</span> {yearMeaning.name}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
