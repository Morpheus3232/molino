"use client";

import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";

export type ProfileTab = "identity" | "world" | "circle" | "intelligence";

interface Tab {
  id: ProfileTab;
  label: string;
  shortLabel: string;
  icon: string;
  isPremium?: boolean;
}

const TABS: Tab[] = [
  { id: "identity", label: "Tu Identidad", shortLabel: "Identidad", icon: "✦" },
  { id: "world", label: "Tu Mundo", shortLabel: "Mundo", icon: "🌎" },
  { id: "circle", label: "Tu Círculo", shortLabel: "Círculo", icon: "⬡" },
  { id: "intelligence", label: "Tu Inteligencia", shortLabel: "Análisis", icon: "◆", isPremium: true },
];

interface ProfileTabsProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  /** Si se pasa, muestra un botón "volver al hub" antes de los tabs. */
  onBack?: () => void;
}

export default function ProfileTabs({ active, onChange, onBack }: ProfileTabsProps) {
  return (
    <div className="sticky top-0 z-30 bg-background border-b border-ink/10">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 flex items-center gap-1">
        {onBack && (
          <>
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver a mi mapa"
              className="flex items-center gap-2 pr-3 py-3.5 text-sm text-muted hover:text-foreground transition-colors shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="hidden sm:inline">Mi mapa</span>
            </button>
            <div className="h-4 w-px bg-ink/10 shrink-0" aria-hidden="true" />
          </>
        )}
        <nav className="flex gap-0 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Secciones del perfil">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onChange(tab.id)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const currentIndex = TABS.findIndex((t) => t.id === active);
                  const delta = e.key === "ArrowRight" ? 1 : -1;
                  const next = TABS[(currentIndex + delta + TABS.length) % TABS.length];
                  onChange(next.id);
                }}
                className="relative flex items-center gap-2 px-4 sm:px-6 py-3.5 text-sm font-medium transition-colors whitespace-nowrap min-h-[48px]"
                style={{ color: isActive ? "var(--color-foreground)" : "var(--color-muted)" }}
              >
                <span className="text-xs font-mono" aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.isPremium && !isActive && (
                  <Badge variant="muted" className="ml-1.5 text-[0.6rem] py-1">
                    Premium
                  </Badge>
                )}
                {isActive && (
                  <motion.div
                    layoutId="profile-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-px"
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
