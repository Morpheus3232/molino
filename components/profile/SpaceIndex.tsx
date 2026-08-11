"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";

interface SpaceIndexProps {
  profile: UserProfile;
  circleName: string;
  allyName: string | null;
  worldCount: number;
}

interface SpaceCard {
  label: string;
  title: string;
  teaser: string;
  href: string | null;
}

export default function SpaceIndex({ profile, circleName, allyName, worldCount }: SpaceIndexProps) {
  const reduceMotion = useSafeReducedMotion();
  const personalYear = profile.cycles?.personalYear;
  const yearTheme = typeof personalYear === "number" ? getYearTheme(personalYear) : null;

  const cards: SpaceCard[] = [
    {
      label: "Tu Mapa",
      title: "Identidad",
      teaser: "Estás acá — numerología, astrología y zodíaco chino cruzados.",
      href: null,
    },
    {
      label: "Tu Círculo",
      title: "Energías que amplifican",
      teaser: allyName ? `Tu ${circleName} forma tríada con ${allyName}.` : `Explorá las energías alrededor de tu ${circleName}.`,
      href: "/circulo",
    },
    {
      label: "Tu Mundo",
      title: "Conexiones resonantes",
      teaser: `${worldCount} países, ciudades y marcas resuenan con tu mapa.`,
      href: "/mundo",
    },
    {
      label: "Tu Evolución",
      title: "Tu recorrido en el tiempo",
      teaser: yearTheme ? `Este es ${yearTheme} para vos.` : "Seguí cómo cambia tu patrón día a día.",
      href: "/evolution",
    },
  ];

  const reveal = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" } as const,
    transition: { duration: reduceMotion ? 0.1 : 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <section className="py-10 sm:py-12 border-t border-ink/10" aria-labelledby="space-index-heading">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div {...reveal}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">Tu espacio</p>
          <h2 id="space-index-heading" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground leading-[1.05] mb-8">
            Cuatro formas de leer tu mapa
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
              const content = (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">{card.label}</p>
                  <p className="font-medium text-foreground mb-2">{card.title}</p>
                  <p className="text-sm text-muted leading-relaxed mb-4">{card.teaser}</p>
                  {card.href ? (
                    <span className="text-xs font-mono text-accent">Ver completo →</span>
                  ) : (
                    <span className="text-xs font-mono text-muted">Estás acá</span>
                  )}
                </>
              );

              return card.href ? (
                <Link
                  key={card.label}
                  href={card.href}
                  className="p-5 border border-ink/10 rounded-lg bg-background hover:border-accent/40 transition-colors"
                >
                  {content}
                </Link>
              ) : (
                <div key={card.label} className="p-5 border border-accent/30 bg-accent/[0.03] rounded-lg">
                  {content}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
