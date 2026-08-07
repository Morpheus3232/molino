"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Halftone from "@/components/ui/Halftone";

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function MapPreviewDiagram() {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 90;

  const axes = [
    { angle: -90, color: "#6B4C7A", label: "NUMEROLOGÍA", score: 74 },
    { angle: 30, color: "#2E5C8A", label: "ASTROLOGÍA", score: 62 },
    { angle: 150, color: "#C49A2A", label: "ZODÍACO", score: 58 },
  ];

  const rings = [0.33, 0.66, 1];
  const scorePoints = axes.map((a) => polarToCartesian(cx, cy, (a.score / 100) * maxR, a.angle));
  const scorePathD = scorePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Preview del mapa personal: tres sistemas en un radar">
      <defs>
        <radialGradient id="previewMapGrad" cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#6B4C7A" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#2E5C8A" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#C49A2A" stopOpacity="0.04" />
        </radialGradient>
      </defs>

      {rings.map((ratio) => {
        const pts = axes.map((a) => polarToCartesian(cx, cy, maxR * ratio, a.angle));
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={ratio} d={d} fill="none" stroke="currentColor" strokeOpacity={ratio === 1 ? "0.10" : "0.05"} strokeWidth="0.7" />;
      })}

      {axes.map((a) => {
        const end = polarToCartesian(cx, cy, maxR, a.angle);
        return <line key={a.label} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.7" />;
      })}

      <path d={scorePathD} fill="url(#previewMapGrad)" />
      <path d={scorePathD} fill="none" stroke="#6B4C7A" strokeWidth="1.5" strokeOpacity="0.5" strokeLinejoin="round" />

      {axes.map((a) => {
        const pt = polarToCartesian(cx, cy, (a.score / 100) * maxR, a.angle);
        const lp = polarToCartesian(cx, cy, maxR + 30, a.angle);
        return (
          <g key={a.label}>
            <circle cx={pt.x} cy={pt.y} r="3.5" fill={a.color} />
            <circle cx={pt.x} cy={pt.y} r="3.5" fill="none" stroke={a.color} strokeWidth="6" opacity="0.15" />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.12em" fill={a.color} fontWeight="500" opacity="0.8">
              {a.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function HeroClient({ hasProfile = false }: { hasProfile?: boolean }) {
  const router = useRouter();

  return (
    <section className="relative bg-background overflow-hidden">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Left: Copy + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow-brutalist mb-5">
              MAPA PERSONAL DE AUTOCONOCIMIENTO
            </p>

            <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-[0.92] tracking-tight uppercase">
              CONOCÉ TU
              <br />
              <span className="text-accent">MAPA PERSONAL</span>
            </h1>

            <p className="text-base sm:text-lg text-muted/80 leading-relaxed max-w-xl mt-8">
              Tu fecha de nacimiento revela tres sistemas que se cruzan para mostrarte quién sos, en qué momento estás y qué energías te acompañan.
              <span className="font-semibold text-foreground"> Sin registro. Sin cookies. Sin servidor.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mt-10">
              <Button
                onClick={() => router.push("/onboarding")}
                className="group w-full sm:w-auto flex-1 sm:flex-none"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  CREAR MI MAPA
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Button>
              <Link
                href="/filosofia"
                className="w-full sm:w-auto flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-muted hover:text-foreground transition-colors px-8 py-4"
              >
                Cómo funciona
                <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>

            <p className="text-xs text-muted/60 mt-5 font-medium">
              Tres sistemas. Un mapa. Tu navegador es el único que guarda tu perfil.
            </p>
          </motion.div>

          {/* Right: Map Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative border border-ink/10 bg-ink/[0.02] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <Halftone variant="spiral" resolution={22} className="w-full h-full text-ink opacity-[0.025]" />
              </div>

              {/* Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.15em] text-muted/40 uppercase border border-ink/10 px-2.5 py-1 bg-background/80 backdrop-blur-sm">
                  <span className="w-1 h-1 rounded-full bg-accent" aria-hidden="true" />
                  Vista previa
                </span>
              </div>

              {/* Radar — center stage */}
              <div className="relative mx-auto max-w-[280px] px-4 pt-8 pb-2">
                <MapPreviewDiagram />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-[24%]">
                  <p className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-tight uppercase">
                    El Aventurero
                  </p>
                  <p className="font-mono text-[11px] text-muted/60 mt-1.5">
                    7 · ♎ Libra · 🐉 Dragón de Metal
                  </p>
                </div>
              </div>

              {/* Data strip */}
              <div className="relative grid grid-cols-3 divide-x divide-ink/10 border-t border-ink/10">
                {[
                  { label: "NUMEROLOGÍA", value: "7", color: "#6B4C7A" },
                  { label: "ASTROLOGÍA", value: "♎", color: "#2E5C8A" },
                  { label: "ZODÍACO", value: "🐉", color: "#C49A2A" },
                ].map((sys) => (
                  <div key={sys.label} className="px-3 py-4 text-center">
                    <p className="text-[0.5rem] font-mono tracking-[0.14em] text-muted/40 uppercase">{sys.label}</p>
                    <p className="font-display text-lg sm:text-xl font-bold mt-1" style={{ color: sys.color }}>{sys.value}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/onboarding"
                className="relative flex items-center justify-center gap-2 py-4 border-t border-ink/10 font-mono text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-accent hover:bg-accent/[0.04] transition-colors"
              >
                Creá tu mapa
                <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>

            {/* Shadow */}
            <div className="absolute -bottom-3 left-4 right-4 h-6 bg-ink/[0.04] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
