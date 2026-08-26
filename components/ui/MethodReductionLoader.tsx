"use client";

import React, { useEffect, useMemo, useState } from "react";
import { calculateLifePath, getPersonalYear } from "@/lib/calculations";
import { calculateBirthDayReduction, ARCHETYPE_DESCRIPTIONS } from "@/lib/engines/numerologyEngine";

export interface MethodReductionLoaderProps {
  /** Formato YYYY-MM-DD */
  birthDate: string;
  /** Callback disparado al finalizar la secuencia animada (3.2s a 3.6s) */
  onComplete?: () => void;
  /** Año para calcular el Año Personal (default año actual) */
  targetYear?: number;
  className?: string;
}

interface StepDetail {
  formula: string;
  reduced: string;
  result: number;
  label: string;
  name?: string;
}

export function computeTheosophicalSteps(birthDate: string, targetYear = new Date().getFullYear()) {
  const [yearStr, monthStr, dayStr] = (birthDate || "1990-01-01").split("-");
  const day = parseInt(dayStr, 10) || 1;
  const month = parseInt(monthStr, 10) || 1;
  const year = parseInt(yearStr, 10) || 1990;

  // 1. Camino de Vida
  const digits = `${yearStr}${monthStr}${dayStr}`.replace(/\D/g, "").split("").map(Number);
  const firstSum = digits.reduce((a, b) => a + b, 0);
  const lifePath = calculateLifePath(day, month, year);

  let lifePathFormula = `${digits.join(" + ")} = ${firstSum}`;
  let lifePathReduced = "";
  if (firstSum !== lifePath) {
    const parts = String(firstSum).split("").map(Number);
    lifePathReduced = `${parts.join(" + ")} = ${lifePath}`;
  }

  const archetype = ARCHETYPE_DESCRIPTIONS[lifePath]?.name || `Arquetipo ${lifePath}`;

  const lifePathStep: StepDetail = {
    label: "CAMINO DE VIDA",
    formula: lifePathFormula,
    reduced: lifePathReduced,
    result: lifePath,
    name: archetype,
  };

  // 2. Vibración Base (Día de nacimiento)
  const baseReduction = calculateBirthDayReduction(day);
  const baseDayParts = String(day).split("").map(Number);
  let baseFormula = `Día ${day}`;
  let baseReduced = "";
  if (baseDayParts.length > 1 && !baseReduction.isMaster) {
    baseFormula = `Día ${day} → ${baseDayParts.join(" + ")} = ${baseReduction.finalValue}`;
  }

  const baseStep: StepDetail = {
    label: "VIBRACIÓN BASE",
    formula: baseFormula,
    reduced: baseReduced,
    result: baseReduction.finalValue,
    name: `Natalicio ${day}`,
  };

  // 3. Año Personal
  const personalYear = getPersonalYear(day, month, year, targetYear);
  const yearParts = String(targetYear).split("").map(Number);
  const personalYearFormula = `${day} + ${month} + ${targetYear} → Ciclo ${personalYear}`;

  const personalYearStep: StepDetail = {
    label: "AÑO PERSONAL",
    formula: personalYearFormula,
    reduced: `Tránsito ${targetYear}`,
    result: personalYear,
    name: `Ciclo Anual ${personalYear}`,
  };

  return {
    lifePath: lifePathStep,
    vibracionBase: baseStep,
    anoPersonal: personalYearStep,
  };
}

export default function MethodReductionLoader({
  birthDate,
  onComplete,
  targetYear = new Date().getFullYear(),
  className = "",
}: MethodReductionLoaderProps) {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const steps = useMemo(
    () => computeTheosophicalSteps(birthDate, targetYear),
    [birthDate, targetYear]
  );

  // Detección de preferencia de movimiento reducido
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Progresión temporal sincronizada de la reducción teosófica
  useEffect(() => {
    if (prefersReducedMotion) {
      // Si el usuario prefiere movimiento reducido, concluir de inmediato
      const quickTimer = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(quickTimer);
    }

    const t1 = setTimeout(() => setStage(1), 1200);
    const t2 = setTimeout(() => setStage(2), 2200);
    const t3 = setTimeout(() => {
      setStage(3);
      onComplete?.();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete, prefersReducedMotion]);

  const currentStep =
    stage === 0 ? steps.lifePath : stage === 1 ? steps.vibracionBase : steps.anoPersonal;

  return (
    <div
      className={`relative w-full max-w-lg mx-auto p-6 sm:p-8 bg-paper border border-border rounded-xl shadow-lg text-ink overflow-hidden select-none ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <style>{`
        @keyframes flip-in {
          0% {
            transform: translateY(14px) scale(0.92);
            opacity: 0;
            filter: blur(2px);
          }
          60% {
            transform: translateY(-2px) scale(1.02);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }
        @keyframes formula-slide {
          0% {
            transform: translateY(6px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-flip-num {
          display: inline-block;
          animation: flip-in 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-formula-fade {
          animation: formula-slide 0.32s ease-out forwards;
        }
      `}</style>

      {/* Screen Reader solo: descripción completa accesible */}
      <div className="sr-only">
        Calculando mapa con reducción teosófica para {birthDate}. Camino de Vida {steps.lifePath.result} ({steps.lifePath.name}), Vibración Base {steps.vibracionBase.result}, Año Personal {steps.anoPersonal.result}.
      </div>

      {/* Header técnico de transparencia local */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            REDUCCIÓN TEOSÓFICA LOCAL
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-accent">
          Paso {Math.min(stage + 1, 3)} / 3
        </span>
      </div>

      {/* Visor central del cálculo en vivo */}
      <div className="min-h-[170px] flex flex-col justify-center items-center text-center">
        {/* Label de la fase actual */}
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-3">
          {currentStep.label}
        </p>

        {/* Número grande con efecto flip CSS puro */}
        <div className="my-1">
          <span
            key={`num-${stage}-${currentStep.result}`}
            className="font-heading text-6xl sm:text-7xl font-bold text-accent leading-none animate-flip-num"
          >
            {currentStep.result}
          </span>
        </div>

        {/* Nombre / Arquetipo */}
        <p
          key={`name-${stage}-${currentStep.name}`}
          className="font-display italic text-xl sm:text-2xl text-ink mt-2 mb-3 animate-formula-fade"
        >
          {currentStep.name}
        </p>

        {/* Fórmula desglosada */}
        <div
          key={`formula-${stage}-${currentStep.formula}`}
          className="font-mono text-xs sm:text-sm text-muted bg-paper-alt py-1.5 px-3.5 rounded-md border border-border animate-formula-fade max-w-full overflow-x-auto"
        >
          {currentStep.formula}
          {currentStep.reduced ? ` → ${currentStep.reduced}` : ""}
        </div>
      </div>

      {/* Barra de progreso inferior */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between items-center text-[11px] font-mono text-muted mb-2">
          <span>{stage >= 2 ? "Consolidando mapa…" : "Calculando matrices…"}</span>
          <span>{stage === 0 ? "33%" : stage === 1 ? "66%" : "100%"}</span>
        </div>
        <div className="w-full h-1.5 bg-paper-alt rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
            style={{ width: stage === 0 ? "33%" : stage === 1 ? "66%" : "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
