"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Hash, Sun, Sparkles } from "lucide-react";
import Badge from "@/components/ui/Badge";

const SECTIONS = [
  {
    id: "numerologia",
    label: "Numerología",
    color: "var(--layer-numerology)",
    icon: Hash,
    value: "Número de Vida: 6",
    hint: "Reducís tu fecha a un dígito maestro: el 6 habla de armonía, responsabilidad y cuidar a los demás.",
  },
  {
    id: "astrologia",
    label: "Astrología",
    color: "var(--layer-astrology)",
    icon: Sun,
    value: "Sol en Piscis · Luna en Géminis",
    hint: "El Sol marca tu esencia y la Luna tu mundo emocional: intuición sensible, mente curiosa y comunicativa.",
  },
  {
    id: "zodiaco",
    label: "Zodíaco Chino",
    color: "var(--element-wood)",
    icon: Sparkles,
    value: "Caballo de Metal",
    hint: "El Caballo es movimiento e independencia; el Metal agrega determinación y estructura a esa energía.",
  },
] as const;

type Section = (typeof SECTIONS)[number];

function Tooltip({ section, active }: { section: Section; active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.span
          role="tooltip"
          id={`map-preview-tip-${section.id}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 -top-2 z-20 w-56 -translate-x-1/2 -translate-y-full rounded-md border border-ink/15 bg-card px-3 py-2 text-xs leading-relaxed text-foreground/90 shadow-lg"
        >
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: section.color }}>
            {section.label}
          </span>
          {section.hint}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function DemoSection({ section }: { section: Section }) {
  const [tip, setTip] = useState(false);
  const Icon = section.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-describedby={tip ? `map-preview-tip-${section.id}` : undefined}
      onMouseEnter={() => setTip(true)}
      onMouseLeave={() => setTip(false)}
      onFocus={() => setTip(true)}
      onBlur={() => setTip(false)}
      className="group relative rounded-md border border-ink/10 bg-background p-4 transition-colors duration-200 hover:border-ink/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ ["--sec-color" as string]: section.color }}
    >
      <Tooltip section={section} active={tip} />

      <div className="flex items-start gap-3">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ color: section.color, backgroundColor: `color-mix(in srgb, ${section.color} 15%, transparent)` }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted/70">{section.label}</p>
          <p className="font-heading text-base font-semibold leading-snug text-foreground mt-1">
            {section.value}
          </p>
          <p className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            ¿Qué significa?
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MapPreviewDemo() {
  const [open, setOpen] = useState(false);

  const scrollToForm = () => {
    const form = document.getElementById("mapa-form");
    form?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      aria-label="Ejemplo de mapa personal"
      className="bg-card border-t border-ink/10 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0, margin: "60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mx-auto max-w-3xl"
        >
          <div className="absolute right-0 top-0 z-10">
            <Badge variant="outline">Ejemplo</Badge>
          </div>

          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-3">Así se ve tu mapa</p>
          <h2 className="font-display text-[clamp(1.5rem,4vw,2.25rem)] tracking-tight text-foreground leading-[1.05] mb-2">
            El mapa de Ana
          </h2>
          <p className="font-mono text-xs text-muted/70 tracking-wide mb-6">Nacida el 15/03/1990</p>

          {/* Toggle solo mobile — colapsado por defecto, expandido en desktop */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="map-preview-content"
            onClick={() => setOpen((v) => !v)}
            className="mb-4 inline-flex w-full items-center justify-between rounded-md border border-ink/10 px-4 py-3 font-heading text-sm font-semibold uppercase tracking-[0.15em] text-foreground transition-colors hover:border-ink/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
          >
            Ver el ejemplo
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          </button>

          <div id="map-preview-content">
            {/* Mobile: accordion animado */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden md:hidden"
                >
                  <DemoGrid />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop: siempre visible */}
            <div className="hidden md:block">
              <DemoGrid />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={scrollToForm}
              className="group inline-flex items-center gap-2 rounded-md bg-gold px-8 py-4 font-heading text-base font-bold uppercase tracking-[0.08em] text-gold-foreground transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-gold-hover hover:shadow-[0_0_35px_rgba(245,176,34,0.35)] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold"
            >
              Generar mi propio mapa
              <Sparkles className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" aria-hidden="true" />
            </button>
            <p className="mt-3 font-mono text-xs text-muted/70 tracking-wide">
              Con tu propia fecha. Gratis · Sin registro
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DemoGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {SECTIONS.map((section) => (
        <DemoSection key={section.id} section={section} />
      ))}
    </div>
  );
}
