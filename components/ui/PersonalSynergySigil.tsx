"use client";

import React, { useMemo } from "react";
import { calculateLifePath } from "@/lib/calculations";

export interface PersonalSynergySigilProps {
  /** Fecha YYYY-MM-DD o formato estándar para Persona A */
  dateA: string;
  /** Fecha YYYY-MM-DD o formato estándar para Persona B */
  dateB: string;
  nameA?: string;
  nameB?: string;
  width?: number;
  height?: number;
  className?: string;
  showLegend?: boolean;
  color?: string;
}

interface ParsedDateData {
  day: number;
  month: number;
  year: number;
  lifePath: number;
}

function parseDateValues(dateStr: string, defaultDay = 1, defaultMonth = 1, defaultYear = 1990): ParsedDateData {
  if (!dateStr) {
    return {
      day: defaultDay,
      month: defaultMonth,
      year: defaultYear,
      lifePath: calculateLifePath(defaultDay, defaultMonth, defaultYear),
    };
  }

  const parts = dateStr.split(/[-/.]/).map(Number);
  let year = defaultYear;
  let month = defaultMonth;
  let day = defaultDay;

  if (parts.length === 3) {
    if (parts[0] > 31) {
      // YYYY-MM-DD
      year = parts[0] || defaultYear;
      month = parts[1] || defaultMonth;
      day = parts[2] || defaultDay;
    } else {
      // DD-MM-YYYY
      day = parts[0] || defaultDay;
      month = parts[1] || defaultMonth;
      year = parts[2] || defaultYear;
    }
  }

  const lifePath = calculateLifePath(day, month, year);
  return { day, month, year, lifePath };
}

/**
 * PersonalSynergySigil — Sello Determinístico de Sinergia y Patrón de Interferencia
 *
 * Superpone dos sellos personales y calcula matemáticamente las zonas de:
 * 1. Resonancia (puntos nodales armónicos en fase)
 * 2. Tensión / Alta Interferencia (arcos de corte de fase arquetípica)
 * 3. Afinidad Natural (envoltura armónica continua de baja interferencia)
 */
export default function PersonalSynergySigil({
  dateA,
  dateB,
  nameA,
  nameB,
  width = 640,
  height = 640,
  className = "",
  showLegend = true,
  color = "inherit",
}: PersonalSynergySigilProps) {
  const dataA = useMemo(() => parseDateValues(dateA, 15, 3, 1990), [dateA]);
  const dataB = useMemo(() => parseDateValues(dateB, 22, 7, 1988), [dateB]);

  const geometry = useMemo(() => {
    const cx = width / 2;
    const cy = height / 2;
    const offset = Math.min(width, height) * 0.08; // Distancia entre polos A y B

    const centerA = { x: cx - offset, y: cy };
    const centerB = { x: cx + offset, y: cy };

    // Parámetros de onda de A
    const ringsA = Math.max(4, Math.min(7, (dataA.lifePath % 5) + 4));
    const wavesA = Math.max(3, (dataA.day % 7) + 3);
    const ampA = 8 + (dataA.month % 6) * 3;
    const baseSpacingA = (Math.min(width, height) * 0.36) / ringsA;

    // Parámetros de onda de B
    const ringsB = Math.max(4, Math.min(7, (dataB.lifePath % 5) + 4));
    const wavesB = Math.max(3, (dataB.day % 7) + 3);
    const ampB = 8 + (dataB.month % 6) * 3;
    const baseSpacingB = (Math.min(width, height) * 0.36) / ringsB;

    // 1. Trazos Sello A
    const pathsA: string[] = [];
    for (let r = 1; r <= ringsA; r++) {
      const radius = r * baseSpacingA;
      const points: string[] = [];
      const steps = 96;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const offsetWave = Math.sin(theta * wavesA + r * 0.8) * ampA;
        const curR = radius + offsetWave;
        const x = centerA.x + Math.cos(theta) * curR;
        const y = centerA.y + Math.sin(theta) * curR;
        if (i === 0) points.push(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
        else points.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      points.push("Z");
      pathsA.push(points.join(" "));
    }

    // 2. Trazos Sello B
    const pathsB: string[] = [];
    for (let r = 1; r <= ringsB; r++) {
      const radius = r * baseSpacingB;
      const points: string[] = [];
      const steps = 96;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const offsetWave = Math.sin(theta * wavesB + r * 0.8) * ampB;
        const curR = radius + offsetWave;
        const x = centerB.x + Math.cos(theta) * curR;
        const y = centerB.y + Math.sin(theta) * curR;
        if (i === 0) points.push(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
        else points.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      points.push("Z");
      pathsB.push(points.join(" "));
    }

    // 3. Zonas de Tensión / Alta Interferencia (Arcos de corte cruzado)
    const tensionArcs: string[] = [];
    const tensionCount = Math.max(3, Math.min(8, Math.abs(dataA.lifePath - dataB.lifePath) + 3));
    for (let k = 0; k < tensionCount; k++) {
      const angle = (k / tensionCount) * Math.PI * 2 + (dataA.day * 0.05);
      const spanR = Math.min(width, height) * 0.28;
      const startX = centerA.x + Math.cos(angle) * (spanR * 0.6);
      const startY = centerA.y + Math.sin(angle) * (spanR * 0.6);
      const endX = centerB.x + Math.cos(angle + Math.PI * 0.4) * (spanR * 0.6);
      const endY = centerB.y + Math.sin(angle + Math.PI * 0.4) * (spanR * 0.6);
      const ctrlX = cx + Math.sin(angle * 2) * 35;
      const ctrlY = cy + Math.cos(angle * 2) * 35;
      tensionArcs.push(`M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`);
    }

    // 4. Puntos Nodales de Resonancia (Frecuencias que refuerzan fase)
    const resonanceNodes: { x: number; y: number; r: number }[] = [];
    const nodeCount = Math.max(6, ((dataA.lifePath + dataB.lifePath) % 8) + 6);
    const lensRadius = Math.min(width, height) * 0.32;

    for (let i = 0; i < nodeCount; i++) {
      const phi = (i / nodeCount) * Math.PI * 2;
      const waveMod = Math.sin(phi * (wavesA + wavesB) * 0.5);
      const dist = lensRadius * (0.35 + 0.55 * Math.abs(waveMod));
      const nx = cx + Math.cos(phi) * dist * 0.85;
      const ny = cy + Math.sin(phi) * dist;
      const size = 2.5 + Math.abs(Math.sin(phi * 3)) * 2;
      resonanceNodes.push({ x: nx, y: ny, r: size });
    }

    // 5. Envoltura de Afinidad Natural (Óvalo armónico de baja interferencia)
    const affinityEnvelope: string[] = [];
    const envSteps = 64;
    const aRadius = Math.min(width, height) * 0.42;
    for (let i = 0; i <= envSteps; i++) {
      const t = (i / envSteps) * Math.PI * 2;
      // Curva armónica de Cassini / Vesica modulada
      const rMod = aRadius * (1 + 0.08 * Math.cos(2 * t) + 0.04 * Math.sin((wavesA - wavesB) * t));
      const ex = cx + Math.cos(t) * rMod * 1.06;
      const ey = cy + Math.sin(t) * rMod * 0.94;
      if (i === 0) affinityEnvelope.push(`M ${ex.toFixed(1)} ${ey.toFixed(1)}`);
      else affinityEnvelope.push(`L ${ex.toFixed(1)} ${ey.toFixed(1)}`);
    }
    affinityEnvelope.push("Z");

    return {
      cx,
      cy,
      centerA,
      centerB,
      pathsA,
      pathsB,
      tensionArcs,
      resonanceNodes,
      affinityEnvelope: affinityEnvelope.join(" "),
    };
  }, [dataA, dataB, width, height]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="w-full h-auto max-w-full"
        style={{
          color: color !== "inherit" ? color : undefined,
          fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
        }}
        role="img"
        aria-label={`Sello de sinergia entre ${nameA || "Persona A"} y ${nameB || "Persona B"}`}
      >
        <defs>
          <filter id="sigilGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Guías sutiles de campo central */}
        <g stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" fill="none">
          <circle cx={geometry.cx} cy={geometry.cy} r={Math.min(width, height) * 0.2} strokeDasharray="3 6" />
          <circle cx={geometry.cx} cy={geometry.cy} r={Math.min(width, height) * 0.35} strokeDasharray="4 8" />
          <line x1={geometry.cx} y1={20} x2={geometry.cx} y2={height - 20} strokeDasharray="2 6" strokeOpacity="0.05" />
        </g>

        {/* 2. Envoltura de Afinidad Natural (Baja Interferencia) */}
        <path
          d={geometry.affinityEnvelope}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />

        {/* 3. Sello Persona A (Capa Inferior / Izquierda) */}
        <g stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.4" fill="none">
          {geometry.pathsA.map((d, i) => (
            <path key={`sigil-a-${i}`} d={d} />
          ))}
          <circle cx={geometry.centerA.x} cy={geometry.centerA.y} r="4" fill="currentColor" opacity="0.6" />
        </g>

        {/* 4. Sello Persona B (Capa Superior / Derecha) */}
        <g stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.4" fill="none">
          {geometry.pathsB.map((d, i) => (
            <path key={`sigil-b-${i}`} d={d} />
          ))}
          <circle cx={geometry.centerB.x} cy={geometry.centerB.y} r="4" fill="currentColor" opacity="0.6" />
        </g>

        {/* 5. Zonas de Tensión / Alta Interferencia (Arcos Terracota) */}
        <g stroke="#A83A23" strokeWidth="2.2" strokeOpacity="0.8" fill="none" strokeLinecap="round">
          {geometry.tensionArcs.map((d, i) => (
            <path key={`tension-${i}`} d={d} />
          ))}
        </g>

        {/* 6. Zonas de Resonancia (Puntos Dorados en Fase) */}
        <g fill="#F5B022">
          {geometry.resonanceNodes.map((node, i) => (
            <g key={`res-${i}`}>
              <circle cx={node.x} cy={node.y} r={node.r * 1.8} fill="#F5B022" opacity="0.25" />
              <circle cx={node.x} cy={node.y} r={node.r} fill="#F5B022" opacity="0.9" />
            </g>
          ))}
        </g>

        {/* 7. Nodo central de conexión */}
        <circle cx={geometry.cx} cy={geometry.cy} r="5" fill="#F5B022" />
        <circle cx={geometry.cx} cy={geometry.cy} r="9" fill="none" stroke="#F5B022" strokeWidth="1.5" strokeOpacity="0.5" />
      </svg>

      {/* 8. Leyenda Mínima de Visualización */}
      {showLegend && (
        <div className="mt-3 flex items-center justify-center gap-5 sm:gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-current opacity-40 inline-block" />
            <span>Afinidad</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A83A23] inline-block" />
            <span className="text-foreground">Tensión</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5B022] inline-block" />
            <span className="text-foreground">Resonancia</span>
          </div>
        </div>
      )}
    </div>
  );
}
