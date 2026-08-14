"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { AtlasCountry } from "@/lib/data/atlas-queries";

interface CountryGridProps {
  countries: AtlasCountry[];
}

/**
 * Atlas global hub — grid of country tiles linking to each country's Atlas.
 * Receives plain metadata (iso/name/flag/count) from the Server Component;
 * no rich data reaches the client.
 */
export default function CountryGrid({ countries }: CountryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {countries.map((country, i) => (
        <motion.div
          key={country.iso}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4), ease: "easeOut" }}
        >
          <Link
            href={`/atlas/${country.iso}`}
            className="group flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border border-ink/10 bg-card hover:border-accent/40 hover:bg-ink/[0.02] transition-colors text-center min-h-[120px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span className="text-4xl leading-none" role="img" aria-label={country.name}>
              {country.flag}
            </span>
            <span className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
              {country.name}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              {country.count} entidades
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
