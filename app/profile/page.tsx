"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import { ZODIAC_SYMBOLS, ELEMENT_COLORS, ARCHETYPE_DESCRIPTIONS } from "@/lib/data/constants";
import { safeNumber } from "@/lib/utils/score";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { analyzeTiming } from "@/lib/engines/timingEngine";
import {
  buildPersonalCode,
  buildSynthesisInsights,
  buildPatterns,
  buildDimensions,
  buildMomentState,
} from "@/lib/engines/synthesisEngine";
import { buildIdentityProfile } from "@/lib/engines/perspectivesEngine";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import dynamic from "next/dynamic";
import ShareableCard from "@/components/profile/ShareableCard";
import LoadingState from "@/components/ui/LoadingState";

const ProfileRadar = dynamic(() => import("@/components/charts/ProfileRadar"), { ssr: false });

/* ═══════════════════════════════════════════════════════════════
   IDENTITY CONSTELLATION — SVG visualization of converging systems
   ═══════════════════════════════════════════════════════════════ */

type SystemNode = { id: string; label: string; detail: string; symbol: string; color: string; angle: number };

function IdentityConstellation({
  nodes,
  elementColor,
  activeNode,
  onNodeClick,
}: {
  nodes: SystemNode[];
  elementColor: string;
  activeNode: string | null;
  onNodeClick: (id: string | null) => void;
}) {
  const cx = 150;
  const cy = 150;
  const orbitR = 100;

  return (
    <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Center node */}
        <circle cx={cx} cy={cy} r="28" fill={elementColor} opacity="0.15" />
        <circle cx={cx} cy={cy} r="4" fill={elementColor} />

        {/* Orbit ring */}
        <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke="currentColor" opacity="0.08" strokeWidth="1" />

        {/* Connection lines to center */}
        {nodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + orbitR * Math.cos(rad);
          const ny = cy + orbitR * Math.sin(rad);
          const isActive = activeNode === node.id;
          return (
            <line
              key={`line-${node.id}`}
              x1={cx}
              y1={cy}
              x2={nx}
              y2={ny}
              stroke={isActive ? node.color : "currentColor"}
              strokeWidth={isActive ? 1.5 : 0.5}
              opacity={isActive ? 0.6 : 0.1}
              className="transition-all duration-300"
            />
          );
        })}

        {/* System nodes */}
        {nodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + orbitR * Math.cos(rad);
          const ny = cy + orbitR * Math.sin(rad);
          const isActive = activeNode === node.id;
          return (
            <g
              key={node.id}
              className="cursor-pointer transition-all duration-300"
              onClick={() => onNodeClick(isActive ? null : node.id)}
            >
              <circle
                cx={nx}
                cy={ny}
                r={isActive ? 22 : 16}
                fill={isActive ? node.color : "transparent"}
                stroke={node.color}
                strokeWidth={isActive ? 0 : 1}
                opacity={isActive ? 0.2 : 1}
                className="transition-all duration-300"
              />
              <text
                x={nx}
                y={ny + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isActive ? node.color : "currentColor"}
                fontSize={isActive ? "11" : "12"}
                className="transition-all duration-300"
              >
                {node.symbol}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROFILE CONTENT
   ═══════════════════════════════════════════════════════════════ */

function ProfileContent({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Extract data
  const lifePath = safeNumber(profile.lifePath, 1);
  const expressionNumber = safeNumber(profile.expressionNumber, 0);
  const soulNumber = safeNumber(profile.soulNumber, 0);
  const personalityNumber = safeNumber(profile.personalityNumber, 0);
  const name = typeof profile.name === "string" ? profile.name : "";
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const sunSignSymbol = ZODIAC_SYMBOLS[sunSign] || "\u2648";
  const element = typeof profile.element === "string" ? profile.element : "";
  const modality = typeof profile.modality === "string" ? profile.modality : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const chineseElement = typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const archetype = ARCHETYPES[lifePath];
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  // Engines
  const dailyEnergy = useMemo(() => calculateDailyEnergy(profile, new Date()), [profile]);
  const timing = useMemo(() => analyzeTiming(profile, new Date(), "start_project"), [profile]);
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);
  const personalMonth = safeNumber(profile.cycles?.personalMonth, 0);
  const personalDay = safeNumber(profile.cycles?.personalDay, 0);

  // Synthesis
  const personalCode = useMemo(() => buildPersonalCode(profile), [profile]);
  const synthesisInsights = useMemo(() => buildSynthesisInsights(profile), [profile]);
  const patterns = useMemo(() => buildPatterns(profile), [profile]);
  const dimensions = useMemo(() => buildDimensions(profile), [profile]);
  const momentState = useMemo(
    () => buildMomentState(profile, dailyEnergy.overallScore, dailyEnergy.theme),
    [profile, dailyEnergy]
  );
  const identityProfile = useMemo(() => buildIdentityProfile(profile), [profile]);

  // Constellation nodes
  const constellationNodes: SystemNode[] = useMemo(
    () => [
      { id: "numerologia", label: "Numerología", detail: `Life Path ${lifePath}`, symbol: `${lifePath}`, color: "var(--element-fire)", angle: 0 },
      { id: "astrologia", label: "Astrología", detail: `${sunSignSymbol} ${sunSign}`, symbol: sunSignSymbol, color: "var(--layer-astrology)", angle: 90 },
      { id: "zodiaco", label: "Zodiaco Chino", detail: `${chineseZodiac}`, symbol: chineseZodiac.charAt(0), color: "var(--layer-moment)", angle: 180 },
      { id: "arquetipo", label: "Arquetipo", detail: archetypeName || archetype?.name || "", symbol: archetypeName?.charAt(3) || "?", color: elementColor, angle: 270 },
    ],
    [lifePath, sunSign, sunSignSymbol, chineseZodiac, archetypeName, archetype, elementColor]
  );

  const activeNodeData = constellationNodes.find((n) => n.id === activeNode);

  const codeEntries = [
    personalCode.lifePath,
    personalCode.expression,
    personalCode.soul,
    personalCode.personality,
  ];
  const codeLabels = ["Life Path", "Expresión", "Alma", "Personalidad"];

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main id="main-content">

        {/* ═══════════════════════════════════════════════
            HERO — Tu Identidad
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:pt-20 pb-12 sm:pb-16">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...fadeUp}>
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Tu mapa</p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                {/* Left: name + archetype */}
                <div className="lg:col-span-7">
                  <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.05]">
                    {name}
                  </h1>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
                    <span>{birthDate}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{sunSignSymbol} {sunSign}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{element}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{chineseZodiac}</span>
                  </div>

                  {archetype && (
                    <div className="mt-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-px bg-border" aria-hidden="true" />
                        <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu arquetipo</p>
                      </div>
                      <p className="font-serif text-2xl sm:text-3xl font-semibold" style={{ color: elementColor }}>{archetype.name}</p>
                      {archetype.quote && (
                        <p className="text-base text-muted mt-3 italic max-w-lg">&ldquo;{archetype.quote}&rdquo;</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: constellation */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <IdentityConstellation
                    nodes={constellationNodes}
                    elementColor={elementColor}
                    activeNode={activeNode}
                    onNodeClick={setActiveNode}
                  />

                  <AnimatePresence mode="wait">
                    {activeNodeData && (
                      <motion.div
                        key={activeNodeData.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-6 text-center max-w-[280px]"
                      >
                        <p className="text-[11px] uppercase tracking-[0.2em] font-medium mb-1" style={{ color: activeNodeData.color }}>
                          {activeNodeData.label}
                        </p>
                        <p className="font-serif text-xl font-semibold text-foreground">{activeNodeData.detail}</p>
                        <p className="text-xs text-muted mt-1">
                          {activeNodeData.id === "numerologia" && `Tu Life Path ${lifePath} define tu energía principal.`}
                          {activeNodeData.id === "astrologia" && `${sunSign} (${element}, ${modality}) forma tu mapa celestial.`}
                          {activeNodeData.id === "zodiaco" && `Tu ${chineseZodiac} (${chineseElement}) aporta cualidades de ciclo.`}
                          {activeNodeData.id === "arquetipo" && `${archetypeName || archetype?.name} es la síntesis de tus sistemas.`}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!activeNodeData && (
                    <p className="text-xs text-muted mt-4 text-center">Tocá un nodo para explorar</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            TU IDENTIDAD — Las tres perspectivas
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu identidad</h2>
              </div>
              <p className="text-sm text-muted mb-10 max-w-xl">
                Tres sistemas, tres perspectivas. Molino no dice cuál &ldquo;tiene raz&oacute;n&rdquo;. Te muestra qu&eacute; dicen cada uno y d&oacute;nde convergen.
              </p>
            </motion.div>

            {/* Las tres perspectivas lado a lado */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {identityProfile.perspectives.map((persp, i) => (
                <motion.div
                  key={persp.system}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-xl border border-border bg-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">{persp.icon}</span>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: persp.color }}>
                      {persp.systemLabel}
                    </p>
                  </div>
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-3">
                    {persp.headline}
                  </p>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {persp.detail}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {persp.keywords.map((kw) => (
                      <span key={kw} className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-0.5 rounded-full border border-border">
                        {kw}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Convergencias */}
            <motion.div {...fadeUp} className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-4">Dónde coinciden</p>
              <div className="space-y-3">
                {identityProfile.convergences.map((conv, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{conv.theme}</p>
                      <p className="text-xs text-muted mt-1">{conv.systems.join(" + ")}</p>
                      <p className="text-sm text-muted mt-2 leading-relaxed">{conv.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Divergencias */}
            <motion.div {...fadeUp}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-4">Dónde divergen</p>
              <div className="space-y-3">
                {identityProfile.divergences.map((div, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-card">
                    <p className="text-sm font-medium text-foreground mb-2">{div.theme}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      <div className="p-3 rounded-lg bg-background">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium mb-1">{div.systemA}</p>
                        <p className="text-sm text-foreground">{div.viewA}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium mb-1">{div.systemB}</p>
                        <p className="text-sm text-foreground">{div.viewB}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted italic">{div.explanation}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div {...fadeUp} className="mt-8 p-4 rounded-xl border border-accent/20 bg-accent/[0.03]">
              <p className="text-xs text-muted leading-relaxed">
                Molino no afirma que un sistema &ldquo;tiene raz&oacute;n&rdquo;. Te muestra m&uacute;ltiples perspectivas para que vos interpretes qu&eacute; resuena con tu experiencia.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            TU CÓDIGO PERSONAL
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu código personal</h2>
              </div>
            </motion.div>

            <div className="mt-14 space-y-0">
              {codeEntries.map((entry, i) => (
                <motion.div
                  key={codeLabels[i]}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8 py-8 border-b border-border last:border-b-0"
                >
                  <p className="number-display text-5xl sm:text-6xl number-display-accent">{entry.number}</p>
                  <div>
                    <p className="font-serif text-lg font-semibold text-foreground">{entry.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mt-1">{codeLabels[i]}</p>
                    <p className="text-sm text-muted mt-2 leading-relaxed">{entry.meaning}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            LA SÍNTESIS
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">La síntesis</h2>
              </div>
            </motion.div>

            <div className="mt-14 space-y-12">
              {synthesisInsights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="py-8 border-b border-border last:border-b-0"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{
                      color: insight.type === "identity" ? elementColor :
                             insight.type === "tension" ? "var(--layer-moment)" :
                             insight.type === "strength" ? "var(--score-excellent)" :
                             insight.type === "attention" ? "var(--score-neutral)" :
                             "var(--score-good)"
                    }}>
                      {insight.title}
                    </p>
                  </div>
                  <p className="text-base sm:text-lg text-foreground leading-relaxed">{insight.text}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {insight.sources.map((src) => (
                      <span key={src} className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-1 rounded-full border border-border">
                        {src}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            TUS PATRONES
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus patrones</h2>
              </div>
            </motion.div>

            <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {patterns.map((pattern, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  <p className="number-display text-6xl sm:text-7xl text-muted/10 leading-none mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-medium mb-2">{pattern.label}</p>
                  <p className="font-serif text-xl sm:text-2xl font-semibold mb-3" style={{ color: elementColor }}>
                    {pattern.keyword}
                  </p>
                  <p className="text-sm text-muted leading-relaxed mb-4">{pattern.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pattern.sources.map((src) => (
                      <span key={src} className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-0.5 rounded-full border border-border">
                        {src}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            TU MOMENTO
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu momento</h2>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left: big score + narrative */}
              <div className="lg:col-span-7">
                <div className="flex items-end gap-4 mb-2">
                  <p className="number-display text-[5rem] sm:text-[7rem] leading-none" style={{
                    color: momentState.energyScore >= 75 ? "var(--score-excellent)" : momentState.energyScore >= 55 ? "var(--score-good)" : "var(--score-neutral)"
                  }}>
                    {momentState.energyScore}
                  </p>
                  <div className="pb-3">
                    <p className="font-serif text-xl font-semibold text-foreground">{momentState.energyTheme}</p>
                    <p className="text-sm text-muted">Foco: {momentState.focus}</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed mt-4 max-w-xl">{momentState.narrative}</p>
              </div>

              {/* Right: cycle breakdown */}
              <div className="lg:col-span-5 lg:border-l lg:border-border lg:pl-12">
                <div className="space-y-5">
                  {[
                    { label: "Ciclo", value: `Año ${personalYear} · ${momentState.cycleName}`, detail: momentState.cycleDescription },
                    { label: "Mes", value: `Mes ${personalMonth}` },
                    { label: "Día", value: `Día ${personalDay} · ${dailyEnergy.theme}` },
                    { label: "Luna", value: `${dailyEnergy.moonPhase.phase} ${dailyEnergy.moonPhase.emoji}` },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-1">{item.label}</p>
                      <p className="font-serif text-base text-foreground">{item.value}</p>
                      {item.detail && <p className="text-xs text-muted mt-1">{item.detail}</p>}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-4">
                  <button type="button" onClick={() => router.push("/daily-energy")} className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                    Energía completa &rarr;
                  </button>
                  <button type="button" onClick={() => router.push("/timing")} className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                    Timing &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            06 — TUS DIMENSIONES
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Radar */}
              <div>
                <motion.div {...fadeUp}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-border" aria-hidden="true" />
                    <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus dimensiones</h2>
                  </div>
                  <p className="text-sm text-muted mb-4">Una síntesis simbólica de tu perfil, no una medición científica.</p>
                </motion.div>

                <div className="mt-8">
                  <ProfileRadar
                    data={dimensions.map((d) => ({ subject: d.dimension, value: d.value }))}
                    color={elementColor}
                  />
                </div>
              </div>

              {/* Dimension details */}
              <div className="space-y-0">
                {dimensions.map((dim, i) => (
                  <motion.button
                    key={dim.dimension}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    onClick={() => setExpandedDimension(expandedDimension === dim.dimension ? null : dim.dimension)}
                    className="w-full text-left py-6 border-b border-border last:border-b-0 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{dim.dimension}</p>
                        <p className="text-xs text-muted mt-1">{dim.influences.join(" + ")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-2xl font-semibold" style={{ color: elementColor }}>{dim.value}</p>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-muted">/ 100</p>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedDimension === dim.dimension && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-muted mt-3 leading-relaxed">{dim.explanation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            TUS SISTEMAS
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus sistemas</h2>
              </div>
              <p className="text-sm text-muted max-w-xl">
                Estos sistemas no están aislados. Molino los conecta para construir una lectura integrada.
              </p>
            </motion.div>

            <div className="mt-10 space-y-0">
              {[
                { title: "Numerología", detail: `Life Path ${lifePath} · ${ARCHETYPES[lifePath]?.name || ""}`, href: "/numerologia", color: "var(--element-fire)", system: "El lenguaje de los números" },
                { title: "Astrología", detail: `${sunSignSymbol} ${sunSign} · ${element} · ${modality}`, href: "/astrologia", color: "var(--layer-astrology)", system: "El mapa del cielo" },
                { title: "Zodiaco Chino", detail: `${chineseZodiac} · ${chineseElement}`, href: "/zodiaco-chino", color: "var(--layer-moment)", system: "El ciclo de los animales" },
                { title: "Arquetipos", detail: archetypeName || archetype?.name || "", href: "/numerologia", color: elementColor, system: "La síntesis de tus patrones" },
              ].map((sys, i) => (
                <motion.button
                  key={sys.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  onClick={() => router.push(sys.href)}
                  className="w-full flex items-center gap-6 py-7 border-b border-border last:border-b-0 text-left group hover:pl-4 transition-all"
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sys.color }} />
                  <div className="flex-1">
                    <p className="font-serif text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors">{sys.title}</p>
                    <p className="text-sm text-muted mt-1">{sys.detail}</p>
                  </div>
                  <span className="text-xs text-muted group-hover:text-accent transition-colors shrink-0">{sys.system} &rarr;</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            COMPATIBILIDAD CON EL MUNDO
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Compatibilidad con el mundo</h2>
              </div>
              <p className="text-sm text-muted mt-2 max-w-xl">
                Tu <span className="font-medium text-foreground">{chineseZodiac}</span> se conecta con el mundo a través de 197 países y 235 marcas.
              </p>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                onClick={() => router.push("/compatibility/countries")}
                className="text-left p-6 sm:p-8 rounded-xl border border-border bg-card hover:border-accent/50 transition-colors group"
              >
                <p className="text-3xl mb-3">🌎</p>
                <p className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Países</p>
                <p className="text-sm text-muted mt-2 leading-relaxed">197 países. Descubrí dónde resonás.</p>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, duration: 0.4 }}
                onClick={() => router.push("/compatibility/brands")}
                className="text-left p-6 sm:p-8 rounded-xl border border-border bg-card hover:border-accent/50 transition-colors group"
              >
                <p className="text-3xl mb-3">✦</p>
                <p className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Marcas</p>
                <p className="text-sm text-muted mt-2 leading-relaxed">235 marcas en 12 categorías.</p>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16, duration: 0.4 }}
                onClick={() => router.push("/explore")}
                className="text-left p-6 sm:p-8 rounded-xl border border-border bg-card hover:border-accent/50 transition-colors group"
              >
                <p className="text-3xl mb-3">👤</p>
                <p className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Personas</p>
                <p className="text-sm text-muted mt-2 leading-relaxed">Explorá compatibilidad con personas, conceptos y más.</p>
              </motion.button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            TU PRÓXIMO MOVIMIENTO
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu próximo movimiento</h2>
              </div>
            </motion.div>

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onClick={() => router.push("/decisions")}
                className="text-left p-8 rounded-2xl border border-border bg-card hover:border-accent transition-colors group"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Decisiones</p>
                <p className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors">¿Qué estás decidiendo?</p>
                <p className="text-sm text-muted mt-2 leading-relaxed">Escribí una decisión y Molino la analiza desde tu perfil, tu energía y tu momento.</p>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, duration: 0.5 }}
                onClick={() => router.push("/explore")}
                className="text-left p-8 rounded-2xl border border-border bg-card hover:border-accent transition-colors group"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Conexiones</p>
                <p className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors">¿Con qué resonás?</p>
                <p className="text-sm text-muted mt-2 leading-relaxed">Explorá compatibilidad con personas, países, marcas y conceptos.</p>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16, duration: 0.5 }}
                onClick={() => router.push("/explore")}
                className="text-left p-8 rounded-2xl border border-border bg-card hover:border-accent transition-colors group"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Conocimiento</p>
                <p className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors">¿Querés entender el sistema?</p>
                <p className="text-sm text-muted mt-2 leading-relaxed">Explorá numerología, astrología, zodiaco chino y más.</p>
              </motion.button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            COMPARTIR + INTERPRETACIÓN
            ═══════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-border" aria-hidden="true" />
                  <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Compartir</h2>
                </div>
                <ShareableCard
                  name={name}
                  birthDate={birthDate}
                  lifePath={lifePath}
                  sunSign={sunSign}
                  element={element}
                  chineseZodiac={chineseZodiac}
                  archetype={archetypeName}
                  expressionNumber={expressionNumber}
                  soulNumber={soulNumber}
                  personalityNumber={personalityNumber}
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-border" aria-hidden="true" />
                  <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu interpretación</h2>
                </div>
                <MolinoInterpretation
                  profile={profile}
                  type="personal_profile"
                  dailyEnergy={dailyEnergy}
                  timing={timing}
                  label="Interpretación de Molino"
                  description="Análisis integrado de tu perfil personal"
                />
              </div>
            </div>
          </div>
        </section>

      </main>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:shadow-xl transition-all"
          aria-label="Volver arriba"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      <UniversityFooter />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });

  if (!mounted) {
    return <LoadingState message="Cargando tu perfil..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">Mi mapa personal</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Todavía no creaste tu mapa
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Ingresá tu nombre y fecha de nacimiento para generar tu perfil de Inteligencia Personal.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-8 py-4 text-base bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground min-h-[52px]"
          >
            Crear mi perfil
          </button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  return <ProfileContent profile={profile} />;
}
