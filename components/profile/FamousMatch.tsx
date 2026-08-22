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
import { useUserContext } from "@/lib/hooks/useUserContext";
import { Sparkles, Users, Award, Compass, Star, Check } from "lucide-react";

interface FamousMatchProps {
  profile: UserProfile;
  className?: string;
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
  const { person, matchLifePath, matchSunSign, matchChineseZodiac, matchCount, headline } = match;
  const zodiacDisplay = getZodiacDisplay(person.chineseZodiac);
  const sunSymbol = ZODIAC_SYMBOLS[person.sunSign] || "☀️";

  const birthYearFormatted = person.birthDate ? person.birthDate.split("-")[0] : "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 * Math.min(index, 4), ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border p-4 sm:p-5 transition-all relative overflow-hidden flex flex-col ${
        featured
          ? "sm:col-span-2 bg-gradient-to-br from-accent/[0.07] via-card to-background border-accent/40 shadow-md"
          : matchCount >= 2
            ? "bg-gradient-to-br from-card to-background border-accent/30 shadow-sm"
            : "bg-card border-ink/10 shadow-sm"
      }`}
    >
      {/* Top resonance badge */}
      <div className="absolute top-0 right-0 flex">
        {featured && (
          <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-bl-lg bg-foreground text-background font-bold">
            <Star className="w-2.5 h-2.5" />
            Principal
          </span>
        )}
        {matchCount >= 2 && (
          <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-bl-lg bg-accent text-background font-bold shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            {matchCount === 3 ? "Triple" : "Doble"}
          </span>
        )}
      </div>

      {/* Header: emoji + Name + Meta (sin avatar de iniciales) */}
      <div className="flex-1">
      <div className="flex items-start gap-3">
        <span
          className={`${featured ? "text-3xl sm:text-4xl" : "text-xl"} leading-none flex-shrink-0 mt-0.5`}
          aria-hidden="true"
        >
          {person.emoji}
        </span>
        <div className="min-w-0 flex-1 pr-12 sm:pr-20">
          <h3
            className={`font-heading font-bold text-foreground leading-tight ${
              featured ? "text-base sm:text-xl" : "text-sm sm:text-base"
            }`}
          >
            {person.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1">
            <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border bg-ink/5 text-muted border-ink/10">
              {person.field}
            </span>
            <span className="text-[10px] text-muted">
              {person.country} {birthYearFormatted ? `· ${birthYearFormatted}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Headline callout */}
      <div className={`mt-3 p-2.5 rounded-lg bg-background/60 border border-ink/5`}>
        <p
          className={`font-medium text-foreground leading-snug flex items-start gap-1.5 ${
            featured ? "text-xs sm:text-sm" : "text-[11px] sm:text-xs"
          }`}
        >
          <Star className={`text-accent mt-0.5 flex-shrink-0 ${featured ? "w-3.5 h-3.5" : "w-3 h-3"}`} />
          <span>{headline}</span>
        </p>
      </div>

      {/* Bio */}
      <p
        className={`text-muted mt-2.5 leading-relaxed ${
          featured ? "text-xs sm:text-sm text-foreground/80" : "text-[11px] line-clamp-3"
        }`}
      >
        {person.shortBio}
      </p>

      {/* Quote if available */}
      {person.quote && (
        <blockquote className="mt-2.5 text-[11px] italic text-foreground/80 border-l-2 border-accent/40 pl-2 py-0.5">
          &ldquo;{person.quote}&rdquo;
        </blockquote>
      )}
      </div>

      {/* Pillars Breakdown — Zodíaco chino primero y a ancho completo (es el
          pilar que organiza la sección); Camino/Solar debajo en dos columnas.
          Sin truncamientos: los nombres largos ("Capricornio") entran en media
          tarjeta. Coincidencias marcadas con check y color del elemento. */}
      <div className="mt-4 space-y-1">
        {/* Chinese Zodiac — pilar principal, fila completa */}
        <div
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md border transition-colors ${
            matchChineseZodiac ? "font-semibold" : "bg-ink/[0.02] border-ink/5 text-muted opacity-60"
          }`}
          style={
            matchChineseZodiac
              ? { backgroundColor: `${elementColor}1a`, borderColor: `${elementColor}4d`, color: elementColor }
              : undefined
          }
        >
          <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider">
            Zodíaco
            {matchChineseZodiac && <Check className="w-2.5 h-2.5" aria-label="Coincide" />}
          </span>
          <span className="font-mono text-xs font-bold">
            {zodiacDisplay.emoji} {zodiacDisplay.name}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {/* Life Path */}
          <div
            className={`px-2.5 py-1.5 rounded-md border transition-colors ${
              matchLifePath
                ? "bg-accent/[0.06] border-accent/25"
                : "bg-ink/[0.02] border-ink/5 text-muted opacity-60"
            }`}
          >
            <span className="flex items-center justify-between font-mono text-[8px] uppercase tracking-wider">
              Camino
              {matchLifePath && <Check className="w-2.5 h-2.5 text-accent" aria-label="Coincide" />}
            </span>
            <span
              className={`block font-mono text-xs font-bold text-right ${
                matchLifePath ? "text-foreground" : ""
              }`}
            >
              {person.lifePath}
            </span>
          </div>

          {/* Sun Sign */}
          <div
            className={`px-2.5 py-1.5 rounded-md border transition-colors ${
              matchSunSign
                ? "bg-accent/[0.06] border-accent/25"
                : "bg-ink/[0.02] border-ink/5 text-muted opacity-60"
            }`}
          >
            <span className="flex items-center justify-between font-mono text-[8px] uppercase tracking-wider">
              Solar
              {matchSunSign && <Check className="w-2.5 h-2.5 text-accent" aria-label="Coincide" />}
            </span>
            <span
              className={`block font-mono text-[11px] font-bold text-right ${
                matchSunSign ? "text-foreground" : ""
              }`}
            >
              {sunSymbol} {person.sunSign}
            </span>
          </div>
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
            mucho contenido para 2 col angostas), featured ocupa 2 columnas
            desde sm para dar jerarquía al match principal. */}
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
