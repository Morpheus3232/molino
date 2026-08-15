import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/seo";
import { ShieldCheck, Users, Sparkles, BookOpen, Lock, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Molino para Profesionales — Coaches, Terapeutas y Facilitadores",
  description:
    "Utilizá la matriz simbólica de Molino como herramienta complementaria de exploración y encuadre en tus sesiones. 100% privado y sin almacenamiento en servidores.",
  alternates: {
    canonical: siteUrl("/profesionales"),
  },
};

const PILLARS = [
  {
    icon: Lock,
    title: "Privacidad Ética & Total",
    desc: "Ningún dato de tus consultantes queda almacenado en bases de datos externas. Todo el cálculo se ejecuta en el navegador de tu sesión.",
  },
  {
    icon: Compass,
    title: "Encuadre Arquetípico Rápido",
    desc: "Obtené en 30 segundos un mapa estructurado de arquetipos, ritmos y polaridades para enriquecer el diálogo inicial.",
  },
  {
    icon: Users,
    title: "Dinámica de Parejas y Equipos",
    desc: "Visualizá los puntos de complementariedad, trigonos elementales y posibles fricciones entre dos personas en tiempo real.",
  },
];

export default function ProfesionalesPage() {
  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
              Herramienta de Reflexión para Profesionales
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] text-foreground">
            Estructura simbólica para acompañar tus sesiones profesionales
          </h1>

          <p className="text-base sm:text-lg text-muted mt-5 leading-relaxed">
            Una herramienta rigurosa, no determinista y 100% privada para facilitar el autoconocimiento, la exploración de patrones y la resolución de conflictos vinculares.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-gold-foreground font-heading text-xs uppercase tracking-wider font-bold hover:bg-gold-hover transition-colors shadow-sm"
            >
              Probar cálculo en vivo
            </Link>
            <Link
              href="/pareja"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 text-foreground font-heading text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              Comparativa vincular
            </Link>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <Card key={p.title} padding="lg" className="h-full border-ink/10 bg-card">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {p.desc}
                </p>
              </Card>
            );
          })}
        </div>

        {/* How to use in sessions */}
        <div className="rounded-3xl border border-ink/10 bg-card/60 p-8 sm:p-12 max-w-4xl mx-auto space-y-8">
          <div className="border-b border-ink/10 pb-6">
            <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">
              Metodología de Aplicación
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Cómo integrar Molino en tu práctica
            </h2>
          </div>

          <div className="space-y-6 text-sm text-muted leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block font-semibold mb-0.5">
                  1. Mapa de Entrada en la Primera Sesión
                </strong>
                <p>
                  Generá el mapa con la fecha de nacimiento de tu consultante para contrastar sus desafíos declarados con los ritmos y arquetipos de su perfil.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block font-semibold mb-0.5">
                  2. Trabajo Vincular y de Pareja
                </strong>
                <p>
                  Utilizá el Modo Pareja en pantalla compartida para despersonalizar tensiones y observar de forma neutral las polaridades entre ambos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block font-semibold mb-0.5">
                  3. Widget Embebible en tu Propio Sitio
                </strong>
                <p>
                  Podés insertar nuestro widget en tu página web profesional para que quienes te consultan lleguen a la primera sesión con su mapa ya explorado.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-muted">¿Querés incrustar Molino en tu web?</span>
            <Link
              href="/embed"
              className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1"
            >
              Obtener código de widget <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
