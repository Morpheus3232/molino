"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { INTENTION_OPTIONS, ARCHETYPES } from "@/lib/data";
import { calculateLifePath } from "@/lib/engines/numerologyEngine";
import { UserProfile, saveProfile } from "@/lib/utils";
import ArchetypeHero from "./ArchetypeHero";
import EnergyBars from "./EnergyBars";
import { getEnergyBars } from "@/lib/utils";

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [intention, setIntention] = useState("");
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const lifePath = day && month && year
    ? calculateLifePath(`${year}-${String(month).padStart(2, '0')}-${String(parseInt(day)).padStart(2, '0')}`)
    : null;
  const archetype = lifePath ? ARCHETYPES[lifePath] : null;

  const handleComplete = () => {
    if (!lifePath || !intention) return;
    const profile: UserProfile = {
      name: name || "Explorador",
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
      intention,
      lifePath,
    };
    saveProfile(profile);
    onComplete(profile);
  };

  const canProceed = () => {
    if (step === 0) return !!intention;
    if (step === 1) return !!day && !!month && !!year && parseInt(year) > 1900;
    return true;
  };

  return (
    <div className="flex min-h-screen flex-col px-5 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-gray-800" />
          <span className="font-serif text-lg font-semibold">Molino</span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-gray-900" : i < step ? "w-1.5 bg-gray-400" : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
              ¿Qué querés explorar?
            </h1>
            <p className="text-gray-500 mb-8 text-sm">
              Molino te ayuda a descubrir patrones personales a través de marcos simbólicos.
            </p>

            <div className="space-y-3">
              {INTENTION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setIntention(option.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition ${
                    intention === option.id
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-white border border-gray-100 shadow-sm hover:border-gray-200"
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
              ¿Cuándo naciste?
            </h1>
            <p className="text-gray-500 mb-8 text-sm">
              Tu fecha de nacimiento es el punto de partida para explorar tu identidad.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tu nombre (opcional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm focus:border-gray-400 focus:outline-none shadow-sm"
              />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">Día</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-center focus:border-gray-400 focus:outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">Mes</label>
                  <input
                    type="number"
                    placeholder="12"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-center focus:border-gray-400 focus:outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">Año</label>
                  <input
                    type="number"
                    placeholder="1995"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-center focus:border-gray-400 focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs text-gray-400 text-center">
              Sin registro. Sin compromiso. Solo exploración.
            </p>
          </motion.div>
        )}

        {step === 2 && archetype && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <ArchetypeHero archetype={archetype} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 rounded-2xl bg-white p-5 shadow-lg border border-black/[0.06]"
            >
              <p className="text-sm leading-relaxed text-gray-600 mb-4">
                {archetype.description}
              </p>
              <EnergyBars bars={getEnergyBars(lifePath!)} color={archetype.color} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 text-center text-xs text-gray-400"
            >
              Esto es un marco simbólico para reflexión, no una predicción.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <button
          onClick={() => {
            if (step < 2) setStep(step + 1);
            else handleComplete();
          }}
          disabled={!canProceed()}
          className="flex flex-1 h-12 items-center justify-center gap-2 rounded-2xl bg-gray-900 text-white font-medium transition hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step === 2 ? "Explorar mi identidad" : "Continuar"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
