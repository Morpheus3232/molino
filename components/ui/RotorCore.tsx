"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const HUB = { x: 200, y: 200 };
const BLADE_D = "M0,0 L-6,-6 L-8,-22 L-4,-40 L0,-56 L4,-40 L8,-22 L6,-6 Z";

function Blade({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${angle})`}>
      <path
        d={BLADE_D}
        fill="none"
        stroke="var(--color-paper, #F7F4EE)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d={BLADE_D} fill="currentColor" stroke="none" />
      <line x1="-6" y1="-6" x2="6" y2="-6" stroke="var(--color-paper, #F7F4EE)" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="-8" y1="-22" x2="8" y2="-22" stroke="var(--color-paper, #F7F4EE)" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="-4" y1="-40" x2="4" y2="-40" stroke="var(--color-paper, #F7F4EE)" strokeWidth="0.8" strokeOpacity="0.5" />
    </g>
  );
}

interface RotorCoreProps {
  /** 0-1: qué tan llena está la fecha (8 dígitos) */
  fillProgress: number;
  /** true cuando se está enviando el formulario */
  isSubmitting: boolean;
  /** true cuando la fecha es válida completa */
  isComplete: boolean;
}

export default function RotorCore({ fillProgress, isSubmitting, isComplete }: RotorCoreProps) {
  const reduceMotion = useReducedMotion();
  const [windPhase, setWindPhase] = useState<"idle" | "gathering" | "spinning" | "revealed">("idle");
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // progressRef removed - not needed
  }, [fillProgress]);

  useEffect(() => {
    if (reduceMotion) {
      setWindPhase(isSubmitting ? "spinning" : isComplete ? "revealed" : "idle");
      return;
    }

    if (isSubmitting) {
      setWindPhase("spinning");
      return;
    }

    if (isComplete) {
      setWindPhase("revealed");
      return;
    }

    // Progresión basada en fillProgress
    if (fillProgress >= 1) {
      setWindPhase("gathering");
    } else if (fillProgress > 0.5) {
      setWindPhase("gathering");
    } else if (fillProgress > 0) {
      setWindPhase("gathering");
    } else {
      setWindPhase("idle");
    }
  }, [fillProgress, isSubmitting, isComplete, reduceMotion]);

  const getRotorStyle = () => {
    const baseStyle: React.CSSProperties = {
      transformOrigin: `${HUB.x}px ${HUB.y}px`,
      willChange: "transform",
    };

    if (reduceMotion) {
      return {
        ...baseStyle,
        animation: "none",
        transform: windPhase === "spinning" || windPhase === "gathering" ? "rotate(0deg)" : "rotate(0deg)",
      };
    }

    switch (windPhase) {
      case "spinning":
        return {
          ...baseStyle,
          animation: "molino-rotor-spin 0.6s linear infinite",
        };
      case "gathering":
        return {
          ...baseStyle,
          animation: "molino-rotor-spin 2.8s cubic-bezier(0.16, 0.84, 0.44, 1) infinite",
        };
      case "revealed":
        return {
          ...baseStyle,
          animation: "none",
          transform: "rotate(0deg)",
        };
      default:
        return {
          ...baseStyle,
          animation: "none",
          transform: "rotate(0deg)",
        };
    }
  };

  const getSweepStyle = () => {
    if (reduceMotion) return { display: "none" };

    switch (windPhase) {
      case "spinning":
        return {
          animation: "molino-sweep-spin 0.6s linear infinite",
          opacity: 0.6,
        };
      case "gathering":
        return {
          animation: "molino-sweep-spin 2.8s cubic-bezier(0.16, 0.84, 0.44, 1) infinite",
          opacity: 0.35,
        };
      default:
        return {
          animation: "none",
          opacity: 0,
        };
    }
  };

  const getFlowStyle = () => {
    if (reduceMotion) return { display: "none" };

    const baseOpacity = windPhase === "spinning" ? 0.4 : windPhase === "gathering" ? 0.2 : 0.08;
    return {
      animation: `molino-flow-drift ${windPhase === "spinning" ? 3 : 8}s linear infinite`,
      opacity: baseOpacity,
    };
  };

  const getHaloStyle = () => {
    if (reduceMotion) return { opacity: 0 };

    switch (windPhase) {
      case "spinning":
        return { opacity: 0.35 };
      case "gathering":
        return { opacity: 0.2 };
      case "revealed":
        return { opacity: 0.15 };
      default:
        return { opacity: 0.05 };
    }
  };

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      className="w-[min(48vh,480px)] h-[min(48vh,480px)]"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 0 40px rgba(154, 74, 24, 0.08))" }}
    >
      {/* Anillos concéntricos de detección */}
      {[60, 110, 160, 210].map((r, i) => (
        <circle
          key={r}
          cx={HUB.x}
          cy={HUB.y}
          r={r}
          stroke="var(--color-accent)"
          strokeOpacity={windPhase === "spinning" ? 0.15 * (1 + i * 0.3) : windPhase === "gathering" ? 0.08 * (1 + i * 0.3) : 0.04 * (1 + i * 0.3)}
          strokeWidth={1}
          style={{
            transformOrigin: `${HUB.x}px ${HUB.y}px`,
            animation: windPhase === "spinning" ? `molino-ring-pulse ${1.2 + i * 0.3}s easeInOut infinite` : "none",
          }}
        />
      ))}

      {/* Estaciones de los 8 dígitos - se activan con fillProgress */}
      {Array.from({ length: 8 }, (_, i) => i * 45).map((deg, i) => {
        const isActive = i < Math.round(fillProgress * 8);
        const x = HUB.x + 200 * Math.cos((deg * Math.PI) / 180);
        const y = HUB.y + 200 * Math.sin((deg * Math.PI) / 180);
        return (
          <motion.circle
            key={deg}
            cx={x}
            cy={y}
            r={isActive ? 3.5 : 2.5}
            stroke="var(--color-accent)"
            strokeOpacity={isActive ? (windPhase === "spinning" ? 0.7 : 0.5) : 0.12}
            strokeWidth={isActive ? 1.5 : 1}
            fill={isActive ? "var(--color-accent)" : "none"}
            fillOpacity={isActive ? 0.3 : 0}
            initial={false}
            animate={{
              r: isActive ? 3.5 : 2.5,
              strokeOpacity: isActive ? (windPhase === "spinning" ? 0.7 : 0.5) : 0.12,
              fillOpacity: isActive ? 0.3 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
          />
        );
      })}

      {/* Radios entre estaciones */}
      {Array.from({ length: 8 }, (_, i) => i * 45).map((deg) => {
        const x2 = HUB.x + 200 * Math.cos((deg * Math.PI) / 180);
        const y2 = HUB.y + 200 * Math.sin((deg * Math.PI) / 180);
        return (
          <line
            key={`spoke-${deg}`}
            x1={HUB.x}
            y1={HUB.y}
            x2={x2}
            y2={y2}
            stroke="var(--color-accent)"
            strokeOpacity={windPhase === "spinning" ? 0.08 : windPhase === "gathering" ? 0.04 : 0.02}
            strokeWidth="0.8"
            style={{
              transformOrigin: `${HUB.x}px ${HUB.y}px`,
              animation: windPhase === "spinning" ? "molino-spoke-pulse 1.4s easeInOut infinite" : "none",
            }}
          />
        );
      })}

      {/* Halo de viento detrás del rotor */}
      <motion.circle
        cx={HUB.x}
        cy={HUB.y}
        r={90}
        fill="var(--color-accent)"
        style={{
          filter: "blur(60px)",
          transformOrigin: `${HUB.x}px ${HUB.y}px`,
        }}
        initial={false}
        animate={getHaloStyle()}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Rodete central — el instrumento */}
      <g style={getRotorStyle()}>
        <g transform={`translate(${HUB.x} ${HUB.y})`}>
          {[0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <Blade angle={deg} />
            </g>
          ))}
          <circle cx={0} cy={0} r={6} stroke="var(--color-accent)" strokeOpacity={0.7} strokeWidth="1.2" />
          <circle cx={0} cy={0} r={3} fill="var(--color-accent)" />
        </g>
      </g>

      {/* Barrido de lectura */}
      <g style={{ ...getSweepStyle(), transformOrigin: `${HUB.x}px ${HUB.y}px` }}>
        <path
          d={`M${HUB.x},${HUB.y} L${HUB.x},${HUB.y - 210} A210,210 0 0 1 ${HUB.x + 148.5},${HUB.y - 148.5} Z`}
          fill="var(--color-accent)"
          fillOpacity={0.03}
        />
        <line
          x1={HUB.x}
          y1={HUB.y}
          x2={HUB.x}
          y2={HUB.y - 210}
          stroke="var(--color-accent)"
          strokeOpacity={0.6}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Líneas de flujo - el viento invisible */}
      {[
        { y: 120, w: 100, o: 1, dur: 10 },
        { y: 280, w: 120, o: 0.7, dur: 14 },
        { y: 320, w: 70, o: 0.5, dur: 8 },
      ].map((f, i) => (
        <motion.g key={i} style={getFlowStyle()}>
          <line
            x1={HUB.x - f.w}
            y1={f.y}
            x2={HUB.x + f.w}
            y2={f.y}
            stroke="var(--color-accent)"
            strokeOpacity={f.o * 0.15}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>
      ))}

      <style jsx>{`
        @keyframes molino-ring-pulse {
          0%, 100% { stroke-opacity: 0.08; }
          50% { stroke-opacity: 0.2; }
        }
        @keyframes molino-spoke-pulse {
          0%, 100% { stroke-opacity: 0.04; }
          50% { stroke-opacity: 0.12; }
        }
      `}</style>
    </svg>
  );
}