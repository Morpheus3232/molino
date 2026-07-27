"use client";

import { motion } from "framer-motion";
import { smoothReveal } from "@/lib/utils/premiumMotion";

interface CrossLink {
  label: string;
  description: string;
  onClick: () => void;
}

interface CrossLinksProps {
  title?: string;
  links: CrossLink[];
}

export default function CrossLinks({ title = "Seguí explorando", links }: CrossLinksProps) {
  return (
    <section className="py-8 sm:py-12 border-t border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">{title}</h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((link, i) => (
            <motion.button
              key={link.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={link.onClick}
              className="text-left p-4 rounded-xl border border-border bg-card hover:border-accent/40 transition-all group"
            >
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{link.label}</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">{link.description}</p>
              <p className="text-xs text-accent mt-2 group-hover:translate-x-1 transition-transform inline-block">→</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
