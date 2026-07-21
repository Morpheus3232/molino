"use client";

import { motion } from "framer-motion";

interface AnimatedHeroProps {
  number: number;
  name: string;
  description: string;
  color: string;
  gradient: string;
  emoji: string;
  subtitle: string;
}

export default function AnimatedHero({ number, name, description, color, gradient, emoji, subtitle }: AnimatedHeroProps) {
  const colors = gradient.match(/#[A-Fa-f0-9]{6}/g) || [color, color];
  const backgroundStyle = colors.length >= 2
    ? { background: `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})` }
    : { backgroundColor: color };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl p-6 shadow-lg border border-black/[0.06]"
      style={backgroundStyle}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl font-bold text-white shadow-lg backdrop-blur-sm">
            {number}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">
            Energía del día
          </p>
          <h2 className="font-serif text-2xl font-bold text-white">{name}</h2>
          <p className="mt-1 text-sm text-white/80 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
        <span className="text-base">{emoji}</span>
        <span>{subtitle}</span>
      </div>
    </motion.div>
  );
}
