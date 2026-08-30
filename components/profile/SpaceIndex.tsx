"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { encodeProfileData } from "@/lib/utils/profileShare";
import { editorialReveal } from "@/lib/utils/motion";
import { BookOpen, Sun, Heart, Users, ArrowRight } from "lucide-react";

interface SpaceIndexProps {
  profile: UserProfile;
  circleName: string;
  allyName: string | null;
}

// Journal, Calendario, Atlas, Mundo y Evolución ya tienen su propio camino de
// descubrimiento en el header/footer globales (ver UniversityHeader.tsx,
// UniversityFooter.tsx) — no necesitan estar acá también. Círculo es la
// excepción: no está en ningún otro nav del sitio, así que se queda para no
// dejarlo inalcanzable.
//
// Fase 4: la Lectura SALIÓ de esta lista. Era la primera de cuatro filas, al
// mismo nivel que "Círculo" — el centro intelectual del producto presentado
// como una utilidad más. Ahora tiene su propio umbral (ReadingThreshold), y
// esto queda como lo que realmente es: el índice de herramientas laterales.
export default function SpaceIndex({ profile, circleName, allyName }: SpaceIndexProps) {
  const items = [
    {
      label: "Hoy",
      teaser: `Energía diaria y fase lunar para tu Camino ${profile.lifePath}.`,
      href: "/hoy",
      icon: Sun,
    },
    {
      label: "Modo Pareja",
      teaser: "Compará tu mapa con el de tu pareja, socio o familiar.",
      href: `/pareja?a=${profile.birthDate || ""}`,
      icon: Heart,
    },
    {
      label: "Círculo",
      teaser: allyName ? `${circleName} tiene afinidad con ${allyName}.` : "Energías alrededor de tu signo.",
      href: "/circulo",
      icon: Users,
    },
  ];

  return (
    <motion.nav
      {...editorialReveal}
      className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-20 lg:py-28 border-t border-border"
      aria-label="Explorá tu mapa"
    >
      <div className="max-w-3xl mb-10 lg:mb-12">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted block mb-3">
          También con tus coordenadas
        </span>
        <p className="text-base text-muted leading-relaxed max-w-xl">
          Herramientas que se desprenden de los mismos números, para cuando quieras mirar tu
          mapa desde otro ángulo.
        </p>
      </div>

      <ul className="border-t border-border">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group flex items-baseline gap-6 py-6 border-b border-border hover:bg-ink/[0.02] transition-colors"
            >
              <item.icon
                className="w-5 h-5 shrink-0 self-center text-muted group-hover:text-accent transition-colors"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-lg sm:text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                  {item.label}
                </span>
                <span className="block font-serif text-sm sm:text-base text-muted leading-relaxed mt-1">
                  {item.teaser}
                </span>
              </span>
              <ArrowRight
                className="w-4 h-4 shrink-0 self-center text-muted/60 group-hover:text-accent group-hover:translate-x-1 transition-all"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
