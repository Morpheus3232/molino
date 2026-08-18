"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  findFamousMatches,
  type FamousMatchResult,
} from "@/lib/data/famousPeopleToEntities";
import { ZODIAC_SYMBOLS, ELEMENT_COLORS } from "@/lib/data/constants";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { Sparkles, Users, Award, Compass, Star, Check } from "lucide-react";

interface FamousMatchProps {
  profile: UserProfile;
  className?: string;
}

function FamousAvatar({
  initials,
  emoji,
  field,
}: {
  name: string;
  initials: string;
  emoji: string;
  field: string;
}) {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-ink/10 bg-ink/5 flex items-center justify-center shadow-inner relative select-none">
        <span className="font-mono text-base sm:text-lg font-black text-foreground tracking-tight">
          {initials}
        </span>
      </div>
      <span
        className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-background border border-ink/15 flex items-center justify-center text-xs shadow-sm"
        title={field}
        aria-hidden="true"
      >
        {emoji}
      </span>
    </div>
  );
}

function MatchCard({
  match,
  index,
  elementColor,
}: {
  match: FamousMatchResult;
  index: number;
  elementColor: string;
}) {
  const { person, matchLifePath, matchSunSign, matchChineseZodiac, matchCount, headline } = match;
  const zodiacDisplay = getZodiacDisplay(person.chineseZodiac);
  const sunSymbol = ZODIAC_SYMBOLS[person.sunSign] || "☀️";

  const birthYearFormatted = person.birthDate ? person.birthDate.split("-")[0] : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border p-5 sm:p-6 transition-all relative overflow-hidden flex flex-col justify-between ${
        matchCount >= 2
          ? "bg-gradient-to-br from-card to-background border-accent/30 shadow-lg"
          : "bg-card border-ink/10 shadow-sm"
      }`}
    >
      {/* Top resonance badge */}
      {matchCount >= 2 && (
        <div className="absolute top-0 right-0">
          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.16em] px-3 py-1 rounded-bl-xl bg-accent text-background font-bold shadow-sm">
            <Sparkles className="w-3 h-3" />
            {matchCount === 3 ? "Triple Coincidencia" : "Doble Coincidencia"}
          </span>
        </div>
      )}

      <div>
        {/* Header: Avatar + Name + Meta */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          <FamousAvatar
            name={person.name}
            initials={person.initials}
            emoji={person.emoji}
            field={person.field}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border bg-ink/5 text-muted border-ink/10">
                {person.field}
              </span>
              <span className="text-xs text-muted">
                {person.country} {birthYearFormatted ? `· ${birthYearFormatted}` : ""}
              </span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground truncate mt-1">
              {person.name}
            </h3>
          </div>
        </div>

        {/* Headline callout */}
        <div className="mt-4 p-3 rounded-xl bg-background/60 border border-ink/5">
          <p className="text-xs sm:text-sm font-medium text-foreground leading-snug flex items-start gap-2">
            <Star className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
            <span>{headline}</span>
          </p>
        </div>

        {/* Bio */}
        <p className="text-xs text-muted mt-3 leading-relaxed">
          {person.shortBio}
        </p>

        {/* Quote if available */}
        {person.quote && (
          <blockquote className="mt-3 text-[11px] italic text-foreground/80 border-l-2 border-accent/40 pl-2.5 py-0.5">
            &ldquo;{person.quote}&rdquo;
          </blockquote>
        )}
      </div>

      {/* Pillars Breakdown — Zodíaco chino primero y más grande: es el pilar
          que organiza toda la sección. Camino/Solar quedan neutros, con un
          check cuando coinciden, sin color propio. */}
      <div className="mt-5 pt-4 border-t border-ink/10 grid grid-cols-[2fr_1fr_1fr] gap-1.5 text-center">
        {/* Chinese Zodiac — pilar principal */}
        <div
          className={`p-2 rounded-lg border transition-colors ${
            matchChineseZodiac ? "font-semibold" : "bg-ink/[0.02] border-ink/5 text-muted opacity-60"
          }`}
          style={
            matchChineseZodiac
              ? { backgroundColor: `${elementColor}1a`, borderColor: `${elementColor}4d`, color: elementColor }
              : undefined
          }
        >
          <span className="block font-mono text-[9px] uppercase tracking-wider">Zodíaco</span>
          <span className="font-mono text-sm sm:text-base font-bold truncate block">
            {zodiacDisplay.emoji} {zodiacDisplay.name}
          </span>
        </div>

        {/* Life Path */}
        <div className="p-2 rounded-lg border bg-ink/[0.02] border-ink/5 text-muted">
          <span className="flex items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-wider">
            Camino
            {matchLifePath && <Check className="w-2.5 h-2.5 text-foreground" aria-label="Coincide" />}
          </span>
          <span className={`font-mono text-xs sm:text-sm font-bold ${matchLifePath ? "text-foreground" : ""}`}>
            {person.lifePath}
          </span>
        </div>

        {/* Sun Sign */}
        <div className="p-2 rounded-lg border bg-ink/[0.02] border-ink/5 text-muted">
          <span className="flex items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-wider">
            Solar
            {matchSunSign && <Check className="w-2.5 h-2.5 text-foreground" aria-label="Coincide" />}
          </span>
          <span className={`font-mono text-xs sm:text-sm font-bold truncate block ${matchSunSign ? "text-foreground" : ""}`}>
            {sunSymbol} {person.sunSign}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function FamousMatch({ profile, className = "" }: FamousMatchProps) {
  const matches = useMemo(() => findFamousMatches(profile, 3), [profile]);

  if (!matches || matches.length === 0) {
    return null;
  }

  const primaryMatch = matches[0];
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
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
                Sincronicidad Histórica
              </span>
            </div>
            <h2
              id="famous-match-title"
              className="font-heading text-2xl sm:text-3xl text-foreground uppercase tracking-tight"
            >
              ¿Con quién compartís tu mapa?
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl">
              Figuras de la historia, la ciencia, el arte y el deporte que vibran en las mismas coordenadas simbólicas que tu mapa personal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted bg-ink/5 border border-ink/10 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span>{totalMatchesAvailable} resonancias destacadas</span>
          </div>
        </div>

        {/* Grid of Matches (up to 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {matches.map((match, idx) => (
            <MatchCard key={match.person.id} match={match} index={idx} elementColor={elementColor} />
          ))}
        </div>

        {/* Subtle footer tip */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-3 text-[11px] text-muted font-mono border-t border-ink/5 pt-4">
          <span>Fechas históricas verificadas · Sin conjeturas</span>
          <span className="text-accent/90">
            Coincidencia principal: {primaryMatch.person.name} ({primaryMatch.person.field})
          </span>
        </div>
      </div>
    </section>
  );
}
