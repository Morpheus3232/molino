"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Clover, Heart, Sun, Zap, Globe, Building2, Tag } from "lucide-react";

const categories = [
  {
    title: "Tu Identidad",
    tools: [
      { name: "Camino de Vida", icon: Compass },
      { name: "Número de la Suerte", icon: Clover },
    ],
  },
  {
    title: "Tus Relaciones",
    tools: [
      { name: "Compatibilidad", icon: Heart },
      { name: "Signo Solar", icon: Sun },
      { name: "Zodíaco Chino", icon: Zap },
    ],
  },
  {
    title: "Explorá Conexiones",
    tools: [
      { name: "Países", icon: Globe },
      { name: "Ciudades", icon: Building2 },
      { name: "Marcas", icon: Tag },
    ],
  },
];

const colBorder = "border-accent/10";
const cellPad = "p-8 sm:p-10 lg:p-12";

export default function ToolsAndDiscovery() {
  const router = useRouter();

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-4">Herramientas y afinidades</p>
          <h2 className="font-heading uppercase text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Explorá tu perfil
          </h2>
          <p className="text-sm sm:text-base text-muted mt-4 max-w-2xl leading-relaxed">
            Ingresá tu fecha de nacimiento y descubrí cómo resuena tu energía con cada sistema.
          </p>
        </motion.div>

        <div className="flex flex-wrap border-t border-accent/10">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.1 }}
              className={`w-full md:w-1/3 flex flex-col ${ci < 2 ? `md:border-r ${colBorder}` : ""} border-b ${colBorder}`}
            >
              <div className={`flex-1 ${cellPad}`}>
                <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-6">{cat.title}</p>
                <div className="space-y-1">
                  {cat.tools.map((tool) => (
                    <button
                      key={tool.name}
                      type="button"
                      onClick={() => router.push("/onboarding")}
                      className="w-full flex items-center gap-3 px-0 py-3 border-b border-accent/10 last:border-0 group"
                    >
                      <tool.icon className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
                      <span className="text-sm text-foreground group-hover:text-accent transition-colors">
                        {tool.name}
                      </span>
                      <span className="ml-auto text-xs text-muted/40 group-hover:text-accent transition-colors">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Ingresá tu fecha de nacimiento →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
