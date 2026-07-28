"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Clover, Heart, Sun, Zap, Globe, Building2, Tag } from "lucide-react";
import Section from "@/components/ui/Section";

const categories = [
  {
    title: "Tu Identidad",
    tools: [
      { name: "Camino de Vida", icon: Compass, href: "/herramientas/camino-de-vida" },
      { name: "Número de la Suerte", icon: Clover, href: "/herramientas/numero-de-la-suerte" },
    ],
  },
  {
    title: "Tus Relaciones",
    tools: [
      { name: "Compatibilidad", icon: Heart, href: "/herramientas/compatibilidad" },
      { name: "Signo Solar", icon: Sun, href: "/herramientas/signo-solar" },
      { name: "Zodíaco Chino", icon: Zap, href: "/herramientas/zodiaco-chino" },
    ],
  },
  {
    title: "Explorá Conexiones",
    tools: [
      { name: "Países", icon: Globe, href: "/affinity/country" },
      { name: "Ciudades", icon: Building2, href: "/affinity/city" },
      { name: "Marcas", icon: Tag, href: "/affinity/brand" },
    ],
  },
];

export default function ToolsAndDiscovery() {
  const router = useRouter();

  return (
    <Section>
      <div className="flex items-center gap-4 mb-10">
        <div className="w-8 h-px bg-border" aria-hidden="true" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium">
          Herramientas y afinidades
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, ci) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: ci * 0.1 }}
            className="border border-border bg-card p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-5">
              {cat.title}
            </p>
            <div className="space-y-3">
              {cat.tools.map((tool) => (
                <button
                  key={tool.href}
                  type="button"
                  onClick={() => router.push(tool.href)}
                  className="group w-full text-left px-4 py-3 border border-border/50 hover:border-accent/30 transition-all hover:bg-accent/5"
                >
                  <div className="flex items-center gap-3">
                    <tool.icon className="w-4 h-4 text-muted shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {tool.name}
                    </span>
                    <span className="ml-auto text-xs text-muted">→</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
