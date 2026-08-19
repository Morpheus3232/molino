"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ELEMENT_COLORS } from "@/lib/data/constants";

interface ProfileSummaryTableProps {
  profile: UserProfile;
}

interface StatItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

function SystemCard({ title, color, stats, children }: { title: string; color: string; stats: StatItem[]; children?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 sm:p-6 border border-ink/10 rounded-lg bg-ink/[0.015]"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="label-micro text-foreground">{title}</h3>
      </div>
      <dl className="space-y-3">
        {stats.map((stat, i) => (
          <div key={i} className="flex justify-between items-start gap-4">
            <dt className="text-sm text-muted">{stat.label}</dt>
            <dd className="font-mono text-base font-semibold text-foreground text-right min-w-[40%]">
              {stat.icon && <span className="mr-2" aria-hidden="true">{stat.icon}</span>}
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      {children}
    </motion.div>
  );
}

export default function ProfileSummaryTable({ profile }: ProfileSummaryTableProps) {
  const display = getZodiacDisplay(profile.chineseZodiac);
  const symbol = ZODIAC_SYMBOLS[profile.sunSign] || "";
  const elementColor = ELEMENT_COLORS[profile.element] || "#6B4C7A";

  const numerologyStats = [
    { label: "Camino de Vida", value: profile.lifePath },
    { label: "Número de Expresión", value: profile.expressionNumber ?? "—" },
    { label: "Número del Alma", value: profile.soulNumber ?? "—" },
    { label: "Día de Nacimiento", value: profile.personalityNumber ?? "—" },
    { label: "Número de la Suerte", value: profile.luckyNumber ?? "—" },
  ];

  const astrologyStats = [
    { label: "Signo Solar", value: profile.sunSign, icon: symbol },
    { label: "Elemento", value: profile.sunSignInfo.element, icon: profile.sunSignInfo.element === "Fuego" ? "🔥" : profile.sunSignInfo.element === "Tierra" ? "🌱" : profile.sunSignInfo.element === "Aire" ? "💨" : "💧" },
    { label: "Modalidad", value: profile.sunSignInfo.modality },
    { label: "Año Personal", value: profile.cycles.personalYear },
    { label: "Mes Personal", value: profile.cycles.personalMonth },
  ];

  const zodiacStats = [
    { label: "Animal", value: display.name, icon: display.emoji },
    { label: "Elemento", value: profile.chineseZodiacInfo.element, icon: profile.chineseZodiacInfo.element === "Metal" ? "⚪" : profile.chineseZodiacInfo.element === "Madera" ? "🌿" : profile.chineseZodiacInfo.element === "Agua" ? "💧" : profile.chineseZodiacInfo.element === "Fuego" ? "🔥" : "🌱" },
    { label: "Año", value: profile.birthDate.split("-")[0] },
    { label: "Ciclo (60 años)", value: profile.chineseZodiac },
  ];

  return (
    <section className="py-10 sm:py-12" aria-labelledby="summary-heading">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
        01 · Tu resumen
      </p>
      <h2 id="summary-heading" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground leading-[1.05] max-w-2xl mb-8">
        Tres sistemas, una lectura
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <SystemCard
          title="NUMEROLOGÍA"
          color="#6B4C7A"
          stats={numerologyStats}
        />
        <SystemCard
          title="ASTROLOGÍA"
          color="#2E5C8A"
          stats={astrologyStats}
        />
        <SystemCard
          title="ZODÍACO CHINO"
          color="#C49A2A"
          stats={zodiacStats}
        />
      </div>
    </section>
  );
}