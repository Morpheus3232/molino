"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import type { Animal } from "@/lib/data/animalRelations";
import { ARCHETYPES, archetypeDisplayName } from "@/lib/data";
import { getRelationshipMap, getClashPartner } from "@/lib/data/animalRelations";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { SIGN_INTERPRETATIONS_ES } from "@/lib/data/interpretations/astrology-interpretations";
import { ANIMAL_INTERPRETATIONS_ES } from "@/lib/data/interpretations/chinese-zodiac-interpretations";
import { SIGN_FACTS, type WesternSign } from "@/lib/data/facts/astrology-facts";
import type { ChineseAnimal } from "@/lib/data/facts/chinese-zodiac-facts";
import { CHINESE_NEW_YEAR_DATES, getLunarYear } from "@/lib/data/chinese-new-year";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import { getMasterNumbers } from "@/lib/engines/numerologyEngine";
import { lifePathSteps, personalYearSteps, personalMonthSteps, personalDaySteps } from "@/lib/numerology/explain";
import { safeNumber } from "@/lib/utils/score";
import { editorialReveal } from "@/lib/utils/motion";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
import AstrologySignIcon from "@/components/ui/AstrologySignIcon";
import LifePathGlyph from "@/components/ui/LifePathGlyph";

interface ProfileCoordinatesSectionProps {
  profile: UserProfile;
}

const YANG_ANIMALS = new Set(["Rata", "Tigre", "Dragón", "Caballo", "Mono", "Perro"]);

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "1990-01-27" → "27 de enero de 1990". */
function fechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

/** Día anterior a una fecha ISO, en ISO (sin husos: todo en UTC). */
function diaAnterior(iso: string): string {
  const t = new Date(`${iso}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() - 1);
  return t.toISOString().slice(0, 10);
}

const ELEMENT_NOTE: Record<string, string> = {
  Fuego: "el temperamento que arranca y contagia",
  Tierra: "el temperamento que concreta y sostiene",
  Aire: "el temperamento que piensa y conecta",
  Agua: "el temperamento que siente y percibe",
};

const MODALITY_NOTE: Record<string, string> = {
  Cardinal: "el ritmo que inicia",
  Fijo: "el ritmo que sostiene",
  Mutable: "el ritmo que se adapta",
};

/** Una pieza del mapa: columna con el glifo y el nombre del sistema, y el contenido. */
function Pillar({
  id,
  index,
  system,
  measures,
  glyph,
  children,
}: {
  id: string;
  index: number;
  system: string;
  measures: string;
  glyph: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.article
      {...editorialReveal}
      id={id}
      className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-12 lg:py-16 border-t border-ink/15"
    >
      <header className="lg:col-span-4 flex lg:flex-col items-center lg:items-start gap-5 lg:sticky lg:top-28 lg:self-start">
        <span className="shrink-0 inline-flex items-center justify-center w-20 h-20 lg:w-28 lg:h-28 border border-ink/15 bg-paper-alt text-foreground">
          {glyph}
        </span>
        <div>
          <p className="text-sm text-muted label-caps">Pieza {index} de 4</p>
          <p className="mt-1 font-display text-2xl text-foreground leading-tight">{system}</p>
          <p className="mt-1 text-base text-muted leading-snug">{measures}</p>
        </div>
      </header>
      <div className="lg:col-span-8 min-w-0">{children}</div>
    </motion.article>
  );
}

/** El recuadro con la cuenta hecha con los números de la persona. */
function Cuenta({ title = "Cómo se calcula", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 border border-ink/15 bg-paper-alt/70 p-5 sm:p-6">
      <p className="text-sm text-muted label-caps mb-3">{title}</p>
      <div className="space-y-3 text-base sm:text-lg leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

/** Una operación: etiqueta corta + cuenta en cifras tabulares. */
function Operacion({ label, text, note }: { label?: string; text: string; note?: React.ReactNode }) {
  return (
    <div>
      {label && <p className="text-sm text-muted">{label}</p>}
      <p className="font-mono tabular-nums tracking-wide break-words">{text}</p>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
    </div>
  );
}

/** Qué es este pilar, en una frase llana. */
function QueEs({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 text-base sm:text-lg leading-relaxed text-foreground/85 max-w-2xl">
      <span className="label-caps text-sm text-muted mr-2">Qué es</span>
      {children}
    </p>
  );
}

export default function ProfileCoordinatesSection({ profile }: ProfileCoordinatesSectionProps) {
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = archetypeDisplayName(archetype.name);
  const birthDate = profile.birthDate || "1990-01-01";
  const [birthY, birthM, birthD] = birthDate.split("-").map(Number);

  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const display = getZodiacDisplay(userAnimal);
  const chineseElement =
    typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const polarity = YANG_ANIMALS.has(userAnimal) ? "Yang" : "Yin";

  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const allies = relationMap.friends.filter((f) => f.type === "triad").map((f) => f.animal);
  const enemy = getClashPartner(userAnimal) || "";

  const sunSign = (profile.sunSign || "Aries") as WesternSign;
  const astroInfo = SIGN_INTERPRETATIONS_ES[sunSign];
  const signFact = SIGN_FACTS[sunSign];
  const element = profile.sunSignInfo?.element || profile.element || signFact?.element || "";
  const modality = profile.sunSignInfo?.modality || profile.modality || signFact?.modality || "";
  const animalInfo = ANIMAL_INTERPRETATIONS_ES[userAnimal as ChineseAnimal];

  const personalYear = profile.cycles?.personalYear ?? 1;
  const personalMonth = profile.cycles?.personalMonth ?? 1;
  const personalDay = profile.cycles?.personalDay ?? 1;
  const yearTheme = getYearTheme(personalYear);

  const masterHits = useMemo(() => getMasterNumbers(profile), [profile]);

  // Las cuentas, hechas con los mismos pasos que el motor (ver explain.test.ts).
  const lp = useMemo(() => lifePathSteps(birthDate), [birthDate]);
  const today = useMemo(() => new Date(), []);
  const py = useMemo(() => personalYearSteps(birthDate, today.getFullYear()), [birthDate, today]);
  const pm = useMemo(() => personalMonthSteps(personalYear, today.getMonth() + 1), [personalYear, today]);
  const pd = useMemo(() => personalDaySteps(lifePath, today), [lifePath, today]);
  // Las cuentas de ciclo se muestran solo si coinciden con lo guardado en el
  // perfil (un perfil guardado otro año trae ciclos viejos hasta recalcularse).
  const cyclesMatch = py.result === personalYear && pm.result === personalMonth && pd.result === personalDay;

  // Año lunar: de un Año Nuevo chino al siguiente.
  const lunarYear = useMemo(() => {
    try {
      return getLunarYear(birthDate);
    } catch {
      return birthY;
    }
  }, [birthDate, birthY]);
  const cnyStart = CHINESE_NEW_YEAR_DATES[lunarYear];
  const cnyNext = CHINESE_NEW_YEAR_DATES[lunarYear + 1];

  return (
    <section
      className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-20 lg:py-28 border-b border-border"
      aria-labelledby="coordenadas-heading"
    >
      <div className="max-w-3xl mb-12 lg:mb-16">
        <p className="text-sm text-accent mb-3 label-caps">Capítulo I · Coordenadas</p>
        <h2 id="coordenadas-heading" className="section-title text-foreground">
          Las cuatro piezas de tu mapa
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
          Tres sistemas leen tu fecha de nacimiento, y un cuarto la cruza con la fecha de hoy. De cada uno
          vas a ver qué es, qué dice el tuyo y la cuenta hecha con tus números, para que puedas rehacerla a mano.
        </p>
      </div>

      {/* ── 1 · Numerología ─────────────────────────────────────────── */}
      <Pillar
        id="pilar-numerologia"
        index={1}
        system="Numerología pitagórica"
        measures="Tu Camino de Vida: la dirección de fondo."
        glyph={<LifePathGlyph value={lifePath} size={64} />}
      >
        <p className="text-sm text-muted label-caps">Camino de Vida {lifePath}</p>
        <h3 className="mt-2 section-title text-foreground">{archetypeName}</h3>
        <p className="mt-4 text-lg sm:text-xl text-foreground/85 leading-relaxed max-w-2xl">
          {archetype.essence || archetype.description}
        </p>
        {archetype.quote && (
          <blockquote className="mt-5 italic text-lg text-muted border-l-2 border-ink/20 pl-4 max-w-xl">
            &laquo;{archetype.quote}&raquo;
          </blockquote>
        )}
        {masterHits.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {masterHits.map((hit) => (
              <span
                key={`${hit.position}-${hit.number}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-vermilion/40 text-sm"
              >
                <span className="font-semibold text-vermilion">Número maestro {hit.number}</span>
                <span className="text-muted">
                  en {hit.position === "lifePath" ? "Camino de Vida" : hit.position === "expression" ? "Expresión" : "Personalidad"}
                </span>
              </span>
            ))}
          </div>
        )}

        <QueEs>
          El número central de la numerología. Se suman todos los dígitos de tu fecha de nacimiento y se
          reduce el total, sumando sus cifras, hasta quedar en un número del 1 al 9. El 11, el 22 y el 33 son{" "}
          <Link href="/guia/numeros-maestros" className="underline underline-offset-4 hover:no-underline">
            números maestros
          </Link>{" "}
          y no se reducen.
        </QueEs>

        <Cuenta>
          <Operacion
            label={`Los dígitos de ${fechaLarga(birthDate)}`}
            text={lp.text}
            note={
              lp.master
                ? `${lp.result} es un número maestro: la cuenta se detiene ahí.`
                : `Tu Camino de Vida es ${lp.result}.`
            }
          />
        </Cuenta>

        {(profile.expressionNumber || profile.personalityNumber) && (
          <p className="mt-4 text-base text-muted">
            Con tu nombre también se calculan{" "}
            {profile.expressionNumber && <>Expresión <strong className="text-foreground">{profile.expressionNumber}</strong></>}
            {profile.expressionNumber && profile.personalityNumber && " y "}
            {profile.personalityNumber && <>Personalidad <strong className="text-foreground">{profile.personalityNumber}</strong></>}
            : cada letra vale un número del 1 al 9.
          </p>
        )}
        <Link
          href={`/conocimiento/numerologia/${lifePath}`}
          className="mt-6 inline-flex text-base underline underline-offset-4 hover:no-underline"
        >
          Todo sobre el {lifePath} →
        </Link>
      </Pillar>

      {/* ── 2 · Astrología ──────────────────────────────────────────── */}
      <Pillar
        id="pilar-astrologia"
        index={2}
        system="Astrología occidental"
        measures="Tu signo solar: dónde estaba el Sol."
        glyph={<AstrologySignIcon sign={profile.sunSign || ""} size={64} className="text-foreground" />}
      >
        <p className="text-sm text-muted label-caps">{astroInfo?.archetype || "Signo solar"}</p>
        <h3 className="mt-2 section-title text-foreground">Sol en {profile.sunSign}</h3>
        <p className="mt-4 text-lg sm:text-xl text-foreground/85 leading-relaxed max-w-2xl">
          {astroInfo?.description ||
            `Tu energía solar en ${profile.sunSign} combina el elemento ${element.toLowerCase()} con el ritmo ${modality.toLowerCase()}.`}
        </p>

        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/15 border border-ink/15 max-w-2xl">
          <div className="bg-background p-4">
            <dt className="text-sm text-muted label-caps">Elemento</dt>
            <dd className="mt-1 font-display text-2xl text-foreground">{element}</dd>
            {ELEMENT_NOTE[element] && <dd className="mt-1 text-sm text-muted">{ELEMENT_NOTE[element]}</dd>}
          </div>
          <div className="bg-background p-4">
            <dt className="text-sm text-muted label-caps">Modalidad</dt>
            <dd className="mt-1 font-display text-2xl text-foreground">{modality}</dd>
            {MODALITY_NOTE[modality] && <dd className="mt-1 text-sm text-muted">{MODALITY_NOTE[modality]}</dd>}
          </div>
        </dl>
        {astroInfo?.keywords && (
          <p className="mt-4 text-base text-muted">Rasgos que la tradición le asigna: {astroInfo.keywords.join(", ").toLowerCase()}.</p>
        )}

        <QueEs>
          El tramo del zodíaco que el Sol atravesaba el día que naciste. Son doce tramos de unos treinta días;
          por eso alcanza con la fecha. La Luna y el ascendente necesitan además la hora y el lugar, y acá no se calculan.
        </QueEs>

        {signFact && (
          <Cuenta>
            <Operacion
              label="El calendario solar"
              text={`${sunSign}: del ${signFact.startDay} de ${MESES[signFact.startMonth - 1]} al ${signFact.endDay} de ${MESES[signFact.endMonth - 1]}`}
              note={`Naciste el ${birthD} de ${MESES[birthM - 1]}, dentro de ese tramo. Cerca del cambio de signo, un día puede variar según el año.`}
            />
          </Cuenta>
        )}
        <Link
          href={`/conocimiento/astrologia/${sunSign.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()}`}
          className="mt-6 inline-flex text-base underline underline-offset-4 hover:no-underline"
        >
          Todo sobre {sunSign} →
        </Link>
      </Pillar>

      {/* ── 3 · Zodíaco chino ───────────────────────────────────────── */}
      <Pillar
        id="pilar-zodiaco-chino"
        index={3}
        system="Zodíaco chino"
        measures="Tu animal y tu elemento: el año en que naciste."
        glyph={<ZodiacAnimalIcon animal={userAnimal} size={64} />}
      >
        <p className="text-sm text-muted label-caps">
          Polaridad {polarity} · elemento {chineseElement}
        </p>
        <h3 className="mt-2 section-title text-foreground">
          {display.name} de {chineseElement}
        </h3>
        <p className="mt-4 text-lg sm:text-xl text-foreground/85 leading-relaxed max-w-2xl">
          {animalInfo?.description ||
            `Nacido bajo la influencia de ${display.name}, integrás la energía del elemento ${chineseElement} en polaridad ${polarity}.`}
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/15 border border-ink/15 max-w-2xl">
          <div className="bg-background p-4">
            <p className="text-sm text-muted label-caps">Tus dos amigos · 三合</p>
            <p className="mt-1 font-display text-2xl text-foreground">
              {allies.length > 0 ? allies.join(" y ") : "—"}
            </p>
            <p className="mt-1 text-sm text-muted">A cuatro casillas de distancia: forman un triángulo en la rueda.</p>
          </div>
          <div className="bg-background p-4">
            <p className="text-sm text-muted label-caps">Tu opuesto · 六冲</p>
            <p className="mt-1 font-display text-2xl text-foreground">{enemy || "—"}</p>
            <p className="mt-1 text-sm text-muted">Enfrente en la rueda, a seis casillas: la tensión del ciclo.</p>
          </div>
        </div>

        <QueEs>
          Un calendario de doce animales que se turnan año por año, combinado con cinco elementos que cambian cada
          dos años: en total, un ciclo de 60 años. El año chino no empieza el 1 de enero sino con el Año Nuevo lunar,
          que cae entre el 21 de enero y el 21 de febrero.
        </QueEs>

        {cnyStart && cnyNext && (
          <Cuenta>
            <Operacion
              label="Tu año lunar"
              text={`${fechaLarga(cnyStart)} → ${fechaLarga(diaAnterior(cnyNext))}`}
              note={`Ese año fue de ${display.name} de ${chineseElement}, y tu fecha (${fechaLarga(birthDate)}) cae adentro.${
                lunarYear !== birthY ? ` Ojo: naciste antes del Año Nuevo chino, así que tu signo es el del año ${lunarYear}.` : ""
              }`}
            />
          </Cuenta>
        )}
        <Link
          href={`/conocimiento/zodiaco-chino/${encodeURIComponent(display.name.toLowerCase())}`}
          className="mt-6 inline-flex text-base underline underline-offset-4 hover:no-underline"
        >
          Todo sobre el {display.name} →
        </Link>
      </Pillar>

      {/* ── 4 · Ciclos ──────────────────────────────────────────────── */}
      <Pillar
        id="pilar-ciclos"
        index={4}
        system="Tus ciclos"
        measures="Tu año, tu mes y tu día personal: lo que cambia."
        glyph={<span className="font-display text-6xl lg:text-7xl leading-none tabular-nums">{personalYear}</span>}
      >
        <p className="text-sm text-muted label-caps">Año personal {personalYear}</p>
        <h3 className="mt-2 section-title text-foreground">{yearTheme ? yearTheme.charAt(0).toUpperCase() + yearTheme.slice(1) : `Año ${personalYear}`}</h3>

        <div className="mt-6 grid grid-cols-3 gap-px bg-ink/15 border border-ink/15 max-w-2xl">
          {[
            { label: "Año", value: personalYear, note: "el clima de fondo" },
            { label: "Mes", value: personalMonth, note: "el tono del mes" },
            { label: "Día", value: personalDay, note: "la vibración de hoy" },
          ].map((c) => (
            <div key={c.label} className="bg-background p-4 text-center">
              <p className="text-sm text-muted label-caps">{c.label}</p>
              <p className="mt-1 font-display text-4xl sm:text-5xl text-foreground tabular-nums">{c.value}</p>
              <p className="mt-1 text-sm text-muted leading-snug">{c.note}</p>
            </div>
          ))}
        </div>

        <QueEs>
          Además de los números fijos, la numerología lee ciclos que van rotando del 1 al 9: un año que marca el
          clima de fondo, un mes que le da tono y un día que suma o resta. Se calculan con tu fecha de nacimiento y la
          fecha de hoy. El año 1 abre una etapa; el 9 la cierra.
        </QueEs>

        {cyclesMatch && (
          <Cuenta title="Cómo se calculan">
            <Operacion label="Año personal: tu día y mes de nacimiento + el año en curso" text={py.text} />
            <Operacion label="Mes personal: tu año personal + el número del mes" text={pm.text} />
            <Operacion label="Día personal: tu Camino de Vida + la fecha de hoy" text={pd.text} />
          </Cuenta>
        )}
        <Link href="/hoy" className="mt-6 inline-flex text-base underline underline-offset-4 hover:no-underline">
          Ver tu día de hoy →
        </Link>
      </Pillar>
    </section>
  );
}
