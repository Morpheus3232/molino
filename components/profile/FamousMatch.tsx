"use client";
import { useL } from "@/lib/i18n/useL";

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
import { Asterisk, Users, Star } from "lucide-react";
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
  const L = useL();
  const [errored, setErrored] = useState(false);
  const src = PERSON_IMAGE_URLS[id];

  return (
    <div className={`relative overflow-hidden bg-ink/[0.06] ${className}`}>
      {src && !errored ? (
        <Image
          src={src}
          alt={L.t(name)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-top"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-foreground/25">
          <EntityIcon kind="person" size={56} title={L.t(name)} />
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
  const L = useL();
  const { person, matchLifePath, matchSunSign, matchChineseZodiac } = match;
  const zodiacDisplay = getZodiacDisplay(person.chineseZodiac);
  const sunSymbol = ZODIAC_SYMBOLS[person.sunSign] || "☀";
  const on = (hit: boolean) =>
    hit ? { color: elementColor, fontWeight: 700 } : undefined;

  // Sin separadores "·" y con flex-wrap: en la grilla de 4 columnas la tira
  // mide ~204px y "Caballo · Camino 5 · ♑ Capricornio" no entra, así que
  // envuelve — y al envolver los puntos quedaban colgando al final del
  // renglón. El gap separa igual de bien y aguanta cualquier ancho.
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs border-t border-ink/10 pt-2.5 mt-3">
      <span
        className={`inline-flex items-center gap-1 whitespace-nowrap ${matchChineseZodiac ? "" : "text-muted/70"}`}
        style={on(matchChineseZodiac)}
        title={L(`Zodíaco chino: ${zodiacDisplay.name}`, `Chinese zodiac: ${L.t(zodiacDisplay.name)}`)}
      >
        <ZodiacAnimalIcon animal={person.chineseZodiac} size={13} className="shrink-0" />
        {L.t(zodiacDisplay.name)}
      </span>
      <span
        className={`whitespace-nowrap ${matchLifePath ? "" : "text-muted/70"}`}
        style={on(matchLifePath)}
        title={L(`Camino de vida: ${person.lifePath}`, `Life path: ${person.lifePath}`)}
      >{L(<>
        Camino {L.t(person.lifePath)}
      </>, <>Path {L.t(person.lifePath)}</>)}</span>
      <span
        className={`whitespace-nowrap ${matchSunSign ? "" : "text-muted/70"}`}
        style={on(matchSunSign)}
        title={L(`Signo solar: ${person.sunSign}`, `Sun sign: ${L.t(person.sunSign)}`)}
      >
        {L.t(sunSymbol)} {L.t(person.sunSign)}
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
  const L = useL();
  const { person, matchCount, headline } = match;
  const birthYear = person.birthDate ? person.birthDate.split("-")[0] : "";

  // Un solo badge por tarjeta. Antes "Principal" y "Doble" se posicionaban
  // absolutos en la misma esquina con el mismo fondo, así que en la primera
  // tarjeta se dibujaban pegados y contra el nombre. "Principal" ya implica
  // ser la coincidencia más fuerte, así que gana y el otro no se muestra.
  const badge = featured
    ? { label: L("Principal", "Main"), Icon: Star }
    : matchCount >= 2
      ? { label: matchCount === 3 ? "Triple" : "Doble", Icon: Asterisk }
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
            <span className="absolute top-0 left-0 inline-flex items-center gap-1 text-sm px-2.5 py-1 rounded-br-lg bg-accent text-background font-bold shadow-sm label-caps">
              <badge.Icon className="w-3 h-3" />
              {L.t(badge.label)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 p-5 flex flex-col">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground leading-tight">
            {L.t(person.name)}
          </h3>
          <p className="text-sm text-muted mt-1.5 label-caps">
            {L.t(person.field)} · {person.country}
            {birthYear ? ` · ${birthYear}` : ""}
          </p>

          <p className="text-sm font-medium text-foreground leading-snug flex items-start gap-1.5 mt-3.5">
            <Star className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
            <span>{L.t(headline)}</span>
          </p>

          <p className="text-sm text-muted mt-2.5 leading-relaxed">{L.t(person.shortBio)}</p>

          {person.quote && (
            <blockquote className="mt-3 text-sm italic text-foreground/80 border-l-2 border-accent/40 pl-2.5 py-0.5">
              &ldquo;{L.t(person.quote)}&rdquo;
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
          <span className="absolute top-0 left-0 inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-br-lg bg-accent text-background font-bold shadow-sm label-caps">
            <badge.Icon className="w-2.5 h-2.5" />
            {L.t(badge.label)}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading text-base font-bold text-foreground leading-tight">
          {L.t(person.name)}
        </h3>
        <p className="text-sm text-muted mt-1 label-caps">
          {L.t(person.field)} · {person.country}
          {birthYear ? ` · ${birthYear}` : ""}
        </p>

        <p className="text-xs font-medium text-foreground leading-snug flex items-start gap-1.5 mt-3">
          <Star className="w-3 h-3 text-accent mt-0.5 shrink-0" />
          <span>{L.t(headline)}</span>
        </p>

        <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-3">
          {L.t(person.shortBio)}
        </p>

        <div className="mt-auto">
          <Coordinates match={match} elementColor={elementColor} />
        </div>
      </div>
    </motion.article>
  );
}

export default function FamousMatch({ profile, className = "" }: FamousMatchProps) {
  const L = useL();
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
            <div className="flex items-center gap-2 mb-2">{L(<>
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-sm text-accent font-semibold label-caps">
                Sincronicidad Histórica
              </span>
            </>, <><span className="w-2 h-2 rounded-full bg-accent" /><span className="text-sm text-accent font-semibold label-caps">Historical Synchronicity</span></>)}</div>
            <h2
              id="famous-match-title"
              className="section-title text-foreground"
            >{L("¿Con quién compartís tu mapa?", "Who do you share your map with?")}</h2>
            <p className="text-sm sm:text-base text-muted mt-2 max-w-xl leading-relaxed">{L("Figuras de la historia, la ciencia, el arte y el deporte que vibran en las mismas coordenadas simbólicas que tu mapa personal.", "Figures from history, science, the arts and sports who vibrate at the same symbolic coordinates as your personal map.")}</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted bg-ink/5 border border-ink/10 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span>{L(<>{L.t(totalMatchesAvailable)} resonancias destacadas</>, <>{L.t(totalMatchesAvailable)} notable resonances</>)}</span>
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
        <div className="mt-6 text-xs text-muted font-mono border-t border-ink/5 pt-4">{L("Fechas de nacimiento documentadas en registros biográficos · retratos de Wikipedia", "Dates of birth documented in biographical records · portraits from Wikipedia")}</div>
      </div>
    </section>
  );
}
