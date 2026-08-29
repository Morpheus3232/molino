"use client";

import React from "react";
import PersonalSigil from "@/components/ui/PersonalSigil";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
import AstrologySignIcon from "@/components/ui/AstrologySignIcon";
import LifePathGlyph from "@/components/ui/LifePathGlyph";
import PersonalSynergySigil from "@/components/ui/PersonalSynergySigil";

export interface AtlasShareCardSVGProps {
  birthDateFormatted: string; // ej. "18.04.1990"
  birthDateRaw?: string;      // ej. "1990-04-18"
  synergyDateB?: string;      // ej. "1992-09-24" (para modo pareja)
  birthDay?: number;          // ej. 18
  birthMonth?: number;        // ej. 4
  currentYear?: number | string; // ej. 2026
  lifePathNumber: number;      // ej. 4
  lifePathName: string;        // ej. "El Constructor"
  lifePathFormula: string;     // ej. "1+8 + 0+4 + 1+9+9+0 = 32 → 5"
  vibracionBase: number;       // ej. 9
  anoPersonal: number;         // ej. 7
  chineseSign: string;         // ej. "Caballo de Metal"
  chineseBranch: string;       // ej. "午"
  chineseAffinityFriends: string; // ej. "Tigre · Perro"
  chineseAffinityClash: string;   // ej. "Rata"
  solarSign: string;           // ej. "Aries"
  solarElement: string;        // ej. "Fuego Cardinal"
  className?: string;
}

/**
 * Medallón de la columna derecha: los tres pilares comparten centro, diámetro
 * y aro, así que los tres dibujos —número, animal, glifo solar— se leen como
 * una misma serie y no como tres adornos sueltos.
 */
function PillarMedallion({
  color,
  box = 104,
  children,
}: {
  color: string;
  /** Lado del dibujo dentro del aro; se ajusta por glifo para igualar peso óptico. */
  box?: number;
  children: React.ReactNode;
}) {
  return (
    <g transform="translate(770, 115)" style={{ color }}>
      <circle r="62" fill="#F7F4EE" stroke="#DEDACE" strokeWidth="2" />
      <g transform={`translate(-${box / 2}, -${box / 2})`}>{children}</g>
    </g>
  );
}

/** "Tigre · Perro" → ["Tigre", "Perro"]. El campo llega ya formateado para leer. */
function splitSigns(value: string): string[] {
  return value
    .split(/[·,/]|\sy\s/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * AtlasShareCardSVG — Tarjeta SVG Vectorial Compartible de Alta Definición (1080x1900)
 *
 * Incluye:
 * - Un medallón por pilar, todos al mismo centro y diámetro: el número del
 *   Camino de Vida, la silueta del signo chino y el glifo solar — los mismos
 *   dibujos que usa el resto del sitio
 * - Sello Personal determinístico (PersonalSigil o PersonalSynergySigil) como fondo en opacidad 0.08
 * - Header editorial con línea divisoria (#DEDACE, 1px) y tipografía Newsreader
 * - Números clave en círculos de 40px con acento #A83A23
 * - Borde exterior sutil de 4px (#DEDACE, rx=24)
 * - Marca de agua "GENERADO LOCALMENTE / SIN BASE DE DATOS" en esquina inferior
 */
export default function AtlasShareCardSVG({
  birthDateFormatted,
  birthDateRaw,
  synergyDateB,
  birthDay = 18,
  birthMonth = 4,
  currentYear = 2026,
  lifePathNumber = 4,
  lifePathName = "El Constructor",
  lifePathFormula = "1+8 + 0+4 + 1+9+9+0 = 32 → 5",
  vibracionBase = 9,
  anoPersonal = 7,
  chineseSign = "Caballo",
  chineseBranch = "午",
  chineseAffinityFriends = "Tigre · Perro",
  chineseAffinityClash = "Rata",
  solarSign = "Aries",
  solarElement = "Fuego Cardinal",
  className,
}: AtlasShareCardSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1080 1900"
      width="1080"
      height="1900"
      className={className ?? "w-full h-auto max-w-[480px] rounded-xl shadow-md border border-[#DEDACE]"}
      style={{
        backgroundColor: "#F7F4EE",
        fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
      }}
    >
      <defs>
        <style>{`
          .mono { font-family: 'JetBrains Mono', monospace; }
          .serif { font-family: 'Newsreader', Georgia, serif; font-style: italic; }
          .heading { font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
        `}</style>
      </defs>

      {/* 1. Fondo base de papel */}
      <rect width="1080" height="1900" fill="#F7F4EE" />

      {/* 2. FONDO: SELLO PERSONAL O PATRÓN DE SINERGIA */}
      <g opacity="0.08" transform="translate(100, 50)">
        {synergyDateB ? (
          <PersonalSynergySigil
            dateA={birthDateRaw || "1990-04-18"}
            dateB={synergyDateB}
            width={880}
            height={1800}
            showLegend={false}
          />
        ) : (
          <PersonalSigil
            lifePath={lifePathNumber}
            birthDay={birthDay}
            birthMonth={birthMonth}
            width={880}
            height={1800}
          />
        )}
      </g>

      {/* 3. BORDE EXTERIOR SUTIL (4px, rx="24") */}
      <rect
        x="20"
        y="20"
        width="1040"
        height="1860"
        fill="none"
        stroke="#DEDACE"
        strokeWidth="4"
        rx="24"
      />

      {/* 4. CONTENIDO SUPERIOR */}
      <g>
        {/* HEADER con más aire vertical y línea divisoria */}
        <g transform="translate(100, 90)">
          <text className="mono" fontSize="13" fill="#6A6459" letterSpacing="4">
            MAPA PERSONAL · {currentYear}
          </text>

          {/* Línea divisoria sutil */}
          <line x1="0" y1="28" x2="880" y2="28" stroke="#DEDACE" strokeWidth="1" />

          <text x="0" y="80" className="heading" fontSize="34" fill="#1D1B17" letterSpacing="2">
            Tu patrón es único
          </text>

          <text x="0" y="118" className="serif" fontSize="22" fill="#6A6459">
            Numerología + Astrología + Zodíaco Chino · {birthDateFormatted}
          </text>
        </g>

        {/* 5. RESUMEN DE CIFRAS CLAVE (Círculos destacados con radio 40px) */}
        <g transform="translate(100, 260)">
          {/* Cifra 1: Camino de Vida */}
          <g transform="translate(0, 0)">
            <circle cx="40" cy="40" r="40" fill="#F7F4EE" stroke="#DEDACE" strokeWidth="2" />
            <text x="40" y="52" textAnchor="middle" className="heading" fontSize="36" fill="#A83A23">
              {lifePathNumber}
            </text>
            <text x="100" y="36" className="mono" fontSize="11" fill="#6A6459" letterSpacing="1.5">
              CAMINO DE VIDA
            </text>
            <text x="100" y="58" className="heading" fontSize="18" fill="#1D1B17">
              {lifePathName}
            </text>
          </g>

          {/* Cifra 2: Vibración Base */}
          <g transform="translate(340, 0)">
            <circle cx="40" cy="40" r="40" fill="#F7F4EE" stroke="#DEDACE" strokeWidth="2" />
            <text x="40" y="52" textAnchor="middle" className="heading" fontSize="36" fill="#A83A23">
              {vibracionBase}
            </text>
            <text x="100" y="36" className="mono" fontSize="11" fill="#6A6459" letterSpacing="1.5">
              VIBRACIÓN BASE
            </text>
            <text x="100" y="58" className="heading" fontSize="18" fill="#1D1B17">
              Día {birthDay}
            </text>
          </g>

          {/* Cifra 3: Año Personal */}
          <g transform="translate(640, 0)">
            <circle cx="40" cy="40" r="40" fill="#F7F4EE" stroke="#DEDACE" strokeWidth="2" />
            <text x="40" y="52" textAnchor="middle" className="heading" fontSize="36" fill="#A83A23">
              {anoPersonal}
            </text>
            <text x="100" y="36" className="mono" fontSize="11" fill="#6A6459" letterSpacing="1.5">
              AÑO PERSONAL
            </text>
            <text x="100" y="58" className="heading" fontSize="18" fill="#1D1B17">
              Ciclo {currentYear}
            </text>
          </g>
        </g>

        {/* 6. BLOQUE 1: NUMEROLOGÍA */}
        <g transform="translate(100, 400)">
          <rect width="880" height="230" fill="#EFEAE0" stroke="#DEDACE" strokeWidth="1.5" rx="14" />
          <rect x="0" y="0" width="8" height="230" fill="#A83A23" rx="4" />

          <text x="40" y="44" className="mono" fontSize="14" fill="#A83A23" letterSpacing="3">
            PILAR I · NUMEROLOGÍA PITAGÓRICA
          </text>
          <text x="40" y="88" className="heading" fontSize="28" fill="#1D1B17">
            Camino de Vida {lifePathNumber} — {lifePathName}
          </text>
          <text x="40" y="126" className="serif" fontSize="22" fill="#6A6459">
            Estructura base del desarrollo personal y misión de ciclo
          </text>

          <text x="40" y="185" className="mono" fontSize="15" fill="#6A6459">
            Reducción determinista: {lifePathFormula}
          </text>

          <PillarMedallion color="#A83A23">
            <LifePathGlyph value={lifePathNumber} size={104} />
          </PillarMedallion>
        </g>

        {/* 7. BLOQUE 2: ZODÍACO CHINO */}
        <g transform="translate(100, 690)">
          <rect width="880" height="230" fill="#EFEAE0" stroke="#DEDACE" strokeWidth="1.5" rx="14" />
          <rect x="0" y="0" width="8" height="230" fill="#A83A23" rx="4" />

          <text x="40" y="44" className="mono" fontSize="14" fill="#1D1B17" letterSpacing="3">
            PILAR II · ZODÍACO CHINO
          </text>
          <text x="40" y="88" className="heading" fontSize="28" fill="#1D1B17">
            Signo de Origen: {chineseSign}
          </text>
          <text x="40" y="126" className="serif" fontSize="22" fill="#6A6459">
            Rama terrestre exacta calculada por Año Nuevo Lunar
          </text>

          <text x="40" y="185" className="mono" fontSize="15" fill="#6A6459">
            Ciclo sexagesimal de resonancia temporal
          </text>

          {/* La silueta del signo, no el ideograma: se lee de un vistazo. */}
          <PillarMedallion color="#A83A23">
            <ZodiacAnimalIcon animal={chineseSign} size={104} />
          </PillarMedallion>
          <text x="770" y="205" textAnchor="middle" className="mono" fontSize="15" fill="#6A6459">
            {chineseBranch}
          </text>
        </g>

        {/* 8. BLOQUE 3: ASTROLOGÍA */}
        <g transform="translate(100, 980)">
          <rect width="880" height="230" fill="#EFEAE0" stroke="#DEDACE" strokeWidth="1.5" rx="14" />
          <rect x="0" y="0" width="8" height="230" fill="#A83A23" rx="4" />

          <text x="40" y="44" className="mono" fontSize="14" fill="#6A6459" letterSpacing="3">
            PILAR III · ASTROLOGÍA SIMBÓLICA
          </text>
          <text x="40" y="88" className="heading" fontSize="28" fill="#1D1B17">
            Sol en {solarSign}
          </text>
          <text x="40" y="126" className="serif" fontSize="22" fill="#6A6459">
            Modalidad y cualidad elemental: {solarElement}
          </text>

          <text x="40" y="185" className="mono" fontSize="15" fill="#6A6459">
            Coordenada solar geocéntrica de nacimiento
          </text>

          <PillarMedallion color="#A83A23" box={116}>
            <AstrologySignIcon sign={solarSign} size={116} />
          </PillarMedallion>
        </g>

        {/* 9. BLOQUE 4: MAPA DE AFINIDADES CATEGÓRICAS */}
        <g transform="translate(100, 1270)">
          <rect width="880" height="340" fill="#EFEAE0" stroke="#DEDACE" strokeWidth="1.5" rx="14" />

          <text x="40" y="44" className="mono" fontSize="14" fill="#A83A23" letterSpacing="3">
            VECTORES DE AFINIDAD DEL ZODÍACO (三合 / 六冲)
          </text>

          {/* Dos Amigos (San He) */}
          <g transform="translate(40, 80)">
            <text y="0" className="heading" fontSize="19" fill="#1D1B17">
              Tus Dos Amigos (San He · 三合)
            </text>
            <text y="36" className="serif" fontSize="26" fill="#1D1B17">
              {chineseAffinityFriends}
            </text>

            <text y="68" className="mono" fontSize="13" fill="#6A6459">
              Resonancia natural y fluidez en vínculos
            </text>
            {/* Mismo tamaño de caja para los tres animales del bloque y mismo
                borde derecho, para que la fila se lea como una serie. */}
            <g transform="translate(496, -34)" style={{ color: "#1D1B17" }}>
              {splitSigns(chineseAffinityFriends)
                .slice(0, 2)
                .map((sign, i) => (
                  <g key={sign} transform={`translate(${i * 112}, 0)`}>
                    <ZodiacAnimalIcon animal={sign} size={96} />
                  </g>
                ))}
            </g>
          </g>

          <line x1="40" y1="195" x2="840" y2="195" stroke="#DEDACE" strokeWidth="1.5" />

          {/* Un Opuesto (Liu Chong) */}
          <g transform="translate(40, 235)">
            <text y="0" className="heading" fontSize="19" fill="#A83A23">
              Tu Energía Opuesta (Liu Chong · 六冲)
            </text>
            <text y="36" className="serif" fontSize="24" fill="#A83A23">
              {chineseAffinityClash}
            </text>
            <g transform="translate(608, -36)" style={{ color: "#A83A23" }}>
              <ZodiacAnimalIcon animal={chineseAffinityClash} size={96} />
            </g>
            <text y="66" className="mono" fontSize="13" fill="#6A6459">
              Tensión estructural que requiere atención consciente
            </text>
          </g>
        </g>

        {/* 10. FOOTER Y FIRMA EDITORIAL */}
        <g transform="translate(100, 1700)">
          <line x1="0" y1="0" x2="880" y2="0" stroke="#DEDACE" strokeWidth="1" />
          <text y="40" className="mono" fontSize="13" fill="#6A6459" letterSpacing="2">
            CÁLCULO 100% LOCAL · DETERMINISTA · PRIVACIDAD ABSOLUTA
          </text>

        </g>

        {/* 11. MARCA DE AGUA EN ESQUINA INFERIOR DERECHA (opacity="0.3") */}
        <g transform="translate(940, 1800)" opacity="0.3" textAnchor="end">
          <text className="mono" fontSize="11" fill="#6A6459" letterSpacing="2">
            GENERADO LOCALMENTE
          </text>
          <text y="18" className="mono" fontSize="11" fill="#6A6459" letterSpacing="2">
            SIN BASE DE DATOS
          </text>
        </g>
      </g>
    </svg>
  );
}
