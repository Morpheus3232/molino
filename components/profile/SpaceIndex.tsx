"use client";

import Link from "next/link";
import type { UserProfile } from "@/types/user";
import { encodeProfileData } from "@/lib/utils/profileShare";
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
      label: "Leer qué significa",
      teaser: "La conversación entre tus sistemas, en su propio espacio.",
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
    <nav className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-16 border-t border-ink/10" aria-label="Explorá tu mapa">
      <div className="max-w-2xl mb-8">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent block mb-1">
          Integración de tu mapa
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          ¿Y ahora qué? Explorá tu mapa
        </h2>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          Un mapa no es para guardarlo en un cajón. Es una brújula práctica para navegar tus decisiones cotidianas.
        </p>
      </div>

      {/* Filas separadas por regla, no tarjetas: la estructura es filosa
          (radio 0) y el detalle suave, según globals.css. Antes eran 8 tiles
          `rounded-3xl` con chips de ícono en 7 hues default de Tailwind
          (amber/blue/rose/emerald/violet/cyan/orange) — fuera de la paleta
          declarada, con `text-*-400` pensados para fondo oscuro sobre papel,
          y sin codificar nada: no había leyenda ni significado por color. */}
      <ul className="border-t border-ink/10">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group flex items-baseline gap-4 py-4 border-b border-ink/10 hover:bg-ink/[0.02] transition-colors"
            >
              <item.icon
                className="w-4 h-4 shrink-0 self-center text-muted group-hover:text-accent transition-colors"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-base font-bold text-foreground group-hover:text-accent transition-colors">
                  {item.label}
                </span>
                <span className="block text-sm text-muted leading-relaxed">{item.teaser}</span>
              </span>
              {/* Siempre visible, no solo en hover: en touch no hay hover y
                  el affordance desaparecería por completo. */}
              <ArrowRight
                className="w-4 h-4 shrink-0 self-center text-muted/60 group-hover:text-accent transition-colors"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
