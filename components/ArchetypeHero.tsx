"use client";

import { motion } from "framer-motion";
import { Archetype } from "@/lib/data";

interface ArchetypeHeroProps {
  archetype: Archetype;
}

export default function ArchetypeHero({ archetype }: ArchetypeHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-auto mb-4 h-20 w-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: archetype.colorLight }}
      >
        <span className="font-serif text-3xl font-bold" style={{ color: archetype.color }}>
          {archetype.name.split(" ").pop()?.charAt(0)}
        </span>
      </motion.div>
      <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900">
        {archetype.name}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        {archetype.keywords.join(" · ")}
      </p>
    </motion.div>
  );
}
