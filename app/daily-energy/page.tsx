"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import Link from "next/link";

type IconProps = React.SVGProps<SVGSVGElement>;

const IconBase: React.FC<IconProps> = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props} />
);

const IconMoon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </IconBase>
);

export default function DailyEnergyPage() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const energy = useMemo(() => {
    if (!profile) return null;
    return calculateDailyEnergy(profile, new Date());
  }, [profile]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingState message="Calculando tu energía diaria..." />
        <UniversityFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 py-24 text-center">
          <p className="eyebrow-brutalist mb-4">Energía Diaria</p>
          <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-foreground mb-4">
            Tu energía de hoy
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Para ver tu energía diaria, primero necesitás crear tu perfil personal.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="btn-accent"
          >
            Crear mi perfil
          </button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  if (!energy) return null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 55) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-green-50";
    if (score >= 55) return "bg-blue-50";
    if (score >= 40) return "bg-yellow-50";
    return "bg-red-50";
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-28" id="main-content">
        <motion.div {...fadeUp} className="border-t border-ink/10 py-10 sm:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Energía Diaria</span>
          </nav>

          <p className="eyebrow-brutalist mb-4">Energía Diaria</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h1>
          <p className="text-sm text-muted mt-4">
            {profile.name} · Camino de Vida {profile.lifePath} · {profile.sunSign}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="border border-ink/10 p-8 sm:p-10 lg:p-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <p className="label-micro mb-1">Energía del día</p>
                <p className="text-5xl sm:text-6xl font-display font-bold tracking-tight" style={{ color: energy.overallScore >= 75 ? "var(--score-excellent)" : energy.overallScore >= 55 ? "var(--score-good)" : energy.overallScore >= 40 ? "var(--score-neutral)" : "var(--score-poor)" }}>
                  {energy.overallScore}<span className="text-3xl sm:text-4xl text-muted font-sans font-medium">/100</span>
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-xl sm:text-2xl font-serif font-semibold text-foreground">{energy.theme}</p>
                <p className="text-sm text-muted">Día personal: {energy.personalDay}</p>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-2xl">{energy.description}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }} className="mt-6">
          <div className="border border-ink/10 p-6 flex items-center gap-4">
            <span className="text-3xl">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Luna {energy.moonPhase.phase}</p>
              <p className="text-xs text-muted">{energy.moonPhase.description}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10">
          <div className="bg-background p-8 sm:p-10 lg:p-14">
            <p className="eyebrow-brutalist mb-6">Fortalezas</p>
            <ul className="space-y-3">
              {energy.strengths.map((s, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background p-8 sm:p-10 lg:p-14">
            <p className="eyebrow-brutalist mb-6">Precauciones</p>
            <ul className="space-y-3">
              {energy.cautions.map((c, i) => (
                <li key={i} className="text-sm text-muted flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }} className="mt-6">
          <p className="eyebrow-brutalist mb-6">Áreas relevantes</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10">
            {Object.entries(energy.areas).map(([key, area]) => (
              <div key={key} className="bg-background p-6">
                <p className="label-micro mb-2 capitalize">
                  {key === 'work' ? 'Trabajo' : key === 'relationships' ? 'Relaciones' : key === 'creativity' ? 'Creatividad' : 'Decisiones'}
                </p>
                <p className={`text-2xl font-display font-bold ${getScoreColor(area.score)}`}>{area.score}%</p>
                <p className="text-xs text-muted mt-1">{area.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-6 border border-ink/10 p-8 sm:p-10 lg:p-14">
          <p className="eyebrow-brutalist mb-4">Interpretación</p>
          <p className="text-sm text-muted leading-relaxed">{energy.explanation}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} className="mt-6 border border-ink/10 p-6">
          <p className="label-micro mb-2">Influencia de tu elemento</p>
          <p className="text-sm text-foreground">{energy.elementInfluence}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-6">
          <MolinoInterpretation
            profile={profile}
            type="daily_energy"
            dailyEnergy={energy}
            label="Interpretación de Molino"
            description="Análisis personalizado de tu energía del día"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.45 }} className="mt-8 border-t border-ink/10 pt-8 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" fullWidth onClick={() => router.push("/timing")}>Explorar fechas</Button>
          <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>Ver mi perfil</Button>
        </motion.div>
      </main>

      <UniversityFooter />
    </div>
  );
}
