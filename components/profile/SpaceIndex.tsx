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

export default function SpaceIndex({ profile, circleName, allyName, worldCount }: SpaceIndexProps) {
  const reduceMotion = useSafeReducedMotion();
  const personalYear = profile.cycles?.personalYear;
  const yearTheme = typeof personalYear === "number" ? getYearTheme(personalYear) : null;

  const items = [
    {
      number: "01",
      label: "Identidad",
      teaser: "Tu sistema — numerología, astrología, zodíaco chino",
      href: null,
    },
    {
      number: "02",
      label: "Círculo",
      teaser: allyName ? `${circleName} forma tríada con ${allyName}.` : "Energías alrededor de tu signo.",
      href: "/circulo",
    },
    {
      number: "03",
      label: "Mundo",
      teaser: `${worldCount} conexiones resonantes.`,
      href: "/mundo",
    },
    {
      number: "04",
      label: "Evolución",
      teaser: yearTheme ? `${yearTheme}` : "Tu línea de tiempo.",
      href: "/evolution",
    },
  ];

  const reveal = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" } as const,
    transition: { duration: reduceMotion ? 0.1 : 0.4, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <nav className="border-t border-b border-ink/10" aria-label="Dimensiones de tu mapa">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div {...reveal} className="py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink/10">
            {items.map((item) => {
              const content = (
                <div className="flex items-start gap-3 py-3 px-3 h-full bg-background">
                  <span className="font-mono text-[10px] text-accent leading-none pt-0.5 shrink-0">
                    {item.number}
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-semibold text-foreground tracking-tight">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-muted leading-relaxed mt-0.5 line-clamp-1">
                      {item.teaser}
                    </p>
                  </div>
                </div>
              );

              return item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block hover:bg-ink/[0.02] transition-colors"
                >
                  {content}
                </Link>
              ) : (
                <div key={item.label} className="bg-accent/[0.03]">
                  {content}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
