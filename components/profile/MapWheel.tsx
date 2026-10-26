"use client";

import { WESTERN_SIGNS } from "@/lib/data/facts/astrology-facts";
import { ANIMALS, type Animal } from "@/lib/data/animalRelations";
import { animalsByKind } from "@/lib/engines/personalMapEngine";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
import AstrologySignIcon from "@/components/ui/AstrologySignIcon";

/**
 * La rueda de tu mapa: los tres sistemas en un solo instrumento, como un
 * astrolabio. Afuera los 12 signos (el tuyo en tinta), en el medio los 12
 * animales chinos con el triángulo de amigos (三合) en bermellón y la línea
 * al opuesto (六冲), y en el centro el Camino de Vida.
 *
 * Todo es geometría real: el triángulo une los animales que están a cuatro
 * casillas y la línea cruza seis. Sin datos inventados ni decoración.
 */

const C = 300; // centro del viewBox 600×600
const R_OUT = 292;
const R_SIGN = 236;
const R_ANIMAL_OUT = 228;
const R_ANIMAL_IN = 148;
const R_CORE = 64;

/** Punto en el círculo: ángulo 0 = arriba, sentido horario. */
function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

/** Sector anular entre dos radios y dos ángulos. */
function sector(rIn: number, rOut: number, a0: number, a1: number) {
  const p0 = polar(rOut, a0);
  const p1 = polar(rOut, a1);
  const p2 = polar(rIn, a1);
  const p3 = polar(rIn, a0);
  return `M${p0.x},${p0.y} A${rOut},${rOut} 0 0 1 ${p1.x},${p1.y} L${p2.x},${p2.y} A${rIn},${rIn} 0 0 0 ${p3.x},${p3.y} Z`;
}

export type WheelPart = "sign" | "animal" | "trine" | "opposite" | "core";

export default function MapWheel({
  lifePath,
  sunSign,
  animal,
  highlight = null,
  className = "",
}: {
  lifePath: number;
  sunSign: string;
  animal: string;
  /** Parte que se quiere mostrar sola (la leyenda la marca al pasar o tocar). */
  highlight?: WheelPart | null;
  className?: string;
}) {
  // Con una parte elegida, el resto baja a un cuarto de opacidad.
  const dim = (part: WheelPart | WheelPart[]) => {
    if (!highlight) return undefined;
    const parts = Array.isArray(part) ? part : [part];
    return {
      opacity: parts.includes(highlight) ? 1 : 0.18,
      transition: "opacity 250ms ease",
    };
  };
  const signIndex = Math.max(
    0,
    WESTERN_SIGNS.indexOf(sunSign as (typeof WESTERN_SIGNS)[number]),
  );
  const animalIndex = ANIMALS.indexOf(animal as Animal);
  const kinds = animalIndex >= 0 ? animalsByKind(animal as Animal) : null;
  const friends = new Set(kinds?.amigo ?? []);
  const enemy = kinds?.enemigo[0];

  const rMid = (R_ANIMAL_OUT + R_ANIMAL_IN) / 2;
  const animalCenter = (i: number) => polar(rMid, i * 30 + 15);
  const trine = [animal, ...(kinds?.amigo ?? [])]
    .map((a) => ANIMALS.indexOf(a as Animal))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)
    .map((i) => polar(R_ANIMAL_IN - 4, i * 30 + 15));
  const enemyIndex = enemy ? ANIMALS.indexOf(enemy as Animal) : -1;
  const pFrom =
    animalIndex >= 0 ? polar(R_ANIMAL_IN - 4, animalIndex * 30 + 15) : null;
  const pTo =
    enemyIndex >= 0 ? polar(R_ANIMAL_IN - 4, enemyIndex * 30 + 15) : null;

  return (
    <figure className={className}>
      <svg
        viewBox="0 0 600 600"
        role="img"
        aria-label={`Rueda de tu mapa: Camino de Vida ${lifePath}, Sol en ${sunSign}, ${animal}${
          kinds
            ? `, con ${[...friends].join(" y ")} como amigos y ${enemy} como opuesto`
            : ""
        }.`}
        className="w-full h-auto text-foreground map-wheel"
      >
        {/* Anillo de los signos */}
        <g style={dim("sign")}>
          <g className="map-wheel-ring">
            <circle
              cx={C}
              cy={C}
              r={R_OUT}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
            />
            {WESTERN_SIGNS.map((s, i) => {
              const mine = i === signIndex;
              const pos = polar((R_OUT + R_SIGN) / 2, i * 30 + 15);
              return (
                <g key={s}>
                  {mine && (
                    <path
                      d={sector(R_SIGN, R_OUT, i * 30, i * 30 + 30)}
                      fill="currentColor"
                    />
                  )}
                  <line
                    {...(() => {
                      const a = polar(R_SIGN, i * 30);
                      const b = polar(R_OUT, i * 30);
                      return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
                    })()}
                    stroke="currentColor"
                    strokeOpacity={0.2}
                  />
                  <g
                    transform={`translate(${pos.x - 15},${pos.y - 15})`}
                    className={mine ? "text-paper" : "text-muted"}
                  >
                    <AstrologySignIcon sign={s} size={30} />
                  </g>
                </g>
              );
            })}
            <circle
              cx={C}
              cy={C}
              r={R_SIGN}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
            />
          </g>
        </g>

        {/* Anillo de los animales */}
        <g style={dim(["animal", "trine", "opposite"])}>
          <g className="map-wheel-ring map-wheel-ring--inner">
            <circle
              cx={C}
              cy={C}
              r={R_ANIMAL_OUT}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
            />
            {ANIMALS.map((a, i) => {
              const mine = i === animalIndex;
              const isFriend = friends.has(a);
              const pos = animalCenter(i);
              return (
                <g key={a}>
                  {mine && (
                    <path
                      d={sector(R_ANIMAL_IN, R_ANIMAL_OUT, i * 30, i * 30 + 30)}
                      fill="currentColor"
                    />
                  )}
                  <line
                    {...(() => {
                      const p = polar(R_ANIMAL_IN, i * 30);
                      const q = polar(R_ANIMAL_OUT, i * 30);
                      return { x1: p.x, y1: p.y, x2: q.x, y2: q.y };
                    })()}
                    stroke="currentColor"
                    strokeOpacity={0.2}
                  />
                  <g
                    transform={`translate(${pos.x - 19},${pos.y - 19})`}
                    className={
                      mine
                        ? "text-paper"
                        : isFriend
                          ? "text-vermilion"
                          : a === enemy
                            ? "text-foreground"
                            : "text-muted"
                    }
                  >
                    <ZodiacAnimalIcon animal={a} size={38} />
                  </g>
                </g>
              );
            })}
            <circle
              cx={C}
              cy={C}
              r={R_ANIMAL_IN}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
            />
          </g>
        </g>

        {/* Opuesto: línea punteada que cruza el centro */}
        {pFrom && pTo && (
          <line
            style={dim("opposite")}
            x1={pFrom.x}
            y1={pFrom.y}
            x2={pTo.x}
            y2={pTo.y}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="4 6"
            strokeOpacity={0.7}
          />
        )}

        {/* Triángulo de amigos */}
        {trine.length === 3 && (
          <polygon
            points={trine.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="text-vermilion map-wheel-trine"
            style={dim("trine")}
            pathLength={1}
          />
        )}

        {/* Centro: Camino de Vida */}
        <g style={dim("core")}>
          <circle
            cx={C}
            cy={C}
            r={R_CORE}
            className="fill-paper"
            stroke="currentColor"
            strokeOpacity={0.35}
          />
          <text
            x={C}
            y={C + 26}
            textAnchor="middle"
            className="fill-current font-display"
            style={{
              fontSize: lifePath > 9 ? 64 : 82,
              letterSpacing: "-0.02em",
            }}
          >
            {lifePath}
          </text>
        </g>
      </svg>
    </figure>
  );
}
