"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { Sun, BookOpen, Heart, Calendar, Compass, Users, Globe, TrendingUp, ArrowRight } from "lucide-react";

interface SpaceIndexProps {
  profile: UserProfile;
  circleName: string;
  allyName: string | null;
  worldCount: number;
  animalSlug: string;
  animalName: string;
}

export default function SpaceIndex({ profile, circleName, allyName, worldCount, animalSlug, animalName }: SpaceIndexProps) {
  const reduceMotion = useSafeReducedMotion();
  const personalYear = profile.cycles?.personalYear;
  const yearTheme = typeof personalYear === "number" ? getYearTheme(personalYear) : null;
  const lifePath = profile.lifePath;

  const items = [
    {
      label: "Foco & Vibración de Hoy",
      teaser: `Energía diaria y fase lunar para tu Camino ${lifePath}.`,
      href: "/hoy",
      icon: Sun,
      color: "bg-amber-500/10 text-amber-400",
    },
    {
      label: "Journal de Consciencia",
      teaser: "Reflexiones y estados de ánimo correlacionados con tus ciclos.",
      href: "/journal",
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-400",
    },
    {
      label: "Modo Pareja",
      teaser: "Comparé tu mapa con el de tu pareja, socio o familiar.",
      href: `/pareja?a=${profile.birthDate || ""}`,
      icon: Heart,
      color: "bg-rose-500/10 text-rose-400",
    },
    {
      label: "Calendario de Ciclos",
      teaser: "El momento oportuno para iniciar o cerrar etapas este año.",
      href: "/calendario",
      icon: Calendar,
      color: "bg-emerald-500/10 text-emerald-400",
    },
    {
      label: `Atlas de ${animalName}`,
      teaser: "Ciudades, marcas, equipos y países que comparten tu energía.",
      href: `/atlas/explorar/${animalSlug}`,
      icon: Compass,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Círculo",
      teaser: allyName ? `${circleName} forma tríada con ${allyName}.` : "Energías alrededor de tu signo.",
      href: "/circulo",
      icon: Users,
      color: "bg-violet-500/10 text-violet-400",
    },
    {
      label: "Mundo",
      teaser: `${worldCount} conexiones resonantes en el mapa global.`,
      href: "/mundo",
      icon: Globe,
      color: "bg-cyan-500/10 text-cyan-400",
    },
    {
      label: "Evolución",
      teaser: yearTheme ? yearTheme : "Tu línea de tiempo.",
      href: "/evolution",
      icon: TrendingUp,
      color: "bg-orange-500/10 text-orange-400",
    },
  ];

  const reveal = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" } as const,
    transition: { duration: reduceMotion ? 0.1 : 0.4, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <nav className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-16 border-t border-ink/10" aria-label="Explorá tu mapa">
      <motion.div {...reveal} className="max-w-2xl mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold block mb-1">
          Integración de tu mapa
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          ¿Y ahora qué? Explorá tu mapa
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
          Un mapa no es para guardarlo en un cajón. Es una brújula práctica para navegar tus decisiones cotidianas.
        </p>
      </motion.div>

      <motion.div {...reveal} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="p-5 rounded-3xl bg-card border border-ink/10 hover:border-accent/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-base font-bold text-foreground mb-1">{item.label}</h3>
              <p className="text-xs text-muted leading-relaxed">{item.teaser}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-accent mt-4 pt-3 border-t border-ink/5 group-hover:underline">
              <span>Ir</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </motion.div>
    </nav>
  );
}
