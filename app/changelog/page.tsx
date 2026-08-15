import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/seo";
import { Sparkles, GitBranch, ShieldCheck, Zap, Heart, BookOpen, Code2, ArrowRight, Bookmark } from "lucide-react";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Changelog & Novedades — Molino",
  description:
    "Registro público de mejoras técnicas, nuevas funcionalidades, motores de cálculo y actualizaciones de privacidad en Molino.",
  alternates: {
    canonical: siteUrl("/changelog"),
  },
};

const RELEASES = [
  {
    version: "v2.1.0",
    date: "14 de Agosto, 2026",
    badge: "Último lanzamiento",
    highlights: [
      {
        icon: Zap,
        title: "Web Worker & Multi-threading",
        desc: "Cálculos pesados de sinastría y ciclos delegados a un worker en segundo plano para garantizar 60 FPS continuos.",
      },
      {
        icon: Bookmark,
        title: "Bóveda de Mapas Locales (Multi-Perfil)",
        desc: "Guardá y alterná perfiles (tu mapa, pareja, mamá, socios) 100% en tu navegador con un solo clic.",
      },
      {
        icon: Code2,
        title: "API Pública v1 & Widget Embebible",
        desc: "Endpoint /api/v1/map con CORS y widget /embed para que terapeutas y desarrolladores integren Molino en sus sitios.",
      },
      {
        icon: ShieldCheck,
        title: "Resiliencia & Error Boundaries",
        desc: "Fallbacks amigables y skeletons dedicados para evitar pantallas de error o timeouts en conexiones lentas.",
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "10 de Agosto, 2026",
    badge: "Evolución de Producto",
    highlights: [
      {
        icon: Sparkles,
        title: "Dashboard Diario /hoy",
        desc: "Vibración diaria, fase lunar, foco de acción y pronóstico extendido a 3 días según tu fecha de nacimiento.",
      },
      {
        icon: Heart,
        title: "Modo Pareja & Comparativa",
        desc: "Sinergia multi-sistema cruzando Camino de Vida, signos solares, química elemental y zodíaco chino.",
      },
      {
        icon: BookOpen,
        title: "Journal de Autoconocimiento",
        desc: "Registro emocional reflexivo cruzado automáticamente con tu Día y Año Personal.",
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "1 de Julio, 2026",
    badge: "Lanzamiento Inicial",
    highlights: [
      {
        icon: Sparkles,
        title: "Núcleo Simbólico Molino",
        desc: "Integración de numerología pitagórica, astrología solar y zodíaco chino con cálculo 100% local en tu navegador.",
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mb-4">
            <GitBranch className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
              Registro Público de Novedades
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] text-foreground">
            Evolución & Changelog
          </h1>

          <p className="text-sm sm:text-base text-muted mt-4 leading-relaxed">
            Cada cambio en Molino responde a dos principios innegociables: <strong>privacidad total sin cuentas</strong> y <strong>claridad simbólica estructurada</strong>.
          </p>
        </div>

        {/* Releases Timeline */}
        <div className="space-y-12 relative before:absolute before:inset-0 before:left-4 md:before:left-8 before:w-0.5 before:bg-ink/10">
          {RELEASES.map((release) => (
            <div key={release.version} className="relative pl-10 md:pl-20">
              {/* Timeline Dot */}
              <div className="absolute left-2.5 md:left-6.5 top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-4 border-background -translate-x-1/2" />

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="font-display text-2xl font-bold text-foreground">
                  {release.version}
                </span>
                <span className="text-xs font-mono text-muted">
                  {release.date}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono font-bold uppercase">
                  {release.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {release.highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.title} padding="md" className="border-ink/10 bg-card/60">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-heading text-sm font-bold text-foreground mb-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Open Source / GitHub Footer banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-accent/5 border border-accent/20 text-center space-y-3">
          <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">
            Código Abierto & Transparencia
          </span>
          <h4 className="font-heading text-lg font-bold text-foreground">
            Molino es un proyecto abierto y auditable
          </h4>
          <p className="text-xs text-muted max-w-md mx-auto">
            Podés revisar cada línea de cálculo y contribuir en nuestro repositorio público de GitHub.
          </p>
          <div className="pt-2">
            <a
              href="https://github.com/Morpheus3232/molino"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 text-xs font-mono text-foreground font-semibold transition-colors"
            >
              <span>Ver repositorio en GitHub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
