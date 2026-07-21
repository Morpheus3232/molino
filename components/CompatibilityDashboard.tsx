"use client";

import { motion } from "framer-motion";
import { getEntitiesByCategory } from "@/lib/data/entities";
import { getCompatibilityScore, getCompatibilityDescription } from "@/lib/data";

interface CompatibilityDashboardProps {
  userBirthDate: { day: number; month: number; year: number };
}

export default function CompatibilityDashboard({ userBirthDate }: CompatibilityDashboardProps) {
  const userAnimal = userBirthDate ? "" : "";

  const categories = [
    { id: "countries", label: "Países", icon: "🌍" },
    { id: "brands", label: "Marcas", icon: "🏷️" },
    { id: "bands", label: "Bandas", icon: "🎸" },
    { id: "teams", label: "Fútbol", icon: "⚽" },
    { id: "politicians", label: "Políticos", icon: "🏛️" },
    { id: "actors", label: "Actores", icon: "🎬" },
    { id: "cuisine", label: "Cocinas", icon: "🍽️" },
    { id: "cities", label: "Ciudades", icon: "🏙️" },
    { id: "celebrities", label: "Celebridades", icon: "⭐" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              true ? "bg-[#1F2937] text-white shadow-md" : "bg-[#F8F9FA] text-[#6B7280] hover:bg-[#E5E7EB]"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center">Seleccioná una categoría para explorar compatibilidades</p>
    </div>
  );
}
