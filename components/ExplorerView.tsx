"use client";

import { motion } from "framer-motion";
import { Settings, Sparkles } from "lucide-react";
import { ARCHETYPES } from "@/lib/data";
import { UserProfile, getEnergyBars, clearProfile } from "@/lib/utils";
import { getPersonalYear } from "@/lib/engines/dateEngine";
import { CYCLE_YEARS } from "@/lib/data";
import DailyCard from "./DailyCard";
import DayHero from "./DayHero";
import ProfileCard from "./ProfileCard";
import CalendarSection from "./CalendarSection";
import CycleTimeline from "./CycleTimeline";
import RelationsSection from "./RelationsSection";
import BusinessSection from "./BusinessSection";
import ExploreGrid from "./ExploreGrid";
import SectionCard from "./SectionCard";

interface ExplorerViewProps {
  profile: UserProfile;
  onReset: () => void;
}

export default function ExplorerView({ profile, onReset }: ExplorerViewProps) {
  const archetype = ARCHETYPES[profile.lifePath];
  const energyBars = getEnergyBars(profile.lifePath);
  const currentYear = new Date().getFullYear();
  const personalYear = getPersonalYear(profile.day, profile.month, currentYear);
  const cycleInfo = CYCLE_YEARS[personalYear] || CYCLE_YEARS[1];

  if (!archetype) return null;

  return (
    <div className="min-h-screen pb-10">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/90 backdrop-blur-md px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-foreground" />
          <span className="font-serif text-base font-semibold">Molino</span>
        </div>
        <button
          onClick={() => {
            clearProfile();
            onReset();
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-background hover:text-foreground"
          title="Reiniciar"
        >
          <Settings size={16} />
        </button>
      </header>

      <div className="px-5 pt-5 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm text-muted mb-1">
            Hola{profile.name ? `, ${profile.name}` : ""}
          </p>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Tu exploración de hoy
          </h1>
        </motion.div>

        <DailyCard
          birthDay={profile.day}
          birthMonth={profile.month}
          birthYear={profile.year}
        />

        <DayHero
          birthDay={profile.day}
          birthMonth={profile.month}
          birthYear={profile.year}
        />

        <ProfileCard
          archetype={archetype}
          energyBars={energyBars}
          name={profile.name}
        />

        <SectionCard delay={0.1}>
          <div className="mb-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Tu año {currentYear}
            </p>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {cycleInfo.name}
            </h3>
          </div>
          <p className="text-sm text-muted mb-4">{cycleInfo.description}</p>
          <CycleTimeline
            birthDay={profile.day}
            birthMonth={profile.month}
            birthYear={profile.year}
          />
        </SectionCard>

        <CalendarSection
          birthDay={profile.day}
          birthMonth={profile.month}
          birthYear={profile.year}
        />

        <RelationsSection userLifePath={profile.lifePath} />

        <BusinessSection archetype={archetype} />

        <ExploreGrid />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted px-4 pt-2"
        >
          Molino es un explorador de identidad. Los marcos simbólicos son herramientas de reflexión, no verdades absolutas.
        </motion.p>
      </div>
    </div>
  );
}
