"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  findFamousMatches,
  type FamousMatchResult,
} from "@/lib/data/famousPeopleToEntities";
import { PERSON_IMAGE_URLS } from "@/lib/data/person-images";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { ArrowRight } from "lucide-react";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";

interface FamousMatchCompactProps {
  profile: UserProfile;
  className?: string;
  /** Oculta el border-t cuando el componente ya está dentro de un contexto
   * con separación visual (ej. debajo del AI reading en /lectura). */
  hideBorderTop?: boolean;
}

function MiniPortrait({
  name,
  id,
  className = "",
}: {
  name: string;
  id: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const src = PERSON_IMAGE_URLS[id];

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-ink/[0.06] ${className}`}
    >
      {src && !errored ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="80px"
          className="object-cover object-top"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-foreground/25 text-2xl font-heading">
          {name.charAt(0)}
        </div>
      )}
    </div>
  );
}

function MiniCard({
  match,
  index,
  elementColor,
}: {
  match: FamousMatchResult;
  index: number;
  elementColor: string;
}) {
  const { person, matchCount, headline } = match;
  const zodiacDisplay = getZodiacDisplay(person.chineseZodiac);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: 0.08 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex items-center gap-3 rounded-lg border border-ink/10 bg-card px-3.5 py-3 shadow-sm"
    >
      <MiniPortrait name={person.name} id={person.id} className="w-14 h-14 shrink-0" />

      <div className="min-w-0 flex-1">
        <h4 className="font-heading text-sm font-bold text-foreground leading-tight truncate">
          {person.name}
        </h4>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mt-0.5 truncate">
          {person.field} · {person.country}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          <span
            className="inline-flex items-center gap-1 font-mono text-[10px]"
            style={{ color: elementColor }}
          >
            <ZodiacAnimalIcon
              animal={person.chineseZodiac}
              size={11}
              className="shrink-0"
            />
            {zodiacDisplay.name}
          </span>
          {matchCount >= 2 && (
            <span className="font-mono text-[10px] text-accent font-semibold">
              {matchCount === 3 ? "Triple" : "Doble"}
            </span>
          )}
        </div>

        <p className="text-xs text-muted mt-1 leading-snug line-clamp-2">
          {headline}
        </p>
      </div>
    </motion.div>
  );
}

export default function FamousMatchCompact({
  profile,
  className = "",
  hideBorderTop = false,
}: FamousMatchCompactProps) {
  const { country } = useUserContext();
  const matches = useMemo(
    () => findFamousMatches(profile, 3, country),
    [profile, country],
  );

  if (!matches || matches.length === 0) return null;

  const element =
    typeof profile.chineseZodiacInfo?.element === "string"
      ? profile.chineseZodiacInfo.element
      : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  const userAnimal = profile.chineseZodiacInfo?.animal;

  return (
    <section
      className={`py-10 ${hideBorderTop ? "" : "border-t border-ink/10"} ${className}`}
      aria-labelledby="famous-compact-title"
    >
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                Sincronicidad Histórica
              </span>
            </div>
            <h2
              id="famous-compact-title"
              className="font-heading text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight"
            >
              ¿Con quién compartís tu mapa?
            </h2>
            <p className="text-sm text-muted mt-1.5 max-w-lg leading-relaxed">
              Figuras de la historia, la ciencia, el arte que vibran en las
              mismas coordenadas simbólicas que tu mapa personal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {matches.map((match, idx) => (
            <MiniCard
              key={match.person.id}
              match={match}
              index={idx}
              elementColor={elementColor}
            />
          ))}
        </div>

        <div className="mt-5">
          <Link
            href={`/affinity/artist${userAnimal ? `?animal=${encodeURIComponent(userAnimal)}` : ""}`}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
          >
            <span>Explorar todos los famosos en el Atlas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
