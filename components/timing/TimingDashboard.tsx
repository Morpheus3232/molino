import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import ProgressDonut from "@/components/ui/ProgressDonut";

export default function TimingDashboard({ profile }: { profile: UserProfile }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const yearNumber = currentYear + profile.lifePath;
  const monthNumber = currentMonth + 1 + (profile.lifePath % 12);
  const dayNumber = currentDay + (profile.lifePath % 9);

  return (
    <div>
      <Section>
        <div className="text-center mb-10">
          <span className="badge mb-3">📅 Tu timing</span>
          <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Calendario personal</h1>
          <p className="text-muted mt-2 max-w-2xl mx-auto">Tu año personal, ciclos mensuales y recomendaciones de timing para decisiones importantes.</p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card hover={false} padding="lg">
            <div className="text-center">
              <span className="text-3xl mb-2">📆</span>
              <h3 className="font-semibold text-foreground">Año personal</h3>
              <p className="text-3xl font-serif font-bold text-foreground mt-2">{yearNumber}</p>
              <p className="text-xs text-muted mt-1">Energía anual basada en tu Life Path</p>
            </div>
          </Card>
          <Card hover={false} padding="lg">
            <div className="flex flex-col items-center">
              <ProgressDonut value={monthNumber % 9 || 9} max={9} label="Ciclo mensual" />
              <p className="text-xs text-muted mt-2">Fase {monthNumber % 9 || 9} del ciclo</p>
            </div>
          </Card>
          <Card hover={false} padding="lg">
            <div className="text-center">
              <span className="text-3xl mb-2">📅</span>
              <h3 className="font-semibold text-foreground">Día personal</h3>
              <p className="text-3xl font-serif font-bold text-foreground mt-2">{dayNumber}</p>
              <p className="text-xs text-muted mt-1">Energía del día de hoy</p>
            </div>
          </Card>
        </div>
      </Section>

      <Section className="mt-8">
        <Card hover={false}>
          <div className="text-center">
            <span className="badge mb-3">Próximamente</span>
            <h2 className="font-serif text-xl font-semibold text-foreground mt-3">Calendario inteligente</h2>
            <p className="text-sm text-muted mt-2">Próximamente podrás ver recomendaciones de timing para decisiones, proyectos y vínculos.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>Volver</Button>
          </div>
        </Card>
      </Section>
    </div>
  );
}
