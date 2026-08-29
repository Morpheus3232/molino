"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  findFamousMatches,
  type FamousMatchResult,
} from "@/lib/data/famousPeopleToEntities";
import { PERSON_IMAGE_URLS } from "@/lib/data/person-images";
import { ZODIAC_SYMBOLS, ELEMENT_COLORS } from "@/lib/data/constants";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { useUserContext } from "@/lib/hooks/useUserContext";
import { Sparkles, Users, Star } from "lucide-react";
import EntityIcon from "@/components/ui/EntityIcon";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";

interface FamousMatchProps {
  profile: UserProfile;
  className?: string;
}

/**
 * Retrato de la figura. Cuando Wikipedia no tiene foto se cae a la silueta
 * genérica del sitio, centrada sobre el mismo fondo, para que el hueco no se
 * lea como una imagen rota. `object-top` porque en los retratos de Wikipedia
 * la cara casi siempre está en el tercio superior y un `center` la recorta.
 */
function Portrait({ name, id, className = "" }: { name: string; id: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  const src = PERSON_IMAGE_URLS[id];

  return (
    <div className={`relative overflow-hidden bg-ink/[0.06] ${className}`}>
      {src && !errored ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-top"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-foreground/25">
          <EntityIcon kind="person" size={56} title={name} />
        </div>
      )}
    </div>
  );
}

/**
 * Las tres coordenadas en una sola línea. Antes eran tres cajas con borde que
 * repetían el dato que el titular ya decía ("Compartís Número de Vida 5 y
 * Zodíaco Chino"). Acá el titular explica y esta línea muestra los valores:
 * las que coinciden en el color del elemento, el resto apagado.
 */
function Coordinates({
  match,
  elementColor,
}: {
  match: FamousMatchResult;
  elementColor: string;
}) {
  const { person, matchLifePath, matchSunSign, matchChineseZodiac } = match;
  const zodiacDisplay = getZodiacDisplay(person.chineseZodiac);
  const sunSymbol = ZODIAC_SYMBOLS[person.sunSign] || "☀";
  const on = (hit: boolean) =>
    hit ? { color: elementColor, fontWeight: 700 } : undefined;

  return (
    <div className="flex items-center gap-2 font-mono text-xs border-t border-ink/10 pt-2.5 mt-3">
      <span
        className={`inline-flex items-center gap-1 ${matchChineseZodiac ? "" : "text-muted/70"}`}
        style={on(matchChineseZodiac)}
        title={`Zodíaco chino: ${zodiacDisplay.name}`}
      >
        <ZodiacAnimalIcon animal={person.chineseZodiac} size={13} className="shrink-0" />
        {zodiacDisplay.name}
      </span>
      <span className="text-ink/20" aria-hidden>
        ·
      </span>
      <span
        className={matchLifePath ? "" : "text-muted/70"}
        style={on(matchLifePath)}
        title={`Camino de vida: ${person.lifePath}`}
      >
        Camino {person.lifePath}
      </span>
      <span className="text-ink/20" aria-hidden>
        ·
      </span>
      <span
        className={matchSunSign ? "" : "text-muted/70"}
        style={on(matchSunSign)}
        title={`Signo solar: ${person.sunSign}`}
      >
        {sunSymbol} {person.sunSign}
      </span>
    </div>
  );
}

function MatchCard({
  match,
  index,
  elementColor,
  featured = false,
}: {
  match: FamousMatchResult;
  index: number;
  elementColor: string;
  featured?: boolean;
}) {
  const { person, matchCount, headline } = match;
  const birthYear = person.birthDate ? person.birthDate.split("-")[0] : "";

  // Un solo badge por tarjeta. Antes "Principal" y "Doble" se posicionaban
  // absolutos en la misma esquina con el mismo fondo, así que en la primera
  // tarjeta se dibujaban pegados y contra el nombre. "Principal" ya implica
  // ser la coincidencia más fuerte, así que gana y el otro no se muestra.
  const badge = featured
    ? { label: "Principal", Icon: Star }
    : matchCount >= 2
      ? { label: matchCount === 3 ? "Triple" : "Doble", Icon: Sparkles }
      : null;

  // La tarjeta principal va apaisada y al doble de ancho: la foto ocupa su
  // propia columna y el texto respira. El resto son verticales.
  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="sm:col-span-2 rounded-lg border border-accent/30 bg-gradient-to-br from-card to-background shadow-md overflow-hidden flex flex-col sm:flex-row"
      >
        <div className="relative sm:w-[42%] shrink-0">
          <Portrait
            name={person.name}
            id={person.id}
            className="h-56 sm:h-full sm:min-h-[19rem]"
          />
          {badge && (
            <span className="absolute top-0 left-0 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.14em] px-2.5 py-1 rounded-br-lg bg-accent text-background font-bold shadow-sm">
              <badge.Icon className="w-3 h-3" />
              {badge.label}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 p-5 flex flex-col">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground leading-tight">
            {person.name}
          </h3>
          <p className="font-mono text-xs uppercase tracking-wider text-muted mt-1.5">
            {person.field} · {person.country}
            {birthYear ? ` · ${birthYear}` : ""}
          </p>

          <p className="text-sm font-medium text-foreground leading-snug flex items-start gap-1.5 mt-3.5">
            <Star className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
            <span>{headline}</span>
          </p>

          <p className="text-sm text-muted mt-2.5 leading-relaxed">{person.shortBio}</p>

          {person.quote && (
            <blockquote className="mt-3 text-sm italic text-foreground/80 border-l-2 border-accent/40 pl-2.5 py-0.5">
              &ldquo;{person.quote}&rdquo;
            </blockquote>
          )}

          <div className="mt-auto">
            <Coordinates match={match} elementColor={elementColor} />
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 * Math.min(index, 4), ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-lg border overflow-hidden flex flex-col transition-shadow hover:shadow-md ${
        matchCount >= 2
          ? "bg-gradient-to-br from-card to-background border-accent/30 shadow-sm"
          : "bg-card border-ink/10 shadow-sm"
      }`}
    >
      <div className="relative">
        <Portrait name={person.name} id={person.id} className="h-44 w-full" />
        {badge && (
          <span className="absolute top-0 left-0 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.14em] px-2 py-0.5 rounded-br-lg bg-accent text-background font-bold shadow-sm">
            <badge.Icon className="w-2.5 h-2.5" />
            {badge.label}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading text-base font-bold text-foreground leading-tight">
          {person.name}
        </h3>
        <p className="font-mono text-xs uppercase tracking-wider text-muted mt-1">
          {person.field} · {person.country}
          {birthYear ? ` · ${birthYear}` : ""}
        </p>

        <p className="text-xs font-medium text-foreground leading-snug flex items-start gap-1.5 mt-3">
          <Star className="w-3 h-3 text-accent mt-0.5 shrink-0" />
          <span>{headline}</span>
        </p>

        <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-3">
          {person.shortBio}
        </p>

        <div className="mt-auto">
          <Coordinates match={match} elementColor={elementColor} />
        </div>
      </div>
    </motion.article>
  );
}

export default function FamousMatch({ profile, className = "" }: FamousMatchProps) {
  const { country } = useUserContext();
  const matches = useMemo(() => findFamousMatches(profile, 8, country), [profile, country]);

  if (!matches || matches.length === 0) {
    return null;
  }

  const totalMatchesAvailable = matches.length;
  const element = typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  return (
    <section
      className={`py-12 border-t border-ink/10 ${className}`}
      aria-labelledby="famous-match-title"
    >
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                Sincronicidad Histórica
              </span>
            </div>
            <h2
              id="famous-match-title"
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground uppercase tracking-tight"
            >
              ¿Con quién compartís tu mapa?
            </h2>
            <p className="text-sm sm:text-base text-muted mt-2 max-w-xl leading-relaxed">
              Figuras de la historia, la ciencia, el arte y el deporte que vibran en las mismas coordenadas simbólicas que tu mapa personal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted bg-ink/5 border border-ink/10 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span>{totalMatchesAvailable} resonancias destacadas</span>
          </div>
        </div>

        {/* Grid of Matches (up to 8) — 1 columna en mobile (las cards tienen
            mucho contenido para 2 col angostas). Todas las cards del mismo
            tamaño: la jerarquía la dan los badges, no el tamaño. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {matches.map((match, idx) => (
            <MatchCard
              key={match.person.id}
              match={match}
              index={idx}
              elementColor={elementColor}
              featured={idx === 0}
            />
          ))}
        </div>

        {/* Pie: solo la procedencia del dato. Antes repetía "Coincidencia
            principal: <nombre>", que es exactamente lo que ya dice el badge
            Principal en la tarjeta de esa persona. */}
        <div className="mt-6 text-xs text-muted font-mono border-t border-ink/5 pt-4">
          Fechas de nacimiento documentadas en registros biográficos · retratos
          de Wikipedia
        </div>
      </div>
    </section>
  );
}
