"use client";
import { useL } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
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
  const L = useL();
  const items = [
    {
      label: L("Hoy", "Today"),
      teaser: L(`Energía diaria y fase lunar para tu Camino ${profile.lifePath}.`, `Daily energy and moon phase for your Path ${L.t(profile.lifePath)}.`),
      href: "/hoy",
      icon: Sun,
    },
    {
      label: L("Modo Pareja", "Couple Mode"),
      teaser: L("Compará tu mapa con el de tu pareja, socio o familiar.", "Compare your map with your partner's, business partner's or a family member's."),
      href: `/pareja?a=${profile.birthDate || ""}`,
      icon: Heart,
    },
    {
      label: L("Círculo", "Circle"),
      teaser: allyName ? L(`${circleName} tiene afinidad con ${allyName}.`, `${L.t(circleName)} has an affinity with ${L.t(allyName)}.`) : L("Energías alrededor de tu signo.", "Energies around your sign."),
      href: "/circulo",
      icon: Users,
    },
  ];

  return (
    <motion.nav
      {...editorialReveal}
      className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-20 lg:py-28 border-t border-border"
      aria-label={L("Explorá tu mapa", "Explore your map")}
    >
      <div className="max-w-3xl mb-10 lg:mb-12">
        <span className="text-sm text-muted block mb-3 label-caps">{L("También con tus coordenadas", "Also with your coordinates")}</span>
        <p className="text-base text-muted leading-relaxed max-w-xl">{L("Herramientas que se desprenden de los mismos números, para cuando quieras mirar tu mapa desde otro ángulo.", "Tools that come from the same numbers, for when you want to look at your map from another angle.")}</p>
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
                  {L.t(item.label)}
                </span>
                <span className="block font-serif text-sm sm:text-base text-muted leading-relaxed mt-1">
                  {L.t(item.teaser)}
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
