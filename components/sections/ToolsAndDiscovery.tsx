"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Section from "@/components/ui/Section";

const categories = [
  {
    title: "Tu Identidad",
    tools: [
      { name: "Camino de Vida", icon: "🧭", href: "/herramientas/camino-de-vida" },
      { name: "Número de la Suerte", icon: "🍀", href: "/herramientas/numero-de-la-suerte" },
    ],
  },
  {
    title: "Tus Relaciones",
    tools: [
      { name: "Compatibilidad", icon: "❤️", href: "/herramientas/compatibilidad" },
      { name: "Signo Solar", icon: "☀️", href: "/herramientas/signo-solar" },
      { name: "Zodíaco Chino", icon: "🐲", href: "/herramientas/zodiaco-chino" },
    ],
  },
  {
    title: "Explorá Conexiones",
    tools: [
      { name: "Países", icon: "🌍", href: "/affinity/country" },
      { name: "Ciudades", icon: "🏙️", href: "/affinity/city" },
      { name: "Marcas", icon: "🏷️", href: "/affinity/brand" },
    ],
  },
];

export default function ToolsAndDiscovery() {
  const router = useRouter();

  return (
    <Section>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Herramientas y afinidades
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, ci) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: ci * 0.1 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">{cat.title}</p>
            <div className="space-y-3">
              {cat.tools.map((tool) => (
                <button
                  key={tool.href}
                  type="button"
                  onClick={() => router.push(tool.href)}
                  className="group w-full text-left py-4 border-b border-neutral-200/60 hover:border-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{tool.icon}</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                      {tool.name}
                    </span>
                    <span className="ml-auto text-muted opacity-0 group-hover:opacity-100 transition-opacity">→</span>
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
