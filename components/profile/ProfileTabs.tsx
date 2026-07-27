"use client";

import { motion } from "framer-motion";

export type ProfileTab = "identity" | "world" | "circle" | "intelligence";

interface Tab {
  id: ProfileTab;
  label: string;
  shortLabel: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: "identity", label: "Tu Identidad", shortLabel: "Identidad", icon: "✦" },
  { id: "world", label: "Tu Mundo", shortLabel: "Mundo", icon: "🌎" },
  { id: "circle", label: "Tu Círculo", shortLabel: "Círculo", icon: "⬡" },
  { id: "intelligence", label: "Tu Inteligencia", shortLabel: "Análisis", icon: "◆" },
];

interface ProfileTabsProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export default function ProfileTabs({ active, onChange }: ProfileTabsProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <nav className="flex gap-0 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Secciones del perfil">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => onChange(tab.id)}
                className="relative flex items-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-medium transition-colors whitespace-nowrap min-h-[48px]"
                style={{ color: isActive ? "var(--color-foreground)" : "var(--color-muted)" }}
              >
                <span className="hidden sm:inline text-xs">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {isActive && (
                  <motion.div
                    layoutId="profile-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                    style={{ backgroundColor: "var(--color-accent)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export { TABS };
