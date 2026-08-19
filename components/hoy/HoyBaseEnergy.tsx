"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/i18n/format";
import type { GenericDailyData } from "@/lib/utils/daily-energy-utils";

const TEASER_ITEMS = [
  "Tu arquetipo único según tu fecha de nacimiento",
  "Ciclos personales de numerología y astrología",
  "Patrones de afinidad con lugares y marcas",
  "Tu energía personal y timing óptimo cada día",
];

export default function HoyBaseEnergy({ data }: { data: GenericDailyData }) {
  const router = useRouter();
  const dateLabel = formatDate(new Date(), {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground font-medium">Hoy</span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-t border-ink/10 py-12 sm:py-16"
        >
          <p className="text-sm text-muted mb-4">TU DÍA · {dateLabel}</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9] text-foreground">
            Energía de Hoy
          </h1>
          <p className="font-heading text-xl sm:text-2xl text-foreground leading-relaxed max-w-2xl mt-6">
            {data.energy} — {data.vibe}
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="border-t border-ink/10 py-10 sm:py-14"
        >
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight text-foreground mb-6">
            Tu energía base
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            <div className="p-6 border border-ink/10">
              <p className="label-micro mb-2 text-accent">Enfoque</p>
              <p className="text-lg text-foreground font-medium">{data.focus}</p>
            </div>
            <div className="p-6 border border-ink/10">
              <p className="label-micro mb-2 text-muted">Precaución</p>
              <p className="text-lg text-foreground font-medium">{data.caution}</p>
            </div>
            <div className="p-6 border border-ink/10">
              <p className="label-micro mb-2 text-muted">Vibe</p>
              <p className="text-lg text-foreground font-medium">{data.energy}</p>
            </div>
          </div>
        </motion.div>

        {/* Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="border-t border-ink/10 py-10 sm:py-14"
        >
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight text-foreground mb-6">
            Con tu mapa personal, descubrirías
          </h2>
          <ul className="space-y-4 max-w-xl">
            {TEASER_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" aria-hidden="true" />
                <span className="text-sm sm:text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="border-t border-ink/10 py-10 sm:py-14 flex flex-col items-center gap-4"
        >
          <Button
            onClick={() => router.push("/onboarding")}
            className="group w-full sm:w-auto"
            size="lg"
          >
            <span className="flex items-center gap-2">
              CREAR MI MAPA GRATIS
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Button>
          <p className="text-xs text-muted text-center">
            Sin registro. Sin cookies. Solo tu fecha de nacimiento.
          </p>
        </motion.div>
      </main>
    </div>
  );
}