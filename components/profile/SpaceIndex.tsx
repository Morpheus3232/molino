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
export default function SpaceIndex({ profile, circleName, allyName }: SpaceIndexProps) {
  const items = [
    {
      // Destino principal desde que Mi Mapa quedó con una sola pregunta: el
      // cuadro de nacimiento, la convergencia, los dos movimientos y la
      // sincronicidad viven ahora en /lectura, gratis, con la Pro al final.
      label: "Leer qué significa tu mapa",
      teaser:
        "Los dígitos de tu fecha, dónde coinciden tus sistemas y la lectura de los dos movimientos. Gratis.",
      href: `/lectura#${encodeProfileData(profile)}`,
      icon: BookOpen,
    },
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
      <div className="max-w-3xl mb-12 lg:mb-16">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent block mb-3">
          INTEGRACIÓN DE TU MAPA
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground tracking-tight uppercase leading-[0.95]">
          ¿Y AHORA QUÉ?
          <br />
          EXPLORÁ TU MAPA.
        </h2>
        <p className="font-serif text-base sm:text-lg text-muted mt-4 leading-relaxed">
          Esta página responde dónde tu signo toca el mundo. Lo que ese mapa significa se lee
          aparte, y el resto son herramientas que se desprenden de las mismas coordenadas.
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
