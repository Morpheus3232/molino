"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { SYMBOLIC_FRAMEWORKS } from "@/lib/data";
import SectionCard from "./SectionCard";

export default function ExploreGrid() {
  return (
    <SectionCard delay={0.3}>
      <div className="mb-4">
        <h3 className="font-serif text-lg font-semibold text-gray-900">Explorar marcos</h3>
        <p className="text-xs text-gray-500">Distintas lentes para conocerte</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SYMBOLIC_FRAMEWORKS.map((framework, index) => (
          <motion.button
            key={framework.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            disabled={!framework.available}
            className={`relative rounded-xl p-4 text-left transition ${
              framework.available
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          >
            {!framework.available && (
              <Lock size={12} className="absolute top-3 right-3 text-gray-300" />
            )}
            <span className="text-2xl mb-2 block">{framework.icon}</span>
            <p className={`text-sm font-semibold ${framework.available ? "text-white" : "text-gray-500"}`}>
              {framework.name}
            </p>
            <p className={`text-[11px] mt-0.5 ${framework.available ? "text-gray-300" : "text-gray-400"}`}>
              {framework.description}
            </p>
            {framework.available && (
              <span className="mt-2 inline-block text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Activo
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </SectionCard>
  );
}
